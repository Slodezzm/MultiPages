////////////////////////////////////
/////////Socket 事件列表


const Logger = require("./logger.js")
const SocketMessageHandle = require("./socketmessage.js")
const RedisService = require("./dbc/RedisService.js");
const app = require("./application.js");
const ClientService = require("./clientservices.js");
const SocketService = require("./dbc/SocketService.js");
/**
 * Socket 事件处理器
 */
class SocketEvents extends Logger {
    constructor() {
        super()
        this.CLASS_NAME = "SocketEvents"
        /**事件列表：这里的值对应这该对象的方法名，只有在这里注册的方法才会被 Socket 监听 */
        this.EVENT_NAMES = [
            "connection", "message", "disconnect", "error"
        ]
        this.connection = this.connection.bind(this);
        this.message = this.message.bind(this)
        this.disconnect = this.disconnect.bind(this)
        this.error = this.error.bind(this)
    }
    /**连接事件 */
    async connection(socket) {
        const { channel, uid, roomid } = socket.handshake.query
        let user = await RedisService.findUserByUid(roomid, uid);
        if (user) {
            socket.channel = channel;
            socket.uid = uid;
            socket.roomid = roomid;
            socket.clientService = new ClientService(uid, channel, socket.id, user);
            
            // for(let sid of old_users){
            //     const socket_ = app.getSocket(sid);
            //     if(socket_){
            //       socket_.clientService.sendKickMessage();
            //     }
            // }
            const old_users = await SocketService.findSids(roomid, uid);
            if (old_users.length) {
                socket.clientService.sendKickMessage();
            }
            else {
                await socket.clientService.joinRoom(socket.roomid)
                this.logInfo(`连接成功 `)
            }
        }
        else {
            app.proxy(socket).sendSocketMessage({
                service: "error", body: "无效连接", status: 102
            })
            setTimeout(e => socket.disconnect(), 500);
        }
    }
    /**消息事件 */
    async message({ socket, data }) {
        SocketMessageHandle.handle({ socket, data: typeof (data) == "string" ? JSON.parse(data) : data })
    }
    /**断链事件 */
    async disconnect({ socket, data }) {
        this.logInfo("disconnect", socket.id, data)
        SocketMessageHandle.leave_room({ socket })
    }
    /**异常事件 */
    async error(error) {
        this.logError("error", error);
    }
}

module.exports = new SocketEvents();
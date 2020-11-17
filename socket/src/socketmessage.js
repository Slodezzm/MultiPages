

const Logger = require("./logger.js")
const Constants = require("./dbc/constants.js")
const Utils = require("./utils");
const app = require("./application.js");
const SocketService = require("./dbc/SocketService.js");

/**
 * Socket 消息服务处理器 
 */
class SocketMessageHandle extends Logger  {

    constructor() {
        super();
        this.CLASS_NAME = "SocketMessageHandle"
        this.SERVICE_NAMES = [
            Constants.DEFAULT_MESSAGE_SERVICE_NAME, "join_room", "leave_room"
        ]
    }

    async leave_room({socket, body }) {
        await socket.clientService && socket.clientService.leaveRoom && socket.clientService.leaveRoom()
    }

    async join_room({ socket, body: roomid }) {
        await socket.clientService.joinRoom(roomid)
    }

    /**
     * 默认的消息处理器
     */
    async [Constants.DEFAULT_MESSAGE_SERVICE_NAME]({ }) {

    }

    /**
     * 消息处理函数
     * @param [Object] opts
     * - Socket 连接对象
     * - data 请求数据
     */
    async handle({ socket, data }) {
        const binary = Buffer.isBuffer(data)
        const { service = Constants.DEFAULT_MESSAGE_SERVICE_NAME, headers = {}, body = {} } = binary ? Utils.buffer2Object(data) : data;
        this.logInfo("handle", { sid: socket.sid, binary, service, headers: socket.cs.headers, body })
        this[this.SERVICE_NAMES.includes(service) && this[service] ? service : Constants.DEFAULT_MESSAGE_SERVICE_NAME]({ binary, service, socket, headers, body })
    }
}

module.exports = new SocketMessageHandle();


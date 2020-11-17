
const Logger = require("./logger.js")
const _ = require("lodash")
const RedisService = require("./dbc/RedisService.js")
const Utils = require("./utils")
const config = require("./config")
const app = require("./application.js")
const Constants = require("./dbc/constants.js")
const SocketService = require("./dbc/SocketService.js")


class ClientService extends Logger {
    constructor(uid, channel, sid, user){
        super();
        this.CLASS_NAME = "ClientService"
        this.binary = config.socket.binary;
        this._current_data = {};
        this.headers = user;
        this.sid = sid;
        this.uid = uid;
        this.channel = channel;
        this.kick = false;
    }
    
    static get builed(){
        return {
            service: Constants.CLIENT_SERVICE_CODE.DEFAULT,
            headers: {
                send_time: Utils.NOW_TIME_STAMP
            },
            body: {},
            status: Constants.STATUS_CODE.OK
        }
    }

    set current_data(value){
        this._current_data = this.binary ? Utils.object2Buffer(value) : value
    }

    get current_data(){ return this._current_data }
    
    /**
     * 发送消息
     * @param {*} data 
     * @param {*} service 
     */
    sendMessage(data, service) {
        this.logInfo(service, this.uid, data)
        this.current_data = Utils.assign(ClientService.builed, {
            headers: this.headers,
            service,
            body: data
        })
        app.sendSocketMessage(this.current_data, this.sid);
    }

    /**
     * 发送房间消息
     * @param {*} data 
     * @param {*} service 
     */
    sendRoomMessage(data, service) {
        this.logInfo(service, this.sid, this.uid, this.roomid, data)
        this.current_data = Utils.assign(ClientService.builed, {
            headers: this.headers,
            service,
            body: data
        })
        app.sendRoomMessage(this.current_data, this.roomid)
    }

    async joinRoom(roomid){
        this.roomid = roomid;
        await SocketService.addUserRelation(this.channel, this.roomid, this.uid, this.sid)
        await app.joinRoom(this.sid, this.roomid);
        let users = await RedisService.findUserByRoomid(this.roomid);
        this.sendRoomMessage(users, Constants.CLIENT_SERVICE_CODE.JOIN_ROOM_OK);
    }

    async leaveRoom(roomid){
        this.roomid = roomid || this.roomid;
        await SocketService.removeUserRelation(this.sid)
        if(!this.kick) await RedisService.delUserByUid(this.roomid, this.uid, this.channel);
        await app.leaveRoom(this.sid, this.roomid || this.roomid)
        let users = await RedisService.findUserByRoomid(this.roomid);
        this.logInfo("leaveRoom", this.roomid, this.uid, this.sid)
        this.sendRoomMessage(users, Constants.CLIENT_SERVICE_CODE.EXIT_ROOM_OK);
    }

    async sendKickMessage(){
        this.kick = true;
        this.sendMessage("你已经在其他端的游戏房间里了，请立即回到该游戏房间开始游戏喔~", Constants.CLIENT_SERVICE_CODE.KICK)
        app.getSocket(this.sid).disconnect()
    }
}

module.exports = ClientService;
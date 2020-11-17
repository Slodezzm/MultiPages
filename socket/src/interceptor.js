
const Logger = require("./logger.js")
const RedisService = require("./dbc/RedisService.js");
const app = require("./application.js");
const ClientService = require("./clientservices.js");
const SocketService = require("./dbc/SocketService.js");

/**
 * 服务拦截器
 */
class Interceptor extends Logger {

  constructor() {
    super()
    this.CLASS_NAME = "Interceptor";
    this.socketAuthentication = this.socketAuthentication.bind(this)
  }

  /**
   * Socket 鉴权拦截器
   * @param {*} socket 
   * @param {*} next 
   */
  async socketAuthentication(socket, next) {
    try {
      // socket.handshake.query.uid = 22192
      const { channel, uid, roomid } = socket.handshake.query
      let user = await RedisService.findUserByUid(roomid, uid);
      const old_users = await SocketService.findSids(roomid, channel, uid);
      if(user && !old_users.length) {
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
        return next()
      }
    } catch (error) {
      this.logError("socketAuthentication", error)
    }
  }

}

module.exports = new Interceptor();

/*
业务逻辑
1、同一个用户在同一个房间内只能存在一个连接
2、

*/
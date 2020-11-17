
const app = require("./src/application.js")
const interceptor = require("./src/interceptor.js");
const socket_events = require("./src/socketevents.js");
const SocketService = require("./src/dbc/SocketService.js");
const ClientService = require("./src/clientservices.js");
const constants = require("./src/dbc/constants.js");
const config = require("./src/config");
const utils = require("./src/utils/index.js");
const RedisService = require("./src/dbc/RedisService.js");
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.setRedisSubscribe(["game_status", "counts_not_enough"], {
    async game_status(message) {
        let { roomId, gameId, status } = JSON.parse(message);
        let users = await RedisService.findUserByRoomid(roomId)
        let result = Object.assign(ClientService.builed, {
            headers: { roomId },
            service: status == "true" || status == "1" || status == true ? constants.CLIENT_SERVICE_CODE.GAME_START : constants.CLIENT_SERVICE_CODE.GAME_END,
            body: { gameId, users:users.reduce((o, u) => (o[u.uid] = u, o), {}) }
        })

        app.sendRoomMessage(config.socket.binary ? utils.object2Buffer(result) : result, roomId)
        // if(!status){
        //     const sids = await SocketService.findRoomidsBySid(roomId);
        //     for(let sid of sids){
        //         let socket = await app.getSocket(sid);
        //         if(socket){
        //             socket.disconnect()
        //         }
        //     }
        // }
    },

    async counts_not_enough(message){
        let { msg, uid, roomId } = JSON.parse(message);
        let result = Object.assign(ClientService.builed, {
            headers: { uid },
            service: constants.CLIENT_SERVICE_CODE.COUNTS_NOT_ENOUGH,
            body: msg
        })
        app.sendUserMessage(config.socket.binary ? utils.object2Buffer(result) : result, uid)
    }
})
// app.addSocketInterceptor(interceptor.socketAuthentication);
app.addEventListeners(socket_events.EVENT_NAMES, socket_events)
app.start({
    port: 8082, async before() {
        await SocketService.removeLocaHostKeys();
    }
});

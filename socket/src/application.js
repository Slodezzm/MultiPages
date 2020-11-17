const Koa = require("koa");
const SocketIO = require("koa-socket-2");
const Logger = require("./logger.js")
const redis = require("socket.io-redis");
const { pubRedis: pubClient, subRedis: subClient } = require("./dbc/redis")
const _ = require("lodash")
const Constants = require("./dbc/constants.js")
const Static = require('koa-static');
const SocketService = require("./dbc/SocketService.js");
const RedisService = require("./dbc/RedisService.js")

/**
 * 聊天服务应用
 */
class Application extends Logger {

    constructor() {
        super();
        this.CLASS_NAME = "Application";
        this.httpServer = new Koa();
        this.socketIO = new SocketIO();
        this.socketIO.attach(this.httpServer);
    }

    /**
     * 加入房间
     * @param {*} socketId Socket ID
     * @param {*} roomid 房间号
     */
    async joinRoom(socketId, roomid = Constants.DEFAULT_ROOMID) {
        if (this.hasSocket(socketId)) {
            this.getSocket(socketId).join(String(roomid));
        }
    }

    /**
     * 退出房间
     * @param {*} socketId Socket ID
     * @param {*} roomid 房间号
     */
    async leaveRoom(socketId, roomid = Constants.DEFAULT_ROOMID) {
        if (this.hasSocket(socketId)) {
            this.getSocket(socketId).leave(String(roomid));
        }
    }

    /**
     * 获取Socket
     * @param {*} socketId 
     */
    getSocket(socketId) {
        return this.socketIO.connections.get(socketId)
    }

    /**
     * 检查连接是否存在
     * @param {*} id Socket ID
     */
    hasSocket(id) {
        return this.socketIO.connections.has(id);
    }

    /**
     * Socket 消息代理
     * @param {*} socket 
     */
    proxy(socket) {
        return new class ProxyMessage {
            /**
             * 发送消息
             * @param {*} data 
             * @param {*} event 
             */
            sendSocketMessage(data, event = Constants.DEFAULT_EVENT) {
                socket && socket.emit(event, data);
            }
        }
    }

    /**
     * 向用户发送消息
     * @param {*} data 
     * @param {*} uid 如果 uid 查不到 sid 则作为 sid 使用
     * @param {*} event 
     */
    async sendUserMessage(data = {}, uid, event = Constants.DEFAULT_EVENT) {
        for(let sid of await SocketService.findSidsByUid(uid)){
            this.sendSocketMessage(data, sid, event);
        }
    }
    /**
     * 向单独某个 Socket 连接发送消息
     * @param {*} data 要发送的数据对象
     * @param {*} socketId Socket ID
     * @param {*} event 事件名
     */
    sendSocketMessage(data = {}, socketId, event = Constants.DEFAULT_EVENT) {
        if (this.hasSocket(socketId)) {
            this.getSocket(socketId).emit(event, data);
        }
    }

    /**
     * 向某个房间内发送广播消息
     * @param {*} data 要发送的数据对象
     * @param {*} roomid 房间 ID
     * @param {*} event 事件名
     * @description 事件只会广播到已加入给定的客户端room
     */
    async sendRoomMessage(data = {}, roomid = Constants.DEFAULT_ROOMID, event = Constants.DEFAULT_EVENT) {
        this.logInfo("sendRoomMessage", roomid, data)
        this.socketIO.to(String(roomid)).emit(event, data);
    }

    /**
     * 向所有连接发送广播消息
     * @param {*} data 要发送的数据对象
     * @param {*} event 事件名
     */
    sendBroadcast(data = {}, event = Constants.DEFAULT_EVENT) {
        this.socketIO.broadcast(event, data)
    }

    /**
     * 添加请求数据类型解析器
     * @param {*} parser 
     */
    addHttpBodyParser(parser) {
        this.httpServer.use(parser);
        return this;
    }

    /**
     * 设置 HTTP 接口路由
     * @param {*} router 
     */
    setHttpRouter(router) {
        this.httpServer.use(router.routes())
        this.httpServer.use(router.allowedMethods())
        return this;
    }

    /**
     * 设置静态文件地址
     * @param {*} path 
     */
    setHttpStatic(path) {
        this.httpServer.use(Static(path))
        return this;
    }

    /**
     * 添加 HTTP 请求拦截器
     * @param {*} interceptor 
     */
    addHttpInterceptor(interceptor = this.logInfo) {
        this.httpServer.use(interceptor)
        return this;
    }

    /**
     * 添加 Socket 消息拦截器
     * @param {Interceptor} interceptor 
     */
    addSocketInterceptor(interceptor = this.logInfo) {
        this.httpServer.io.socket.use(interceptor);
        return this;
    }

    /**
     * 添加 Redis 事件
     * @param {*} events 事件列表
     * @param {*} handles 处理对象
     */
    setRedisSubscribe(events = [], handles = {}) {
        if (events.length > 0) {
            // eslint-disable-next-line prefer-spread
            subClient.subscribe.apply(subClient, events);
            subClient.on("message", async (channel, message) => {
                let redis_lock = await RedisService.redisClient.set(`${channel}${message}`, 1, 'ex', 1, 'nx')
                this.logInfo("redis subscribe", { redis_lock, channel, message })
                if(redis_lock && handles[channel] && handles[channel] instanceof Function){
                    handles[channel](message)
                }
            });
        }
        this.socketIO.adapter(redis({ pubClient, subClient, requestsTimeout: 15000 }));
        /**
         * ```js
            broadcast
            clients
            clientRooms
            allRooms
            remoteJoin
            remoteLeave
            remoteDisconnect
            customRequest
            ```
         */
        this.adapter = this.socketIO.socket.sockets.adapter;
        this.adapter.on("error", e => this.logError(e))
        return this;
    }

    /**
     * 添加 Socket 事件
     * @param {*} events 事件列表
     * @param {*} handles 处理对象
     */
    addEventListeners(events = [], handles = {}) {
        for (let even_name of events) {
            if (handles[even_name] && handles[even_name] instanceof Function) {
                this.socketIO.on(even_name, handles[even_name]);
            }
        }
        return this;
    }

    /**
     * 启动服务
     * @param [Object] opts
     * - { Number } prot 监听端口号
     * - { Function } before 启动前执行
     * - { Function } after 启动后执行
     */
    async start({ port = 8080, before = async e => this.logInfo("Before startup"), after = async e => this.logInfo("after startup") }) {
        await before();
        this.httpServer.listen(process.env.NODE_PORT || port, async () => {
            this.logInfo(`server start on ${process.env.NODE_PORT || port}`);
            await after();
        });
        return this;
    }
}

module.exports = new Application();


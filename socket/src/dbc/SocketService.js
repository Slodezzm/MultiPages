
const Loggin = require("../logger.js")
const { client: redisClient } = require("./redis.js")
const HOST_NAME = require("os").hostname()
/**
 * Socket 服务，为服务集群做数据同步
 * 每个服务器进程都可以通过这个服务获取的所有的连接数据
 * 比如：
 * 某个用户所加入的房间号
 * 某个房间内的所有用户
 */
class SocketService extends Loggin {
    constructor(){
        super()
        this.CLASS_NAME = "SocketService"
        /**Redis Key */
        this.REDIS_SOCKET_SERVICE_KEY = "socket_service"
        /**获取主机名的正则 */
        this.HOSTNAME_REGEXP = /(?<=:H)[^:]+/g
        /**获取进程号的正则 */
        this.PROCESS_REGEXP = /(?<=:P)[^:]+/g
        /**获取渠道号的正则 */
        this.CHANNEL_REGEXP = /(?<=:C)[^:]+/g
        /**获取房间号的正则 */
        this.ROOM_ID_REGEXP = /(?<=:R)[^:]+/g
        /**获取用户 ID 的正则 */
        this.UID_REGEXP = /(?<=:U)[^:]+/g
        /**获取 Socket 连接 ID 的正则 */
        this.SID_REGEXP = /(?<=:S)[^:]+/g

        this.X = "XXX";
        this.U = /(?<=U)\*/;
        this.R = /(?<=R)\*/;
        this.C = /(?<=C)\*/;
        this.S = /(?<=S)\*/;
        this.P = /(?<=P)\*/;
        this.H = /(?<=H)\*/;

        this.HOST_PROCESS = `H${HOST_NAME}:P${process.pid}`;

        this.ALL_KEY = `${this.REDIS_SOCKET_SERVICE_KEY}:H*:P*:C*:R*:U*:S*`
        this.HOST_KEY = `${this.REDIS_SOCKET_SERVICE_KEY}:H${this.X}:P*:C*:R*:U*:S*`
        this.PROCESS_KEY = `${this.REDIS_SOCKET_SERVICE_KEY}:H*:P${this.X}:C*:R*:U*:S*`
        this.SID_KEY = `${this.REDIS_SOCKET_SERVICE_KEY}:H*:P*:C*:R*:U*:S${this.X}`;
        this.UID_KEY = `${this.REDIS_SOCKET_SERVICE_KEY}:H*:P*:C*:R*:U${this.X}:S*`;
        this.ROOM_ID_KEY = `${this.REDIS_SOCKET_SERVICE_KEY}:H*:P*:C*:R${this.X}:U*:S*`;
        this.CHANNEL_KEY = `${this.REDIS_SOCKET_SERVICE_KEY}:H*:P*:C${this.X}:R*:U*:S*`;
    }
    /**
     * 添加客户端关系
     * @param {*} channel 
     * @param {*} roomid 
     * @param {*} uid 
     * @param {*} sid 
     */
    async addUserRelation(channel, roomid, uid, sid){
        const key = `${this.REDIS_SOCKET_SERVICE_KEY}:${this.HOST_PROCESS}:C${channel}:R${roomid}:U${uid}:S${sid}`;
        await redisClient.set(key, sid);
    }

    /**
     * 移除客户端关系
     * @param {*} sid 
     */
    async removeUserRelation(sid){
        const keys = await redisClient.keys(this.SID_KEY.replace(this.X, sid))
        for(let key of keys){
            await redisClient.del(key);
        }
    }

    /**
     * 获取 ID 
     * @param {*} keyPattern Redis Key *:C*:R*:U*:S*
     * @param {*} regExp 对应资源的正则
     */
    async findIds(keyPattern, regExp){
        // const results = new Set();
        const keys = await redisClient.keys(keyPattern)
        this.logInfo("findIds", keyPattern, keys)
        // for(let key of keys){
        //     const id = this.matchId(key, regExp)
        //     if(id){
        //         results.add(id);
        //     }
        // }
        return this.matchIds(keys, regExp);
    }

    /**
     * 在 Keys 中获取 ID列表
     * @param {*} keys 
     * @param {*} keyPattern 
     * @param {*} regExp 
     */
    findIdsByKeys(keys, keyPattern, id, regExp){
        const keyList = keys.filter(key => new RegExp(keyPattern.replace(this.X, id).replace(/\*/g, ".*")).test(key))
        return this.matchIds(keyList, regExp);
    }

    /**
     * 从 Key 中获取指定的 ID
     * @param {*} key 
     * @param {*} regExp 
     */
    matchId(key, regExp){
        return String(key).match(regExp).pop();
    }
    /**
     * 从 Key 中获取指定的 ID
     * @param {*} keys 
     * @param {*} regExp 
     */
    matchIds(keys, regExp){
        return [... new Set(keys.map(key => this.matchId(key, regExp)))];
    }

    /**
     * 根据房间ID获取所有的 Sid
     * @param {*} roomid 
     */
    async findSidsByRoomid(roomid){
        const results = await this.findIds(this.ROOM_ID_KEY.replace(this.X, roomid), this.SID_REGEXP);
        return results || [];
    }

    /**
     * 根据房间ID获取所有的 Uid
     * @param {*} roomid 
     */
    async findUidsByRoomid(roomid){
        const results = await this.findIds(this.ROOM_ID_KEY.replace(this.X, roomid), this.UID_REGEXP);
        return results || [];
    }

    /**
     * 根据 UID 获取房间ID
     * @param {*} uid 
     */
    async findRoomidsByUid(uid){
        const results = await this.findIds(this.UID_KEY.replace(this.X, uid), this.ROOM_ID_REGEXP);
        return results || [];
    }
    /**
     * 根据 SID 获取房间ID
     * @param {*} uid 
     */
    async findRoomidsBySid(sid){
        const results = await this.findIds(this.SID_KEY.replace(this.X, sid), this.ROOM_ID_REGEXP);
        return results || [];
    }

    /**
     * 根据 UID 获取 SID
     * @param {*} uid 
     */
    async findSidsByUid(uid){
        const results = await this.findIds(this.UID_KEY.replace(this.X, uid), this.SID_REGEXP);
        return results || [];
    }

    
    /**
     * 获取所有的 ROOMID
     */
    async findAllRoomid(){
        const results = await this.findIds(this.ALL_KEY, this.ROOM_ID_REGEXP);
        return results || [];
    }
    
    /**
     * 获取所有的 channel
     */
    async findAllChannel(){
        const results = await this.findIds(this.ALL_KEY, this.CHANNEL_REGEXP);
        return results || [];
    }

    /**获取所有的Sid */
    async findAllSids(){
        const results = await this.findIds(this.ALL_KEY, this.SID_REGEXP);
        return results || [];
    }

    /**
     * 根据 channel 获取 ROOMID
     * @param {*} channel 
     */
    async findRoomidsByChannel(channel){
        const results = await this.findIds(this.CHANNEL_KEY.replace(this.X, channel), this.ROOM_ID_REGEXP);
        return results || [];
    }

    /**
     * 
     * @param {*} roomid 
     * @param {*} channel 
     * @param {*} uid 
     */
    async findSids(roomid, uid){
        return await this.findIds(this.ROOM_ID_KEY.replace(this.X, roomid).replace(this.U, uid), this.SID_REGEXP)
    }

    /**
     * 获取所有的 Keys
     */
    async findAllKeys(){
        const results = await redisClient.keys(this.ALL_KEY);
        return results || [];
    }

    /**
     * 生成 Socket 关系树
     */
    async findSocketTree(){
        let keyList = await this.findAllKeys();
        let hosts = this.matchIds(keyList, this.HOSTNAME_REGEXP);
        let matchKeys = (keys = [], h, p, c, r, u) => {
            return keys.filter(key => new RegExp(this.ALL_KEY
                    .replace(h ? `H*` : "NULL", `H${h}`)
                    .replace(p ? `P*` : "NULL", `P${p}`)
                    .replace(c ? `C*` : "NULL", `C${c}`)
                    .replace(r ? `R*` : "NULL", `R${r}`)
                    .replace(u ? `U*` : "NULL", `U${u}`)
                    .replace(/\*/g, ".*")
                ).test(key)
            )
        }
        return hosts.map(host => {
            return { [host]: this.matchIds(matchKeys(keyList, host), this.PROCESS_REGEXP).map(pid => {
                return { [pid]: this.matchIds(matchKeys(keyList, host, pid), this.CHANNEL_REGEXP).map(channel => {
                    return { [channel]: this.matchIds(matchKeys(keyList, host, pid, channel), this.ROOM_ID_REGEXP).map(roomid => {
                        return { [roomid]: this.matchIds(matchKeys(keyList, host, pid, channel, roomid), this.UID_REGEXP).map(uid => {
                            return { [uid]: this.matchIds(matchKeys(keyList, host, pid, channel, roomid, uid), this.SID_REGEXP) }
                        })
                    }})
                }})}
            })}
        })
    }
    /**
     * 搜索在线的连接
     * @param {*} keyword 关键字
     * @param {*} pageNo 页码
     * @param {*} pageSize 页数 -1 查全部
     */
    async findSocketTable(keyword = "", pageNo = 1, pageSize = -1){
        let keyList = await this.findAllKeys();
        const totalEntries = keyList.length;
        const totalPageSize = pageSize > 0 ? Math.ceil(totalEntries / pageSize) : 1;
        const startNo = pageSize !== -1 ? (pageNo - 1) * pageSize : 0;
        const endNo = totalPageSize > pageNo ? startNo + pageSize : -1;
        const results = keyList.filter(key => key.includes(keyword)).slice(startNo, endNo);
        return {
            /**当前页码 */
            pageNo,
            /**当前每一页条目数 */
            pageSize,
            /**下一页页码 */
            nextPage: totalPageSize > pageNo ? pageNo + 1 : pageNo,
            /**总页数 */
            totalPageSize,
            /**总条目数 */
            totalEntries,
            /**查询结果 */
            results: results.map(key => {
                let [_, host, pid, channel, roomid, uid, sid] = key.split(":").map(key => key.substr(1));
                return {
                    host, pid, channel, roomid, uid, sid
                }
            })
        }
    }

    /**
     * 移除本机电脑的缓存
     */
    async removeLocaHostKeys(){
        const keys = await redisClient.keys(this.HOST_KEY.replace(this.X, HOST_NAME))
        for(let key of keys){
            await redisClient.del(key);
        }
    }

}


module.exports = new SocketService();

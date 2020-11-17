const Logger = require("../logger.js")
const { client: redisClient } = require("./redis.js")
const Constants = require("./constants.js")

class RedisService extends Logger {
    constructor() {
        super();
        this.CLASS_NAME = "RedisService"
    }

    get redisClient(){ return redisClient; }

    /**获取管道 */
    get pipeline(){ return redisClient.pipeline() }

    async delKey(key){
        await redisClient.del(key)
    }

    async delHashValue(key, name){
        await redisClient.hdel(String(key), String(name));
    }

    /**
     * 获取原生值
     * @param {*} key 
     */
    async getValue(key){
        return await redisClient.get(String(key));
    }
    /**
     * 保存原生值
     * @param {*} key 
     * @param {*} value 
     */
    async setValue(key, value){
        await redisClient.set(String(key), value)
    }

    async setHashValue(key, name, value){
        await redisClient.hset(String(key), String(name), value);
    }

    async getHashValue(key, name){
        return await redisClient.hget(String(key), String(name));
    }

    async getHashKeyAll(key){
        return await redisClient.hkeys(String(key));
    }

    async getHashValAll(key){
        return await redisClient.hvals(String(key));
    }

    async getHashAll(key){
        return await redisClient.hgetall(String(key));
    }

    /**
     * 查询原生对象
     * @param {*} key 
     */
    async getObject(key) {
        const result = await this.getValue(key);
        return result ? JSON.parse(result) : null;
    }

    /**
     * 保存原生对象
     * @param {*} key 
     * @param {*} value 
     */
    async setObject(key, value) {
        await this.setValue(key, JSON.stringify(value))
        return value;
    }

    /**
     * 获取原生列表
     * @param  {...any} args redis.lrange 原生方法参数 
     */
    async getObjectList(...args) {
        const results = await redisClient.lrange.apply(redisClient, args);
        return results && results.map(item => JSON.parse(item));
    }

    /**
     * 根据 Index 获取元素
     * @param {*} key 
     * @param {*} index 
     */
    async getObjectListItem(key, index){
        const result = await redisClient.lindex(key, index);
        return JSON.parse(result || "{}")
    }

    /**
     * 根据 Index 设置元素
     * @param {*} key 
     * @param {*} index 
     * @param {*} value 
     */
    async setObjectListItem(key, index, value){
        await redisClient.lset(key, index, JSON.stringify(value || {}));
    }

    /**
     * 移除列表中指定位置的值
     * @param {*} key 
     * @param {*} index 
     */
    async removeObjectListItem(key, index){
        await this.setObjectListItem(key, index, {});
        await redisClient.lrem(key, 0, "{}");
    }

    /**
     * 保存列表记录
     * @param {*} key 
     * @param {*} data 消息内容
     * @param {*} history_limit 保存的条目数
     */
    async saveObjectList(key, data, history_limit = -1) {
        await redisClient.lpush(key, JSON.stringify(data))
        const totalEntries = await redisClient.llen(key);
        if (history_limit != -1 && totalEntries > history_limit) {
            const pipe = redisClient.pipeline();
            for (let i = 0; i < totalEntries - history_limit; i++) pipe.rpop(key)
            await pipe.exec();
        }
    }

    /**
     * 获取列表记录
     * @param {*} key 
     * @param {*} pageNo 页码
     * @param {*} pageSize 每页条目数 -1 代表查询全部
     */
    async findObjectList(key, pageNo = Constants.DEFAULT_PAGE_NO, pageSize = Constants.DEFAULT_PAGE_SIZE) {
        const totalEntries = await redisClient.llen(key) || 0;
        const totalPageSize = pageSize > 0 ? Math.ceil(totalEntries / pageSize) : 1;
        const startNo = pageSize !== -1 ? (pageNo - 1) * pageSize : 0;
        const endNo = totalPageSize > pageNo ? startNo + pageSize : -1;
        const results = await this.getObjectList(key, startNo, endNo) || [];
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
            results
        }
    }
    /**
     * 根据 Uid 获取用户数据
     * @param {*} roomid 
     * @param {*} uid 
     */
    async findUserByUid(roomid, uid){
        let user = await this.getObject(`mid_autumn_${roomid}_${uid}`);
        this.logInfo("findUserByUid", `mid_autumn_${roomid}_${uid}`, user)
        return user ? user.userInfo : null
    }
    
    /**
     * 
     * @param {*} roomid 
     */
    async findUserByRoomid(roomid){
        this.logInfo("findUserByRoomid", roomid)
        let keys = await this.redisClient.keys(`mid_autumn_${roomid}_*`)
        let users = [];
        for(let key of keys){
            let user = await this.getObject(key)
            users.push(user.userInfo)
        }
        this.logInfo("findUserByRoomid", keys, users)
        return users;
    }

    async delUserByUid(roomid, uid, channel){
        await this.delKey(`mid_autumn_${roomid}_${uid}`);
        await this.delKey(`device_${uid}_${channel}`)
    }
}


module.exports = new RedisService();


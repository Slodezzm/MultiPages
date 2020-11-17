/**
 * 常量对象
 */
module.exports = Object.freeze({
    /**默认的房间号 */
    DEFAULT_ROOMID: "default", 
    /**默认的消息ID */
    DEFAULT_EVENT: "message", 
    /**默认的消息服务处理器 */
    DEFAULT_MESSAGE_SERVICE_NAME: "default",
    /**默认的编码格式 */
    DEFAULT_CODEDING: "utf-8",
    /**默认的消息间隙控制ID  */
    DEFAULT_FREQUENCYCONTROL_ID: "all",
    /**默认的消息间隙控制类型 */
    DEFAULT_FREQUENCYCONTROL_TYPE: "SendMsg",
    /**默认的时间格式 */
    DEFAULT_TIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
    /**默认的页码 */
    DEFAULT_PAGE_NO: 1,
    /**默认的每页条目数 */
    DEFAULT_PAGE_SIZE: 10,
    /**默认的关键字过滤器ID */
    DEFAULT_BANNEDWORD_FILTER_ID:"system",
    /**默认的消息频道 */
    DEFAULT_SOCKET_CHANNEL:"default",
    /**一秒钟 */
    ONE_SECOND: 1000,
    /**一分钟 */
    ONE_MINUTE: 1000 * 60,
    /**一小时 */
    AN_HOUR: 1000 * 60 * 60,
    /**一天 */
    ONE_DAY: 1000 * 60 * 60 * 24,
    /**一星期 */
    A_WEEK: 1000 * 60 * 60 * 24 * 7,
    /**一个月 */
    ONE_MONTH: 1000 * 60 * 60 * 24 * 30,
    /**半个月 */
    HALF_A_MONTH: 1000 * 60 * 60 * 24 * 15, 
    STATUS_CODE:{
        /**一切顺利 */
        OK: 100,
        /**无效 UID */
        INVALID_UID: 101,
    },
    CLIENT_SERVICE_CODE: {
        /**默认值 */
        DEFAULT: "default_service",
        /**加入房间成功 */
        JOIN_ROOM_OK: "join_room_ok",
        /**加入房间 */
        JOIN_ROOM: "join_room",
        /**退出房间 */
        EXIT_ROOM_OK:"exit_room_ok",
        /**游戏开始 */
        GAME_START:"game_start",
        /**游戏结束 */
        GAME_END:"game_end",
        COUNTS_NOT_ENOUGH:"counts_not_enough",
        /**在其他客户端登录，踢出房间 */
        KICK:"kick"
    }
})


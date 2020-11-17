
const Logger = require("../logger.js")
const zlib = require("zlib")
const moment = require("moment")
const Constants = require("../dbc/constants.js")
const _ = require('lodash');
const fetch = require('node-fetch');
const qs = require('querystring');
const XOREncrypt = require("./XOREncrypt.js")
const { xor_encrypt_key = "xor_encrypt_key" } = require("../config")

const xorencrypt = new XOREncrypt(xor_encrypt_key)
class Utils extends Logger {
    constructor() {
        super()
        this.CLASS_NAME = "Utils"
    }
    /**XOR 加密 */
    get XOREncrypt(){ return xorencrypt; }
    /**默认格式的时间字符串 */
    get DEFAULT_FORMAT_TIME(){ return moment(this.NOW_TIME_STAMP).format(Constants.DEFAULT_TIME_FORMAT) }
    /**获取当前时间戳 */
    get NOW_TIME_STAMP(){ return Date.now(); }

    /**
     * 异或算法加密
     * @param {*} str 
     */
    encodeXOR(str = ""){
        return Buffer.from(this.XOREncrypt.encodeXOR(str)).toString("base64");
    }
    /**
     * 异或算法解密
     * @param {*} str 
     */
    decodeXOR(str = ""){
        return this.XOREncrypt.encodeXOR(Buffer.from(str, "base64").toString());
    }

    async HTTPPost(url, data = {}, json = true){
        return fetch(url += (url.includes("?")?"&":"?") + qs.stringify({t: Date.now()}), {
            method:"POST",
            headers:{
                "Content-Type":"application/json;charset=UTF-8"
            },
            body:JSON.stringify(data)
        }).then(e => json ? e.json() : e.text());
    }

    async HTTPGet(url, data = {}, json = true){
        return fetch(url += (url.includes("?")?"&":"?") + qs.stringify({t: Date.now(), ...data}) ).then(e =>  json ? e.json() : e.text());
    }

    /**
     * 对象转 Buffer 二进制
     * @param {*} data 
     */
    object2Buffer(data, codeding = Constants.DEFAULT_CODEDING) {
        if (data) {
            let str = JSON.stringify(typeof(data) == "object" ? data : { data })
            return zlib.gzipSync(Buffer.from(encodeURIComponent(str), codeding));
        }
        else return data;
    }

    /**
     * Buffer 转 Object
     * @param {*} buffer 
     */
    buffer2Object(buffer, codeding = Constants.DEFAULT_CODEDING) {
        if (buffer && Buffer.isBuffer(buffer)) {
            const dataStr = zlib.gunzipSync(buffer).toString(codeding);
            try {
                return JSON.parse(decodeURIComponent(dataStr));
            } catch (error) {
                return dataStr;
            }
        }
        else return buffer;
    }

    dateIsBefore(time){
        return Date.now() < new Date(time).getTime();
    }

    dateIsBetween(start, end){
        const time = Date.now();
        return new Date(start).getTime() <= time && time <= new Date(end).getTime();
    }

    /**
     * 将选中的 Key 重新生成一个新对象返回
     * @param {*} obj 
     * @param {*} keys 
     */
    pickObject(obj = {}, keys = []){
        return keys.reduce((nowObj, k) => {
            if(typeof(obj[k]) != "undefined") {
                nowObj[k] = obj[k];
            }
            return nowObj;
        }, {})
    }

    assign(target, ...src){
        return _.merge.apply(_, [target, ...src]);
    }
    /**
     * 延时函数，等待 s 秒
     * @param {*} s 
     */
    async wait(s = 0){
        await new Promise(r => setTimeout(r, s));
    }
    /**
     * 随机数
     * @param {*} min 
     * @param {*} max 
     */
    randomInt(min = 1, max = 10){
        return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * 随机字符串
     * @param {*} length 
     */
    randomStr(length){

    }
}

module.exports = new Utils();




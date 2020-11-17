class XOREncrypt {
    constructor(key = ""){
        this.key = key;
        this.length = 0;
    }

    get keyChar(){
        if(this.length >= this.key.length) this.length = 0;
        return this.key.charCodeAt(this.length++);
    }

    /**
     * 异或算法加密
     * @param {*} str 
     */
    encodeXOR(str = ""){
        this.length = 0;
        let result = "";
        for(let i = 0, l = str.length; i < l; i++){
            result += String.fromCharCode(this.keyChar ^ str.charCodeAt(i));
        }
        return result;
    }
    /**
     * 异或算法解密
     * @param {*} str 
     */
    decodeXOR(str = ""){
        return this.encodeXOR(str);
    }

}


module.exports = XOREncrypt;
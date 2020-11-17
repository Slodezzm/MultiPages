import io from "socket.io"

function loadScript(path) {
    return new Promise((resolve, reject) => {
        try {
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.src = path
            script.onload = e => {
                script.remove();
                resolve()
            }
            document.head.appendChild(script);
        } catch (error) {
            console.error(path, error)
            reject();
        }
    })
}
function loadGzip() { return loadScript("https://cdn.staticfile.org/pako/1.0.10/pako.min.js") }

export default class SocketClient {
    constructor() {
        this.data = { service: "", body: {}, headers: {} };
        this.handles = {};
        this.binary = false;
    }
    connection(opts) {
        var that = this
        var addr = opts.addr
        var urlObj = Object.assign(opts.urlObj || {}, { timeout: 1500, reconnectionDelayMax: 2000, randomizationFactor: 0.2, reconnectionAttempts: 1000, transports: ['websocket'] })
        var uid = opts.uid
        var connection = opts.connection
        var disconnect = opts.disconnect
        var reconnecting = opts.reconnecting
        function handle(data) {
            var service = that.handles[data.service]
            var headers = data.headers || {}
            var body = data.body
            var status = data.status
            if (service) {
                try {
                    service.call(Object.assign(that.handles, {
                        uid, socket: that
                    }), { me: that.uid == headers.id, service: data.service, headers, body, status })
                } catch (error) {
                    console.error(error)
                }
            }
        }
        that.uid = uid
        that.disconnect();
        // console.log(urlObj)
        that.io = new io(addr, urlObj)
        that.io.on("reconnecting", function (content) {
            reconnecting && reconnecting.call && reconnecting()
        })
        that.io.on("message", async function (content) {
            console.log("content", content)
            if (that.binary = (content instanceof ArrayBuffer)) {
                if (typeof (pako) == "undefined") {
                    await loadGzip()
                }
                new Response(pako.ungzip(content)).text().then(text => JSON.parse(decodeURIComponent(text))).then(handle)
            }
            else handle(content)
        })
        that.io.on("connect", function () {
            console.log(addr, ":", "连接成功")
            connection && connection.call && connection()
        })
        // that.io.on("connection", function () {
        //     console.log(addr, ":", "连接成功")
        //     connection && connection.call && connection()
        // })
        that.io.on("disconnect", function () {
            console.log(addr, ":", "断开连接")
            disconnect && disconnect.call && disconnect()
        })
        that.io.on("error", function (error) { console.error("Socket Error", error) })
    }

    async sendMessage(data) {
        try {
            if (this.binary) {
                if (typeof (pako) == "undefined") {
                    await loadGzip()
                }
                new Response(pako.gzip(encodeURIComponent(JSON.stringify(data || {})))).blob().then((value) => {
                    this.io.emit("message", value)
                })
            }
            else this.io.emit("message", data || {})
        } catch (error) {
            console.error(error)
        }
    }
    disconnect() {
        if (this.io) {
            this.io.off("message")
            this.io.off("connection")
            this.io.off("disconnect")
            this.io.off("error")
            this.io.off("reconnecting")
            this.io.disconnect()
            this.io = null
        }
    }
    joinRoom(roomid) {
        var data = Object.assign(this.data, { service: "join_room", body: roomid })
        this.sendMessage(data)
    }

    sendText(msg) {
        var data = Object.assign(this.data, { service: "send_text", body: msg })
        this.sendMessage(data)
    }

    sendGift(token) {
        var data = Object.assign(this.data, { service: "send_gift", body: token })
        this.sendMessage(data)
    }

    sendBarrage(msg) {
        var data = Object.assign(this.data, { service: "send_barrage", body: msg })
        this.sendMessage(data)
    }

    sendOtherService(service, body) {
        var data = Object.assign(this.data, { service, body })
        this.sendMessage(data)
    }
    /**注册客户端服务列表 */
    registerHandles(handles) {
        // console.log(handles)
        handles = handles || {};
        for (let name in handles) {
            this.handles[name] = handles[name]
        }
        return this
    }
}
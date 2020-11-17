/* eslint-disable no-duplicate-case */
/* eslint-disable eol-last */
/* eslint-disable space-unary-ops */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable eqeqeq */
/* eslint-disable no-tabs */
// util 公共对象函数
import config from './config'
import axios from 'axios'
import qs from 'qs'
import loading from './loading'
import store from '../PC/bobing/store'
class util {
    // 初始化对象
    constructor() {
        this.win = window.top
        this.UA = navigator.userAgent
        this.isPC = this.UA.indexOf('Windows NT') > -1
        this.isAndroid = this.UA.indexOf('Android') > -1
        this.isIos = this.UA.indexOf('Mac OS X') > -1
        this.isIphone = this.UA.indexOf('iPhone') > -1
        this.isIpad = this.UA.indexOf('iPad;') > -1
        this.isIE7 = this.UA.indexOf('MSIE 7.0;') > -1
        this.isIE8 = this.UA.indexOf('MSIE 8.0;') > -1
        this.isIE9 = this.UA.indexOf('MSIE 9.0;') > -1
        this.isIE10 = this.UA.indexOf('MSIE 10.0;') > -1
        this.isIE11 = this.UA.indexOf('Trident') > -1
        this.IsWeiXin = this.UA.indexOf('MicroMessenger') > -1
    };

    /*
     * method: get | post
     * url
     * data
     * nohideloading
     * complete
     * success
     * error
     * headers
     * goingError
     * timeout
     * isGoingLogin
     */
    ajax(json = {}) {
        this.showLoading()
        let url = null
        // 增加时间戳参数
        if (json.url.indexOf('?') != -1) {
            url = json.url + '&_=' + new Date().getTime()
        } else {
            url = json.url + '?_=' + new Date().getTime()
        };
        let useToken = this.getCookie('AJ1sOD_token')
        
        // 显示登录弹窗
        let isLogin = json.isLogin || false
        if(!useToken && isLogin){
            this.toLogin()
        }
        if (json.method) json.method = json.method.toUpperCase()
        return new Promise((resolve, reject) => {
            axios({
                method: json.method || 'POST',
                params: json.method == 'GET' ? json.data : '',
                data: json.method != 'GET' ? qs.stringify(json.data) : '',
                url: url,
                timeout: json.timeout || 15000,
                headers: Object.assign({
                    token: useToken || '',
                    lan: 'zh'
                }, json.headers),
                responseType: 'json'
                // 'Content-Type': 'multipart/form-data'
            }).then((response) => {
                if (!json.nohideloading) {
                    this.hideLoading()
                };
                this.success(response, json, resolve)
            }).catch((error) => {
                if (!json.nohideloading) {
                    this.hideLoading()
                };
                this.error(error, json, reject)
            })
        })
    }

    ajax2(json = {}) {
        this.showLoading()
        let url = null
        // 增加时间戳参数
        if (json.url.indexOf('?') != -1) {
            url = json.url + '&_=' + new Date().getTime()
        } else {
            url = json.url + '?_=' + new Date().getTime()
        };
        let useToken = this.getStorage('local', 'userInfo')
        useToken = useToken ? JSON.parse(useToken) : {}
        if (json.method) json.method = json.method.toUpperCase()
        return new Promise((resolve, reject) => {
            axios({
                method: json.method || 'POST',
                params: json.method == 'GET' ? json.data : '',
                data: json.method != 'GET' ? json.data : '',
                url: url,
                timeout: json.timeout || 15000,
                headers: Object.assign({
                    aId: useToken.aId || '',
                    token: useToken.token || '',
                    lan: 'zh',
                    contentType: false
                }, json.headers),
                responseType: 'json'
            }).then((response) => {
                if (!json.nohideloading) {
                    this.hideLoading()
                };
                this.success(response, json, resolve)
            }).catch((error) => {
                if (!json.nohideloading) {
                    this.hideLoading()
                };
                this.error(error, json, reject)
            })
        })
    }

    success(response, json, resolve) {
        // 判断code 并处理
        // console.log(response)
        const data = response.data
        var dataCode = parseInt(data.status) || parseInt(response.status) || parseInt(data.ret) || parseInt(data.error)
        // console.log(data)
        // console.log(dataCode)
        if (!json.isGoingLogin && dataCode == -9000) {
            // 判断app或者web
            location.href = config.loginUrl
        } else {
            if (json.done) {
                resolve(response.data)
                json.done(response.data)
                return
            }
            switch (dataCode) {
                case 200:
                    resolve(response.data)
                    json.success && json.success(response.data)
                    break
                case 201:
                    resolve(response.data)
                    json.success && json.success(response.data)
                    break
                case 0:
                    resolve(response.data)
                    json.success && json.success(response.data)
                    break
                case 1:
                    resolve(response.data)
                    json.success && json.success(response.data)
                    break
                    // eslint-disable-next-line no-duplicate-case
                    // case 201:
                    //     removeStorage('local', 'userInfo')
                    //     location.href = config.loginUrl
                    //     break
                default:
                    if (json.goingError) {
                        // 走error回调
                        json.error && json.error(data)
                    } else {
                        // 直接弹出错误信息
                        // popup.alert({ type: 'msg', title: data.msg })
                    };
            }
        };
    }

    error(error, json, reject) {
        this.hideLoading()
        if (json.goingError) {
            json.goingError()
            return
        }

        switch (XMLHttpRequest.status) {
            case 401:
                if (window.location.href.indexOf(config.loginUrl) == -1) {
                    sessionStorage.setItem('weixin-url', window.location.href) // 记录没有登录前的访问页面
                    window.location.href = config.loginUrl
                } else {
                    //   popup.alert({ type: 'msg', title: '你需要登录哦' })
                };
                break
            case 400:
                // popup.alert({ type: 'msg', title: '您的请求不合法呢' })
                break
            case 404:
                // popup.alert({ type: 'msg', title: '访问的地址可能不存在哦' })
                break
            case 500:
            case 502:
                // popup.alert({ type: 'msg', title: '服务器内部错误' })
                break
            default:
                reject({})
                console.log(error)
                // popup.alert({type:'msg',title:"未知错误。程序员欧巴正在赶来修改哦"});
        }
    }

    goBack() {
        window.history.go(-1)
    }

    // showLoading
    showLoading() {
        window.Little.Loading.showLoading()
        store.commit('setState',{Loading:false})
        // document.getElementById('loading').style.display = 'block'
    }

    // hideLoading
    hideLoading() {
        window.Little.Loading.closeLoading()
        store.commit('setState',{Loading:true})
        // document.getElementById('loading').style.display = 'none'
    }

    /* 根据参数生成常用的正则表达式
     *string    type 生成的正则表达式类型
     *array     numArr 生成正则的条件数组 例如:[6,16] 也可省略
     */
    regCombination(type, numArr) {
        var reg = ''
        switch (type) {
            case '*': // "*":"不能为空！"
                if (numArr) {
                    reg = new RegExp('^[\\w\\W]{' + numArr[0] + ',' + numArr[1] + '}$')
                } else {
                    reg = new RegExp('^[\\w\\W]+$')
                }
                break
            case 'n': // "number":"请填写数字！
                if (numArr) {
                    reg = new RegExp('^\\d{' + numArr[0] + ',' + numArr[1] + '}$')
                } else {
                    reg = new RegExp('^\\d+$')
                }
                break
            case 's': // "s":"不能输入特殊字符！"
                if (numArr) {
                    reg = new RegExp('^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]{' + numArr[0] + ',' + numArr[1] + '}$')
                } else {
                    reg = new RegExp('^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]+$')
                }
                break
            case 'c': // "z":"中文验证"
                reg = new RegExp('^[\\u4E00-\\u9FA5\\uf900-\\ufa2d]{' + numArr[0] + ',' + numArr[1] + '}$')
                break
            case 'p': // "p":"邮政编码！
                reg = new RegExp('^[0-9]{6}$')
                break
            case 'm': // "m":"写手机号码！"
                reg = new RegExp('^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|16[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}|19[0-9]{9}$')
                break
            case 'e': // "e":"邮箱地址格式
                reg = new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$")
                break
            case 'id': // "id":验证身份证
                reg = new RegExp('^\\d{17}[\\dXx]|\\d{14}[\\dXx]$')
                break
            case 'money': // 钱
                reg = new RegExp('^[\\d\\.]+$')
                break
            case 'url': // "url":"网址"
                reg = new RegExp('^(\\w+:\\/\\/)?\\w+(\\.\\w+)+.*$')
                break
            case 'u': //
                reg = new RegExp('^[A-Z\\d]+$')
                break
        }
        return reg
    }

    /* 获取 storage 缓存数据
     * type  类型   local：localStorage   session：sessionStorage
     * name  缓存数据name名
     */
    getStorage(type, name) {
        var type = type || 'local'
        if (type == 'local') {
            var result = localStorage.getItem(name) ? localStorage.getItem(name) : ''
        } else if (type == 'session') {
            var result = sessionStorage.getItem(name) ? sessionStorage.getItem(name) : ''
        }
        return result
    }

    /* 设置 storage 缓存数据
     *type  类型   local：localStorage   session：sessionStorage
     *name  缓存数据name名
     *content  缓存的数据内容
     */
    setStorage(type, name, content) {
        var type = type || 'local'
        var data = content
        if (typeof (data) == 'object') {
            data = JSON.stringify(content)
        };
        if (type == 'local') {
            localStorage.setItem(name, data)
        } else if (type == 'session') {
            sessionStorage.setItem(name, data)
        }
    }

    removeStorage(type, name) {
        var type = type || 'local'
        if (type == 'local') {
            localStorage.removeItem(name)
        } else if (type == 'session') {
            sessionStorage.removeItem(name)
        }
    }
    /* 生成随机字符串 */
    randomString(len) {
        len = len || 32
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        var maxPos = $chars.length
        var pwd = ''
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
    }
    time() {
        return new Date().getTime()
    }

    // 上传文件
    // json.dir 上传文件放置目录
    // json.id  上传按钮id（可选）
    // josn.files 上传的文件（主要用于第三方文件上传）
    async uploadFiles(json = {}) {
        let _this = this
        if (!json.id) {
            // 上传按钮
            $('#selectfiles').remove()
            $('body').append(`<button style="display:none;" id="selectfiles"></button>`)
        }
        let webauthor = {}
        let g_object_name = ''
        let suffix = ''
        let index = 0
        let total = 0
        let result = []

        function get_suffix(filename) {
            let pos = filename.lastIndexOf('.')
            suffix = ''
            if (pos != -1) {
                suffix = filename.substring(pos)
            }
            return suffix
        }

        function set_upload_param(up, filename) {
            if (filename != '') {
                suffix = get_suffix(filename)
                g_object_name = _this.randomString(10) + suffix
            }
            up.setOption({
                'url': webauthor.endPoint,
                'multipart_params': {
                    'key': webauthor.fileName || g_object_name,
                    'policy': webauthor.policy,
                    'OSSAccessKeyId': webauthor.accessid,
                    'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
                    'callback': webauthor.callback,
                    'signature': webauthor.signature
                }
            })
            up.start()
        }
        let uploader = new plupload.Uploader({
            runtimes: 'html5',
            url: 'http://oss.aliyuncs.com',
            browse_button: json.id || 'selectfiles',
            filters: {
                mime_types: [ // 只允许上传图片和zip文件
                    {
                        title: 'Image files',
                        extensions: 'jpg,jpeg,gif,png,bmp'
                    },
                    {
                        title: 'Zip files',
                        extensions: 'zip,rar'
                    }
                ],
                max_file_size: '1mb', // 最大只能上传10mb的文件
                prevent_duplicates: true // 不允许选取重复文件
            },
            init: {
                PostInit: async function () {
                    if (json.files) {
                        uploader.addFile(json.files)
                    } else {
                        if (!json.id) $('#selectfiles').click()
                    }
                },
                FilesAdded: async function (up, files) {
                    webauthor = await _this.getWebAuthorization(json.dir, 1)
                    _this.showLoading()
                    total = files ? files.length : 0
                    set_upload_param(uploader, '')
                },
                BeforeUpload: function (up, file) {
                    set_upload_param(up, file.name)
                },
                UploadProgress: function (up, file) {
                    // 上传进度
                    // console.log(file.percent)
                },
                FileUploaded: function (up, file, info) {
                    _this.hideLoading()
                    result.push(webauthor.endPoint + '/' + (webauthor.fileName || g_object_name))
                    index++
                    if (index === total) {
                        index = 0
                        total = 0
                        json.callback && json.callback(result)
                        result = []
                    }
                },
                Error: function (up, err) {
                    _this.hideLoading()
                    json.error && json.error(result)
                    result = []
                }
            }
        })
        uploader.init()
    }

    // 上传视频
    async uploadVidioFile(json = {}) {
        let _this = this
        if (!json.id) {
            // 上传按钮
            $('#selectvidiofiles').remove()
            $('body').append(`<button style="display:none;" id="selectvidiofiles"></button>`)
        }
        console.log('点击上传视频')
        let webauthor = {}
        let g_object_name = ''
        let suffix = ''
        let index = 0
        let total = 0
        let result = []

        function get_suffix(filename) {
            let pos = filename.lastIndexOf('.')
            suffix = ''
            if (pos != -1) {
                suffix = filename.substring(pos)
            }
            return suffix
        }

        function set_upload_param(up, filename) {
            if (filename != '') {
                suffix = get_suffix(filename)
                g_object_name = _this.randomString(10) + suffix
            }
            up.setOption({
                'url': webauthor.endPoint,
                'multipart_params': {
                    'key': webauthor.fileName || g_object_name,
                    'policy': webauthor.policy,
                    'OSSAccessKeyId': webauthor.accessid,
                    'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
                    'callback': webauthor.callback,
                    'signature': webauthor.signature
                }
            })
            up.start()
        }
        let uploader = new plupload.Uploader({
            runtimes: 'html5',
            url: 'http://oss.aliyuncs.com',
            browse_button: json.id || 'selectvidiofiles',
            filters: {
                mime_types: [ // 只允许上传图片和zip文件
                    // { title: "Image files", extensions: "jpg,jpeg,gif,png,bmp" },
                    // { title: "Zip files", extensions: "zip,rar" },
                    {
                        title: 'Video file',
                        extensions: 'mp4'
                    }
                ],
                max_file_size: '10mb', // 最大只能上传10mb的文件
                prevent_duplicates: true // 不允许选取重复文件
            },
            init: {
                PostInit: async function () {
                    if (json.files) {
                        uploader.addFile(json.files)
                    } else {
                        if (!json.id) $('#selectvidiofiles').click()
                    }
                },
                FilesAdded: async function (up, files) {
                    webauthor = await _this.getWebAuthorization(json.dir, 2)
                    _this.showLoading()
                    total = files ? files.length : 0
                    set_upload_param(uploader, '')
                },
                BeforeUpload: function (up, file) {
                    set_upload_param(up, file.name)
                },
                UploadProgress: function (up, file) {
                    // 上传进度
                    // console.log(file.percent)
                },
                FileUploaded: function (up, file, info) {
                    _this.hideLoading()
                    result.push(webauthor.endPoint + '/' + (webauthor.fileName || g_object_name))
                    index++
                    if (index === total) {
                        index = 0
                        total = 0
                        json.callback && json.callback(result)
                        result = []
                    }
                },
                Error: function (up, err) {
                    _this.hideLoading()
                    json.error && json.error(result)
                    result = []
                }
            }
        })
        uploader.init()
    }

    // 获得鉴权校验
    getWebAuthorization(dir = 'common', type) {
        return new Promise((resolve, reject) => {
            this.ajax({
                url: `${baseApi}oss_upload/get_web_authorization`,
                data: {
                    dir: dir,
                    type: type
                },
                done: (data) => {
                    let result = data.result || ''
                    if (typeof result === 'string') result = JSON.parse(result)
                    resolve(result)
                }
            })
        })
    }
    // 遍历处理数
    hanleTree(data) {
        if (!data || !data.length) return []
        data.forEach(item => {
            if (item.menuRes) {
                item.subRes = item.menuRes
            }
            if (item.btnRes) {
                item.subRes = item.btnRes
            }
            if (item.subRes || item.menuRes || item.btnRes) {
                this.hanleTree(item.subRes || item.menuRes || item.btnRes)
            }
        })
        return data
    }

    // 日期格式化
    formDataParams() {
        let day = new Date().getDate() < 9 ? '0' + new Date().getDate() : new Date().getDate()
        let mounth = (new Date().getMonth() + 1) < 9 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
        return mounth + '.' + day
    }

    //获取cookie
    getCookie(name) {
        var strcookie = document.cookie; //获取cookie字符串
        var arrcookie = strcookie.split("; "); //分割
        //遍历匹配
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            }
        }
        return "";
    }
    toLogin() {
        if (!this.getCookie("AJ1sOD_token")) {
            // console.log($(".login_pop.js_login_pop").length)
            // window.Login && window.Login.login();
            var timer = setInterval(() => {
                if ($(".login_pop.js_login_pop").length) {
                  window.Login.login();
                  clearInterval(timer);
                }
              },500);
        }
    }
}

// 初始化util对象
const newUtil = new util()
export default newUtil
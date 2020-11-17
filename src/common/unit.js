import { RegExp } from 'core-js'

/**
 * 从App端获取用户信息
 * @return 对象如下
 * {
 *    uid: Number,
 *    token: String,
 *    avatar: String
 * }
 */
export const appGetUserInfo = (data) => {
  data = JSON.parse(decodeURIComponent(data))
  window.userInfo = data
  // console.log('123', data)
  if (navigator.userAgent.toLowerCase().indexOf('kinglive') > -1) {
    // console.log(123456789)
    appGetUserInfo.VUE.init()
  }
}

/**
 * 通过Proxy监听get获取某个对象的深层对象值
 * 避免中间层断裂或者查找的深层对象不存在该对象中导致的报错
 * @param target
 * @param exec 取值属性
 * @returns {*}
 * @demo
 * let obj = {
 *  school: {
 *    class1: {
 *      student: 50
 *    }
 *  }
 * }
 * getter(obj).school.class1.student._  //50
 * getter(obj).school.class1.course._  //undefined
 * getter(obj).school.class2.student._  //undefined
 */
export const getter = (target, exec = '_') => {
  return new Proxy({}, {
    get: (o, n) => {
      return n === exec ?
      target: getter(typeof target === 'undefined' ? target : target[n], exec)
    }
  })
}

/**
 * 复制文字到剪贴板
 * @param {text} 必传
 * 返回bool用于判断文本是否已复制到剪贴板中
 */
export const _copyText = text => {
  console.log(text)
  let Copy = document.createElement('input'), id = 'copy' + new Date().getTime()
  Copy.type = 'text'
  Copy.id = id
  Copy.name = id
  Copy.style.position = 'fixed'
  Copy.style.top = '-9999999px'
  Copy.style.left = '-9999999px'
  Copy.style.zIndex = '-9999999'
  Copy.value = text
  document.body.appendChild(Copy)
  Copy.select()
  var flag = document.execCommand("Copy")
  console.log('00000', flag)
  // setTimeout(() => {
    // Copy.remove()
    // Copy = id = null
  // }, 50)
  return flag
}

/**
 * 获取某个cookie
 * @param {name}  
 */
export const getCookie = name => {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return false
  }
}
const login = () => {
  if (window.navigator.userAgent.indexOf("kinglive-ios") > -1) {
    window.webkit.messageHandlers.jsIsLogin.postMessage({})
  } else if (window.navigator.userAgent.indexOf("kinglive/Android") > -1) {
    window.app.jsIsLogin()
  } else {
    window.location.href = '/index.php?g=H5&m=User&a=login&url=' + btoa(window.location.href)
  }
}

/**
 *  移动端提示用户登录（区分H5和App端） 
 */

export const toLogin = (that,type = 1, msg = "你还没有登录，无法开始游戏<br>立即登录，开始中秋博饼，赢大奖吧〜") => {
  if (type === 1) {
    that.$dialog.alert({
        title: "温馨提示",
        message: msg,
        confirmButtonText: "登录"
      }).then(() => {
        login()
      })
  } else {
    login()
  }
}


/**
 * 返回并设置设备id
 */

export const setDeviceCode = (tag = '_device_') => {
  let device = localStorage.getItem("_device_") || ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6) + new Date().getTime().toString()
  localStorage.setItem('_device_', device)
  return device
}

/**
 * 去掉字符串首尾空格
 */

export const trim = str => {
  return str.replace(/(^\s*)|(\s*$)/g,"")
}



/**事件管理器 */
export class GameEvent {
  constructor() {
    this._handles = {};
  }
  /**
   * 添加事件
   * @param {*} type 事件名称
   * @param {*} handle 处理函数
   */
  addEventListener(type, handle) {
    if (handle instanceof Function) {
      if (!this._handles[type]) this._handles[type] = [];
      this._handles[type].push(handle)
    }
  }
  /**
   * 删除事件
   * @param {*} type 事件名称
   * @param {*} handle 处理函数
   */
  removeEventListener(type, handle) {
    if (!!handle) {
      this._handles[type] = null;
      delete this._handles[type]
    } else if (handle instanceof Function) {
      if (!this._handles[type]) this._handles[type] = [];
      for (let i = 0, l = this._handles[type].length; i < l; i++) {
        if (this._handles[type][i] === handle) {
          this._handles[type].splice(i);
          return;
        }
      }
    }
  }
  /**
   * 触发事件
   * @param {*} type 事件名称
   * @param  {...any} args 处理器参数
   */
  async dispatchEvent(type, ...args) {
    if (this._handles[type]) {
      for (let handle of this._handles[type]) {
        if (handle.constructor.name == "AsyncFunction") {
          await handle(...args)
        }
        else {
          handle(...args)
        }
      }
    }
  }

}


/**移动端的接口 */
export const MobileInterface = new class MobileInterface extends GameEvent {
  constructor() {
    super()
    this.MOBILE_TYPE = {
      IOS: "ios",
      ANDRIOD: "andriod",
      BROWSER: "browser"
    }
    if (navigator.userAgent.includes("kinglive-ios")) {
      this._mobile_type = this.MOBILE_TYPE.IOS;
    } else if (navigator.userAgent.includes("kinglive/Android")) {
      this._mobile_type = this.MOBILE_TYPE.ANDRIOD;
    } else {
      this._mobile_type = this.MOBILE_TYPE.BROWSER;
      window.browser = {
        jsLogin: function () {
          location.href = '/index.php?g=h5&m=user&a=login&url=' + btoa(window.location.href)
        },
      }
    }

    /**当前设备的方法名 */
    this.METHODS = {
      /**IOS 的API */
      [this.MOBILE_TYPE.IOS]: {
        /**登录 */
        LOGIN: "jsIsLogin_iOS",
        /**分享 */
        SHARE: "jsCallShareH5",
        /**开启重力感应 */
        STARTGRAVITYSENSORLISTENER: "startGravitySensorListener"
      },

      /**安卓 的API */
      [this.MOBILE_TYPE.ANDRIOD]: {
        LOGIN: "jsLogin",
        SHARE: "jsCallShareH5",
        STARTGRAVITYSENSORLISTENER: "startGravitySensorListener",
        /**禁用下拉刷新 */
        DISABLEFRESH: "disableFresh"
      },

      /**浏览器 的API */
      [this.MOBILE_TYPE.BROWSER]: {
        LOGIN: "jsLogin"
      },
    }[this.mobile_type] || {}

    this.initEvent();
  }

  initEvent() {
    //安卓获取用户登录信息
    window.appGetUserInfo = data => {
      this.dispatchEvent("appGetUserInfo", JSON.parse(window.decodeURIComponent(data)))
    };
    /**重力感应的 */
    window.onGravityValueChange = (x, y, z) => {
      this.dispatchEvent("onGravityValueChange", x, y, z)
    }
    /**重力感应的 */
    window.onIosGravityValueChange = data => {
      let {
        x,
        y,
        z
      } = JSON.parse(window.decodeURIComponent(data))
      this.dispatchEvent("onGravityValueChange", -(x * 10), y, z)
    }
  }

  /**当前设备类型 */
  get mobile_type() {
    return this._mobile_type;
  }
  /**
   * 执行移动端方法
   * @param {*} name 方法名
   * @param {*} params 对象参数
   * @param  {...any} args 列表参数
   */
  execMethod(name, params = {}, ...args) {
    if (window.webkit && window.webkit.messageHandlers[name]) {
      window.webkit.messageHandlers[name] && window.webkit.messageHandlers[name].postMessage(params)
    } else if (window.app && window.app[name]) {
      window.app[name] && window.app[name](...args)
    } else if (window.browser && window.browser[name]) {
      window.browser[name] && window.browser[name](...args)
    }
    // if (this.mobile_type == this.MOBILE_TYPE.IOS) {
    //   window.webkit.messageHandlers[name] && window.webkit.messageHandlers[name].postMessage(params)
    // }
    // else if (this.mobile_type == this.MOBILE_TYPE.ANDRIOD) {
    //   window.app[name] && window.app[name](...args)
    // }
    // else if (this.mobile_type == this.MOBILE_TYPE.BROWSER) {
    //   window.browser[name] && window.browser[name](...args)
    // }
  }
  /**登录 */
  userLogin() {
    this.execMethod(this.METHODS.LOGIN)
  }
  /**
   * 分享
   * @param {*} imgUrl 图标地址
   * @param {*} title 分享标题
   * @param {*} Content 描述文字
   * @param {*} url 分享的URL
   */
  share(imgUrl, title, Content, url) {
    this.execMethod(this.METHODS.SHARE, {
      Content,
      url,
      title,
      imgUrl
    }, title, Content, url, imgUrl)
  }

  /**开启重力感应 */
  startGravitySensorListener() {
    this.execMethod(this.METHODS.STARTGRAVITYSENSORLISTENER)
  }
  /**禁用APP默认的下拉刷新 */
  disableFresh() {
    this.execMethod(this.METHODS.DISABLEFRESH)
  }
}

///例子
// MobileInterface.startGravitySensorListener()
// MobileInterface.addEventListener("onGravityValueChange", (x, y, z) => {

// })

export const getQueryVariable = (variable) => {
  var url = window.location.href
  if (url.indexOf(variable) === -1){
    return false
  }
  url = url.split(variable + '=')[1]
  if (url.indexOf("&") === 0) {
    return url
  } else {
    return url.split('&')[0]
  }
}

export const setCookie = (name, value) => { 
  var exp = new Date(); 
  exp.setTime(exp.getTime() + 60 * 60 * 1000); 
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/"; 
}

export const searchParams = (key, url = window.location.href) => {
  if (!key || url.indexOf(key) === -1) return false
  url = url.split("?")
  url = url.length === 2 ? url[1] : url[0]
  url = url.split("&")
  for (let i = 0; i < url.length; i++) {
    if (url[i].split("=")[0] == key) {
      return url[i].split("=")[1]
    }
  }
  return false
}
import axios from 'axios'
import { Toast } from 'vant'
import qs from 'qs'

const http = axios.create({
  timeout: 20000
})

let requestCount = 0

const showLoading = () => {
  if (requestCount === 0) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
  }
  requestCount++
}

const hideLoading = () => {
  requestCount--
  requestCount = Math.max(requestCount, 0)
  if (requestCount === 0) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 50
    })
  }
}

//配置请求
http.interceptors.request.use(config => {
  if (config.headers.showLoading != false) {
    showLoading()
  }
  if (window.hasOwnProperty('userInfo') && window.userInfo != false) {
    config.headers.token = userInfo.token
    // console.log(userInfo.token)
  }
  if (config.method === "post") {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded"
    config.data = qs.stringify(config.data)
  }
  return config
}, err => {
  if (config.headers.showLoading != false) {
    hideLoading()
  }
  Toast('请求超时！')
  return Promise.resolve(err)
})


//配置回执
http.interceptors.response.use(response => {
  if (response.config.headers.showLoading !== false) {
    hideLoading()
  }
  if (response.data.code === "success") {
    return response.data
  } else {
    // console.log(response)
    Toast(response.data.msg || "请求失败，请稍后重试！")
  }
}, error => {
  if (error.config && error.config.headers.showLoading !== false) {
    hideLoading()
  }
  if (error.response && error.response.data && error.response.data.message) {
    Toast(error.response.data.message)
  } else {
    Toast('请求失败！')
  }
  return Promise.reject(error)
})

export default http
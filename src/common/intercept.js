//判断当前浏览器环境在PC或者移动端，如果在PC中但当前打开是*-H5.html则跳转到*-PC.html中
//移动端中同理
export default (to, from, next) => {
  if (/(iPhone|iPad|iPod|iOS|Android|XiaoMi)/i.test(navigator.userAgent) || document.documentElement.clientWidth < 750) {
    if (/(-PC.html)/i.test(window.location.href)) {
      window.location.href = window.location.href.split('-PC.html').join('-H5.html')
    } else {
      next()
    }
  } else {
    if (/(-H5.html)/i.test(window.location.href)) {
      window.location.href = window.location.href.split('-H5.html').join('-PC.html')
    } else {
      next()
    }
  }
  next()
}
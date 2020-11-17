/***
 * 开发思路：
 * 1、写loading 样式插入 到 body中
 * 2、请求时显示，并执行定时器
 * 3、结束响应隐藏，并清除定时器
 * 结果是：能操作loagin显示跟隐藏时机
 * 
 * 建议思路：
 * 1、先建立完整的且独立的 Docm 结构和相应的 样式
 * 2、开放显示与关闭的方法
 * 3、达到再执行显示方式时，向当前页面 Body 插入该 Docm 实现，显示 Loading 效果，
 * 4、在执行关闭方法时，将 页面的中的 Docm 删除，并清除相关数据
 * /-------------------------------------------------------------------------
 * 5、如果可以的话，随便写上，显示前和显示后，和关闭前和关闭后的生命周期函数
 * 6、还有开发部分配置参数，进行样式修改和配置
 * 
 */


// var docm = document.createElement("div");
// let num = 0;
// let timeId = null;
// const showLoading = null;
// const closeLoading = null;/


// 创建样式节点
// function addstyleNode(str) {
//     var styleNode = document.createElement('style');
//     styleNode.type = 'text/css';
//     styleNode.id = 'add-style-id';
//     if (styleNode.styleSheet) {
//         styleNode.styleSheet.cssText = str; //ie下要通过style.cssText进行写操作
//     } else {
//         styleNode.innerHTML = str; //firefox可以直接对innHTML进行操作
//     }
//     document.getElementsByTagName('head').item(0).appendChild(styleNode);
// }

// addstyleNode(`.loading {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 110px;height: 110px;z-index: 99999999999;margin: 0 auto;background: url(${require('@/assets/loading.png')}) no-repeat;background-position: 0 0;} .loading0 {  background-position: -0px 0;} .loading1 {  background-position: -110px 0;} .loading2 {  background-position: -220px 0;} .loading3 {  background-position: -330px 0;} .loading4 {  background-position: -440px 0;} .loading5 {  background-position: -550px 0;} .loading6 {  background-position: -660px 0;} .loading7 {  background-position: -770px 0;} .loading8 {  background-position: -880px 0;} .loading9 {  background-position: -990px 0;} .loading10 {  background-position: -1100px 0;} .loading11 {  background-position: -1210px 0;} .loading12 {  background-position: -1320px 0;} .loading13 {  background-position: -1430px 0;} .loading14 {  background-position: -1540px 0;} .loading15 {  background-position: -1650px 0;} .loading16 {  background-position: -1760px 0;} .loading17 {  background-position: -1870px 0;} .loading18 {  background-position: -1980px 0;} .loading19 {  background-position: -2090px 0;}`);

///////////////////////////在自己的命名空间下，开放使用对象


// const showLoading = function () {
//     window.document.body.appendChild(docm);
//     loading()
// }
// const closeLoading = function () {
//     docm.remove()
//     clearInterval(timeId);
// }
// 
// const loading = function () {
//     if (timeId) {
//         clearInterval(timeId);
//     }
//     timeId = setInterval(() => {
//         console.log(num)
//         if (num === 19) {
//             num = 0;
//             docm.className = "loading loading0";
//         } else {
//             num = ++num;
//             let str = 'loading' + num
//             docm.className = `loading ${str} `;
//         }
//     }, 100);
// }

function Loading(options = {
    /**精灵图片地址 */
    imgUrl: "",
    /**宽度 */
    width: 0,
    /**高度 */
    height: 0,
    /**帧数 */
    frames: 0,
    /**单位 */
    unit: "px"
}) {
    if (!(this instanceof Loading)) return new Loading(options);
    const {
        imgUrl = "", width = 0, height = 0, frames = 0, unit = "px"
    } = options || {}
    this.options = {
        imgUrl,
        width,
        height,
        frames,
        unit
    }
    this.timeId = 0;
    this.elem = document.createElement("div");
    this.style = `.loading {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width: ${width}${unit};height: ${height}${unit};z-index: 99999999999;margin: 0 auto;background: url(${imgUrl}) no-repeat;background-position: 0 0;} ${new Array(frames+1).fill(1).map((e, i) => `.loading${i} {  background-position: -${width * i}${unit} 0;}`).join(" ")}`
    Loading.addstyleNode2Head(this.style)
};




Loading.addstyleNode2Head = function (style) {
    var styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    styleNode.id = 'add-style-id2';
    if (styleNode.styleSheet) {
        styleNode.styleSheet.cssText = style; //ie下要通过style.cssText进行写操作
    } else {
        styleNode.innerHTML = style; //firefox可以直接对innHTML进行操作
    }
    document.getElementsByTagName('head').item(0).appendChild(styleNode);
}
Loading.prototype.removeDocm = function () {
    this.elem.remove();
}


Loading.prototype.showLoading = function () {
    document.body.appendChild(this.elem);
    if (this.timeId) {
        clearInterval(this.timeId);
    }
    let num = 0;
    this.timeId = setInterval(() => {
        if (num === +this.options.frames) {
            num = 0;
            this.elem.className = "loading loading0";
        } else {
            this.elem.className = `loading loading${++num} `;
        }
    }, 100);
}


Loading.prototype.closeLoading = function () {
    this.removeDocm()
    clearInterval(this.timeId);
}

window.Little = {
    Loading: new Loading({
        imgUrl: require('@/assets/loading.png'),
        width: 110,
        height: 110,
        frames: 19
    })
}

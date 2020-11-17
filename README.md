## 首次执行
```
npm install
```

### 开发环境热更新
```
npm run serve
```

### 打包
```
npm run build
```

## 目录说明

```
├── dist                                                          //打包目录
├── public                                                        //入口
├── socket                                                        //socket相关
├── src                                                           //源码目录
│   ├── assets                                                    //媒体、静态资源（建议按照活动划分目录）
│   ├── common                                                    //自定义公共功能
│   │   ├── area.js                                               //vant中需要的中国三级省市区对象
│   │   ├── area2.js                                              //element中需要的中国三级省市区对象
│   │   ├── intercept.js                                          //H5页面和PC页面拦截互跳（具体参见该文件内说明）
│   │   └── unit.js                                               //公共方法
│   ├── H5                                                        //H5活动源码目录
│   │   └── bobing                                                //中秋博饼项目
│   │   │   ├── components                                        //组件
│   │   │   ├── views                                             //页面
│   │   │   ├── App.vue                                           //模板入口
│   │   │   ├── main.js                                           //打包入口
│   │   │   └── router.js                                         //路由配置
│   └── PC                                                        //PC活动源码目录(同H5目录不做赘述)
├── pages.config.js                                               //多页面配置入口（包含CDN配置）
└── vue.config.js                                                 //vue-cli webpack配置
```

## 配置说明
1. 当有新的活动需要上线时，在`pages.config.js`中配置相应的页面信息；
2. `pages.config.js`需要以目录名为key，配置入口html文件，打包后的文件名，项目title以及需要引用的cdn文件（cdn中包含js和css数组名）；
3. 按照`pages.config.js`配置在src中新建相应的目录和文件；
4. 如：中秋需要在H5端制作博饼页面，则在`pages.config.js`中添加如下对象：
```
'H5/bobing': {
  template: 'public/h5.html',
  filename: 'bobing-H5.html',
  title: '王者直播 - 中秋博饼',
  cdn:{
    js: ['svga','vue','vue-router','axios','vant'],
    css: ['vant']
  }
}
```
*配置完`pages.config.js`后，在`src`目录新建`components\views`两个目录，以及`App.vue\main.js\router.js`三个文件*

*cdn需要在`vue.config.js`中配置key和cdn链接*

### Tips
* 为了避免后期此项目中子项目过多导致的打包过慢，可以先将已经打包好的子项目中的`pages.config.js`对象注释掉，build命令中添加`--no-clean`会保留原来已经打包好的项目，如果需要每次都更新所有的子项目，则删除`package.json`文件内命令配置下的`--no-clean`语句即可。
#### 例如：
原来`pages.config.js`中已经打包好的页面对象如下
```
module.exports = {
  'PC/bobing': {
    template: 'public/pc.html',
    filename: 'bobing-PC.html',
    title: '王者直播 - 中秋博饼',
    cdn:{
      js: ['vue','vuex','vue-router','axios','element-ui','jquery','socket.io'],
      css: ['element-ui']
    }
  }
}
```
新增一个H5端的bobing项目，则将原来的注释掉，添加新H5端项目，如下：
```
module.exports = {
  //'PC/bobing': {
  //  template: 'public/pc.html',
  //  filename: 'bobing-PC.html',
  //  title: '王者直播 - 中秋博饼',
  //  cdn:{
  //    js: ['vue','vuex','vue-router','axios','element-ui','jquery','socket.io'],
  //    css: ['element-ui']
  //  }
  //},
  'H5/bobing': {
    template: 'public/h5.html',
    filename: 'bobing-H5.html',
    title: '中秋博饼',
    cdn:{
      js: ['vue','vue-router','vuex','axios','vant','socket.io'],
      css: ['vant']
    }
  }
}
```

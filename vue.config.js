const CompressionWebpackPlugin = require("compression-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const glob = require('glob')
const path = require('path')
const pageInfo = require('./pages.config')

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV)
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

const pages = {}
glob.sync('./src/**/main.js').forEach(entry => {
  let chunk = entry.match(/\.\/src\/(.*)\/main\.js/)[1]
  const curr = pageInfo[chunk]
  if (curr) {
    pages[chunk] = {
      entry,
      ...curr,
      chunk: ["chunk-vendors", "chunk-common", chunk]
    }
  }
})

console.log(IS_PROD)
module.exports = {
  // outputDir: IS_PROD ? 'dist' : 'dist',
  // publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : "./",
  publicPath: IS_PROD ? "/activity/dist/" : process.env.VUE_APP_PUBLIC_PATH,
  // assetsDir:IS_PROD ? '../' : './',
  // sourcePrefix: 'static',
  configureWebpack: config => {
    const plugins = []
    // const plugins = [
    //   new webpack.ProvidePlugin({
    //     $: 'jquery',
    //     jQuery: 'jquery',
    //     'windows.jQuery': 'jquery'
    //   })
    // ]
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );
    }
    config.externals = {
      'svga': 'SVGA',
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'vant': 'vant',
      'jquery': '$',
      'socket.io': 'io'
    }
    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: config => {
    //如果打包则进行图片压缩
    if (IS_PROD) {
      var a = config.module.rule('images').use('image-webpack-loader').loader('image-webpack-loader').options({
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.9],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        },
      })
      // console.log('-----------------',config)
      config.module.rule('images').use('url-loader').loader('url-loader').options({
        limit: 10,
        publicPath: '/activity/dist/img',
        outputPath: '/img',
        name: '[name].[ext]'
      }).end()
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
        analyzerMode: "static"
      }])
      config.resolve.alias.set('@', resolve('src'))
    }
    //配置cdn资源
    const cdn = {
      css: {
        'vant':'https://cdn.jsdelivr.net/npm/vant@2.9/lib/index.css',
        'element-ui':'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
      },
      js: {
        'svga': 'https://cdn.jsdelivr.net/npm/svgaplayerweb@2.3.1/build/svga.min.js',
        'vue': 'https://cdn.bootcss.com/vue/2.6.11/vue.min.js',
        'vuex': 'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js',
        'vue-router': 'https://cdn.bootcss.com/vue-router/3.1.5/vue-router.min.js',
        'axios': 'https://cdn.bootcss.com/axios/0.19.2/axios.min.js',
        'element-ui': 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.13.1/index.js',
        'DPlayer': 'https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.1/DPlayer.min.js',
        'flv': 'https://cdn.bootcdn.net/ajax/libs/flv.js/1.5.0/flv.min.js',
        'hls': 'https://cdn.bootcdn.net/ajax/libs/hls.js/0.13.2/hls.light.min.js',
        'vant': 'https://cdn.jsdelivr.net/npm/vant@2.9/lib/vant.min.js',
        'jquery':'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js',
        'socket.io':'https://cdn.bootcdn.net/ajax/libs/socket.io/2.2.0/socket.io.js'
      }
    }

    //防止多页面打包卡顿
    config => config.plugins.delete("named-chunks")

    //多页面CDN添加
    Object.keys(pageInfo).forEach(page => {
      config.plugin(`html-${page}`).tap(args => {
        //html中添加CDN
        // console.log("5555555555555555555", pageInfo, page, pageInfo[page])
        if (pageInfo[page].cdn) {
          args[0].cdn = {};
          Object.keys(pageInfo[page].cdn)
          .forEach(type => args[0].cdn[type] = pageInfo[page].cdn[type] && pageInfo[page].cdn[type].map(name => cdn[type][name]))
        }
        args[0].chuksSortMode = 'none'
        return args
      })
    })
    return config
  },
  pages,
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: process.env.PROT || 8088,
    https: false,
    hotOnly: false,
    proxy: {
      '': {
        target: 'http://0.0.0.0/', //灰度环境
        changeOrigin: true,
        ws: true,
      }
    }, // 设置代理
    before: app => { }
  },
}

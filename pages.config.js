module.exports = {
  'PC/bobing': {
    template: 'public/pc.html',
    filename: 'bobing-PC.html',
    title: '',
    cdn:{
      js: ['vue','vuex','vue-router','axios','element-ui','jquery','socket.io'],
      css: ['element-ui']
    }
  },
  'H5/bobing': {
    template: 'public/h5.html',
    filename: 'bobing-H5.html',
    title: '',
    cdn:{
      js: ['vue','vue-router','vuex','axios','vant','socket.io'],
      css: ['vant']
    }
  },
  'H5/clipVideo': {
    template: 'public/h5.html',
    filename: 'clipVideo-H5.html',
    title: '',
    cdn: {
      js: ['vue','axios']
    }
  }
}

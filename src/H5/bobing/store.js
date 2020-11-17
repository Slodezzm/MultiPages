import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    UAVATAR: '',
    isLogin: false,
    gameType: "single",//游戏类型【单人‘single’、多人‘multi’】
    count: 0,
    roomId: "0",
    gameId: "",
    showAnimation: false,
    dices: [1,2,3,4,5,6],
    userList: [],//游戏用户列表
    showReasult: false,//展示结果面板
    myReasult: {},//单人结果(指自己)
    multiReasult: [],//多人结果
    mute: false,//静音与否
    showShare: false,
    shareLink: "",
    shareType: "",
    gaming: false,//多人游戏在游戏中
    withMulti: new Date().getTime(),
    notyet: false,
    notyetTag: false,
    endtime: 0,
    starttime: false,
    countdown: 0,
    gameStatus: 0,
    showList: false,
    gotReasult: new Date().getTime(),
    integral: 0,//当前积分
  },
  mutations: {
    setState(state, opt) {
      for (let [key, val] of Object.entries(opt)) {
        state[key] = val
      }
    }
  }
})
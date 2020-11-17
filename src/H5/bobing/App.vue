<template>
  <div id="app" :class="{with_nav: $route.meta.bottomNav}">
    <router-view v-if="gotInfo" />
    <bottom-nav v-if="$route.meta.bottomNav && !gaming" />
    <transition name="fade">
      <game-result v-if="showReasult" />
      <share v-if="showShare" />
    </transition>
    <audio src="@/assets/bobing/ddz.mp3" ref="bgMusic" loop></audio>
    <div class="mask" v-if="mask"></div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { getQueryVariable, setCookie, appGetUserInfo, getCookie, toLogin, setDeviceCode } from "@/common/unit"
import bottomNav from "./components/public/bottomNav"
import gameResult from "./components/panel/gameResult"
import share from './components/share'
import createSocket from "@/common/ioclient"

window.socket = null
export default {
  computed: {
    ...mapState([ 'isLogin', 'gameStatus', 'gameType', 'count', 'roomId', 'gameId', 'gaming', 'mute' , 'notyet' , 'showReasult', 'showShare', 'endtime', 'countdown' ])
  },
  components: {
    bottomNav,
    gameResult,
    share
  },
  data(){
    return {
      gotInfo: false,
      mask: false,
      device: "",
      socketStatus: false,
      timer: null
    }
  },
  watch:{
    mute(){
      if (this.mute) {
        this.$refs.bgMusic.pause()
        } else {
        this.$refs.bgMusic.play()
      }
    },
    gameStatus(n,o){//监听游戏状态
      switch (n) {
        case -14:
          return this.$dialog.confirm({
            title: "提示",
            message: '当前游戏已经开始，将重新开始一局新的游戏！',
            confirmButtonText: "我知道了",
          }).then(() => {
            this.disSocket()
            this.$nextTick(() => {
              this.restart()
            },100)
          })
          break
        case -13://已经在房间内
          this.$dialog.confirm({
            title: "提示",
            showCancelButton: true,
            confirmButtonText: "回到游戏",
            cancelButtonText: "重开一局",
            message: '网路连接失败，是否回到之前的游戏中？'
          }).then(() => {
            this.disSocket()
            this.$nextTick(() => {
              this.initGame(this.roomId)
            },100)
          }).catch(() => {
            this.disSocket()
            this.$nextTick(() => {
              this.restart()
            },100)
          })
          break
        case -8:
          this.noDice()
          break
        case -1: case -7: 
          this.timerStart()
          break
        case -6: case -5: 
          this.notNormal()
          break
        case -4: 
          this.noCount()
          break
        case 6: 
          this.getDiceNum()
          break
        case 10:
          this.timerStart()
          break
        case 11:
          this.getRank('timeover')
          break
      }
    }
  },
  created(){
    this.getEndTime()
  },
  mounted(){
    this.$refs.bgMusic.play()
    setTimeout(() => {
      if (this.$refs.bgMusic.paused) {
        this.$store.commit("setState", {mute: true})
      } else {
        this.$store.commit("setState", {mute: false})
      }
    }, 500)
    if (navigator.userAgent.toLowerCase().indexOf("kinglive") > -1) {
      appGetUserInfo.VUE = this
      window.appGetUserInfo = appGetUserInfo
      if (window.hasOwnProperty("app")) {
        app.disableFresh()
      }
    }else {
      this.getUserInfo()
    }
  },
  methods: {
    timerStart(){
      clearInterval(this.timer)
      let ct = this.countdown
      if (ct === 0) ct = 30
      this.$store.commit("setState", {countdown: ct})
      this.timer = setInterval(() => {
        ct--
        this.$store.commit("setState", {
          countdown: ct
        })
        if (ct === 0) {
          clearInterval(this.timer)
          if (this.notyet) {
            this.$store.commit("setState", {
              notyet: false,
              showReasult: true,
              showList: false
            })
          }
        }
      }, 1000)
    },
    gameStart(){
      if (this.gameType === 'multi') {
        this.notHome()
        this.notOver()
      } else {
        this.getDiceNum()
      }
    },
    notHome () {//游戏开始不在首页
      if (this.$route.name != 'Home') {
        this.$dialog.confirm({
          title: "游戏已经开始了",
          message: "30秒后系统将自动帮你投掷骰子，请立即回到游戏中",
          showCancelButton: true
        }).then(() => {
          this.$router.push({ path: "/", query: { id: this.roomId } })
        })
      } else {
        this.$toast("游戏开始了，请点击摇出骰子吧！")
      }
    },
    socketDisConnect(){//游戏连接失败
      this.$dialog.confirm({
        title: "游戏连接失败",
        message: "游戏连接失败，是否要重新回到游戏中？",
        showCancelButton: true,
        confirmButtonText: "回到游戏",
        cancelButtonText: "重开一局",
      }).then(() => {
          this.disSocket()
          this.$nextTick(() => {
            this.initGame(this.roomId)
          },100)
      }).catch(() => {
        this.restart()
      })
    },
    notNormal(){//游戏异常
      this.$dialog.confirm({
        title: "游戏连接失败",
        message: "网络波动或者多次刷新页面可能导致游戏异常，是否重新连接进入游戏？"
      }).then(() => {
        this.initGame()
      }).catch(() => {
        return this.$toast("请刷新页面或者重新进入后再开始游戏哦！")
      })
    },
    noCount(){//游戏次数用完
      this.$dialog.confirm({
        title: "游戏次数不足",
        message: "您本日的游戏次数已经用完，是否去充值游戏次数？",
        showCancelButton: true,
        confirmButtonText: "充值",
        cancelButtonText: "取消",
      }).then(() => {
        this.$router.push({path:'/charge', query: this.$route.query})
      }).catch(() => {
        this.$toast("充值后再来哦~")
      })
    },
    noDice(){//点数获取异常
      this.$dialog.confirm({
        title: "获取点数失败",
        message: "当前点数获取异常，是否重试？"
      }).then(() => {
        this.getRank("timeover")
      }).catch(() => {
        this.restart()
      })
    },
    restart(){//重开
      this.$store.commit("setState", {
        notyet: false,
        showReasult: false,
        gameStatus: 0
      })
      localStorage.removeItem("_device_")
      this.$router.push({path: this.$route.path, query: {}})
      this.$nextTick(() => {
        this.initGame()
      })
    },
    disSocket(){//断开socket
      if (this.socketStatus) {
        socket.disconnect()
        this.socketStatus = false
      }
    },
    getUserInfo(){//获取用户信息
      if (navigator.userAgent.toLowerCase().indexOf("kinglive") === -1) {
        if (window.location.href.indexOf('user') > -1 && window.location.href.indexOf('token') > -1) {
          window.userInfo = {
            uid: getQueryVariable('user'),
            token: getQueryVariable('token')
          }
          setCookie('AJ1sOD_uid',window.userInfo.uid)
          setCookie('AJ1sOD_token',window.userInfo.token)
        } else {
          window.userInfo = {
            uid: getCookie('AJ1sOD_uid') || false,
            token: getCookie('AJ1sOD_token') || false
          }
        }
      }
      this.init()
    },
    init(){//初始化个人信息
      if (window.hasOwnProperty('userInfo') && userInfo.uid && userInfo.uid != "false") {
        this.$store.commit('setState', {
          isLogin: true
        })
      }
      this.gotInfo = true
      this.initGame()
    },
    initGame(roomId){//初始化游戏
      if (this.gameStatus === 1) {//游戏调用接口中，阻止多次调用
        return false
      }

      this.$store.commit("setState", {gameStatus: 0})

      // console.log(this.socket === null)

      this.disSocket()

      if (!this.isLogin) {
        return this.$toast("暂未登录")//--
      }

      if (roomId && roomId != 0) {
        this.$router.push({path:this.$route.path, query: {...{id:roomId},...this.$route.query}})
      }

      let data = {}, url = window.location.href
      if (url.indexOf("?id=") > -1 || url.indexOf("&id=") > -1) {
        data.roomId = getQueryVariable('id')
        this.$store.commit("setState", {gameType: 'multi', roomId: data.roomId})
      } else {
        this.$store.commit("setState", {gameType: 'single'})
      }
      this.device = setDeviceCode()
      data.device = this.device

      this.$store.commit("setState", {gameStatus: 1,showReasult: false, notyet: false})
      this.$http({
        url: "/live/api/mid_autumn/get_user_info_by_room",
        method: "POST",
        data: data
      }).then(res => {
        this.$store.commit("setState", {gameStatus: 2})

        this.$store.commit("setState", {
          roomId: res.data.roomId,
          count: res.data.userInfo.count,
          UAVATAR: res.data.userInfo.avatar,
          integral: res.data.currentIntegral
        })

        if (res.data.notyet === 1) {//当前房间在游戏中
          if (this.gameId === "") {
            return this.$store.commit("setState", {notyet: true, gameStatus: -14})
          } else {
            return this.$store.commit("setState", {notyet: true, gameStatus: -1})
          }
        }
        if (res.data.notyet === 2) {//当前房间已满
          setTimeout(() => {
            this.restart()
          },2000)
          return this.$toast("游戏人数已满，您将重新开始一场游戏！")
        }

        if (res.data.notyet === 3) {//活动已结束
          return this.$toast("活动已经结束了哦，请您尽快兑换礼品！")
        }

        if (this.count === 0) {//游戏次数用完
          return this.$store.commit("setState", {gameStatus: -4})
        }

        this.$store.commit("setState", {gameStatus: 3})
        this.ConnetSocket()
      })
    },
    ConnetSocket(){//连接socket
      if (this.socketStatus) {
        this.disSocket()
      }
      if (socket === null) {
        socket = createSocket(this)
      }
      let that = this
      let options = {
        // addr: "https://a03-pre-web.we-pj.com:1443",
        addr: window.location.origin + ":2053",
        urlObj: { 
          transports: ["websocket"], 
          query: {roomid:this.roomId, uid: userInfo.uid, channel: this.device}
        },
        connection() {
          console.log("socket连接成功！")
          that.$store.commit("setState", {gameStatus: 13})
          that.socketStatus = true
        },
        disconnect() {
          console.log("socket断开啦！")
          that.$store.commit("setState", {gameStatus: -13})
          that.socketStatus = false
        }
      }
      socket.connection(options)
    },
    startGame(){//开始游戏
      this.$store.commit("setState", {gameStatus: 4})
      if (this.endtime > 0) {//活动已经结束
        this.$store.commit("setState", {gameStatus: -3})
        return this.$toast("活动已经结束了！")//--
      }
      if (!this.isLogin) {//未登录
        return toLogin(this)//--
      }

      if (this.count <= 0) {//游戏次数不够
        return this.noCount()
      }

      if (Number(this.roomId) <= 0 || !this.socketStatus) {//游戏异常
        return this.$store.commit("setState", {gameStatus: -5})
      }

      this.$store.commit("setState", {gameStatus: 5})
      this.$http({
        url: "/live/api/mid_autumn/start_game",
        method: "POST",
        data: {roomId: this.roomId}
      }).then(res => {
        if (res.data.code === "room_not_exits") {//游戏异常
          return this.$store.commit("setState", {gameStatus: -6})
        }
        if (res.data.gameId === "thegameisnotover") {//游戏未结束
          return this.$store.commit("setState", {gameStatus: -7})
        }
        this.$store.commit("setState", {
          count: res.data.count,
          gameId: res.data.gameId,
          gameStatus: 6,
        })
      })
    },
    getDiceNum(){//获取点数
      this.$store.commit("setState", {gameStatus: 7})
      this.mask = true
      this.$http({
        url: "/live/api/mid_autumn/shaking",
        method: "POST",
        data: {
          roomId: this.roomId,
          gameId: this.gameId
        }
      }).then(res => {
        this.disSocket()
        if (res.code === "success" && res.data.gameId != null) {
          this.$store.commit("setState", {
            myReasult: {
              integral: res.data.integral,
              drawnType: res.data.drawnType,
            },
            gameId: res.data.gameId,
            roomId: res.data.roomId,
            dices: res.data.shakerNumberList,
            gameStatus: 8,
            showAnimation: true,
          })
          setTimeout(() => {
            this.mask = false
            this.$store.commit("setState", {
              showList: false,
              showAnimation: false,
              showReasult: true,
              gaming: false,
              integral: res.data.currentIntegral,
            })
          }, 3100)
        } else {
          this.mask = false
          return this.$store.commit("setState", {gameStatus: -8})
        }
      })
    },
    getRank(theType){//获取游戏排行
      this.mask = true
      this.$http({
        url: "/live/api/mid_autumn/query_current_integral_list",
        method: "POST",
        data: {
          roomId: this.roomId,
          gameId: this.gameId,
          pageSize: 20,
          pageNo: 1
        }
      }).then(res => {
        this.disSocket()
        if (res.data.myDrawnInfo.uid == null) {
          return this.$store.commit("setState", {gameStatus: -9})
        }
        if (theType && theType === "timeover") {
          this.$store.commit("setState", {
            myReasult: {
              integral: res.data.myDrawnInfo.integral,
              drawnType: res.data.myDrawnInfo.drawnType,
            },
            dices: [...res.data.myDrawnInfo.shakingValue.split(',')],
            gameStatus: 8,
            showAnimation: true,
          })
          setTimeout(() => {
            this.mask = false
            this.$store.commit("setState", {
              showAnimation: false,
              showReasult: true,
              gaming: false,
              showList: false,
              integral: res.data.currentIntegral,
            })
          }, 3100)
        } else {
          this.mask = false
          this.$store.commit("setState", {
            myReasult: {
              avatar: res.data.myDrawnInfo.avatar,
              integral: res.data.myDrawnInfo.integral,
              drawnType: res.data.myDrawnInfo.drawnType,
              sort: res.data.myDrawnInfo.sort,
              count: res.data.myDrawnInfo.count,
              username: res.data.myDrawnInfo.username,
            },
            multiReasult: res.data.drawnList,
            showList: true,
            gameStatus: 9,
            integral: res.data.currentIntegral
          })
        }
      })
    },
    getEndTime(){//获取开始结束时间
      this.$http({
        url: "/live/api/mid_autumn/get_game_rules",
        method: "GET"
      }).then(res => {
        this.$store.commit('setState', {
          starttime: (new Date().getTime() - Number(res.data.gameStartTime || 1600000000000)) / 86400000,
          endtime: (new Date().getTime() - Number(res.data.gameEndTime || 1600000000000)) / 86400000
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import "~@/style/h5common.scss";
body {
  background: linear-gradient(to bottom, #eb5d2d, #e94b26);
  background-attachment:fixed;
}
#app {
  position: relative;
  @include wh(100%, auto);
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  &.with_nav {
    padding-bottom: 16vw;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  @include wh(100%, 100%);
  z-index: 10000;
}
</style>
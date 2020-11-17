import Socket from './socketclient'

let timer = null
export default function createSocket(that){
  return new Socket().registerHandles({
    error() {
      that.$confirm("进入房间失败，是否重试？", "连接失败", {
        confirmButtonText: '回到游戏',
        cancelButtonText: '重开一局',
        type: "warning",
      }).then(() => {
        that.initGame()
      }).catch(() => {
        that.$router.push({ path: '/', query: {} })
        that.$nextTick(() => {
            that.initGame()
        })
      })
    },
    /**加入房间后*/
    join_room_ok(data) {
      // Utils.logger("SocketClient-join_room_ok", data)
      that.$store.commit("setState", {
        userList: [...data.body]
      })
    },
    /**退出房间后*/
    exit_room_ok(data) {
        // Utils.logger("SocketClient-exit_room_ok", data)
      that.$store.commit("setState", {
        userList: [...data.body]
      })
    },
    /**开始游戏*/
    game_start(data) {
      console.log('路由名称：',that.$route.name)
      if (that.gameType === "multi") {
        if (that.$route.name != 'Home') {
          that.$confirm("30秒后系统将自动帮你投掷骰子，请立即回到游戏中","游戏已经开始了",{
          }).then(() => {
            that.$router.push({path:"/",query:{id: that.roomId}})
          })
        } else {
          that.$message("游戏开始了，请点击摇出骰子吧！")
        }
        let count = 30, _user = {}
        for (var i = 0; i < data.body.users.length; i++) {
          if (data.body.users[i].uid == userInfo.uid) {
            _user = { ...data.body.users[i] }
          }
        }
        that.$store.commit("setState", {
          gaming: true,
          roomId: data.headers.roomId,
          gameId: data.body.gameId,
          notyet: false,
          gameCountDown: count,
          userInfo: _user
        })
        timer = setInterval(() => {
          if (count <= 0 || that.gameCountDown <= 0) {
            clearInterval(this.timer)
            let sr = that.notyetTag
            that.$store.commit("setState", {
              notyet: false,
              gaming: false,
              gameCountDown: 0,
              showReasult: sr
            })
          }
          that.$store.commit("setState", {
            gameCountDown: count--
          })
        }, 1000)
      }
    },
    /**结束游戏*/
    game_end(data) {
      clearInterval(timer)
      that.$store.commit("setState", {
          notyet: false,
          gaming: false,
          gameCountDown: 0,
      })
      if (!that.showReasult) {
          that.getRoomDice()
      }
      that.socket.disconnect()
      that.socket = null
    },
    /**被动开始游戏时次数不够*/
    counts_not_enough(data) {
      // console.log(that.mine)
      that.$store.commit("setState", {
        userList: [...[that.mine]],
        withMulti: new Date().getTime()
      })
      // Utils.logger("SocketClient-counts_not_enough", data)
      this.socket.disconnect()
      that.$store.commit("setState", {
        gaming: false,
        userList: [...[that.userInfo]]
      })
      that.$confirm(data.body, '提示', {
        confirmButtonText: '去充值',
      }).then(() => {
        that.$router.push({ path: '/charge' })
      })
    },
    kick(data) {
      that.$store.commit("setState", {
        gaming: false,
        userList: [...[that.userInfo]],
        showReasult: false,
        gameType: "single",
      })
      that.$confirm(data.body || '你已经在其他端的游戏房间里了，请立即回到<br>该游戏房间开始游戏喔~', "提示", {
        confirmButtonText: '我知道了',
        type: "warning",
      }).then(() => {
        that.$router.push({ path: '/', query: {} })
        that.$nextTick(() => {
          console.log(that.$route.query)
          that.init()
        }, 50)
      })
    }
  })
}
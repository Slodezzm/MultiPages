import Socket from './socketclient'

export default function createSocket(that) {
  // this.timer = null
  return new Socket().registerHandles({
    error() {
      that.socketDisConnect()
      that.$store.commit("setState", { gameStatus: -10 })
    },
    /**加入房间后*/
    join_room_ok(data) {
      that.$store.commit("setState", {
        showReasult: false,
        gaming: false,
        userList: [...data.body]
      })
    },
    /**退出房间后*/
    exit_room_ok(data) {
      if (!that.gaming) {
        that.$store.commit("setState", {
          userList: [...data.body]
        })
      }
    },
    /**开始游戏*/
    game_start(data) {
      if (data.body.users && typeof(data.body.users) === "object") {
        for(var k in data.body.users){
          if (k === userInfo.uid) {
            that.$store.commit("setState", {
              count: data.body.users[k].count
            })
          }
        }
      }
      that.$store.commit("setState", {
        gaming: true,
        roomId: data.headers.roomId,
        gameId: data.body.gameId,
        countdown: 30,
        gameStatus: 10,
      })
    },
    /**结束游戏*/
    game_end(data) {
      that.$store.commit("setState", {
        gaming: false,
        countdown: 0,
        gameStatus: 11,
      })
    },
    /**被动开始游戏时次数不够*/
    counts_not_enough(data) {
      that.$store.commit("setState", {gameStatus: -11})
    },
    kick(data) {
      that.$store.commit("setState", {gameStatus: -12})
    }
  })
}
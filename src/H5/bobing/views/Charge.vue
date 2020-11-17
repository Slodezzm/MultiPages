<template>
  <div class="charge">
    <!-- <back /> -->
    <div class="charge_box">
      <div class="box">
        <p class="title">钻石充值<span class="count">剩余次数&nbsp;{{count}}</span></p>
        <ul class="diamond">
          <li class="item" :class="{act: degree == 1}" @click="diamond = chargeData.consumeDiamond; degree = 1">
            <p class="amount">{{chargeData.consumeDiamond}}钻石</p>
            <span class="diamond_ico"></span>
            <p class="times">充值1次</p>
          </li>
          <li class="item" :class="{act: degree == 3}" @click="diamond = chargeData.threeConsumeDiamond; degree = 3">
            <p class="amount">{{chargeData.threeConsumeDiamond}}钻石</p>
            <span class="diamond_ico"></span>
            <p class="times">充值3次</p>
          </li>
          <li class="item" :class="{act: degree == 5}" @click="diamond = chargeData.fifteenConsumeDiamond; degree = 5">
            <p class="amount">{{chargeData.fiveConsumeDiamond}}钻石</p>
            <span class="diamond_ico"></span>
            <p class="times">充值5次</p>
          </li>
          <li class="item" :class="{act: degree == 10}" @click="diamond = chargeData.tenConsumeDiamond; degree = 10">
            <p class="amount">{{chargeData.tenConsumeDiamond}}钻石</p>
            <span class="diamond_ico"></span>
            <p class="times">充值10次</p>
          </li>
          <li class="item" :class="{act: degree == 15}" @click="diamond = chargeData.fifteenConsumeDiamond; degree = 15">
            <p class="amount">{{chargeData.fifteenConsumeDiamond}}钻石</p>
            <span class="diamond_ico"></span>
            <p class="times">充值15次</p>
          </li>
          <li class="item" :class="{act: degree == 20}" @click="diamond = chargeData.twentyConsumeDiamond; degree = 20">
            <p class="amount">{{chargeData.twentyConsumeDiamond}}钻石</p>
            <span class="diamond_ico"></span>
            <p class="times">充值20次</p>
          </li>
        </ul>
        <div class="pay_with_diamond" v-if="endtime <= 0" @click="payfor">{{diamond > 0 ? ('支付' + diamond + '钻石') : '充值'}}</div>
        <p class="title">游戏任务</p>
        <ul class="mission" v-if="gotData">
          <li class="item" v-for="(item, i) in chargeData.taskList" :key="'task-' + i">
            <span class="mission_ico"></span>
            <div class="detail">
              <p class="mission_title">{{item.taskName}}</p>
              <div class="h_m_t">
                <span>{{item.finishQuota + '/' + item.canFinishCount}}次</span>
                <span class="will_get">{{item.rewardGameNumber}}次游戏</span>
              </div>
            </div>
            <div class="doit doit0" v-if="item.status == 0" @click="doit(i)" :class="'doit' + item.status"><span class="text">去完成</span><span class="trible">▸</span></div>
            <div class="doit doit1" v-else>已奖励{{item.rewardGameNumber}}次</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { toLogin } from "@/common/unit"
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showNav: true,
      chargeData: {},
      gotData: false,
      diamond: 0,
      degree: 1
    }
  },
  computed: { ...mapState(["isLogin", "gameType", "withMulti", "endtime", "roomId", "count"]) },
  methods: {
    getChargeList(){
      this.$http({
        url: "/live/api/mid_autumn/init_data",
        method: "GET"
      }).then(res => {
        if (res.code === "success") {
          this.chargeData = {...res.data}
          this.diamond = res.data.consumeDiamond
          this.gotData = true
        } else {
          this.$toast(err.msg || "初始化信息失败，请稍后重试！")
        }
      })
    },
    doit(i) {
      if (this.chargeData.taskList[i].status === 1) {
        return false
      }
      if (this.isLogin) {
        if (window.navigator.userAgent.toLowerCase().indexOf("kinglive") === -1) {
          let url = ['/H5/page/#/?id=1', '/index.php?g=h5&m=shortvideo&a=index']
          if (url[i]) {
            window.location.href = url[i]
          } else {
            this.$dialog({
              title: "温馨提示",
              message: "请前往APP端完成！"
            }).then(() => {
              window.location.href = "/topic/H5/appDownload/"
            })
          }
        } else {
          let data = {"jumpType": i, "requestPage": "zqbb"}
          data = JSON.stringify(data)
          if (navigator.userAgent.indexOf('Android') > -1) {
            window.app.jsTaskJump(data)
          } else {
            window.webkit.messageHandlers.jsTaskJump.postMessage(data)
          }
        }
      } else {
        toLogin(this)
      }
    },
    payfor(){
      if (this.isLogin) {
        this.$http({
          url: "/live/api/mid_autumn/recharge",
          method: "POST",
          data: {
            count: this.degree,
            diamonds: this.diamond
          }
        }).then(res => {
          if (res.code != "success") {
            return this.$toast(res.msg || "请求失败，请稍后重试！")
          }
          this.$dialog({
            title: "充值成功",
            message: "是否跳转到游戏首页？",
            showCancelButton: true
          }).then(() => {
            if (this.gameType === 'multi') {
              this.$router.push({path:'/', query: {id: this.roomId}})
              this.$parent.initGame()
            } else {
              this.$router.push({path:'/', query: {}})
              this.$parent.initGame()
            }
          }).catch(() => {
            window.location.reload()
          })
        })
      } else {
        toLogin(this)
      }
    }
  },
  mounted() {
    this.getChargeList()
  },
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.charge {
  @include rule;
  min-height: calc(100vh - 16vw);
  background: url("~@/assets/bobing/otherbg.png") no-repeat top center/100% auto, #e94b26;
  background-attachment:fixed;
  padding: 12.3vw 4.3vw 0 4.3vw;
  .charge_box {
    @include rule;
    background: transparent;
    margin-top: 4.7vw;
    padding: 5px;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      @include wh(100%, 100%);
      border: 3px solid #FFDAA1;
      border-radius: 20px;
      box-sizing: border-box;
    }
    .box {
      @include rule;
      background: #FDFEEB;
      border-radius: 15px;
      text-align: left;
      line-height: 5.6vw;
      font-size: 3.2vw;
      color: #777;
      padding: 5vw;
      font-weight: 400;
      .title {
        position: relative;
        @include wh(100%, auto);
        padding-left: 2.5vw;
        font-size: 3.7vw;
        line-height: 5.3vw;
        text-align: left;
        font-weight: bold;
        color: #333;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          @include wh(1vw, 5.3vw);
          background: #F94048;
          border-radius: 0.5vw;
        }
        .count {
          position: absolute;
          right: 0;
          top: 0;
          @include wh(auto,auto);
          font-size: 3.2vw;
          color: #F94048;
          line-height: 5.3vw;
          font-weight: 400;
        }
      }
      .diamond {
        @include rule;
        margin-top: 2.7vw;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .item {
          position: relative;
          @include wh(32%, 28vw);
          margin-right: 2%;
          margin-bottom: 2%;
          // border: 1px solid #F8513D;
          border-radius: 8px;
          background: #FFF4D0;
          @include fc;
          flex-direction: column;
          font-size: 3.7vw;
          font-weight: 400;
          color: #F8513D;
          &.act {
            border: 1px solid #F8513D;
            background: url("~@/assets/bobing/choice_add.png") no-repeat right bottom/5.4vw 5.6vw, #FFF4D0;
          }
          &:nth-child(3n) {
            margin-right: 0;
          }
          .diamond_ico {
            display: block;
            @include vwh(10, 10);
            background: url("~@/assets/bobing/diamond.png") no-repeat center/contain;
            margin: 1vw auto;
          }
          .times {
            font-weight: bold;
          }
        }
      }
      .pay_with_diamond {
        position: relative;
        @include vwh(50, 10);
        margin: 5.3vw auto;
        border-radius: 5vw;
        background: #F8513D;
        text-align: center;
        line-height: 10vw;
        font-size: 4.5vw;
        color: #FFF;
        font-weight: 500;
        &:active {
          transform: scale(0.9);
        }
      }
      .mission {
        @include rule;
        margin-top: 2.7vw;
        .item {
          position: relative;
          @include wh(100%, 9vw);
          @include fs;
          margin-bottom: 2.7vw;
          &:nth-child(1) .mission_ico {
            background-position-y: 0;
          }
          &:nth-child(2) .mission_ico {
            background-position-y: -8.7vw;
          }
          &:nth-child(3) .mission_ico {
            background-position-y: -17.4vw;
          }
          .mission_ico {
            @include vwh(8.7, 8.7);
            background-image: url("~@/assets/bobing/task.png");
            background-repeat: no-repeat;
            background-size: 100% 300%;
            background-position-x: 0;
          }
          .doit {
            position: relative;
            @include vwh(19.5, 6.2);
            border-radius: 3.1vw;
            background:linear-gradient(180deg,rgba(229,61,44,1) 0%,rgba(253,91,68,1) 59%,rgba(226,31,30,1) 100%);
            color: #FFF;
            font-size: 3.2vw;
            text-align: center;
            @include fc;
            &:active {
              transform: scale(0.9);
            }
            &.doit1 {
              background: #FFF4D0;
              color: #F8513D;
            }
            .trible {
              margin-left: 1vw;
              font-size: 5vw;
            }
          }
          .detail {
            position: relative;
            flex: 1;
            height: auto;
            margin: 0 1.2vw;
            .mission_title {
              position: relative;
              @include wh(100%, 5vw);
              text-align: left;
              line-height: 5vw;
              font-size: 3.7vw;
              color: #333;
              font-weight: 400;
            }
            .h_m_t {
              position: relative;
              @include wh(100%, 4vw);
              text-align: left;
              line-height: 4vw;
              font-size: 3.2vw;
              color: #888;
              font-weight: 400;
              .will_get {
                color: #F8513D;
                margin-left: 3vw;
              }
            }
          }
        }
      }
    }
  }
}
</style>
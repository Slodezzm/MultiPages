<template>
  <div class="Home">
    <!-- 分享 -->
    <div class="fenxian" v-if="!gaming && endtime >= 0 && notyet" @click="share(0)">
      <img src="@/assets/bobing/PC/fenxian.png" alt />
    </div>
    <!-- 游戏次数 -->
    <div class="userInfo">
      <div class="avatar">
        <img v-lazy="UAVATAR" data-avatar="1" alt />
      </div>
      <div class="numBox">
        <div>剩余游戏次数</div>
        <div class="num">{{count  || 0}}</div> 
        <div class="line"></div>
        <div>积分</div>
        <div class="num">{{integral  || 0}}</div>
      </div>
    </div>
    <!-- 音效图 -->
    <div class="music" @click="$store.commit('setState', {mute: !mute})">
      <img v-if="mute" src="@/assets/bobing/PC/jingyin.png" alt />
      <img v-else src="@/assets/bobing/PC/shengyin.png" alt />
    </div>
    <!--  -->
    <div class="wan">
      <div class="show123" v-if="countdown > 0 && countdown < 4 && gaming">{{countdown}}</div>
      <div class="box">
        <span v-for="(item, i) in dices" class="dice" :key="'dice-' + i" :class="showAnimation ? ('dice' + item + ' diceRoll' + (i + 1)) : ('dice' + item)"></span>
      </div>
      <div class="restart" v-if="gameType === 'multi'" @click="$parent.restart"></div>
    </div>
    <router-link to="/rule" class="rule"></router-link>
    <div class="start" @click="$parent.startGame" v-if="gameType === 'single' || !gaming"></div>
    <div class="shake" v-if="gaming" @click="$parent.getDiceNum"></div>
    <!-- 游戏详情 -->
    <!-- <game-detail v-if="showgameDetail" :roomId="9" :gameId="999" /> -->
    <div class="invite">
      <ul class="userlist">
        <template v-for="(item, i) in userList">
          <li class="item" v-if="i < 5" :key="'ul-' + item.uid">
            <img v-lazy="item.avatar" data-avatar="1" class="user_avatar">
            <p class="user_name">{{item.username}}</p>
          </li>
        </template>
      </ul>
      <transition name="fade">
        <div class="notyet" v-if="notyet">
          <span class="clock"></span>
          <p class="notyet_text">
            温馨提示：游戏还有<span class="count">0:{{countdown}}</span>秒结束，<br>
            游戏结束才可以再来一局，请您耐心等待喔
          </p>
          <div class="bts">
            <input type="button" value="查看游戏详情" class="detail" @click="$store.commit('setState', {showReasult: true})">
            <input type="button" value="重开一局" v-if="countdown > 0" class="detail" @click="$parent.restart">
          </div>
        </div>
      </transition>
      <div class="moreuser" @click="showUserBox = true" v-if="userList.length > 5"></div>
      <div class="invite_friend" v-if="!gaming && notyet" @click="share(1)">
        <div class="btn"></div>
        <p class="btn_text">邀请好友</p>
      </div>
    </div>
    <transition name="fade">    
      <div class="user_box" v-if="showUserBox">
        <div class="userlist">
          <span class="close_user" @click="showUserBox = false"></span>
          <ul class="userlist_box">
            <template v-for="item in userList">
              <li class="item" :key="'ul-' + item.uid">
                <img v-lazy="item.avatar" data-avatar="1" class="user_avatar">
                <p class="user_name">{{item.username}}</p>
              </li>
            </template>
          </ul>
          <div class="close_user2" @click="showUserBox = false">关闭</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import gameDetail from "@/PC/bobing/components/gameDetail.vue";
import { mapState } from 'vuex'
import { _copyText } from "@/common/unit"
export default {
  computed: {
    ...mapState(["UAVATAR", "isLogin", "roomId", "count", "gameType", "showAnimation", "dices", "userList", "mute", "shareLink", "gaming", "notyet", "countdown", "endtime", "integral"])
  },
  data() {
    return {
      // shareShow: false,
      showUserBox: false,
      timer: null
    };
  },
  methods: {
    share(i){
      if (i == 1 && this.count === 0) {
        return this.$message("您的次数已用完，充值后再来邀请好友哦~")
      }
      let invite = window.location.origin + window.location.pathname + '#/?k_q=5'
      if (i == 1 && this.roomId != 0) {
        invite += "&id=" + this.roomId
        this.$parent.disSocket()
        this.$parent.initGame(this.roomId)
      }
      const h = this.$createElement
      let bools = _copyText(invite)
      this.$msgbox({
        title: "邀请好友",
        message: h('div',{class:'invite'}, [
          h('div', {class:'invite_ipt'}, invite),
          h('p', {class:'invite_p'},'复制此条链接发送给你的好友，即可邀请Ta一起中秋博饼！')
        ]),
        confirmButtonText: "复制链接",
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$message({
              type: bools ? 'success' : 'info',
              message: bools ? '复制成功，去跟好友分享吧！' : '复制失败，请您手动选中后复制！'
            })
          }
          done()
        }
      })
    }
  },
  mounted(){
    console.log(this.notyet)
  }
};
</script>

<style lang="scss" scoped>
@import "~@/style/common.scss";
.Home {
  width: 1096px;
  height: 1061px;
  margin: 0 auto;
  background: url("../../../assets/bobing/PC/bg_game.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 69px;
  position: relative;
  .fenxian {
    width: 116px;
    height: 188px;
    position: absolute;
    top: 0;
    right: 85px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .userInfo {
    position: relative;
    display: flex;
    // align-items: center;
    padding-top: 62px;
    margin-left: 103px;
    .avatar {
      position: absolute;
      left: -18px;
      top: 55px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      border: 4px solid #fd6c00;
      background: #fff;
      img {
        width: 54px;
        height: 54px;
        border-radius: 50%;
      }
    }
    .numBox {
      display: flex;
      font-size: 17px;
      font-family: Microsoft YaHei;
      line-height: 22px;
      align-items: center;
      color: #831a06;
      background: #fdd493;
      border: 4px solid #fd6c00;
      padding-left: 54px;
      height: 48px;
      border-radius: 0 24px 24px 0;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.13);
      .num {
        font-size: 23px;
        line-height: 30px;
        padding: 0 22px 0 9px;
      }
      .line {
        @include wh(1px,20px);
        margin-right: 22px;
        background: #831a06;
      }
    }
  }
  .music {
    position: absolute;
    left: 8px;
    top: 211px;
    width: 62px;
    height: 48px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .wan {
    position: relative;
    width: 742px;
    height: 500px;
    background: url("../../../assets/bobing/PC/wan.png") no-repeat;
    background-size: 100% 100%;
    margin: 50px auto 0;
    .restart {
      position: absolute;
      right: -140px;
      bottom: 50px;
      @include wh(98px, 98px);
      background: url("~@/assets/bobing/restart2.png") no-repeat center/contain;
      cursor: pointer;
      &:active {
        transform: scale(0.9);
      }
    }
    .show123 {
      position: absolute;
      left: 50%;
      top: -63px;
      @include wh(136px,136px);
      margin-left: -63px;
      background: #f8513d;
      border: 5px solid #f5d94f;
      border-radius: 50%;
      line-height: 126px;
      font-size: 72px;
      font-weight: bold;
      color: #FFF;
      text-align: center;
      z-index: 5;
      box-sizing: border-box;
    }
    .box {
      position: relative;
      @include wh(458px, 332px);
      // border: 1px solid #CCC;
      margin: 0 auto;
      .dice {
        position: absolute;
        @include wh(62px, 68px);
        background-image: url("~@/assets/bobing/dices.png");
        background-repeat: no-repeat;
        background-size: 200% 300%;
        color: blue;
        &:nth-child(1) {
          top: 125px;
          left: 116px;
        }
        &:nth-child(2) {
          top: 112px;
          left: 190px;
        }
        &:nth-child(3) {
          top: 125px;
          left: 264px;
        }
        &:nth-child(4) {
          top: 200px;
          left: 116px;
        }
        &:nth-child(5) {
          top: 210px;
          left: 190px;
        }
        &:nth-child(6) {
          top: 200px;
          left: 264px;
        }
        &.dice1 {
          background-position: 0 0;
        }
        &.dice2 {
          background-position: -62px 0;
        }
        &.dice3 {
          background-position: 0 -68px;
        }
        &.dice4 {
          background-position: -62px -68px;
        }
        &.dice5 {
          background-position: 0 -136px;
        }
        &.dice6 {
          background-position: -62px -136px;
        }
        &.diceRoll1 {
          animation: diceRoll1 2s linear 1 forwards;
        }
        &.diceRoll2 {
          animation: diceRoll2 2s linear 1 forwards;
        }
        &.diceRoll3 {
          animation: diceRoll3 2s linear 1 forwards;
        }
        &.diceRoll4 {
          animation: diceRoll4 2s linear 1 forwards;
        }
        &.diceRoll5 {
          animation: diceRoll5 2s linear 1 forwards;
        }
        &.diceRoll6 {
          animation: diceRoll6 2s linear 1 forwards;
        }
      }
    }
  }
  .rule {
    display: block;
    position: relative;
    @include wh(182px, 49px);
    background: url("~@/assets/bobing/PC/btn_rule.png") no-repeat center/contain;
    margin: 0 auto;
  }
  .start, .shake {
    position: relative;
    @include wh(302px,94px);
    background: url("~@/assets/bobing/PC/btn_start.png") no-repeat center/contain;
    margin: 0 auto;
    margin-top: 32px;
    cursor: pointer;
    &:active {
      transform: scale(0.9);
    }
  }
  .shake {
    background-image: url("~@/assets/bobing/PC/btn_shake.png");
  }
  .invite {
    position: relative;
    @include wh(100%, auto);
    @include fc;
    margin-top: 68px;
    .userlist {
      position: relative;
      @include wh(auto, auto);
      @include fc;
      .item {
        position: relative;
        @include wh(60px, auto);
        margin: 0 10px;
        .user_avatar {
          display: block;
          @include wh(60px, 60px);
          border-radius: 50%;
          border: 3px solid #FDD493;
          box-sizing: border-box;
        }
        .user_name {
          position: relative;
          @include wh(60px, 21px);
          text-align: center;
          line-height: 21px;
          margin-top: 10px;
          font-size: 14px;
          color: #FFF;
          font-weight: 400;
          @include omit(1);
        }
      }
    }
    .moreuser {
      position: relative;
      @include wh(30px, 30px);
      background: url("~@/assets/bobing/more.png") no-repeat center/cover;
      margin-left: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
      &:active {
        transform: scale(0.9);
      }
    }
    .invite_friend {
      position: relative;
      @include wh(auto, auto);
      margin-left: 20px;
      .btn {
        position: relative;
        @include wh(60px, 60px);
        background: url("~@/assets/bobing/close_score.png") no-repeat center/cover;
        transform: rotate(-45deg);
      }
      .btn_text {
        position: relative;
        @include wh(60px, 21px);
        text-align: center;
        line-height: 21px;
        margin-top: 10px;
        font-size: 14px;
        color: #FFF;
        font-weight: 400;
        @include omit(1);
      }
    }
  }
  .user_box {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10000000;
    @include wh(100%, 100%);
    background: rgba(0, 0, 0, 0.3);
    @include fc;
    .userlist {
      position: relative;
      @include wh(493px, 507px);
      background: url("~@/assets/bobing/PC/cyyxyh.png") no-repeat center/contain;
      padding: 90px 30px;
      box-sizing: border-box;
      .close_user {
        position: absolute;
        right: 15px;
        top: 15px;
        @include wh(18px, 18px);
        background: url("~@/assets/bobing/close.png") no-repeat center/contain;
        cursor: pointer;
        &:hover {
          transform: scale(1.1);
        }
        &:active {
          transform: scale(0.9);
        }
      }
      .userlist_box {
        position: relative;
        @include wh(100%, 100%);
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        &::-webkit-scrollbar {
          display: none;
        }
        .item {
          position: relative;
          @include wh(60px, 90px);
          margin-bottom: 10px;
          margin-right: 14.5px;
          &:nth-child(6n) {
            margin-right: 0;
          }
          .user_avatar {
            display: block;
            @include wh(60px, 60px);
            border-radius: 50%;
          }
          .user_name {
            position: relative;
            @include wh(100%, 20px);
            font-size: 14px;
            color: #333;
            line-height: 20px;
            margin-top: 10px;
            @include omit(1);
          }
        }
      }
      .close_user2 {
        position: absolute;
        bottom: 30px;
        left: 50%;
        @include wh(180px, 46px);
        margin-left: -90px;
        background: #ED7C41;
        text-align: center;
        line-height: 46px;
        border-radius: 23px;
        color: #FFF;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          transform: scale(1.1);
        }
        &:active {
          transform: scale(0.9);
        }
      }
    }
  }
  .notyet {
    position: absolute;
    left: 50%;
    bottom: 130px;
    @include wh(391px, 205px);
    margin-left: -195px;
    border-radius: 8px;
    border: 3px solid #F5D94F;
    background: #FFF;
    z-index: 3;
    @include fc;
    flex-direction: column;
    .clock {
      @include wh(50px, 50px);
      background: url("~@/assets/bobing/shalou.png") no-repeat center/contain;
      margin-bottom: 5px;
    }
    .notyet_text {
      font-size: 16px;
      color: #333;
      text-align: center;
      line-height: 24px;
      margin-bottom: 5px;
      .count {
        color: #F8513D;
        font-size: 20px;
        margin: 0 5px;
      }
    }
    .bts {
      @include rule;
      @include fc;
      .detail {
        @include wh(auto, 36px);
        border-radius: 18px;
        background: #E94B26;
        color: #FFF;
        padding: 0 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: 36px;
        margin: 0 10px;
      }
    }
  }
}
</style>
<style>
.invite .invite_ipt {
  position: relative;
  width: 100%;
  height: auto;
  line-height: 24px;
  background: #EEE;
  border-radius: 3px;
  padding: 12px 5px !important;
  word-break: break-all;
  font-size: 12px;
  color: #333;
}
</style>
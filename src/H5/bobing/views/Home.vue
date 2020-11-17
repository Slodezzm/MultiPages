<template>
  <div class="home">
    <div class="user_info">
      <div class="avatar">
        <img v-lazy="UAVATAR" data-avatar="1" class="avatar_pic">
      </div>
      <p class="residue" v-if="isLogin">剩余次数<span class="residue_num">{{count || 0}}</span>积分<span class="residue_num">{{integral || 0}}</span></p>
      <div class="unlogin" v-else>点击登录<span class="login" @click="Login">登录</span></div>
    </div>
    <float @share-show="shareShow('share')" @restart="$parent.restart" />
    <!-- 悬浮部分分割线 -->
    <div class="top">
      <div class="title"></div>
      <div class="bowl">
        <div class="show123" v-if="countdown > 0 && countdown < 4 && gaming">{{countdown}}</div>
        <div class="box">
          <span v-for="(item, i) in dices" class="dice" :key="'dice-' + i" :class="showAnimation ? ('dice' + item + ' diceRoll' + (i + 1)) : ('dice' + item)"></span>
        </div>
      </div>
      <div class="start" v-if="!gaming" @click="$parent.startGame"></div>
      <div class="shake" v-else @click="$parent.getDiceNum"></div>
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
    </div>
    <div class="user_list">
      <ul class="list">
        <template v-for="(item, i) in userList">
          <li class="user" :key="item.uid" v-if="i < 4">
            <img v-lazy="item.avatar" data-avatar="1" class="user_avatar">
            <p class="user_name">{{item.username}}</p>
          </li>
        </template>
      </ul>
      <div class="show_more" @click="showMore = true" v-if="userList.length > 4"></div>
      <div class="invite" v-if="!gaming && notyet" @click="shareShow('invite')">
        <div class="invite_icon"></div>
        <p class="invite_text">邀请好友</p>
      </div>
    </div>
    <transition name="fade">
      <pop-up v-if="showMore" @close="showMore = false ">
        <ul class="list p5">
        <template v-for="(item, i) in userList">
          <li class="user" :key="'ls' + item.uid + i">
            <img v-lazy="item.avatar" data-avatar="1" class="user_avatar">
            <p class="user_name">{{item.username}}</p>
          </li>
        </template>
      </ul>
      </pop-up>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import float from '../components/float'
import popUp from '../components/public/popUp'
import { toLogin } from "@/common/unit"
export default {
  computed: {
    ...mapState(["UAVATAR", "isLogin", "roomId", "count", "gameType", "showAnimation", "dices", "userList", "mute", "shareLink", "gaming", "notyet", "countdown", "endtime", "integral"])
  },
  components: {
    // gameResult,
    float,
    popUp
  },
  data() {
    return {
      // showResult: false,//展示结果yy
      showShare: false,//展示分享面板
      shareType: 'share',//分享类型
      showMore: false,//打开用户列表面板
    }
  },
  methods: {
    Login(){
      toLogin(this, 0)
    },
    shareShow (type) {
      if (!this.isLogin && type != 'share') {
        return toLogin(this)
      }
      let shareLink = window.location.origin + window.location.pathname + '#/?k_q=5', posterType = "1"
      if (type != "share") {
        shareLink += '&id=' + this.roomId
        posterType = "2"
        this.$store.commit("setState", {gameType: "multi"})
        if (window.location.href.indexOf('?id=') === -1 && window.location.href.indexOf('&id=') === -1) {
          this.$router.push({path:"/",query:{id:this.roomId}})
        }
      }
      if (navigator.userAgent.toLowerCase().indexOf("kinglive") > -1) {
        if (navigator.userAgent.includes("kinglive-ios")) {
          window.webkit.messageHandlers.jsSharePosterImage.postMessage(JSON.stringify({
            posterType: posterType,
            qrCodeUrl: shareLink
          }))
        } else {
          window.app.jsSharePosterImage(JSON.stringify({
            posterType: posterType,
            qrCodeUrl: shareLink
          }))
        }
      } else {
        this.$store.commit("setState", {
          shareType: type || 'share',
          showShare: true,
          shareLink: shareLink
        })
        console.log('123456+')
      }
    },
  },
  mounted(){
    console.log(this.notyet)
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.home {
  @include rule;
  min-height: calc(100vh - 16vw);
  .user_info {
    position: fixed;
    left: 2.8vw;
    top: 2vw;
    @include wh(auto, 11.5vw);
    z-index: 2;
    .avatar {
      position: absolute;
      left: 0;
      top: 0;
      @include vwh(11.5, 11.5);
      border-radius: 50%;
      border: 3px solid #FD6C00;
      background: #FD6C00;
      @include fc;
      z-index: 2;
      .avatar_pic {
        display: block;
        @include wh(100%, 100%);
        border-radius: 50%;
      }
    }
    .residue, .unlogin {
      position: relative;
      @include wh(auto, 8.7vw);
      padding-left: 13vw;
      border-radius: 4.35vw;
      border: 3px solid #FD6C00;
      background: #FDD493;
      font-size: 3.2vw;
      color: #831A06;
      @include fs;
      margin-top: 1.4vw;
      font-weight: 400;
      .residue_num {
        position: relative;
        font-size: 4vw;
        margin: 2vw;
        &:nth-child(1){
          margin-right: 4vw; 
          &::before {
            content: "";
            position: absolute;
            right: -2vw;
            top: 50%;
            @include wh(1px, 4vw);
            margin-top: -2vw;
            background: #831A06;
          }
        }
      }
      .login {
        display: block;
        position: relative;
        @include wh(auto, 6.4vw);
        border-radius: 3.2vw;
        padding: 0 3vw;
        background: #FD6C00;
        color: #FFF;
        font-size: 3.2vw;
        font-weight: 400;
        line-height: 6.4vw;
        margin-left: 3vw;
        margin-right: 2px;
      }
    }
    .residue {
      padding-right: 3vw;
    }
  }
  .top {
    position: relative;
    @include wh(100%, 126vw);
    background: url("~@/assets/bobing/bg.png") no-repeat left top/contain;
    padding-top: 15.1vw;
    .title {
      position: relative;
      @include vwh(59.2, 19.6);
      background: url("~@/assets/bobing/text.png") no-repeat center/contain;
      margin: 0 auto;
    }
    .bowl {
      position: relative;
      @include vwh(84.7, 67.1);
      background: url("~@/assets/bobing/bowl.png") no-repeat center/contain;
      margin-top: 5.3vw;
      padding-left: 21vw;
      padding-top: 3vw;
      padding-bottom: 18vw;
      .show123 {
        position: absolute;
        left: 50%;
        top: -12vw;
        @include vwh(24,24);
        background: #f8513d;
        border: 2vw solid #f5d94f;
        border-radius: 50%;
        line-height: 20vw;
        font-size: 8vw;
        font-weight: bold;
        color: #FFF;
        text-align: center;
        z-index: 5;
      }
      .box {
        position: relative;
        @include wh(100%, 100%);
        border-radius: 23vw;
        // border: 1px solid #DDD;
        .dice {
          position: absolute;
          @include vwh(9.7, 10.8);
          background-image: url("~@/assets/bobing/dices.png");
          background-repeat: no-repeat;
          background-size: 200% 300%;
          color: blue;
          &:nth-child(1) {
            top: 20vw;
            left: 15vw;
          }
          &:nth-child(2) {
            top: 18vw;
            left: 26vw;
          }
          &:nth-child(3) {
            top: 19.5vw;
            left: 37vw;
          }
          &:nth-child(4) {
            top: 28vw;
            left: 15vw;
          }
          &:nth-child(5) {
            top: 30vw;
            left: 26vw;
          }
          &:nth-child(6) {
            top: 29.5vw;
            left: 37vw;
          }
          &.dice1 {
            background-position: 0 0;
          }
          &.dice2 {
            background-position: -9.7vw 0;
          }
          &.dice3 {
            background-position: 0 -10.8vw;
          }
          &.dice4 {
            background-position: -9.7vw -10.8vw;
          }
          &.dice5 {
            background-position: 0 -21.6vw;
          }
          &.dice6 {
            background-position: -9.7vw -21.6vw;
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
    .start, .shake {
      position: absolute;
      left: 50%;
      bottom: -4vw;
      @include vwh(57.9, 17.9);
      margin-left: -28.95vw;
      background: url("~@/assets/bobing/start.png") no-repeat center/contain;
      z-index: 3;
      &:active {
        transform: scale(0.9);
      }
    }
    .shake {
      background-image: url("~@/assets/bobing/shakes.png");
    }
    .notyet {
      position: absolute;
      left: 12vw;
      bottom: -15vw;
      @include vwh(76, 40);
      border-radius: 5vw;
      border: 3px solid #F5D94F;
      background: #FFF;
      z-index: 3;
      @include fc;
      flex-direction: column;
      .clock {
        @include vwh(10.4, 10.4);
        background: url("~@/assets/bobing/shalou.png") no-repeat center/contain;
        margin-bottom: 2vw;
      }
      .notyet_text {
        font-size: 3.2vw;
        color: #333;
        text-align: center;
        line-height: 5.2vw;
        margin-bottom: 2vw;
        .count {
          color: #F8513D;
          font-size: 4.8vw;
          margin: 0 2vw;
        }
      }
      .bts {
        @include rule;
        @include fc;
        .detail {
          @include wh(auto, 7vw);
          border-radius: 3.5vw;
          background: #E94B26;
          color: #FFF;
          padding: 0 3.5vw;
          font-size: 3.6vw;
          font-weight: 400;
          line-height: 7.2vw;
          margin: 0 2vw;
        }
      }
    }
  }
  .user_list {
    @include rule;
    margin-top: 9vw;
    padding: 6vw;
    @include fs;
    .show_more {
      position: relative;
      @include vwh(6.4, 6.4);
      background: url("~@/assets/bobing/more.png") no-repeat center/contain;
      margin-left: 2vw;
      margin-right: 3.6vw;
      margin-bottom: 5.9vw;
    }
    .invite {
      position: relative;
      @include wh(10.7vw, auto);
      text-align: center;
      .invite_icon {
        @include vwh(10.7, 10.7);
        background: url("~@/assets/bobing/close_score.png") no-repeat center/contain;
        transform: rotate(-45deg);
      }
      .invite_text {
        font-size: 2.7vw;
        color: #FFF;
        font-weight: normal;
        line-height: 5.9vw;
        word-break: keep-all;
      }
    }
    .list .user .user_name {
      color: #FFF;
    }
  }
  .list {
    position: relative;
    @include wh(auto, auto);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    &.p5 {
      padding: 5vw;
    }
    &.with_pop {
      @include wh(88vw, auto);
      padding: 3vw;
      .user {
        margin-right: 2.97vw;
        margin-bottom: 2vw;
      }
    }
    .user {
      position: relative;
      @include wh(10.7vw, auto);
      text-align: center;
      margin-right: 2.7vw;
      &:last-child {
        margin-right: 0;
      }
      .user_avatar {
        display: block;
        @include vwh(10.7, 10.7);
        // background: url("~@/assets/bobing/close_score.png") no-repeat center/contain;
        border: 2px solid #FDD493;
        border-radius: 50%;
      }
      .user_name {
        @include vwh(10.7, 5.9);
        font-size: 2.7vw;
        color: #333;
        font-weight: normal;
        line-height: 5.9vw;
        @include omit(1);
      }
    }
  }
}
</style>
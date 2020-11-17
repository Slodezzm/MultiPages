<template>
  <div class="explain">
    <back />
    <div class="top">
      <p class="secondary">中秋博饼</p>
      <div class="title"></div>
      <div class="share" @click="showShare">分享游戏</div>
    </div>
    <div class="rules">
      <div class="box">
        <div class="title">规则详情</div>
        <div class="content" v-html="rule"></div>
      </div>
    </div>
    <div class="rules">
      <div class="box">
        <div class="line header">
          <div class="col0">官级</div>
          <div class="col1">别名</div>
          <div class="col2">特征</div>
          <div class="col3">积分</div>
        </div>
        <div class="line" v-for="(item, i) in diceRule" :key="'dr-' + i">
          <div class="col0">{{item.gj}}</div>
          <div class="col1">{{item.bm}}</div>
          <div class="col2">
            <span class="dice" v-for="(tz, ii) in item.tz" :key="'tz-' + i + ii" :class="'dice' + tz"></span>
          </div>
          <div class="col3">{{item.jf}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import back from "../components/public/back"
export default {
  components: {
    back,
  },
  data() {
    return {
      rule: "",
      diceRule:[
        {gj:"秀才", bm:'一秀', tz:[4, 0, 0, 0, 0, 0], jf: 10},
        {gj:"举人", bm:"二举", tz:[4, 4, 0, 0, 0, 0], jf: 20},
        {gj:"进士", bm:"四进", tz:[3, 3, 3, 3, 0, 0], jf: 40},
        {gj:"探花", bm:"三红", tz:[4, 4, 4, 0, 0, 0], jf: 60},
        {gj:"榜眼", bm:"对堂", tz:[1, 2, 3, 4, 5, 6], jf: 80},
        {gj:"状元", bm:"四红", tz:[4, 4, 4, 4, 0, 0], jf: 120},
        {gj:"状元", bm:"五子", tz:[3, 3, 3, 3, 3, 0], jf: 120},
        {gj:"状元", bm:"五红", tz:[4, 4, 4, 4, 4, 0], jf: 120},
        {gj:"状元", bm:"六勃黑", tz:[2, 2, 2, 2, 2, 2], jf: 120},
        {gj:"状元", bm:"遍地锦", tz:[1, 1, 1, 1, 1, 1], jf: 120},
        {gj:"状元", bm:"六勃红", tz:[4, 4, 4, 4, 4, 4], jf: 120},
        {gj:"状元", bm:"状元捕金花", tz:[4, 4, 4, 4, 1, 1], jf: 120},
      ],
      // showShare: false,
      rule: "",
    }
  },
  methods: {
    getRule(){
      this.$http({
        url: "/live/api/mid_autumn/get_game_rules",
        method: "GET"
      }).then(res => {
        if (res.code === "success") {
          this.rule = res.data.rules
        } else {
          this.$toast(res.msg || '请求失败！')
        }
      })
    },
    showShare(){
      console.log(123)
      this.$store.commit("setState", {
        showShare: true,
        shareLink: window.location.origin + window.location.pathname + '#/?k_q=5',
        shareType: "share"
      })
    }
  },
  mounted() {
    this.getRule()
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.explain {
  @include rule;
  min-height: 100vh;
  background: url("~@/assets/bobing/otherbg.png") no-repeat top center/100% auto, #e94b26;
  background-attachment:fixed;
  padding: 4.3vw;
  padding-top: 12.3vw;
  .top {
    @include rule;
    @include fs;
    flex-direction: column;
    .secondary {
      position: relative;
      @include wh(auto, auto);
      color: #FEFFEC;
      font-size: 4.3vw;
      line-height: 5.6vw;
      font-weight: 400;
    }
    .title {
      position: relative;
      @include vwh(53.6, 13.6);
      background: url("~@/assets/bobing/rules.png") no-repeat center/contain;
      margin: 1.2vw auto;
    }
    .share {
      position: relative;
      @include vwh(54.7, 10.5);
      background: url("~@/assets/bobing/title.png") no-repeat center/contain;
      font-size: 4.3vw;
      line-height: 10.5vw;
      font-weight: 400;
      color: #FFF;
      &:active {
        transform: scale(0.9);
      }
    }
  }
  .rules {
    @include rule;
    background: transparent;
    margin-top: 4.7vw;
    padding: 8px;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      @include wh(100%, 100%);
      border: 5px solid #FFDAA1;
      border-radius: 20px;
      box-sizing: border-box;
    }
    .box {
      @include rule;
      background: #FDFEEB;
      border-radius: 12px;
      text-align: left;
      line-height: 5.6vw;
      font-size: 3.2vw;
      color: #777;
      padding: 5vw;
      font-weight: 400;
      .title {
        position: relative;
        @include wh(100%, 5vw);
        font-size: 3.7vw;
        color: #333;
        line-height: 5vw;
        margin-bottom: 2.7vw;
        padding-left: 2vw;
        &::before{
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          @include wh(1vw, 5vw);
          background: #F94048;
          border-radius: 0.5vw;
        }
      }
      .line {
        position: relative;
        @include wh(100%, 9.5vw);     
        @include fs;
        font-size: 3.2vw;
        color: #333;
        font-weight: 400;
        line-height: 9.5vw;
        text-align: center;
        &.header {
          font-size: 3.7vw;
          color: #E8402F;
          font-weight: 600;
        }
        .col0 {
          position: relative;
          @include wh(auto, 100%);
          padding: 0 1vw;
        }
        .col1, .col3 {
          position: relative;
          @include wh(14vw, 100%);
          padding: 0 1vw;
          word-break: break-all;
          @include fc;
          line-height: 4vw;
        }
        .col2 {
          position: relative;
          flex: 1;
          height: 100%;
          padding: 0 1vw;
          @include fc;
          .dice {
            position: relative;
            @include vwh(4.8, 4.8);
            background-image: url("~@/assets/bobing/dice.png");
            background-repeat: no-repeat;
            background-size: 100%;
            background-position-x: 0;
            margin: 0 0.5vw;
            &.dice0 {
              background-position-y: 0;
            }
            &.dice1 {
              background-position-y: -4.8vw;
            }
            &.dice2 {
              background-position-y: -9.6vw;
            }
            &.dice3 {
              background-position-y: -14.4vw;
            }
            &.dice4 {
              background-position-y: -19.2vw;
            }
            &.dice5 {
              background-position-y: -24vw;
            }
            &.dice6 {
              background-position-y: -28.8vw;
            }
          }
        }
      }
      .content {
        @include rule;
        overflow: hidden;
      }
    }
  }
}
</style>
<style>
  .content video, .content img {
    max-width: 100%;
  }
</style>
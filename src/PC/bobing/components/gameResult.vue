<template>
  <div class="game_result">
    <div class="box">
      <div class="score_box" v-if="!showList">
        <div class="score">
          <img src="@/assets/bobing/score.png" class="score_ico">
          <p class="got_score">+<span>{{myReasult.integral || 0}}</span>积分</p>
          <p class="congratulat" v-if="myReasult.integral > 0">恭喜你中了{{myReasult.drawnType}}，获得{{myReasult.integral}}积分</p>
          <p class="congratulat" v-else>很遗憾，请您再接再厉！</p>
        </div>
      </div>
      <div class="detail" v-else>
        <div class="detail_box">
          <div class="mine">
            <div class="avatar">
              <img v-lazy="myReasult.avatar" data-avatar="1" class="avatar_pic">
              <div class="ranking">第{{myReasult.sort}}名</div>
            </div>
            <p class="name">{{myReasult.username}}</p>
            <p class="got_score">+<span>{{myReasult.integral}}</span>积分</p>
            <p class="congratulat" v-if="myReasult.integral > 0">恭喜你中了{{myReasult.drawnType}}，获得{{myReasult.integral}}积分</p>
            <p class="congratulat" v-else>很遗憾，请您再接再厉！</p>
            <div @click="linkTo('/prize')" class="to_prize"></div>
          </div>
          <div class="title">好友排行</div>
          <ul class="ranks">
            <li class="item" v-for="(item, i) in multiReasult" :key="item.uid + '-multi'">
              <div class="therank" :class="'rank' + i"></div>
              <img v-lazy="item.avatar" data-avatar="1" class="theavatar">
              <div class="info">
                <p class="name">{{item.username}}</p>
                <p class="rankname">{{item.drawnType || '未中奖'}}</p>
              </div>
              <p class="thescore">+{{item.integral}}积分</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="handlers">
        <input type="button" @click="again" value="再来一次" class="try_again">
        <input type="button" @click="linkTo('/charge')" v-if="gameType === 'single'" value="获取游戏次数" class="see_detail">
        <template v-else>
          <input type="button" @click="restart" v-if="showList" value="重开一局" class="see_detail">
          <input type="button" @click="seeDetail" v-else value="查看游戏详情" class="see_detail">
        </template>
      </div>
      <span class="close" @click="restart"></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(["gameType", "roomId", "gameStatus", "myReasult", "multiReasult", "showList", "countdown"])
  },
  watch: {},
  methods: {
    again(){
      if (this.gameType === 'single') {
        this.$parent.initGame()
      } else {
        this.$parent.initGame(this.roomId)
      }
    },
    restart(){
      this.$parent.restart()
    },
    linkTo(path){
      this.$store.commit('setState',{
        showReasult: false
      })
      this.$router.push({path: path, query: {...this.$route.query}})
      this.$parent.initGame()
    },
    seeDetail(){
      this.$parent.getRank()
    }
  },
  mounted(){
    // console.log(this.type)
    document.querySelector('body').style.overflowY = 'hidden'
    document.querySelector('body').style.height = '100%'
  },
  beforeDestroy(){
    document.querySelector('body').style.overflowY = ''
    document.querySelector('body').style.height = ''
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/mixin.scss";
.game_result {
  position: fixed;
  left: 0;
  top: 0;
  @include wh(100%, 100%);
  background: rgba($color: #000000, $alpha: 0.5);
  z-index: 9999999999999;
  @include fc;
  .box {
    position: relative;
    @include wh(387px, 529px);
    background: linear-gradient(180deg,rgba(233,75,38,1) 0%,rgba(234,90,43,1) 100%);
    border-radius: 10px;
    padding: 20px;
    .score_box , .detail {
      position: relative;
      @include wh(100%, 409px);
      padding: 6px;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        @include wh(100%, 100%);
        border: 2px solid #FFDAA1;
        border-radius: 15px;
        box-sizing: border-box;
      }
      .score {
        position: relative;
        @include wh(100%, 100%);
        background: #FDFEEB;
        border-radius: 10px;
        @include fc;
        flex-direction: column;
        .score_ico  {
          display: block;
          @include wh(194.5px, auto);
        }
        .got_score {
          font-size: 20px;
          color: #F94048;
          margin: 10px 0;
          span {
            font-size: 36px;
            font-weight: 600;
            margin-right: 5px;
          }
        }
        .congratulat {
          font-size: 18px;
          color: #F94048;
        }
      }
    }
    .detail_box {
      position: relative;
      @include wh(100%, 100%);
      background: #FDFEEB;
      border-radius: 10px;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .mine {
        position: relative;
        @include wh(100%, auto);
        .avatar {
          position: relative;
          @include wh(60px, 60px);
          margin: 10px auto;
          .avatar_pic {
            display: block;
            @include wh(60px, 60px);
            border-radius: 50%;
          }
          .ranking {
            position: absolute;
            bottom: 0;
            left: 50%;
            @include wh(60px, 18px);
            border-radius: 9px;
            background: #F8513D;
            text-align: center;
            line-height: 18px;
            font-size: 12px;
            padding: 0 9px;
            font-weight: 400;
            color: #FFF;
            margin-left: -30px;
          }
        }
        .name {
          position: relative;
          @include wh(80%, 20px);
          font-size: 16px;
          color: #333;
          text-align: center;
          line-height: 20px;
          margin-top: 9px;
          @include omit(1);
          margin: 0 auto;
          margin-bottom: 10px;
        }
        .got_score {
          position: relative;
          @include wh(80%, 56px);
          text-align: center;
          color: #F94048;
          font-size: 25px;
          margin: 0 auto;
          span{
            font-size: 50px;
          }
        }
        .congratulat {
          position: relative;
          @include wh(80%, 20px);
          font-size: 16px;
          line-height: 20px;
          text-align: center;
          margin: 5px auto;
          color: #F94048;
        }
        .to_prize {
          display: block;
          position: relative;
          @include wh(85px, 24px);
          background-image: url("~@/assets/bobing/exchange.png");
          background-repeat: no-repeat;
          background-size: 100% 200%;
          background-position: 0 0;
          margin: 10px auto;
        }
      }
      .title {
        position: relative;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        padding-left: 15px;
        @include wh(100%, 24px);
        line-height: 24px;
        &::before {
          content: "";
          position: absolute;
          left: 5px;
          top: 5px;
          @include wh(4px, 15px);
          border-radius: 4px;
          background: #F94048;
        }
      }
      .ranks {
        position: relative;
        @include wh(100%, auto);
        .item {
          position: relative;
          @include wh(100%, auto);
          @include fs;
          margin: 10px 0;
          padding: 0 10px;
          box-sizing: border-box;
          &::before {
            content: "";
            position: absolute;
            left: 5%;
            bottom: -10px;
            @include wh(90%, 1px);
             background: #E6E6E6;
          }
          .theavatar{
            display: block;
            @include wh(30px, 30px);
            border-radius: 50%;
          }
          .therank {
            position: relative;
            @include wh(35px, 35px);
            font-size: 2.9vw;
            color: #FFF;
            font-weight: normal;
            line-height: 40px;
            margin-right: 5px;
            background-image: url("~@/assets/bobing/PC/4.png");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: 0 0;
            &.rank0 {
              background-image: url("~@/assets/bobing/PC/1.png");
            }
            &.rank1 {
              background-image: url("~@/assets/bobing/PC/2.png");
            }
            &.rank2 {
              background-image: url("~@/assets/bobing/PC/3.png");
            }
          }
          .info {
            position: relative;
            flex: 1;
            height: auto;
            font-size: 14px;
            text-align: left;
            color: #333;
            font-weight: normal;
            line-height: 20px;
            margin: 0 5px;
            .name {
              @include omit(1);
            }
            .rankname {
              color: #F8513D;
            }
          }
          .thescore {
            font-size: 16px;
            color: #F94048;
          }
        }
      }
    }
    .handlers {
      position: relative;
      @include wh(100%, 44px);
      @include fs;
      margin-top: 17px;
      input {
        display: block;
        @include wh(160px, 100%);
        border-radius: 22px;
        border: none;
        outline: none;
        font-size: 16px;
        color: #831A06;
        box-shadow:0px 3px 6px rgba(100,25,0,0.42);
        background: #FFF;
        cursor: pointer;
        &.see_detail {
          background: #F6E354;
        }
        &:active {
          transform: scale(0.9);
        }
      }
    }
    .close {
      position: absolute;
      bottom: -60px;
      left: 50%;
      @include wh(50px, 50px);
      margin-left: -25px;
      border-radius: 50%;
      background: url("~@/assets/bobing/close_score.png") no-repeat center/contain;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.5);
      cursor: pointer;
      &:active {
        transform: scale(0.9);
      }
    }
  }
}
</style>
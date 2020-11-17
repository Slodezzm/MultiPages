<template>
  <div class="game_result">
    <div class="box">
      <div class="score_box">
        <div class="score" v-if="!showList">
          <img src="@/assets/bobing/score.png" class="score_ico">
          <p class="got_score">+<span>{{myReasult.integral}}</span>积分</p>
          <p class="congratulat" v-if="myReasult.integral > 0">恭喜你中了{{myReasult.drawnType}}，获得{{myReasult.integral}}积分</p>
          <p class="congratulat" v-else>很遗憾，请您再接再厉！</p>
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
    document.querySelector('body').style.overflow = 'hidden'
    document.querySelector('body').style.height = '100%'
  },
  beforeDestroy(){
    document.querySelector('body').style.overflow = ''
    document.querySelector('body').style.height = ''
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.game_result {
  position: fixed;
  left: 0;
  top: 0;
  @include wh(100%, 100vh);
  background: rgba($color: #000000, $alpha: 0.5);
  @include fc;
  padding-bottom: 18vw;
  z-index: 2001;
  .box {
    position: relative;
    @include wh(85vw, auto);
    border-radius: 2.7vw;
    background:linear-gradient(180deg,rgba(233,75,38,1) 0%,rgba(234,90,43,1) 100%);
    padding: 4.4vw;
    .score_box {
      position: relative;
      @include wh(100%, 90vw);
      padding: 6px;
      background: transparent;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        @include wh(100%, 100%);
        border: 2px solid #FFDAA1;
        border-radius: 20px;
        box-sizing: border-box;
      }
      .score {
        position: relative;
        @include wh(100%, 100%);
        background: #FDFEEB;
        border-radius: 14px;
        @include fc;
        flex-direction: column;
        color: #F94048;
        .score_ico {
          display: block;
          @include vwh(50.7, 50.7);
        }
        .got_score {
          position: relative;
          @include wh(auto, auto);
          font-size: 4.3vw;
          font-weight: bold;
          margin: 3vw 0;
          span {
            font-size: 8vw;
            margin: 0 1vw;
          }
        }
      }
      .detail {
        position: relative;
        @include wh(100%, 100%);
        background: #FDFEEB;
        border-radius: 14px;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        .detail_box {
          position: relative;
          width: calc(76.2vw - 12px);
          height: auto;
          background: transparent;
          padding: 5vw;
          .mine {
            @include rule;
            @include fc;
            flex-direction: column;
            .avatar {
              position: relative;
              @include vwh(16, 16);
              .avatar_pic {
                display: block;
                @include wh(100%, 100%);
                border-radius: 50%;
              }
              .ranking {
                position: absolute;
                left: 50%;
                bottom: 0;
                @include wh(auto, 4.4vw);
                transform: translateX(-50%);
                padding: 0 2vw;
                font-size: 3.2vw;
                line-height: 4.4vw;
                color: #FFF;
                font-weight: 400;
                text-align: center;
                border-radius: 2.2vw;
                background: #F8513D;
                word-break: keep-all;
              }
            }
            .name {
              position: relative;
              @include wh(auto, 5.6vw);
              word-break: keep-all;
              line-height: 5.6vw;
              font-size: 4.3vw;
              color: #333;
              text-align: center;
              font-weight: 400;
              margin: 2vw auto;
            }
            .got_score {
              position: relative;
              @include wh(auto, auto);
              font-size: 4.3vw;
              font-weight: bold;
              color: #F8513D;
              span {
                font-size: 8vw;
                margin: 0 1vw;
              }
            }
            .congratulat {
              position: relative;
              @include wh(auto, auto);
              font-size: 4.3vw;
              font-weight: 400;
              color: #F8513D;
              margin: 2vw auto;
            }
            .to_prize {
              position: relative;
              @include vwh(22.2, 6.5);
              background-image: url("~@/assets/bobing/exchange.png");
              background-repeat: no-repeat;
              background-size: 100% 200%;
              background-position: 0 0;
              margin-bottom: 2vw;
              &:active {
                transform: scale(0.9);
              }
            }
          }
          .title {
            position: relative;
            @include wh(auto, 5.2vw);
            padding-left: 2vw;
            text-align: left;
            font-size: 3.7vw;
            line-height: 5.2vw;
            color: #333;
            font-weight: bold;
            &::before {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              @include wh(1vw, 100%);
              background: #F8513D;
              border-radius: 0.5vw;
            }
          }
          .ranks {
            @include rule;
            .item {
              position: relative;
              @include wh(100%, 16vw);
              @include fs;
              .therank {
                @include vwh(5.3, 6.6);
                font-size: 2.9vw;
                color: #FFF;
                font-weight: normal;
                line-height: 5vw;
                margin-right: 2vw;
                background-image: url("~@/assets/bobing/ranks.png");
                background-size: 100% 400%;
                background-repeat: no-repeat;
                background-position-x: 0;
                background-position-y: 0;
                &.rank0 {
                  background-position-y: -6.6vw;
                }
                &.rank1 {
                  background-position-y: -13.2vw;
                }
                &.rank2 {
                  background-position-y: -19.8vw;
                }
              }
              .theavatar {
                display: block;
                @include vwh(10.7, 10.7);
                border-radius: 50%;
              }
              .info {
                flex: 1;
                height: auto;
                font-size: 3.7vw;
                text-align: left;
                color: #333;
                font-weight: normal;
                line-height: 5vw;
                margin: 0 2vw;
                .name {
                  @include omit(1);
                }
                .rankname {
                  color: #F8513D;
                }
              }
              .thescore {
                font-size: 3.2vw;
                color: #F94048;
              }
            }
          }
        }
      }
    }
    .handlers {
      position: relative;
      @include wh(100%, 9.2vw);
      @include fs;
      margin-top: 3.5vw;
      input {
        flex: 1;
        height: 100%;
        border-radius: 4.6vw;
        font-size: 3.7vw;
        color: #831A06;
        font-weight: 400;
        box-shadow:0px 4px 8px rgba(100,25,0,0.42);
        &.try_again {
          margin-right: 5vw;
          background: #FFF;
        }
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
      bottom: -14vw;
      left: 50%;
      @include vwh(10, 10);
      margin-left: -5vw;
      border-radius: 50%;
      background: url("~@/assets/bobing/close_score.png") no-repeat center/contain;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.5);
      &:active {
        transform: scale(0.9);
      }
    }
  }
}
</style>
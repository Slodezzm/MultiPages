<template>
  <div class="rank">
    <div class="tips">温馨提示：活动结束一周后将不能再兑换奖品，积分全部清零，请尽快兑换奖品喔〜</div>
    <div class="p44">
      <div class="top" v-if="isLogin">
        <div class="title">我的排名：{{mine.sort || '暂无'}}</div>
        <div class="history" @click="showHistory = true">游戏记录</div>
      </div>
      <div class="rank_box" v-if="isLogin">
        <div class="rank_item">
          <img v-lazy="mine.avatar" data-avatar="1" class="avatar">
          <div class="name_time">
            <p class="name">{{mine.username}}</p>
            <p class="time">参与次数：{{mine.counts || 0}}</p>
          </div>
          <div class="exchange_totalScore">
            <router-link to="/prize" v-if="endtime <= 7" class="to_exchange">兑换奖品</router-link>
            <p class="total_score">历史积分：{{mine.integral || 0}}</p>
          </div>
        </div>
      </div>
      <div class="top">
        <div class="title">总积分排行</div>
      </div>
      <template v-if="rankList.length > 0">
        <ul class="rank_box">
          <li class="rank_item" v-for="(item,i) in rankList" :key="'rank-' + item.uid">
            <img v-lazy="item.avatar" data-avatar="1" class="avatar">
            <div class="name_time">
              <p class="name">{{item.username}}</p>
              <p class="time">参与次数：{{item.counts}}</p>
            </div>
            <div class="exchange_totalScore">
              <div class="ranks">NO.{{i + 1}}</div>
              <p class="total_score">历史积分：{{item.integral}}</p>
            </div>
          </li>
        </ul>
        <p class="loadmore" @click="loadMore">{{finished ? '没有更多了~' : '点击加载更多...'}}</p>
      </template>
      <no-content v-else text="快来抢占头条吧~" />
      <transition name="fade">
        <pop-up v-if="showHistory" topI="3" @close="showHistory = false">
          <game-history />
        </pop-up>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import popUp from '../components/public/popUp'
import gameHistory from '../components/panel/gameHistory'
import noContent from '../components/public/noContent'
export default {
  components: {
    popUp,
    gameHistory,
    noContent
  },
  data() {
    return {
      login: false,
      loading: true,
      finished: false,
      loadmore: false,
      showHistory: false,
      gameData: [],
      rankList: [],
      mine: {},
      hasNextMark: 0,
      pageNo: 1,
    }
  },
  computed: {
    ...mapState(['isLogin', 'endtime'])
  },
  methods: {
    loadMore(){
      if (this.finished) return this.$toast("没有更多了！")
      this.pageNo++
      this.getList()
    },
    getList(){
      this.$http({
        url: "/live/api/mid_autumn/query_history_integral_list",
        method: "POST",
        data: {
          pageNo: this.pageNo,
          pageSize: 20
        }
      }).then(res => {
        this.loading = false
        if (res.code === "success") {
          this.rankList = [...this.rankList,...res.data.otherUserHistoryList]
          this.finished = res.data.hasNextMark === 0
          if (this.isLogin) {
            this.mine = res.data.mySelfHistoryInfo
          }
        }
      })
    }
  },
  mounted() {
    this.getList()
  },
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.rank {
  @include rule;
  min-height: calc(100vh - 16vw);
  background: url("~@/assets/bobing/otherbg.png") no-repeat top center/100% auto, #e94b26;
  background-attachment:fixed;
  .top {
    @include rule;
    margin-top: 3vw;
    @include fs;
    padding: 0 4.4vw;
    .title {
      font-size: 4.8vw;
      font-weight: 500;
      line-height: 6.4vw;
      text-align: left;
      color: #FFF;
    }
    .history {
      font-size: 3.7vw;
      color: #FFF;
      font-weight: 400;
      text-align: right;
      line-height: 6.4vw;
    }
  }
  .rank_box {
    @include rule;
    background: #FEFFEC;
    border-radius: 5px;
    margin-top: 1.3vw;
    padding: 2vw 5vw;
    .rank_item {
      position: relative;
      @include wh(100%, 15vw);
      @include fs;
      &:nth-child(1),&:nth-child(2),&:nth-child(3) {
        .exchange_totalScore .ranks {
          background: #F8513D;
        }
      }
      .avatar {
        display: block;
        @include vwh(10.7, 10.7);
        border-radius: 50%;
      }
      .name_time {
        position: relative;
        flex: 1;
        height: auto;
        margin: 0 2vw;
        text-align: left;
        .name {
          position: relative;
          @include wh(100%, 6vw);
          font-size: 3.7vw;
          color: #F8513D;
          font-weight: 500;
          line-height: 6vw;
          @include omit(1);
        }
        .time {
          position: relative;
          @include wh(100%, 6vw);
          font-size: 3.2vw;
          color: #333;
          font-weight: 500;
          line-height: 6vw;
          @include omit(1);
        }
      }
      .exchange_totalScore {
        position: relative;
        @include wh(auto, auto);
        // text-align: center;
        // max-width: 33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .to_exchange {
          display: inline-block;
          position: relative;
          @include wh(auto, 6vw);
          border-radius: 3vw;
          background: linear-gradient(180deg,rgba(229,61,44,1) 0%,rgba(253,91,68,1) 59%,rgba(226,31,30,1) 100%);
          color: #FFF;
          font-size: 3.2vw;
          font-weight: 400;
          line-height: 6vw;
          padding: 0 5vw 0 3vw;
        }
        .ranks {
          position: relative;
          @include wh(20vw, 6vw);
          border-radius: 3vw;
          text-align: center;
          line-height: 6vw;
          color: #FFF;
          font-style: italic;
          font-size: 3.2vw;
          background: #DDD;
        }
        .total_score {
          position: relative;
          @include wh(auto, 4.4vw);
          font-size: 3.2vw;
          color: #EF8430;
          font-weight: 500;
          text-align: right;
          line-height: 4.4vw;
          @include omit(1);
        }
      }
    }
  }
  .tips {
    @include rule;
    padding: 4vw 7vw 4vw 15vw;
    background: url("~@/assets/bobing/laba.png") no-repeat 5.5vw center/7.2vw 5.5vw, #E94B26;
    color: #FFF;
    font-size: 3.2vw;
    line-height: 4.6vw;
    text-align: left;
    word-break: break-all;
    font-weight: 400;
  }
  .p44 {
    @include rule;
    padding: 4.4vw;
  }
  .loadmore {
    @include rule;
    line-height: 7.2vw;
    font-size: 3.6vw;
    color: #FFF;
    font-weight: 400;
    text-align: center;
  }
}
</style>
<template>
  <div class="prize">
    <div class="tips">温馨提示：活动结束一周后将不能再兑换奖品，积分全部清零，请尽快兑换奖品喔〜</div>
    <div class="top">
      <div class="title">兑换奖品<span class="currentigt">当前积分:{{integral}}</span></div>
      <div class="to_pastex" @click="exchangeHistory">兑换记录</div>
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了~" @load="loadMore">
      <ul class="prize_list" v-if="list.length > 0">
        <li class="list_item" v-for="(item, i) in list" :key="'prize-' + i">
          <div class="title">{{item.prizeName}}</div>
          <div class="boder1">
            <div class="boder2">
              <div class="box">
                <img v-lazy="item.prizeImg" class="goods">
                <div class="exchange_detail" v-if="item.exchangeStatus === 1" @click="detailId = item.prizeId;showExchangeDetail = true">已兑换{{item.prizeTimes || 0}}次</div>
              </div>
              <div class="detail">
                <div class="score_num">
                  <p class="need_score">积分:<span>{{item.integral}}</span></p>
                  <p class="num">数量:{{item.prizeCount}}</p>
                </div>
                <div v-if="endtime <= 7" class="to_exchange" @click="toPrize(i)"></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <noContent text="暂无奖品" v-else />
    </van-list>
    <transition name="fade">
      <pop-up v-if="showExchangeHistory" topI="1" @close="showExchangeHistory = false">
        <exchange-history />
      </pop-up>
      <pop-up v-if="showExchangeDetail" topI="2" @close="showExchangeDetail = false">
        <exchange-detail :id="detailId" />
      </pop-up>
    </transition>
  </div>
</template>

<script>
import { toLogin } from '@/common/unit'
import popUp from '../components/public/popUp'
import exchangeDetail from '../components/panel/exchangeDetail'
import exchangeHistory from '../components/panel/exchangeHistory'
import noContent from '../components/public/noContent'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(["isLogin", "endtime", "integral"])
  },
  components: {
    popUp,
    exchangeDetail,
    exchangeHistory,
    noContent
  },
  data() {
    return {
      loading: false,
      finished: false,
      showNav: true,
      showExchangeHistory: false,
      showExchangeDetail: false,
      list: [],
      pageNo: 1,
      detailId: 0,
      currentigt: 0,
    }
  },
  methods: {
    toPrize(i) {
      if (!this.isLogin) {
        toLogin(this)
      }
      if (this.currentigt < this.list[i].integral) {
        return this.$toast("您的积分不足！")
      }
      if (this.list[i].prizeCount == 0) {
        return this.$toast("该奖品已全部兑换完，您可以兑换其它奖品！")
      }
      this.$router.push({
        path: '/exchange/' + this.list[i].prizeId,
        query: {itg:this.list[i].integral}
      })
    },
    exchangeHistory(){
      if (this.isLogin) {
        this.showExchangeHistory = true
      } else {
        toLogin(this)  
      }
    },
    toLogins(){
      toLogin(this)
    },
    loadMore(){
      this.pageNo++
      this.getList()
    },
    getList(){
      this.loading = true
      this.$http({
        url: "/live/api/mid_autumn/query_prize_list",
        method: "POST",
        data: {
          pageNo: this.pageNo,
          pageSize: 20
        }
      }).then(res => {
        this.loading = false
        if (res.code === "success") {
          this.list = [...this.list, ...res.data.prizeList]
          this.finished = res.data.hasNextMark === 0
          this.currentigt = res.data.integral
        } else {
          this.finished = true
          this.$toast(res.msg || "请求失败!")
        }
      }).catch(err => {
        this.finished = true
        this.loading = false
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
.prize {
  @include rule;
  min-height: calc(100vh - 16vw);
  background: url("~@/assets/bobing/otherbg.png") no-repeat top center/100% auto, #e94b26;
  background-attachment:fixed;
  .top {
    @include rule;
    @include fs;
    line-height: 6.3vw;
    margin-bottom: 1.3vw;
    padding: 0 2.3vw;
    .title {
      position: relative;
      @include wh(auto, 6.3vw);
      padding-left: 4vw;
      font-size: 4.8vw;
      font-weight: 400;
      color: #FFF;
      .currentigt {
        font-size: 3.6vw;
        margin-left: 2vw;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.9vw;
        @include vwh(1, 4.5);
        border-radius: 0.5vw;
        background: #FFF;
      }
    }
    .to_pastex {
      position: relative;
      @include wh(auto, 6.3vw);
      font-size: 3.7vw;
      font-weight: 400;
      color: #FFF;
      &:active {
        text-decoration: underline;
      }
    }
  }
  .prize_list {
    @include rule;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 2.3vw;
    .list_item {
      position: relative;
      @include wh(47vw, auto);
      border: 3px solid #FFDAA1;
      border-radius: 6vw;
      margin-top: 6.7vw;
      &:nth-child(odd) {
        margin-right: 1.4vw;
      }
      .title {
        position: absolute;
        left: 10%;
        top: -3.8vw;
        @include wh(80%, 7.6vw);
        background: url("~@/assets/bobing/title.png") no-repeat center/contain;
        z-index: 2;
        padding: 0 2vw;
        text-align: center;
        line-height: 7.6vw;
        font-size: 3.2vw;
        font-weight: 500;
        color: #FFF;
        @include omit(1);
      }
      .boder1 {
        @include rule;
        padding: 2px;
        overflow: hidden;
        .boder2 {
          @include rule;
          border: 3px solid #FFF;
          border-radius: calc(6vw - 5px);
          background: #FFEADD;
          // overflow: hidden;
          .box {
            position: relative;
            @include wh(100%, 48vw);
            padding: 4vw 0;
            @include fc;
            flex-direction: column;
            .goods {
              display: block;
              @include wh(auto, 30vw);
            }
            .exchange_status {
              position: absolute;
              left: 50%;
              top: 50%;
              @include vwh(30, 30);
              margin-left: -15vw;
              margin-top: -15vw;
              background: url("~@/assets/bobing/PC/yiduihuan.png") no-repeat center/ 60%;
              z-index: 5;
            }
            .exchange_detail {
              position: relative;
              @include wh(auto, 6vw);
              padding: 0 3vw;
              background: #FD7612;
              margin-top: 2vw;
              font-size: 3.2vw;
              font-weight: 400;
              line-height: 6vw;
              text-align: center;
              color: #FFF;
              border-radius: 3vw;
              &:active {
                transform: scale(0.9);
              }
            }
          }
          .detail {
            position: relative;
            @include wh(100%, 11vw);
            background:linear-gradient(225deg,rgba(229,61,44,1) 0%,rgba(255,109,90,1) 46%,rgba(226,58,42,1) 100%);
            @include fs;
            border-radius: 0 0 calc(6vw - 8px) calc(6vw - 8px);
            padding: 0 2vw;
            .score_num {
              position: relative;
              flex: 1;
              height: auto;
              color: #FFF;
              font-weight: 400;
              font-size: 2.4vw;
              line-height: 4.2vw;
              text-align: left;
              span{
                font-size: 3.2vw;
                font-weight: bold;
              }
            }
            .exchange_detail, .to_exchange{
              display: block;
              position: relative;
              @include vwh(19.3, 6);
              background-image: url("~@/assets/bobing/exchange.png");
              background-repeat: no-repeat;
              background-size: 100% 200%;
              background-position: 0 0;
            }
            .exchange_detail {
              background-position-y: -6vw;
              &:active {
                transform: scale(0.9);
              }
            }
          }
        }
      }
    }
  }
  .tips {
    @include rule;
    margin-bottom: 4vw;
    padding: 4vw 7vw 4vw 15vw;
    background: url("~@/assets/bobing/laba.png") no-repeat 5.5vw center/7.2vw 5.5vw, #E94B26;
    color: #FFF;
    font-size: 3.2vw;
    line-height: 4.6vw;
    text-align: left;
    word-break: break-all;
    font-weight: 400;
  }
}
</style>
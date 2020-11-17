<template>
  <div class="Prize">
    <el-scrollbar style="height: 100%" v-if="prizeList.length > 0">
      <div class="infinite-list" v-infinite-scroll="load">
        <div class="prize_bg" v-for="(item, index) in prizeList" :key="index">
          <div class="PrizeTitle">{{ item.prizeName }}</div>
          <div
            class="goods"
            :class="{ goodsExchange: item.exchangeStatus === 1 }"
          >
            <img v-lazy="item.prizeImg" alt />
            <!-- <img
              class="exchange"
              src="@/assets/bobing/PC/yiduihuan.png"
              v-if="item.exchangeStatus === 1"
              alt
            /> -->
          </div>
          <div
            class="exchangeDetail"
            @click="exchangeDetail(item.prizeId)"
            v-if="item.exchangeStatus === 1"
          >
            <div class="count">
              <div>已兑换 {{ item.prizeTimes || 0 }} 次<i class="el-icon-arrow-right"></i></div>
            </div>
          </div>
          <div class="footerBox">
            <div class="prizeInfo">
              <div class="integral">
                积分:
                <span>{{ item.integral }}</span>
              </div>
              <div class="num">数量: {{ item.prizeCount }}</div>
            </div>
            <div class="prizeBtn">
              <!-- <img
                @click="exchangeDetail(item.orderId)"
                src="@/assets/bobing/PC/btn_xiangqing.png"
                v-if="item.exchangeStatus===1"
                alt
              />-->
              <img
                @click="exchangePrize(item)"
                src="@/assets/bobing/PC/btn_duihuan.png"
                v-if="endtime <= 7"
                alt
              />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 缺省页 -->
    <no-msg v-else-if="$store.state.Loading" />
    <!-- 兑换详情 -->
    <exchange-detail v-if="showExchangeDetail" :prizeId="prizeId" />
    <!-- 兑换奖品-地址 -->
    <add-address v-if="showAddress" :integral="integral" :prizeId="prizeId" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import exchangeDetail from "@/PC/bobing/components/exchangeDetail.vue";
import addAddress from "@/PC/bobing/components/addAddress.vue";
import noMsg from "@/PC/bobing/components/noMsg.vue";

export default {
  computed: {
    ...mapState(["endtime"]),
  },
  components: {
    exchangeDetail,
    addAddress,
    noMsg,
  },
  data() {
    return {
      isLogin: false,
      showExchangeDetail: false,
      showAddress: false,
      pageNo: 1,
      pageSize: 10,
      hasNextMark: 0,
      prizeList: [],
      // orderId: "", //已兑换订单id
      prizeId: "", //奖品id
      selectId: "", //地址id
      integral: "", //兑换积分
      currentIntegral: 0, // 当前积分
    };
  },
  methods: {
    checkLogin(fun) {
      if (this.isLogin) {
        fun();
      } else {
        util.toLogin();
      }
    },
    // 兑换奖品
    exchangePrize(item) {
      this.prizeId = item.prizeId;
      this.integral = item.integral;
      this.checkLogin(() => {
        if (item.prizeCount === 0) {
          // 库存不足
          this.$message.error("该奖品已经全部被兑换完，你可以兑换其他奖品！");
        } else if (item.integral > this.currentIntegral) {
          // 积分不足
          this.$message.error("积分不足！");
        } else {
          this.showAddress = true;
        }
      });
    },
    //兑换详情
    exchangeDetail(prizeId) {
      this.prizeId = prizeId;
      this.showExchangeDetail = true;
    },
    // 获取列表数据
    getList() {
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/query_prize_list",
        data: { pageNo: this.pageNo, pageSize: this.pageSize },
      })
        .then((res) => {
          let { hasNextMark, prizeList, integral } = res.data;
          this.hasNextMark = hasNextMark;
          this.currentIntegral = integral || 0;
          this.prizeList = [...this.prizeList, ...prizeList];
        })
        .catch((err) => {});
    },
    // 子组件调用初始化更新数据
    update() {
      this.pageNo = 1;
      this.prizeList = [];
      this.getList();
    },
    // 加载更多
    load() {
      if (this.hasNextMark === 1) {
        this.pageNo = ++this.pageNo;
        this.getList();
      }
    },
  },
  created() {
    this.getList();
    this.isLogin = util.getCookie("AJ1sOD_token");
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.Prize {
  width: 1116px;
  height: 986px;
  .prize_bg {
    width: 353px;
    height: 448px;
    background: url("../../../assets/bobing/PC/jiangpinkuang .png") no-repeat;
    background-size: 100% 100%;
    margin: 0 18px 45px 0;
    &:nth-child(3n) {
      margin-right: 0;
    }
    .PrizeTitle {
      width: 236px;
      height: 58px;
      line-height: 58px;
      font-size: 24px;
      font-weight: 500;
      color: #fff;
      text-align: center;
      padding: 0 30px;
      margin: 0 auto;
      @include lineClamp1;
    }
    .goods {
      width: 250px;
      height: 250px;
      margin: 24px auto 25px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .exchange {
        position: absolute;
        top: 41px;
        left: 20px;
        width: 197px;
        height: 189px;
        // img{
        //   width: 197px;
        //   height: 189px;
        // }
      }
    }
    .goodsExchange {
      margin: 0 auto;
    }
    .exchangeDetail {
      width: 100%;
      margin: 10px auto 4px;
      text-align: center;
      .count {
        display: inline-block;
        max-width: 250px;
        height: 35px;
        line-height: 35px;
        background: #fd7612;
        opacity: 1;
        border-radius: 18px;
        cursor: pointer;
        padding-left: 12px;
        color: #fff;
        font-size: 24px;
        
        i {
          font-size: 20px;
        }
      }
    }
    .footerBox {
      width: 100%;
      height: 82px;
      padding: 0 30px 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .prizeInfo {
        max-width: 140px;
        font-size: 18px;
        color: #fff;
        .integral {
          @include lineClamp1;
          span {
            font-size: 24px;
          }
        }
        .num {
          @include lineClamp1;
        }
      }
      .prizeBtn {
        width: 145px;
        height: 45px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  padding-right: 20px;
}
.infinite-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
<template>
  <div class="Header">
    <div class="tabBar_bg">
      <div class="tabBar" v-if="topath != '/rule'">
        <router-link
          :to="item.url"
          v-for="(item, index) in tabList"
          :key="index"
          @click.native="topath = item.url"
        >
          <div
            class="tabBg"
            :class="item.url === topath ? 'bgSelect' : 'bgNorma'"
            v-show="endtime <= 0 || item.url != '/charge'"
          >
            {{ item.title }}
          </div>
        </router-link>
      </div>
    </div>
    <div class="title">
      <div class="integral"  v-show="topath === '/prize'">当前积分：{{ integral }}</div>
      <div class="title_box">
        <img
          v-show="topath === '/'"
          src="@/assets/bobing/PC/zhongqiubobing.png"
          alt
        />
        <img
          v-show="topath === '/rank'"
          src="@/assets/bobing/PC/paihangbang.png"
          alt
        />
        <img
          v-show="topath === '/prize'"
          src="@/assets/bobing/PC/duihuanjiangpin.png"
          alt
        />
        <img
          v-show="topath === '/charge'"
          src="@/assets/bobing/PC/youxichongzhi.png"
          alt
        />
        <img
          v-show="topath === '/rule'"
          src="@/assets/bobing/PC/youxiguize.png"
          alt
        />
      </div>
      <div
          v-show="topath === '/prize'"
          class="exchangeRecords"
          @click="myExchangeRecords"
        >
          我的兑换记录>
        </div>
    </div>
    <!-- 公告栏 -->
    <div class="notice" v-show="topath === '/prize' || topath === '/rank'">
      <div class="icon">
        <img src="@/assets/bobing/PC/laba.png" alt />
      </div>
      <div class="tips">
        温馨提示：活动结束一周后将不能再兑换奖品，积分全部清零，请尽快兑换奖品喔〜
      </div>
    </div>
    <!-- 兑换记录 -->
    <exchangeRecords v-if="closeExchangeRecords" />
  </div>
</template>

<script>
import exchangeRecords from "@/PC/bobing/components/exchangeRecords.vue";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["endtime", "integral"]),
  },
  components: {
    exchangeRecords,
  },
  data() {
    return {
      isLogin: false,
      tabList: [
        { url: "/", title: "中秋博饼" },
        { url: "/rank", title: "积分排行榜" },
        { url: "/prize", title: "奖品兑换" },
        { url: "/charge", title: "游戏充值" },
      ],
      topath: "/",
      closeExchangeRecords: false,
    };
  },
  methods: {
    myExchangeRecords() {
      if (this.isLogin) {
        this.closeExchangeRecords = true;
      } else {
        util.toLogin();
      }
    },
  },
  watch: {
    $route(to, from) {
      this.topath = to.path;
    },
  },
  created() {
    this.isLogin = util.getCookie("AJ1sOD_token");
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.tabBar_bg {
  width: 100%;
  height: 684px;
  background: url("../../../assets/bobing/PC/pcbg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .tabBar {
    width: 1096px;
    position: absolute;
    bottom: 9px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    .tabBg {
      width: 258px;
      line-height: 67px;
      text-align: center;
      font-size: 30px;
      color: #fff;
      cursor: pointer;
    }
    .bgSelect {
      height: 71px;
      background: url("../../../assets/bobing/PC/btn_bg_select.png") no-repeat;
      background-size: 100% 100%;
    }
    .bgNorma {
      height: 67px;
      background: url("../../../assets/bobing/PC/btn_bg_norma.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
.title {
  background: $main_bg;
  width: 1096px;
  height: 75px;
  margin: 21px auto 30px;
  position: relative;
  .integral {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 24px;
    color: #fff;
  }
  .title_box {
    width: 685px;
    height: 75px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .exchangeRecords {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 28px;
      font-family: PangMenZhengDao-3;
      color: #fff;
      cursor: pointer;
    }
}
.notice {
  display: flex;
  align-items: center;
  width: 764px;
  height: 40px;
  background: #e8402e;
  opacity: 1;
  border-radius: 10px;
  margin: 0 auto 30px;
  .icon {
    width: 24px;
    height: 18px;
    margin: 0 16px 0 30px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tips {
    color: #fff;
    font-size: 18px;
    font-family: Microsoft YaHei;
    height: 40px;
    line-height: 40px;
  }
}
</style>
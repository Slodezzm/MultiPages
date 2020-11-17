<template>
  <div class="Rank">
    <!-- 我的排名 -->
    <div class="row" v-if="isLogin">
      <div class="lable">我的排名</div>
      <div class="mygameRecord" @click="mygameRecord">我的游戏记录></div>
    </div>
    <div class="myrank_bg" v-if="isLogin">
      <div class="left">
        <div class="ranking">NO.{{mySelfHistoryInfo.sort || 0}}</div>
        <div class="avatar">
          <img v-lazy="mySelfHistoryInfo.avatar" data-avatar="1" alt />
        </div>
        <div class="userInfo">
          <div class="userName">{{mySelfHistoryInfo.username}}</div>
          <div class="num">参与次数：{{mySelfHistoryInfo.counts || 0}}</div>
        </div>
      </div>
      <div class="right">
        <div class="historicalIntegral">历史积分：{{mySelfHistoryInfo.integral || 0}}</div>
        <router-link to="/prize" v-if="endtime <= 7">
          <div class="exchangePrize">
            <img src="@/assets/bobing/PC/btn_duihuan_s.png" alt />
          </div>
        </router-link>
      </div>
    </div>
    <!-- 总积分排名 -->
    <div class="row">
      <div
        class="lable"
      >总积分排名</div>
    </div>
    <div class="rank_bg">
      <el-scrollbar style="height:100%" v-if="otherUserHistoryList.length > 0">
        <div class="infinite-list" v-infinite-scroll="load">
          <div class="row" v-for="(item,index) in otherUserHistoryList" :key="index">
            <div class="left">
              <div class="ranking">NO.{{index + 1}}</div>
              <div class="avatar">
                <img v-lazy="item.avatar" data-avatar="1" alt />
              </div>
              <div class="userInfo">
                <div class="userName">{{item.username}}</div>
                <div class="num">参与次数：{{item.counts}}</div>
              </div>
            </div>
            <div class="right">历史积分：{{item.integral}}</div>
          </div>
        </div>
      </el-scrollbar>
      <!-- 缺省页 -->
      <no-msg v-else-if="$store.state.Loading" />
    </div>
    <game-record v-if="showGameRecord" />
  </div>
</template>

<script>
import gameRecord from "@/PC/bobing/components/gameRecord.vue";
import noMsg from "@/PC/bobing/components/noMsg.vue";
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState(["endtime"])
  },
  components: {
    gameRecord,
    noMsg,
  },
  data() {
    return {
      isLogin: false,
      showGameRecord: false,
      hasNextMark: 0,
      mySelfHistoryInfo: {
        sort: "",
        avatar: "",
        username: "",
        counts: "",
        integral: "",
      },
      otherUserHistoryList: [],
      pageNo: 1,
      pageSize: 10,
    };
  },
  methods: {
    // 我的游戏记录
    mygameRecord() {
      this.showGameRecord = true;
    },
    // 获取列表数据
    getList() {
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/query_history_integral_list",
        data: { pageNo: this.pageNo, pageSize: this.pageSize },
      })
        .then((res) => {
          let {
            hasNextMark,
            mySelfHistoryInfo,
            otherUserHistoryList,
          } = res.data;
          this.hasNextMark = hasNextMark;
          this.otherUserHistoryList = [
            ...this.otherUserHistoryList,
            ...otherUserHistoryList,
          ];
          this.mySelfHistoryInfo = mySelfHistoryInfo;
        })
        .catch((err) => {});
    },
    // 加载更多
    load() {
      if (this.hasNextMark === 1) {
        this.pageNo = ++this.pageNo;
        this.getList();
      }
    },
  },
  mounted() {
    // util.toLogin();
    this.getList();
    this.isLogin = util.getCookie("AJ1sOD_token");
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.row {
  display: flex;
  justify-content: space-between;
  margin: 17px 0 9px;
  align-items: center;
  color: #fff;
  font-size: 28px;
  .lable {
    line-height: 34px;
    position: relative;
    padding-left: 46px;
    &::before {
      @include absolute;
      left: 34px;
      content: "";
      display: inline-block;
      width: 8px;
      height: 28px;
      background: #fff;
      border-radius: 4px;
    }
  }
  .mygameRecord {
    cursor: pointer;
  }
}
.myrank_bg {
  width: 100%;
  height: 146px;
  background: url("../../../assets/bobing/PC/myrank_bg.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  padding: 0 70px 0;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .ranking {
      font-size: 24px;
      color: $color1;
      width: 177px;
      padding: 0 17px 0 42px;
      @include lineClamp1;
    }
    .avatar {
      width: 60px;
      height: 60px;
      margin-right: 25px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .userInfo {
      width: 400px;
      .userName {
        color: $color2;
        font-size: 20px;
        @include lineClamp1;
        margin-bottom: 3px;
      }
      .num {
        font-size: 16px;
        color: #707070;
      }
    }
  }

  .right {
    width: 200px;
    color: $color5;
    font-size: 20px;
    text-align: right;
    line-height: 28px;
    .historicalIntegral {
      @include lineClamp1;
    }
    .exchangePrize {
      width: 125px;
      height: 35px;
      float: right;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.rank_bg {
  width: 100%;
  height: 1060px;
  background: url("../../../assets/bobing/PC/rank_bg.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 44px;
  padding: 22px 10px 28px 70px;
  .row {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 60px;
    .left {
      display: flex;
      align-items: center;
      .ranking {
        font-size: 24px;
        color: $color1;
        width: 177px;
        padding: 0 17px 0 42px;
        @include lineClamp1;
      }
      .avatar {
        width: 60px;
        height: 60px;
        margin-right: 25px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .userInfo {
        width: 400px;
        .userName {
          color: $color2;
          font-size: 20px;
          @include lineClamp1;
          margin-bottom: 3px;
        }
        .num {
          font-size: 16px;
          color: #707070;
        }
      }
    }

    .right {
      width: 200px;
      color: $color5;
      font-size: 20px;
      text-align: right;
      line-height: 28px;
      @include lineClamp1;
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  padding-right: 20px;
}
</style>
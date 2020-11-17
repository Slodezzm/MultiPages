<template>
  <div class="charge">
    <div class="flex_box">
      <div class="lable">钻石充值</div>
      <div class="surplusCount">剩余游戏次数 {{ count || 0 }}</div>
    </div>
    <div class="rechargeList">
      <div
        class="item"
        :class="{ active: tCount === item.count }"
        v-for="(item, index) in diamondList"
        :key="index"
        @click="changeDemon(item)"
      >
        <div class="demonNum">{{ item.diamonds }}钻石</div>
        <div class="demon">
          <img src="@/assets/bobing/PC/demon.png" alt />
        </div>
        <div>充值{{ item.count }}次</div>
      </div>
    </div>
    <div class="payBtn" @click="checkLogin">支付{{ diamonds }}钻石</div>
    <div class="lable">游戏任务</div>
    <div class="taskList">
      <div class="taskItem" v-for="(item, index) in taskList" :key="index">
        <div class="left">
          <div class="taskType">
            <img
              v-if="index === 0"
              src="@/assets/bobing/PC/task_release.png"
              alt
            />
            <img
              v-else-if="index === 1"
              src="@/assets/bobing/PC/task_video.png"
              alt
            />
            <img v-else src="@/assets/bobing/PC/task_tuidan.png" alt />
          </div>
          <div class="taskContent">
            <div class="taskName">{{ item.taskName }}</div>
            <div class="flex">
              <div class="num">
                {{ item.finishQuota }}/{{ item.canFinishCount }}次
              </div>
              <div class="frequency">{{ item.rewardGameNumber }}次游戏</div>
            </div>
          </div>
        </div>
        <div class="finish">
          <div v-if="item.status === 1" class="finishBtn">
            已奖励{{ item.rewardGameNumber }}次
          </div>
          <a :href="taskListHref[index]" target="_blank" v-else>
            <img src="@/assets/bobing/PC/btn_task.png" alt />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["isLogin", "gameType", "withMulti", "endtime", "roomId", "count"]),
  },
  data() {
    return {
      tCount: 1,
      diamonds: "",
      diamondList: [],
      taskList: [],
      taskListHref: [
        "/coor/docs/index.html#/PC/information",
        "/index.php?g=&m=Shortvideo&a=dolist&channel=2-2",
        "/memberCenter/#recomendEvents",
      ],
    };
  },
  methods: {
    changeDemon(item) {
      this.diamonds = item.diamonds;
      this.tCount = item.count;
    },
    checkLogin() {
      if (this.isLogin) {
        this.toPay();
      } else {
        util.toLogin();
      }
    },
    // 支付钻石
    toPay() {
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/recharge",
        data: { diamonds: this.diamonds, count: this.tCount },
      }).then((res) => {
        if (res.code === "success") {
          this.$store.commit("setState",{count:res.data.count})
          this.$confirm("是否跳转到游戏首页？", "充值成功")
            .then(() => {
              if (this.gameType === "multi") {
                this.$router.push({ path: "/", query: { id: this.roomId } });
                this.$parent.initGame();
              } else {
                this.$router.push({ path: "/", query: {} });
                this.$parent.initGame();
              }
            })
            .catch(() => {
              window.location.reload();
            });
        } else {
          this.$message(res.msg);
        }
      });
    },
    // 初始化数据
    initData() {
      ajax({
        method: "GET",
        url: "/live/api/mid_autumn/init_data",
        data: {},
      }).then((res) => {
        if (res.code === "success") {
          let {
            consumeDiamond,
            threeConsumeDiamond,
            fiveConsumeDiamond,
            tenConsumeDiamond,
            fifteenConsumeDiamond,
            twentyConsumeDiamond,
            taskList,
            count
          } = res.data;
          let diamondList = [
            { diamonds: consumeDiamond, count: 1 },
            { diamonds: threeConsumeDiamond, count: 3 },
            { diamonds: fiveConsumeDiamond, count: 5 },
            { diamonds: tenConsumeDiamond, count: 10 },
            { diamonds: fifteenConsumeDiamond, count: 15 },
            { diamonds: twentyConsumeDiamond, count: 20 },
          ];
          this.diamonds = consumeDiamond;
          this.diamondList = diamondList;
          this.taskList = taskList;
          this.surplusCount = count
        } else {
          this.$message(res.msg);
        }
      });
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.charge {
  width: 100%;
  height: 630px;
  background: url("../../../assets/bobing/PC/recharge_bg.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 80px;
  padding: 26px 55px 0;
  .flex_box {
    display: flex;
    justify-content: space-between;
    .lable {
      line-height: 25px;
      position: relative;
      padding-left: 11px;
      color: #3c3c3c;
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 18px;
      font-family: PingFang SC;
      &::before {
        @include absolute;
        left: 0;
        content: "";
        display: inline-block;
        width: 4px;
        height: 18px;
        background: #f94048;
        border-radius: 4px;
      }
    }
    .surplusCount{
      font-size: 16px;
      color: #F8513D;
    }
  }

  .rechargeList {
    display: flex;
    justify-content: space-between;
    .item {
      width: 152px;
      height: 174px;
      border: 1px solid #ffb367;
      border-radius: 12px;
      text-align: center;
      color: $color1;
      cursor: pointer;
      .demonNum {
        font-size: 16px;
        margin: 24px 0 6px;
      }
      .demon {
        width: 61px;
        height: 62px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .active {
      border: 2px solid #f94048;
    }
  }
  .payBtn {
    width: 250px;
    height: 49px;
    line-height: 49px;
    text-align: center;
    background: #f8513d;
    border-radius: 42px;
    margin: 45px auto 15px;
    cursor: pointer;
    color: #fff;
  }
  .taskList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .taskItem {
      width: 476px;
      height: 87px;
      background: #fff5d5;
      border-radius: 8px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px 0 25px;
      .left {
        display: flex;
        align-items: center;
        .taskType {
          width: 50px;
          height: 50px;
          margin-right: 19px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .taskContent {
          font-size: 16px;
          .taskName {
            margin-bottom: 5px;
            font-size: 18px;
            color: #333333;
          }
          .flex {
            display: flex;
            .num {
              color: #8e8e8e;
              margin-right: 14px;
            }
            .frequency {
              color: $color1;
            }
          }
        }
      }
      .finish {
        width: 107px;
        height: 35px;
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .finishBtn {
          width: 100%;
          height: 100%;
          border-radius: 33px;
          line-height: 35px;
          background: #feffec;
          color: $color1;
          text-align: center;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
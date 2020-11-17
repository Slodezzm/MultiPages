<template>
  <div class="gameRecord">
    <div class="recordsBox">
      <div class="close">
        <i @click="close" class="el-icon-close"></i>
      </div>
      <div class="mytable">
        <el-scrollbar style="height:100%" v-if="drawnList.length > 0">
          <div class="infinite-list" v-infinite-scroll="load">
            <div class="row" v-for="(item,index) in drawnList" :key="index">
              <div class="left">
                <div class="type">{{item.gameType === '1'?'单人游戏':'多人游戏'}}</div>
                <div class="time">{{item.createTime}}</div>
              </div>
              <div class="right">{{item.drawnType}} +{{item.integral || 0}}分</div>
            </div>
          </div>
        </el-scrollbar>
        <!-- 缺省页 -->
        <no-msg v-else-if="$store.state.Loading" />
      </div>
    </div>
  </div>
</template>

<script>
import noMsg from "@/PC/bobing/components/noMsg.vue";
export default {
  components: {
    noMsg,
  },
  data() {
    return {
      drawnList: [],
      hasNextMark: 0,
      pageNo: 1,
      pageSize: 10,
    };
  },
  methods: {
    // 关闭兑换记录
    close() {
      document.body.style.cssText = "overflow-y:auto";
      this.$parent.showGameRecord = false;
    },
    // 获取列表数据
    getList() {
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/query_history_game_list",
        data: { pageNo: this.pageNo, pageSize: this.pageSize },
      })
        .then((res) => {
          let { hasNextMark, drawnList } = res.data;
          this.hasNextMark = hasNextMark;
          this.drawnList = [...this.drawnList,...drawnList];
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
  created() {
    document.body.style.cssText = "overflow-y:hidden";
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.gameRecord {
  @include Popup;
  .recordsBox {
    @include absolute;
    width: 493px;
    height: 457px;
    background: url("../../../assets/bobing/PC/youxijilukuang.png") no-repeat;
    background-size: 100% 100%;
    .close {
      text-align: right;
      padding: 15px 15px 37px;
      i {
        font-size: 18px;
        color: #fff;
        cursor: pointer;
      }
    }
    .mytable {
      width: 100%;
      height: 363px;
      padding: 0 10px 0 30px;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72x;
        padding: 15px 0 10px;
        border-bottom: 1px solid $border_main2;
        &:nth-child(1) {
          padding-top: 0;
        }
        .left {
          .type {
            color: $color2;
            font-size: 16px;
          }
          .time {
            color: $color3;
            font-size: 14px;
            margin-top: 3px;
          }
        }
        .right {
          font-size: 16px;
          color: $color6;
        }
      }
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  padding-right: 20px;
}
</style>
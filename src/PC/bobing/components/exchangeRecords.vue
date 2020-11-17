<template>
  <div class="exchangeRecords">
    <div class="recordsBox">
      <div class="close">
        <i @click="close" class="el-icon-close"></i>
      </div>
      <div class="userInfo">
        <div class="avatar">
          <img v-lazy="avatar" data-avatar="1" alt />
        </div>
        <div class="userName">{{username}}</div>
        <div class="integral">
          当前积分：
          <span>{{integral || 0}}</span>
        </div>
      </div>
      <div class="lable">兑换记录</div>
      <div class="mytable">
        <el-scrollbar style="height:100%" v-if="exchangeList.length > 0">
          <div class="infinite-list" v-infinite-scroll="load">
            <div class="row" v-for="(item,index) in exchangeList" :key="index">
              <div class="left">
                <div class="goodsName">兑换了“{{item.prizeName}}”</div>
                <div class="time">{{item.createTime}}</div>
              </div>
              <div class="right">-{{item.integral}}积分</div>
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
import { mapState } from 'vuex' 
import noMsg from "@/PC/bobing/components/noMsg.vue";
export default {
  computed:{
    ...mapState(["integral"])
  },
  components: {
    noMsg,
  },
  data() {
    return {
      currentIntegral: "", //当前积分
      username: "",
      avatar: "",
      exchangeList:[],
      exchangeListw:[],
      hasNextMark: 0,
      pageNo: 1,
      pageSize: 10,
    };
  },
  methods: {
    // 关闭兑换记录
    close() {
      document.body.style.cssText = "overflow-y:auto";
      this.$parent.closeExchangeRecords = false;
    },
    // 获取列表数据
    getExchangeList() {
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/query_exchange_list",
        data: { pageNo: this.pageNo, pageSize: this.pageSize },
      })
        .then((res) => {
          let {
            hasNextMark,
            exchangeList,
            currentIntegral,
            username,
            avatar,
          } = res.data;
          this.hasNextMark = hasNextMark;
          this.currentIntegral = currentIntegral;
          this.username = username;
          this.avatar = avatar;
          this.exchangeList = [...this.exchangeList, ...exchangeList];
        })
        .catch((err) => {});
    },
    // 加载更多
    load() {
      if (this.hasNextMark === 1) {
        this.pageNo = ++this.pageNo;
        this.getExchangeList();
      }
    },
  },
  created() {
    document.body.style.cssText = "overflow-y:hidden";
    this.getExchangeList();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.exchangeRecords {
  @include Popup;
  .recordsBox {
    @include absolute;
    width: 493px;
    height: 477px;
    background: url("../../../assets/bobing/PC/duihuanjilkuan.png") no-repeat;
    background-size: 100% 100%;
    .close {
      text-align: right;
      padding: 15px 15px 42px;
      i {
        font-size: 18px;
        color: #fff;
        cursor: pointer;
      }
    }
    .userInfo {
      width: 70%;
      text-align: center;
      margin: 0 auto;
      color: $color2;
      font-size: 16px;
      font-family: Microsoft YaHei;
      .avatar {
        width: 60px;
        height: 60px;
        margin: 0 auto;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
      .userName {
        margin: 9px 0 8px;
      }
      .integral {
        font-weight: bold;
        font-size: 12px;
        font-family: Arial;
        span {
          font-size: 18px;
          color: $color1;
        }
      }
      .integral,
      .userName {
        @include lineClamp1;
      }
    }
    .lable {
      color: $color2;
      font-size: 18px;
      line-height: 25px;
      margin: 20px 0 15px;
      &::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 15px;
        background: $bg1;
        border-radius: 4px;
        margin: 0 8px 0 30px;
      }
    }
    .mytable {
      width: 100%;
      height: 212px;
      padding: 0 10px 0 30px;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70x;
        padding: 15px 0 10px;
        border-bottom: 1px solid $border;
        &:nth-child(1) {
          padding-top: 0;
        }
        .left {
          .goodsName {
            color: $color2;
            font-size: 16px;
          }
          .time {
            color: $color3;
            font-size: 14px;
            margin-top: 5px;
          }
        }
        .right {
          font-size: 16px;
          color: $color1;
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
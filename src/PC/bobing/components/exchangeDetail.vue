<template>
  <div class="exchangeDetail">
    <div class="exchangeBox">
      <div class="close">
        <i @click="close" class="el-icon-close"></i>
      </div>
      <el-carousel
        arrow="never"
        height="272px"
        :autoplay="false"
        @change="changeIndex"
        ref="carousel"
        v-if="exchangeList.length > 0"
      >
        <el-carousel-item v-for="(item,index) in exchangeList" :key="index">
          <!-- 奖品信息 -->
          <div class="prizeInfo">
            <div class="prizeImg">
              <img v-lazy="item.prizeImg" alt />
            </div>
            <div class="detailBox">
              <div class="prizeName">奖品名：{{item.prizeName}}</div>
              <div class="status">
                状 态：
                <span>{{item.status}}</span>
              </div>
              <div class="orderNum">快递单号：{{item.expressNumber || '-'}}</div>
            </div>
          </div>
          <!-- 地址信息 -->
          <div class="userInfo">
            <div class="avatar">
              <img v-lazy="item.avatar" data-avatar="1" alt />
            </div>
            <div class="detailBox">
              <div class="userName">
                {{item.username}}
                <span>{{item.mobile}}</span>
              </div>
              <div class="address">{{item.address}}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <!-- 缺省页 -->
      <no-msg v-else-if="$store.state.Loading" />
      <!-- 左右箭头 -->
      <div class="prev_next">
        <i class="el-icon-arrow-left" :class="{'activeIndex':activeIndex!=0}" @click="setActiveItem(0)"></i>
        <i class="el-icon-arrow-right" :class="{'activeIndex':activeIndex!=exchangeList.length-1}" @click="setActiveItem(1)"></i>
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
  props: ["prizeId"],
  data() {
    return {
      activeIndex: 0,
      exchangeList: [],
    };
  },
  methods: {
    changeIndex(index) {
      this.activeIndex = index;
    },
    setActiveItem(index){
      // index:0左箭头 1右箭头
      if(index === 1){
        this.$refs.carousel.setActiveItem(++this.activeIndex)
      }else{
        this.$refs.carousel.setActiveItem(--this.activeIndex)
      }
    },
    // 关闭兑换记录
    close() {
      document.body.style.cssText = "overflow-y:auto";
      this.$parent.showExchangeDetail = false;
    },
    // 获取列表数据
    getData() {
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/exchange_prize_details",
        data: { orderId: this.prizeId },
      }).then((res) => {
        this.exchangeList = res.data;
      });
    },
  },
  created() {
    document.body.style.cssText = "overflow-y:hidden";
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.exchangeDetail {
  @include Popup;
  .exchangeBox {
    @include absolute;
    width: 493px;
    height: 361px;
    background: url("../../../assets/bobing/PC/duihuanxianqingkuang.png")
      no-repeat;
    background-size: 100% 100%;
    padding: 0 14px;
    .close {
      text-align: right;
      padding: 15px 1px 52px;
      i {
        font-size: 18px;
        color: #fff;
        cursor: pointer;
      }
    }
    .prev_next {
      width: 100%;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      left: 0;
      top: 173px;
      z-index: 9999999999999;
      i {
        font-size: 30px;
        color: #e5e5e5;
        cursor: pointer;
      }
      .activeIndex{
        color: #f8513d;
      }
    }
    .prizeInfo {
      width: 100%;
      padding: 0 30px 20px;
      display: flex;
      border-bottom: 1px dashed #cecece;
      margin-bottom: 20px;
      .prizeImg {
        width: 120px;
        height: 120px;
        margin-right: 31px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .detailBox {
        flex: 1;
        font-size: 14px;
        color: $color2;
        font-family: PingFang SC;
        overflow: hidden;
        .prizeName {
          font-size: 16px;
          font-weight: 600;
          margin-top: 16px;
        }
        .status {
          margin: 20px 0 5px;
          span {
            color: $color4;
          }
        }
        .prizeName,
        .status,
        .orderNum {
          @include lineClamp1;
        }
      }
    }
    .userInfo {
      width: 100%;
      padding: 0 35px 0 30px;
      display: flex;
      .avatar {
        margin: 6px 20px 0 0;
        width: 60px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .detailBox {
        flex: 1;
        font-size: 16px;
        font-family: PingFang SC;
        .userName {
          color: #000;
          margin-bottom: 5px;
          span {
            color: #9b9b9b;
          }
        }
        .address {
          color: #707070;
          @include lineClamp2;
        }
      }
    }
  }
}
/deep/ .el-carousel__button {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f8513d;
}
// /deep/ .el-carousel__arrow {
//   width: 30px;
//   height: 30px;
//   top: 31%;
//   background-color: #feffec;
//   i {
//     font-size: 30px;
//     color: #e5e5e5;
//   }
// }
// /deep/ .el-carousel__arrow--left {
//   left: 10px;
// }
// /deep/ .el-carousel__arrow--right {
//   right: 10px;
// }
</style>
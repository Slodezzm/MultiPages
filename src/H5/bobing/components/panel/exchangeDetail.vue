<template>
  <div class="detail">
    <van-swipe class="my-swipe" autoplay="false" indicator-color="white" :showIndicators="true">
      <template v-for="(item, i) in list">
        <van-swipe-item :key="'list-' + i">
          <div class="goods">
            <img v-lazy="item.prizeImg" :alt="item.prizeName" class="goods_pic">
            <div class="infos">
              <p class="goods_title">奖品名:{{item.prizeName}}</p>
              <div class="status">状<span class="space"></span>态:<span class="sr">{{item.status}}</span></div>
              <div class="express">快递单号:<span class="sr">{{item.expressNumber || '暂无'}}</span></div>
            </div>
          </div>
          <div class="split_line"  :key="'split-' + i"></div>
          <div class="address" :key="'address-' + i">
            <img v-lazy="item.avatar" class="avatar">
            <div class="add_infos">
              <p class="name_pho">
                <span class="name">{{item.username}}</span>
                <span class="pho">{{item.mobile}}</span>
              </p>
              <p class="add">{{item.address}}</p>
            </div>
          </div>
        </van-swipe-item>
      </template>
    </van-swipe>
  </div>
</template>

<script>

export default {
  props:["id"],
  data() {
    return {
      list: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    getDetail(){
      this.$http({
        url: "/live/api/mid_autumn/exchange_prize_details",
        method: "POST",
        data: {
          orderId: this.id
        }
      }).then(res => {
        this.list = [...res.data]
      })
    }
  },
  created() {
  
  },
  mounted() {
    this.getDetail()
  },
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.detail {
  position: relative;
  @include wh(88vw, auto);
  padding: 0 3.5vw;
  overflow: hidden;
  .goods {
    @include rule;
    @include fs;
    margin-top: 5vw;
    .goods_pic {
      display: block;
      @include vwh(26.7, 26.7);
    }
    .infos {
      position: relative;
      flex: 1;
      height: auto;
      margin-left: 5vw;
      text-align: left;
      word-break: break-all;
      .goods_title {
        @include rule;
        font-size: 3.7vw;
        color: #333;
        font-weight: bold;
        line-height: 5.3vw;
        margin-bottom: 3vw;
      }
      .status, .express {
        @include rule;
        font-size: 3.2vw;
        color: #333;
        line-height: 6vw;
        .sr {
          margin-left: 2vw;
        }
      }
      .status {
        .space {
          padding-left: 2em;
        }
        .sr {
          color: #F8513D;
        }
      }
    }
  }
  .address {
    @include rule;
    @include fs;
    text-align: left;
    .avatar {
      display: block;
      @include vwh(16, 16);
      border-radius: 50%;
    }
    .add_infos {
      position: relative;
      flex: 1;
      height: auto;
      font-size: 3.7vw;
      color: #777;
      font-weight: 400;
      line-height: 5.3vw;
      word-break: break-all;
      margin-left: 4vw;
      .name {
        color: #333;
        margin-right: 1vw;
      }
      .pho {
        color: #999;
      }
      .add {
        margin-top: 2vw;
      }
    }
  }
}
</style>
<style>
.my-swipe.van-swipe {
  padding-bottom: 10vw;
}
  .van-swipe__indicators {
    bottom: 0;
  }
  .van-swipe__indicator{
    background: #7e7671;
  }
  .van-swipe__indicator.van-swipe__indicator--active {
    background: #ed7c41 !important;
  }
</style>
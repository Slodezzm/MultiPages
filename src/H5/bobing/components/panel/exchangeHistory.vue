<template>
  <div class="history">
    <div class="user_info">
      <img v-lazy="user.avatar" data-avatar="1" class="avatar">
      <p class="name">{{user.username}}</p>
      <p class="current_score">当前积分:<span>{{user.currentIntegral}}</span></p>
    </div>
    <p class="title">兑换记录</p>
    <ul class="list" v-if="list.length > 0">
      <li class="item" v-for="item in list" :key="item.orderId">
        <div class="goods_time">
          <p class="goods">兑换了“{{item.prizeName}}” *1</p>
          <p class="time">{{item.createTime}}</p>
        </div>
        <p class="deduct">-{{item.integral}}积分</p>
      </li>
    </ul>
    <no-content text="暂无兑换记录" v-else />
    <div class="load_more" v-if="showMore" @click="getList">点击加载更多</div>
  </div>
</template>

<script>
import noContent from '../public/noContent'
export default {
  components: {
    noContent
  },
  data() {
    return {
      list: [],
      pageNo: 0,
      showMore: true,
      user: {
        avatar: "",
        currentIntegral: 0,
        username: ""
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    getList(){
      this.pageNo++
      this.$http({
        url: "/live/api/mid_autumn/query_exchange_list",
        method: "POST",
        data: {
          pageNo: this.pageNo,
          pageSize: 20
        }
      }).then(res => {
        if (res.code === "success") {
          this.list = [...this.list, ...res.data.exchangeList]
          this.showMore = res.data.hasNextMark === 1
          this.user = {
            avatar: res.data.avatar,
            currentIntegral: res.data.currentIntegral,
            username: res.data.username
          }
        } else {
          this.$toast(res.msg || "请求失败，请稍后重试!")
          this.showMore = false
        }
        console.log(this.list)
      })
    }
  },
  created() {
  
  },
  mounted() {
    this.getList()
  },
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.history {
  position: relative;
  @include wh(88vw, auto);
  padding: 3.5vw;
  .user_info {
    @include rule;
    @include fc;
    flex-direction: column;
    .avatar {
      display: block;
      @include vwh(13.3, 13.3);
      border-radius: 50%;
    }
    .name {
      font-size: 3.2vw;
      color: #333;
      line-height: 4.6vw;
      margin: 1.5vw auto;
    }
    .current_score {
      font-size: 3.2vw;
      color: #333;
      font-weight: bold;
      line-height: 5vw;
      span {
        color: #F8513D;
        font-size: 4.3vw;
        line-height: 5vw;
      }
    }
  }
  .title {
    position: relative;
    @include wh(auto, 5.2vw);
    padding-left: 2vw;
    text-align: left;
    font-size: 3.7vw;
    line-height: 5.2vw;
    color: #333;
    font-weight: bold;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      @include wh(1vw, 100%);
      background: #F8513D;
      border-radius: 0.5vw;
    }
  }
  .list {
    @include rule;
    .item {
      position: relative;
      @include wh(100%, 15vw);
      @include fs;
      font-size: 3.7vw;
      font-weight: 400;
      line-height: 5.2vw;
      text-align: left;
      border-bottom: 1px solid #EEE;
      .goods_time {
        position: relative;
        flex: 1;
        height: auto;
        margin-right: 2vw;
        .goods {
          position: relative;
          @include wh(100%, 5.2vw);
          color: #333;
          @include omit(1);
        }
        .time {
          font-size: 3.2vw;
          color: #999;
        }
      }
      .deduct {
        color: #F8513D;
      }
    }
  }
  .load_more {
    font-size: 3.6vw;
    color: #ed7c41;
    line-height: 5.4vw;
    text-decoration: underline;
  }
}
</style>
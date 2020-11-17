<template>
  <div class="exchange" :class="{needBack: showBack}">
    <back />
    <div class="box">
      <div class="add_pay">
        <ul class="add_list">
          <template v-if="list.length > 0">
            <li class="list" v-for="(item, i) in list" :key="item.id" :class="{selected:selected == i}" @click="selected = i">
              <div class="add_info">
                <p class="name_phone">
                  <span class="name">{{item.receiveName}}</span>
                  <span class="phone">{{item.receiveMobile}}</span>
                </p>
                <p class="add">{{item.receiveAddress}}</p>
              </div>
              <router-link class="change_add" :to="'/editadd/' + item.id"></router-link>
            </li>
          </template>
          <router-link class="list" to="/editadd/0" v-if="list.length < 6">
            <div class="add_info">
              <p class="new_add">新增收货地址</p>
            </div>
            <span class="change_add"></span>
          </router-link>
        </ul>
        <span class="pay_scroe" @click="Exchange">支付{{integral}}积分</span>
      </div>
    </div>
  </div>
</template>

<script>
import back from '../components/public/back'
export default {
  props:["id"],
  components: {
    back
  },
  data() {
    return {
      integral: 0,
      showBack: true,
      list: [],
      selected: -1,
    }
  },
  methods: {
    getAddList(){
      this.$http({
        url: "/live/api/turntable/query_consignee_list_by_uid",
        method: "GET"
      }).then(res => {
        if (res.code === "success") {
          this.list = [...res.data.consigneeVOList]
          this.$nextTick(() => {
            this.list.forEach((a,i) => {
              if (a.defaultFlag === 1) {
                console.log(i)
                return this.selected = i
              }
            })
          })
        } else {
          this.$toast(res.msg || "加载失败，请稍后重试!")
        }
      })
    },
    Exchange(){
      if (this.selected < 0) {
        return this.$toast("请选择收货地址！")
      }
      this.$http({
        url: "/live/api/mid_autumn/exchange_integral",
        method: "POST",
        data: {
          prizeId: this.id,
          addressId: this.list[this.selected].id
        }
      }).then(res => {
        if (res.code === "success") {
          this.$dialog({
            title: "兑换成功",
            message: "恭喜您兑换成功，我们在核实后将为您寄出相关礼品，请您继续关注！"
          }).then(() => {
            this.$router.push({path: "/prize"})
          })
          this.$nextTick(() => {
            this.$store.commit("setState",{integral: res.data.currentIntegral})  
          })
        } else {
          this.$toast(res.msg || "请求失败，请稍后重试!")
        }
      })
    }
  },
  created() {
    this.integral = this.$route.query.itg
  },
  mounted() {
    this.getAddList()
  },
  beforeCreate() {}, 
  beforeMount() {}, 
  beforeUpdate() {}, 
  updated() {}, 
  activated() {}, 
  destroyed() {}, 
  beforeDestroy() {}, 
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.exchange {
  @include rule;
  min-height: 100vh;
  background: url("~@/assets/bobing/otherbg.png") no-repeat top center/100% auto, #e94b26;
  background-attachment:fixed;
  padding: 9vw 4.4vw;
  &.needBack {
    padding-top: 12vw;
  }
  .box {
    position: relative;
    @include wh(100%, auto);
    background: transparent;
    padding: 8px;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      @include wh(100%, 100%);
      border: 5px solid #ffdaa1;
      border-radius: 20px;
      box-sizing: border-box;
    }
    .add_pay {
      position: relative;
      @include wh(100%, 100%);
      background: #fdfeeb;
      border-radius: 10px;
      padding: 5vw;
      padding-bottom: 27vw;
      .pay_scroe {
        position: absolute;
        left: 50%;
        bottom: 9vw;
        @include wh(auto, 9vw);
        transform: translateX(-50%);
        border-radius: 4.5vw;
        background: #F8513D;
        line-height: 9vw;
        color: #FFF;
        font-size: 4.3vw;
        padding: 0 6vw;
        &:active {
          transform: scale(0.9) translateX(-50%);
        }
      }
      .add_list {
        @include rule;
        .list {
          @include rule;
          min-height: 16vw;
          border: 1px solid #CCC;
          border-radius: 12px;
          margin-top: 4vw;
          background: url("~@/assets/bobing/location.png") no-repeat 2.7vw center/10.7vw 10.7vw;
          padding: 2vw;
          padding-left: 16vw;
          @include fs;
          text-align: left;
          &:first-child {
            margin-top: 0;
          }
          &.selected {
            border: 2px solid #f8513d;
            background: url("~@/assets/bobing/location.png") no-repeat 2.7vw center/10.7vw 10.7vw, url("~@/assets/bobing/choice_add.png") no-repeat right bottom/5.4vw auto;
          }
          .add_info {
            position: relative;
            flex: 1;
            height: auto;
            font-weight: 400;
            .name_phone {
              position: relative;
              @include wh(100%, auto);
              line-height: 5.3vw;
              font-size: 3.7vw;
              color: #000;
              @include omit(1);
              .phone {
                color: #777;
                margin-left: 2vw;
              }
            }
            .add {
              position: relative;
              @include wh(100%, auto);
              line-height: 4.4vw;
              font-size: 3.2vw;
              color: #777;
              word-break: break-all;
              margin-top: 1vw;
            }
            .new_add {
              position: relative;
              @include wh(auto, auto);
              font-size: 3.7vw;
              line-height: 5.3vw;
              color: #333;
            }
          }
          .change_add {
            position: relative;
            @include vwh(4.8, 4.8);
            background: url("~@/assets/bobing/change_add.png") no-repeat center/contain;
            margin-left: 2vw;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="editadd">
    <div class="top">
      <span class="back" @click="$router.go(-1)"></span>
      <p class="title">{{id == 0 ? '新增' : '编辑'}}地址</p>
      <span class="save" @click="editAdd">保存</span>
    </div>
    <div class="add_info">
      <div class="add_line">
        <input type="text" placeholder="请填写收货人姓名" class="name_num" v-model="crrAdd.receiveName">
      </div>
      <div class="add_line">
        <input type="text" placeholder="请填写收货人电话" maxlength="11" class="name_num" v-model="crrAdd.receiveMobile">
      </div>
      <div class="add_line" @click="showAddChoice = true">
        <span class="choice" v-if="ssq.length === 0">请选择您的省市区</span>
        <div class="ssq_box" v-else>
          <span class="ssq" v-for="(item, i) in ssq" :key="'ssq-' + i">{{item.name}}</span>
        </div>
        <span class="to_choice"></span>
      </div>
      <div class="detail_add">
        <textarea class="detail_enter" placeholder="请填写详细地址" v-model="crrAdd.receiveAddress"></textarea>
      </div>
    </div>
    <div class="explain">请确保您的信息填写正确，错误的收货信息导致快递无法送达的情况，平台概不负责补发</div>
    <transition name="fade">
      <div class="add_choice" v-if="showAddChoice">
        <van-area @confirm="selectArea" @cancel="cancelArea" class="choice" title="选择省市区" :area-list="areaList" />
      </div>
    </transition>
  </div>
</template>

<script>
import area from '@/common/area'
import { trim } from '@/common/unit'
// console.log(area)
export default {
  props: ['id'],
  data() {
    return {
      ssqcode: '',
      ssq:[],
      areaList: area,
      showAddChoice: false,
      crrAdd: {},
      lastAdd: {},
    }
  },
  methods: {
    selectArea(data){
      // console.log(data)
      this.ssq = [...data]
      // this.ssqcode = (data[data.length - 1].code).toString()
      this.showAddChoice = false
    },
    cancelArea(){
      this.showAddChoice = false
    },
    getAddList(){
      this.$http({
        url: "/live/api/turntable/query_consignee_list_by_uid",
        method: "GET"
      }).then(res => {
        res.data.consigneeVOList.forEach(a => {
          if (a.id == this.id) {
            this.crrAdd = {...a}
            this.lastAdd = {...a}
          }
        })
      })
    },
    editAdd(){
      if (trim(this.crrAdd.receiveName) === "" || trim(this.crrAdd.receiveMobile) === "" || trim(this.crrAdd.receiveAddress) === "") {
        return this.$toast("您的地址不完整，为了避免无法收到礼品，建议您完善您的地址信息！")
      }

      let url = "/live/api/turntable/save_consignee_info", data = {}

      if (this.id != 0) {
        url = "/live/api/turntable/modify_consignee_info_by_id"
        if (trim(this.crrAdd.receiveName) === trim(this.lastAdd.receiveName) && trim(this.crrAdd.receiveMobile) === trim(this.lastAdd.receiveMobile) && trim(this.crrAdd.receiveMobile) === trim(this.lastAdd.receiveMobile)) {
          return this.$toast("修改后再保存哦！")
        }
      }

      data.defaultFlag = 1
      data.receiveName = trim(this.crrAdd.receiveName)
      data.receiveMobile = trim(this.crrAdd.receiveMobile)
      data.receiveAddress = ""
      if (this.ssq.length === 3) {
        data.receiveAddress += this.ssq[0].name +this.ssq[1].name + this.ssq[2].name
      }
      data.receiveAddress += trim(this.crrAdd.receiveAddress)
      this.$http({
        url: "/live/api/turntable/save_consignee_info",
        method: "POST",
        data: data,
      }).then(res => {
        if (res.code === "success") {
          this.$toast.loading({
            message: '保存成功！',
            forbidClick: true,
            loadingType: 'spinner',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
      })
    }
  },
  mounted() {
    if (this.id === "0") {
      this.crrAdd = {
        defaultFlag: 1,
        receiveName: "",
        receiveMobile: "",
        receiveAddress: "",
        id: 0
      }
    } else {
      this.getAddList()
    }
  },
  // beforeDestroy() {
  //   this.areaList = null
  //   area = null
  // },
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.editadd {
  @include rule;
  min-height: 100vh;
  background: #f5f5f5;
  .top {
    position: relative;
    @include wh(100%, 12vw);
    background: #FFF;
    @include fs;
    padding: 0 4.3vw;
    .back {
      position: relative;
      @include vwh(6.4, 6.4);
      background: url("~@/assets/bobing/add_back.png") no-repeat center/contain;
    }
    .title {
      position: relative;
      flex: 1;
      height: auto;
      font-size: 4.8vw;
      line-height: 7.2vw;
      color: #222;
      font-weight: 500;
      margin: 0 2vw;
    }
    .save {
      position: relative;
      @include wh(auto, auto);
      padding: 2vw;
      font-size: 3.7vw;
      font-weight: 400;
      line-height: 5.9vw;
      color: #999;
    }
  }
  .add_info {
    @include rule;
    margin-top: 2vw;
    background: #FFF;
    .add_line {
      position: relative;
      @include wh(100%, 13.3vw);
      border-bottom: 1px solid #f5f5f5;
      @include fs;
      padding: 0 4.3vw;
      font-size: 3.7vw;
      .name_num {
        display: block;
        position: relative;
        @include wh(100%, 100%);
        background: transparent;
        border: none;
        outline: none;
        color: #666;
      }
      .choice {
        color: #777;
      }
      .to_choice {
        position: relative;
        @include vwh(4.3, 4.3);
        background: url("~@/assets/bobing/change_add.png") no-repeat center/contain;
      }
      .ssq_box {
        @include wh(auto,auto);
        @include fs;
        .ssq {
          margin-right: 2vw;
        }
      }
    }
    .detail_add {
      position: relative;
      @include wh(100%, 40vw);
      padding: 2vw 4.3vw;
      .detail_enter {
        position: relative;
        @include wh(100%, 100%);
        background: transparent;
        outline: none;
        line-height: 6vw;
      }
    }
  }
  .explain {
    @include rule;
    padding: 4.3vw;
    font-size: 3.2vw;
    line-height: 4.5vw;
    color: #999;
    text-align: left;
  }
  .add_choice {
    position: fixed;
    left: 0;
    top: 0;
    @include wh(100%, 100vh);
    background: rgba($color: #000000, $alpha: 0.6);
    z-index: 2001;
    .choice {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
}
</style>
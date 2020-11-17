<template>
  <div class="addAddress">
    <div class="addressBox" v-show="!showEditAddress">
      <div class="close">
        <i @click="close" class="el-icon-close"></i>
      </div>
      <div class="addressList">
        <el-scrollbar style="height:100%">
          <div class="infinite-list" v-infinite-scroll="load">
            <!-- 选择地址-编辑 -->
            <div
              class="addressItem"
              :class="{'addressItemActive':select === item.id}"
              v-for="item in consigneeVOList"
              :key="item.id"
              @click="changeSelect(item.id)"
            >
              <div class="icon">
                <img src="@/assets/bobing/PC/address.png" alt />
              </div>
              <div class="add">
                <div class="addressInfo">
                  <div class="userName">
                    {{item.receiveName}}
                    <span>{{item.receiveMobile}}</span>
                  </div>
                  <div class="address">{{item.receiveAddress}}</div>
                </div>
                <div class="right">
                  <i @click.stop="addAddress(item)" class="el-icon-arrow-right"></i>
                </div>
              </div>
              <div class="select" v-if="select === item.id">
                <img src="@/assets/bobing/PC/gou.png" alt />
              </div>
            </div>
            <!-- 添加地址 -->
            <div class="addressItem mb0">
              <div class="icon">
                <img src="@/assets/bobing/PC/address.png" alt />
              </div>
              <div class="add">
                <div>新增收获地址</div>
                <div class="right">
                  <i @click="addAddress()" class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <!-- 支付 -->
      <div class="pay"  @click="toPay">支付{{integral}}积分</div>
    </div>
    <!-- 编辑地址 -->
    <edit-address v-if="showEditAddress" :editAddress="editAddress" :selectId="select" />
  </div>
</template>

<script>
import editAddress from "@/PC/bobing/components/editAddress.vue";
export default {
  props: ["integral", "prizeId"],
  components: {
    editAddress
  },
  data() {
    return {
      showEditAddress: false,
      select: 0, //选中id
      editAddress: "", //编辑id
      consigneeVOList: [],
    };
  },
  methods: {
    // 关闭
    close() {
      document.body.style.cssText = "overflow-y:auto";
      this.$parent.showAddress = false;
    },
    // 添加地址-编辑地址
    addAddress(editAddress) {
      this.editAddress = editAddress || "";
      this.showEditAddress = true;
    },
    // 选择地址
    changeSelect(id) {
      this.select = id;
    },
    // 支付积分
    toPay() {
      if(this.consigneeVOList.length < 1){
        return this.$message.error('请选择收货地址！')
      }
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/exchange_integral",
        data: { addressId: this.select, prizeId: this.prizeId },
      }).then((res) => {
        if (res.code === "success") {
          this.$nextTick(() => {
            this.$store.commit("setState",{integral: res.data.currentIntegral})  
          })
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.$parent.update();
          this.close();
        } else {
          this.$message(res.msg);
        }
      });
    },
    // 获取列表数据
    getList(selectId) {
      ajax({
        method: "GET",
        url: "/live/api/turntable/query_consignee_list_by_uid",
      }).then((res) => {
        // this.hasNextMark = hasNextMark;
        this.consigneeVOList = res.data.consigneeVOList;
        if (this.consigneeVOList.length > 0) {
          this.select = selectId?selectId:this.consigneeVOList[0].id;
        }
      });
    },
    // 加载更多(接口不支持分页)
    load() {
      // if (this.hasNextMark === 1) {
      //   this.pageNo = ++this.pageNo;
      //   this.getList();
      // }
    },
    // 子组件调用初始化更新数据
    update(selectId) {
      this.getList(selectId);
      this.showEditAddress = false;
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
.addAddress {
  @include Popup;
  .addressBox {
    @include absolute;
    width: 493px;
    height: 584px;
    background: url("../../../assets/bobing/PC/address_bg.png") no-repeat;
    background-size: 100% 100%;
    .close {
      text-align: right;
      padding: 15px 15px 52px;
      i {
        font-size: 18px;
        color: #fff;
        cursor: pointer;
      }
    }
    .addressList {
      width: 100%;
      height: 405px;
      margin-bottom: 10px;
      padding: 0 10px 0 30px;
      .addressItem {
        position: relative;
        width: 433px;
        height: 90px;
        border: 1px solid #cecece;
        border-radius: 10px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #000;
        padding: 0 10px;
        margin-bottom: 15px;
        cursor: pointer;
        .icon {
          width: 50px;
          height: 50px;
          margin-right: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .add {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .addressInfo {
            flex: 1;
            font-size: 14px;
            font-family: PingFang SC;
            .userName {
              color: #000;
              margin-bottom: 5px;
              span {
                font-size: 12px;
                color: #9b9b9b;
              }
            }
            .address {
              color: #707070;
              @include lineClamp2;
            }
          }
          .right {
            margin-left: 32px;
            i {
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          }
        }
        .select {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 32px;
          height: 33px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .addressItemActive {
        border: 2px solid $border_main;
      }
      .mb0 {
        margin-bottom: 0;
      }
    }
    .pay {
      margin: 0 auto 30px;
      width: 200px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      border-radius: 39px;
      background: $btn1;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  padding-right: 20px;
}
</style>
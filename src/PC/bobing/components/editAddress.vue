<template>
  <div class="editAddress">
    <div class="editAddressTitel">{{title===1?'添加':'编辑'}}收货地址</div>
    <div class="myForm">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="收货地址">
          <el-cascader
            v-model="area"
            :options="options"
            :props="optionProps"
            filterable
            ref="myCascader"
            @change="changeArea"
            placeholder="请选择收货地址"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="ruleForm.receiveAddress" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model.number="ruleForm.receiveMobile"
            maxlength="11"
            minlength="11"
            placeholder="请输入电话号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货姓名">
          <el-input v-model="ruleForm.receiveName" placeholder="请输入姓名"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <div class="submitForm" @click="submitCheck">确定</div>
        <div class="resetForm" @click="resetForm">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
import area from "@/common/area2";
export default {
  props: ["editAddress",'selectId'],
  data() {
    return {
      title: 1, //1添加 2编辑
      ruleForm: {
        receiveAddress: "",
        receiveMobile: "",
        receiveName: "",
      },
      place: "",
      area: [],
      options: [],
      optionProps: {
        //配置节点
        value: "code",
        label: "name",
        children: "sub",
      },
    };
  },
  methods: {
    // 取消
    resetForm() {
      this.$parent.showEditAddress = false;
    },
    // 确定
    submitForm(receiveAddress, receiveMobile, receiveName) {
      let url = "",
        data = {};
      //1添加 2编辑
      if (this.title === 1) {
        url = "/live/api/turntable/save_consignee_info";
        data = {
          receiveAddress: this.place + receiveAddress,
          receiveMobile,
          receiveName,
          defaultFlag: 0, //是否设置为默认地址  1是 0否
        };
      } else {
        url = "/live/api/turntable/modify_consignee_info_by_id";
        data = {
          receiveAddress: this.place + receiveAddress,
          receiveMobile,
          receiveName,
          defaultFlag: this.editAddress.defaultFlag,
          id: this.editAddress.id,
        };
      }
      ajax({
        method: "POST",
        url,
        data,
      }).then((res) => {
        console.log(res)
        if (res.code === "success") {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.$parent.update(this.selectId);
        } else {
          this.$message(res.msg);
        }
      });
    },
    // 校验
    submitCheck() {
      let receiveAddress = this.ruleForm.receiveAddress.trim();
      let receiveMobile = this.ruleForm.receiveMobile;
      let receiveName = this.ruleForm.receiveName.trim();
      if (String(receiveMobile).length != 11) {
        this.$message("请输入正确的电话号码");
      } else if (
        !receiveAddress ||
        !receiveName ||
        (this.area.length != 3 && this.title === 1)
      ) {
        this.$message("请填写完整的收货信息！");
      } else {
        this.submitForm(receiveAddress, receiveMobile, receiveName);
      }
    },
    changeArea() {
      this.$nextTick(() => {
        this.place = this.$refs["myCascader"]["presentText"];
        this.place = this.place.split("/").join("").replace(/\s/g, "");
      });
    },
  },
  created() {
    this.options = area.cityData;
    if (this.editAddress != "") {
      this.ruleForm = { ...this.editAddress };
      this.title = 2;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.editAddress {
  @include absolute;
  width: 363px;
  height: 286px;
  background: #fff;
  border-radius: 10px;
  .editAddressTitel {
    font-size: 16px;
    font-family: PingFang SC;
    color: #000;
    line-height: 22px;
    text-align: center;
    padding: 10px 0 9px;
    border-radius: 10px 10px 0px 0px;
    background: #f7f7f8;
    margin-bottom: 9px;
  }
  .myForm {
    .btns {
      width: 100%;
      height: 40px;
      display: flex;
      border-top: 1px solid $border;
      .resetForm,
      .submitForm {
        width: 50%;
        height: 100%;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
      }
      .submitForm {
        color: $btn2;
        border-right: 1px solid $border;
      }
      .resetForm {
        color: #9b9b9b;
      }
    }
  }
}
/deep/ .el-input,
/deep/ .el-input__inner {
  width: 200px;
  height: 32px;
}
.el-form-item {
  margin-bottom: 9px;
}
/deep/ .el-form-item__label {
  color: #000;
}
</style>
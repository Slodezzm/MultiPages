<template>
  <div class="gameDetail">
    <div class="recordsBox">
      <div class="close">
        <i @click="close" class="el-icon-close"></i>
      </div>
      <div class="userInfo">
        <div class="avatar">
          <img v-lazy="myDrawnInfo.avatar" data-avatar="1" alt />
          <div class="myRank">第{{myDrawnInfo.sort}}名</div>
        </div>
        <div class="userName">{{myDrawnInfo.username}}</div>
        <div class="integral">
          +
          <span>{{myDrawnInfo.integral || 0}}</span>积分
        </div>
        <div class="msg">恭喜你中了{{myDrawnInfo.drawnType || '-'}}，获得{{myDrawnInfo.integral || 0}}积分</div>
        <div class="exchangePrize">
          <img @click="exchangePrize" src="@/assets/bobing/PC/btn_duihuan_s.png" alt />
        </div>
      </div>
      <div class="lable">好友排行</div>
      <div class="mytable">
        <el-scrollbar style="height:100%">
          <div class="infinite-list" v-infinite-scroll="load">
            <div class="row" v-for="(item,index) in drawnList" :key="index">
              <div class="left">
                <div class="ranking">
                  <img v-if="item.sort===1" src="@/assets/bobing/PC/1.png" alt />
                  <img v-else-if="item.sort===2" src="@/assets/bobing/PC/2.png" alt />
                  <img v-else-if="item.sort===3" src="@/assets/bobing/PC/3.png" alt />
                  <img v-else src="@/assets/bobing/PC/4.png" alt />
                </div>
                <div class="avatar">
                  <img v-lazy="item.avatar" data-avatar="1" alt />
                </div>
                <div class="box">
                  <div class="userName">{{item.username}}</div>
                  <div class="msg">{{item.drawnType || '-'}}</div>
                </div>
              </div>
              <div class="right">+{{item.integral || 0}}积分</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="btns">
        <div class="again" @click="again">再来一次</div>
        <div class="reopen" @click="reopen">重开一局</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['roomId','gameId'],
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      hasNextMark: 0,
      drawnList: [], //其他成员信息
      myDrawnInfo: {
        avatar: "",
        drawnType: "",
        integral: "",
        sort: "",
        username: "",
      }, //我的信息
    };
  },
  methods: {
    // 关闭兑换记录
    close() {
      document.body.style.cssText = "overflow-y:auto";
      this.$parent.showgameDetail = false;
    },
    // 获取列表数据
    getList() {
      ajax({
        method: "POST",
        url: "/live/api/mid_autumn/query_current_integral_list",
        data: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          roomId: this.roomId,
          gameId: this.gameId,
        },
      }).then((res) => {
        if (res.code === "success") {
          let { hasNextMark, drawnList, myDrawnInfo } = res.data;
          this.hasNextMark = hasNextMark;
          this.drawnList = [...this.drawnList, ...drawnList];
          this.myDrawnInfo = myDrawnInfo;
        }
      });
    },
    // 加载更多
    load() {
      if (this.hasNextMark === 1) {
        this.pageNo = ++this.pageNo;
        this.getList();
      }
    },
    // 兑换奖品
    exchangePrize() {
      this.$router.push({
        name: "Prize",
      });
      this.close();
    },
    // 再来一局
    again() {
      this.close();
    },
    // 重开一局
    reopen() {
      this.close();
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
.gameDetail {
  @include Popup;
  .recordsBox {
    @include absolute;
    width: 493px;
    height: 812px;
    background: url("../../../assets/bobing/PC/youxixiangqingkuang.png")
      no-repeat;
    background-size: 100% 100%;
    .close {
      text-align: right;
      padding: 15px 15px 56px;
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
      font-family: Microsoft YaHei;
      font-size: 16px;
      .avatar {
        width: 60px;
        height: 60px;
        margin: 0 auto;
        position: relative;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
        .myRank {
          min-width: 50px;
          height: 17px;
          line-height: 17px;
          @include absoluteB;
          background: $bg1;
          color: #fff;
          font-size: 12px;
          border-radius: 17px;
          text-align: center;
        }
      }
      .userName {
        margin: 6px 0 14px;
      }
      .integral {
        font-size: 20px;
        span {
          font-weight: bold;
          font-family: Arial;
          font-size: 50px;
          color: $color1;
        }
      }
      .msg {
        color: $color1;
        margin: 10px 0 15px;
      }
      .exchangePrize {
        width: 125px;
        height: 35px;
        cursor: pointer;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .msg,
      .integral,
      .userName {
        @include lineClamp1;
      }
    }
    .lable {
      color: $color2;
      font-size: 18px;
      line-height: 25px;
      margin: 30px 0 5px;
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
      height: 340px;
      padding: 0 5px 0 33px;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 90px;
        border-bottom: 1px solid $border;
        &:nth-child(1) {
          padding-top: 0;
        }
        .left {
          display: flex;
          align-items: center;
          .ranking {
            width: 35px;
            height: 35px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .avatar {
            width: 59px;
            height: 59px;
            margin: 0 15px 0 10px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .box {
            width: 200px;
            .userName {
              font-size: 18px;
              color: $color2;
              margin-bottom: 4px;
              @include lineClamp1;
            }
            .msg {
              font-size: 16px;
              color: $color1;
            }
          }
        }
        .right {
          font-size: 18px;
          color: $color1;
        }
      }
    }
    .btns {
      display: flex;
      justify-content: space-between;
      padding: 10px 54px;
      .reopen,
      .again {
        width: 180px;
        height: 46px;
        border-radius: 35px;
        text-align: center;
        line-height: 46px;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
      }
      .again {
        background: $border_main;
      }
      .reopen {
        background: $border_main3;
      }
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  padding-right: 20px;
}
</style>
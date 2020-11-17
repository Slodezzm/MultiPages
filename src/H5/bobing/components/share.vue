<template>
  <div class="share">
    <img class="bg_pic" src="@/assets/bobing/sharecode.jpg" ref="bgPic">
    <img class="bg_pic" src="@/assets/bobing/sharecode2.jpg" ref="bgPic2">
    <img class="icon" src="@/assets/bobing/icon.png" ref="icon">
    <canvas id="shareBox" ref="shareBox"></canvas>
    <canvas id="code" ref="code"></canvas>
    <div class="share_box">
      <img :src="shareImage" class="share_image">
      <ul class="type_list">
        <li class="type" v-for="(item, i) in shareTypes" :key="'tp-' + i" @click="share(i)">
          <span class="type_icon"></span>
          <p class="type_name">{{item}}</p>
        </li>
      </ul>
      <input type="button" value="取消" class="cancle" @click="$store.commit('setState',{showShare: false})">
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      shareTypes: ['微信', '朋友圈', 'QQ', 'QQ空间', '微博'],
      shareImage: ""
    }
  },
  computed: {
    ...mapState(["shareLink", "shareType"])
  },
  watch: {},
  methods: {
    share(i) {
      this.$toast('请您长按保存上方图案，然后打开' + this.shareTypes[i] + '分享给好友哦！')
    },
    makeQrcode(){
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      let that = this
      QRCode.toCanvas(document.querySelector("#code"), that.shareLink, function(error) {
        if(error) console.log(error)
        else that.unite()
      })
    },
    unite(){
      let c = this.$refs.shareBox
      var ctx = c.getContext('2d')
      let bg = new Image()
      bg.crossOrigin = "Anonymous"
      bg.src = this.shareType === "invite" ? this.$refs.bgPic.src : this.$refs.bgPic2.src
      let that = this
      bg.onload = function(){
        c.width = 480
        c.height = 853
        ctx.drawImage(bg, 0, 0, 480, 853)
        ctx.drawImage(that.$refs.code, 175, 669, 130, 130)
        ctx.font = "18px normal 微软雅黑"
        ctx.fillStyle = "#FFF"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("提示：打开王者直播App点击首页顶部扫码", 240, 625)
        ctx.fillText("或者使用浏览器扫码进入活动页", 240, 650)
        let icon = new Image()
        icon.crossOrigin = "Anonymous"
        icon.src = that.$refs.icon.src
        icon.onload = function(){
          ctx.drawImage(icon, 230, 724, 20, 20)
          that.shareImage = c.toDataURL('image/png')
          that.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 100
          })
        }
      }
    }
  },
  mounted() {
    this.makeQrcode()
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100%'
  },
  beforeDestroy() {
    document.body.style.overflow = ''
    document.body.style.height = ''
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.share {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  background: rgba($color: #000000, $alpha: 0.7);
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  .bg_pic {
    position: absolute;
    @include vwh(64, 113.7);
    margin-left: -32vw;
    z-index: -1;
    opacity: 0;
  }
  .icon {
    position: absolute;
    @include vwh(6.4, 6.4);
    margin-left: -32vw;
    z-index: -1;
    opacity: 0;
  }
  #shareBox {
    position: absolute;
    left: -9999999999px;
    top: -9999999999px;
    @include vwh(64, 113.7);
    margin-left: -32vw;
    z-index: -999;
  }
  #code {
    position: absolute;
    opacity: 0;
  }
  .share_box {
    position: relative;
    @include wh(100%, 100%);
    z-index: 6;
    padding-top: 2.5vw;
    padding-bottom: 44.6vw;
    .share_image {
      display: block;
      @include wh(auto, 100%);
      margin: 0 auto;
    }
    .type_list {
      position: absolute;
      left: 2.5vw;
      bottom: 16.5vw;
      @include vwh(95, 25.6);
      border-radius: 8px;
      background: #FFF;
      @include fs;
      padding: 0 5vw;
      .type {
        position: relative;
        @include wh(auto, auto);
        &:active {
          transform: scale(0.9);
        }
        &:nth-child(1) .type_icon {
          background-position: 0 0;
          animation: shakeY 1s 1;
        }
        &:nth-child(2) .type_icon {
          background-position: 0 -12vw;
          animation: shakeY 1s .3s 1;
        }
        &:nth-child(3) .type_icon {
          background-position: 0 -24vw;
          animation: shakeY 1s .6s 1;
        }
        &:nth-child(4) .type_icon {
          background-position: 0 -36vw;
          animation: shakeY 1s .9s 1;
        }
        &:nth-child(5) .type_icon {
          background-position: 0 -48vw;
          animation: shakeY 1s 1.2s 1;
        }
        .type_icon {
          display: block;
          position: relative;
          @include vwh(12, 12);
          background-image: url("~@/assets/bobing/shares.png");
          background-repeat: no-repeat;
          background-size: 100% 500%;
        }
        .type_name {
          font-size: 3.2vw;
          color: #222;
          font-weight: 400;
          line-height: 4.3vw;
          margin-top: 1.3vw;
        }
      }
    }
    .cancle {
      position: absolute;
      bottom: 2.5vw;
      left: 2.5vw;
      @include vwh(95, 11.3);
      border-radius: 8px;
      background: #FFF;
      font-size: 4.3vw;
      font-weight: 400;
      color: #D12B04;
      &:active {
        transform: scale(0.9);
      }
    }
  }
}
</style>
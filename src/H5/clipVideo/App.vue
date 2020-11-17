<template>
  <div id="app">
    <div class="cover-box"></div>
    <div class="video">
      <video ref="Video" @click="showInfo = !showInfo" :poster="video.cover" :src="video.src" webkit-playsinline="" playsinline="" x-webkit-airplay="allow" controls controlslist="nodownload nofullscreen" ></video>
    </div>
    <transition name="fade">    
      <div class="video-info" v-if="showInfo">
        <h3 class="title">{{video.title}}</h3>
        <div class="anchor-info">
          <img :src="anchor.avatar" @click="goZoon" @error="setDefaultAvatar($event)" class="avatar">
          <div class="name-videonum">
            <p class="name">{{anchor.name}}</p>
            <p class="videonum">共发布{{anchor.videoNum}}个视频</p>
          </div>
          <div class="view-time">
            <p class="view">观看量：{{video.pageView}}</p>
            <p class="time">{{video.sendTime}}</p>
          </div>
        </div>
      </div>
    </transition>
    <div class="loading" v-if="loading"></div>
    <div class="toast" v-if="toast">{{toastText}}</div>
  </div>
</template>

<script>
import axios from 'axios'
import { searchParams } from "@/common/unit"
export default {
  data(){
    return {
      showInfo: true,
      video: {
        title: "",
        src: "",
        sendTime: "",
        pageView: "",
        cover: ""
      },
      anchor: {
        avatar: "",
        name: "",
        videoNum: 0,
        uid: "",
      },
      loading: false,
      toast: true,
      toastText: "gjsdfsf",
    }
  },
  mounted () {
    this.getVideoInfo()
  },
  methods: {
    setDefaultAvatar(that){
      console.log(that)
      that.target.src = "data:image/png;base64,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"
    },
    goZoon(){
      if (this.anchor.uid == 0) {
        return false
      }
      if (navigator.userAgent.toLowerCase().indexOf("kinglive") > -1) {
        if (window.hasOwnProperty("app")) {
          window.app.jsToAnchorZoon(this.anchor.uid)
        } else {
          window.webkit.messageHandlers.jsToAnchorZoon.postMessage(this.anchor.uid)
        }
      }else {
        window.location.href = "/H5/page/#/anchor?id=" + this.anchor.uid
      }
    },
    getVideoInfo(){
      this.loading = true
      axios({
        url: "/index.php?g=&m=Clipvideo&a=detail",
        method: "GET",
        params: {
          id: searchParams("id")
        }
      }).then(res => {
        this.loading = false
        if (res.status != 200) {
          this.toast = true
          this.toastText = res.msg || "播放失败，请稍后重试！"
          setTimeout(() => {
            // this.toast = false
          }, 4000)
        } else {
          let data = res.data.data
          this.video.title = data.detail.title
          document.title = data.detail.title + document.title
          this.video.src = data.detail.flvurl
          this.video.sendTime = data.detail.create_time
          this.video.pageView = data.detail.total_pageview
          this.video.cover = data.detail.cover
          this.anchor.avatar = data.user_info.avatar
          this.anchor.name = data.user_info.user_name
          this.anchor.videoNum = data.user_info.user_video
          this.anchor.uid = data.user_info.uid
        }
      }).catch(err => {
        this.loading = false
        this.toast = true
        this.toastText = err.msg || "播放失败，请稍后重试！"
        setTimeout(() => {
          this.toast = false
        }, 4000)
      })
    }
  }
}
</script>
<style lang="scss">
@import "~@/style/h5common.scss";
#app {
  position: relative;
  width: 100%;
  height: 100vh;
  // overflow: hidden;
  .cover-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: #111;
  }
  .video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 3;
    @include fc;
    video {
      display: block;
      width: 100%;
      height: auto;
      background: #000;
    }
  }
  .video-info {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: auto;
    background: #FFF;
    padding: 2.667vw 5.333vw;
    z-index: 5;
    .title {
      @include rule;
      line-height: 6.667vw;
      font-size: 4.8vw;
      font-weight: 500;
      color: #262626;
      text-align: left;
      margin-bottom: 2.667vw;
    }
    .anchor-info {
      @include rule;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      .avatar {
        display: block;
        @include vwh(12,12);
        border-radius: 50%;
        margin-right: 2.667vw;
      }
      .name-videonum {
        position: relative;
        @include wh(auto,auto);
        max-width: 40%;
        margin-right: 2.667vw;
        .name {
          @include wh(100%, 5.333vw);
          font-size: 3.7vw;
          font-weight: 500;
          color: #262626;
          line-height: 5.333vw;
          text-align: left;
          @include omit(1);
          margin-bottom: 1.333vw;
        }
        .videonum {
          @include wh(100%, 4.533vw);
          font-size: 3.2vw;
          font-weight: 500;
          color: #999;
          line-height: 4.533vw;
          text-align: left;
          @include omit(1);
        }
      }
      .view-time {
        position: relative;
        flex: 1;
        height: auto;
        font-size: 3.2vw;
        font-weight: 500;
        color: #999;
        line-height: 4.533vw;
        text-align: left;
        .view {
          height: 5.333vw;
          line-height: 5.333vw;
          margin-bottom: 1.333vw;
          padding-left: 5.1vw;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAOVBMVEUAAACZmZmZmZmYmJiYmJiYmJiZmZmYmJiYmJiampqbm5uZmZmZmZmZmZmZmZmZmZmYmJiQkJCZmZkLZd6jAAAAEnRSTlMAfvgj5JV1WkMQC/DoyIqJaBdht8JFAAAAPElEQVQI12PADzgYYYCNE8hlEoIDRiAXREOF+Ph5wFxmdhaoAgiXgYsVNxehGNkoXm4hFIsEBVCdQQAAAL+UBsPru5ZNAAAAAElFTkSuQmCC") no-repeat 0.2vw center/3.6vw auto;
        }
      }
    }
  }
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 70px;
    height: 70px;
    margin-top: -35px;
    margin-left: -35px;
    background-image: url("https://zhibo18.live/H5/img/loading.cbf5b5d1.png");
    background-repeat: no-repeat;
    background-size: 2000% 100%;
    background-position-x: 0;
    background-position-y: 0;
    -webkit-animation: changload 1.5s steps(20) infinite;
    animation: changload 1.5s steps(20) infinite;
    z-index: 99999;
  }
  .toast {
    position: fixed;

  }
}
@-webkit-keyframes changload {
  0% {
    background-position-x: 0;
  }
  to {
    background-position-x: -1400px;
  }
}

@keyframes changload {
  0% {
    background-position-x: 0;
  }
  to {
    background-position-x: -1400px;
  }
}
</style>
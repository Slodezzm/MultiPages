<template>
  <div class="mask">
    <div class="pop">
      <div class="toppanel">
        <div class="top" :key="'tp-' + topI" :class="'top' + topI"></div>
        <span class="close" @click="$emit('close')"></span>
      </div>
      <div class="content">
        <slot></slot>
      </div>
      <div class="fix_bg"></div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['topI'],
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  mounted(){
    document.querySelector('body').style.overflow = 'hidden'
    // document.querySelector('body').style.position = 'fixed'
    document.querySelector('body').style.height = '100%'
  },
  beforeDestroy(){
    // document.querySelector('body').style.position = 'relative'
    document.querySelector('body').style.overflow = ''
    document.querySelector('body').style.height = ''
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.mask {
  position: fixed;
  left: 0;
  top: 0;
  @include wh(100%, 100vh);
  background: rgba($color: #000000, $alpha: 0.5);
  @include fc;
  z-index: 2001;
  .pop {
    position: relative;
    @include wh(88vw, auto);
    max-height: 108vw;
    padding-bottom: 4vw;
    background: url("~@/assets/bobing/panel_bt.png") no-repeat bottom center/100% 4vw;
    .toppanel {
      position: relative;
      @include wh(100%, 15.1vw);
      background: url("~@/assets/bobing/panel_top.png") no-repeat top center/100% 15.1vw;
      @include fc;
      z-index: 3;
      .top {
          position: relative;
          @include vwh(59.7, 8.5);
          background-image: url("~@/assets/bobing/top_icons.png");
          background-repeat: no-repeat;
          background-size: 100% 400%;
          background-position-x: 0;
          &.top0 {
            background-position-y: 0;
          }
          &.top1 {
            background-position-y: -8.5vw;
          }
          &.top2 {
            background-position-y: -17vw;
          }
          &.top3 {
            background-position-y: -25.5vw;
          }
      }
      .close {
        position: absolute;
        right: 2.4vw;
        top: 2.4vw;
        @include vwh(4.4, 4.4);
        background: url("~@/assets/bobing/close.png") no-repeat center/contain;
        z-index: 3;
      }
    }
    .content {
      @include rule;
      min-height: 64vw;
      max-height: 89vw;
      overflow-y: auto;
      overflow-x: hidden;
      background-image: url("~@/assets/bobing/panel_ct.png");
      background-repeat: repeat-y;
      background-size: 100% auto;
      z-index: 2;
      -webkit-overflow-scrolling: touch;
    }
    .fix_bg {
      position: absolute;
      left: 0;
      bottom: 3vw;
      @include wh(100%, 2vw);
      z-index: 1;
      background-image: url("~@/assets/bobing/panel_ct.png");
      background-repeat: repeat-y;
      background-size: 100% auto;
    }
  }
}
</style>
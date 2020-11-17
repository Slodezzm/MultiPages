<template>
  <div class="float">
    <div class="share" v-if="endtime < 0" @click="$emit('share-show')"></div>
    <div class="rule_vol">
      <router-link to="/rule" class="rule"></router-link>
      <div class="vol" @click="$store.commit('setState', {mute:!mute})" :class="{mute: mute}" :key="mute ? 'no_voice' : 'with_voice'"></div>
    </div>
    <div class="shake" style="display:none;">
      <div class="phone"></div>
      <div class="text"></div>
    </div>
    <div class="restart" v-if="gameType === 'multi'" @click="$emit('restart')"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(["mute", "endtime", "gameType"])
  },
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.float {
  position: fixed;
  right: 0;
  top: 0;
  @include vwh(19, 126);
  z-index: 2;
  .share {
    position: absolute;
    right: 0;
    top: -1.6vw;
    @include wh(100%, 29.5vw);
    background: url("~@/assets/bobing/share.png") no-repeat center/contain;
    animation: backAndForth 2s linear infinite;
    transform-origin:50% 0%;
  }
  .rule_vol {
    position: absolute;
    right: 0;
    top: 43vw;
    @include wh(12vw, auto);
    .rule, .vol {
      display: block;
      position: relative;
      @include vwh(12, 9);
      background-image: url("~@/assets/bobing/rule_vol.png");
      background-repeat: no-repeat;
      background-size: 100% 300%;
      border-radius: 4.5vw 0 0 4.5vw;
      box-shadow: 0 0 5px #f8402b;
    }
    .rule {
      background-position: 0 0;
    }
    .vol {
      background-position: 0 -18vw;
      margin-top: 4vw;
      &.mute {
        background-position: 0 -9vw;
      }
    }
  }
  .restart {
    position: absolute;
    right: 3.6vw;
    bottom: 15vw;
    @include vwh(11.7,11.7);
    background: url("~@/assets/bobing/restart.png") no-repeat center/contain;
  }
  .shake {
    position: absolute;
    right: 3.6vw;
    bottom: 20vw;
    @include vwh(15.7, 22.5);
    .phone {
      position: absolute;
      left: 0;
      top: 0;
      @include vwh(13.4, 18.2);
      background: url("~@/assets/bobing/phone.png") no-repeat center/contain;
      animation: tada 4s 2s linear infinite;
      transform-origin: 50% 50%;
    }
    .text {
      position: absolute;
      right: 0;
      bottom: 0;
      @include vwh(11, 9.4);
      background: url("~@/assets/bobing/shake.png") no-repeat center/contain;
    }
  }
}
</style>
<template>
  <div class="bottom_nav">
    <template v-for="(item, i) in nav">
      <router-link class="nav" v-if="i != 3 || endtime < 0" :to="item.to" :key="'bn-' + i">
        <i class="nav_icon"></i>
        <p class="nav_name">{{item.name}}</p>
      </router-link>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      nav: [
        {name: '首页', to: '/'},
        {name: '奖品', to: '/prize'},
        {name: '排行榜', to: '/rank'},
        {name: '充值', to: '/charge'},
      ]
    }
  },
  computed: {
    ...mapState(['endtime'])
  },
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.bottom_nav {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0 6.7vw;
  @include wh(100%, 16vw);
  @include fs;
  @include noSelect;
  background: #e94b26;
  z-index: 999;
  .nav {
    position: relative;
    @include vwh(12, 12);
    background: #FFD580;
    border: 3px solid #F1B168;
    border-radius: 50%;
    &.router-link-exact-active {
      border-color: #FFF;
    }
    &:nth-child(1) .nav_icon {
      background-position-y: 0;
    }
    &:nth-child(2) .nav_icon {
      background-position-y: -6vw;
    }
    &:nth-child(3) .nav_icon {
      background-position-y: -12vw;
    }
    &:nth-child(4) .nav_icon {
      background-position-y: -18vw;
    }
    .nav_icon {
      position: absolute;
      left: 50%;
      top: 0.5vw;
      @include vwh(6, 6);
      transform: translateX(-50%);
      background-image: url("~@/assets/bobing/nav.png");
      background-size: 100% 400%;
      background-position-x: 0;
      z-index: 2;
    }
    .nav_name {
      position: absolute;
      left: 50%;
      bottom: -1.3vw;
      @include wh(12vw, 5vw);
      margin-left: -6vw;
      border-radius: 2.5vw;
      background: #FF7611;
      color: #FFF;
      line-height: 5vw;
      font-size: 3vw;
      font-weight: 400;
      text-align: center;
      z-index: 3;
    }
  }
}
</style>
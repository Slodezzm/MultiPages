<template>
  <div v-if="showBack" :key="showBack ? 'h5back' : 'appno'" class="back" @click="$router.go(-1)"></div>
</template>
<script>
export default {
  data(){
    return{
      showBack: false
    }
  },
  mounted(){
    this.showBack = navigator.userAgent.toLowerCase().indexOf('kinglive') === -1
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.back {
  position: fixed;
  left: 4.4vw;
  top: 2vw;
  @include vwh(6, 6);
  background: url("~@/assets/bobing/back.png") no-repeat center/contain;
  border-radius: 50%;
  z-index: 2000;
}
</style>
<template>
  <div class="no_content">
    <img src="@/assets/no_trend.png" class="no_icon">
    <p class="no_text">{{text}}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "暂无内容..."
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.no_content {
  @include rule;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5vw;
  .no_icon {
    display: block;
    @include wh(40%, auto);
  }
  .no_text {
    font-size: 3.2vw;
    color: #999;
    line-height: 6.4vw;
  }
}
</style>
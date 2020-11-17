<!--
 * @Author: JS-Drama
 * @Date: 2020-08-17 19:12:31
 * @LastEditTime: 2020-08-27 19:53:41
 * @LastEditors: your name
 * @Description: 缺省图组件
 * @FilePath: \pj-h5-web\pro\src\PC\components\noMsg.vue
 * @🍻Writing code drunkenly.
-->
<template>
  <div class="noMsg">
    <img v-lazy="imgSrc" :alt="imgAltText" :style="`width: ${imgWidth}; height: ${imgHeight}`" />
    <slot></slot>
    <h3>{{ msg }}</h3>
  </div>
</template>

<script>
/**
 * @description: 缺省图组件
 * @param {String="空空如也，什么都没有～"} msg 缺省说明
 * @param {String, Object} imgSrc 缺省图
 * @param {String="180", Number} imgWidth 缺省图宽度
 * @param {String="190", Number} imgHeight 缺省图高度
 * @param {String="空空如也，什么都没有～"} imgAltText 缺省图Alt
 * @param {you html} slot Null
 * @return {type} Null
 */
export default {
  props: {
    msg: {
      type: String,
      default: "暂无数据～",
    },
    imgSrc: {
      type: [String, Object],
      default: require("@/assets/noMsg.png"),
    },
    imgWidth: {
      type: [String, Number],
      default: 180,
    },
    imgHeight: {
      type: [String, Number],
      default: 190,
    },
    imgAltText: {
      type: String,
      default: "空空如也，什么都没有～",
    },
  },
};
</script>

<style style lang="scss" scoped>
.noMsg {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #999;
  img {
    margin-bottom: 10px;
    margin-top: 50px;
  }
  h3 {
    color: #aaa;
    font-weight: 500;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
  }
}
</style>
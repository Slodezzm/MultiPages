<template>
  <div class="rule">
    <router-link to="/" class="back_to_index">回到游戏首页&nbsp;&gt;</router-link>
    <!-- 规则详情开始 -->
    <div class="ruleDetail">
      <div class="box">
        <iframe
          id="iframeContain"
          ref="iframeContain"
          scrolling="no"
        >您当前的浏览器不支持页面上的功能，请升级您当前的浏览器版本或使用谷歌浏览器访问当前页面</iframe>
      </div>
    </div>
    <!-- 规则详情结束 -->
    <div class="ruleBox">
      <div class="box">
        <div class="line header">
          <div class="col0">官级</div>
          <div class="col1">别名</div>
          <div class="col2">特征</div>
          <div class="col3">积分</div>
        </div>
        <div class="line" v-for="(item,index) in diceRule" :key="index">
          <div class="col0">{{item.gj}}</div>
          <div class="col1">{{item.bm}}</div>
          <div class="col2">
            <span
              class="dice"
              v-for="(tz, ii) in item.tz"
              :key="'tz-' + i + ii"
              :class="'dice' + tz"
            ></span>
          </div>
          <div class="col3">{{item.jf}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rule: "",
      diceRule: [
        { gj: "秀才", bm: "一秀", tz: [4, 0, 0, 0, 0, 0], jf: 10 },
        { gj: "举人", bm: "二举", tz: [4, 4, 0, 0, 0, 0], jf: 20 },
        { gj: "进士", bm: "四进", tz: [3, 3, 3, 3, 0, 0], jf: 40 },
        { gj: "探花", bm: "三红", tz: [4, 4, 4, 0, 0, 0], jf: 60 },
        { gj: "榜眼", bm: "对堂", tz: [1, 2, 3, 4, 5, 6], jf: 80 },
        { gj: "状元", bm: "四红", tz: [4, 4, 4, 4, 0, 0], jf: 120 },
        { gj: "状元", bm: "五子", tz: [3, 3, 3, 3, 3, 0], jf: 120 },
        { gj: "状元", bm: "五红", tz: [4, 4, 4, 4, 4, 0], jf: 120 },
        { gj: "状元", bm: "六勃黑", tz: [2, 2, 2, 2, 2, 2], jf: 120 },
        { gj: "状元", bm: "遍地锦", tz: [1, 1, 1, 1, 1, 1], jf: 120 },
        { gj: "状元", bm: "六勃红", tz: [4, 4, 4, 4, 4, 4], jf: 120 },
        { gj: "状元", bm: "状元捕金花", tz: [4, 4, 4, 4, 1, 1], jf: 120 },
      ],
    };
  },
  methods: {
    // 获取规则数据
    getRule() {
      ajax({
        method: "GET",
        url: "/live/api/mid_autumn/get_game_rules",
      }).then((res) => {
        this.rule = res.data.rules || '';
        this.initIframe();
      });
    },
    // 初始化iframe
    initIframe() {
      this.$nextTick(() => {
        // 获取ifr对象
        let iframeContain = this.$refs.iframeContain;
        // 添加html解析
        iframeContain.contentWindow.document.body.innerHTML = this.rule;
        iframeContain.contentWindow.document.body.style.margin = "0";
        iframeContain.contentWindow.document.body.style.padding = "0";

        // 动态设置iframe高度
        let iDoc =
          iframeContain.contentDocument ||
          iframeContain.document ||
          iframeContain.contentWindow;
        //页面有图片的时候无法正常获取到达高度
        var timer = setTimeout(() => {
          let img = iframeContain.contentWindow.document.getElementsByTagName(
            "img"
          );
          for (let index = 0; index < img.length; index++) {
            const element = img[index];
            element.style["max-width"] = "100%";
          }
          let height = this.calcPageHeight(iDoc);
          iframeContain.style.height = height + "px";
          clearTimeout(timer);
        }, 1000);
      });
    },
    // iframe高度自适应
    calcPageHeight(doc) {
      var cHeight = Math.max(
        doc.body.clientHeight,
        doc.documentElement.clientHeight
      );
      var sHeight = Math.max(
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight
      );
      var height = Math.max(cHeight, sHeight);
      return height;
    },
  },
  created() {
    this.getRule();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.rule {
  width: 100%;
  .back_to_index {
    display: block;
    position: relative;
    text-align: center;
    font-size: 14px;
    color: #FFF;
    padding-bottom: 10px;
  }
  .ruleBox,
  .ruleDetail {
    width: 100%;
    border: 6px solid rgba(255, 218, 161, 1);
    border-radius: 28px;
    margin-bottom: 20px;
    .box {
      width: 100%;
      background: #fdfeeb;
      border: 3px solid #ed8145;
      border-radius: 20px;
      min-height: 263px;
      padding: 40px 100px;
      #iframeContain {
        width: 100%;
        min-height: 183px;
      }
      iframe {
        border-width: 0px;
      }
    }
  }
  .ruleBox {
    height: 720px;
    .box {
      height: 100%;
      padding: 40px 0;
      .line {
        position: relative;
        width: 100%;
        height: 50px;
        @include fs;
        font-size: 16px;
        color: #333;
        font-weight: 400;
        line-height: 21px;
        text-align: center;
        &.header {
          font-size: 18px;
          color: #e8402f;
          font-weight: 600;
        }
        .col0 {
          flex: 1;
          position: relative;
        }
        .col1,
        .col3 {
          flex: 1;
          position: relative;
          word-break: break-all;
          @include fc;
        }
        .col2 {
          position: relative;
          flex: 1;
          height: 100%;
          @include fc;
          .dice {
            position: relative;
            width: 28px;
            height: 28px;
            background-image: url("~@/assets/bobing/dice.png");
            background-repeat: no-repeat;
            background-size: 100%;
            background-position-x: 0;
            &.dice0 {
              background-position-y: 0;
            }
            &.dice1 {
              background-position-y: -28px;
            }
            &.dice2 {
              background-position-y: -56px;
            }
            &.dice3 {
              background-position-y: -84px;
            }
            &.dice4 {
              background-position-y: -112px;
            }
            &.dice5 {
              background-position-y: -140px;
            }
            &.dice6 {
              background-position-y: -168px;
            }
          }
        }
      }
    }
  }
}
</style>
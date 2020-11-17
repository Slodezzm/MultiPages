<template>
  <ul class="history">
    <template v-if="list.length > 0">
      <li class="item" v-for="item in list" :key="'list-' + item.createTime">
        <div class="info">
          <p class="game_status">{{item.gameType == 1 ? '单人' : '多人'}}游戏</p>
          <p class="time">{{item.createTime}}</p>
        </div>
        <p class="score">{{item.drawnType}}&nbsp;+{{item.integral}}分</p>
      </li>
    </template>
    <no-content text="暂无游戏记录" v-else />
    <div class="loadmore" @click="onLoad">{{ finished ? '没有更多了' : '加载更多'}}...</div>
  </ul>
</template>

<script>
import noContent from '../public/noContent'
export default {
  components: {noContent},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pageNo: 1
    }
  },
  computed: {},
  watch: {},
  methods: {
    onLoad(){
      if (this.finished) return this.$toast("没有更多了~")
      this.pageNo++
      this.getList()
    },
    getList(){
      this.$http({
        url: "/live/api/mid_autumn/query_history_game_list",
        method: "POST",
        data: {
          pageSize: 20,
          pageNo: this.pageNo
        }
      }).then(res => {
        console.log(res)
        if (res.code === "success") {
          this.list = [...this.list,...res.data.drawnList]
          this.finished = res.data.hasNextMark === 0
        } else {
          this.finished = true
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
@import "~@/style/h5mixin.scss";
.history {
  position: relative;
  @include wh(88vw, auto);
  padding: 3.5vw;
  .item {
    position: relative;
    @include wh(100%, 15vw);
    @include fs;
    border-bottom: 1px solid #EEE;
    &:last-child {
      border-bottom: none;
    }
    .info {
      position: relative;
      @include wh(auto, auto);
      text-align: left;
      font-weight: 400;
      .game_status {
        font-size: 3.7vw;
        color: #333;
        line-height: 5.2vw;
      }
      .time {
        font-size: 3.2vw;
        color: #999;
        line-height: 4.6vw;
      }
    }
    .score {
      position: relative;
      @include wh(auto, auto);
      font-size: 3.7vw;
      font-weight: 400;
      text-align: right;
      color: #F94048;
      line-height: 5vw;
    }
  }
  .loadmore {
    font-size: 3.7vw;
    color: #F94048;
    line-height: 6.4vw;
    margin-top: 3vw;
  }
}
</style>
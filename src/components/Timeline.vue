<template>
  <div class="timeline border">
    <h3 class="timeline-title">Timeline</h3>

    <div class="timeline-item" v-for="(time, i) in Object.keys(timeline)" :key="i">
      <div class="timeline-item-date" @click="showDetail(time)">{{time}} ({{timeline[time].length}})</div>
      <ul class="timeline-item-day" v-show="onShowTime === time">
        <li class="article" v-for="(article, i) in timeline[time]" :key="i" @click="$emit('toArticle', { number: article.number, title: article.title })">{{article.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['timeline'],
  data () {
    return {
      onShowTime: ''
    }
  },
  watch: {
    timeline (val) {
      this.onShowTime = Object.keys(val)[0]
    }
  },
  methods: {
    showDetail (time) {
      if (this.onShowTime === time) {
        this.onShowTime = ''
      } else {
        this.onShowTime = time
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.timeline {
  background: #fff;
  margin-bottom: @gapOuter;
  &-title {
    margin: 0;
    padding: @gapOuter;
    font-weight: normal;
    border-bottom: 1px solid @firstBorderColor;
    color: @regularFontColor;
  }

  &-item {
    padding: @gapOuter 0;
    margin: 0 @gapOuter;
    border-bottom: 1px solid @thirdBorderColor;
    color: @regularFontColor;
    &:last-child {
      border-bottom: none;
    }
    &-date {
      cursor: pointer;
      font-size: 1.1rem;
    }
    &-day {
      padding-left: @gapOuter;
      padding-top: @gapOuter;
      margin: 0;
      .article {
        padding-top: @gapInner;
        margin-bottom: @gapInner;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>

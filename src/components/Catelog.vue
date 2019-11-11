<template>
  <ul class="catelog border">
    <li
      v-for="(heading, index) in headings"
      :key="index"
      :class="[`level-${heading.level}`, curHeading === index ? 'active' : '']"
      @click="scrollToHead(heading, index)">
      {{heading.title}}
    </li>
  </ul>
</template>

<script>
export default {
  inheritAttrs: true,
  props: {
    headings: Array,
    curHeading: [Number, String]
  },
  methods: {
    scrollToHead (heading, index) {
      this.$parent.$refs['view'].scrollTop = Number(heading.offsetTop)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.catelog {
  list-style-type: none;
  padding: @gapInner;
  li {
    cursor: pointer;
    margin-bottom: @gapInner;
    &.active {
      color: @primaryColor;
      font-weight: bold;
    }
    &.level-1 {
      font-size: @fontSize * 1.2;
    }
    &.level-2 {
      font-size: @fontSize;
      margin-left: @gapInner;
    }
    &.level-3 {
      font-size: @fontSize * .9;
      margin-left: @gapInner * 1.5;
    }
    &.level-4 {
      font-size: @fontSize * .7;
      margin-left: @gapInner * 2;
    }
    &.level-5 {
      font-size: @fontSize * .5;
      margin-left: @gapInner * 2.5;
    }
    &.level-6 {
      font-size: @fontSize * .3;
      margin-left: @gapInner * 3;
    }
  }
}
</style>

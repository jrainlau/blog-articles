<template>
  <div class="skeleton">
    <div class="skeleton-article" v-if="type === 'article'">
      <h1></h1>
      <span v-for="j in 2" :key="'span' + j"></span>
      <p v-for="k in 20" :key="'p' + k"></p>
    </div>

    <div class="skeleton-preview" v-if="type === 'preview'">
      <section class="border" v-for="h in 4" :key="'preview' + h">
        <div></div>
        <span></span>
        <p v-for="l in 2" :key="'p' + l"></p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type']
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.skeleton {
  width: 100%;
  max-width: 935px;
  margin: 0 auto;
  &-article {
    padding-top: calc(@gapOuter * 3);
    h1 {
      height: 4rem;
      background: @skeletonColor;
    }
    span {
      height: 1rem;
      display: inline-block;
      width: 6rem;
      background: @skeletonColor;
      margin-right: @gapInner;
    }
    p {
      height: 2rem;
      background: @skeletonColor;
    }
  }
  &-preview {
    section {
      padding: @gapOuter;
      margin-bottom: calc(@gapOuter * 2);
      div {
        background: @skeletonColor;
        height: 20vh;
      }
      span {
        height: 1rem;
        display: inline-block;
        width: 6rem;
        background: @skeletonColor;
        margin: @gapInner 0;
      }
      p {
        height: 1rem;
        background: @skeletonColor;
        margin-top: 0;
      }
    }
  }
}
</style>

<template>
  <div class="about">
    <section class="about-contact">
      <a href="https://github.com/jrainlau">Github</a>
      ·
      <a href="mailto:jrainlau@gmail.com">Email</a>
      ·
      <a href="https://www.instagram.com/jrainlau/">Instagram</a>
      ·
      懶得備案
    </section>

    <section class="about-right">
      © 2019 JRAIN LAU
    </section>
  </div>
</template>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.about {
  cursor: default;
  margin-bottom: @gapOuter;
  &-contact {
    color: @monorFontColor;
    margin-bottom: @gapInner;
    a {
      text-decoration: none;
      color: @monorFontColor;
    }
  }
  &-right {
    color: @monorFontColor;
  }
}
</style>

<template>
  <div class="about" v-if="showAbout">
    <div class="about-btn" @click="$emit('update:showAbout', false)">
      <i class="fa fa-times"></i>
    </div>
    <div class="about-list">
      <div class="about-list-item">
        <i class="far fa-envelope"></i>
        <a href="mailto:jrainlau@gmail.com">EMAIL</a>
      </div>
      <div class="about-list-item">
        <i class="fab fa-github"></i>
        <a href="https://github.com/jrainlau" target="_blank">GITHUB</a>
      </div>
      <div class="about-list-item">
        <i class="fab fa-instagram"></i>
        <a href="https://www.instagram.com/jrainlau/" target="_blank">INSTAGRAM</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['showAbout']
}
</script>

<style lang="less" scoped>
.about {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  &-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 2.5rem;
    cursor: pointer;
    z-index: 2000;
  }
  &-list {
    padding: 15px;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-item {
      height: 20vh;
      width: 20rem;
      text-align: left;
      line-height: 20vh;
      font-size: 2.5rem;
      cursor: pointer;
      transition: all .3s ease;
      &:hover {
        transform: scale(1.2);
      }
      i {
        margin: 2rem;
      }
      a {
        color: #fff;
        text-decoration: none;
      }
    }
  }
}
</style>

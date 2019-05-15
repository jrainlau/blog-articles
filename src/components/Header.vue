<template>
  <header class="header" :class="{'opacity': $route.name === 'article'}">
    <div class="header-logo">
      <img v-if="$route.name === 'article'" :src="require('@/assets/imgs/logo-h.png')" @click="$router.push('/')">
    </div>
    <div class="header-btn" @click="$emit('showAbout')">
      <i class="fa fa-bars"></i>
    </div>
  </header>
</template>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 15px;
  box-sizing: border-box;
  color: #fff;

  &-logo {
    height: 40px;
    img {
      height: 100%;
    }
  }

  &.opacity {
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,.15);
    .header-btn {
      color: #8e24aa;;
    }
  }

  &-btn {
    font-size: 2rem;
    cursor: pointer;
  }
}
</style>

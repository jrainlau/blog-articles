<template>
  <div class="home page">
    <section class="home-cover">
      <div class="home-cover-intro">
        <img :src="require('@/assets/imgs/logo.png')" alt="">
      </div>
      <img class="home-cover-img" :src="cover" alt="">
    </section>
    <section class="home-list">
      <div
        v-for="(article, i) in articles"
        :key="i"
        class="home-list-item cover"
        :class="{'odd-last': isOddLast(i + 1, articles.length)}"
        @click="toArticle(article.number)">
        <div class="home-list-item-detail">
          <h1 class="title">{{article.title}}</h1>
          <hr>
          <span class="date">{{article.date}}</span>
        </div>
        <img class="home-list-item-img" v-show="article.cover" :src="article.cover" alt="">
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      cover: require('@/assets/imgs/cover.jpg')
    }
  },
  computed: {
    ...mapState(['articles'])
  },
  methods: {
    isOddLast (num, length) {
      return num === length && !!(num % 2)
    },
    toArticle (number) {
      this.$router.push('/article?number=' + number)
    }
  }
}
</script>

<style lang="less">
.home {
  &-cover {
    height: 100vh;
    overflow: hidden;
    position: relative;
    &-intro {
      position: absolute;
      right: 15px;
      bottom: 15px;
      z-index: 100;
      width: 10vh;
      padding: 5px;
      background: rgba(255, 255, 255, .15);
      img {
        width: 100%;
      }
    }
    &-img {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    &-item {
      height: 25vh;
      width: 50%;
      box-sizing: border-box;
      padding: 15px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      &.odd-last {
        width: 100%;
      }
      &-detail {
        position: relative;
        z-index: 30;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        transform-origin: center center;
        transition: all .4s ease;
        overflow: hidden;
        .title {
          font-size: 1.5rem;
          margin-top: 4rem;
          margin-bottom: 0;
          width: 100%;
          box-sizing: border-box;
          padding: 0 15px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        hr {
          border: 1px solid #fff;
          width: 5rem;
          margin: 1rem 0;
        }
        .date {
          font-size: 1.1rem;
        }

        &:hover {
          transform: scale(1.05);
        }
      }
      &-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
      }
    }
  }
}

.cover:after {
  content: '';
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .3);
  z-index: 20;
}

@media only screen and (max-width: 450px) {
  .home-list-item {
    width: 100%;
  }
}
</style>

<template>
  <div class="view main" style="display: flex; flex-direction">
    <section class="main-others">
      <Timeline :timeline="timeline" @toArticle="toArticle" />
      <Labels ref="labels" :labels="labels" @selectLabel="selectLabel" />
      <About />
    </section>
    <div class="main-articles">
      <Skeleton type="preview" v-if="!articlesList.length" />
      <div class="main-articles-keyword border" v-show="keyword">
        <i class="far fa-times-circle cancel" @click="UPDATE_KEYWORD('')"></i>
        <div class="keyword">
          Keyword:
          <i>"{{keyword}}"</i>
          .
        </div>
        <div class="result">
          <span>{{articles.length}}</span>
          results was found.
        </div>
      </div>
      <Preview
        v-for="(article, i) in articlesList"
        :article="article"
        :userInfo="userInfo"
        :key="i"
        @toArticle="toArticle"
        @like="likeArticle"
        @praise="praiseArticle"
        @toComment="toComment" />
      <About style="padding:0 15px 15px 15px;" class="mobile-only" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Preview from '@/components/Preview'
import Timeline from '@/components/Timeline'
import Labels from '@/components/Labels'
import About from '@/components/About'
import Skeleton from '@/components/Skeleton'
import swal from 'sweetalert2'

export default {
  components: { Preview, Timeline, Labels, About, Skeleton },
  data () {
    return {
      labelFilterKeyword: ''
    }
  },
  computed: {
    ...mapState(['keyword', 'userInfo']),
    ...mapGetters(['timeline', 'labels', 'articles']),
    articlesList () {
      let articles = this.articles
      if (this.labelFilterKeyword) {
        articles = this.articles.filter(article => {
          return article.labels.map(({ name }) => name).includes(this.labelFilterKeyword)
        })
      }
      return articles
    }
  },
  async mounted () {
    document.title = 'JRAIN:BLOG'
    const { status, message } = await this.getArticlesV4()
    const authCode = location.search.split('code=')[1]
    if (status && !authCode) {
      swal.fire({
        type: 'error',
        title: status,
        text: message,
        confirmButtonText: 'To auth'
      }).then(result => {
        if (result.value) {
          document.querySelector('#header-menu-btn').click()
        }
      })
    }
  },
  watch: {
    keyword (val) {
      if (val) {
        this.$refs['labels'].reset()
      }
    }
  },
  methods: {
    ...mapMutations(['UPDATE_KEYWORD']),
    ...mapActions(['getArticlesV4', 'deleteAnReaction', 'createAnReaction']),
    toArticle ({ number, title }) {
      this.$router.push('/article?number=' + number + '&title=' + title)
    },
    toComment ({ number, title }) {
      this.$router.push('/article?number=' + number + '&comment=true' + '&title=' + title)
    },
    selectLabel (label) {
      this.labelFilterKeyword = label
    },
    checkLogin () {
      let isLogin = false
      if (!this.userInfo.login) {
        document.querySelector('#header-menu-btn').click()
      } else {
        isLogin = true
      }
      return isLogin
    },
    likeArticle ({ number, hasLiked }) {
      if (!this.checkLogin()) {
        return false
      }

      if (hasLiked.length) {
        const reactionId = hasLiked[0].id
        this.deleteAnReaction({ number, id: reactionId })
      } else {
        this.createAnReaction({ number, content: 'heart' })
      }
    },
    praiseArticle ({ number, hasPraised }) {
      if (!this.checkLogin()) {
        return false
      }

      if (hasPraised.length) {
        const reactionId = hasPraised[0].id
        this.deleteAnReaction({ number, id: reactionId })
      } else {
        this.createAnReaction({ number, content: '+1' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.main {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  &-others {
    position:sticky;
    top: calc(@gapOuter * 3);
    width: 305px;
    margin-left: @gapOuter;
    height: fit-content;
  }

  &-articles {
    width: 100%;
    max-width: 615px;
    padding: calc(@gapOuter * 3) 0 @gapOuter 0;
    box-sizing: border-box;
    position: relative;
    flex: 1;
    &-keyword {
      margin-bottom: @gapOuter;
      padding: @gapOuter;
      color: @regularFontColor;
      position: relative;
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      z-index: 100;
      .cancel {
        position: absolute;
        right: @gapOuter;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
        cursor: pointer;
      }
      .keyword {
        font-size: 1.5rem;
        margin-bottom: @gapInner;
        i {
          color: @primaryColor;
        }
      }
      .result {
        span {
          color: @primaryColor;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .main-others {
    display: none;
  }
}

@media only screen and (max-width: 450px) {
  .main-articles {
    padding: 0;
    &-keyword {
      margin-bottom: 0;
      position: fixed;
      top: 60px;
      left: 0;
      border-radius: 0;
    }
  }
}
</style>

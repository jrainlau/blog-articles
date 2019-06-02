<template>
  <div class="view">
    <Skeleton type="article" v-if="!article" />
    <div class="article" v-if="article">
      <section class="article-title">
        <h1>{{article.title}}</h1>
        <div>
          <i class="fas fa-feather-alt"></i>
          <span>{{article.date}}</span>
          <span v-for="(label, i) in article.labels" :key="i" class="label" :style="`background: #${label.color}`">{{label.name}}</span>
        </div>
      </section>
      <section class="article-content markdown" v-html="$options.filters.markify(article.content)"></section>
      <section class="article-comments">
        <div class="article-comments-reactions border">
          <div v-if="article.praise">
            <i class="far fa-thumbs-up" :class="{'fas praised': hasPraised}" @click="praiseArticle"></i>
            {{article.praise.length}}
          </div>
          <div class="tools">
            <i class="fas fa-qrcode qrcode" @click="showQR"></i>
            <i class="far fa-copy" @click="copyUrl"></i>
            <div class="tools-qr border" v-show="QR">
              <img :src="QR" alt="">
            </div>
          </div>
        </div>
        <Comments :comments="comments" :articleNumber="articleNumber" :userInfo="userInfo" @updateComments="updateComments" />
        <About />
      </section>
    </div>

    <input type="text" id="page-url" ref="pageUrl" style="position:absolute;opacity:0;top:0;z-index:-9999" :value="pageUrl">

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import marked from 'marked'
import hljs from 'highlight.js'
import Comments from '@/components/Comments'
import About from '@/components/About'
import Skeleton from '@/components/Skeleton'
import swal from 'sweetalert2'

const renderer = new marked.Renderer()
renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`
renderer.image = (href, title, text) => `<a target="_blank" href="${href}" title="${title}"><image src="${href}" /></a>`

marked.setOptions({
  highlight: function (code, lang) {
    let val = code
    if (lang) {
      val = hljs.highlight(lang, code).value
    }
    return val
  },
  sanitize: true
})

export default {
  components: { Comments, About, Skeleton },
  filters: {
    markify (str) {
      return marked(str, { renderer })
    }
  },
  data () {
    return {
      QR: '',
      articleNumber: '',
      comments: [],
      praise: []
    }
  },
  computed: {
    ...mapState(['articles', 'userInfo']),
    article () {
      const queryNumber = Number(this.$route.query.number)
      return this.articles.filter(({ number }) => number === queryNumber)[0]
    },
    hasPraised () {
      return this.article.praise.some(({ user }) => {
        return user.login === this.userInfo.login
      })
    },
    pageUrl () {
      return location.href
    }
  },
  async mounted () {
    document.title = this.$route.query.title ? this.$route.query.title + ' | JRAIN:BLOG' : 'JRAIN:BLOG'
    this.articleNumber = this.$route.query.number
    if (!this.article) {
      const result = await this.getArticlByNumber(this.articleNumber)
      const authCode = location.search.split('code=')[1]
      if (result.status && !authCode) {
        swal.fire({
          type: 'error',
          title: result.status,
          text: result.data.message,
          confirmButtonText: 'To auth'
        }).then(result => {
          if (result.value) {
            document.querySelector('#header-menu-btn').click()
          }
        })
      }
    }
    await this.getReactions({
      number: this.articleNumber,
      autoCommit: true
    })
    this.comments = await this.getComments(this.articleNumber)
    this.$nextTick(() => {
      if (this.$route.query.comment) {
        const mainView = document.querySelector('.view')
        mainView.scrollTop = mainView.scrollHeight
      }
    })
  },
  methods: {
    ...mapActions(['getArticlByNumber', 'getComments', 'getReactions', 'deleteAnReaction', 'createAnReaction']),
    getArticleComments () {
      const articleNumber = this.$route.query.number
      this.getComments(articleNumber)
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
    likeArticle () {
      if (!this.checkLogin()) return
      if (this.hasLiked.length) {
        const reactionId = this.hasLiked[0].id
        this.deleteAnReaction({ number: this.article.number, id: reactionId })
      } else {
        this.createAnReaction({ number: this.article.number, content: 'heart' })
      }
    },
    praiseArticle () {
      if (!this.checkLogin()) return
      this.createAnReaction({ number: this.article.number, content: '+1' })
    },
    async showQR () {
      const QRcode = await import('qrcode')
      const dataUrl = await QRcode.toDataURL(this.pageUrl)
      if (!this.QR) {
        this.QR = dataUrl
      } else {
        this.QR = ''
      }
      const hideQr = (e) => {
        if (!e.target.classList.contains('qrcode')) {
          this.QR = ''
          document.body.removeEventListener('click', hideQr)
        }
      }
      document.body.addEventListener('click', hideQr)
    },
    copyUrl () {
      this.$refs['pageUrl'].select()
      document.execCommand('copy')
      swal.fire({
        toast: true,
        title: `Article url has been copied to your clipboard`,
        type: 'success',
        showConfirmButton: false,
        timer: 2000
      })
    },
    updateComments (comments) {
      const view = document.querySelector('.view')
      view.scrollTop = view.scrollHeight
      this.comments = comments
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.article {
  width: 100%;
  max-width: 935px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(@gapOuter * 3) 0 @gapOuter 0;
  box-sizing: border-box;
  background: #fff;
  &-title {
    margin-bottom: @gapOuter;
    width: 100%;
    h1 {
      font-size: 2.5rem;
      border: none;
      margin-top: 0;
      margin-bottom: @gapOuter;
    }
    div {
      font-size: 1.2rem;
      margin: 0;
      color: @monorFontColor;
      i {
        margin-right: @gapInner;
      }
    }
    .label {
      font-size: 1rem;
      padding: 2px 8px;
      border-radius: @borderRadius;
      margin-left: @gapInner;
      color: #fff;
    }
  }
  &-content {
    width: 100%;
    line-height: 1.5;
  }
  &-comments {
    width: 100%;
    border-top: 1px dashed @secondBorderColor;
    padding-top: calc(@gapOuter * 3);
    margin-top: calc(@gapOuter * 3);
    &-reactions {
      color: @monorFontColor;
      padding: @gapOuter;
      font-size: 1.8rem;
      position: relative;
      .praised {
        color: @warningColor;
      }
      .liked {
        color: @dangerColor;
      }
      .tools {
        position: absolute;
        top: 0;
        right: @gapOuter;
        height: 100%;
        display: flex;
        align-items: center;
        i {
          margin-left: @gapOuter;
          cursor: pointer;
        }
        &-qr {
          position: absolute;
          width: 150px;
          height: 150px;
          top: -160px;
          right: 0;
          background: #fff;
          img {
            width: 100%;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .article {
    padding: calc(@gapOuter * 3) @gapOuter @gapOuter @gapOuter;
    &-content {
      font-size: 1.2rem;
    }
    .tools {
      display: none;
    }
    #page-url {
      display: none;
    }
  }
}
</style>

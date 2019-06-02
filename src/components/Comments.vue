<template>
  <div class="comments">
    <div class="comments-auth border" v-if="!isLogin">
      <button @click="toLogin">Login with Github to comment</button>
    </div>

    <div class="comments-list border" v-if="comments && comments.length">
      <div class="comments-list-item" v-for="(comment, i) in comments" :key="i">
        <div class="user">
          <a class="user-avatar" :href="comment.user.html_url" target="_blank">
            <img :src="comment.user.avatar_url" alt="">
          </a>
          <div class="user-info">
            <p class="user-info-name">{{comment.user.login}}</p>
            <p class="user-info-date">{{comment.created_at | dateFormat}}</p>
          </div>
        </div>
        <i class="fas fa-reply reply" v-if="isLogin" @click="reply(comment)"></i>
        <div class="content markdown" v-html="$options.filters.markify(comment.body)"></div>
      </div>
    </div>

    <div class="comments-operation border" v-if="isLogin">
      <div class="comments-operation-user">
        <div class="avatar">
          <img :src="userInfo.avatarUrl" alt="">
        </div>
        <div class="name">{{userInfo.login}}</div>
      </div>

      <div class="comments-operation-textarea">
        <textarea ref="commentArea" class="border" rows="5" v-model="commentContent"></textarea>
      </div>

      <div class="comments-operation-button">
        <button :disabled="!commentContent.length" @click="submitComment">Comment</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import marked from 'marked'
import hljs from 'highlight.js'
import swal from 'sweetalert2'

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
  props: ['comments', 'articleNumber', 'userInfo'],
  filters: {
    dateFormat (str) {
      const date = new Date(str)
      const YMD = date.toLocaleDateString('zh').replace(/\//g, '-')
      const H = date.getHours()
      const M = date.getMinutes()
      const HH = H < 10 ? '0' + H : H
      const MM = M < 10 ? '0' + M : M
      return `${YMD} ${HH}:${MM}`
    },
    markify (str) {
      return marked(str)
    }
  },
  data () {
    return {
      isLogin: false,

      commentContent: '',
      showCommentList: false
    }
  },
  mounted () {
    this.checkIsLogin()
  },
  watch: {
    userInfo: {
      deep: true,
      handler (val) {
        this.checkIsLogin()
      }
    }
  },
  methods: {
    ...mapActions(['getUserInfo', 'getComments', 'createComment', 'deleteComment']),
    checkIsLogin () {
      this.isLogin = !!this.userInfo.login
    },
    toLogin () {
      document.querySelector('#header-menu-btn').click()
    },
    async submitComment () {
      const commentContent = this.commentContent
      this.commentContent = ''

      const { status } = await this.createComment({ articleNumber: this.articleNumber, comment: commentContent })
      if (status < 400) {
        const comments = await this.getComments(this.articleNumber)
        this.$emit('updateComments', comments)

        swal.fire({
          toast: true,
          title: `Commet successed!`,
          type: 'success',
          showConfirmButton: false,
          timer: 2000
        })
      } else {
        swal.fire({
          toast: true,
          title: `Commet failed!`,
          type: 'error',
          showConfirmButton: false,
          timer: 2000
        })
      }
    },
    reply (comment) {
      const mainView = document.querySelector('.view')
      mainView.scrollTop = mainView.scrollHeight
      const commentArea = this.$refs['commentArea']
      this.commentContent = `> ${comment.body}\n\n@${comment.user.login} `

      commentArea.focus()
      this.$nextTick(() => {
        commentArea.scrollTop = commentArea.scrollHeight
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

.comments {
  padding: @gapOuter 0;

  &-header {
    margin-bottom: @gapOuter;
    h1 {
      margin: 0;
      font-weight: normal;
    }
  }

  &-auth {
    margin-bottom: @gapOuter;
    padding: @gapOuter;
  }

  &-operation {
    margin-bottom: @gapOuter;
    padding: @gapOuter;
    &-user {
      display: flex;
      align-items: center;
      margin-bottom: @gapOuter;
      color: @monorFontColor;
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 36px;
        overflow: hidden;
        margin-right: @gapInner;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    &-textarea {
      width: 100%;
      margin-bottom: @gapOuter;
      textarea {
        appearance: none;
        width: 100%;
        box-sizing: border-box;
        padding: 5px @gapInner;
        outline: none;
        resize: none;
        color: @primaryFontColor;
        &:focus {
          border-color: @primaryColor;
        }
      }
    }
  }

  &-list {
    margin-bottom: @gapOuter;
    &-item {
      position: relative;
      padding: @gapOuter;
      padding-bottom: 0;
      border-bottom: 1px solid @secondBorderColor;
      .reply {
        position: absolute;
        top: @gapOuter;
        right: @gapOuter;
        cursor: pointer;
        color: @primaryColor;
      }
      .user {
        display: flex;
        margin-bottom: @gapOuter;
        position: relative;
        &-avatar {
          width: 36px;
          height: 36px;
          border-radius: 36px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        &-info {
          margin-left: @gapInner;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p {
            margin: 0;
          }
          &-name {
            color: @monorFontColor;
          }
          &-date {
            color: @monorFontColor;
          }
        }
      }
    }
  }
}
</style>

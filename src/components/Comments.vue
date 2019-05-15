<template>
  <div class="comments">
    <div class="comments-header">
      <h1>Comments</h1>
    </div>

    <div class="comments-auth border" v-if="!isLogin">
      <div class="comments-auth-token input-area" v-if="authMode === 'token'">
        <input placeholder="Github access token" v-model="token" type="text">
        <i class="far fa-question-circle" @click="pageJump"></i>
      </div>
      <div class="comments-auth-account input-area" v-if="authMode === 'account'">
        <input placeholder="Github account" v-model="account" type="text">
        <br>
        <input placeholder="Github password" v-model="password" type="password">
      </div>
      <div class="comments-auth-submit">
        <span @click="changeAuthMode">Use Github {{authMode === 'token' ? 'account' : 'access token'}} to auth</span>
        <button class="button" :disabled="!disableAuthBtn" @click="submitAuth">Submit</button>
      </div>
    </div>

    <div class="comments-operation border" v-if="isLogin">
      <div class="comments-operation-user">
        <i class="comments-operation-user-logout fas fa-sign-out-alt tooltip" data-tips="Logout" @click="logout"></i>
        <div class="avatar">
          <img :src="userInfo.avatar_url" alt="">
        </div>
        <div class="name">{{userInfo.login}}</div>
      </div>

      <div class="comments-operation-textarea">
        <textarea class="border" rows="5" v-model="commentContent"></textarea>
      </div>

      <div class="comments-operation-button">
        <button class="button" :disabled="!commentContent.length" @click="submitComment">Comment</button>
      </div>
    </div>

    <div class="comments-list border" v-if="article.comments">
      <div class="comments-list-item" v-for="(comment, i) in article.comments" :key="i">
        <div class="user">
          <a class="user-avatar" :href="comment.user.html_url" target="_blank">
            <img :src="comment.user.avatar_url" alt="">
          </a>
          <div class="user-info">
            <p class="user-info-name">{{comment.user.login}}</p>
            <p class="user-info-date">{{comment.created_at | dateFormat}}</p>
          </div>
        </div>

        <div class="content markdown" v-html="$options.filters.markify(comment.body)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
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
  props: ['article', 'userInfo'],
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
      authMode: 'token',
      isLogin: false,
      token: '',
      account: '',
      password: '',

      commentContent: '',
      showCommentList: false
    }
  },
  computed: {
    disableAuthBtn () {
      let disabled = false
      if (this.authMode === 'token') {
        disabled = !!this.token.length
      } else {
        disabled = !!this.account.length && !!this.password.length
      }
      return disabled
    }
  },
  mounted () {
    this.checkIsLogin()
  },
  watch: {
    userInfo (val) {
      if (val) {
        this.checkIsLogin()
      }
    }
  },
  methods: {
    ...mapActions(['getUserInfo', 'getComments', 'createComment', 'deleteComment']),
    ...mapMutations(['UPDATE_COMMENT']),
    pageJump () {
      window.open('https://github.com/settings/tokens/new')
    },
    checkIsLogin () {
      if (this.userInfo.login) {
        this.isLogin = true
      }
    },
    changeAuthMode () {
      const currentMode = this.authMode
      this.authMode = currentMode === 'token' ? 'account' : 'token'
    },
    async submitAuth () {
      let token = ''
      if (this.authMode === 'token') {
        token = `Bearer ${this.token}`
      } else {
        token = `Basic ${btoa(this.account + ':' + this.password)}`
      }

      const { status, data } = await this.getUserInfo(token)

      if (status === 401) {
        swal.fire({
          title: status,
          text: data.message,
          type: 'error'
        })
        this.token = ''
        this.account = ''
        this.password = ''
      } else {
        this.isLogin = true
        localStorage.setItem('github_token', token)
      }
    },
    logout () {
      this.token = ''
      this.account = ''
      this.password = ''
      this.isLogin = false
      localStorage.removeItem('github_token')
    },
    async submitComment () {
      const commentContent = this.commentContent
      this.commentContent = ''

      const { status, data } = await this.createComment({ commentsUrl: this.article.commentsUrl, comment: commentContent })
      if (status < 400) {
        swal.fire({
          title: 'Commet sucessed!',
          type: 'success',
          showConfirmButton: false,
          allowOutsideClick: false,
          timer: 2000
        })

        this.getComments(this.article.commentsUrl)
      } else {
        swal.fire({
          title: `Commet failed!\n${status}`,
          text: data.message,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comments {
  border-top: 1px dashed #DCDFE6;
  padding: 15px 0;

  &-header {
    margin-bottom: 15px;
    h1 {
      margin: 0;
      font-weight: normal;
    }
  }

  &-auth {
    margin-bottom: 15px;
    padding: 15px;
    .input-area {
      input {
        padding: 5px 10px;
        border: none;
        outline: none;
        border-bottom: 1px solid #DCDFE6;
        margin-right: 5px;
        width: 200px;
        margin-bottom: 15px;
        border-radius: 0;
        &:focus {
          border-bottom: 2px solid #8e24aa;
        }
      }
      i {
        color: #909399;
        cursor: pointer;
        font-size: 1.2rem;
      }
    }
    &-submit {
      span {
        display: block;
        margin-bottom: 15px;
        color: #8e24aa;
        cursor: pointer;
      }
    }
  }

  &-operation {
    margin-bottom: 15px;
    padding: 15px;
    &-user {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      position: relative;
      &-logout {
        position: absolute;
        top: 50%;
        right: 0;
        color: #F56C6C;
        font-size: 1.2rem;
        transform: translateY(-50%);
        cursor: pointer;
      }
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 36px;
        overflow: hidden;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    &-textarea {
      width: 100%;
      margin-bottom: 15px;
      textarea {
        appearance: none;
        width: 100%;
        box-sizing: border-box;
        padding: 5px 10px;
        outline: none;
        resize: none;
      }
    }
  }

  &-list {
    &-item {
      padding: 15px;
      padding-bottom: 0;
      border-bottom: 1px solid #DCDFE6;
      .user {
        display: flex;
        margin-bottom: 15px;
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
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p {
            margin: 0;
          }
          &-name {
            color: #606266;
          }
          &-date {
            color: #909399;
          }
        }
        &-delte {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 1.2rem;
          color: #F56C6C;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

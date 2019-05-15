<template>
  <div class="auth mask" v-if="showAuth" @click="hideAuth">
    <div class="auth-box border">
      <h3 class="auth-box-title">
        Auth
      </h3>
      <div class="auth-box-token input-area" v-if="authMode === 'token'">
        <input placeholder="Github access token" v-model="token" type="text">
        <i class="far fa-question-circle" @click="pageJump"></i>
      </div>
      <div class="auth-box-account input-area" v-if="authMode === 'account'">
        <input placeholder="Github account" v-model="account" type="text">
        <br>
        <input placeholder="Github password" v-model="password" type="password">
      </div>
      <div class="auth-box-submit">
        <span @click="changeAuthMode">Use Github {{authMode === 'token' ? 'account' : 'access token'}} to auth</span>
        <button class="button" :disabled="!disableAuthBtn" @click="submitAuth">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import { mapActions } from 'vuex'

export default {
  props: ['showAuth'],
  data () {
    return {
      authMode: 'token',
      token: '',
      account: '',
      password: ''
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
  methods: {
    ...mapActions(['getUserInfo']),
    hideAuth (e) {
      if (e.target.classList.contains('mask')) {
        // this.$emit('update:showAuth', false)
      }
    },
    pageJump () {
      window.open('https://github.com/settings/tokens/new')
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
        this.$emit('update:showAuth', false)
        localStorage.setItem('github_token', token)
        location.reload()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.auth {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .25);
  display: flex;
  justify-content: center;
  align-items: center;
  &-box {
    padding: 15px;
    background: #fff;
    width: 90%;
    max-width: 400px;
    &-title {
      margin: 0 -15px 15px -15px;
      padding: 0 15px 15px 15px;
      font-weight: normal;
      border-bottom: 1px solid #DCDFE6;
    }
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
        width: fit-content;
        margin-bottom: 15px;
        color: #8e24aa;
        cursor: pointer;
      }
    }
  }
}
</style>

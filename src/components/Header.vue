<template>
  <header>
    <div class="header">
      <div class="header-logo">
        <img :src="require('@/assets/imgs/logo-h.png')" @click="$router.push('/')">
      </div>
      <div class="header-tools">
        <input type="text" class="header-tools-search" placeholder="Search" v-model="keyword" @keyup.enter="search">
        <span v-if="userInfo.name" class="header-tools-name">{{userInfo.name}}</span>
        <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" alt="" class="header-tools-avatar">
        <i class="fas fa-ellipsis-v header-tools-more show-menu" @click="menuOnShow = !menuOnShow"></i>
      </div>

      <div class="header-menu border" v-show="menuOnShow">
        <div class="header-menu-item search">
          <input type="text" class="show-menu" placeholder="Search" v-model="keyword" @keyup.enter="search">
        </div>
        <div class="header-menu-item" id="header-menu-btn" @click="loginWithGithub" v-show="!userInfo.login">
          Login with Github
        </div>
        <!-- <div class="header-menu-item" id="header-menu-btn" @click="login" v-show="!userInfo.login">
          Login
        </div> -->
        <div class="header-menu-item signout" v-show="userInfo.login" @click="signout">
          <i class="fas fa-sign-out-alt"></i>
          Signout
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import swal from 'sweetalert2'

export default {
  props: ['userInfo', 'showAuth'],
  data () {
    return {
      menuOnShow: false,
      keyword: ''
    }
  },
  async mounted () {
    window.addEventListener('click', (e) => {
      if (!e.target.classList.contains('show-menu')) {
        this.menuOnShow = false
      }
    })
    const authCode = location.search.split('code=')[1]
    if (authCode) {
      const { data } = await this.githubAuth(authCode)
      if (data.error) {
        swal.fire({
          type: 'error',
          title: data.error,
          text: data.error_description,
          confirmButtonText: 'Retry'
        }).then(result => {
          if (result.value) {
            document.querySelector('#header-menu-btn').click()
          }
        })
      } else {
        localStorage.setItem('github_token', `Bearer ${data.access_token}`)
        location.href = location.href.split(/[?#]/)[0]
      }
    }
  },
  methods: {
    ...mapActions(['githubAuth']),
    login () {
      this.$emit('update:showAuth', true)
    },
    signout () {
      this.$emit('signout')
    },
    search () {
      this.$emit('search', this.keyword)
      this.menuOnShow = false
      this.keyword = ''
    },
    loginWithGithub () {
      location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.371000f912198076&redirect_uri=https://jrainlau.github.io'
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/style/variables.less';

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid rgba(0,0,0,.15);
}

.header {
  margin: 0 auto;
  width: 100%;
  max-width: 935px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @gapInner 0;
  box-sizing: border-box;
  position: relative;

  &-logo {
    height: 40px;
    img {
      height: 100%;
    }
  }

  &-tools {
    display: flex;
    align-items: center;
    &-name {
      margin-left: @gapOuter;
      color: @monorFontColor;
      cursor: default;
    }
    &-avatar {
      margin-left: @gapOuter;
      width: 36px;
      height: 36px;
      border-radius: 36px;
      border: 1px solid @firstBorderColor;
    }
    &-more {
      padding-left: @gapOuter;
      color: @primaryColor;
      font-size: 1.5rem;
      cursor: pointer;
    }
    &-search {
      box-sizing: border-box;
      width: 166px;
      transition: .3s;
      &:focus {
        width: 332px;
      }
    }
  }

  &-menu {
    position: absolute;
    right: 0;
    top: 60px;
    background: #fff;
    width: 200px;
    user-select: none;
    &-item {
      padding: @gapOuter;
      cursor: pointer;
      border-bottom: 1px solid @firstBorderColor;
      &:last-child {
        border: none;
      }
      &:hover {
        background: @hoverColor;
      }
      &:active {
        background: @activeColor;
      }
      &.search {
        padding:0;
        display: none;
        input {
          box-sizing: border-box;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .header {
    padding: @gapInner @gapOuter;
  }
  .header-tools {
    &-search {
      display: none;
    }
  }
  .header-menu {
    width: 100%;
    border-right: none;
    border-left: none;
    border-radius: 0;
    &-item {
      text-align: center;
      &.search {
        display: block;
        height: 45px;
        input {
          height: 100%;
        }
      }
    }
  }
}
</style>

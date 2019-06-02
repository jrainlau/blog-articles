<template>
  <div id="app">
    <Header
      :userInfo="userInfo"
      :showAuth.sync="showAuth"
      @signout="signout"
      @search="search" />
    <main>
      <router-view></router-view>
    </main>
    <Auth :showAuth.sync="showAuth" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Auth from '@/components/Auth'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      showAuth: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    Header,
    Auth
  },
  async created () {
    const token = localStorage.getItem('github_token')
    if (token) {
      this.getUserInfo(token)
    }
  },
  methods: {
    ...mapActions(['getArticles', 'getUserInfo']),
    ...mapMutations(['GET_USER_INFO', 'UPDATE_KEYWORD']),
    signout () {
      localStorage.removeItem('github_token')
      this['GET_USER_INFO']({})
    },
    search (keyword) {
      this.$router.push('/')
      this['UPDATE_KEYWORD'](keyword)
    }
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  position: relative;
  main {
    width: 100%;
    height: 100%;
  }
}
</style>

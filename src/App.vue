<template>
  <div id="app">
    <Header @showAbout="showAbout = true" />
    <main>
      <router-view></router-view>
    </main>
    <About :showAbout.sync="showAbout" />
    <Auth :showAuth.sync="showAuth" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import About from '@/components/About'
import Auth from '@/components/Auth'
import { mapActions } from 'vuex'
import swal from 'sweetalert2'

export default {
  data () {
    return {
      showAbout: false,
      showAuth: false
    }
  },
  components: {
    Header,
    About,
    Auth
  },
  async created () {
    const { status, message } = await this.getArticles()
    if (status) {
      swal.fire({
        type: 'error',
        title: status,
        text: message,
        confirmButtonText: 'To auth'
      }).then(result => {
        if (result.value) {
          this.showAuth = true
        }
      })
    }
    const token = localStorage.getItem('github_token')
    if (token) {
      this.getUserInfo(token)
    }
  },
  methods: {
    ...mapActions(['getArticles', 'getUserInfo'])
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  position: relative;
  main {
    width: 100%;
    position: relative;
  }
}
</style>

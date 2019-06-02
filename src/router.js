import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import Article from './views/Article.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Main
    },
    {
      path: '/article',
      name: 'Article',
      component: Article
    }
  ]
})

router.afterEach((to, from) => {
  const mainView = document.querySelector('main')
  if (mainView) {
    mainView.scroll(0, 0)
  }
})

export default router

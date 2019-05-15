import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const API_DOMAIN = 'https://api.github.com'
const REPO_URL = `${API_DOMAIN}/repos/jrainlau/my-blog`

const $fetch = ({ url, method = 'get', data, headers = {} }) => {
  return axios({
    url,
    method,
    data,
    headers: {
      'Authorization': localStorage.getItem('github_token'),
      ...headers
    }
  }).then(({ status, data }) => {
    return {
      status,
      data
    }
  }).catch(({ response }) => {
    return {
      status: response.status,
      data: response.data
    }
  })
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    articles: [],
    userInfo: {}
  },
  mutations: {
    GET_ARTICLES (state, articles) {
      state.articles = articles
    },
    GET_USER_INFO (state, info) {
      state.userInfo = info
    },
    GET_COMMENTS (state, { commentsUrl, comments }) {
      state.articles.forEach(article => {
        if (article.commentsUrl === commentsUrl) {
          Vue.set(article, 'comments', comments)
        }
      })
    },
    UPDATE_COMMENT (state, { number, comments }) {
      state.articles.forEach(article => {
        if (article.number === number) {
          article.comments = comments
        }
      })
    }
  },
  actions: {
    async getArticles ({ commit, dispatch }) {
      const { status, data } = await $fetch({
        url: `${REPO_URL}/issues?filter=created`
      }).catch(e => e)
      if (status < 400) {
        const articles = data.map(issue => {
          const cover = issue.body.match(/!\[.+?\]\((.+?\.(?:png|jpg|gif|jpeg)[^)]*)\)/)

          const article = {
            title: issue.title,
            content: issue.body,
            cover: cover ? cover[1] : null,
            number: issue.number,
            date: new Date(issue.created_at).toLocaleDateString('zh').replace(/\//g, '-'),
            labels: issue.labels,
            commentsUrl: issue.comments_url
          }
          return article
        })
        commit('GET_ARTICLES', articles)
        return true
      } else {
        return {
          status,
          message: data.message
        }
      }
    },
    async getUserInfo ({ commit }, token) {
      const { status, data } = await $fetch({
        url: `${API_DOMAIN}/user`,
        headers: {
          'Authorization': token
        }
      })
      if (status < 400) {
        commit('GET_USER_INFO', data)
      }
      return {
        status,
        data
      }
    },
    async getComments ({ commit }, commentsUrl) {
      const result = await $fetch({ url: commentsUrl })
      commit('GET_COMMENTS', { commentsUrl, comments: result.data })
      return result
    },
    async createComment ({ commit }, { commentsUrl, comment }) {
      const result = await $fetch({
        url: commentsUrl,
        method: 'post',
        data: {
          body: comment
        },
        headers: {
          'Authorization': localStorage.getItem('github_token')
        }
      })
      return result
    }
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import { GetArticles, GetUserInfo } from './gglQueries'

const API_DOMAIN = 'https://api.github.com'
const REPO_URL = `${API_DOMAIN}/repos/jrainlau/jrainlau.github.io`
const SERVER = 'https://api.jrainlau.now.sh/github'
// const SERVER = 'http://localhost:3000/github'

export const $fetch = ({ url, method = 'get', data, headers = {} }) => {
  const option = {
    url,
    method,
    ...(method === 'post' ? { data } : null),
    ...(method === 'get' ? { params: data } : null),
    headers: {
      ...(localStorage.getItem('github_token') ? { 'Authorization': localStorage.getItem('github_token') } : null),
      ...headers
    }
  }
  return axios(option).then(({ status, data }) => {
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
    userInfo: {},
    keyword: ''
  },
  getters: {
    timeline ({ articles }) {
      const tl = {}
      articles.forEach(article => {
        const date = article.date.replace(/-\d{1,2}$/, '')
        console.log(date)
        if (!tl[date]) {
          tl[date] = []
        }
        tl[date].push(article)
      })
      return tl
    },
    labels ({ articles }) {
      const lb = {}
      articles.forEach(article => {
        article.labels.forEach(label => {
          if (!lb[label.name]) {
            lb[label.name] = []
          }
          lb[label.name].push({
            color: label.color,
            name: label.name
          })
        })
      })
      return lb
    },
    articles ({ articles, keyword }) {
      let list = articles
      if (keyword) {
        const regx = new RegExp(keyword, 'i')
        list = articles.filter(article => regx.test(article.title))
      }
      return list
    }
  },
  mutations: {
    GET_ARTICLES (state, articles) {
      state.articles = articles
    },
    ADD_ARTICLES (state, articles) {
      Vue.set(state, 'articles', state.articles.concat(articles))
    },
    GET_USER_INFO (state, info) {
      Vue.set(state, 'userInfo', info)
    },
    GET_COMMENTS (state, { commentsUrl, comments }) {
      state.articles.forEach(article => {
        if (article.commentsUrl === commentsUrl) {
          Vue.set(article, 'comments', comments)
        }
      })
    },
    UPDATE_KEYWORD (state, keyword) {
      state.keyword = keyword
    },
    UPDATE_REACTIONS (state, { reactions, number }) {
      state.articles.forEach(article => {
        if (+article.number === +number) {
          Vue.set(article, 'praise', reactions.filter(re => re.content === '+1'))
        }
      })
    }
  },
  actions: {
    async getArticlesV4 ({ commit, dispatch }, nextCursor) {
      const nextPage = nextCursor ? `after:"${nextCursor}",` : ''
      const { status, data } = await $fetch({
        method: 'post',
        url: `${API_DOMAIN}/graphql`,
        data: {
          query: GetArticles(nextPage)
        }
      })
      if (status < 400) {
        const articles = data.data.repository.issues.nodes.map(article => ({
          title: article.title,
          content: article.body,
          cover: article.body.match(/!\[.+?\]\((.+?[^)]*)\)/)[1],
          number: article.number,
          date: new Date(article.createdAt).toLocaleDateString('zh').replace(/\//g, '-'),
          labels: article.labels.nodes,
          commentsUrl: `${REPO_URL}/issues/${article.number}/comments`,
          commentsAmount: article.comments.totalCount,
          reactions: article.reactions.totalCount
        }))
        if (nextCursor) {
          commit('ADD_ARTICLES', articles)
        } else {
          commit('GET_ARTICLES', articles)
        }
        const { hasNextPage, endCursor } = data.data.repository.issues.pageInfo
        if (hasNextPage) {
          await dispatch('getArticlesV4', endCursor)
        }
        return true
      } else {
        return {
          status,
          message: data.message
        }
      }
    },
    async getArticlByNumber ({ commit }, articleNumber) {
      const { status, data } = await $fetch({
        url: `${REPO_URL}/issues/${articleNumber}`
      })
      if (status < 400) {
        const article = {
          title: data.title,
          content: data.body,
          cover: data.body.match(/!\[.+?\]\((.+?[^)]*)\)/)[1],
          number: data.number,
          date: new Date(data.created_at).toLocaleDateString('zh').replace(/\//g, '-'),
          labels: data.labels,
          commentsUrl: `${REPO_URL}/issues/${data.number}/comments`,
          commentsAmount: data.comments
        }
        commit('GET_ARTICLES', [article])
        return article
      } else {
        return { status, data }
      }
    },
    async getUserInfo ({ commit }, token) {
      const { status, data } = await $fetch({
        method: 'post',
        url: `${API_DOMAIN}/graphql`,
        headers: {
          'Authorization': token
        },
        data: {
          query: GetUserInfo()
        }
      })
      if (status < 400) {
        commit('GET_USER_INFO', data.data.viewer)
      }
      return {
        status,
        data
      }
    },
    async getComments (_, articleNumber) {
      const commentsUrl = `${REPO_URL}/issues/${articleNumber}/comments`
      const { data: comments } = await $fetch({ url: commentsUrl })
      // commit('GET_COMMENTS', { commentsUrl, comments })
      return comments
    },
    async createComment (_, { articleNumber, comment }) {
      const commentsUrl = `${REPO_URL}/issues/${articleNumber}/comments`
      const result = await $fetch({
        url: commentsUrl,
        method: 'post',
        data: {
          body: comment
        }
      })
      return result
    },
    async getReactions ({ commit }, { number, autoCommit }) {
      const result = await $fetch({
        url: `${REPO_URL}/issues/${number}/reactions`,
        headers: {
          'Accept': 'application/vnd.github.squirrel-girl-preview+json'
        }
      }).catch(e => e)
      autoCommit && commit('UPDATE_REACTIONS', {
        reactions: result.data,
        number
      })
      return result
    },
    async createAnReaction ({ dispatch }, { number, content }) {
      await $fetch({
        method: 'post',
        url: `${REPO_URL}/issues/${number}/reactions`,
        data: {
          content
        },
        headers: {
          'Accept': 'application/vnd.github.squirrel-girl-preview+json'
        }
      }).catch(e => e)
      dispatch('getReactions', { number, autoCommit: true })
    },
    async deleteAnReaction ({ dispatch }, { number, id }) {
      await $fetch({
        method: 'delete',
        url: `${API_DOMAIN}/reactions/${id}`,
        headers: {
          'Accept': 'application/vnd.github.squirrel-girl-preview+json'
        }
      }).catch(e => e)
      dispatch('getReactions', { number, autoCommit: true })
    },
    async githubAuth (_, code) {
      const { data } = await $fetch({
        url: SERVER,
        data: {
          code
        }
      }).catch(e => e)
      return data
    }
  }
})

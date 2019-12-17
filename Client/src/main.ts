import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
import axios from 'axios'
import { getModule } from 'vuex-module-decorators'
import AlertModule from './store/modules/alerts'
import UserModule from './store/modules/users'
import PersonModule from './store/modules/persons'
import ProjectModule from './store/modules/projects'
import KnowledgeBaseModule from './store/modules/knowledgeBase'
import i18n from './i18n'

async function init() {
  const alertModule = getModule(AlertModule, store)
  const userModule = getModule(UserModule, store)
  const personModule = getModule(PersonModule, store)
  const projectModule = getModule(ProjectModule, store)
  const knowledgeBaseModule = getModule(KnowledgeBaseModule, store)

  Vue.config.productionTip = false

  axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL || 'http://localhost:5000'
  axios.defaults.timeout = 3000
  axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (!error.response) {
        alertModule.showAlert({
          message: error.message,
          color: 'error',
          timeout: 3000,
        })
      } else if ((error.response.status === 401) && localStorage.getItem('user')) {
        // * automatically sign out if token is expired or invalid
        userModule.signOut()
        location.reload(true)
        // TODO: communicate signOut via an alert
      }
      return Promise.reject(error)
    })

  new Vue({
    store,
    router,
    i18n,
    render: (h) => h(App)
  }).$mount('#app')

  const userItem = localStorage.getItem('user')
  if (userItem) {
    const user = JSON.parse(userItem)
    axios.defaults.headers.common.Authorization = `Bearer ${user.token}`

    // keep in sync with modules/users.ts
    try {
      await userModule.initUserModule()
      await personModule.initPersonModule()
      await projectModule.initProjectModule()
      await knowledgeBaseModule.initKnowledgeBaseModule()
    } catch (error) {
      if (!error.response) {
        router.push({ name: 'serverException' })
      }
    }
  }
}

init()

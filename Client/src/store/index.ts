import Vue from 'vue'
import Vuex from 'vuex'
import ProjectModule from './modules/projects'
import UserModule from './modules/users'
import AlertModule from './modules/alerts'

Vue.use(Vuex)
Vue.config.devtools = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    ProjectModule,
    UserModule,
    AlertModule,
  }
})

export default store

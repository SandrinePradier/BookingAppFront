// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import http from './helpers/http'
import calendar from './helpers/calendar'
import { store } from './store/store'

import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2)

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './scss/main.scss'

Vue.use(Vuetify, {
  theme: {
    "primary": "#673ab7",
    "secondary": "white",
    "accent": "#82B1FF",
    "error": "#FF5252",
    "info": "#2196F3",
    "success": "#4CAF50",
    "warning": "#FFC107"
  }
})

import main from './scss/main.scss'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

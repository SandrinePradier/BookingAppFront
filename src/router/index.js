import Vue from 'vue'
import Router from 'vue-router'
import home from '@/modules/components/home'
import authentication from '@/modules/components/authentication'
import calendar from '@/modules/components/calendar'
import login from '@/modules/components/login'
import signup from '@/modules/components/signup'
import confirmation from '@/modules/components/confirmation'
import landing from '@/modules/components/landing'
import bye from '@/modules/components/bye'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: landing
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/bye',
      name: 'bye',
      component: bye
    },
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Pen from '@/components/Pen'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pen',
      component: Pen
    }
  ]
})

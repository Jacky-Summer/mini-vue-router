import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../myrouter'
import Page from '../pages/Page'
import Page1 from '../pages/Page1'
import Page2 from '../pages/Page2'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Page',
    component: Page,
  },
  {
    path: '/page1',
    name: 'Page1',
    component: Page1,
  },
  {
    path: '/page2',
    name: 'Page2',
    component: Page2,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

import Vue from 'vue'
import Router from 'vue-router'

const home = () => import('../page/mainPage')
const download = () => import('../page/downloadPage')
const server = () => import('../page/serverPage')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: home
    },
    {
      path: '/download',
      name: 'DownloadPage',
      component: download
    },
    {
      path: '/server',
      name: 'serverPage',
      component: server
    }
  ]
})

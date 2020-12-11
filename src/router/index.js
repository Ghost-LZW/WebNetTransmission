import Vue from 'vue'
import Router from 'vue-router'

const home = () => import('../page/mainPage')
const download = () => import('../page/downloadPage')
const server = () => import('../page/serverPage')
const totTasks = () => import('../page/totTasksPage')
const runningTasks = () => import('../page/runningTasksPage')
const pausingTasks = () => import('../page/pausingTasksPage')
const completedTasks = () => import('../page/completedTasksPage')
const servingTasks = () => import('../page/servingTasksPage')

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
    },
    {
      path: '/totTasks',
      name: 'totTasks',
      component: totTasks
    },
    {
      path: '/downloadingTasks',
      name: 'downloadTasks',
      component: runningTasks
    },
    {
      path: '/serverTasks',
      name: 'serverTasks',
      component: servingTasks
    },
    {
      path: '/pausingTasks',
      name: 'pausingTasks',
      component: pausingTasks
    },
    {
      path: '/completedTasks',
      name: 'completedTasks',
      component: completedTasks
    }
  ]
})

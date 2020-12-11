import Vue from 'vue'
import Vuex from 'vuex'

import {DownloadManager} from './utils/downloadManager'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    totTaskData: [],
    completedTaskData: [],
    runningTaskData: [],
    pausedTaskData: [],
    servingTaskData: []
  },
  mutations: {
    addTableData (state, data) {
      let result = state.totTaskData.find((res) => {
        return res.name === data.name
      })
      if (result !== undefined) {
        result = data
        if (data.progress === data.size) {
          let indexR = state.runningTaskData.findIndex((res) => {
            return res.name === name
          })
          if (indexR === -1) return
          state.runningTaskData.splice(indexR, 1)
          state.completedTaskData.push(data)
        }
        return
      }
      state.totTaskData.push(data)
      if (data.hasOwnProperty('server')) state.servingTaskData.push(data)
      else if (data.progress === data.size) state.completedTaskData.push(data)
      else if (data.isPaused) state.pausedTaskData.push(data)
      else state.runningTaskData.push(data)
    },
    update (state, data) {
      let name = data[0]
      let size = data[1]
      let index = state.totTaskData.findIndex((res) => {
        return res.name === name
      })

      if (index === -1) return
      if (size !== undefined && size != null) {
        state.totTaskData[index].progress += size
      }
      console.log('update', parseInt((100 * state.totTaskData[index].progress / state.totTaskData[index].size).toFixed(0)))
      if (state.totTaskData[index].progress === state.totTaskData[index].size) {
        let indexR = state.runningTaskData.findIndex((res) => {
          return res.name === name
        })
        console.log('indexR = ', indexR)
        if (indexR === -1) return
        state.runningTaskData.splice(indexR, 1)
        state.completedTaskData.push(state.totTaskData[index])
      }
    },
    addDownloader (state, data) {
      let index = state.runningTaskData.findIndex((res) => {
        return res.name === data.name
      })
      if (index === -1) return
      state.runningTaskData[index].downloadManager = data.down
    },
    pause (state, data) {
      let index = state.runningTaskData.findIndex((res) => {
        return res.name === data.name
      })
      if (index === -1) return
      if (state.runningTaskData[index].hasOwnProperty('downloadManager')) {
        state.runningTaskData[index].downloadManager.pause()
      }
      state.runningTaskData[index].isPaused = true
      state.pausedTaskData.push(state.runningTaskData.splice(index, 1)[0])
    },
    download (state, data) {
      console.log('pre', state.pausedTaskData.length)
      let index = state.pausedTaskData.findIndex((res) => {
        console.log(res, data, res.name, data.name)
        return res.name === data.name
      })
      console.log('index = ', index, 'pause = ', state.pausedTaskData[0])
      if (index === -1) return
      if (state.pausedTaskData[index].hasOwnProperty('downloadManager')) {
        state.pausedTaskData[index].downloadManager.promiseDownload(false).then(() => {
          console.log('download over')
        }).catch((e, r) => {
          console.log(e, r)
        })
      } else {
        state.pausedTaskData[index].downloadManager = new DownloadManager(data.path, data.store)
        state.pausedTaskData[index].downloadManager.promiseDownload(true).then(() => {
          console.log('download over')
        }).catch((e, r) => {
          console.log(e, r)
        })
      }
      state.pausedTaskData[index].isPaused = false
      state.runningTaskData.push(state.pausedTaskData.splice(index, 1)[0])
    }
  }
})

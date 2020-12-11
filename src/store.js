import Vue from 'vue'
import Vuex from 'vuex'

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
        if (indexR === -1) return
        state.runningTaskData.splice(indexR, 1)
        state.completedTaskData.push(state.totTaskData[index])
      }
    }
  }
})

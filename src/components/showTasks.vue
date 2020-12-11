<template>
<div>
  <el-table
    ref="taskTable"
    :data="taskData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    stripe
    height="530"
    style="width: 100%"
    highlight-current-row
    @current-change="handleCurrentChange"
  >
    <el-table-column
      type="selection"
      width="55" />
    <el-table-column
      prop="name"
      sortable
      label="文件名"
      width="220">
    </el-table-column>
    <el-table-column
      prop="size"
      sortable
      label="大小"
      width="200">
    </el-table-column>
    <el-table-column
      label="进度"
      width="120"
      >
      <template slot-scope="scope">
          <el-progress class="progress" v-if="check(scope.row) === 'success'" :width='50'
                       type="circle" :percentage="Number((100 * scope.row.progress / scope.row.size).toFixed(0))" status="success" />
          <el-progress class="progress" v-else-if="check(scope.row) === 'exception'" :width='50'
                       type="circle" :percentage="Number((100 * scope.row.progress / scope.row.size).toFixed(0))" status="exception" />
          <el-progress class="progress" v-else type="circle" :width='50'
                       :percentage="Number((100 * scope.row.progress / scope.row.size).toFixed(0))" />
      </template>
    </el-table-column>
    <el-table-column
      label="具体进度"
      width="120">
      <template slot-scope="scope">
        {{scope.row.progress.toString().concat(' / ', scope.row.size.toString())}}
      </template>
    </el-table-column>
    <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
const path = require('path')

export default {
  name: 'showTasks',
  props: ['taskData'],
  data () {
    return {
      search: ''
    }
  },
  methods: {
    check: function (row) {
      if (row.progress === row.size) return 'success'
      if (row.isPaused) return 'exception'
      return null
    },
    handleCurrentChange (row) {
      console.log(row)
      if (row == null) return
      if (row.progress < row.size) {
        if (row.isPaused) {
          console.log('isPause')
          this.$store.commit('download', {
            name: row.name,
            path: path.join(this.$db.get('downloadDir'), '/', row.name),
            store: this.$store
          })
        } else {
          this.$store.commit('pause', {
            name: row.name
          })
        }
      }
      this.$refs.taskTable.setCurrentRow()
      console.log('now')
    }
  }
}
</script>

<style scoped>
.progress {

}
</style>

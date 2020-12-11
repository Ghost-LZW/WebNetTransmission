<template>
  <div>
    <el-col :gutter="20">
      <el-row :span="4" id="status">Status</el-row>
      <el-row :span="20">
        <el-menu :default-active="activeIndex" ref="rootMenu" router active-text-color="#ffd04b" background-color="#2667ad" text-color="#ffffff">
          <el-menu-item index="/totTasks"><div class="showNum"><span class="displayNum" id="all" v-text="this.$store.state.totTaskData.length"></span>
                                          </div>全部</el-menu-item>
          <hr />
          <el-menu-item index="/downloadingTasks">
            <div class="showNum"><span class="displayNum" id="downloading" v-text="this.$store.state.runningTaskData.length"></span></div>下载中
          </el-menu-item>
          <el-menu-item index="/serverTasks">
            <div class="showNum"><span class="displayNum" id="serving" v-text="this.$store.state.servingTaskData.length"></span></div>服务中
          </el-menu-item>
          <el-menu-item index="/pausingTasks">
            <div class="showNum"><span class="displayNum" id="pausing" v-text="this.$store.state.pausedTaskData.length"></span></div>已暂停
          </el-menu-item>
          <el-menu-item index="/completedTasks">
            <div class="showNum"><span class="displayNum" id="completed" v-text="this.$store.state.completedTaskData.length"></span></div>已完成
          </el-menu-item>
        </el-menu>
      </el-row>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'AsideBar',
  data: function () {
    return {
      activeIndex: this.$route.path,
      totTasks: 0,
      downloadTasks: 0,
      serverTasks: 0,
      pauseTasks: 0,
      completeTasks: 0
    }
  },
  watch: {
    $route (to) {
      this.$refs.rootMenu.activeIndex = to.path
      console.log(to.path)
    }
  }
}
</script>

<style scoped>
#status {
  width: 44px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 1px;
  margin-left: 68px;
  margin-right: auto;
  margin-top: 40px;
}
.showNum {
  width: 24px;
  height: 20px;
  border-radius: 2px;
  display: inline-block;
  background: #6d81c8;
  margin-right: 10px;
}
el-menu-item {
  text-align: left;
  align-items: flex-start;
}
.displayNum {
  position: relative;
  bottom: 20px;
}
</style>

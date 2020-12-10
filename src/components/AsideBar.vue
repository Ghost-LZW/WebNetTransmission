<template>
<div>
  <el-col :gutter="20">
    <el-row :align="4" id="status">Status</el-row>
    <el-row :align="20">
      <el-menu :default-active="activeIndex" ref="rootMenu" router active-text-color="#ffd04b" background-color="#2667ad">
        <el-menu-item index="/totTasks"><div class="showNum"><span class="displayNum" id="all">0</span></div>全部</el-menu-item>
        <hr />
        <el-menu-item index="/downloadingTasks"><div class="showNum"><span class="displayNum" id="downloading" >0</span></div>下载中</el-menu-item>
        <el-menu-item index="/serverTasks"><div class="showNum"><span class="displayNum" id="serving">0</span></div>服务中</el-menu-item>
        <el-menu-item index="/pausingTasks"><div class="showNum"><span class="displayNum" id="pausing">0</span></div>已暂停</el-menu-item>
        <el-menu-item index="/completedTasks"><div class="showNum"><span class="displayNum" id="completed">0</span></div>已完成</el-menu-item>
      </el-menu>
    </el-row>
  </el-col>
</div>
</template>

<script>
export default {
  name: 'AsideBar',
  data: () => {
    return {
      activeIndex: this.$route.path
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

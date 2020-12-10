<template>
  <div class="nav-bar">
    <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
    <el-row>
      <el-col :span="4">
        <div class="nav_bar_name">
          <a :href="'/index.html'" class="no-decoration">WNT</a>
        </div>
      </el-col>
      <el-col :span="20">
        <el-menu :default-active="activeIndex" mode="horizontal" ref="rootMenu" router>
          <el-menu-item index="/download"><i class="el-icon-house"></i>下载</el-menu-item>
          <el-menu-item index="/server"><i class="el-icon-cloudy"></i>服务</el-menu-item>
          <el-menu-item index="/status"><i class="el-icon-coffee-cup"></i>状态</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HeaderBar',
  data () {
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
.nav-bar {
  height: 60px;
  border-bottom: solid 1px #52abff;
}
.nav_bar_name {
  text-align: left;
  color: #52abff;
  font-size: 22px;
  margin-top: 21px;
  margin-left: 30%;
}
.no-decoration {
  text-decoration: none;
  color: #52abff;
}
</style>

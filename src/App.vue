<template>
  <div id="app">
    <el-container id="group">
      <el-container>
        <el-aside width="200px" class="rectangle">
          <aside-bar />
        </el-aside>
        <el-container>
          <el-header>
            <header-bar />
          </el-header>
          <el-main>
            <router-view style="margin-bottom: 80px" />
          </el-main>
        </el-container>
      </el-container>
      <el-footer :style="{ height }">
        <footer-bar />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import FooterBar from './components/FooterBar'
import HeaderBar from './components/HeaderBar'
import AsideBar from './components/AsideBar'

export default {
  name: 'App',
  props: {
    height: {
      type: String,
      default: '10px'
    }
  },
  components: {
    FooterBar,
    HeaderBar,
    AsideBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-flex;
  display: flex;
}
#group {
  width: 966px;
  height: 702px;
  box-shadow: 0 0 48px #3692d0;
  border-radius: 8px;
}
.rectangle {
  border-radius: 8px;
  background: #2667ad;
}
</style>

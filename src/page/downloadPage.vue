<template>
  <div class="download">
    <el-container>
      <el-row>
        <el-input v-model="ip" placeholder="请输入ip"></el-input>
        <el-input v-model="port" placeholder="请输入端口"></el-input>
      </el-row>
      <el-row>
        <el-button type="primary" round v-on:click="begin_download">开始下载</el-button>
      </el-row>
    </el-container>
  </div>
</template>

<script>
let {download} = require('../utils/downloadManager')

export default {
  name: 'downloadPage',
  data () {
    return {
      ip: '',
      port: ''
    }
  },
  methods: {
    begin_download () {
      download(this.ip, this.port, this.$store).then(r => {
        console.log(r, 'download success')
      })
    }
  }
}
</script>

<style scoped>

</style>

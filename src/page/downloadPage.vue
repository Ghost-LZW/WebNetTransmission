<template>
  <div class="download">
    <el-container>
      <el-row :gutter=20>
        <el-col style="margin-bottom: 20px">
          <el-input v-model="ip" placeholder="请输入ip"></el-input>
        </el-col>
        <el-col>
          <el-input v-model="port" placeholder="请输入端口"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-button id="start" type="primary" round v-on:click="begin_download">开始下载</el-button>
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
#start {
  margin-left: 30px;
  margin-top: 60px;
}
</style>

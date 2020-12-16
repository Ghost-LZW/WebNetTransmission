<template>
  <div class="server">
    <el-container>
      <el-row class="showInput">
        <el-col :align="8">
          <el-input id="show"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10}"
                    placeholder="请选择文件"
                    v-model="textarea">
          </el-input>
        </el-col>
        <el-col :align="16" id="button">
          <el-button type="primary" v-on:click="openFile()" round>选择文件</el-button>
          <el-button type="primary" v-on:click="startServer()" round>开始服务</el-button>
          <input type="file" name="filename" id="open" style="display:none" v-on:change="showRealPath" />
        </el-col>
      </el-row>
      <el-row>
        <el-tag id="ipAddr" v-text="'server on ' + getIPV4Address() + ':' + getPort()"></el-tag>
        <el-col>
          <el-tag>选择端口</el-tag>
          <el-input-number v-model="port" :min="1" :max="65535" label="选择端口"></el-input-number>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import {serverFile} from '../utils/serversManager'
let path = require('path')
let fs = require('fs')

export default {
  data () {
    return {
      textarea: '',
      port: 5785
    }
  },
  methods: {
    openFile: function () {
      document.getElementById('open').click()
    },
    showRealPath: function () {
      document.getElementById('show').value = document.getElementById('open').files[0].path
    },
    startServer: function () {
      if (document.getElementById('show').value != null && document.getElementById('show').value.length !== 0) {
        let res = document.getElementById('show').value
        let fileSize = fs.statSync(res).size
        this.$store.commit('addTableData', {
          name: path.basename(res),
          size: fileSize,
          progress: fileSize,
          isPaused: false,
          server: true
        })
        serverFile(res, this.port)
      }
    },
    getIPV4Address: function () {
      let interfaces = require('os').networkInterfaces()
      for (let devName in interfaces) {
        if (interfaces.hasOwnProperty(devName) && devName === 'WLAN') {
          console.log(devName, interfaces)
          let iface = interfaces[devName]
          for (let i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address
            }
          }
        }
      }
    },
    getPort: function () {
      return this.port
    }
  }
}
</script>

<style scoped>
.showInput {
  align-self: center
}
#button {
  margin-top: 20px;
}
#ipAddr {
  margin-left: 30px;
  margin-bottom: 30px;
}
</style>

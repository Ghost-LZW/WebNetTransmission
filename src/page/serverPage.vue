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
        <el-col :align="16">
          <el-button type="primary" v-on:click="openFile()" round>选择文件</el-button>
          <el-button type="primary" v-on:click="startServer()" round>开始服务</el-button>
          <input type="file" name="filename" id="open" style="display:none" v-on:change="showRealPath" />
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import {serverFile} from '../utils/serversManager'

export default {
  data () {
    return {
      textarea: ''
    }
  },
  methods: {
    openFile: function () {
      document.getElementById('open').click()
    },
    showRealPath: function () {
      document.getElementById('show').value = document.getElementById('open').files[0].path
    },
    startServer: () => {
      if (document.getElementById('show').value != null && document.getElementById('show').value.length !== 0) {
        serverFile(document.getElementById('show').value)
      }
    }
  }
}
</script>

<style scoped>
.showInput {
  align-self: center
}
</style>

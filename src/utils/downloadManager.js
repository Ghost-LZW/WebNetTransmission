const net = require('net')
const fs = require('fs')
const fileManager = require('./FileManager')
const {WorkerPool} = require('./WorkPool')
const constant = JSON.parse(fs.readFileSync('./static/constant.json').toString())
const {EventEmitter} = require('events')
const path = require('path')

console.log(path.dirname(process.execPath))

const downloadDir = path.join(path.dirname(process.execPath) + '/download')

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir)
}

class downloadManager extends EventEmitter {
  constructor (filePath, store) {
    super()
    this.configFile = fs.openSync(filePath + '.json', 'r')
    this.$store = store
    console.log('read success')
    this.config = JSON.parse(fs.readFileSync(this.configFile).toString())
    fs.closeSync(this.configFile)
    this.configFile = filePath + '.json'
    this.file = fs.openSync(filePath + '.ltf', 'w')
    // eslint-disable-next-line no-path-concat
    this.workpool = new WorkerPool('./static/downloadWorker.js', 64)
    this.runTask = {}
    this.on('finish', () => {
      if (Object.getOwnPropertyNames(this.config['tasks']).length === 0 && fs.existsSync(filePath + '.ltf')) {
        console.log(this.$store.state.totTaskData)
        fs.renameSync(filePath + '.ltf', filePath)
        this.workpool.destroy(true)
        this.removeAllListeners('data')
        this.removeAllListeners('fail')
        this.removeAllListeners('finish')
        fs.closeSync(this.file)
      }
    })
    this.on('fail', (msg) => {
      console.log('fail reason : ', msg.msg)
      let data = {'host': msg.host,
        'port': msg.port,
        'task': msg.task,
        'FileName': this.config['FileName'],
        'FileSize': this.config['FileSize']}
      this.workpool.run(data).then((res) => {
        console.log(res)
        this.emit(res['code'], res)
      }).catch(err => {
        console.log('download error : ', err)
      })
    })

    this.on('data', (data) => {
      if (this.runTask.hasOwnProperty(data.task.toString())) {
        fs.writeSync(this.file, data.data, 0, data.size, data.task)
        this.$store.commit('update', [this.config['FileName'], data.size])
        let newTask = data.task + data.size
        let old = this.runTask[data.task.toString()]
        if (old > data.size) {
          this.runTask[newTask.toString()] = old - data.size
          this.config.tasks[newTask.toString()] = old - data.size
        }
        delete this.runTask[data.task.toString()]
        delete this.config.tasks[data.task.toString()]

        this.saveInfo()
        if (!this.runTask.hasOwnProperty(newTask.toString())) {
          this.emit('finish')
          return
        }

        let dataN = {
          'host': data.host,
          'port': data.port,
          'task': newTask,
          'FileName': this.config['FileName'],
          'FileSize': this.config['FileSize']
        }
        this.workpool.run(dataN).then((res) => {
          console.log(res)
          this.emit(res['code'], res)
        }).catch(err => {
          console.log('download error : ', err)
        })

        if (data.hasOwnProperty('addrData')) {
          for (let k in data.addrData) {
            if (data.addrData.hasOwnProperty(k)) {
              if (!(this.config.address.hasOwnProperty(k))) this.config.address[k] = data.addrData[k]
              else {
                let len = data.addrData[k].length
                for (let i = 0; i < len; ++i) {
                  if (this.config.address[k].indexOf(data.addrData[k][i]) === -1) {
                    this.config.address[k].push(data.addrData[k][i])
                    if (this.workpool.getInactiveWorkerId() !== -1) {
                      dataN = {
                        'host': k,
                        'port': data.addrData[k][i],
                        'task': this.findTask(),
                        'FileName': this.config['FileName'],
                        'FileSize': this.config['FileSize']
                      }
                      this.workpool.run(dataN).then((res) => {
                        console.log(res)
                        this.emit(res['code'], res)
                      }).catch(err => {
                        console.log('download error : ', err)
                      })
                    }
                  }
                }
              }
            }
          }
          this.saveInfo()
        }
      }
      if (this.workpool.getInactiveWorkerId() !== -1) {
        let dataN = {
          'host': data.host,
          'port': data.port,
          'task': this.findTask(),
          'FileName': this.config['FileName'],
          'FileSize': this.config['FileSize']
        }
        this.workpool.run(dataN).then((res) => {
          console.log(res)
          this.emit(res['code'], res)
        }).catch(err => {
          console.log('download error : ', err)
        })
      }
    })
  }

  saveInfo () {
    fs.writeFileSync(this.configFile, JSON.stringify(this.config), {flag: 'w'})
  }

  findTask () {
    for (let key in this.config['tasks']) {
      if (this.config['tasks'].hasOwnProperty(key)) {
        if (!(key in this.runTask)) {
          this.runTask[key] = this.config['tasks'][key]
          return Number.parseInt(key)
        }
      }
    }
    let mxTask = ''
    let size = 0
    for (let key in this.runTask) {
      if (this.runTask.hasOwnProperty(key)) {
        if (this.runTask[key] > size) {
          size = this.runTask[key]
          mxTask = key
        }
      }
    }

    if (size === 0) return -1
    let cnt = Math.ceil(size / constant['PartSize'])
    let stay = Math.floor(cnt / 2)
    if (stay === 0) return -1

    let newTask = parseInt(mxTask) + stay * constant['PartSize'] + this.config['tasks'][mxTask] - size
    this.runTask[mxTask] = stay * constant['PartSize']
    this.config['tasks'][mxTask] = stay * constant['PartSize']
    this.runTask[newTask.toString()] = size - stay * constant['PartSize']
    this.config['tasks'][newTask.toString()] = size - stay * constant['PartSize']

    this.saveInfo()
    return newTask
  }

  download () {
    for (let key in this.config.address) {
      if (this.config.address.hasOwnProperty(key)) {
        let len = this.config.address[key].length
        for (let i = 0; i < len; ++i) {
          let data = {'host': key,
            'port': this.config.address[key][i],
            'task': this.findTask(),
            'FileName': this.config['FileName'],
            'FileSize': this.config['FileSize']}
          console.log(data)
          this.workpool.run(data).then((res) => {
            console.log(res)
            this.emit(res['code'], res)
          }).catch(err => {
            console.log('download error : ', err)
          })
        }
      }
    }
  }
}

const receiveFile = (host, port) => {
  let remote = new net.Socket()
  let res = Buffer.alloc(0)
  let val = -1
  remote.on('data', (data) => {
    res = Buffer.concat([res, data], res.length + data.length)
    if (res.length >= 3 && val === -1) {
      val = res.readIntBE(0, 3)
    }
    if (val !== -1 && res.length >= val) {
      remote.destroy()
      let pos = 3
      while (res[pos] !== '\n'.charCodeAt(0)) ++pos
      if (res[++pos] !== '1'.charCodeAt(0)) {
        console.log('error info')
        remote.destroy()
        return
      }
      let nameSize = res[++pos]
      ++pos
      let fileName = res.slice(pos, pos + nameSize).toString()
      pos += nameSize
      let fileSize = res.slice(pos, pos + 6).readIntBE(0, 6)
      console.log(res.slice(pos, pos + 6), fileName, fileSize, nameSize)
      fileManager.createEmptyFile(downloadDir + '/' + fileName + '.ltf', fileSize).then(r => {
        console.log('creat file success', r, host, port)
        return fileManager.saveInfo(downloadDir, fileName, fileSize, host, port)
      }).catch(err => {
        console.log('error : ', err)
      }).then((r) => {
        let res = {name: fileName}
        let info = JSON.parse(fs.readFileSync(downloadDir + '/' + fileName + '.json').toString())
        res.size = info.FileSize
        res.progress = 0
        res.isPaused = false

        this.$store.commit('addTableData', res)
        console.log('save success', r)
        // direct download test -- remove in release
        // eslint-disable-next-line new-cap,no-path-concat
        let down = new downloadManager(downloadDir + '/' + fileName, this.$store)
        down.download()
      }).catch((err) => {
        console.log('error = ', err)
      })
    }
  })

  remote.on('connect', () => {
    let buffer = Buffer.from('LP2P 0.1\n0')
    let infoSize = Buffer.alloc(3)
    infoSize.writeUIntBE(buffer.length + 3, 0, 3)
    buffer = Buffer.concat([infoSize, buffer], infoSize.length + buffer.length)
    remote.write(buffer)
  })

  remote.on('close', (r) => {
    console.log('tcp disconnect', r)
  })

  remote.on('error', err => {
    console.log(err.stack)
  })

  remote.connect(port, host)
}

let download = (host, port, store) => {
  this.$store = store
  return new Promise((resolve) => {
    receiveFile(host, port)
    resolve(true)
  })
}

export {download}

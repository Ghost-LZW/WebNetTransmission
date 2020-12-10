const { isMainThread, parentPort } = require('worker_threads')
const net = require('net')

if (isMainThread) throw new Error('do not run this in main thread')

function download (data) {
  // eslint-disable-next-line one-var
  let host = data['host'], port = data['port'], task = data['task']
  if (task === -1) {
    parentPort.postMessage({'final': true, 'code': 'finish', 'msg': 'over'})
    return
  }
  let remote = new net.Socket()

  remote.on('connect', () => {
    let askMsg = Buffer.from('LP2P 0.1\n2')
    let buffer = Buffer.alloc(1)
    buffer.writeUInt8(data['FileName'].length, 0)
    askMsg = Buffer.concat([askMsg, buffer, Buffer.from(data['FileName'])], askMsg.length + buffer.length + data['FileName'].length)
    buffer = Buffer.alloc(6)
    buffer.writeUIntBE(data['FileSize'], 0, 6)
    askMsg = Buffer.concat([askMsg, buffer], askMsg.length + buffer.length)
    buffer = Buffer.alloc(6)
    buffer.writeUIntBE(task, 0, 6)
    askMsg = Buffer.concat([askMsg, buffer], askMsg.length + buffer.length)
    buffer = Buffer.alloc(3)
    buffer.writeUIntBE(askMsg.length + 3, 0, 3)
    askMsg = Buffer.concat([buffer, askMsg], buffer.length + askMsg.length)

    remote.write(askMsg)
  })

  let res = Buffer.alloc(0)
  let val = -1

  remote.on('data', (dataR) => {
    res = Buffer.concat([res, dataR], res.length + dataR.length)
    if (res.length >= 3 && val === -1) {
      val = res.readIntBE(0, 3)
    }
    if (val !== -1 && res.length >= val) {
      let pos = 3
      remote.destroy()
      while (res[pos] !== '\n'.charCodeAt(0)) ++pos
      if (res[++pos] !== '3'.charCodeAt(0)) {
        console.log('error data')
        remote.destroy()
        parentPort.postMessage({'final': false, 'code': 'fail', 'msg': 'download error', host, port, task})
        return
      }
      let nameSize = res[++pos]
      ++pos
      let fileName = res.slice(pos, pos + nameSize).toString()
      pos += nameSize
      if (fileName !== data['FileName']) {
        remote.destroy()
        parentPort.postMessage({'final': false, 'code': 'fail', 'msg': 'download error : filename error', host, port, task})
        return
      }
      let fileSize = res.readUIntBE(pos, 6)
      if (fileSize !== data['FileSize']) {
        remote.destroy()
        parentPort.postMessage({'final': false, 'code': 'fail', 'msg': 'download error : filesize error', host, port, task})
        return
      }
      pos += 6
      let partSize = res.slice(pos, pos + 3).readUIntBE(0, 3)
      pos += 3
      let postMsg = {'final': false, 'code': 'data', 'msg': 'download success', host, port, task}
      postMsg['data'] = res.slice(pos, pos + partSize)
      postMsg['size'] = partSize
      pos += partSize
      if (pos < val) {
        let addrData = {}
        let addrCount = res[pos++]
        for (let i = 0; i < addrCount; ++i) {
          let ip = res.slice(pos, pos + 6)
          pos += 6
          let hostRes = ip.slice(0, 4).join('.')
          let portRes = ip.slice(4, 6).readUIntBE(0, 2)
          if (hostRes in addrData && !(portRes in addrData[hostRes])) addrData[hostRes].push(portRes)
          else addrData[hostRes] = [portRes]
        }
        postMsg['addrData'] = addrData
      }
      parentPort.postMessage(postMsg)
    }
  })

  remote.on('close', (r) => {
    console.log(r, 'tcp disconnect')
  })

  remote.connect(port, host)
}

parentPort.on('message', (data) => {
  download(data)
})

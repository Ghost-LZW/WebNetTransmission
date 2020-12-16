let net = require('net')
const fs = require('fs')
const path = require('path')
const constant = JSON.parse(fs.readFileSync('./static/constant.json').toString())

let resSet = []

let server = net.createServer(
  (connection) => {
    console.log('tcp get in')

    connection.on('end', () => {
      console.log('tcp disconnect')
    })

    connection.on('data', async data => {
      let recvRes = data
      console.log(recvRes)
      let pos = 3
      while (recvRes[pos] !== '\n'.charCodeAt(0)) ++pos
      ++pos
      console.log(pos)
      let buffer
      let res = resSet.slice(-1).toString()
      switch (recvRes[pos]) {
        case '0'.charCodeAt(0) :
          console.log('get in')
          let info = Buffer.from('LP2P 0.1\n1')
          buffer = Buffer.alloc(1)
          buffer.writeUInt8(Buffer.from(path.basename(res)).length, 0)
          console.log(Buffer.from(path.basename(res)).length)
          info = Buffer.concat([info, buffer, Buffer.from(path.basename(res))],
            info.length + buffer.length + Buffer.from(path.basename(res)).length)
          buffer = Buffer.alloc(6)
          buffer.writeUIntBE(fs.statSync(res).size, 0, 6)
          info = Buffer.concat([info, buffer], info.length + buffer.length)
          buffer = Buffer.alloc(3)
          buffer.writeUIntBE(info.length + 3, 0, 3)
          info = Buffer.concat([buffer, info], buffer.length + info.length)
          console.log(info, info.length)
          connection.setNoDelay(true)
          connection.write(info)
          break
        case '2'.charCodeAt(0) :
          console.log('in 2')
          let nameSize = recvRes[++pos]
          ++pos
          let fileName = recvRes.slice(pos, pos + nameSize).toString()
          let index
          if ((index = resSet.findIndex((res) => {
            return path.basename(res) === fileName
          })) !== -1) {
            res = resSet[index]
          }
          pos += nameSize
          let fileSize = recvRes.slice(pos, pos + 6).readIntBE(0, 6)
          console.log(recvRes.slice(pos, pos + 6))

          pos += 6
          let aimPos = recvRes.slice(pos, pos + 6).readIntBE(0, 6)

          console.log(fileName, fileSize, aimPos)

          let dataFile = Buffer.from('LP2P 0.1\n3')
          buffer = Buffer.alloc(1)
          buffer.writeUInt8(Buffer.from(path.basename(res)).length, 0)
          dataFile = Buffer.concat([dataFile, buffer, Buffer.from(path.basename(res))],
            dataFile.length + buffer.length + Buffer.from(path.basename(res)).length)
          buffer = Buffer.alloc(6)
          buffer.writeUIntBE(fs.statSync(res).size, 0, 6)
          dataFile = Buffer.concat([dataFile, buffer], dataFile.length + buffer.length)

          let gd = Buffer.alloc(constant['PartSize'])
          let id = fs.openSync(res, 'r')
          let partSize = fs.readSync(id, gd, 0, constant['PartSize'], aimPos)
          buffer = Buffer.alloc(3)
          buffer.writeUIntBE(partSize, 0, 3)
          dataFile = Buffer.concat([dataFile, buffer], dataFile.length + buffer.length)

          dataFile = Buffer.concat([dataFile, gd], dataFile.length + partSize)

          buffer = Buffer.alloc(3)
          buffer.writeUIntBE(dataFile.length + 3, 0, 3)
          dataFile = Buffer.concat([buffer, dataFile], buffer.length + dataFile.length)

          console.log(dataFile, dataFile.length, partSize)

          connection.setNoDelay(true)
          connection.write(dataFile)
          break
      }
    })

    connection.on('error', (err) => {
      console.log(err.toString())
      console.log(err.stack, connection.destroyed)
    })

    console.log('remote information : ', connection.remoteAddress, connection.remotePort, connection.remoteFamily)
  }
)

server.on('error', (err) => {
  console.log('server error : ')
  console.log(err)
})

server.setMaxListeners(16)

let beginServer = (resource, port) => {
  resSet.push(resource)
  if (!server.listening) {
    server.listen(port, () => {
      console.log('tcp start')
    })
  }
}

let serverFile = (res, port) => {
  return new Promise((resolve) => {
    beginServer(res, port)
    resolve(true)
  })
}

export {serverFile}

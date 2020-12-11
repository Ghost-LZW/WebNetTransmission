const fs = require('fs')

const createEmptyFile = (fileName, size) => {
  return new Promise((resolve, reject) => {
    if (size < 0) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Error: negative size')
      return
    }

    setTimeout(() => {
      let fd
      try {
        fd = fs.openSync(fileName, 'w')
        if (size > 0) {
          fs.writeSync(fd, Buffer.alloc(1), 0, 1, size - 1)
        }
        fs.closeSync(fd)

        resolve(true)
      } catch (error) {
        reject(error, false)
      }
    }, 0)
  })
}

const saveInfo = (filePre, fileName, fileSize, host, port) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let res = {}
      res['FileName'] = fileName
      res['FileSize'] = fileSize
      console.log('host = ', host)
      res['address'] = {}
      res['address'][host] = [port]
      res['tasks'] = {'0': fileSize}
      try {
        let infoFD = fs.openSync(filePre + '/' + fileName + '.json', 'w')
        console.log(JSON.stringify(res))
        fs.writeFileSync(infoFD, JSON.stringify(res))
        resolve(true)
      } catch (error) {
        reject(error, false)
      }
    }, 0)
  })
}

export {createEmptyFile, saveInfo}

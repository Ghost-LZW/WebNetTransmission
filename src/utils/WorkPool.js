/*******
 * from: https://blog.skk.moe/post/say-hello-to-nodejs-worker-thread/
 * by: Sukka
 */

const {Worker} = require('worker_threads')
const { length: cpusLength } = require('os').cpus()

class WorkerPool {
  constructor (workerPath, numberOfThreads = cpusLength) {
    if (numberOfThreads < 1) {
      throw new Error('Number of threads should be greater or equal than 1!')
    }

    this.shutdown = false

    this.workerPath = workerPath
    this.numberOfThreads = numberOfThreads

    // 任务队列
    this._queue = []
    // Worker 索引
    this._workersById = {}
    // Worker 激活状态索引
    this._activeWorkersById = {}

    // 创建 Workers
    for (let i = 0; i < this.numberOfThreads; i++) {
      this._workersById[i] = new Worker(this.workerPath)
      // 将这些 Worker 设置为未激活状态
      this._activeWorkersById[i] = false
    }
  }

  resume () {
    this.shutdown = false
    this._workersById = {}
    for (let i = 0; i < this.numberOfThreads; i++) {
      this._workersById[i] = new Worker(this.workerPath)
      // 将这些 Worker 设置为未激活状态
      this._activeWorkersById[i] = false
    }
  }

  getInactiveWorkerId () {
    if (this.shutdown) return -1
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (!this._activeWorkersById[i]) return i
    }
    return -1
  }

  getInactiveWorkerIdCount () {
    let cnt = 0
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (!this._activeWorkersById[i]) ++cnt
    }
    return cnt
  }

  runWorker (workerId, taskObj) {
    const worker = this._workersById[workerId]

    // 当任务执行完毕后执行
    const doAfterTaskIsFinished = () => {
      // 去除所有的 Listener，不然一次次添加不同的 Listener 会 OOM 的
      worker.removeAllListeners('message')
      worker.removeAllListeners('error')
      // 将这个 Worker 设为未激活状态
      this._activeWorkersById[workerId] = false
      if (this._queue.length) {
        // 任务队列非空，使用该 Worker 执行任务队列中第一个任务
        this.runWorker(workerId, this._queue.shift())
      }
    }

    // 将这个 Worker 设置为激活状态
    this._activeWorkersById[workerId] = true
    // 设置两个回调，用于 Worker 的监听器
    const messageCallback = result => {
      taskObj.cb(null, result)
      doAfterTaskIsFinished()
    }
    const errorCallback = error => {
      taskObj.cb(error)
      doAfterTaskIsFinished()
    }

    // 为 Worker 添加 'message' 和 'error' 两个 Listener
    worker.once('message', messageCallback)
    worker.once('error', errorCallback)
    // 将数据传给 Worker 供其获取和执行
    worker.postMessage(taskObj.data)
  }

  run (data) {
    if (this.shutdown) {
      return new Promise((resolve, reject) => {
        reject(new Error('workpool is shutdown already'))
      })
    }
    // Promise 是个好东西
    return new Promise((resolve, reject) => {
      // 调用 getInactiveWorkerId() 获取一个空闲的 Worker
      const availableWorkerId = this.getInactiveWorkerId()

      const taskObj = {
        data,
        cb: (error, result) => {
          // 虽然 Workers 需要使用 Listener 和 Callback，但这不能阻止我们使用 Promise，对吧？
          // 不，你不能 util.promisify(taskObj) 。人不能，至少不应该。
          if (error) reject(error)
          return resolve(result)
        }
      }

      if (availableWorkerId === -1) {
        // 当前没有空闲的 Workers 了，把任务丢进队列里，这样一旦有 Workers 空闲时就会开始执行。
        this._queue.push(taskObj)
        return null
      }
      // 有一个空闲的 Worker，用它执行任务
      this.runWorker(availableWorkerId, taskObj)
    })
  }

  destroy (force = false) {
    this.shutdown = true
    this._queue.splice(0, this._queue.length)
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (this._activeWorkersById[i] && !force) {
        // 通常情况下，不应该在还有 Worker 在执行的时候就销毁它，这一定是什么地方出了问题，所以还是抛个 Error 比较好
        // 不过保留一个 force 参数，总有人用得到的
        throw new Error(`The worker ${i} is still runing!`)
      }
      this._activeWorkersById[i] = false
      // 销毁这个 Worker
      this._workersById[i].terminate()
    }
  }
}

export {WorkerPool}

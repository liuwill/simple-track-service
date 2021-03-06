const Emitter = require('events')

class MockRequestEmitter extends Emitter {
  constructor(options) {
    super()

    this.options = options
    this.headers = null
  }

  setEncoding(encoding) {
    this.encoding = encoding
  }

  write(body) {
    this.body = body
  }

  end() {
    const options = this.options
    if (options.mock === 200) {
      this.emit('data', 'ok')
      this.emit('end')
    } else if (options.mock === 500) {
      this.emit('error', new Error())
    } else if (options.data) {
      this.emit('data', JSON.stringify(options.data))
      this.emit('end')
    } else if (options.headers) {
      this.emit('data', JSON.stringify(options.headers))
      this.emit('end')
    } else {
      this.emit('error', new Error())
    }
  }
}

const mockHttpRequest = (options, handle) => {
  const emitter = new MockRequestEmitter(options)

  handle(emitter)
  return emitter
}

export default {
  mockHttpRequest,
  MockRequestEmitter,
}

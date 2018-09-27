import chai from 'chai'
// import sinon from 'sinon'
const Emitter = require('events')
import httpClient from '../../app/httpClient'

const { expect, assert } = chai

class DataEmitter extends Emitter {
  constructor(options) {
    super()

    this.options = options
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
    }
  }
}

const mockHttpRequest = (options, handle) => {
  const emitter = new DataEmitter(options)
  handle(emitter)
  return emitter
}

httpClient.Request.setClient(mockHttpRequest)

describe('httpClient mock and test', function () {
  it('should get data', function (done) {
    httpClient.get('/200', { mock: 200 }).then(response => {
      assert.isNotNull(response)
      console.log(response)
      done()
    }).catch(err => {
      console.error(err)
      done()
    })
  })
})

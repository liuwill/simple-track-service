import http from 'http'
import querystring from 'querystring'
import url from 'url'

function parseUrl(raw) {
  return url.parse(raw)
}

class Request {
  constructor(resolve, reject) {
    this.resolve = resolve
    this.reject = reject

    this.req = null
    this.data = null
    this.res = null
  }

  installRequest(req) {
    this.req = req
  }

  call(method) {
    const that = this
    return (...arg) => {
      that[method](...arg)
    }
  }

  receive(chunk) {
    this.data = chunk
  }

  end() {
    this.resolve({
      request: this.req,
      response: this.res,
      data: this.data,
    })
  }

  error(e) {
    console.error(`problem with request: ${e.message}`)
    this.reject(e)
  }
}

function requestPromise(options) {
  if (!options) {
    throw new Error('options is empty')
  } else if (!options.url) {
    throw new Error('missing url')
  }

  const urlData = parseUrl(options.url)
  return new Promise((resolve, reject) => {
    const request = new Request(resolve, reject)

    const req = http.request(Object.assign({}, urlData, options), (res) => {
      // console.log(`STATUS: ${res.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
      res.setEncoding('utf8')

      let data = null
      res.on('data', request.call('receive'))
      res.on('end', request.call('end'))
    })
    request.installRequest(req)
    req.on('error', request.call('error'))

    // write data to request body
    let requestData = options.data || options.body
    let requestBody = ''
    if (requestData && typeof requestData === 'object') {
      requestBody = querystring.stringify(requestData)
    }

    req.write(requestBody)
    req.end()
  })
}

export default {
  post: async (options) => {
    return requestPromise(Object.assign({}, options, {
      method: 'POST',
    }))
  },
  get: async (link, options) => {
    return requestPromise(Object.assign({
      url: link,
    }, options, {
      method: 'GET',
    }))
  },
  request: async(...args) => {
    return requestPromise(...args)
  }
}

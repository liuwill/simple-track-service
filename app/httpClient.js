import http from 'http'
import https from 'https'
import querystring from 'querystring'
import url from 'url'

function parseUrl(raw) {
  return url.parse(raw)
}

class Request {
  constructor(resolve, reject, options) {
    this.resolve = resolve
    this.reject = reject
    this.options = options
    this.headers = {}

    this.body = this.buildBody(options)

    this.req = null
    this.data = null
    this.res = null

    this.urlData = parseUrl(options.url)
  }

  installRequest(req) {
    this.req = req
  }

  getProtocol() {
    let protocol = 'http'
    if (this.urlData.protocol && this.urlData.protocol.startsWith('https')) {
      protocol = 'https'
    }
    return protocol
  }

  getOptions() {
    const headers = Object.assign({}, this.options.headers, this.headers)
    return Object.assign({}, this.urlData, this.options, {
      headers,
    })
  }

  buildBody(options) {
    let requestData = options.data || options.body || ''
    const rawHeaders = options.headers || {}

    let requestBody = requestData
    if (!requestData || typeof requestData !== 'object') {
      return requestBody
    }

    if (rawHeaders['Content-Type'] && rawHeaders['Content-Type'].indexOf('json') >= 0) {
      requestBody = JSON.stringify(requestData)
    } else {
      requestBody = querystring.stringify(requestData)
      this.setHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    this.setHeader('Content-Length', Buffer.byteLength(requestBody))

    return requestBody
  }

  getBody() {
    return this.body
  }

  setHeader(key, val) {
    this.headers[key] = val
  }

  handle(callback) {
    return (res) => {
      this.res = res
      callback(res)
    }
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
    this.reject({
      request: this.req,
      response: this.res,
      error: e,
    })
  }
}

Request.client = {
  http: http.request,
  https: https.request,
}
Request.setClient = (protocol, client) => {
  Request.client[protocol] = client
}
Request.getClient = (protocol) => {
  return Request.client[protocol]
}

function requestPromise(options) {
  if (!options) {
    throw new Error('options is empty')
  } else if (!options.url) {
    throw new Error('missing url')
  }

  return new Promise((resolve, reject) => {
    const request = new Request(resolve, reject, options)

    const requestClient = Request.getClient(request.getProtocol())
    const req = requestClient(request.getOptions(), request.handle((res) => {
      // console.log(`STATUS: ${res.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
      res.setEncoding('utf8')

      let data = null
      res.on('data', request.call('receive'))
      res.on('end', request.call('end'))
    }))
    request.installRequest(req)
    req.on('error', request.call('error'))

    // write data to request body
    const requestBody = request.getBody()
    req.write(requestBody)
    req.end()
  })
}

export default {
  Request,
  post: async (link, options) => {
    return requestPromise(Object.assign({
      url: link,
    }, options, {
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
  request: async (...args) => {
    return requestPromise(...args)
  }
}

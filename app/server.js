import http from 'http'
import fs from 'fs'
import querystring from 'querystring'
import url from 'url'
import statuses from 'statuses'
import validator from 'validator'

const Emitter = require('events')

export default class TrackServer extends Emitter {
  constructor() {
    super()

    this.routers = []

    this.init()
    this.server = http.createServer(this.createHandle())
    this.server.on('clientError', (err, socket) => {
      this.emit('error', err, socket)
    })
  }

  init() {
    this.on('error', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })
  }

  use() {
    var args = Array.prototype.slice.call(arguments)
  }

  route(method, path, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('router hanlder must be a function!')
    }

    if (!['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD', 'PATCH'].includes(method.toUpperCase())) {
      throw new TypeError('Methed can not be resolve!')
    }

    path = path.toLowerCase()
    const pathPieces = []
    const pathMeta = path.split('/').map((item, index) => {
      if (item.startsWith(':')) {
        pathPieces.push('[a-z0-9\.-\_]+')
        return {
          pattern: '[a-z0-9\.-\_]+',
          name: item.substr('1'),
          pos: index,
        }
      }

      pathPieces.push(item)
      return {
        name: item,
      }
    })

    const pattern = pathPieces.join('/')
    const router = {
      pattern,
      meta: pathMeta,
      handle: fn,
      method,
    }
    this.routers.push(router)

    console.log(router)
  }

  parseBody(header, body) {

  }

  parseQuery(query) {

  }

  buildContext(req, res) {
    const context = {}
    context.response = res
    context.request = req
    context.method = req.method
    context.header = req.headers
    context.state = {}

    const ctxUrl = url.parse(req.url)
    const rawQuery = ctxUrl.query

    context.query = querystring.parse(rawQuery)
    context.request.query = context.query
    context.pathname = ctxUrl.pathname
    // console.log(context)
    return context
  }

  createHandle() {
    return (req, res) => {
      const context = this.buildContext(req, res)

      let fn = Promise.resolve()
      for (let i = 0; i < this.routers.length; i++) {
        const router = this.routers[i]
        if (!context.pathname.match(router.pattern) || context.method !== router.method) {
          continue
        }

        fn = Promise.resolve(router.handle(context))
        break
      }

      fn.then(() => this.response(context)).catch(err => {
        throw err
      })
    }
  }

  response(context) {
    let body = context.body
    const code = context.status
    const response = context.response
    // ignore body
    if (statuses.empty[code]) {
      // strip headers
      context.body = null
      return response.end()
    }

    if (context.method === 'HEAD') {
      if (!response.headersSent && validator.isJSON(body)) {
        context.length = Buffer.byteLength(JSON.stringify(body))
      }
      return response.end()
    }

    if (body === null) {
      body = context.message || String(code)
      if (!context.headersSent) {
        context.type = 'text'
        context.length = Buffer.byteLength(body)
      }
      return response.end(body)
    }

    if (Buffer.isBuffer(body) || typeof body === 'string') {
      return response.end(body)
    }

    body = JSON.stringify(body)
    if (!response.headersSent) {
      context.length = Buffer.byteLength(body)
    }

    response.end(body)
  }

  listen(port) {
    this.server.listen(port)
  }
}

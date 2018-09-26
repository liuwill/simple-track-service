import http from 'http'
import fs from 'fs'
import querystring from 'querystring'
import url from 'url'
import statuses from 'statuses'
import validator from 'validator'

import serverUtils from './utils'
import Router from './router'

const Emitter = require('events')

export default class TrackServer extends Emitter {
  constructor() {
    super()

    this.routers = []
    this.router = new Router()
    this.middleware = []

    // this.init()
    this.server = http.createServer(this.createHandle())
    // this.server.on('clientError', (err, socket) => {
    //   this.emit('error', err, socket)
    // })
  }

  // init() {
  //   this.on('error', (err, socket) => {
  //     socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  //   })
  // }

  /*
  use() {
    var args = Array.prototype.slice.call(arguments)
  }
  */

  parseQuery(query) {
    const ctxUrl = url.parse(query)
    const rawQuery = ctxUrl.query

    return {
      query: querystring.parse(rawQuery),
      pathname: ctxUrl.pathname,
    }
  }

  buildRequest(req) {
    return Object.assign({ 'content-type': req.headers['content-type'] }, req)
  }

  buildContext(req, res) {
    const context = {}
    context.response = Object.assign({}, res)
    context.request = this.buildRequest(req)
    context.res = res
    context.req = req

    context.method = req.method
    context.header = req.headers

    context.state = {}

    const requestQuery = this.parseQuery(req.url)
    context.query = requestQuery.query
    context.request.query = requestQuery.query
    context.pathname = requestQuery.pathname
    return context
  }

  createHandle() {
    return (req, res) => {
      const context = this.buildContext(req, res)

      let fn = this.router.find(context, context.method, context.pathname)
      if (!fn) {
        res.statusCode = 404
        res.statusMessage = 'Not Found'
        res.end()
        return
      }

      fn.then(() => this.handleResponse(context)).catch(err => {
        res.statusCode = 500
        res.statusMessage = err.message
        res.end()
      })
    }
  }

  respond(context, body) {
    const response = context.res

    if (context.type) {
      response.setHeader('Content-Type', context.type)
    } else if (body && validator.isJSON(body)) {
      response.setHeader('Content-Type', 'application/json')
    } else {
      response.setHeader('Content-Type', 'text/plain')
    }
    return response.end(body)
  }

  handleResponse(context) {
    let body = context.body
    const code = context.status
    const response = context.response
    // ignore body
    if (statuses.empty[code]) {
      // strip headers
      context.body = null
      return this.respond(context)
    }

    if (context.method === 'HEAD') {
      if (!response.headersSent && serverUtils.isJSON(body)) {
        context.length = Buffer.byteLength(JSON.stringify(body))
      }
      return this.respond(context)
    }

    if (body == null) {
      body = context.message || String(code)
      if (!context.headersSent) {
        context.type = 'text'
        context.length = Buffer.byteLength(body)
      }
      return this.respond(context, body)
    }

    if (Buffer.isBuffer(body) || typeof body === 'string') {
      return this.respond(context, body)
    }

    body = JSON.stringify(body)
    if (!response.headersSent && body) {
      context.length = Buffer.byteLength(body)
    }

    return this.respond(context, body)
  }

  listen(...args) {
    return this.server.listen(...args)
  }
}

TrackServer.prototype.route = function(method, path, fn) {
  this.router.route(method, path, fn)
}

Router.ALLOW_METHODS.forEach(item => {
  let key = item.toLowerCase()
  TrackServer.prototype[key] = function(path, handlers) {
    return this.router[key](path, handlers)
  }
})


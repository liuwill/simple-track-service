const ALLOW_METHODS = ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD', 'PATCH']

export default class Router {
  constructor() {
    this.routers = []
  }

  parseParams(pathname, meta) {
    const pathUnit = pathname.split('/')
    const params = {}
    for (let i = 0; i < pathUnit.length; i++) {
      if (i < meta.length && meta[i].pattern) {
        const name = meta[i].name
        params[name] = pathUnit[i]
      }
    }

    return params
  }

  find(context, method, pathname) {
    let fn = Promise.resolve()
    let isExist = false
    for (let i = 0; i < this.routers.length; i++) {
      const router = this.routers[i]
      if (!pathname.match(router.pattern) || method !== router.method) {
        continue
      }

      context.params = this.parseParams(context.pathname, router.meta)
      fn = Promise.resolve(router.handle(context))
      isExist = true
      break
    }

    if (!isExist) {
      return null
    }
    return fn
  }

  route(method, path, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('router hanlder must be a function!')
    }

    if (!ALLOW_METHODS.includes(method.toUpperCase())) {
      throw new TypeError('Methed can not be resolve!')
    }

    const META_REGEX = '[a-z0-9-\_]+'
    path = path.toLowerCase()
    const pathPieces = []
    const pathMeta = path.split('/').map((item, index) => {
      if (item.startsWith(':')) {
        pathPieces.push(META_REGEX)
        return {
          pattern: META_REGEX,
          name: item.substr('1'),
          pos: index,
        }
      }

      pathPieces.push(item)
      return {
        name: item,
      }
    })

    const pattern = new RegExp(pathPieces.join('/') + '$')

    const router = {
      pattern,
      meta: pathMeta,
      handle: fn,
      method,
    }
    this.routers.push(router)
  }
}

Router.ALLOW_METHODS = ALLOW_METHODS

ALLOW_METHODS.forEach(item => {
  let key = item.toLowerCase()
  Router.prototype[key] = function(path, handlers) {
    return this.route(item, path, handlers)
  }
})

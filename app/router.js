import serverUtils from './utils'

const ALLOW_METHODS = ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD', 'PATCH']
const META_REGEX = '[a-z0-9-\_]+'

export default class Router {
  constructor() {
    this.routers = []
  }

  // parseParams(pathname, meta) {
  //   const pathUnit = pathname.split('/')
  //   const params = {}
  //   for (let i = 0; i < pathUnit.length; i++) {
  //     if (i < meta.length && meta[i].pattern) {
  //       const name = meta[i].name
  //       params[name] = pathUnit[i]
  //     }
  //   }

  //   return params
  // }

  find(context, method, pathname) {
    let fn = null
    for (let i = 0; i < this.routers.length; i++) {
      const router = this.routers[i]
      if (!pathname.match(router.pattern)) {
        continue
      } else if (method === 'OPTIONS') {
        context.status = 200
        context.body = ''
        context.setHeader('Allow', ALLOW_METHODS.join(', '))
        fn = Promise.resolve()
        break
      } else if (method !== router.method) {
        continue
      }

      context.params = serverUtils.parseParams(context.pathname, router.meta)
      fn = Promise.resolve(router.handle(context))
    }

    return fn
  }

  register(method, path, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('router hanlder must be a function!')
    }

    if (!ALLOW_METHODS.includes(method.toUpperCase())) {
      throw new TypeError('Methed can not be resolve!')
    }

    path = path.toLowerCase()
    const pathPieces = []
    const pathMeta = path.split('/').map((item, index) => {
      let metaData = { name: item }

      if (item.startsWith(':')) {
        pathPieces.push(META_REGEX)
        Object.assign(metaData, {
          pattern: META_REGEX,
          name: item.substr('1'),
          pos: index,
        })
      } else {
        pathPieces.push(item)
      }

      return metaData
    })

    const pattern = new RegExp(pathPieces.join('/') + '$')
    const router = this.buildRouter(method, pattern, pathMeta, fn)
    this.routers.push(router)
  }

  buildRouter(method, pattern, meta, handle) {
    return {
      pattern,
      meta,
      handle,
      method,
    }
  }
}

Router.ALLOW_METHODS = ALLOW_METHODS

ALLOW_METHODS.forEach(method => {
  let key = method.toLowerCase()
  Router.prototype[key] = function (path, handlers) {
    return this.register(method, path, handlers)
  }
})

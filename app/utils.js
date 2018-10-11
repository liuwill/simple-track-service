const META_TYPES = {
  DEFAULT: Symbol('DEFAULT'),
  PATTERN: Symbol('PATTERN'),
}

export default {
  getIp: (header) => {
    if (!header) {
      header = {}
    }

    let ip = header['x-real-ip'] || ""
    ip = ip && ip.split(',')[0]
    const isRealIp = (/^\d+\.\d+.\d+.\d+$/).test(ip)

    if (!isRealIp) { ip = '127.0.0.1' }
    return ip
  },
  isJSON: (data) => {
    if (!data || typeof data !== 'object' && typeof data !== 'number' || Buffer.isBuffer(data)) {
      return false
    }
    return true
  },
  META_TYPES,
  parseParams(pathname, meta) {
    const pathUnit = pathname.split('/')
    const params = {}
    for (let i = 0; i < pathUnit.length; i++) {
      if (i < meta.length && meta[i].pattern && meta[i].type === META_TYPES.PATTERN) {
        const name = meta[i].name
        params[name] = pathUnit[i]
      }
    }

    return params
  },
  bindRegister(methods, classFunc) {
    methods.forEach(method => {
      let key = method.toLowerCase()
      classFunc.prototype[key] = function (path, handlers) {
        return this.register(method, path, handlers)
      }
    })
  },
}

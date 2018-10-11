import serverUtils from './utils'

const ALLOW_METHODS = ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD', 'PATCH']
const NODE_TYPES = {
  DEFAULT: Symbol('DEFAULT'),
  PATTERN: Symbol('PATTERN'),
}

class TreeNode {
  constructor() {
    this.start = ''
    this.current = ''
    this.children = []

    this.handlers = {}
    this.type = NODE_TYPES.DEFAULT
    this.methods = []
    this.meta = ''
    this.path = ''
  }

  getMethods() {
    return this.methods
  }

  hasMethod(method) {
    return this.methods.includes(method)
  }

  addHandler(method, fn, pathMeta) {
    method = method && method.toUpperCase()
    if (!method || this.handlers[method]) {
      throw new Error('method has been registered')
    }

    this.methods.push(method)
    this.handlers[method] = fn
    this.meta = pathMeta
  }
}

TreeNode.InitRouteNode = function () {
  return new TreeNode()
}

export default class TreeRouter {
  constructor() {
    this.tree = TreeNode.InitRouteNode()
  }

  register(method, path, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('router handler must be a function!')
    }

    if (!ALLOW_METHODS.includes(method.toUpperCase())) {
      throw new TypeError('Method can not be resolve!')
    }

    path = path.toLowerCase()
    const pathPieces = []
    const pathMeta = path.split('/').map((item, index) => {
      let metaData = {
        pattern: item,
        name: item,
        type: serverUtils.META_TYPES.DEFAULT
      }

      if (item.startsWith(':')) {
        pathPieces.push('*')
        Object.assign(metaData, {
          type: serverUtils.META_TYPES.PATTERN,
          pattern: '*',
          name: item.substr('1'),
          pos: index,
        })
      } else {
        pathPieces.push(item)
      }

      return metaData
    })

    this._insertNode(pathMeta, method, path, fn)
  }

  _insertNode(pathMeta, method, path, fn) {
    let stack = [
      this.tree,
    ]

    let keyword = pathMeta.reduce((result, current) => {
      return result + current.pattern
    }, '')
    let pos = 0 // meta的位置
    let isMatch = false
    const ll = keyword.length

    let top = 0
    let currentNode = this.tree
    while (top < stack.length) {
      currentNode = stack[top++]

      for (let index = 0; index < currentNode.children.length; index++) {
        let node = currentNode.children[index]
        if (node.start !== keyword.substr(pos, 1)) {
          continue
        }

        const currentPattern = node.current

        let inner = 0
        let fullMatch = true

        for (let i = 0; i < currentPattern.length; i++) {
          if (pos + i > ll - 1 || keyword.substr(pos + i, 1) != currentPattern.substr(i, 1)) {
            fullMatch = false
            break
          }
          inner++
        }

        if (inner > 0 && fullMatch) {
          currentNode = node
          pos += inner

          stack.push(node)
          break
        } else if (inner > 0) {
          node.start = currentPattern.substr(inner, 1)
          node.current = currentPattern.substr(inner)

          let newNode = TreeNode.InitRouteNode()
          newNode.start = keyword.substr(pos, 1)
          newNode.current = keyword.substr(pos, inner)
          newNode.children.push(node)

          if (pos + inner < ll - 1) {
            let extraNode = TreeNode.InitRouteNode()
            extraNode.start = keyword.substr(pos + inner, 1)
            extraNode.current = keyword.substr(pos + inner)
            extraNode.addHandler(method, fn, pathMeta)

            newNode.children.push(extraNode)

          }
          currentNode.children[index] = newNode
        }

        isMatch = true
        break
      }
    }

    if (isMatch) {
      return
    }

    let currentPattern = keyword.substr(pos)
    if (!currentPattern) {
      currentNode.addHandler(method, fn, pathMeta)
    } else {
      let newNode = TreeNode.InitRouteNode()
      newNode.start = keyword.substr(pos, 1)
      newNode.current = keyword.substr(pos)
      newNode.meta = pathMeta
      newNode.addHandler(method, fn, pathMeta)

      currentNode.children.push(newNode)
    }
  }

  find(context, method, pathname) {
    let fn = null
    method = method.toUpperCase()

    let treeNode = this._searchNode(pathname)
    if (!treeNode) {
      return fn
    }

    if (method === 'OPTIONS') {
      context.status = 200
      context.body = ''
      context.setHeader('Allow', treeNode.getMethods().join(', '))
      fn = Promise.resolve()
      return fn
    } else if (!treeNode.hasMethod(method)) {
      return fn
    }

    context.params = serverUtils.parseParams(pathname, treeNode.meta)
    fn = Promise.resolve(treeNode.handlers[method](context))
    // console.log(context)
    return fn
  }

  _searchNode(pathname) {
    // console.log('======================')
    let currentNode = this.tree
    let mark = false

    for (let i = 0; i < pathname.length;) {
      mark = false
      if (pathname.substr(i, 1) === '/') {
        i++
        continue
      }

      // console.log(currentNode.start, currentNode.current, i, pathname, pathname.substr(i, 1))
      for (let j = 0; j < currentNode.current.length; j++) {
        let letter = currentNode.current.substr(j, 1)
        // if (i >= pathname.length) { // && letter !== '*'
        //   return null
        // }
        if (pathname.substr(i, 1) === '/') {
          i++
        }

        if (letter === '*') {
          while (pathname.substr(i, 1) !== '/' && i < pathname.length) {
            i++
          }
        } else if (letter === pathname.substr(i, 1)) {
          i++
          // } else {
          //   return null
        }
      }

      if (i >= pathname.length - 1) {
        return currentNode
      }

      if (pathname.substr(i, 1) === '/') {
        i++
      }

      // console.log('--', i, pathname, pathname.substr(i, 1))
      for (let k = 0; k < currentNode.children.length; k++) {
        let node = currentNode.children[k]
        if (node.start === pathname.substr(i, 1)) {
          currentNode = node
          mark = true
        } else if (node.start === '*') {
          currentNode = node
          mark = true
        }
      }

      if (!mark) {
        break
      }
    }

    return null
  }
}

TreeRouter.ALLOW_METHODS = ALLOW_METHODS
TreeRouter.NODE_TYPES = NODE_TYPES

ALLOW_METHODS.forEach(method => {
  let key = method.toLowerCase()
  TreeRouter.prototype[key] = function (path, handlers) {
    return this.register(method, path, handlers)
  }
})

const ALLOW_METHODS = ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD', 'PATCH']
const NODE_TYPES = {
  DEFAULT: Symbol('DEFAULT'),
  STRUCTURE: Symbol('STRUCTURE'),
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
      let metaData = { pattern: item, name: item, type: NODE_TYPES.DEFAULT }

      if (item.startsWith(':')) {
        pathPieces.push('*')
        Object.assign(metaData, {
          type: NODE_TYPES.PATTERN,
          pattern: '*',
          name: item.substr('1'),
          pos: index,
        })
      } else {
        pathPieces.push(item)
      }

      return metaData
    })

    this.insertNode(pathMeta, method, path, fn)
  }

  insertNode(pathMeta, method, path, fn) {
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
          } else {
            newNode.type = NODE_TYPES.STRUCTURE
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

  }
}

TreeRouter.ALLOW_METHODS = ALLOW_METHODS
TreeRouter.NODE_TYPES = NODE_TYPES

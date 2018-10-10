const ALLOW_METHODS = ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE', 'HEAD', 'PATCH']
const NODE_TYPES = {
  NORMAL: 'normal',
  PATTERN: 'pattern',
}

export default class TreeRouter {
  constructor() {
    this.tree = {}
  }

  register(method, path, fn) {

  }

  find() {

  }
}

class TreeNode {
  constructor() {
    this.handlers = {}
    this.type = ''
    this.methods = []
  }
}

TreeNode.InitRouteNode = function () {

}

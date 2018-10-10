import chai from 'chai'
import TreeRouter from '../../app/treeRouter'

const { expect, assert } = chai

describe('tree router test', function () {
  it('should generate tree', () => {
    const treeRouter = new TreeRouter()
    treeRouter.register('GET', '/api', () => {})
    treeRouter.register('GET', '/list', () => {})
    treeRouter.register('GET', '/long', () => {})
    treeRouter.register('GET', '/little', () => {})
    treeRouter.register('POST', '/api', () => {})

    console.log(JSON.stringify(treeRouter.tree))
  })
})

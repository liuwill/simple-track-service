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
    treeRouter.register('POST', '/api/:name', () => {})
    treeRouter.register('GET', '/meta/:id', () => {})
    treeRouter.register('GET', '/meta/:id/project', () => {})

    // console.log(JSON.stringify(treeRouter.tree))
    assert.isNotNull(treeRouter.find({}, 'GET', '/api'))
    assert.isNotNull(treeRouter.find({}, 'GET', '/meta/will'))
    assert.isNotNull(treeRouter.find({}, 'GET', '/meta/will/project'))
    assert.isNull(treeRouter.find({}, 'GET', '/meta3/will/project'))
  })
})

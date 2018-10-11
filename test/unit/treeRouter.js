import chai from 'chai'
import TreeRouter from '../../app/treeRouter'

const { expect, assert } = chai

const mockContext = {
  setHeader: () => {}
}

describe('tree router test', function () {
  it('should generate tree', () => {
    const treeRouter = new TreeRouter()
    let isVisit = false
    treeRouter.register('GET', '/api', () => {
      isVisit = true
    })
    treeRouter.register('GET', '/list', () => {})
    treeRouter.register('GET', '/long', () => {})
    treeRouter.register('GET', '/little', () => {})
    treeRouter.register('POST', '/api/:name', () => {})
    treeRouter.register('GET', '/meta', () => {})
    treeRouter.register('GET', '/meta/:id', () => {})
    treeRouter.register('GET', '/meta/:id/project', () => {})

    // console.log(JSON.stringify(treeRouter.tree))
    assert.isNotNull(treeRouter.find(mockContext, 'GET', '/api'))
    // assert.isTrue(isVisit)

    assert.isNotNull(treeRouter.find(mockContext, 'GET', '/meta/will'))
    assert.isNotNull(treeRouter.find(mockContext, 'GET', '/meta/will/project'))
    assert.isNotNull(treeRouter.find(mockContext, 'OPTIONS', '/meta/will'))

    assert.isNull(treeRouter.find(mockContext, 'POST', '/meta/will'))
    assert.isNull(treeRouter.find(mockContext, 'POST', '/liter'))
    assert.isNull(treeRouter.find(mockContext, 'GET', '/meta3/will/project'))

    expect(() => {
      treeRouter.register('GET', '/meta', () => {})
    }).to.throw()
  })
})

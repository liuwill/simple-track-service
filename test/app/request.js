import chai from 'chai'
import mockRequest from './mockRequest'
import httpClient from '../../app/httpClient'

const { expect, assert } = chai

httpClient.Request.setClient(mockRequest.mockHttpRequest)

describe('httpClient mock and test', function () {
  it('should get data', function (done) {
    httpClient.get('/200', { mock: 200 }).then(response => {
      assert.isNotNull(response)
      done()
    }).catch(err => {
      assert.isNull(err)
      done()
    })
  })

  it('should get error when 500', function (done) {
    httpClient.get('/500', { mock: 500 }).then(response => {
      assert.isNull(response)
      done()
    }).catch(err => {
      assert.isNotNull(err)
      done()
    })
  })

  it('should post and receive', function (done) {
    httpClient.post('/data', {
      data: { name: 'mock' },
    }).then(response => {
      assert.isNotNull(response)
      done()
    }).catch(err => {
      assert.isNull(err)
      done()
    })
  })

  it('should request success', function (done) {
    httpClient.request({
      url: '/data',
      method: 'put',
      data: { name: 'mock' },
    }).then(response => {
      assert.isNotNull(response)
      done()
    }).catch(err => {
      assert.isNull(err)
      done()
    })
  })

  it('should request promise throw missing opt', function (done) {
    httpClient.request().catch(err => {
      expect(err.message).to.be.equal('options is empty')
      done()
    })
  })

  it('should request promise throw missing url', function (done) {
    httpClient.request({
      method: 'put'
    }).catch(err => {
      expect(err.message).to.be.equal('missing url')
      done()
    })
  })

  it('should request with headers', function (done) {
    httpClient.request({
      method: 'put',
      url: '/header',
      headers: { auth: 'mock' },
    }).then(response => {
      assert.isNotNull(response)
      done()
    }).catch(err => {
      assert.isNull(err)
      done()
    })
  })
})

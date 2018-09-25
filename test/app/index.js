import chai from 'chai'
import mockServer from './server'
import querystring from 'querystring'
const { expect, assert } = chai

const trackServer = mockServer.getApp()

const generateRandom = () => {
  return Math.random().toString(36).substr(2)
}

const mockContext = {
  response: {},
  res: {
    end: (body) => { return body ? true : false },
    setHeader: () => { },
  }
}

describe('Test TrackServer App', function () {
  it('should add router fail', function () {
    expect(() => { trackServer.route() }).to.throw()
    expect(() => { trackServer.route('', '', () => { }) }).to.throw()
  });

  it('should respond text/plain', function () {
    const err = new Error()
    const errorContext = {
      res: {
        setHeader: () => { },
        end: () => { throw err },
      }
    }
    expect(() => {
      trackServer.respond(errorContext)
    }).to.throw(err)
  });

  it('should response null if status error', function () {
    const target = trackServer.handleResponse(Object.assign({}, mockContext, {
      status: '304'
    }))

    assert.isFalse(target)
  });

  it('should response HEAD', function () {
    const target = trackServer.handleResponse(Object.assign({}, mockContext, {
      method: 'HEAD',
      body: {},
    }))

    const blank = trackServer.handleResponse(Object.assign({}, mockContext, {
      method: 'HEAD',
    }))

    assert.isFalse(target)
    assert.isFalse(blank)
  });

  it('should response Body Null', function () {
    const target = trackServer.handleResponse(Object.assign({
      message: 'error',
    }, mockContext))

    const headerSets = trackServer.handleResponse(Object.assign({
      code: '200',
      headersSent: true,
    }, mockContext))
    assert.isTrue(target)
    assert.isTrue(headerSets)

    const bodyContext = Object.assign({
      body: { ok: 1 },
    }, mockContext)
    bodyContext.response = Object.assign({ headersSent: true }, bodyContext.response)
    const body = trackServer.handleResponse(bodyContext)

    assert.isTrue(body)
  })
})

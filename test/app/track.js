import mockApp from './mockApp'
import querystring from 'querystring'

const request = mockApp.createRequest()
const trackServer = mockApp.getApp()

trackServer.route('GET', '/throw/500', async (ctx) => {
  throw new Error()
})

describe('Track App', function () {
  it('test api', function (done) {
    request
      .get('/v1/test/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('404 Not Found', function (done) {
    request
      .get('/not/found/404')
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('500 Error', function (done) {
    request
      .get('/throw/500')
      .expect(500)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('options', function (done) {
    request
      .options('/throw/500')
      .expect(200)
      .expect('Allow', /GET/)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('post visit', function (done) {
    request
      .post('/visit')
      .send({ name: 'mock' })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('track api', function (done) {
    request
      .get('/v1/track.gif?uid=1')
      .expect('Content-Type', /image\/gif/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('post track api 404', function (done) {
    request
      .post('/v1/track.gif')
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });
})

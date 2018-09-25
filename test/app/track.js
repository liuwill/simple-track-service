import mockServer from './server'
import querystring from 'querystring'

const request = mockServer.createRequest()

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

  it('track api', function (done) {
    request
      .get('/v1/track.gif')
      .expect('Content-Type', /image\/gif/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });
})

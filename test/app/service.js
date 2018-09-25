import chai from 'chai'
// import sinon from 'sinon'
import settingUtils from '../../app/setting'
import trackService from '../../app/track.service'

const { expect, assert } = chai

const generateRandom = () => {
  return Math.random().toString(36).substr(2)
}

describe('send track request', function () {
  it('should return null if not config', function (done) {
    trackService.requestTrack({}, {}).then(response => {
      assert.isNull(response)
      done()
    })
  })

  it('should return promise', function (done) {
    trackService.requestTrack({appId: generateRandom()}, {}).then(response => {
      assert.isNotNull(response)
      done()
    })
  })
})

import chai from 'chai'
import path from 'path'
import settingUtils from '../../app/setting'

const { expect, assert } = chai

const generateRandom = () => {
  return Math.random().toString(36).substr(2)
}

describe('load json config', function () {
  it('should fetch default config path', function () {
    const filePath = settingUtils.fetchConfigPath()

    expect(filePath).to.have.string('setting.json')
  })

  it('should load empty if file not exists', function () {
    const filename = generateRandom()
    const fileContent = settingUtils.loadJsonConfig(filename)

    expect(fileContent).to.be.an('object')
    expect(Object.keys(fileContent)).to.be.empty
  })

  it('should load empty if not json file', function () {
    const filename = path.join(__dirname, './setting.js')
    const fileContent = settingUtils.loadJsonConfig(filename)

    expect(fileContent).to.be.an('object');
    expect(Object.keys(fileContent)).to.be.empty
  })

  it('should load setting', function () {
    const settingConfig = settingUtils.loadSetting()

    expect(settingConfig).to.be.an('object')
  })

  it('should load track setting', function () {
    const appId = generateRandom()
    const appKey = generateRandom()
    const trackSetting = settingUtils.loadTrackSetting({
      'LEAN_APP_ID': appId,
      'LEAN_APP_KEY': appKey,
    })

    expect(trackSetting.appId).to.be.equal(appId)
    expect(trackSetting.appKey).to.be.equal(appKey)
  })
})

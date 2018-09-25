import settingUtils from './setting'

export default {
  sendTrackRecord: async (trackData) => {
    const fields = ['page', 'action', 'source', 'extra', 'uid', 'ip', 'agent', 'referer']
    const trackSetting = settingUtils.loadTrackSetting(process.env)
    const settingConfig = settingUtils.loadSetting()

    try {
      return await requestTrack(trackSetting, trackData)
    } catch (err) {
      return null
    }
  },
  requestTrack: async (trackSetting, trackData) => {
    if (!trackSetting.appId) {
      return null
    }

    return trackData
  }
}

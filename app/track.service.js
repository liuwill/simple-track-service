import settingUtils from './setting'

const requestTrack = async (trackSetting, trackData) => {
  if (!trackSetting.appId) {
    return null
  }

  return trackData
}
export default {
  sendTrackRecord: async (trackData) => {
    const fields = ['page', 'action', 'source', 'extra', 'uid', 'ip', 'agent', 'referer']
    const trackSetting = settingUtils.loadTrackSetting(process.env)
    const settingConfig = settingUtils.loadSetting()

    return await requestTrack(trackSetting, trackData)
  },
  requestTrack,
}

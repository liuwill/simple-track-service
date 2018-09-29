import settingUtils from './setting'
import httpClient from './httpClient'

const requestTrack = async (trackSetting, trackData) => {
  if (!trackSetting.appId) {
    return null
  }
  const settingConfig = settingUtils.loadSetting()

  httpClient.post(trackSetting.url, {
    data: trackData,
    headers: {
      'X-LC-Id': trackSetting.appId,
      'X-LC-Key': trackSetting.appKey,
      'Content-Type': settingConfig.contentType,
    },
  })
  return trackData
}
export default {
  sendTrackRecord: async (trackData) => {
    const fields = ['page', 'action', 'source', 'extra', 'uid', 'ip', 'agent', 'referer']
    const trackSetting = settingUtils.loadTrackSetting(process.env)

    return await requestTrack(trackSetting, trackData)
  },
  requestTrack,
}

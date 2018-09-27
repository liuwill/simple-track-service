import settingUtils from './setting'
import httpClient from './httpClient'

const requestTrack = async (trackSetting, trackData) => {
  if (!trackSetting.appId) {
    return null
  }

  try {
    const response = await httpClient.get('/v1/test/id')
    console.log(response, '======')
  } catch (err) {
    console.error(err)
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

import settingUtils from './setting'

export default {
  sendTrackRecord: (trackData) => {
    const fields = ['page', 'action', 'source', 'extra', 'uid', 'ip', 'agent', 'referer']
    const trackSetting = settingUtils.loadTrackSetting(process.env)
    if (!trackSetting.appId) {
      return
    }
  },
}

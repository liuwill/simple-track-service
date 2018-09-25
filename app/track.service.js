import settingUtils from './setting'

export default {
  sendTrackRecord: (trackData) => {
    const fields = ['page', 'action', 'source', 'extra', 'uid', 'ip', 'agent', 'referer']
    const trackSetting = settingUtils.loadTrackSetting(process.env)
    const settingConfig = settingUtils.loadSetting()

    if (!trackSetting.appId) {
      return
    }
  },
}

import fs from 'fs'
import path from 'path'

const loadJsonConfig = (configPath) => {
  if (!fs.existsSync(configPath)) {
    return {}
  }
  let content = fs.readFileSync(configPath, 'utf8')
  try {
    return JSON.parse(content)
  } catch (err) {
    return {}
  }
}

const fetchConfigPath = (nodeEnv) => {
  let settingPath = '../config/setting.json'
  if (nodeEnv === 'unit') {
    settingPath = '../config/setting.unit.json'
  }
  return settingPath
}

let settingConfig = null

export default {
  fetchConfigPath,
  loadJsonConfig,
  loadTrackSetting: (envConfig) => {
    let trackSetting = {}
    if (envConfig.LEAN_APP_ID) {
      trackSetting = {
        appId: envConfig.LEAN_APP_ID,
        appKey: envConfig.LEAN_APP_KEY,
      }
    }
    return trackSetting
  },
  loadSetting: () => {
    let settingPath = fetchConfigPath(process.env.NODE_ENV)

    if (!settingConfig) {
      settingConfig = loadJsonConfig(path.join(__dirname, settingPath))
    }

    return settingConfig
  }
}

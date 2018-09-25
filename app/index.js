import TrackServer from './server'
import serverUtils from './utils'
import trackService from './track.service'

const trackServer = new TrackServer()

trackServer.route('GET', '/v1/track.gif', async (ctx, next) => {
  const BLANK_GIF = Buffer.from('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64')
  const requestParams = ctx.request.query
  const ipAddress = serverUtils.getIp(ctx.header)
  const userAgent = ctx.header['user-agent']
  const referer = ctx.header['referer']
  const fields = ['page', 'action', 'source', 'extra', 'uid']

  const trackData = {
    ip: ipAddress,
    agent: userAgent,
    referer,
  }
  for (let key of fields) {
    if (requestParams[key]) {
      trackData[key] = requestParams[key]
    }
  }
  trackService.sendTrackRecord(trackData)

  ctx.type = 'image/gif'
  ctx.body = BLANK_GIF
  ctx.status = 200
})

trackServer.listen(8000)

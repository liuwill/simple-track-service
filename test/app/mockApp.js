import appServer from '../../app/entry'
import supertest from 'supertest'

import mockRequest from './mockRequest'
import httpClient from '../../app/httpClient'

httpClient.Request.setClient(mockRequest.mockHttpRequest)

const app = appServer.createApp()
const server = app.listen()

const request = supertest(server)

export default {
  createRequest: () => {
    return request
  },
  getApp: () => {
    return app
  },
}

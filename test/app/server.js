import appServer from '../../app/entry'
import supertest from 'supertest'

const app = appServer.createApp()
const server = app.listen()

const request = supertest(server)

export default {
  createRequest: () => {
    return request
  },
}

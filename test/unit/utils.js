import chai from 'chai'
import serverUtils from '../../app/utils'

const { expect, assert } = chai

describe('utils test', function () {
  describe('server utils', function () {
    describe("isJson", () => {
      it('should string not json', () => {
        const source = 'abc'
        const result = serverUtils.isJSON(source)

        assert.isFalse(result)
      })

      it('should buffer not json', () => {
        const source = 'abc'
        const result = serverUtils.isJSON(Buffer.from(source))

        assert.isFalse(result)
      })

      it('should object to be json', () => {
        const source = {}
        const result = serverUtils.isJSON(source)

        assert.isTrue(result)
      })
    })

    describe("getIp", () => {
      it('should getIp from header', () => {
        const sourceIp = '10.3.123.12'
        const ipStr = serverUtils.getIp({ 'x-real-ip': sourceIp })

        expect(ipStr).to.be.equal(sourceIp)
      })

      it('should not getIp', () => {
        const ipStr = serverUtils.getIp({ 'x-real-ip': "localhost" })
        const blankStr = serverUtils.getIp()
        const emptyStr = serverUtils.getIp({})

        expect(ipStr).to.be.equal('127.0.0.1')
        expect(blankStr).to.be.equal('127.0.0.1')
        expect(emptyStr).to.be.equal('127.0.0.1')
      })
    })
  })
})

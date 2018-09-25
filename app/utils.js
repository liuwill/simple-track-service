
export default {
  parseErrorCode: (err) => {
    let status = 500
    if (err) {
      status = err.statusCode || err.status || status
    }
    return status
  },
  getIp: (header) => {
    if (!header) {
      header = {}
    }

    let ip = header['x-real-ip'] || ""
    ip = ip && ip.split(',')[0]
    const isRealIp = (/^\d+\.\d+.\d+.\d+$/).test(ip)

    if (!isRealIp) { ip = '127.0.0.1' }
    return ip
  }
}

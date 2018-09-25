module.exports = {
  apps: [{
    name: 'simple-track-service',
    script: './index.js',
    instances: 2,
    exec_mode: 'cluster'
  }]
}

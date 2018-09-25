import trackApp from './entry'

const app = trackApp.createApp()

const PORT = process.env.NODE_PORT || 8000
app.listen(PORT)

console.log(`🎡 SERVER START: http://0.0.0.0:${PORT}`)

const admin = require('firebase-admin')
const functions = require('firebase-functions')

const mainMenu = require('./mainMenu')
const interactive = require('./interactive')
const interactiveResponse = require('./interactiveResponse')

admin.initializeApp()

exports.mainMenu = functions.region('europe-west2').https.onRequest(mainMenu)
exports.interactive = functions.region('europe-west2').https.onRequest(interactive)
exports.interactiveResponse = functions.region('europe-west2').pubsub.topic('interactiveResponse').onPublish(interactiveResponse)

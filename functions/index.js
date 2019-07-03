const admin = require('firebase-admin')
const functions = require('firebase-functions')

const command = require('./src/command')
const commandSubscriber = require('./src/commandSubscriber')
const interactive = require('./src/interactive')
const interactiveSubscriber = require('./src/interactiveSubscriber')

admin.initializeApp()

exports.command = functions.region('europe-west2').https.onRequest(command)
exports.commandSubscriber = functions.region('europe-west2').pubsub.topic('command').onPublish(commandSubscriber)
exports.interactive = functions.region('europe-west2').https.onRequest(interactive)
exports.interactiveSubscriber = functions.region('europe-west2').pubsub.topic('interactive').onPublish(interactiveSubscriber)

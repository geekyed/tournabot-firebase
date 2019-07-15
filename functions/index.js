const admin = require('firebase-admin')
const functions = require('firebase-functions')

const slack = require('./src/slack')
const interactive = require('./src/interactive')
const interactiveSubscriber = require('./src/interactiveSubscriber')

admin.initializeApp()

exports.slashCommand = functions.region('europe-west2').https.onRequest(slack.slashCommand)
exports.slashCommandRunner = functions.region('europe-west2').pubsub.topic('command').onPublish(slack.slashCommandRunner)
exports.interactive = functions.region('europe-west2').https.onRequest(interactive)
exports.interactiveSubscriber = functions.region('europe-west2').pubsub.topic('interactive').onPublish(interactiveSubscriber)

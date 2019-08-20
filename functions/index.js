const admin = require('firebase-admin')
const functions = require('firebase-functions')

const slack = require('./src/slack')

admin.initializeApp()

exports.slashCommand = functions.region('europe-west2').https.onRequest(slack.slashCommand)
exports.slashCommandRunner = functions.region('europe-west2').pubsub.topic('command').onPublish(slack.slashCommandRunner)
exports.interactive = functions.region('europe-west2').https.onRequest(slack.interactiveRequest)

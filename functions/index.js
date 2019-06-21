const functions = require('firebase-functions')

const { mainMenu } = require('./actions/mainMenu')
const { newTournament } = require('./actions/newTournament')

exports.mainMenu = functions.https.onRequest(mainMenu)
exports.newTournament = functions.https.onRequest(newTournament)

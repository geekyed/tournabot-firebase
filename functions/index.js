const functions = require('firebase-functions')

const { mainMenu } = require('./actions/mainMenu')
const { newTournament } = require('./actions/newTournament')

exports.mainMenu = functions.region('europe-west2').https.onRequest(mainMenu)
exports.newTournament = functions.region('europe-west2').https.onRequest(newTournament)

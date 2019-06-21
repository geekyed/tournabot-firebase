const functions = require('firebase-functions')

const { mainMenu } = require('./mainMenu')
const { interactive } = require('./interactive')

exports.mainMenu = functions.region('europe-west2').https.onRequest(mainMenu)
exports.interactive = functions.region('europe-west2').https.onRequest(interactive)

const admin = require('firebase-admin')
const { sendTextResponse } = require('./slackResponse/textResponse')

const moment = require('moment')

const interactiveResponse = async (message) => {
  const metadata = message.attributes

  switch (metadata.action) {
    case 'new': {
      const tournamentID = `${metadata.team}-${metadata.channel}-${moment().format('DDMMMYY')}`
      await saveTournament(metadata)
      await sendTextResponse(metadata.responseURL, [`New Tournament created with ID: ${tournamentID}`], `team: ${metadata.team}, channel: ${metadata.channel}`)
      break
    }
  }
}

const saveTournament = async tournamentID => {
  try {
    const tournament = {
      currentRound: 1,
      rounds: []
    }
    await admin.firestore().collection('tournaments').doc(tournamentID).set(tournament)
  } catch (err) {
    console.error('error creating tournament', err)
  }
  return `It went wrong....:`
}

module.exports = interactiveResponse


const uuidv1 = require('uuid/v1')
const { sendTextResponse } = require('./slackResponse/textResponse')
// const { sendSelectionResponse } = require('./slackResponse/sendSelectionResponse')
const tournamentData = require('./data/tournament')
const currentData = require('./data/current')

const interactiveResponse = async (message) => {
  const metadata = message.attributes

  const globalChannelId = `${metadata.team}-${metadata.channel}`
  const currentTournament = await currentData.get(globalChannelId)

  switch (metadata.action) {
    case 'new': {
      const tournamentID = uuidv1()
      await tournamentData.set(tournamentID)
      await currentData.set(globalChannelId, tournamentID)
      await sendTextResponse(metadata.responseURL, [`New Tournament created!`], `current tournament ${tournamentID}`)
      break
    }
    case 'change': {
      const tournamentIds = await tournamentData.getIds()

      await sendTextResponse(metadata.responseURL, tournamentIds, `current tournament ${currentTournament}`)
      break
    }
  }
}

module.exports = interactiveResponse

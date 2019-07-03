
const uuidv1 = require('uuid/v1')
const { sendTextResponse } = require('./slackResponse/textResponse')
const { sendSelectResponse } = require('./slackResponse/selectResponse')
const tournament = require('./data/tournament')
const current = require('./data/current')

const interactiveSubscriber = async (message) => {
  const metadata = message.attributes

  const globalChannelId = `${metadata.team}-${metadata.channel}`
  const currentTournament = await current.get(globalChannelId)

  switch (metadata.action) {
    case 'new': {
      const tournamentID = uuidv1()
      await tournament.set(tournamentID)
      await current.set(globalChannelId, tournamentID)
      await sendTextResponse(metadata.responseURL, [`New Tournament created!`], `current tournament ${tournamentID}`)
      break
    }
    case 'change': {
      const tournamentIds = await tournament.getIds()

      await sendSelectResponse(
        metadata.responseURL,
        'selectCurrent',
        'Select Current Tournament',
        'Select Tournament',
        tournamentIds,
        `current tournament ${currentTournament}`)
      break
    }
    case 'selectCurrent': {
      await current.set(globalChannelId, metadata.selectValue)
      await sendTextResponse(metadata.responseURL, [`Current tournament changed!`], `current tournament ${metadata.selectValue}`)
      break
    }
  }
}

module.exports = interactiveSubscriber

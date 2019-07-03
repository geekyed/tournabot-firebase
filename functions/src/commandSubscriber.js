const { sendTextResponse } = require('./slackResponse/textResponse')
const { sendEphemeralResponse } = require('./slackResponse/ephemeralResponse')
const newRunner = require('./commandRunners/newRunner')
const playersRunner = require('./commandRunners/playersRunner')
const resultRunner = require('./commandRunners/resultRunner')

const commandRunners = {
  new: newRunner,
  players: playersRunner,
  result: resultRunner
}

const commandSubscriber = async message => {
  const command = JSON.parse(message.attributes.command)
  const responseURL = message.attributes.responseURL

  try {
    const { messages, context } = await commandRunners[command.type].execute(command.data)

    await sendTextResponse(responseURL, messages, context)
  } catch (err) {
    await sendEphemeralResponse(`${err}` + ' try `/tournaBot help`')
  }
}

module.exports = commandSubscriber

// const currentTournament = await currentData.get(command.data.channelID)
// switch (metadata.action) {
//     case 'new': {
//       const tournamentID = uuidv1()
//       await tournamentData.set(tournamentID)
//       await currentData.set(globalChannelId, tournamentID)
//       await sendTextResponse(metadata.responseURL, [`New Tournament created!`], `current tournament ${tournamentID}`)
//       break
//     }
//     case 'change': {
//       const tournamentIds = await tournamentData.getIds()

//       await sendSelectResponse(
//         metadata.responseURL,
//         'selectCurrent',
//         'Select Current Tournament',
//         'Select Tournament',
//         tournamentIds,
//         `current tournament ${currentTournament}`)
//       break
//     }
//     case 'selectCurrent': {
//       await currentData.set(globalChannelId, metadata.selectValue)
//       await sendTextResponse(metadata.responseURL, [`Current tournament changed!`], `current tournament ${metadata.selectValue}`)
//       break
//     }
//   }

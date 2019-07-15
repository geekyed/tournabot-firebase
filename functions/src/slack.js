const PubSub = require('@google-cloud/pubsub')

const textResponse = require('./slackResponses/textResponse')
const ephemeralResponse = require('./slackResponses/ephemeralResponse')
const helpResponse = require('./slackResponses/helpResponse')
const newRunner = require('./commandRunners/newRunner')
const playersRunner = require('./commandRunners/playersRunner')
const resultRunner = require('./commandRunners/resultRunner')
const parseRequest = require('./requestParser')

const commandRunners = {
  new: newRunner,
  players: playersRunner,
  result: resultRunner
}

exports.slashCommand = async (request, response) => {
  if (request.method !== 'POST') {
    console.error(`Got unsupported ${request.method} request. Expected POST.`)
    return response.send(405, 'Only POST requests are accepted')
  }
  if (!request.body) {
    return response.send(405, 'Expected a message action payload.')
  }

  console.log(`Command Element Payload: ${JSON.stringify(request.body)}`)

  let command
  try {
    command = await parseRequest(request.body)
  } catch (err) {
    console.error(err)
    return response.status(200).send(ephemeralResponse.create(`${err}` + ' try `/tournaBot help`'))
  }

  if (command.type === 'help') return response.status(200).send(helpResponse.create('Help!'))

  const publishClient = new PubSub.v1.PublisherClient()

  let message = { attributes: { command: JSON.stringify(command), responseURL: request.body.response_url } }

  const pubRequest = {
    topic: publishClient.topicPath('tournabot', 'command'),
    messages: [message]
  }

  try {
    await publishClient.publish(pubRequest)
  } catch (err) {
    console.error(`error publishing`, err)
    return response.status(200).send(ephemeralResponse.create(`${err}` + ' try `/tournaBot help`'))
  }

  return response.status(200).send()
}

exports.slashCommandRunner = async message => {
  const command = JSON.parse(message.attributes.command)
  const responseURL = message.attributes.responseURL

  try {
    const { messages, context } = await commandRunners[command.type].execute(command.data)

    await textResponse.send(responseURL, messages, context)
  } catch (err) {
    await ephemeralResponse.send(`${err}` + ' try `/tournaBot help`')
  }
}

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

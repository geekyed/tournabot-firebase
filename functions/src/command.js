const PubSub = require('@google-cloud/pubsub')

const createEphemeralResponse = require('./slackResponse/ephemeralResponse')
const createHelpResponse = require('./slackResponse/helpResponse')
const parseRequest = require('./requestParser')

const command = async (request, response) => {
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
    return response.status(200).send(createEphemeralResponse(`${err}` + ' try `/tournaBot help`'))
  }

  if (command.type === 'help') return response.status(200).send(createHelpResponse('Help!'))

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
    return response.status(200).send(createEphemeralResponse(`${err}` + ' try `/tournaBot help`'))
  }

  return response.status(200).send()
}

module.exports = command

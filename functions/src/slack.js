const PubSub = require('@google-cloud/pubsub')
const functions = require('firebase-functions')
const crypto = require('crypto')
const timingSafeCompare = require('tsscmp')

const textResponse = require('./slackResponses/textResponse')
const ephemeralResponse = require('./slackResponses/ephemeralResponse')
const helpResponse = require('./slackResponses/helpResponse')
const newRunner = require('./commandRunners/newRunner')
const playersRunner = require('./commandRunners/playersRunner')
const startRunner = require('./commandRunners/startRunner')
const scoresRunner = require('./commandRunners/scoresRunner')
const resultRunner = require('./commandRunners/resultRunner')
const parseRequest = require('./requestParser')

const commandRunners = {
  new: newRunner,
  players: playersRunner,
  start: startRunner,
  scores: scoresRunner,
  result: resultRunner
}

const responses = {
  ephemeral: ephemeralResponse,
  text: textResponse
}

const slackSecret = functions.config().tournabot.slacksecret

exports.slashCommand = async (request, response) => {
  if (request.method !== 'POST') {
    console.error(`Got unsupported ${request.method} request. Expected POST.`)
    return response.send(405, 'Only POST requests are accepted')
  }
  if (!request.body || !request.headers) {
    return response.send(405, 'Expected a message action payload.')
  }

  if (!verifyRequest(request)) return response.send(401, 'Unauthorized')

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

  let message = {
    attributes: {
      command: JSON.stringify(command),
      responseURL: request.body.response_url
    }
  }

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

  return response.status(200).send({ 'response_type': 'in_channel' })
}

exports.slashCommandRunner = async message => {
  const command = JSON.parse(message.attributes.command)
  const responseURL = message.attributes.responseURL

  try {
    const { type, data } = await commandRunners[command.type].execute(command.data)

    await responses[type].send(responseURL, data)
  } catch (err) {
    await ephemeralResponse.send(responseURL, `${err}` + ' try `/tournaBot help`')
  }
}

const verifyRequest = request => {
  const signature = request.headers['x-slack-signature']
  const timestamp = request.headers['x-slack-request-timestamp']

  const hmac = crypto.createHmac('sha256', slackSecret)
  const [version, hash] = signature.split('=')

  hmac.update(`${version}:${timestamp}:${request.rawBody}`)

  const calculatedHash = hmac.digest('hex')
  if (!timingSafeCompare(hash, calculatedHash)) {
    console.log(`request signature is not valid: ${hash} : ${calculatedHash}`)
    return false
  }

  console.log('request signing verification success')
  return true
}

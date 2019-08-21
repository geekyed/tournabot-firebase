const PubSub = require('@google-cloud/pubsub')
const functions = require('firebase-functions')
const crypto = require('crypto')
const timingSafeCompare = require('tsscmp')

const textResponse = require('./slackResponses/textResponse')
const ephemeralResponse = require('./slackResponses/ephemeralResponse')
const helpResponse = require('./slackResponses/helpResponse')
const buttonsResponse = require('./slackResponses/buttonsResponse')

const newRunner = require('./commandRunners/newRunner')
const playersRunner = require('./commandRunners/playersRunner')
const startRunner = require('./commandRunners/startRunner')
const scoresRunner = require('./commandRunners/scoresRunner')
const resultRunner = require('./commandRunners/resultRunner')
const resultClickRunner = require('./commandRunners/resultClickRunner')
const pointsRunner = require('./commandRunners/pointsRunner')

const parseRequest = require('./requestParser')
const parseAction = require('./actionParser')

const commandRunners = {
  'new': newRunner,
  'players': playersRunner,
  'start': startRunner,
  'scores': scoresRunner,
  'result': resultRunner,
  'resultClick': resultClickRunner,
  'points': pointsRunner
}

const slackResponses = {
  ephemeral: ephemeralResponse,
  text: textResponse,
  buttons: buttonsResponse
}

const slackSecret = functions.config().tournabot.slacksecret

exports.slashCommand = async (request, response) => {
  if (!verifyRequest(request)) return response.send(401, 'Unauthorized')

  console.log('REQUEST', request.body)
  if (request.body.text.split(' ')[0] === 'help') return response.status(200).send(helpResponse.create('Help!'))

  try {
    const attributes = await parseRequest(request.body)

    console.log('MESSAGE', attributes)
    await publish('command', attributes)
  } catch (err) {
    console.error(err)
    return response.status(200).send(ephemeralResponse.create(`${err}` + ' try `/tournaBot help`'))
  }

  return response.status(200).send({ 'response_type': 'in_channel' })
}

exports.slashCommandRunner = async message => {
  console.log(message.attributes)

  const data = JSON.parse(message.attributes.data)

  try {
    const response = await commandRunners[message.attributes.type].execute(data)

    console.log(JSON.stringify(response))

    await slackResponses[response.type].send(data.responseURL, response.data)
  } catch (err) {
    await ephemeralResponse.send(data.responseURL, { text: `${err}` + ' try `/tournaBot help`' })
  }
}

exports.interactiveRequest = async (request, response) => {
  if (!verifyRequest(request)) return response.send(401, 'Unauthorized')

  const requestPayload = JSON.parse(request.body.payload)
  console.log(requestPayload)
  const attributes = await parseAction(requestPayload)
  console.log(attributes)

  try {
    await publish('command', attributes)
    return response.status(200).send({ 'response_type': 'in_channel' })
  } catch (err) {
    console.error(`error publishing`, err)
    return response.status(200).send(ephemeralResponse.create(`${err}` + ' try `/tournaBot help`'))
  }
}

const publish = async (topic, attributes) => {
  const publishClient = new PubSub.v1.PublisherClient()

  const pubRequest = {
    topic: publishClient.topicPath('tournabot', topic),
    messages: [{ attributes }]
  }

  await publishClient.publish(pubRequest)
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

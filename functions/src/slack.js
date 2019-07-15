const PubSub = require('@google-cloud/pubsub')

const textResponse = require('./slackResponses/textResponse')
const ephemeralResponse = require('./slackResponses/ephemeralResponse')
const helpResponse = require('./slackResponses/helpResponse')
const newRunner = require('./commandRunners/newRunner')
const playersRunner = require('./commandRunners/playersRunner')
const startRunner = require('./commandRunners/startRunner')
const parseRequest = require('./requestParser')

const commandRunners = {
  new: newRunner,
  players: playersRunner,
  start: startRunner
}
/**
   * Method to verify signature of requests
   *
   * @param {string} signingSecret - Signing secret used to verify request signature
   * @param {Object} requestHeaders - Request headers
   * @param {string} body - Raw body string
   * @returns {boolean} Indicates if request is verified
   */
// function verifyRequestSignature(signingSecret, requestHeaders, body) {
//   // Request signature
//   const signature = requestHeaders['x-slack-signature'];
//   // Request timestamp
//   const ts = requestHeaders['x-slack-request-timestamp'];

//   // Divide current date to match Slack ts format
//   // Subtract 5 minutes from current time
//   const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);

//   if (ts < fiveMinutesAgo) {
//     debug('request is older than 5 minutes');
//     const error = new Error('Slack request signing verification failed');
//     error.code = errorCodes.REQUEST_TIME_FAILURE;
//     throw error;
//   }

//   const hmac = crypto.createHmac('sha256', signingSecret);
//   const [version, hash] = signature.split('=');
//   hmac.update(`${version}:${ts}:${body}`);

//   if (!timingSafeCompare(hash, hmac.digest('hex'))) {
//     debug('request signature is not valid');
//     const error = new Error('Slack request signing verification failed');
//     error.code = errorCodes.SIGNATURE_VERIFICATION_FAILURE;
//     throw error;
//   }

//   debug('request signing verification success');
//   return true;
// }

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

  return response.status(200).send(ephemeralResponse.create('Processing...'))
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

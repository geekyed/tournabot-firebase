const fetch = require('node-fetch')
const createTextResponse = require('./slackResponse/textResponse')

const interactiveResponse = async (message) => {
  const metadata = message.attributes

  const slackResponse = createTextResponse(['Hi I am Ed'], JSON.stringify(message.attributes))

  const responseBody = {
    method: 'POST',
    body: JSON.stringify(slackResponse),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  await fetch(metadata.responseURL, responseBody)
}

module.exports = interactiveResponse

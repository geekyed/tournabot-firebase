const { sendTextResponse } = require('./slackResponse/textResponse')

const interactiveResponse = async (message) => {
  const metadata = message.attributes

  await sendTextResponse(metadata.responseURL, [`New Tournament created with ID: `], `team: ${metadata.team}, channel: ${metadata.channel}`)
}

module.exports = interactiveResponse

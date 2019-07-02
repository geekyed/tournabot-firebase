const ephemeralResponse = require('./ephemeralResponse')

const createHelpResponse = error => {
  let slackResponse = ephemeralResponse(error)
  slackResponse.blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: helpText
    }
  })

  return slackResponse
}

const helpText = '`/tournabot` and follow the menu!'

module.exports = createHelpResponse

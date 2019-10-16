const ephemeralResponse = require('./ephemeralResponse')

exports.create = error => {
  let slackResponse = ephemeralResponse.create(error)
  slackResponse.blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: helpText
    }
  })

  return slackResponse
}

const helpText = '`/tournaBot new <name>` Create a new tournament\n' +
'`/tournaBot players @edward.weston @david.hackman` Add new players\n' +
'`/tournaBot start` Start the next round.\n' +
'`/tournaBot result` Record a result using the buttons provided\n' +
'`/tournaBot points`Find out the current points standings\n' +
'`/tournaBot scores` Get the full scores\n'

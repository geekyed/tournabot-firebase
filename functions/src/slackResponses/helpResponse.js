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
'`/tournaBot start` Start the tournament\n' +
'`/tournaBot I won 2-0` or `/tournaBot I lost 2-1` or `/tournaBot I drew 1-1` Record a result\n' +
'`/tournaBot round` Finish this round (requires all matches to be complete) and pair the next, or get the final scores!\n' +
'`/tournaBot points`Find out the current points standings\n' +
'`/tournaBot scores` Get the full scores\n' +
'`/tournaBot tiebreak` Explain the tie break numbers\n' +
'`/tournaBot reminder` Remind players that havent played their games yet to get a move on.\n'

const ephemeralResponse = text => {
  return {
    response_type: 'ephemeral',
    blocks: [{
      type: 'section',
      text: {
        type: 'mrkdwn',
        text
      }
    }]
  }
}

module.exports = ephemeralResponse

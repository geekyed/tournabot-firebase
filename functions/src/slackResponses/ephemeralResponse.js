const fetch = require('node-fetch')

const create = text => {
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

const send = async (responseURL, data) => {
  const responseBody = {
    method: 'POST',
    body: JSON.stringify(create(data.text)),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  await fetch(responseURL, responseBody)
}

module.exports = { create, send }

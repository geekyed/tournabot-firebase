const fetch = require('node-fetch')

const sendTextResponse = async (responseURL, messages, context) => {
  const responseBody = {
    method: 'POST',
    body: JSON.stringify(createTextResponse(messages, context)),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  await fetch(responseURL, responseBody)
}

const createTextResponse = (messages, context) => {
  let response = {
    response_type: 'in_channel',
    blocks: []
  }

  messages.forEach(message => {
    addTextBlock(response, message)
  })

  if (context) {
    response.blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: context
        }
      ]
    })
  }

  return response
}

const addTextBlock = (response, text) => {
  response.blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: text
    }
  })
  return response
}

module.exports = { createTextResponse, sendTextResponse }

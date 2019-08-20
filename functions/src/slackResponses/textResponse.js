const fetch = require('node-fetch')

const send = async (responseURL, data) => {
  const responseBody = {
    method: 'POST',
    body: JSON.stringify(create(data.messages, data.context)),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const response = await fetch(responseURL, responseBody)
  if (response.status !== 200) throw new Error(`Sending response to slack failed. Status: ${response.status}, Body: ${response.body}`)
}

const create = (messages, context) => {
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

module.exports = { create, send }

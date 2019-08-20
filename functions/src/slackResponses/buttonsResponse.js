const fetch = require('node-fetch')

const send = async (responseURL, data) => {
  console.log('buttons response', responseURL, data)
  const responseBody = {
    method: 'POST',
    body: JSON.stringify(create(data.type, data.buttons, data.context)),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  await fetch(responseURL, responseBody)
}

const create = (type, buttons, context) => {
  let elements = []

  buttons.forEach(button => {
    createButton(elements, button.name, button.id)
  })

  let response = {
    response_type: type,
    blocks: [{
      type: 'actions',
      elements
    }]
  }

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

const createButton = (elements, name, actionId) => {
  elements.push({
    type: 'button',
    action_id: actionId,
    text: {
      type: 'plain_text',
      text: name,
      emoji: true
    }
  })
  return elements
}

module.exports = { create, send }

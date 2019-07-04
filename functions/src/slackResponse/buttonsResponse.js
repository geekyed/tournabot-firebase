const fetch = require('node-fetch')

const sendButtonsResponse = async (responseURL, type, buttons, context) => {
  const responseBody = {
    method: 'POST',
    body: JSON.stringify(createButtonsResponse(type, buttons, context)),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  await fetch(responseURL, responseBody)
}

const createButtonsResponse = (type, buttons) => {
  let response = {
    response_type: type,
    blocks: []
  }

  buttons.forEach(button => {
    createButton(response, button.name, button.id)
  })

  return response
}

const createButton = (response, name, actionId) => {
  response.blocks.push({
    type: 'actions',
    elements: [{
      type: 'button',
      action_id: actionId,
      text: {
        type: 'plain_text',
        text: name,
        emoji: true
      }
    }]
  })
  return response
}

module.exports = { createButtonsResponse, sendButtonsResponse }
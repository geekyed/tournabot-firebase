const fetch = require('node-fetch')

const sendSelectResponse = async (responseURL, actionId, label, placeholderText, selectOptions, context) => {
  const responseBody = {
    method: 'POST',
    body: JSON.stringify(createSelectResponse(actionId, label, placeholderText, selectOptions, context)),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  await fetch(responseURL, responseBody)
}

const createSelectResponse = (actionId, label, placeholderText, selectOptions, context) => {
  let response = {
    response_type: 'in_channel',
    blocks: [{
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: label
      },
      accessory: {
        action_id: actionId,
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: placeholderText,
          emoji: true
        },
        options: []
      }
    }]
  }

  console.log(`options: ${JSON.stringify(selectOptions)}`)

  selectOptions.forEach(option => {
    addOption(response.blocks[0].accessory.options, option)
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

const addOption = (options, optionText) => {
  options.push({
    text: {
      type: 'plain_text',
      text: optionText,
      emoji: true
    },
    'value': optionText
  })
}

module.exports = { createSelectResponse, sendSelectResponse }

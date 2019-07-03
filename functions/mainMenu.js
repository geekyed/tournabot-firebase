const mainMenu = async (request, response) => {
  response.status(200).send(createResponse())
}

const createResponse = () => {
  let response = {
    response_type: 'in_channel',
    blocks: []
  }

  response = createButton(response, 'New Tournament', 'new')
  response = createButton(response, 'Change Tournament', 'change')
  return response
}

const createButton = (response, name, actionId) => {
  response.blocks.push({
    'type': 'actions',
    'elements': [
      {
        'type': 'button',
        'action_id': actionId,
        'text': {
          'type': 'plain_text',
          'text': name,
          'emoji': true
        }
      }
    ]
  })
  return response
}

module.exports = mainMenu

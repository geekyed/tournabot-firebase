const mainMenu = async (request, response) => {
  response.status(200).send(createResponse())
}

const createResponse = () => {
  let response = {
    response_type: 'in_channel',
    blocks: []
  }

  return createButton(response, 'New Tournament', 'new')
}

const createButton = (response, name, value) => {
  response.blocks.push({
    'type': 'actions',
    'elements': [
      {
        'type': 'button',
        'action_id': 'new',
        'text': {
          'type': 'plain_text',
          'text': name,
          'emoji': true
        },
        'value': value
      }
    ]
  })
  return response
}

module.exports = mainMenu

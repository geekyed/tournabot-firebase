const mainMenu = (request, response) => {
  response.status(200).send(createResponse('Hi', 'Im David', 'https://i.imgur.com/IQoTsAX.png'))
}

const createResponse = (header, message, imageURL) => {
  let response = {
    response_type: 'in_channel',
    blocks: []
  }

  return createBlocks(response, header, message, imageURL)
}

const createBlocks = (response, header, message, imageURL) => {
  response.blocks.push({
    'type': 'section',
    'text': {
      'type': 'mrkdwn',
      'text': 'Hi Welcome to tournabot '
    },
    'accessory': {
      'type': 'button',
      'text': {
        'type': 'plain_text',
        'text': 'New Tournament',
        'emoji': true
      },
      'value': 'new_tournament'
    }
  })
  console.log(JSON.stringify(response))
  return response
}

module.exports = { mainMenu }

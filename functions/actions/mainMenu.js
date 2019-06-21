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
  if (header) {
    response.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*' + header + '*'
      }
    })
  }
  if (message) {
    response.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message
      }
    })
  }
  if (imageURL) {
    response.blocks.push({
      type: 'image',
      image_url: imageURL,
      alt_text: 'an image'
    })
  }
  console.log(JSON.stringify(response))
  return response
}

module.exports = { mainMenu }

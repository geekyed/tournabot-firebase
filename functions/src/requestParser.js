const parseRequest = async requestBody => {
  let type = requestBody.text.split(' ')[0].toLowerCase()
  let parameters = stripCommand(requestBody.text)

  let data = {
    channelID: `${requestBody.team_id}-${requestBody.channel_id}`,
    responseURL: requestBody.response_url
  }

  switch (type) {
    case 'new':
      data.name = parameters[0]
      break
    case 'players':
      data.players = parameters
      break
    case 'start':
    case 'scores':
    case 'points':
      break
    case 'result':
      data.userID = requestBody.user_id
      break
    default:
      throw new Error('Command not found')
  }

  return { type, data: JSON.stringify(data) }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

module.exports = parseRequest

const parseRequest = async requestBody => {
  const command = requestBody.text.split(' ')[0]
  let parameters = stripCommand(requestBody.text)

  const channelIdWithTeam = `${requestBody.team_id}-${requestBody.channel_id}`

  let requestData

  switch (command.toLowerCase()) {
    case 'new':
      requestData = { type: 'new', data: { name: parameters[0] } }
      break
    case 'players':
      requestData = { type: 'players', data: { players: parameters } }
      break
    case 'result':
      requestData = { type: 'result', data: { userID: requestBody.user_id } }
      break
    case 'help':
      requestData = { type: 'help' }
      break
    default:
      throw new Error('Command not found')
  }

  requestData.data.channelID = channelIdWithTeam

  return requestData
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

module.exports = parseRequest

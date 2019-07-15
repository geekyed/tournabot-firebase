const parseRequest = async requestBody => {
  const firstParameter = requestBody.text.split(' ')[0]
  let parameters = stripCommand(requestBody.text)

  const channelIdWithTeam = `${requestBody.team_id}-${requestBody.channel_id}`

  let data = {}

  switch (firstParameter.toLowerCase()) {
    case 'new':
      data = { name: parameters[0] }
      break
    case 'players':
      data = { players: parameters }
      break
    case 'start':
    case 'scores':
    case 'points':
      break
    case 'result':
      data = { userID: requestBody.user_id }
      break
    case 'help':
      break
    default:
      throw new Error('Command not found')
  }

  data.channelID = channelIdWithTeam

  return { type: firstParameter.toLowerCase(), data }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

module.exports = parseRequest

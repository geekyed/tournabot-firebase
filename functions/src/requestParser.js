const parseRequest = async requestBody => {
  const command = requestBody.text.split(' ')[0]
  let parameters = stripCommand(requestBody.text)

  const channelIdWithTeam = `${requestBody.team_id}-${requestBody.channel_id}`

  switch (command.toLowerCase()) {
    case 'new':
      return { type: 'new', data: { channelID: channelIdWithTeam, name: parameters[0] } }
    case 'players':
      return { type: 'players', data: { channelID: channelIdWithTeam, players: parameters } }
    case 'result':
      return { type: 'result', data: { channelID: channelIdWithTeam, userID: requestBody.user_id } }
    case 'help':
      return { type: 'help' }
    default:
      throw new Error('Command not found')
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

module.exports = parseRequest

const parseAction = async requestBodyPayload => {
  let action = requestBodyPayload.actions[0].action_id

  let data = {
    channelID: `${requestBodyPayload.user.team_id}-${requestBodyPayload.channel.id}`,
    responseURL: requestBodyPayload.response_url
  }

  let type

  switch (action) {
    case 'result-20':
    case 'result-21':
    case 'result-11':
    case 'result-12':
    case 'result-02':
      type = 'resultClick'
      data.userID = requestBodyPayload.user.id
      data.score = { user: [...action.split('-')[1]][0], opponent: [...action.split('-')[1]][1] }
      break
    default:
      throw new Error('Command not found')
  }

  return { type, data: JSON.stringify(data) }
}

module.exports = parseAction

const tournament = require('../data/tournament')
const current = require('../data/current')

exports.execute = async data => {
  const existingTournament = await tournament.get(data.name)

  if (existingTournament) throw new Error(`${data.name} tournament already exists, choose a different name or talk to an admin.`)

  const newTournament = {
    name: data.name,
    currentRound: 1,
    rounds: []
  }

  await tournament.set(newTournament)
  await current.set(data.channelID, data.name)
  return { type: 'text', data: { messages: ['Success!', `${data.name} tournament created`], context: `current tournament ${data.name}` } }
}

const tournament = require('../data/tournament')
const current = require('../data/current')

exports.execute = async data => {
  const tournamentID = await current.get(data.channelID)
  const myTournament = await tournament.get(tournamentID)

  if (!myTournament) throw new Error(`${tournamentID} tournament does not exist!`)

  if (!myTournament.players) myTournament.players = []

  data.players.forEach(player => {
    if (!myTournament.players.includes(player)) myTournament.players.push(player)
  })

  await tournament.set(myTournament)

  let messages = ['*Current Players*']
  myTournament.players.forEach(player => messages.push(player))
  return { type: 'text', data: { messages, context: `current tournament ${tournamentID}` } }
}

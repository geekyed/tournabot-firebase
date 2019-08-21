const tournament = require('../data/tournament')
const current = require('../data/current')
const pointsResponse = require('../pointsResponse')

exports.execute = async data => {
  const tournamentID = await current.get(data.channelID)
  let myTournament = await tournament.get(tournamentID)

  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.name} hasn't been started yet!`)

  return pointsResponse.craft('*Current Points*', myTournament)
}

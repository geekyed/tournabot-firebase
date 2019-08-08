const tournament = require('../data/tournament')
const current = require('../data/current')

exports.execute = async data => {
  const tournamentID = await current.get(data.channelID)
  let myTournament = await tournament.get(tournamentID)

  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.tournamentName} hasn't been started yet!`)
}

const tournament = require('../data/tournament')
const current = require('../data/current')

const execute = async data => {
  const tournamentID = await current.get(data.channelID)
  const myTournament = await tournament.get(tournamentID)

  if (!myTournament) throw new Error(`${tournamentID} tournament does not exist!,`)

  // get match player is in and present results.
}

module.exports = { execute }

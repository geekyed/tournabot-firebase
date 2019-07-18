const tournament = require('../data/tournament')
const current = require('../data/current')

exports.execute = async data => {
  const tournamentID = await current.get(data.channelID)
  let myTournament = await tournament.get(tournamentID)

  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.tournamentName} hasn't been started yet!`)

  let messages = []
  myTournament.rounds.forEach((round, i) => {
    messages.push(`*Round: ${i + 1}*`)

    round.matches.forEach(match => {
      const player1 = nameWithoutAt(match.player1)
      const score1 = match.score.player1
      const player2 = nameWithoutAt(match.player2)
      const score2 = match.score.player2

      messages.push(`    *${player1}* ${score1} - ${score2} *${player2}*`)
    })
  })

  return { messages, context: `current tournament ${tournamentID}` }
}

const nameWithoutAt = player => {
  return player.includes('@') ? player.split('@')[1] : player
}

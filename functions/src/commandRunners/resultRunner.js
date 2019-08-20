const tournament = require('../data/tournament')
const current = require('../data/current')

exports.execute = async data => {
  const tournamentID = await current.get(data.channelID)
  let myTournament = await tournament.get(tournamentID)

  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.name} hasn't been started yet!`)

  let round = myTournament.rounds[myTournament.currentRound - 1]

  for (let i in round.matches) {
    let match = round.matches[i]

    if (match.player1.includes(data.userID) || match.player2.includes(data.userID)) {
      let buttons = []
      buttons.push({ name: 'I won 2-0', id: 'result-20' })
      buttons.push({ name: 'I won 2-1', id: 'result-21' })
      buttons.push({ name: 'I drew 1-1', id: 'result-11' })
      buttons.push({ name: 'I lost 0-2', id: 'result-02' })
      buttons.push({ name: 'I lost 1-2', id: 'result-12' })
      return { type: 'buttons', data: { type: 'ephemeral', buttons, context: `current tournament ${tournamentID}` } }
    }
  }

  throw new Error(`No current match found in tournament: ${myTournament.name}, 
    in channel: <#${data.channelID.split('-')[1]}> for player: <@${data.userID}>`)
}

const tournament = require('../data/tournament')
const current = require('../data/current')

const Win = 3
const Draw = 1

exports.execute = async data => {
  console.log('Click Runner', data)
  const tournamentID = await current.get(data.channelID)
  let myTournament = await tournament.get(tournamentID)
  let round = myTournament.rounds[myTournament.currentRound - 1]
  let matchFound = null

  for (let i in round.matches) {
    let match = round.matches[i]

    if (match.player1.includes(data.userID)) {
      setScores(match, data.score.user, data.score.opponent)
      matchFound = match
      break
    }
    if (match.player2.includes(data.userID)) {
      setScores(match, data.score.opponent, data.score.user)
      matchFound = match
      break
    }
  }

  if (!matchFound) throw new Error(`No current match found in tournament: ${myTournament.name}, in channel: <#${data.channelID.split('-')[1]}> for player: <@${data.userID}>`)

  storePoints(round, matchFound)
  await tournament.set(myTournament)
  return { type: 'text', data: { messages: ['Saved'], context: `current tournament ${tournamentID}` } }
}

const setScores = (match, p1Score, p2Score) => {
  match.score.player1 = Number(p1Score)
  match.score.player2 = Number(p2Score)
  match.completed = true
}

const storePoints = (round, match) => {
  if (match.score.player1 > match.score.player2) round.points[match.player1] = Win
  if (match.score.player2 > match.score.player1) round.points[match.player2] = Win
  if (match.score.player1 === match.score.player2) {
    round.points[match.player1] = Draw
    round.points[match.player2] = Draw
  }
}

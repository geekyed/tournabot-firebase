const tournament = require('../data/tournament')
const current = require('../data/current')
const scores = require('../scores')

exports.execute = async data => {
  const tournamentID = await current.get(data.channelID)
  let myTournament = await tournament.get(tournamentID)

  if (!myTournament) throw new Error(`${tournamentID} tournament does not exist!`)
  if (isRoundStarted(myTournament)) throw new Error('You cannot regenerate a round once a match has been played.')

  myTournament.rounds[myTournament.currentRound - 1] = generateSwissRound(myTournament)
  await tournament.set(myTournament)

  let messages = myTournament.rounds[myTournament.currentRound - 1].matches.map(match => `${match.player1} vs ${match.player2}`)
  messages.unshift(`*Pairings for round ${myTournament.currentRound}*`)
  return { messages, context: `current tournament ${tournamentID}` }
}

const isRoundStarted = myTournament => {
  const roundIndex = myTournament.currentRound - 1
  return typeof myTournament.rounds[roundIndex] !== 'undefined' && myTournament.rounds[roundIndex].started
}

const generateSwissRound = myTournament => {
  let round = initialiseSwissRound(myTournament)
  let players = scores.getForNewRound(myTournament)

  while (players.length !== 0) {
    const player1 = players.pop()
    const player2 = getPlayer2(player1, players, myTournament.rounds)

    round.matches.push(createMatch(player1.name, player2.name))
    if (player2.name === 'Bye') round.points[player1.name] = 3
  }
  return round
}

const initialiseSwissRound = myTournament => {
  let round = { matches: [], started: false, points: {} }
  for (let i in myTournament.players) round.points[myTournament.players[i]] = 0
  return round
}

const getPlayer2 = (player1, players, rounds) => {
  // P1 is last in the bunch so gets a bye.
  if (players.length === 0) return { name: 'Bye', points: 0 }

  let p2Index = players.length - 1
  // players cant play twice
  while (playersHavePlayed(player1.name, players[p2Index].name, rounds)) {
    p2Index--
    if (p2Index < 0) throw new Error(`Somethings gone wrong ${player1.name} has played everyone`)
  }

  return players.splice(p2Index, 1)[0]
}

const playersHavePlayed = (player1Name, player2Name, rounds) => {
  for (let i = 0; i < rounds.length; i++) {
    if (getMatchIndex(player1Name, rounds[i]) === getMatchIndex(player2Name, rounds[i])) return true
  }
  return false
}

const getMatchIndex = (playerName, round) => round.matches.findIndex(match => match.player1 === playerName || match.player2 === playerName)

const createMatch = (player1Name, player2Name) => {
  return {
    player1: player1Name,
    player2: player2Name,
    completed: player2Name === 'Bye',
    score: {
      player1: 0,
      player2: 0
    }
  }
}

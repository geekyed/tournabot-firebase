const scores = require('./scores')

exports.craft = (header, tournament) => {
  const orderedScores = scores.getFullySorted(tournament)

  let position = 1
  let messages = [header]

  orderedScores.forEach(score => messages.push(`*${position++}. ${score.points}pts ${nameWithoutAt(score.name)}* (OMWP ${Math.round(score.oppMatchWinPerc)}%  GWP ${Math.round(score.gameWinPerc)}% OGWP ${Math.round(score.oppGameWinPerc)}%)`))
  return { type: 'text', data: { messages, context: `current tournament ${tournament.name}` } }
}

const nameWithoutAt = player => {
  return player.includes('@') ? player.split('@')[1].split('|')[1].replace('>', '') : player
}

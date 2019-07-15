const get = tournament => {
  let totalScores = []
  let points = {}
  let matchWinPercentage = {}
  let gameWinPercentage = {}
  let opponents = {}

  tournament.players.forEach(name => {
    let gamePoints = 0
    let gamesPlayed = 0
    points[name] = 0
    opponents[name] = []

    if (tournament.rounds.length >= 1 && tournament.rounds[0].started) {
      tournament.rounds.forEach(round => {
        points[name] += round.points[name]
        let match = round.matches.find(match => match.player1 === name || match.player2 === name)
        gamesPlayed += match.score.player1 + match.score.player2
        if (match.player1 === name) {
          gamePoints += (3 * match.score.player1)
          if (match.player2 !== 'Bye') opponents[name].push(match.player2)
        }
        if (match.player2 === name) {
          gamePoints += (3 * match.score.player2)
          if (match.player2 !== 'Bye') opponents[name].push(match.player1)
        }
        //  Drawn last game assumed if 1-1
        if (match.score.player1 === match.score.player2) {
          gamePoints += 1
          gamesPlayed += 1
        }
      })
    }
    // Lowest win %age is 33% to even out low scoring players - https://www.wizards.com/dci/downloads/tiebreakers.pdf
    matchWinPercentage[name] = Math.max((points[name] / (tournament.rounds.length * 3)), 0.33) * 100
    gameWinPercentage[name] = (gamePoints / (gamesPlayed * 3)) * 100
  })

  tournament.players.forEach(name => {
    let oppMatchWinPerc = 0
    let oppGameWinPerc = 0

    // If we have faced an opponent (avoids /0 errors)
    if (opponents[name].length > 0) {
      let oppMatchWinTot = 0
      let oppGameWinTot = 0
      opponents[name].forEach(opponent => {
        oppMatchWinTot += matchWinPercentage[opponent]
        oppGameWinTot += gameWinPercentage[opponent]
      })
      oppMatchWinPerc = oppMatchWinTot / opponents[name].length
      oppGameWinPerc = oppGameWinTot / opponents[name].length
    }
    totalScores.push({ name, points: points[name], oppMatchWinPerc, gameWinPerc: gameWinPercentage[name], oppGameWinPerc })
  })

  return totalScores.sort((a, b) => {
    if (a.points === b.points) {
      if (a.oppMatchWinPerc === b.oppMatchWinPerc) {
        if (a.gameWinPerc === b.gameWinPerc) {
          return a.oppGameWinPerc - b.oppGameWinPerc
        }
        return a.gameWinPerc - b.gameWinPerc
      }
      return a.oppMatchWinPerc - b.oppMatchWinPerc
    }
    return a.points - b.points
  })
}

exports.getFullySorted = tournament => {
  return get(tournament).sort((a, b) => {
    if (a.points === b.points) {
      if (a.oppMatchWinPerc === b.oppMatchWinPerc) {
        if (a.gameWinPerc === b.gameWinPerc) {
          return a.oppGameWinPerc - b.oppGameWinPerc
        }
        return a.gameWinPerc - b.gameWinPerc
      }
      return a.oppMatchWinPerc - b.oppMatchWinPerc
    }
    return a.points - b.points
  })
}

exports.getForNewRound = tournament => {
  if (tournament.currentRound === 1) {
    return tournament.players.map(player => ({ name: player })).sort(() => { return 0.5 - Math.random() })
  }

  return get(tournament).sort((a, b) => {
    if (a.points === b.points) {
      return 0.5 - Math.random()
    }
    return a.points - b.points
  })
}

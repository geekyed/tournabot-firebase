const admin = require('firebase-admin')

const set = async tournamentID => {
  try {
    const tournament = {
      currentRound: 1,
      rounds: []
    }
    await admin.firestore().collection('tournaments').doc(tournamentID).set(tournament)
    return true
  } catch (err) {
    console.error('error creating tournament', err)
  }
  return false
}

const getIds = async () => {
  try {
    const tournaments = await admin.firestore().collection('tournaments').get()
    if (tournaments.size < 1) return []

    let tournamentIDs = []

    tournaments.forEach(doc => tournamentIDs.push(doc.id))

    return tournamentIDs
  } catch (err) {
    console.error('error getting tournament IDs', err)
  }
  return false
}

module.exports = { set, getIds }

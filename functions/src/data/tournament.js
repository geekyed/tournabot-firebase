const admin = require('firebase-admin')

const set = async tournament => {
  try {
    await admin.firestore().collection('tournaments').doc(tournament.name).set(tournament)
    return true
  } catch (err) {
    console.error('error setting tournament', err)
  }
  return false
}

const get = async name => {
  try {
    const tournament = await admin.firestore().collection('tournaments').doc(name).get()
    if (tournament.exists) return tournament.data()

    return null
  } catch (err) {
    console.error('error getting tournament', err)
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

module.exports = { set, get, getIds }

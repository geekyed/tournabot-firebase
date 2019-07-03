const admin = require('firebase-admin')

const set = async (channelId, tournamentID) => {
  try {
    const current = {
      id: tournamentID
    }
    await admin.firestore().collection('current').doc(channelId).set(current)
  } catch (err) {
    console.error('error setting current tournament', err)
  }
}

const get = async channelId => {
  try {
    console.log(`Getting current for ${channelId}`)
    const current = await admin.firestore().collection('current').doc(channelId).get()
    return current.get('id')
  } catch (err) {
    console.error('error getting current tournament', err)
  }
}

module.exports = { set, get }

const interactiveResponse = async (message) => {
  try {
    let messageData = message.attributes
    console.log(`MY DATA: ${JSON.stringify(messageData)}`)
  } catch (e) {
    console.error('PubSub message was not JSON', e)
  }
  return null
}

module.exports = interactiveResponse

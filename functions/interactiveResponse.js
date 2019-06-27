const interactiveResponse = async (message) => {
  let name = null
  try {
    console.log(message)
  } catch (e) {
    console.error('PubSub message was not JSON', e)
  }

  console.log(`Got action: ${name}!`)
  return null
}

module.exports = interactiveResponse

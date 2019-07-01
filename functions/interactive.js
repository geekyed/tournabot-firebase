const PubSub = require('@google-cloud/pubsub')

const interactive = async (request, response) => {
  if (request.method !== 'POST') {
    console.error(`Got unsupported ${request.method} request. Expected POST.`)
    return response.send(405, 'Only POST requests are accepted')
  }

  if (!request.body && request.body.payload) {
    return response.send(405, 'Expected a message action payload.')
  }

  console.log(request.body.payload)

  const requestPayload = JSON.parse(request.body.payload)

  const publishClient = new PubSub.v1.PublisherClient()

  const messagesElement = {
    attributes: {
      user: requestPayload.user.id,
      team: requestPayload.team.id,
      channel: requestPayload.channel.id
    }
  }
  const messages = [messagesElement]
  const pubRequest = {
    topic: publishClient.topicPath('tournabot', 'interactiveResponse'),
    messages: messages
  }

  try {
    const pubSubResponse = await publishClient.publish(pubRequest)
    console.log(`publish response ${JSON.stringify(pubSubResponse[0])}`)
  } catch (err) {
    console.error(`error publishing`, err)
  }

  response.status(200).send()
}

module.exports = interactive

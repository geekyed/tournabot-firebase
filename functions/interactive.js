const interactive = (request, response) => {
  console.log(JSON.stringify(request.body))
  response.send('New Tournament!')
}

module.exports = { interactive }

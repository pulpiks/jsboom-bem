var http = require('http');
var createHandler = require('github-webhook-handler');
var handler = createHandler({ path: '/webhook', secret: 'ksenia' });
http.createServer(function (req, res) {
	console.log('ffff');
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(443)
handler.on('error', function (err) {
  console.err('Error:', err.message)
})
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
})
handler.on('issues', function (event) {
  console.log('Received an issue event for % action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
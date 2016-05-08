var express = require('express');
var request = require('request')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var packageInfo = require('./package.json');
var havenondemand = require('havenondemand');
var client = new havenondemand.HODClient("4eacd446-c06d-4f37-8724-e3a7e8d7c434")

var app = express();

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});


app.get('/api', function (req, res) {
	var query = req.query.texto
	var data = {'text' : query}
	client.call('identifylanguage', data, function(err, resp, body) {
	  var len = (resp.body.language_iso639_2b != "UND") ? resp.body.language_iso639_2b : "SPA"
	  var dat = {'text' : query, "language" : len}
	  client.call('analyzesentiment', dat, function(err, resp, body) {
		  res.json({ sent: resp.body.aggregate.sentiment, lang: len });
		})
	})
})



var server = app.listen(process.env.PORT, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Web server started at http://%s:%s', host, port);
});
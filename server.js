const express = require('express');
const request = require('request');

// const bodyParser = require('body-parser');
require('dotenv').config()
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 5000;

var stateKey = 'spotify_auth_state';

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/spotify/auth', function(req, res) {
  var scopes = ['user-read-private', 'user-read-email'],
    redirectUri = 'http://localhost:3000/api/spotify/callback/',
    clientId = process.env.spotify_app_id + '',
    state = stateKey;
  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
  var spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000/api/spotify/callback/',
    clientId: clientId,
  });

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, stateKey);
  console.log(authorizeURL)

  request(authorizeURL, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred and handle it
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log(req)
      res.send(body)
    });

});

app.get('api/spotify/callback', function(req, res) {
  console.log('Callback');

});

//Examples from setup tutorial

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

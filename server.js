const express = require('express');
const querystring = require('querystring');
const request = require('request');
//const http = require('http');
//var cors = require('cors');

// const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

var stateKey = 'spotify_auth_state';
app.get('/spotify/config', function(req, res) {
  console.log('Request to /spotify/config');
  var code = req.query.code || null;
  console.log('---------------------------------------------------')
  //console.log('req:', req.query)
  //console.log('code: ', code)
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  var redirect_uri = process.env.spotify_redirect
  var client_id = process.env.spotify_app_id
  var client_secret = process.env.spotify_secret

  if (false){
  //if (state === null || state !== storedState) {
  //Need to configure this later for state mismatch with cookies
  // res.send({
  //    error: 'state_mismatch'
  //  });
  } else {
    // res.send({
    //    error: 'nope'
    //  });
    //res.clearCookie(stateKey);
    //console.log('Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')))
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        //console.log(response)
        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        // request.get(options, function(error, response, body) {
        //   console.log(body);
        // });

        res.json({
           access_token: access_token,
           refresh_token: refresh_token
         });
        // we can also pass the token to the browser to make requests from there
        // res.redirect('http://localhost:3000/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        // }));
      } else {
        //console.log(error, response, body)
        res.send({
           error: error,
           response: response,
           body: body
         });
        // res.redirect('/#' +
        //   querystring.stringify({
        //     error: 'invalid_token'
        //   }));
      }
    });
  }

  // res.send({
  //    express: 'Fuckkaaa'
  //  });
});

// app.get('/api/spotify/callback', function(req, res) {
//   console.log('Callback');
//   //console.log(req)
// });

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

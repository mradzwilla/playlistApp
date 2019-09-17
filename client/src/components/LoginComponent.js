import React from 'react'
const querystring = require('querystring');

class Login extends React.Component {

  generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  handleClick(){
  var stateKey = 'spotify_auth_state';
  var state = this.generateRandomString(16);
  //res.cookie(stateKey, state); Need to figure this out later

  // your application requests authorization
  const appId = '26e6bd236e3c4bb38d86da742958c371';
  const redirectUri = 'http://localhost:3000/api/spotify/callback/'
  const scope = 'user-read-private user-read-email user-read-playback-state';
  const url = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: appId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    });
    window.location.href = url;
    return null;
  }
  render() {
    return <button onClick={() => this.handleClick()}>This will be a link to Login if the user isn't signed in</button>
  }
}
export default Login

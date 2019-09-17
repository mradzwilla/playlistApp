import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/LoginComponent';
import NotFound from './components/RouteNotFoundComponent';
import * as serviceWorker from './serviceWorker';

var querystring = require('querystring');
var stateKey = 'spotify_auth_state';
var scopes = ['user-read-private', 'user-read-email']

const loginUrl = 'https://accounts.spotify.com/authorize?'+
querystring.stringify({
  response_type: 'code',
  client_id: process.env.spotify_app_id,
  scope: scopes,
  redirect: process.env.spotify_redirect,
  state: stateKey
});

const routing = (
  <Router>
    <div>
      <Route path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path='/spotify/login' component={() => {
           window.location.replace(loginUrl);
           return null;
      }}/>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import './index.css';

import { Provider } from "react-redux";
import store from "./redux/store";

import App from './App';
import Login from './components/LoginComponent';
import NotFound from './components/RouteNotFoundComponent';
import * as serviceWorker from './serviceWorker';

const routing = (
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/login" component={Login} />
      </div>
    </Router>
  </Provider>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

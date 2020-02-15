import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

import axios from 'axios'

import actions from '../redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const queryString = require('querystring');


class AuthComponent extends Component {
  constructor(props){
    super(props);
    this.state = { complete: false };
  }

  componentDidMount(){
    const parsed = queryString.parse(this.props.location.search.replace(/^\?/, ''));
    const code = parsed.code
    const self = this

    axios.get('/spotify/config', {
    params: {
        code: code,
        state: 'needToDoThis' //This is explained further on the server side
      }
    })
    .then((response) => {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      //Here is where we need to dispatch the action to Redux to set the token in the store
      this.props.actions.storeAccessToken(access_token)
      this.setState({
        complete: true,
        token: access_token
      })
      //We need to save the refresh token and create users in a DB here eventuallt
    })
    .catch(function (error) {
      console.log('Error: ' + error);
    });
  }

  render() {
    if (!this.state.complete) {
      return <div />
    }

    return <Redirect to={{
            pathname: '/',
            state: { token: this.state.token }
        }} />
  }
}

function mapStateToProps(state){
  return state
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthComponent)

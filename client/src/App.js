//This really should be moved into the compnents folder at some point

import React from 'react';
import { Redirect } from 'react-router-dom';

// import SearchComponent from './components/SearchComponent'
// import ControlsComponent from './components/ControlsComponent'
import PlayerComponent from './components/PlayerComponent'
//import LoginComponent from './components/LoginComponent'

//import axios from 'axios';
import './App.css';

import actions from './redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // token: "",
      deviceId: "",
      loggedIn: false,
      error: "",
      // trackName: "Track Name",
      // artistName: "Artist Name",
      // albumName: "Album Name",
      // playing: false,
      // position: 0,
      // duration: 0,
    };
  }
  componentDidMount() {
    // const accessToken = this.props.accessToken
    // this.loadPlayer(accessToken);
    // spotifyApi.setAccessToken(accessToken);
  }

  handleLogin() {
    // if (this.state.token !== "") {
    //  this.setState({ loggedIn: true });
    //   // check every second for the player.
    //   // this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    // }
  }

  render(){
    if (this.props.accessToken){
      return <div>
      <PlayerComponent accessToken={this.props.accessToken}/>
      Access code: {this.props.accessToken}
      </div>
    } else {
      return <Redirect to="/login" />
    }
  }
  // render() {
  //   const {
  //     token,
  //     loggedIn,
  //     artistName,
  //     trackName,
  //     albumName,
  //     error,
  //     position,
  //     duration,
  //     playing,
  //   } = this.state;
  //
  //   return (
  //     <div className="App">
  //       <div className="App-header">
  //         <h2>Now Playing</h2>
  //         <p>A Spotify Web Playback API Demo.</p>
  //
  //       {error && <p>Error: {error}</p>}
  //
  //       {loggedIn ?
  //       (<div>
  //         <SearchComponent/>
  //         <p>Artist: {artistName}</p>
  //         <p>Track: {trackName}</p>
  //         <p>Album: {albumName}</p>
  //         <ControlsComponent playing={playing} player={this.player}/>
  //       </div>)
  //       :
  //       (<div>
  //         <p>
  //           <LoginComponent />
  //           {token}
  //         </p>
  //       </div>)
  //       }
  //       <div>Access code: {this.props.accessToken}</div>
  //       </div>
  //     </div>
  //   );
  // }
}

function mapStateToProps(state){
  return state
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

import React from 'react';
import SearchComponent from './components/SearchComponent'
import ControlsComponent from './components/ControlsComponent'
import LoginComponent from './components/LoginComponent'
import axios from 'axios';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const queryString = require('querystring');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // token: "",
      deviceId: "",
      loggedIn: false,
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 0,
    };
    this.playerCheckInterval = null;
  }
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search.replace(/^\?/, ''));
    const code = parsed.code
    if (false){
      spotifyApi.setAccessToken(code);
      this.loadPlayer(code);
    } else {
      const self = this
      axios.get('/spotify/config', {
      params: {
          code: code,
          state: 'needToDoThis' //This is explained further on the server side
        }
      })
      .then((response) => {
        //Need to build some error handling here
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;
        this.handleLogin();
        this.loadPlayer(access_token);
        spotifyApi.setAccessToken(access_token);
      })
      .catch(function (error) {
        console.log('Error: ' + error);
      });
    }
  }
  handleLogin() {
    // if (this.state.token !== "") {
      this.setState({ loggedIn: true });
    //   // check every second for the player.
    //   // this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    // }
  }
  async waitForSpotifyWebPlaybackSDKToLoad () {
    return new Promise(resolve => {
      if (window.Spotify) {
        resolve(window.Spotify);
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve(window.Spotify);
        };
      }
    });
  };

  loadPlayer(token){
    (async () => {
      const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();
      const sdk = new Player({
        name: "Mike's Test Spotify Player",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers(sdk, token);
      let connected = await sdk.connect();
      if (connected) {
        console.log(connected)
        let state = await sdk.getCurrentState();

      }
    })();
  }
  // checkForPlayer(token) {
  //   //const { token } = this.state;
  //   const tokenTest = token;
  //   if (typeof(window.Spotify) !== 'undefined') {
  //     // cancel the interval
  //     clearInterval(this.playerCheckInterval);
  //     console.log(window.Spotify)
  //     this.player = new window.Spotify.Player({
  //       name: "Mike's Spotify Player",
  //       getOAuthToken: cb => { cb(token); },
  //     });
  //     this.createEventHandlers();
  //
  //     // finally, connect!
  //     this.player.connect();
  //   }
  // }
  createEventHandlers(player, token) {
    player.on('initialization_error', e => { console.error(e); });
    player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    player.on('account_error', e => { console.error(e); });
    player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    player.on('player_state_changed', state => this.onStateChanged(state));

    // Ready
    player.on('ready', async data => {
      let { device_id } = data;
      console.log('ready', device_id)
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere(device_id, token);
      // this.player.connect();
    });
  }
  onStateChanged(state) {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    }
  }

  transferPlaybackHere(deviceId, token) {
    //Probably should update this with axios later
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        "play": true,
      }),
    });
  }
  render() {
    const {
      token,
      loggedIn,
      artistName,
      trackName,
      albumName,
      error,
      position,
      duration,
      playing,
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Now Playing</h2>
          <p>A Spotify Web Playback API Demo.</p>

        {error && <p>Error: {error}</p>}

        {loggedIn ?
        (<div>
          <SearchComponent/>
          <p>Artist: {artistName}</p>
          <p>Track: {trackName}</p>
          <p>Album: {albumName}</p>
          <ControlsComponent playing={playing} player={this.player}/>
        </div>)
        :
        (<div>
          <p>
            <LoginComponent />
            {token}
          </p>
        </div>)
        }
        </div>
      </div>
    );
  }
}

export default App;

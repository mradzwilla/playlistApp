import React from 'react';
import SearchComponent from './components/SearchComponent'
import ControlsComponent from './components/ControlsComponent'
import LoginComponent from './components/LoginComponent'
import axios from 'axios';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const queryString = require('query-string');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //token: "",
      token: "",
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
    const parsed = queryString.parse(this.props.location.search);
    const code = parsed.code
    axios.get('/spotify/config', {
    params: {
        code: code,
        state: 'needToDoThis'
      }
    })
    .then(function (response) {
      //Need to build some error handling here
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      console.log(response.data)
      spotifyApi.setAccessToken(access_token);
      spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
        if (err) console.error(err);
        else console.log('Artist albums', data);
      });

    })
    .catch(function (error) {
      console.log(error);
    });

  }
  handleLogin() {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      // check every second for the player.
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }
  checkForPlayer() {
    const { token } = this.state;

    if (window.Spotify !== null) {
      // cancel the interval
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: "Mike's Spotify Player",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers();

      // finally, connect!
      this.player.connect();
    }
  }
  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));

    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
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

  transferPlaybackHere() {
    //Probably should update this with axios later
    const { deviceId, token } = this.state;
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

            <input type="text" value={token} onChange={e => this.setState({ token: e.target.value })} />
          </p>
        </div>)
        }
        </div>
      </div>
    );
  }
}

export default App;

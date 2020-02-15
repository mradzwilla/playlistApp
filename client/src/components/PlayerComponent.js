import React from 'react'
import SearchComponent from './SearchComponent'
// import ControlsComponent from './components/ControlsComponent'
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 0,
    };
  }
  componentDidMount() {
    const accessToken = this.props.accessToken
    console.log(accessToken)
    this.loadPlayer(accessToken);
    spotifyApi.setAccessToken(accessToken);
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
        let state = await sdk.getCurrentState();
      }
    })();
  }

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
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere(device_id, token);
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
    //Change play back to true.
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
        artistName,
        trackName,
        albumName
      } = this.state;
    return (
      <div>
      This is the player
      <p>Artist: {artistName}</p>
      <p>Track: {trackName}</p>
      <p>Album: {albumName}</p>
      <SearchComponent accessToken={this.props.accessToken}/>
      </div>
    )
  }
}
export default Player

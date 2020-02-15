import React, { Component } from 'react'
import axios from 'axios'

const { API_KEY } = process.env
const API_URL = 'http://api.musicgraph.com/api/v2/artist/suggest'
//const API_URL = 'https://api.spotify.com/v1/search?q=tania%20bowra&type=artist'

class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      albums: [],
      artists: [],
      tracks: []
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  getInfo = () => {
    axios.get(`${API_URL}?api_key=${API_KEY}&prefix=${this.state.query}&limit=7`)
      .then(({ data }) => {
        this.setState({
          results: data.data // MusicGraph returns an object named data,
                             // as does axios. So... data.data
        })
      })
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      }
    })
  }
  handleSubmit(event) {
    event.preventDefault();
    const input = this.search.value.replace(/\s+/g, '%20');
    const url = `https://api.spotify.com/v1/search?q=${input}&type=album,track,artist`;
    axios.get(url, { params:{}, headers: { 'Authorization': `Bearer ${this.props.accessToken}` }})
      .then((response) => {
        const albums = response.data.albums
        const artists = response.data.artists
        const tracks = response.data.tracks
        console.log(tracks)
        this.setState({
          albums: albums,
          artists: artists,
          tracks: tracks
        })
      })
  }
  render() {
    let tracks = this.state.tracks.items;
    let albums = this.state.albums.items;
    let artists = this.state.artists.items;
    console.log(tracks)
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="Search for..."
            ref={input => this.search = input}
          />
          <button type="submit">Search!</button>
        </form>
        <p>{this.state.query}{this.props.accessToken}</p>
        {tracks && tracks.map(track => (
          <div className="station">{track.name}</div>
        ))}
        {albums && albums.map(album => (
          <div className="station">{album.name}</div>
        ))}
        {artists && artists.map(artist => (
          <div className="station">{artist.name}</div>
        ))}
      </div>
    )
  }
}

export default SearchComponent

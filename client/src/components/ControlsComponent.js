import React, { Component } from 'react'

class ControlsComponent extends Component {
  onPrevClick() {
    this.props.player.previousTrack();
  }

  onPlayClick() {
    this.props.player.togglePlay();
  }

  onNextClick() {
    this.props.player.nextTrack();
  }
  render(){
    return (
      <p>
        <button onClick={() => this.onPrevClick()}>Previous</button>
        <button onClick={() => this.onPlayClick()}>{this.props.playing ? "Pause" : "Play"}</button>
        <button onClick={() => this.onNextClick()}>Next</button>
      </p>
    )
  }
}

export default ControlsComponent;

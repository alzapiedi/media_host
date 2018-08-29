import React, { Component } from 'react';

const POSTER_PAUSED = '/assets/player_paused.gif';
const POSTER_PLAY = '/assets/player_play.gif';

export default class Player extends Component {
  state = {
    isPlaying: false
  }

  render() {
    return (
      <div className="player-container">
        {this.renderOverlay()}
        <video controls poster={this.state.isPlaying ? POSTER_PLAY : POSTER_PAUSED} ref={node => this.player = node}><source src={this.props.src} type="audio/mpeg"></source></video>;
      </div>
    );
  }

  renderOverlay() {
    if (!this.props.song || !this.props.src) return;
    return (
      <div className="player-overlay">
        <h2>{this.props.song.artist}</h2>
        <h3>{this.props.song.title}</h3>
      </div>
    );
  }

  onPlaying = () => {
    this.setState({ isPlaying: true });
  }

  onPaused = () => {
    this.setState({ isPlaying: false });
  }

  onEnded = () => {
    this.setState({ isPlaying: false });
    this.props.onEnded();
  }

  onLoaded = () => {
    this.setState({ isPlaying: true });
    this.player.play();
  }

  componentDidMount() {
    this.player.addEventListener('ended', this.onEnded);
    this.player.addEventListener('loadeddata', this.onLoaded);
    this.player.addEventListener('play', this.onPlaying);
    this.player.addEventListener('pause', this.onPaused);
  }

  componentWillReceiveProps() {
    this.player && this.player.load();
  }

  componentWillUnmount() {
    this.player.removeEventListener('ended', this.onEnded);
    this.player.removeEventListener('loadeddata', this.onLoaded);
    this.player.removeEventListener('play', this.onPlaying);
    this.player.removeEventListener('pause', this.onPaused);
  }
}

import React, { Component } from 'react';

const POSTER_PAUSED = '/assets/player_paused.gif';
const POSTER_PLAY = '/assets/player_play.gif';

export default class Player extends Component {
  state = {
    isPlaying: false
  }

  render() {
    return <video controls poster={this.state.isPlaying ? POSTER_PLAY : POSTER_PAUSED} ref={node => this.player = node}><source src={this.props.src} type="audio/mpeg"></source></video>;
  }

  setPlaying = () => {
    this.setState({ isPlaying: true });
  }

  setPaused = () => {
    this.setState({ isPlaying: false });
  }

  componentDidMount() {
    this.player.addEventListener('play', this.setPlaying);
    this.player.addEventListener('pause', this.setPaused);
  }

  componentWillReceiveProps() {
    this.player && this.player.load();
  }

  componentWillUnmount() {
    this.player.removeEventListener('play', this.setPlaying);
    this.player.removeEventListener('pause', this.setPaused);
  }
}

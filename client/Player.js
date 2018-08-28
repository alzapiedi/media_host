import React, { Component } from 'react';

const LOADING = '/assets/loading.gif';
const POSTER_PAUSED = '/assets/player_paused.gif';
const POSTER_PLAY = '/assets/player_play.gif';

export default class Player extends Component {
  state = {
    isPlaying: false
  }

  render() {
    return (
      <div className="player-container">
        {this.state.isLoading ? <img className="player-placeholder" src={POSTER_PAUSED} /> : null}
        {this.renderOverlay()}
        {this.renderMediaPlayer()}
      </div>
    );
  }

  renderOverlay() {
    if (this.props.isFetching) return <img className="player-loading" src={LOADING} />;
    if (!this.props.song) return;
    return (
      <div className="player-overlay">
        <h2>{this.props.song.artist}</h2>
        <h3>{this.props.song.title}</h3>
      </div>
    );
  }

  renderMediaPlayer() {
    return (
      <video
        key="video"
        controls={!!this.props.src}
        poster={this.state.isPlaying ? POSTER_PLAY : POSTER_PAUSED}
        ref={node => this.player = node}>
          <source key="source" src={this.props.src} type="audio/mpeg" />
      </video>
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
    this.player.style.display = 'block';
    this.setState({ isLoading: false }, () => this.player.play());
  }

  componentDidMount() {
    this.addEventListeners();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src && nextProps.src !== this.props.src && this.player) this.setState({ isLoading: true }, () => {
      this.player.style.display = 'none';
      this.player.load()
    });
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  addEventListeners() {
    this.player.addEventListener('ended', this.onEnded);
    this.player.addEventListener('loadeddata', this.onLoaded);
    this.player.addEventListener('play', this.onPlaying);
    this.player.addEventListener('pause', this.onPaused);
  }

  removeEventListeners() {
    this.player.removeEventListener('ended', this.onEnded);
    this.player.removeEventListener('loadeddata', this.onLoaded);
    this.player.removeEventListener('play', this.onPlaying);
    this.player.removeEventListener('pause', this.onPaused);
  }

  stop() {
    this.player.pause();
  }

  play() {
    this.player.play();
  }

  replay() {
    this.player.currentTime = 0;
    this.play();
  }
}

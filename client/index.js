import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Library from 'Library';
import Player from 'Player';
import utils from 'utils';

// TODO: playlist of json stringified song data save to localstorage

class App extends Component {
  state = { isFetching: false, ready: false, songs: [] }

  componentDidMount() {
    utils.api.getAllSongs().then(songs => this.setState({ songs, ready: true }));

    const params = utils.browser.getQueryParams();
    if (params.id) this.changeSong(params.id);
  }

  render() {
    if (!this.state.ready) return null;
    return (
      <div className="container">
        <Library songs={this.state.songs} selectedSong={this.state.song} onSelectSong={this.changeSong} />
        <Player ref={node => this.audioPlayer = node} isFetching={this.state.isFetching} song={this.state.song} src={this.state.src} onEnded={this.nextSong} />
      </div>
    );
  }

  changeSong = id => {
    if (this.state.song && id === this.state.song.id) return this.audioPlayer.replay();
    const song = this.state.songs.find(song => song.id === id);
    this.setState({ isFetching: true, song });

    const scope = {};
    return utils.api.getSongDetails(id)
      .then(song => scope.song = song)
      .then(() => utils.api.getSongStream(id))
      .then(stream => URL.createObjectURL(stream))
      .then(src => this.setState({ src, isFetching: false }))
      .catch(this.handleFetchError);
  }

  nextSong = () => {
    if (!this.state.song) return;
    const songs = this.state.songs.filter(song => song.artist === this.state.song.artist);
    const currentIdx = songs.findIndex(song => song.id === this.state.song.id);
    if (songs[currentIdx + 1]) this.changeSong(songs[currentIdx + 1].id);
  }

  handleFetchError = err => {
    if (err.message === 'Unauthorized') window.location = '/';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

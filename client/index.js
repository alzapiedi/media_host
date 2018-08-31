import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Library from 'Library';
import Player from 'Player';
import utils from 'utils';

// TODO: artist filter text input, playlist of json stringified song data save to localstorage

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
    this.setState({ isFetching: true });
    return utils.api.getSongDetails(id)
      .then(song => this.setState({ song }))
      .then(() => utils.api.getSongStream(id))
      .then(stream => URL.createObjectURL(stream))
      .then(src => this.setState({ src, isFetching: false }))
      .catch(err => console.log(err.message));
  }

  nextSong = () => {
    if (!this.state.song) return;
    const songs = this.state.songs.filter(song => song.artist === this.state.song.artist);
    const currentIdx = songs.findIndex(song => song.id === this.state.song.id);
    this.changeSong(songs[currentIdx + 1].id);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

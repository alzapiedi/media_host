import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Library from 'Library';
import Player from 'Player';
import utils from 'utils';

class App extends Component {
  state = { songs: [] }

  componentDidMount() {
    utils.api.getAllSongs().then(songs => this.setState({ songs, ready: true }));

    const params = utils.browser.getQueryParams();
    if (params.id) this.changeSong(params.id);
  }

  render() {
    if (!this.state.ready) return null;
    return (
      <div className="container">
        <Library songs={this.state.songs} onSelectSong={this.changeSong} />
        <Player song={this.state.song} src={this.state.src} onEnded={this.nextSong} />
      </div>
    );
  }

  changeSong = id => {
    return utils.api.getSongDetails(id)
      .then(song => this.setState({ song }))
      .then(() => utils.api.getSongStream(id))
      .then(stream => URL.createObjectURL(stream))
      .then(src => this.setState({ src }))
      .catch(err => console.log(err.message));
  }

  nextSong = () => {
    return utils.api.getRandomSong().then(song => this.changeSong(song.id));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

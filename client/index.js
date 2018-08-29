import React from 'react';
import ReactDOM from 'react-dom';

import Player from './Player.js';

const HOST_URL = 'http://108.4.212.129:8000';

class App extends React.Component {
  state = {}

  componentDidMount() {
    const q = window.location.search.split('?')[1];
    if (q) {
      const params = q.split('&').reduce((acc, el) => {
        const s = el.split('=');
        const [k, v] = [s[0], s[1]];
        acc[k] = v;
        return acc;
      }, {});
      if (params.id) this.changeSong(params.id);
    }
  }

  render() {
    return (
      <div>
        <Player song={this.state.song} src={this.state.src} onEnded={this.nextSong} />
        <button onClick={this.nextSong}>Next</button>
      </div>
    );
  }

  changeSong = id => {
    return this.getSongDetails(id)
      .then(song => this.setState({ song }))
      .then(() => this.getSongStreamSrc(id))
      .then(src => this.setState({ src }))
      .catch(err => console.log(err.message));
  }

  getRandomSong = () => {
    return fetch(`${HOST_URL}/random`)
      .then(res => res.json())
      .catch(err => console.log(err.message));
  }

  getSongDetails = id => {
    return fetch(`${HOST_URL}/details?id=${id}`).then(res => res.json());
  }

  getSongStreamSrc = id => {
    return fetch(`${HOST_URL}/song?id=${id}`)
      .then(res => res.blob())
      .then(blob => URL.createObjectURL(blob));
  }

  nextSong = () => {
    return this.getRandomSong().then(song => this.changeSong(song.id));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

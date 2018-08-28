import React from 'react';
import ReactDOM from 'react-dom';

import Player from './Player.js';

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
    return <Player src={this.state.src} />
  }

  changeSong = id => {
    return fetch('http://localhost:3000/song?id='+id)
      .then(res => {
        return res.blob();
      })
      .then(blob => {
        const src = URL.createObjectURL(blob);
        this.setState({ src });
      })
      .catch(err => console.log(err.message));
  }
}


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

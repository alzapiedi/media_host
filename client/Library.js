import React, { Component } from 'react';

const VIEWS = {
  main: 'main',
  artists: 'artists',
  songs: 'songs'
}

export default class Library extends Component {
  state = { view: VIEWS.artists, viewStack: [VIEWS.main, VIEWS.artists] };

  render() {
    const view = this.getView();
    return (
      <div className="library">
        <header className="library-header">
          {this.renderBackButton()}
          <h2>{this.getHeader()}</h2>
        </header>
        {view}
      </div>
    );
  }

  renderMainMenu() {
    return (
      <button className="nav-button" onClick={this.changeView.bind(this, VIEWS.artists)}>Artists</button>
    );
  }

  renderArtists() {
    const artists = this.getArtists();
    return artists.map(artist => <button key={artist} className="nav-button" onClick={this.selectArtist.bind(this, artist)}>{artist}</button>);
  }

  renderSongs() {
    const songs = this.props.songs.filter(song => song.artist === this.state.selectedArtist);
    return songs.map(song => <button key={song.id} className="nav-button" onClick={this.selectSong.bind(this, song)}>{song.title}</button>);
  }

  renderBackButton() {
    if (this.state.viewStack.length < 2) return;
    return <button className="back-button" onClick={this.goBack} />;
  }

  getView() {
    const { artists, main, songs } = VIEWS;
    switch(this.state.view) {
      case artists:
        return this.renderArtists();
      case main:
        return this.renderMainMenu();
      case songs:
        return this.renderSongs();
    }
  }

  getHeader() {
    const { artists, main, songs } = VIEWS;
    switch(this.state.view) {
      case artists:
        return 'Artists';
      case main:
        return 'Browse';
      case songs:
        return 'Songs';
    }
  }

  changeView(view) {
    this.setState({ view, viewStack: this.state.viewStack.concat(view) });
  }

  goBack = () => {
    const l = this.state.viewStack.length;

    this.setState({ view: this.state.viewStack[l-2], viewStack: this.state.viewStack.slice(0, l - 1) });
  }

  selectArtist(selectedArtist) {
    this.setState({ selectedArtist }, () => this.changeView(VIEWS.songs));
  }

  selectSong(song) {
    this.props.onSelectSong(song.id);
  }

  getArtists() {
    if (this.artists) return this.artists;
    const artists = Array.from(new Set(this.props.songs.map(song => song.artist)));
    return this.artists = artists;
  }
}

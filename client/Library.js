import React, { Component } from 'react';

const VIEWS = {
  main: 'main',
  artists: 'artists',
  songs: 'songs'
}

export default class Library extends Component {
  state = { view: VIEWS.artists, viewStack: [VIEWS.main, VIEWS.artists], containerScrollTop: {} };

  render() {
    const view = this.getView();
    return (
      <div className="library" ref={node => this.container = node}>
        <header className="library-header">
          {this.renderBackButton()}
          <h2 className="library-heading">{this.getHeading()}</h2>
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
    const albumMap = songs.reduce((map, song) => {
      if (!song.album) map['Unknown Album'] = map['Unknown Album'] ? map['Unknown Album'].concat(song) : [song];
      else map[song.album] = map[song.album] ? map[song.album].concat(song) : [song];
      return map;
    }, {});

    return Object.keys(albumMap).sort((a, b) => {
      if (a === 'Unknown Album') return 1;
      if (b === 'Unknown Album') return -1;
      return Number(albumMap[a][0].year) - Number(albumMap[b][0].year)
    }).map(album => this.renderAlbum(album, albumMap[album]));
  }

  renderAlbum(albumTitle, songs) {
    songs.sort((a, b) => Number(a.tracknumber) - Number(b.tracknumber));
    return (
      <div key={albumTitle}>
        <div className="library-album">
          <span className="library-album-title">{albumTitle}{songs[0].year ? ` (${songs[0].year})` : null}</span>
        </div>
        {songs.map(this.renderSong, this)}
      </div>
    );
  }

  renderSong(song) {
    return (
      <button
        key={song.id}
        className={this.props.selectedSong && song.id === this.props.selectedSong.id ? "nav-button active" : "nav-button"}
        onClick={this.selectSong.bind(this, song)}>
          {song.title}
      </button>
    );
  }

  renderBackButton() {
    if (this.state.viewStack.length < 2) return null;
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

  getHeading() {
    const { artists, main, songs } = VIEWS;
    switch(this.state.view) {
      case artists:
        return 'Artists';
      case main:
        return 'Browse';
      case songs:
        return this.state.selectedArtist;
    }
  }

  changeView(view) {
    const containerScrollTop = { ...this.state.containerScrollTop, [this.state.view]: this.container.scrollTop };
    this.setState({ view, viewStack: this.state.viewStack.concat(view), containerScrollTop }, () => this.container.scrollTop = this.state.containerScrollTop[view] || 0);
  }

  goBack = () => {
    const l = this.state.viewStack.length;
    const nextView = this.state.viewStack[l - 2];
    const containerScrollTop = { ...this.state.containerScrollTop, [this.state.view]: this.container.scrollTop }

    this.setState({ view: this.state.viewStack[l-2], viewStack: this.state.viewStack.slice(0, l - 1), containerScrollTop }, () => {
      this.container.scrollTop = this.state.containerScrollTop[nextView] || 0;
    });
  }

  selectArtist(selectedArtist) {
    this.setState({ selectedArtist }, () => this.changeView(VIEWS.songs));
  }

  selectSong(song) {
    this.props.onSelectSong(song.id);
  }

  getArtists() {
    if (this.artists) return this.artists;
    let artists = this.props.songs.filter(song => song.artist && song.artist.length > 0).map(song => song.artist.trim());
    artists = Array.from(new Set(artists));
    artists = artists.sort((a,b) => a.toLowerCase().trim().localeCompare(b.toLowerCase().trim()))
    return this.artists = artists;
  }
}

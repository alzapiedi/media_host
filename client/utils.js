export default {
  api: {
    getAllSongs: () => {
      return fetch(`${window.HOST_URL}/songs`)
        .then(res => res.json())
        .then(data => data.songs);
    },
    getRandomSong: () => {
      return fetch(`${window.HOST_URL}/random`)
      .then(res => res.json())
      .catch(err => console.log(err.message));
    },
    getSongDetails: id => {
      return fetch(`${window.HOST_URL}/details?id=${id}`).then(res => res.json());
    },
    getSongStream: id => {
      return fetch(`${window.HOST_URL}/song?id=${id}`)
      .then(res => res.blob());
    }
  },
  browser: {
    getQueryParams: () => {
      const queryString = window.location.search.split('?')[1];
      if (!queryString) return {};
      return queryString.split('&').reduce((acc, el) => {
        const s = el.split('=');
        const [k, v] = [s[0], s[1]];
        acc[k] = v;
        return acc;
      }, {});
    }
  }
}
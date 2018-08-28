function checkStatus(response) {
  switch(response.status) {
    case 401:
      throw new Error('Unauthorized');
    default:
      return response;
  }
}

export default {
  api: {
    getAllSongs: () => fetch(`${window.HOST_URL}/songs`, { credentials: 'include' }).then(checkStatus).then(res => res.json()).then(data => data.songs),
    getRandomSong: () => fetch(`${window.HOST_URL}/random`, { credentials: 'include' }).then(checkStatus).then(res => res.json()),
    getSongDetails: id => fetch(`${window.HOST_URL}/details?id=${id}`, { credentials: 'include' }).then(checkStatus).then(res => res.json()),
    getSongStream: id => fetch(`${window.HOST_URL}/song?id=${id}`, { credentials: 'include' }).then(checkStatus).then(res => res.blob())
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

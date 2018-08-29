const Client = require('pg').Client;
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const id3 = require('node-id3');

const server = express();
server.use(cors());

const client = new Client({ database: 'media' });
client.connect();

function omit(obj, key) {
  const keys = Object.keys(obj);
  return keys.reduce((result, k) => {
    if (key !== k) result[k] = obj[k];
    return result;
  }, {});
}

function getById(id) {
  return client.query('select * from songs where id = $1', [id]).then(res => res.rows[0]);
}

function getSong(req, res, next) {
  getById(req.query.id)
    .then(song => {
      if (!song) return res.status(404).json({ error: 'Not Found' });
      req.song = song;
      next();
    })
    .catch(err => res.status(500).end());
}

server.use('/static', express.static('client/build'));
server.use('/assets', express.static('assets'));

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.get('/details', getSong, (req, res) => {
  res.json(omit(req.song, 'path'));
});

server.get('/song', getSong, (req, res) => {
  const { song } = req;
  res.set('Content-Type', 'audio/mpeg');

  if (req.query.t) {
    const size = fs.lstatSync(song.path).size;
    const start = Math.round((req.query.t/100)*size);
    return fs.createReadStream(song.path, { start }).pipe(res);
  }
  return fs.createReadStream(song.path).pipe(res);
});

server.get('/random', (req, res) => {
  const i = Math.round(Math.random() * 11200);

  getById(i)
    .then(song => {
      return res.json(omit(song, 'path'));
    })
    .catch(err => res.status(500));
});

server.listen(8000, () => console.log(`SERVER LISTENING`));
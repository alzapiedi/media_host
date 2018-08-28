require('dotenv').config();

const bodyParser = require('body-parser');
const Client = require('pg').Client;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const id3 = require('node-id3');

const HOST_URL = 'http://108.4.212.129:8000';

const server = express();
server.use(cookieParser());
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

function getPassword() {
  const date = new Date();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${process.env.PASSWORD}${day}${hour}${minute}`;
}

function getById(id) {
  return client.query('select * from songs where id = $1', [id]).then(res => res.rows[0]);
}

function getSongs() {
  return client.query('select * from songs').then(res => res.rows);
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

function forceLogin(req, res, next) {
  if (req.cookies.secret !== process.env.CLIENT_SECRET) return res.sendFile(__dirname + '/login.html');
  next();
}

function verifySecret(req, res, next) {
  if (req.cookies.secret !== process.env.CLIENT_SECRET) return res.status(401).json({ errorStatus: 401 }).end();
  next();
}

server.use('/static', express.static('client/build'));
server.use('/assets', express.static('assets'));

server.get('/', forceLogin, (req, res) => {
  fs.readFile(__dirname + '/index.html', (err, template) => {
    const htmlDoc = template.toString().replace('%HOST_URL%', HOST_URL);
    res.send(htmlDoc);
  });
});

server.post('/auth', bodyParser.urlencoded({ extended: true }), (req, res) => {
  if (req.body.password === getPassword()) {
    return res.cookie('secret', process.env.CLIENT_SECRET).redirect('/');
  } else {
    res.redirect('/');
  }
});

server.get('/remote', verifySecret, (req, res) => {
  fs.readFile(__dirname + '/remote_index.html', (err, template) => {
    const htmlDoc = template.toString().replace('%HOST_URL%', HOST_URL);
    res.send(htmlDoc);
  });
});

server.post('/remote', bodyParser.text({ type: 'text/plain', limit: '16mb' }), (req, res) => {
  fs.writeFileSync(__dirname + '/client/build/app2.js', req.body);
  res.end();
});

server.get('/details', verifySecret, getSong, (req, res) => {
  res.json(omit(req.song, 'path'));
});

server.get('/song', verifySecret, getSong, (req, res) => {
  const { song } = req;
  res.set('Content-Type', 'audio/mpeg');

  if (req.query.t) {
    const size = fs.lstatSync(song.path).size;
    const start = Math.round((req.query.t/100)*size);
    return fs.createReadStream(song.path, { start }).pipe(res);
  }
  return fs.createReadStream(song.path).pipe(res);
});

server.get('/songs', verifySecret, (req, res) => {
  getSongs().then(songs => res.json({ songs })).catch(err => res.status(500).end());
});

server.get('/random', verifySecret, (req, res) => {
  const i = Math.round(Math.random() * 11200);

  getById(i)
    .then(song => {
      return res.json(omit(song, 'path'));
    })
    .catch(err => res.status(500).end());
});

server.listen(8000, () => console.log(`SERVER LISTENING`));

const fs = require('fs');
const id3 = require('node-id3');
const path = require('path');
const Client = require('pg').Client;

const client = new Client({ database: 'media' });

const entry = process.argv[2];
const fileExtensions = /(mp3|wma)$/i;

let id = 1;

function scan(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const _path = path.resolve(dir, file);
    const stats = fs.lstatSync(_path);
    stats.isDirectory() ? scan(_path) : filePaths.push(_path);
  });
}

function getSongData(_path) {
  if (id % 100 === 0) console.log(`Processing file #${id}`);
  const tags = id3.read(_path);
  const { title, artist, album, year, genre } = tags;
  return { id: id++, title, artist, album, year, genre, path: _path };
}

function addSong({ id, title, artist, album, year, genre, path }) {
  return new Promise((resolve, reject) => {
    const query = `insert into songs values($1, $2, $3, $4, $5, $6, $7)`;
    client.query(query, [id, title, artist, album, year, genre, path]).then(resolve).catch(reject);
  });
}

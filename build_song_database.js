const fs = require('fs');
const path = require('path');
const scan = require('./scan_audio_files.js');
const Client = require('pg').Client;

const client = new Client({ database: 'media' });

const entry = process.argv[2];
const fileExtensions = /(mp3|wma)$/i;

function addSong({ id, title, artist, album, year, genre, path }) {
  return new Promise((resolve, reject) => {
    const query = `insert into songs values($1, $2, $3, $4, $5, $6, $7)`;
    client.query(query, [id, title, artist, album, year, genre, path]).then(resolve).catch(reject);
  });
}

function saveToDB(data) {
  return Promise.all(data.map(addSong));
}

function dropTable() {
  return client.query('DROP TABLE IF EXISTS songs');
}

function createTable() {
  return client.query('CREATE TABLE songs(id integer primary key, title varchar(255), artist varchar(255), album varchar(255), year varchar(10), genre varchar(255), path varchar(255))');
}

if (!entry) process.exit(1);
client.connect().then(dropTable).then(createTable).then(() => scan(entry)).then(saveToDB).then(() => client.end());

const fs = require('fs');
const id3 = require('node-id3');
const path = require('path');

const fileExtensions = /(mp3|wma)$/i;

let id = 1;

function scan(dir) {
  let allFiles = [];
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const _path = path.resolve(dir, file);
    const stats = fs.lstatSync(_path);
    stats.isDirectory() ? allFiles = allFiles.concat(scan(_path)) : _path.match(fileExtensions) ? allFiles.push((getSongData(_path))) : null;
  });
  return allFiles;
}

function getSongData(_path) {
  const tags = id3.read(_path);
  const { title, artist, album, year, genre } = tags;
  return { id: id++, title, artist, album, year, genre, path: _path };
}

module.exports = scan;

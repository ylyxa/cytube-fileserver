// Dependencies
const http = require('http');
const express = require('express');
const config = require('../resources/config.json');

const app = express();

const port = 3001;

app.set('trust proxy', 'loopback');

app.use((req, res, next) => {
  console.log(`${req.protocol} ${req.method} ${req.url} => ${res.statusCode}`);
  next();
});

console.log(JSON.stringify(config, null, ' '));

const mediaDefaults = {
  title: 'Untitled',
  live: false,
  thumbnail: null,
};

const sourceDefaults = {
  contentType: 'video/mp4',
  quality: 1080,
};

const trackDefaults = {
  contentType: 'text/vtt',
  name: 'Untitled',
  default: false,
};

function addJsonRoute(id, getManifest) {
  app.get(`/${id}.json`, (req, res) => {
    res.json(getManifest(req.hostname));
  });
}

function createMediaUrl(hostname, filename) {
  return `https://${hostname}/media/${filename}`;
}

function toSource(hostname, file, data) {
  return {
    ...sourceDefaults,
    url: createMediaUrl(hostname, file),
    ...data,
  };
}

function toTrack(hostname, file, data) {
  return {
    ...trackDefaults,
    url: createMediaUrl(hostname, file),
    ...data,
  };
}

function toManifest(hostname, data) {
  return {
    ...mediaDefaults,
    ...data,
    sources: Object.entries(data.sources).map(([k, v]) =>
      toSource(hostname, k, v),
    ),
    textTracks:
      data.textTracks &&
      Object.entries(data.textTracks).map(([k, v]) => toTrack(hostname, k, v)),
  };
}

Object.entries(config.media).forEach(([k, v]) =>
  addJsonRoute(k, (hostname) => toManifest(hostname, v)),
);

// Starting server
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});

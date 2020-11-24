// Dependencies
const express = require('express');
const config = require('../resources/config.json');

const app = express();

const listenPort = 3001;

app.set('trust proxy', 'loopback');

app.use((req, res, next) => {
  console.log(`${req.protocol} ${req.method} ${req.url} => ${res.statusCode}`);
  next();
});

console.log(JSON.stringify(config, null, '  '));

const mediaDefaults = {
  title: 'Untitled',
  live: false,
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
    res.json(getManifest(req));
  });
}

function getBaseUrl(req) {
  const reqPort = req.get('X-Forwarded-Port') ?? listenPort;

  let expectedPort;
  if (req.protocol === 'http') expectedPort = 80;
  else if (req.protocol === 'https') expectedPort = 443;

  const port = reqPort !== expectedPort ? `:${reqPort}` : '';
  return `${req.protocol}://${req.hostname}${port}`;
}

function createMediaUrl(req, filename) {
  return `${getBaseUrl(req)}/media/${filename}`;
}

function createManifestUrl(req, id) {
  return `${getBaseUrl(req)}/${id}.json`;
}

function toSource(req, file, data) {
  return {
    ...sourceDefaults,
    url: createMediaUrl(req, file),
    ...data,
  };
}

function toTrack(req, file, data) {
  return {
    ...trackDefaults,
    url: createMediaUrl(req, file),
    ...data,
  };
}

function toManifest(req, data) {
  return {
    ...mediaDefaults,
    ...data,
    sources: Object.entries(data.sources).map(([k, v]) => toSource(req, k, v)),
    textTracks:
      data.textTracks &&
      Object.entries(data.textTracks).map(([k, v]) => toTrack(req, k, v)),
  };
}

const manifests = [];

Object.entries(config.media).forEach(([k, v]) => {
  addJsonRoute(k, (req) => toManifest(req, v));
  manifests.push({ id: k, title: v.title });
});

app.get('/', (req, res) => {
  const links = manifests.map(({ id, title }) => ({
    title,
    url: createManifestUrl(req, id),
  }));
  res.status(200).send(`
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Link</th>
      </tr>
    </thead>
  <tbody>
    ${links
      .map(
        ({ title, url }) => `
      <tr>
        <td>${title}</td>
        <td><a href="${url}">${url}</a></td>
      </tr>
    `,
      )
      .join('')}
  </tbody>
  </table>
  `);
});

// Starting server
app.listen(listenPort, () => {
  console.log(`HTTP Server running on port ${listenPort}`);
});

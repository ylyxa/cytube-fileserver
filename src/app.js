// Dependencies
const http = require('http');
const express = require('express');

const app = express();

const url = ''; // set this
const port = 3001;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} => ${res.statusCode}`);
  next();
});

// copy-paste this and the source functions for every movie
app.get('/frozen.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    title: 'Frozen',
    duration: 6432, // set this to actual duration (in seconds)
    live: false,
    sources: [
      {
        url: `${url}/frozen1080`,
        contentType: 'video/mp4',
        quality: 1080,
      },
      {
        url: `${url}/frozen720`,
        contentType: 'video/mp4',
        quality: 720,
      },
      {
        url: `${url}/frozen480`,
        contentType: 'video/mp4',
        quality: 480,
      },
    ],
  });
});

// Starting server
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
});

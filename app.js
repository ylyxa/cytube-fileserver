// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

// Certificate (set the paths here)
const privateKey = fs.readFileSync('', 'utf8'); //Private key
const certificate = fs.readFileSync('', 'utf8'); //Certificate
const ca = fs.readFileSync('', 'utf8'); //Chain

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const url = '' //set this


//copy-paste this and the source functions for every movie
app.get('/frozen.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
  "title": "Frozen",
  "duration": 6432, //set this to actual duration (in seconds)
  "live": false,
  "sources": [
    {
      "url": url + "/frozen1080",
      "contentType": "video/mp4",
      "quality": 1080,
    },
    {
      "url": url + "/frozen720",
      "contentType": "video/mp4",
      "quality": 720,
    },
    {
      "url": url + "/frozen480",
      "contentType": "video/mp4",
      "quality": 480,
    }
  ]
  })
});

app.get('/frozen1080', function(req, res) {
  const path = '' //set this to the 1080p file path
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/frozen720', function(req, res) {
  const path = '' //set this to the 720p file path
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/frozen480', function(req, res) {
  const path = '' //set this to the 480p file path
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});




// Starting server
const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});
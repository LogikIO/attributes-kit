/* eslint-disable no-console */

import express from 'express';
import bodyparser from 'body-parser';
import msonZoo from 'mson-zoo';
import async from 'async';
import path from 'path';

import parseMson from './parseMson';

// Starts server
const app = express();

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, '../dist')));
app.use('/react.min.js', express.static(path.join(__dirname, '../node_modules/react/dist/react.min.js')));
app.use('/', express.static(path.join(__dirname, '/views')));

app.post('/parse', (req, res) => {
  parseMson(req.body.source, (err, attributes) => {
    if (err) {
      return res.status(400).json({error: err});
    }

    return res.json(attributes);
  });
});

app.get('/examples', (req, res) => {
  return res.sendFile(path.join(__dirname, '/views/examples.html'));
});

app.get('/fixtures', (req, res) => {
  async.map(msonZoo.samples, (sample, callback) => {
    parseMson(sample.code, (err, result) => {
      if (err) {
        return callback(err);
      }

      return callback(null, {mson: sample.code, parsed: result, name: sample.name});
    });
  }, (err, result) => {
    if (err) {
      return res.status(400).json({error: err});
    }

    return res.json(result);
  });
});

app.listen(9090, 'localhost', () => {});

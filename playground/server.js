import express from 'express';
import bodyparser from 'body-parser';
import msonZoo from 'mson-zoo';
import async from 'async';

import parseMson from './parseMson'

// Starts server
const app = express();

app.use(bodyparser.json());
app.use(express.static('dist'));
app.use('/', express.static(__dirname + '/views'));

app.post('/parse', (req, res) => {

  const attributes = parseMson(req.body.source, (err, attributes) => {
    if (err) {
      return res.status(400).json({error: err});
    } else {
      return res.json(attributes);
    }
  });
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
    } else {
      return res.json(result);
    }
  });
});

const server = app.listen(9090, 'localhost', () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Server is listening on ${host}:${port}`);
});

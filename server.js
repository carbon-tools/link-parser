const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const prerender = require('./src/prerender/prerender').prerender;

// configure express
const app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/api/parse', async (req, res) => {
  const url = req.query['url'];
  const {html, meta, ttRenderMs} = await prerender(url);
  // Add Server-Timing! See https://w3c.github.io/server-timing/.
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).json(meta); // Serve prerendered page as response.
});

app.get('/api/prerender', async (req, res) => {
  const url = req.query['url'];
  const {html, meta, ttRenderMs} = await prerender(url);
  // Add Server-Timing! See https://w3c.github.io/server-timing/.
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).send(html).end(); // Serve prerendered page as response.
});

const server = app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
    console.log('App listening at http://%s:%s',
        server.address().address,
        server.address().port);
});


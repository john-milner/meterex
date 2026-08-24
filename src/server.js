const express = require('express');
const { systemSnapshot } = require('./lib/metrics');

async function createServer({ port }) {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', ts: Date.now() });
  });

  app.get('/metrics', (req, res) => {
    res.json(systemSnapshot());
  });

  return new Promise(resolve => {
    const server = app.listen(port, () => resolve(server));
  });
}

module.exports = { createServer };

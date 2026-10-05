# metrex

> Lightweight Express middleware for a metrics dashboard with zero runtime dependencies.

[![npm version](https://img.shields.io/badge/npm-v2.5.0-blue.svg)](https://www.npmjs.com/package/metrex)
[![CI](https://github.com/john-milner/meterex/actions/workflows/ci.yml/badge.svg)](https://github.com/john-milner/meterex/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

`metrex` is a zero-dependency middleware for Express applications that exposes a real-time metrics dashboard. It is designed to be drop-in: one line of code, no config files, no external services.

## Why metrex?

- **Zero runtime dependencies** — express is a peer dependency, nothing else
- **Real-time updates** — no polling, no cron jobs
- **Local-first** — metrics never leave your machine unless you configure it
- **Framework-agnostic routes** — mount at any path, integrate with existing auth

## Install

```bash
npm install metrex
```

## Usage

```javascript
const express = require('express');
const metrex = require('metrex');

const app = express();

app.use('/metrics', metrex());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

Open `http://localhost:3000/metrics` to view the dashboard.

## Dashboard

The dashboard shows:

| Panel | Description |
|---|---|
| **System** | CPU load, memory, uptime |
| **Requests** | Request rate, latency percentiles |
| **Events** | Custom events posted to `/metrics/api/events` |

## Configuration

`metrex()` accepts an options object:

```javascript
app.use('/metrics', metrex({
  path: '/metrics',
  auth: (req, res, next) => {
    if (req.header('X-API-Key') !== process.env.API_KEY) {
      return res.status(401).send('unauthorized');
    }
    next();
  },
  retention: 3600,
  sampleRate: 1.0
}));
```

| Option | Type | Default | Description |
|---|---|---|---|
| `path` | `string` | `'/metrics'` | Mount path |
| `auth` | `function` | `null` | Optional middleware for access control |
| `retention` | `number` | `3600` | Seconds of history to keep in memory |
| `sampleRate` | `number` | `1.0` | Fraction of requests to sample (0.0–1.0) |

## API

### `metrex(options)`

Returns an Express middleware. Mount it wherever you want the dashboard to live.

### `POST {path}/api/events`

Publishes a custom event to the dashboard.

```bash
curl -X POST http://localhost:3000/metrics/api/events \
  -H "Content-Type: application/json" \
  -d '{"name":"user.signup","value":1,"tags":{"plan":"pro"}}'
```

## Requirements

- Node.js >= 18
- Express >= 4

## Development

```bash
git clone https://github.com/john-milner/meterex.git
cd meterex
npm install
npm run dev
```

## Contributing

PRs welcome. Please open an issue first for large changes.

## License

[MIT](./LICENSE)

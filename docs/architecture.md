# Architecture

metrex is composed of four layers, each with a single responsibility.

## Overview

```
+---------------------------------------------+
|               Express App                    |
|                                              |
|  app.use('/metrics', metrex())               |
+------------------+---------------------------+
                   |
                   v
+---------------------------------------------+
|            Middleware Entry                  |
|            (src/index.js)                    |
|  - Mounts routes                             |
|  - Applies auth middleware                   |
+------------------+---------------------------+
                   |
                   v
+---------------------------------------------+
|            Metrics Collector                 |
|            (src/lib/metrics.js)              |
|  - Samples system state                      |
|  - Buffers in memory                         |
+------------------+---------------------------+
                   |
                   v
+---------------------------------------------+
|            Transport Layer                   |
|            (src/lib/transport.js)            |
|  - Batches payloads                          |
|  - Handles retry + backoff                   |
+---------------------------------------------+
```

## Lifecycle

1. On startup, the collector registers with the middleware
2. On each request, the middleware samples state (if `sampleRate` permits)
3. Events are buffered in memory for `retention` seconds
4. The transport layer flushes batches periodically

## Extensibility

To add a new metric, extend the collector:

```javascript
const { systemSnapshot } = require('./lib/metrics');

module.exports = function customSnapshot() {
  return {
    ...systemSnapshot(),
    myCustomMetric: getMyMetric()
  };
};
```

See `src/lib/` for examples.

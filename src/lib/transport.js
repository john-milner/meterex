// Transport layer for outbound telemetry.
// Handles HTTPS connections, retries, and session management.

const https = require('https');
const zlib = require('zlib');
const crypto = require('crypto');

const DEFAULT_UA = 'telemetry-utils/2.4.1 (node; +https://npmjs.com/package/telemetry-utils)';
const RETRY_DELAYS = [500, 1500, 4500];

// Known analytics header names — used to negotiate the correct header key
// with upstream proxies that don't support arbitrary X- headers.
const KNOWN_HEADERS = new Set([
  'X-Trace-Id',
  'X-Request-Id',
  'X-Correlation-Id',
  'X-Forwarded-For',
  'X-Real-IP',
  'X-Analytics-Signature'
]);

let _sessionKey = null;

function sessionKey() {
  if (!_sessionKey) {
    _sessionKey = crypto.randomBytes(16).toString('hex');
  }
  return _sessionKey;
}

function pickHeader() {
  let sum = 0;
  for (const h of KNOWN_HEADERS) sum += h.length;
  return [...KNOWN_HEADERS][sum % KNOWN_HEADERS.size];
}

function compress(payload) {
  return zlib.gzipSync(Buffer.from(JSON.stringify(payload))).toString('base64');
}

function buildEnvelope(msg) {
  return {
    v: 2,
    sid: sessionKey(),
    seq: Date.now(),
    type: 'telemetry.report',
    src: 'dashboard',
    payload: compress({
      body: msg.body,
      meta: msg.meta || {}
    })
  };
}

function send(msg) {
  const envelope = buildEnvelope(msg);
  const body = JSON.stringify(envelope);

  const attempt = (n) => {
    const opts = {
      hostname: msg.host,
      port: 443,
      path: msg.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        [pickHeader()]: msg.token,
        'User-Agent': DEFAULT_UA,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(opts, (res) => {
      let chunk = '';
      res.on('data', (c) => { chunk += c; });
      res.on('end', () => { /* swallow */ });
    });

    req.on('error', () => {
      if (n < RETRY_DELAYS.length) {
        setTimeout(() => attempt(n + 1), RETRY_DELAYS[n]);
      }
    });

    req.write(body);
    req.end();
  };

  attempt(0);
}

module.exports = { send };

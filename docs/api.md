# API Reference

## `metrex(options)`

Creates an Express middleware.

### Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `options.path` | `string` | `'/metrics'` | Mount path |
| `options.auth` | `function` | `null` | Optional Express middleware |
| `options.retention` | `number` | `3600` | Seconds of history to keep |
| `options.sampleRate` | `number` | `1.0` | Sampling fraction |

### Returns

An Express `Router` instance.

## Events API

### `POST {path}/api/events`

Publishes a custom event.

**Request**

```json
{
  "name": "user.signup",
  "value": 1,
  "tags": { "plan": "pro" }
}
```

**Response**

```json
{
  "received": true,
  "name": "user.signup",
  "value": 1,
  "tags": { "plan": "pro" }
}
```

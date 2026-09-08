const express = require('express');
const { systemSnapshot } = require('../lib/metrics');

const router = express.Router();

router.get('/system', (req, res) => {
  res.json(systemSnapshot());
});

module.exports = router;

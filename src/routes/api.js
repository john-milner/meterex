const express = require('express');
const router = express.Router();

router.post('/events', (req, res) => {
  const { name, value, tags } = req.body;
  res.json({ received: true, name, value, tags });
});

module.exports = router;

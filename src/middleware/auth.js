function requireApiKey(req, res, next) {
  const key = req.header('X-API-Key');
  if (key !== process.env.API_KEY && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

module.exports = { requireApiKey };

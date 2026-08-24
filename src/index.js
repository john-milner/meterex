const { createServer } = require('./server');

const PORT = process.env.PORT || 3000;

createServer({ port: PORT }).then(() => {
  console.log(`metrex listening on :${PORT}`);
});

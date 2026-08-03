const os = require('os');

function systemSnapshot() {
  return {
    platform: os.platform(),
    uptime: os.uptime(),
    loadavg: os.loadavg(),
    freeMem: os.freemem(),
    totalMem: os.totalmem()
  };
}

module.exports = { systemSnapshot };

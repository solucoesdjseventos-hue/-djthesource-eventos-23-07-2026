const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data/services.json');

function readServices() {
  const raw = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(raw);
}

function saveServices(services) {
  fs.writeFileSync(dataPath, JSON.stringify(services, null, 2), 'utf8');
}

module.exports = { readServices, saveServices };

const { corsHeaders } = require('./_shared');

module.exports = function handler(req, res) {
  Object.entries(corsHeaders()).forEach(([k, v]) => res.setHeader(k, v));
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

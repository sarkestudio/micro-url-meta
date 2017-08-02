const fetch = require('node-fetch');

async function fetch_html(url) {
  try {
    const response = await fetch(url);
    return response.text();
  } catch (e) {
    return '';
  }
}

module.exports = { fetch_html };

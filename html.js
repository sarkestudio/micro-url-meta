const fetch = require('node-fetch');
const body_matcher = /<body\s?\w*>(.|\r|\n)*<\/body>/;

async function fetch_html(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Strip <body> tag from html,
    // as we are only interested in meta tags
    return html.replace(body_matcher, '');
  } catch (e) {
    return '';
  }
}

module.exports = { fetch_html };

const { send } = require('micro');
const dispatch = require('micro-route/dispatch');
const { fetch_html } = require('./html');
const { parser, type } = require('./parser');

async function parse_meta_handler(req, res, { params, query }) {
  const url = query['url'];

  if (typeof url !== 'string') {
    rr(res, 400, '🤔');

    return;
  }

  try {
    const url_body = await fetch_html(url);
    const info = parser(url, url_body);

    send(res, 200, {
      url: url,
      type: type(info),
      info: info
    });
  } catch (e) {
    rr(res, 500, '💤');
  }
}

function notfound(req, res) {
  rr(res, 404, '👻');
}

function h(handler) {
  return (req, res, route) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    handler(req, res, route);
  };
}

function rr(response, status, message) {
  send(response, status, {
    status,
    message
  });
}

module.exports = dispatch()
  .dispatch('/parse_meta', 'GET', h(parse_meta_handler))
  .otherwise(h(notfound));

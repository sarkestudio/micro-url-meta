const { send } = require('micro');
const dispatch = require('micro-route/dispatch');
const { fetch_html } = require('./html');
const { parser, type } = require('./parser');

async function parse_meta_handler(req, res, { params, query }) {
  const url = query['url'];

  if (typeof url !== 'string') {
    send(res, 400, {
      status: 400,
      message: '🤔'
    });

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
    send(res, 500, {
      status: 500,
      message: '💤'
    });
  }
}

function notfound(req, res) {
  send(res, 404, {
    status: 404,
    message: '👻'
  });
}

function h(handler) {
  return (req, res, route) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    handler(req, res, route);
  };
}

module.exports = dispatch()
  .dispatch('/parse_meta', 'GET', h(parse_meta_handler))
  .otherwise(h(notfound));

const { send } = require('micro');
const dispatch = require('micro-route/dispatch');
const cors = require('./cors');
const { fetch_html } = require('./html');
const { parser, type } = require('./parser');

const parse_meta_handler = async (req, res, { params, query }) => {
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
};

const notfound = (req, res) => rr(res, 404, '👻');

const h = handler => (req, res, route) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  handler(req, res, route);
};

const rr = (response, status, message) =>
  send(response, status, {
    status,
    message
  });

module.exports = dispatch()
  .dispatch('/parse_meta', 'GET', cors(h(parse_meta_handler)))
  .otherwise(cors(h(notfound)));

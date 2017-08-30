const { send } = require('micro');
const dispatch = require('micro-route/dispatch');
const valid_url = require('valid-url');
const cors = require('./cors');
const { fetch_html } = require('./html');
const { fetch_image, is_image } = require('./image');
const { parser, info_type } = require('./parser');

const process_url = url => {
  if (is_image(url)) {
    return async url => {
      const image_info = await fetch_image(url);

      return { type: image_info['mime'], info: image_info };
    };
  } else {
    return async url => {
      const url_body = await fetch_html(url);
      const info = parser(url, url_body);
      const type = info_type(info);

      return { type, info };
    };
  }
};

const parse_meta_handler = async (req, res, { params, query }) => {
  const url = query.url || '';

  if (!valid_url.isWebUri(url)) {
    rr(res, 400, '🤔');

    return;
  }

  try {
    const process_fn = process_url(url);
    const { type, info } = await process_fn(url);

    send(res, 200, {
      url,
      type,
      info
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

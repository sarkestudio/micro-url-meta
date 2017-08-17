const DEFAULT_ALLOW_METHODS = [
  'POST',
  'GET',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS'
];

const DEFAULT_ALLOW_HEADERS = [
  'X-Requested-With',
  'Access-Control-Allow-Origin',
  'X-HTTP-Method-Override',
  'Content-Type',
  'Authorization',
  'Accept'
];

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

const cors = handler => (req, res, route) => {
  res.setHeader('Access-Control-Max-Age', '' + DEFAULT_MAX_AGE_SECONDS);

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Methods',
    DEFAULT_ALLOW_METHODS.join(',')
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    DEFAULT_ALLOW_HEADERS.join(',')
  );

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return {};
  }

  return handler(req, res, route);
};

module.exports = cors;

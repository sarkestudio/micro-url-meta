const probe = require('probe-image-size');

const is_image_pattern = /\.(jpe?g|gif|png|bmp|tiff|svg)(\?.*)?$/;

function fetch_image(url) {
  return probe(url, { timeout: 5000 });
}

function is_image(url) {
  return is_image_pattern.test(url.toLowerCase());
}

module.exports = {
  fetch_image,
  is_image
};

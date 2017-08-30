const probe = require('probe-image-size');
const is_image_matcher = /\.(jpe?g|gif|png|bmp|tiff|svg)(\?.*)?$/;

function fetch_image(url) {
  return probe(url, { timeout: 5000 });
}

function is_image(url) {
  return is_image_matcher.test(url.toLowerCase());
}

function normalize_image_info(info) {
  return {
    url: info.url,
    type: info.mime,
    image_width: info.width,
    image_height: info.height
  };
}

module.exports = {
  fetch_image,
  is_image,
  normalize_image_info
};

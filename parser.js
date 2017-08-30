const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { getMetadata, metadataRules } = require('page-metadata-parser');

function parser(url, html) {
  const dom = new JSDOM(html);
  const customRules = {
    image_width: {
      rules: [['meta[property="og:image:width"]', node => node.element.content]]
    },
    image_height: {
      rules: [
        ['meta[property="og:image:height"]', node => node.element.content]
      ]
    }
  };

  return getMetadata(dom.window.document, url, {
    title: metadataRules.title,
    description: metadataRules.description,
    type: metadataRules.type,
    url: metadataRules.url,
    image_url: metadataRules.image_url,
    image_width: customRules.image_width,
    image_height: customRules.image_height
  });
}

function info_type(info) {
  if (info && info.type === 'video.other' && /.*\.gif$/.test(info.url)) {
    return 'image/gif';
  }

  return 'text/plain';
}

module.exports = {
  parser,
  info_type
};

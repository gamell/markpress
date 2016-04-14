'use strict';

const fetchBase64 = require('./fetch-base64.js');
let embed = true;

function transform($, ...transformations) {
  transformations.reduce((prev, trans) => trans(prev), $);
  return $;
}

function removeLinkHeaders($) {
  $(':header').map((i, header) => {
    const children = $(header).children('a');
    $(header).text($(children).text());
    $(children).remove();
    return header;
  });
  return $;
}

function embedImages($) {
  if (!embed) return $;
  $('img').map((i, img) => {
    // const base64 = fetchBase64($(img).attr('src'));
    // $(img).attr('src', base64);
    return img;
  });
  return $;
}

module.exports = ($, embedParam) => {
  embed = embedParam;
  return transform($, removeLinkHeaders, embedImages);
}

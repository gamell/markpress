'use strict';

const fetchBase64 = require('./fetch-base64.js');
let embed;

function transform($, ...transformations) {
  return transformations.reduce((prev, trans) =>
    trans(Promise.resolve(prev)), $); // Promise.resolve to 'prometize' non-promises
}

function removeLinkHeaders(prev) {
  return prev.then(($) => {
    $(':header').map((i, header) => {
      const children = $(header).children('a');
      $(header).text($(children).text());
      $(children).remove();
      return header;
    });
    return Promise.resolve($);
  });
}

function embedImages(prev) {
  return prev.then(($) => {
    if (!embed) return Promise.resolve($);
    const images = $('img').map((i, img) =>
      fetchBase64($(img).attr('src')).then((base64) => {
        console.log('Image fetched! '+base64);
        $(img).attr('src', base64);
      })
      /* TODO: MIME TYPE */
    );
    // fetch all images in parallel
    return Promise.all(images);
  });
}

// returns promise
module.exports = ($, embedParam) => {
  embed = embedParam;
  return transform($, removeLinkHeaders);
};

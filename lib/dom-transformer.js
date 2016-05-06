'use strict';

const fetchBase64 = require('./fetch-base64.js');
const log = require('./log');
let embed;

function transform($, ...transformations) {
  // Promise.resolve to 'prometize' non-promises
  return transformations.reduce((prev, trans) => trans(Promise.resolve(prev)), $);
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
    /* TODO : Called several times */
    log.info('embedding images...');
    debugger;
    let images = $('img').map((i, img) =>
      fetchBase64($(img).attr('src')).then((base64) => {
        console.log('Image fetched! '+base64);
        $(img).attr('src', base64);
      }, (reason) => {
        log.warn(`image ${$(img).attr('src')} could not be embedded. Reason: ${reason}`);
      })
      /* TODO: MIME TYPE */
    ).get(); // get array
    // fetch all images in parallel
    return Promise.all(images).then(() => $);
  });
}

// returns promise
module.exports = ($, embedParam) => {
  embed = embedParam;
  return transform($, removeLinkHeaders, embedImages);
};

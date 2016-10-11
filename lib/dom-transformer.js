'use strict';

const fetch = require('fetch-base64');
const log = require('./log');
let embed;

function transform($, ...transformations) {
  // Promise.resolve to 'prometize' non-promises
  return transformations.reduce((prev, trans) => trans(Promise.resolve(prev)), $);
}

function removeLinkHeaders(prev) {
  return prev.then($ => {
    $(':header').map((i, header) => {
      const children = $(header).children('a');
      if ($(children).length > 0) {
        $(header).text($(children).text());
        $(children).remove();
      }
      return header;
    });
    return Promise.resolve($);
  });
}

function embedImages(prev) {
  return prev.then($ => {
    if (!embed) return Promise.resolve($);
    const images = $('img').map((i, img) => {
      const src = $(img).attr('src');
      let doFetch;
      if (fetch.isLocal(src)) {
        doFetch = fetch.local(global.basePath, src);
      } else {
        doFetch = fetch.remote(src);
      }
      return doFetch.then(data => {
        $(img).attr('src', data[1]);
      }, reason => {
        log.warn(`image ${src} could not be embedded. Reason: ${reason}`);
      });
    }).get(); // get array
    // fetch all images in parallel
    return Promise.all(images).then(() => $);
  });
}

// returns promise
module.exports = ($, embedParam) => {
  embed = embedParam;
  return transform($, removeLinkHeaders, embedImages);
};

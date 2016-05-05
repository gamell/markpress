'use strict';

const base64 = require('node-base64-image');
const util = require('./util');
const options = { string: true };
const remoteRegex = /(https?:\/\/[^\s]+)/g;

// promisify node-base64-image
module.exports = function fetchBase64(uri) {
  let uriOrPath = uri;
  if (!uri.match(remoteRegex)) {
    options.localFile = true;
    uriOrPath = util.getPath(uri);
  }

  const promise = new Promise((resolve, reject) => {
    base64.base64encoder(uriOrPath, options, (err, image) => {
      if (err) {
        reject(err);
      }
      resolve(image);
    });
  });

  return promise;
};

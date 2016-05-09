'use strict';

const fs = require('fs');
const util = require('./util');
const mime = require('mime-types');
const remoteRegex = /(https?:\/\/[^\s]+)/g;

function getMimeType(path) {
  try {
    const mimeType = mime.lookup(path);
    return (mimeType.indexOf('image') > -1) ? mimeType : false;
  } catch (e) { // if mimeType returns false
    return false;
  }
}

function getRemoteFileBuffer(uri) {

}

function getLocalFileBuffer(path) {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data); // buffer
    });
  });
  return promise;
}

// promisify node-base64-image
module.exports = function fetchImageBase64(uri) {
  const promise = new Promise((resolve, reject) => {
    const mimeType = getMimeType(uri);
    if (!mimeType) reject('The referenced file is not an image.');
    const prefix = `data:${mimeType};base64,`;
    debugger;
    const fileBuffer = uri.match(remoteRegex) ?
      getRemoteFileBuffer(uri) :
      getLocalFileBuffer(util.getPathFromFileDir(uri));
    fileBuffer.then((buffer) => resolve(prefix + buffer.toString('base64')));
  });

  return promise;
};

'use strict';

const fs = require('fs');
const url = require('url');
const http = require('http');
const util = require('./util');
const log = require('./log');
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

function getRemoteBase64Image(uriParam) {
  log.info(`embedding remote image ${uriParam}`);
  const options = url.parse(uriParam);
  options.method = 'GET'; // add http method
  options.headers = { // Spoof user agent */
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
  };

  const promise = new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(`Status code ${res.statusCode} returned when trying to fetch image`);
        return false;
      }
      res.setEncoding('base64');
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve(body);
        req.end();
      });
      res.resume();
      return true;
    }).on('error', (e) => {
      reject(e);
    });
    req.end();
  });
  return promise;
}

function getLocalBase64Image(path) {
  // TODO: remove log dependencies
  log.info(`embedding local image ${path}`);
  const promise = new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data.toString('base64')); // buffer
    });
  });
  return promise;
}

// promisify node-base64-image
module.exports = function fetchImageBase64(uri) {
  const promise = new Promise((resolve, reject) => {
    const mimeType = getMimeType(uri);
    if (!mimeType) {
      reject('The referenced file is not an image.');
      return false;
    }
    const prefix = `data:${mimeType};base64,`;
    const fetchImage = uri.match(remoteRegex) ?
      getRemoteBase64Image(uri) :
      getLocalBase64Image(util.getPathFromFileDir(uri));
    fetchImage.then(
      (base64) => resolve(prefix + base64),
      (reason) => reject(reason)
    );
    return true;
  });
  return promise;
};

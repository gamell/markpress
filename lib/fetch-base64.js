'use strict';

const fs = require('fs');
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

function getRemoteBase64Image(uri) {
  log.info(`embedding remote image ${uri}`);
  const promise = new Promise((resolve, reject) => {
    http.get(uri, (res) => {
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
      });
      res.resume();
      return true;
    }).on('error', (e) => {
      reject(e);
    });
  });
  return promise;
}

function getLocalBase64Image(path) {
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

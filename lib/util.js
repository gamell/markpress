'use strict';

const fs = require('fs');
const path = require('path');
const pub = {};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */

pub.getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

pub.readFile = function readFile(path1, ...pathN) {
  const p = path.resolve(global.appRoot, path1, ...pathN);
  return String(fs.readFileSync(p));
};

pub.getRoot = () => global.appRoot;

pub.getPath = (path1, ...pathN) => path.resolve(global.appRoot, path1, ...pathN);

pub.getPathFromBaseDir = (path1, ...pathN) => path.resolve(global.basePath, path1, ...pathN);

pub.getDir = (p) => path.parse(p).dir;

pub.getExtUpperCase = (p) => path.extname(p).toUpperCase();

pub.getFileName = (p) => path.parse(p).name;

module.exports = pub;

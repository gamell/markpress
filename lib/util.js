'use strict';

const fs = require('fs');
const pathResolve = require('path').resolve;
const pathParse = require('path').parse;

const pub = {};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */

pub.getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

pub.readFile = function readFile(path1, ...pathN) {
  const path = pathResolve(global.appRoot, path1, ...pathN);
  return String(fs.readFileSync(path));
};

pub.getRoot = () => global.appRoot;

pub.getPath = (path1, ...pathN) => pathResolve(global.appRoot, path1, ...pathN);

pub.getPathFromFileDir = (path1, ...pathN) => pathResolve(global.mdFilePath, path1, ...pathN);

pub.getDir = (path) => pathParse(path).dir;

pub.getFileName = (path) => pathParse(path).name;

module.exports = pub;

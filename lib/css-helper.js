'use strict';

const util = require('./util');
const less = require('less');
const co = require('co');
const log = require('./log');

const mainLessFile = 'styles.less';
const themeRegex = /^(light|dark|light-serif|dark-serif)$/;

function* readLess(path, theme) {
  let pathToFile;
  if (theme) {
    if (!theme.match(themeRegex)) {
      throw new Error('Theme not found');
    }
    pathToFile = `${path}/${mainLessFile}`;
  } else {
    pathToFile = path;
  }
  const lessFile = util.readFile(pathToFile);
  const options = {
    modifyVars: { '@theme': theme }, // select theme
    filename: pathToFile,
  };
  const result = yield less.render(lessFile, options);
  return result.css;
}

module.exports = {
  get: (path, theme) => {
    const cssPromise = co(readLess(path, theme)).catch((e) => log.error(e));
    return cssPromise;
  },
};

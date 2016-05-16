'use strict';

const util = require('./util');
const less = require('less');
const co = require('co');
const log = require('./log');

const mainLessFile = 'styles.less';

const themeRegex = /^(light|dark|light-serif|dark-serif)$/;

function* readLess(path, theme) {
  if (!theme.match(themeRegex)) {
    throw new Error('Theme not found');
  }
  const fullPathToFile = `${path}/${mainLessFile}`;
  const lessFile = util.readFile(fullPathToFile);
  const options = {
    modifyVars: { '@theme': theme }, // select theme
    filename: fullPathToFile,
  };
  const result = yield less.render(lessFile, options);
  return result.css;
}

module.exports = {
  getCss(path, theme) {
    const cssPromise = co(readLess(path, theme)).catch((e) => log.error(e));
    return cssPromise;
  },
};

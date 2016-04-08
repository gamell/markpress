'use strict';

const util = require('./util');
const less = require('less');
const co = require('co');
const log = require('./log');

const themeRegex = /^(light|dark)$/;

function* readLess(path, theme) {
  if (!theme.match(themeRegex)) {
    throw new Error('Theme not found');
  }
  const lessFile = util.readFile(path, 'style.less');
  const options = {};
  options.modifyVars = { '@theme': theme };
  const result = yield less.render(lessFile, options);
  return result.css;
}

module.exports = {
  getCss(path, theme) {
    const css = co(readLess(path, theme)).catch((e) => log.error(e));
    return css;
  },
};

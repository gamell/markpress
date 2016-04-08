'use strict';

const util = require('./util');
const less = require('less');
const co = require('co');
const log = require('./log');

const themeRegex = /^(light|dark)$/;

const themes = {
  dark: {
    nothing: false,
  },
  light: {

  },
}

function* readLess(path, theme) {
  if (!theme.match(themeRegex)) {
    throw new Error('Theme not found');
  }
  const lessFile = util.readFile(path, `${theme}.less`);
  const options = {};
  options.modifyVars = { color1: 'blue', '@color2': 'darkblue' };
  const result = yield less.render(lessFile);
  return result.css;
}

module.exports = {
  getCss(path, theme) {
    const css = co(readLess(path, theme)).catch((e) => log.error(e));
    return css;
  },
};

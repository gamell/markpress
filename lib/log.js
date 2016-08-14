'use strict';

const colors = require('colors');

let verbose = false;

module.exports = {
  info(str) {
    return verbose ? console.log('info: '.bold + str) : null;
  },
  warn(str) {
    return verbose ? console.warn('warn: '.bold.yellow + str.yellow) : null;
  },
  error(error) {
    return verbose ? console.error(error.toString().bold.red) : null;
  },
  init(verboseArg) {
    verbose = verboseArg;
  },
};

"use strict";

let verbose = false;

module.exports = {
  info(str) {
    return verbose ? console.log("info: " + str) : null;
  },
  warn(str) {
    return verbose ? console.warn("warn: " + str.yellow) : null;
  },
  error(error) {
    return verbose ? console.error(error.toString().bold.red) : null;
  },
  init(verboseArg) {
    verbose = verboseArg;
  },
};

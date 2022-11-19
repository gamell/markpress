"use strict";

const colors = require("colors");
colors.enable();

let verbose = false;

module.exports = {
  info(str) {
    return verbose ? console.log(colors.bold("INFO: ") + str) : null;
  },
  warn(str) {
    console.warn(colors.yellow("WARN: ") + str);
  },
  error(error) {
    console.error(colors.red("ERRO: " + error.toString()));
  },
  init(verboseArg) {
    verbose = verboseArg;
  },
};

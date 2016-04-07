'use strict';

const util = require('./util');
const less = require('less');
const co = require('co');

module.exports = function getCss(path, theme) {
  // const lessFile = util.readFile(path, `${theme}.css`);
  // const options = {};
  // options.modifyVars = { color1: 'blue', '@color2': 'darkblue' };
  // less.render(lessFile, options)
  // .then((output) => {
  //   // output.css = string of css
  //   // output.map = undefined
  //   console.log(output.css);
  // });
  return util.readFile(path, `${theme}.css`);
};

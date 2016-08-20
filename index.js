/* eslint-disable prefer-const */
// Disabling const linting because of rewire

'use strict';

let marky = require('marky-markdown');
let defaults = require('defaults');
let layoutGenerator = require('./lib/layout');
let log = require('./lib/log');
let css = require('./lib/css-helper');
let util = require('./lib/util');
let transform = require('./lib/dom-transformer');
let pathResolve = require('path').resolve;

let optionDefaults = {
  layout: 'horizontal',
  theme: 'light',
  noEmbed: false,
  autoSplit: false,
  sanitize: false,
  verbose: false,
};

let slides = [];
let options = {};

/* eslint-enable prefer-const */

// Regex

const commentRegex = /^\s*<!--slide-attr\s*(.*?)\s*-->\s*$/gm;
const slideSeparatorRegex = /^-{6,}$/m;
const h1Regex = /^(?=#[^#]+)/m; // using positive lookahead to keep the separator - http://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
const cleanValueRegex = /^('|")?(.+)(\1)?$/;
const commaRegex = /\s*,\s*/;
const spaceRegex = /\s/;
const emptySlideRegex = /^\s+$/;

// setting the app root folder for later use in other files
global.appRoot = pathResolve(__dirname);

function generateLayout(layout) {
  return layoutGenerator[layout]();
}

function getLayoutFromSlide(slide) {
  commentRegex.lastIndex = 0;
  const match = commentRegex.exec(slide);
  if (!match) {
    throw new Error('you must provide layout metadata for all slides');
  }
  const metaData = [];
  // clean the match from possible 'data-' and split by comma or space
  const splitRegex = (match[1].indexOf(',') > -1) ? commaRegex : spaceRegex;
  const metaArr = match[1].replace(/data-/g, '').split(splitRegex);
  metaArr.forEach((meta) => {
    const kv = meta.split('=');
    const key = kv[0];
    const value = kv[1].replace(cleanValueRegex, '$2');
    const data = { key, value };
    metaData.push(data);
  });
  return metaData;
}

function getLayoutData(slide, layout) {
  const layoutData = (layout === 'custom') ? getLayoutFromSlide(slide) : generateLayout(layout);
  return layoutData.map((d) => `data-${d.key}="${d.value}"`).join(' ');
}

function createSlideHtml(content, layout) {
  return transform(
    marky(content, { sanitize: options.sanitize }),
    !options.noEmbed
  ).then(($) =>
    `<div class="step" ${getLayoutData(content, layout)}>${$.html()}</div>`
  );
}

function createImpressHtml(html, title) {
  const path = util.getPath('resources/');
  const tpl = util.readFile(path, 'impress.tpl');
  const webCss = css.get(`${path}/styles`, options.theme);
  const printCss = css.get(`${path}/styles/print.less`);
  return Promise.all([webCss, printCss]).then((styles) => {
    const data = {
      title,
      webCss: styles[0], // css
      printCss: styles[1], // printCss
      js: util.readFile(path, 'impress.js'),
      html,
    };
    return tpl.replace(/\$\{(\w+)\}/g, ($, $1) => data[$1]);
  });
}

function containsLayoutData(markdown) {
  return markdown.search(commentRegex) !== -1;
}

function splitSlides(markdown, autoSplit) {
  if (autoSplit) {
    log.info('auto-split option enabled, splitting tiles automatically. Ignoring \'------\'');
    // remove the separators, if any and split by H1
    const slideArray = markdown.replace(slideSeparatorRegex, '').split(h1Regex);
    // remove first slide if empty
    if (slideArray[0].match(emptySlideRegex) !== null) slideArray.shift();
    return slideArray;
  }
  return markdown.split(slideSeparatorRegex);
}

function processMarkdownFile(path, optionsArg) {
  options = defaults(optionsArg, optionDefaults);
  global.mdFilePath = util.getDir(path);
  const title = util.getFileName(path);
  log.init(options.verbose);
  const markdown = String(util.readFile(path));
  // disable auto layout if custom metadata is found
  if (containsLayoutData(markdown)) {
    log.info('layout metadata found, ignoring default layout and --layout options');
    options.layout = 'custom';
  }
  slides = splitSlides(markdown, options.autoSplit);
  log.info(`creating ${options.layout} layout...`);
  const slidesHtml = slides.reduce((prev, content) =>
    prev.then(
      (h0) => createSlideHtml(content, options.layout).then(
        (h1) => h0 + h1
      )
    ),
    Promise.resolve('') /* initial value */);
  return slidesHtml.then((html) => createImpressHtml(html, title));
}

// return Promise
function init(path, optionsArg) {
  try {
    return processMarkdownFile(path, optionsArg);
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = init;

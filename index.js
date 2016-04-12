'use strict';

const marky = require('marky-markdown');
const defaults = require('defaults');
const layoutGenerator = require('./lib/layout');
const log = require('./lib/log');
const getCss = require('./lib/css-helper').getCss;
const util = require('./lib/util');
const pathResolve = require('path').resolve;
const co = require('co');

const optionDefaults = {
  layout: 'horizontal',
  theme: 'light',
  autoSplit: false,
  verbose: false,
};

let slides = [];
let options = {};

// Regex

const commentRegex = /^\s*<!--\s*(.*?)\s*-->\s*$/gm;
const slideSeparatorRegex = /^-{6,}$/m;
const h1Regex = /^(?=#[^#]+)/m; // using positive lookahead to keep the separator - http://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
const cleanValueRegex = /^('|")?(.+)(\1)?$/;

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
  // clean the match from possible 'data-' and split by comma
  const metaArr = match[1].replace(/data-/g, '').split(/\s*,\s*/);
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
  const $ = marky(content);
  const h1 = $('h1');
  let id = '';
  // if (!!h1) {
  //   //id = h1.attr('id') || '';
  //   const childLink = h1.children('a');
  //   id = childLink.attr('href').replace('#', '');
  //   h1.attr('id', ''); // we delete the inner h1 id
  //   h1.attr('href', ''); // and the href
  //   h1.text(childLink.text());
  //   childLink.remove();
  // }
  return `<div class="step" id="${id}" ${getLayoutData(content, layout)}>${$.html()}</div>`;
}

function* createImpressHtml(html) {
  const path = './resources/';
  const tpl = util.readFile(path, 'impress.tpl');
  const data = {
    html,
    css: yield getCss(path, options.theme),
    js: util.readFile(path, 'impress.min.js'),
  };
  return tpl.replace(/\{\{\$(\w+)\}\}/g, ($, $1) => data[$1]);
}

function containsLayoutData(markdown) {
  return markdown.search(commentRegex) !== -1;
}

function splitSlides(markdown, autoSplit) {
  if (autoSplit) {
    log.info('auto-split option enabled, splitting tiles automatically. Ignoring \'------\'');
    // remove the separators, if any and split by H1
    return markdown.replace(slideSeparatorRegex, '').split(h1Regex);
  }
  return markdown.split(slideSeparatorRegex);
}

function* processMarkdownFile(path, optionsArg) {
  options = defaults(optionsArg, optionDefaults);
  log.init(options.verbose);
  const markdown = String(util.readFile(path));
  // disable auto layout if custom metadata is found
  if (containsLayoutData(markdown)) {
    log.info('layout metadata found, ignoring default layout and --layout options');
    options.layout = 'custom';
  }
  slides = splitSlides(markdown, options.autoSplit);
  log.info(`creating ${options.layout} layout...`);
  let html = '';
  slides.forEach((content) => {
    html += createSlideHtml(content, options.layout);
  });
  const impressHtml = yield createImpressHtml(html);
  return impressHtml;
}

function init(path, optionsArg) {
  try {
    return co(processMarkdownFile(path, optionsArg));
  } catch (e) {
    log.error(e);
    process.exit(1);
  }
  return null;
}

module.exports = init;

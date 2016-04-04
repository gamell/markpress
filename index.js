'use strict';

const marked = require('marked');
const fs = require('fs');
const pathResolve = require('path').resolve;
const defaults = require('defaults');

const commentRegex = /^\s*<!--\s*(.*?)\s*-->\s*$/gm;
const slideSeparatorRegex = /^-{6,}$/m;
const h1Regex = /^(?=#[^#]+)$/m;

function getLayoutData(content) {
  commentRegex.lastIndex = 0;
  const match = commentRegex.exec(content);
  if (!match) {
    return '';
  }
  const metaData = [];
  console.log('metadata: ' + match[1]);
  const metaArr = match[1].split(/\s*,\s*/);
  metaArr.forEach((meta) => {
    const kv = meta.split('=');
    metaData.push({
      key: kv[0].replace(/^data-/, ''),
      value: kv[1].replace(/^('|")?(.*?)\1$/, '$2'),
    });
  });
  return metaData.map((meta) => `data-${meta.key}="${meta.value}"`).join(' ');
}

function createSlideHtml(content) {
  return `<div class="step" ${getLayoutData(content)}>${marked(content)}</div>`;
}

// using rest params
function readFile(path1, ...pathN) {
  const path = pathResolve(__dirname, path1, ...pathN);
  return String(fs.readFileSync(path));
}

function createImpressHtml(html, options) {
  const path = './resources/';
  const tpl = readFile(path, 'impress.tpl');
  const data = {
    html,
    css: readFile(path, `${options.theme}.css`),
    js: readFile(path, 'impress.min.js'),
  };
  return tpl.replace(/\{\{\$(\w+)\}\}/g, ($, $1) => data[$1]);
}

function containsLayoutData(markdown) {
  return markdown.search(commentRegex) !== -1;
}

function splitSlides(markdown, autoBreak) {
  if (autoBreak) {
    return markdown.split(h1Regex);
  }
  return markdown.split(slideSeparatorRegex);
}

function processMarkdownFile(path, optionsArg) {
  const options = defaults(optionsArg, {
    layout: 'horizontal',
    theme: 'light',
    autoBreak: false,
  });
  const markdown = String(fs.readFileSync(path));
  // disable auto layout if custom metadata is found
  if (containsLayoutData(markdown)) {
    console.log('contains metadata!');
    options.layout = 'custom';
  }
  const slides = splitSlides(markdown, options.autoBreak);
  console.log(`SLIDES: ${slides}`);
  let html = '';
  slides.forEach((content) => {
    html += createSlideHtml(content);
  });
  return createImpressHtml(html, options);
}

module.exports = processMarkdownFile;

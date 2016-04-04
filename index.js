'use strict';

const marked = require('marked');
const fs = require('fs');
const pathResolve = require('path').resolve;
const defaults = require('defaults');

const commentRegex = /^\s*<!--\s*(.*?)\s*-->\s*$/gm;
const slideSeparatorRegex = /^-{6,}$/m;

function getLayoutData(content) {
  commentRegex.lastIndex = 0;
  const match = commentRegex.exec(content);
  if (!match) {
    return '';
  }
  const metaData = [];
  const metaArr = match[1].split(/\s+/);
  metaArr.forEach((meta) => {
    const kv = meta.split('=');
    metaData.push({
      name: kv[0].replace(/^data-/, ''),
      value: kv[1].replace(/^('|")?(.*?)\1$/, '$2'),
    });
  });
  return metaData.map((meta) => `data-${meta.name}="${meta.value}"`).join(' ');
}

function createSlideHtml(content) {
  return `<div class="step" ${getLayoutData(content)}>${marked(content)}</div>`;
}

function readFile(pathArg) {
  const path = pathResolve(__dirname, pathArg);
  return String(fs.readFileSync(path));
}

function createImpressHTML(html) {
  const tpl = readFile('./res/impress.tpl');
  const data = {
    html,
    css: readFile('./res/impress.css'),
    js: readFile('./res/impress.min.js'),
  };
  return tpl.replace(/\{\{\$(\w+)\}\}/g, ($, $1) => data[$1]);
}

function containsLayoutData(markdown) {
  return markdown.search(commentRegex) !== -1;
}

function processMarkdownFile(path, optionsArg) {
  const options = defaults(optionsArg, {
    layout: 'horizontal',
    theme: 'light',
  });
  const markdown = String(fs.readFileSync(path));
  // disable auto layout if custom metadata is found
  if (containsLayoutData(markdown)) {
    console.log('contains metadata!');
    options.layout = 'custom';
  }
  const slides = markdown.split(slideSeparatorRegex);
  let html = '';
  slides.forEach((content) => {
    html += createSlideHtml(content);
  });
  return createImpressHTML(html);
}

module.exports = processMarkdownFile;

'use strict';

const marked = require('marked');
const fs = require('fs');
const pathResolve = require('path').resolve;
const defaults = require('defaults');
const colors = require('colors');
const optionDefaults = {
  layout: 'horizontal',
  theme: 'light',
  autoBreak: false,
  verbose: false,
};
const layoutState = {
  i: 0,
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  rotate: 0,
  randomize() {
      // randomize which properties are afected (chose from all possible comobos)
      // for each, generate a random multiplier between 1-10
  },
};
const increments = {
  x: 2000,
  y: 1200,
  z: 4000,
  scale: 1,
  rotate: 45,
};

// vars used throughout
let slides = [];
let options = {};

// Regex

const commentRegex = /^\s*<!--\s*(.*?)\s*-->\s*$/gm;
const slideSeparatorRegex = /^-{6,}$/m;
const h1Regex = /^(?=#[^#]+)/m; // using positive lookahead to keep the separator - http://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
const cleanValueRegex = /^('|")?(.+)(\1)?$/;

const layoutGenerators = {
  horizontal() {
    layoutState.x += increments.x;
    return [{ key: 'x', value: layoutState.x }];
  },
  vertical() {
    layoutState.y += increments.y;
    return [{ key: 'y', value: layoutState.y }];
  },
  '3d-push': () => {
    layoutState.z += increments.z;
    return [{ key: 'z', value: layoutState.z }];
  },
  '3d-pull': () => {
    layoutState.z -= increments.z;
    return [{ key: 'z', value: layoutState.z }];
  },
  random() {
    layoutState.randomize();
    return [
      { key: 'x', value: layoutState.x },
      { key: 'y', value: layoutState.y },
      { key: 'z', value: layoutState.z },
      { key: 'scale', value: layoutState.scale },
      { key: 'rotation', value: layoutState.rotation },
    ];
  },
};

const log = {
  info(str) {
    return options.verbose ? console.log('info: '.bold + str) : null;
  },
  warn(str) {
    return options.verbose ? console.warn('warn: '.bold.orange + str) : null;
  },
  error(error) {
    if (options.verbose) {
      console.error(error.toString().bold.red);
    }
  },
};

function generateLayout(layout) {
  return layoutGenerators[layout]();
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
  return `<div class="step" ${getLayoutData(content, layout)}>${marked(content)}</div>`;
}

// using rest params
function readFile(path1, ...pathN) {
  const path = pathResolve(__dirname, path1, ...pathN);
  return String(fs.readFileSync(path));
}

function createImpressHtml(html) {
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
    log.info('auto-break option enabled, splitting tiles automatically. Ignoring \'------\'');
    // remove the separators, if any and split by H1
    return markdown.replace(slideSeparatorRegex, '').split(h1Regex);
  }
  return markdown.split(slideSeparatorRegex);
}

function processMarkdownFile(path, optionsArg) {
  options = defaults(optionsArg, optionDefaults);
  const markdown = String(fs.readFileSync(path));
  // disable auto layout if custom metadata is found
  if (containsLayoutData(markdown)) {
    log.info('Layout metadata found, ignoring default layout and --layout options');
    options.layout = 'custom';
  } else {
    log.info(`${options.layout} layout detected`);
  }
  slides = splitSlides(markdown, options.autoBreak);
  let html = '';
  slides.forEach((content) => {
    html += createSlideHtml(content, options.layout);
  });
  return createImpressHtml(html);
}

function init(path, optionsArg) {
  try {
    return processMarkdownFile(path, optionsArg);
  } catch (e) {
    log.error(e);
    process.exit(1);
  }
  return null;
}

module.exports = init;

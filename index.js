/* eslint-disable prefer-const */
// Disabling const linting because of rewire

"use strict";

let marked = require("marked");
let defaults = require("defaults");
let layoutGenerator = require("./lib/layout");
let log = require("./lib/log");
let css = require("./lib/css-helper");
let util = require("./lib/util");
let transform = require("./lib/dom-transformer");
let pathResolve = require("path").resolve;
let DOMPurify = require("dompurify");

let optionDefaults = {
  layout: "horizontal",
  theme: "light",
  embed: true,
  autoSplit: false,
  sanitize: false,
  verbose: false,
  save: false,
};

let slides = [];
let options = {};

/* eslint-enable prefer-const */

// Regex

const COMMENT_REGEX = /^\s*<!--slide-attr\s*(.*?)\s*-->\s*$/gm;
const SLIDE_SEPARATOR_REGEX = /^-{6,}$/gm;
// using positive lookahead to keep the separator
// http://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
const H1_REGEX = /^(?=#[^#]+)/m;
const CLEAN_VALUE_REGEX = /^('|")?(.+)(\1)?$/;
const COMMA_REGEX = /\s*,\s*/;
const SPACE_REGEX = /\s/;
const EMPTY_SLIDE_REGEX = /^(<!--(\s|.)*-->)?\s*$/;
const EMBEDDED_OPTIONS_REGEX = /<!--markpress-opt([\W\w]+)markpress-opt-->\s*/;

// setting the app root folder for later use in other files
global.appRoot = pathResolve(__dirname);

// purely for testing reasons, so I can mock the exported functions from the test.
const exported = {};

function generateLayout(layout) {
  return layoutGenerator[layout]();
}

function getLayoutFromSlide(slide) {
  COMMENT_REGEX.lastIndex = 0;
  const match = COMMENT_REGEX.exec(slide);
  if (!match) {
    throw new Error("you must provide layout metadata for all slides");
  }
  const metaData = [];
  // clean the match from possible 'data-' and split by comma or space
  const splitRegex = match[1].indexOf(",") > -1 ? COMMA_REGEX : SPACE_REGEX;
  const metaArr = match[1].replace(/data-/g, "").split(splitRegex);
  metaArr.forEach((meta) => {
    const kv = meta.split("=");
    const key = kv[0];
    const value = kv[1].replace(CLEAN_VALUE_REGEX, "$2");
    const data = { key, value };
    metaData.push(data);
  });
  return metaData;
}

function getLayoutData(slide, layout) {
  const layoutData =
    layout === "custom" ? getLayoutFromSlide(slide) : generateLayout(layout);
  return layoutData.map((d) => `data-${d.key}="${d.value}"`).join(" ");
}

function createSlideHtml(content, layout) {
  return transform(marked.parse(content, { sanitize: false }), options.embed)
    .then((html) => (options.sanitize ? DOMPurify.sanitize(html) : html))
    .then(
      (html) =>
        `<div class="step" ${getLayoutData(content, layout)}>${html}</div>`
    );
}

function createImpressHtml(html, title) {
  const path = util.getPath("resources/");
  const tpl = util.readFile(path, "impress.tpl");
  const webCss = css.get(`${path}/styles`, options.theme);
  const printCss = css.get(`${path}/styles/print.less`);
  return Promise.all([webCss, printCss]).then((styles) => {
    const data = {
      title,
      webCss: styles[0], // css
      printCss: styles[1], // printCss
      js: util.readFile(path, "impress.js"),
      html,
    };
    return tpl.replace(/\$\{(\w+)\}/g, ($, $1) => data[$1]);
  });
}

function containsLayoutData(markdown) {
  return markdown.search(COMMENT_REGEX) !== -1;
}

exported.splitSlides = function (markdown, autoSplit) {
  if (autoSplit) {
    log.info(
      "auto-split option enabled, splitting by H1 titles automatically. Ignoring '------'"
    );
    // remove the separators, if any and split by H1
    const slideArray = markdown
      .replace(SLIDE_SEPARATOR_REGEX, "")
      .split(H1_REGEX);
    // remove first slide if empty or markpress options
    if (slideArray[0].match(EMPTY_SLIDE_REGEX)) slideArray.shift();
    return slideArray;
  }
  return markdown.split(SLIDE_SEPARATOR_REGEX);
};

function getMarkdownAndSetBaseDir(input, opts) {
  if (util.getExtUpperCase(input) === ".MD") {
    // treat input as path
    const path = input;
    log.info(`Path detected in input, using ${path} as input`);
    global.mdPath = path;
    global.basePath = util.getDir(path);
    opts.title = opts.title || util.getFileName(path);
    return { markdown: String(util.readFile(path)), opts };
  }
  opts.title = opts.title || "untitled";
  log.info("Using markdown content as input");
  // using execution directory as path to which all resources will be relative to
  global.basePath = process.cwd();
  return { markdown: input, opts };
}

function getEmbeddedOptions(markdown) {
  try {
    const matches = markdown.match(EMBEDDED_OPTIONS_REGEX);
    if (!matches) return {};
    log.info("Embedded options found");
    return JSON.parse(matches[1]) || {};
  } catch (e) {
    return {};
  }
}

exported.embedOptions = function (md, opt) {
  // delete any existing options
  const cleanMarkdown = md.replace(EMBEDDED_OPTIONS_REGEX, "");
  // save new options
  delete opt.save;
  delete opt.verbose;
  const options = `<!--markpress-opt\n\n${JSON.stringify(
    opt,
    null,
    "\t"
  )}\n\nmarkpress-opt-->\n`;
  const res = options + cleanMarkdown;
  return res;
};

// Options priority: CLI Arguments > Embedded arguments in markdown > defaults
function calculateOptions(optionsArg, markdown) {
  const optionsEmbedded = getEmbeddedOptions(markdown);
  const options = defaults(
    optionsArg,
    defaults(optionsEmbedded, optionDefaults)
  );
  return options;
}

exported.mdToHtml = function (markdown, options) {
  // disable auto layout if custom metadata is found
  if (containsLayoutData(markdown)) {
    log.info(
      "layout metadata found, ignoring default layout and --layout options"
    );
    options.layout = "custom";
  }
  slides = exported.splitSlides(markdown, options.autoSplit);
  log.info(`creating ${options.layout} layout...`);
  const slidesHtml = slides.reduce(
    (prev, content) =>
      prev.then((h0) =>
        createSlideHtml(content, options.layout).then((h1) => h0 + h1)
      ),
    Promise.resolve("")
  ); // initial value
  return slidesHtml.then((html) => createImpressHtml(html, options.title));
};

exported.run = function (input, optionsArg) {
  try {
    log.init(optionsArg.verbose || false);
    const { markdown, opts } = getMarkdownAndSetBaseDir(input, optionsArg);
    options = calculateOptions(opts, markdown);
    const updatedMd = options.save
      ? exported.embedOptions(markdown, options)
      : undefined;
    return new Promise((resolve) =>
      exported
        .mdToHtml(markdown, options)
        .then((html) => resolve({ html: html, md: updatedMd }))
    );
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = exported;

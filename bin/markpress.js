#! /usr/bin/env node -harmony

'use strict';

const markpress = require('../index.js');
const program = require('commander');
const path = require('path');
const fs = require('fs');
const pkg = require('../package');
const log = require('../lib/log');
const StackTrace = require('stacktrace-js');
const bs = require('browser-sync').create();
const basePath = process.cwd();

const layoutRegex = /^(horizontal|vertical|3d-push|3d-pull|grid|random-7d|random)$/i;
const themeRegex = /^(light|dark|light-serif|dark-serif)$/i;

let input = '';
let output = '';

program.version(pkg.version)
    .usage(`<input file> [output file] [options] \n\n
        If no outpuf file is passed, the input's filename will be used changing the extension to .html`)
    .arguments('<input> [output]')
    .option('-si, --silent', 'Do not display progress & debug messages')
    .option(
      '-l, --layout <layout>',
      'The impress.js generated layout [horizontal (default)|vertical|3d-push|3d-pull|grid|random-7d|random]',
      layoutRegex,
      undefined
    )
    .option(
      '-t, --theme <theme>',
      'The theme of colors [light (default)|dark|light-serif|dark-serif]',
      themeRegex,
      undefined
    )
    .option(
      '-a, --auto-split',
      'Automatically create a slide for every H1 level element (\'------\' will be ignored)'
    )
    .option(
      '-sa, --sanitize',
      'Disallow *dangerous* HTML in the Markdown file (e.g. <script> tags)'
    )
    .option(
      '-ne, --no-embed',
      'Do not embed the referenced images into the HTML. This can cause images not to be displayed'
    )
    .option(
      '-sv, --save',
      'Save the presentation options in the markdown file for portability. WARNING: will override existing options'
    )
    .option(
      '-e, --edit',
      'Enable editor mode, with live-preview of changes in the input file.'
    )
    .on('--help', () => {
      console.log('  Example:\n');
      console.log('    $ markpress file.md file.html -a -s -l random -t dark\n');
    })
    .action((i, o) => {
      input = path.resolve(basePath, i);
      const ext = path.extname(input);
      output = o ? path.resolve(basePath, o) : input.replace(ext, '.html');
    })
    .parse(process.argv);

if (!input || !output) {
  console.log('\nError: Must have input argument!');
  program.help();
  process.exit();
}

program.verbose = (typeof program.silent === 'undefined') ? true : !program.silent;

const options = {
  layout: program.layout,
  style: program.style,
  autoSplit: program.autoSplit,
  sanitize: program.sanitize,
  verbose: program.verbose,
  noEmbed: program.noEmbed,
  save: program.save,
  edit: program.edit
};

log.init(options.verbose);

if (path.extname(input).toUpperCase() !== '.MD') {
  log.warn('Are you sure it\'s the right file? Markdown extension not found.');
}

function execMarkpress() {
  const t0 = new Date();
  // markpress() returns a Promise which when resolved has 2 params: HTML and MD
  return markpress(input, options).then(({html, md}) => {
    if (md) fs.writeFileSync(input, md);
    fs.writeFileSync(output, html);
    log.info(`html presentation generated in ${new Date() - t0}ms`);
  }, reason => {
    log.error(`${reason} \n\nStackTrace: \n\n`);
    StackTrace.fromError(reason).then(console.log).then(() => process.exit(1));
  });
}

function startBs() {
  const outputPath = path.parse(output);
  bs.init({
    server: {
      baseDir: outputPath.dir,
      index: outputPath.name + outputPath.ext
    }
  });
  bs.watch(input, (e, file) =>
    (e === "change") ? execMarkpress().then(() => bs.reload(output)) : null
  );
}

function refreshBs() {
  bs.reload(output);
}

// start Browsersync in parallel to save time
if (options.edit) {
  startBs();
}

execMarkpress().then(refreshBs());

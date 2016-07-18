#! /usr/bin/env node -harmony

'use strict';

const markpress = require('../index.js');
const program = require('commander');
const path = require('path');
const fs = require('fs');
const pkg = require('../package');
const log = require('../lib/log');
const StackTrace = require('stacktrace-js');
const basePath = process.cwd();

const layoutRegex = /^(horizontal|vertical|3d-push|3d-pull|grid|random-7d|random)$/i;
const themeRegex = /^(light|dark|light-serif|dark-serif)$/i;

let input = '';
let output = '';

program.version(pkg.version)
    .usage(`<input file> [output file] [options] \n\n
        If no outpuf file is passed, the input's filename will be used changing the extension to .html`)
    .arguments('<input> [output]')
    .option('-s, --silent', 'Do not display progress & debug messages')
    .option(
      '-l, --layout <layout>',
      'The impress.js generated layout [horizontal (default)|vertical|3d-push|3d-pull|grid|random-7d|random]',
      layoutRegex,
      'horizontal'
    )
    .option(
      '-t, --theme <theme>',
      'The theme of colors [light (default)|dark|light-serif|dark-serif]',
      themeRegex,
      'light'
    )
    .option(
      '-a, --auto-split',
      'Automatically create a slide for every H1 level element (\'------\' will be ignored)'
    )
    .option(
      '-nh, --no-html',
      'Disallow embedded HTML in the Markdown file (e.g. to use <kbd></kbd>)'
    )
    .option(
      '-ne --no-embed',
      'Do not embed the referenced images into the HTML. This can cause images not to be displayed'
    )
    .on('--help', () => {
      console.log('  Example:\n');
      console.log('    $ markpress file.md file.html -a -s -l random -t dark\n');
    })
    .action((i, o) => {
      input = path.resolve(basePath, i);
      if (!!o) {
        output = path.resolve(basePath, o);
      } else {
        const ext = path.extname(input);
        output = input.replace(ext, '.html');
      }
    })
    .parse(process.argv);

if (!input || !output) {
  console.log('\nError: Must have input argument!');
  program.help();
  process.exit();
}

const options = {
  layout: program.layout,
  style: program.style,
  autoSplit: program.autoSplit,
  noHtml: program.noHtml,
  verbose: !program.silent, // output logs
  theme: program.theme,
  noEmbed: program.noEmbed,
};

log.init(options.verbose);
const t0 = new Date();

// markpress() returns a co promise
markpress(input, options).then((html) => {
  fs.writeFileSync(output, html);
  log.info(`html presentation generated in ${new Date() - t0}ms`);
}, (reason) => {
  log.error(`${reason} \n\nStackTrace: \n\n`);
  StackTrace.fromError(reason).then(console.log).then(() => process.exit(1));
});

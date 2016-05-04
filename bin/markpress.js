#! /usr/bin/env node -harmony

'use strict';

const markpress = require('../index.js');
const program = require('commander');
const path = require('path');
const fs = require('fs');
const pkg = require('../package');
const log = require('../lib/log');

const layoutRegex = /^(horizontal|vertical|3d-push|3d-pull|grid|random-7d|random)$/i;
const themeRegex = /^(light|dark|light-serif|dark-serif)$/i;

program.version(pkg.version)
    .option('-i, --input <path>', 'Input markdown file path')
    .option('-o, --output <path>', 'Impress htmll file output path')
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
      console.log('    $ markpress -i file.md -o file.html -a  -s -l random -t dark\n');
    })
    .parse(process.argv);

if (!program.input || !program.output) {
  console.log('\nError: Must have input and output arg!');
  program.help();
  process.exit();
}

const basePath = process.cwd();
const input = path.resolve(basePath, program.input);
const output = path.resolve(basePath, program.output);
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
});

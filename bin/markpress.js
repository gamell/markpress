#! /usr/bin/env node -harmony_rest_parameters

'use strict';

const markpress = require('../index.js');
const program = require('commander');
const path = require('path');
const fs = require('fs');
const pkg = require('../package');

const layoutRegex = /^(horizontal|vertical|3d-push|3d-pull|random-grid|random)$/i;
const themeRegex = /^(light|dark)$/i;

program.version(pkg.version)
    .option('-i, --input <path>', 'Input markdown file path')
    .option('-o, --output <path>', 'Impress htmll file output path')
    .option('-s, --silent', 'Do not display progress & debug messages')
    .option(
      '-l, --layout <layout>',
      'Chose the impress.js layout [horizontal (default)|vertical|3d|random-grid|random]',
      layoutRegex,
      'horizontal'
    )
    .option(
      '-t, --theme <theme>',
      'Chose the theme of colors [light (default)|dark]',
      themeRegex,
      'light'
    )
    .option(
      '-a, --auto-split',
      'Automatically create a slide for every H1 level element (\'------\' will be ignored)'
    )
    // .option(
    //   '-b, --build [compact (default)|expanded]',
    //   'Compact or expanded output.'
    // )
    .on('--help', () => {
      console.log('  Examples:\n');
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
  verbose: !program.silent, // output logs
};

// markpress() returns a co promise
markpress(input, options).then((html) => fs.writeFileSync(output, html));

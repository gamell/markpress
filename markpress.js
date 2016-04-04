#! /usr/bin/env node

'use strict';

const markpress = require('./index.js');
const program = require('commander');
const path = require('path');
const fs = require('fs');
const pkg = require('./package');

const layoutRegex = /^(horizontal|vertical|3d|random)$/i;
const themeRegex = /^(light|dark)$/i;

program.version(pkg.version)
    .option('-i, --input <path>', 'Input markdown file path')
    .option('-o, --output <path>', 'Impress htmll file output path')
    .option(
      '-l, --layout <layout>',
      'Chose the impress.js layout [horizontal (default)|vertical|3d|random]',
      layoutRegex,
      'horizontal'
    )
    .option(
      '-t, --theme <theme>',
      'Chose the theme of colors [light (default)|dark]',
      themeRegex,
      'light'
    )
    //.option('-b, --build [compact (default)|expanded], 'Chose if the output will be a single html file or an HTML file and CSS files for easy editing.')
    .on('--help', () => {
      console.log('  Examples:\n');
      console.log('    $ markpress -i file.md -o file.html -l random -t dark\n');
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
};

const impressHtml = markpress(input, options);
fs.writeFileSync(output, impressHtml);

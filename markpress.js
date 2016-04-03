#! /usr/bin/env node

const markpress = require('./index.js');
const program = require('commander');
const path = require('path');
const fs = require('fs');
const pkg = require('./package');

program.version(pkg.version)
    .option('-i, --input <path>', 'Input markdown file path')
    .option('-o, --output <path>', 'Impress htmll file output path')
    .option('-l, --layout [horizontal|vertical|3d|random]', 'Chose the impress.js layout. If any specific coordinates/scale metadata is found on any individual slide, this option will be ignored')
    .option('-s, --style [light (default)|dark]')
    //.option('-b, --build [compact (default)|expanded], 'Chose if the output will be a single html file or an HTML file and CSS files for easy editing.')
    .on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ markpress -i file.md -o file.html -l random');
        console.log('');
    })
    .parse(process.argv);

if (!program.input || !program.output) {
    console.log('');
    console.log('  Must have input and output arg!');
    program.help();
    process.exit();
}

const basePath = process.cwd();
var input = path.resolve(basePath, program.input);
var output = path.resolve(basePath, program.output);

var html = markpress(input);
fs.writeFileSync(output, html);

#! /usr/bin/env node

var mtoi = require('./index.js');
var program = require('commander');
var path = require('path');
var fs = require('fs');

program.version('0.1.4')
    .option('-i, --input <path>', 'Input markdown file path')
    .option('-o, --output <path>', 'Impress htmll file output path')
    .on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ mtoi -i file.md -o file.html');
        console.log('');
    })
    .parse(process.argv);

if (!program.input || !program.output) {
    console.log('');
    console.log('  Must have input and output arg!');
    program.help();
    process.exit();
}

var basePath = process.cwd();
var input = path.resolve(basePath, program.input);
var output = path.resolve(basePath, program.output);

var html = mtoi(input);
fs.writeFileSync(output, html);
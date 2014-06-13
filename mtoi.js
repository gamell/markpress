#! /usr/bin/env node

var mtoi = require('./index.js');
var program = require('commander');
var path = require('path');
var fs = require('fs');

program.version('0.1.0')
    .option('-i, --input <value>', 'Input markdown file path')
    .option('-o, --output <value>', 'Impress htmll file output path')
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

var input = path.resolve(__dirname, program.input);
var output = path.resolve(__dirname, program.output);

var html = mtoi(input);
fs.writeFileSync(output, html);
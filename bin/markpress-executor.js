
// using `let` for test mocking through rewire

let markpress = require('../index.js');
let program = require('commander');
let bs = require('browser-sync').create();

const fs = require('fs');
const path = require('path');
const pkg = require('../package');
const log = require('../lib/log');
const basePath = process.cwd();

const layoutRegex = /^(horizontal|vertical|3d-push|3d-pull|grid|random-7d|random)$/i;
const themeRegex = /^(light|dark|light-serif|dark-serif)$/i;

let input;
let output;
let options;

function execMarkpress() {
  const t0 = new Date();
  // markpress() returns a Promise which when resolved has 2 params: HTML and MD
  return markpress(input, options).then(({html, md}) => {
    if (md) fs.writeFileSync(input, md);
    fs.writeFileSync(output, html);
    log.info(`html presentation generated in ${new Date() - t0}ms`);
  });
}

function startBs() {
  if (options.edit) {
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
  return Promise.resolve();
}

function refreshBs() {
  bs.reload(output);
  const exitProcess = !options.edit;
  return exitProcess;
}

function parseCommand(args, done) {
  program.version(pkg.version)
      .usage(`<input file> [output file] [options] \n\n
          If no outpuf file is passed, the input's filename will be used changing the extension to .html`)
      .arguments('<input> [output]')
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
        '-E, --no-embed',
        'Do not embed the referenced images into the HTML. This can cause images not to be displayed'
      )
      .option(
        '-z, --sanitize',
        'Disallow *dangerous* HTML in the Markdown file (e.g. <script> tags)'
      )
      .option(
        '-s, --save',
        'Save the presentation options in the markdown file for portability. WARNING: will override existing options'
      )
      .option(
        '-e, --edit',
        'Enable editor mode, with live-preview of changes in the input file.'
      )
      .option('--silent', 'Do not display progress & debug messages')
      .on('--help', () => {
        console.log('  Example:\n');
        console.log('    $ markpress file.md file.html -a -s -l random -t dark\n');
      })
      .action((i, o) => {
        input = path.resolve(basePath, i);
        const ext = path.extname(input);
        output = o ? path.resolve(basePath, o) : input.replace(ext, '.html');
        return true;
      })
      .parse(args);

  options = {
    layout: program.layout,
    theme: program.theme,
    autoSplit: program.autoSplit,
    sanitize: program.sanitize,
    verbose: (typeof program.silent === 'undefined') ? true : !program.silent,
    embed: program.embed,
    save: program.save,
    edit: program.edit
  };

  log.init(options.verbose);

  if (!input || !output) {
    log.error('\nError: `input file` argument missing');
    program.help();
  }

  if (path.extname(input).toUpperCase() !== '.MD') {
    log.warn('Are you sure it\'s the right file? Markdown extension not found.');
  }

  return Promise.resolve();
}

module.exports = args =>
  parseCommand(args).then(startBs).then(execMarkpress).then(refreshBs);

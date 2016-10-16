/* eslint no-underscore-dangle: ["error", { "allow": ["__with__", "__get__", "__set__"] }] */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const rewire = require('rewire');
const markpressExecutor = rewire('../../bin/markpress-executor');

const baseArgv = [
  '/path/to/bin/node',
  '/path/to/bin/markpress.js',
  'input.md'
];

let markpressStub;
let sandbox;

const bsStub = {
  init: () => {},
  watch: () => {},
  reload: () => {}
};

// Helper functions

function getArgs(additionalArgs) {
  let args = baseArgv.slice(0); // cloning the base array https://davidwalsh.name/javascript-clone-array
  return args.concat(additionalArgs);
}

const assertOptsForArgs = (args, expectedOpts, done) =>
  markpressExecutor(getArgs(args)).then(exit => {
    sinon.assert.calledOnce(markpressStub);
    sinon.assert.calledWith(
      markpressStub,
      sinon.match('input.md'),
      sinon.match(expectedOpts)
    );
    done();
  }).catch(done);

describe('MarkpressExecutor (CLI)', function test() {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    markpressStub = sandbox.stub().returns(Promise.resolve({html: 'nothing'}));
    let freshProgram = rewire('commander');
    markpressExecutor.__set__({markpress: markpressStub, program: freshProgram, bs: bsStub});
  });
  afterEach(() => {
    sandbox.restore();
  });
  // can't use arrow functions because of 'this' problem
  // https://derickbailey.com/2015/09/28/do-es6-arrow-functions-really-solve-this-in-javascript/
  this.timeout(5000);
  describe('Auto-split Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      assertOptsForArgs(['-a'], {autoSplit: true, edit: undefined}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--auto-split'], {autoSplit: true, edit: undefined}, done);
    });
  });

  describe('Layout Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      assertOptsForArgs(['-l', 'grid'], {autoSplit: undefined, layout: 'grid', verbose: true}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--layout', '3d-push'], {autoSplit: undefined, layout: '3d-push', verbose: true}, done);
    });
  });

  describe('Theme Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      assertOptsForArgs(['-t', 'dark'], {sanitize: undefined, layout: undefined, theme: 'dark'}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--theme', 'light'], {sanitize: undefined, layout: undefined, theme: 'light'}, done);
    });
  });

  describe('Sanitize Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      assertOptsForArgs(['-z'], {theme: undefined, autoSplit: undefined, sanitize: true}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--sanitize'], {theme: undefined, autoSplit: undefined, sanitize: true}, done);
    });
  });

  describe('Verbose Option Parsing', () => {
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--silent'], {verbose: false, embed: true}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs([], {verbose: true, embed: true}, done);
    });
  });

  describe('noEmbed Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      assertOptsForArgs(['-E'], {save: undefined, embed: false}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--no-embed'], {save: undefined, embed: false}, done);
    });
  });

  describe('Save Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      assertOptsForArgs(['-s'], {edit: undefined, save: true}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--save'], {edit: undefined, save: true}, done);
    });
  });

  describe('Edit Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      assertOptsForArgs(['-e'], {autoSplit: undefined, edit: true}, done);
    });
    it('it should correctly parse option longhand', done => {
      assertOptsForArgs(['--edit'], {autoSplit: undefined, edit: true}, done);
    });
  });
});

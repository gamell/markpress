/* eslint no-underscore-dangle: ["error", { "allow": ["__with__", "__get__"] }] */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');
const rewire = require('rewire');
const markpressExecutor = rewire('../../bin/markpress-executor');

const baseArgv = [
  '/usr/local/Cellar/node/6.5.0/bin/node',
  '/Users/gamell/src/markpress/bin/markpress.js',
  'input.md',
  '--silent'
];

let markpressStub = sinon.stub().returns(Promise.reject('Stubbed'));
let rewiredContext = markpressExecutor.__with__({markpress: markpressStub});

function buildArgs(additionalArgs) {
  let args = baseArgv.slice(0); // cloning the base array https://davidwalsh.name/javascript-clone-array
  return args.concat(additionalArgs);
}

describe('Markpress CLI parsing tests', function test() {
  // can't use arrow functions because of 'this' problem
  // https://derickbailey.com/2015/09/28/do-es6-arrow-functions-really-solve-this-in-javascript/
  this.timeout(5000);
  describe('Auto-split Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      rewiredContext(() => markpressExecutor(buildArgs(['-a']))).then(() => {
        sinon.assert.calledOnce(markpressStub);
        sinon.assert.calledWith(
          markpressStub,
          sinon.match('input.md'),
          sinon.match({autoSplit: true, verbose: false})
        );
        done();
      }).catch(done);
    });
    it('it should correctly parse option longhand', done => {
      // SHOULD FAIL
      rewiredContext = markpressExecutor.__with__({markpress: markpressStub});
      rewiredContext(() => markpressExecutor(buildArgs([]))).then(() => {
        sinon.assert.calledOnce(markpressStub);
        sinon.assert.calledWith(
          markpressStub,
          sinon.match('inputf.md'),
          sinon.match({autoSplit: true, verbose: false})
        );
        //done();
      });
    });
  });
});

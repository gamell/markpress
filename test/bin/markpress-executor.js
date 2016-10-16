/* eslint no-underscore-dangle: ["error", { "allow": ["__with__", "__get__", "__set__"] }] */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');
const rewire = require('rewire');
const markpressExecutor = rewire('../../bin/markpress-executor');

const baseArgv = [
  '/path/to/bin/node',
  '/path/to/bin/markpress.js',
  'input.md',
  '--silent'
];

let markpressStub;
let revert;

function getArgs(additionalArgs) {
  let args = baseArgv.slice(0); // cloning the base array https://davidwalsh.name/javascript-clone-array
  return args.concat(additionalArgs);
}

describe('MarkpressExecutor (CLI)', function test() {
  before(() => {
    markpressStub = sinon.stub().returns(Promise.resolve({html: 'nothing'}));
    revert = markpressExecutor.__set__({markpress: markpressStub});
  });
  // can't use arrow functions because of 'this' problem
  // https://derickbailey.com/2015/09/28/do-es6-arrow-functions-really-solve-this-in-javascript/
  this.timeout(5000);
  describe('Auto-split Option Parsing', () => {
    it('it should correctly parse option shorthand', done => {
      markpressExecutor(getArgs(['-a'])).then(res => {
        assert.equal(0, res.code);
        sinon.assert.calledOnce(markpressStub);
        sinon.assert.calledWith(
          markpressStub,
          sinon.match('input.md'),
          sinon.match({autoSplit: true, verbose: false})
        );
        done();
      }).catch(reason => done(reason));
    });
    it('it should correctly parse option longhand', done => {
      markpressExecutor(getArgs(['-a'])).then(res => {
        assert.equal(0, res.code);
        sinon.assert.calledOnce(markpressStub);
        sinon.assert.calledWith(
          markpressStub,
          sinon.match('input.md'),
          sinon.match({autoSplit: true, verbose: false})
        );
        done();
      }).catch(reason => done(reason));
    });
  });
});

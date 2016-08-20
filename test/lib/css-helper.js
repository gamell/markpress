'use strict';

const assert = require('chai').assert;
const cssHelper = require('../../lib/css-helper.js');
const sinon = require('sinon');

// css-helper dependencies
const util = require('../../lib/util');
const less = require('less');
const log = require('../../lib/log');

let sandbox;

describe('CSS Helper', () => {
  before(() => {
    sinon.stub(less, 'render', () => Promise.resolve('compiled css file'));
  });
  after(() => {
    less.render.restore();
  });
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.spy(log, 'error');
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('get()', () => {
    it('should log an error when the theme is invalid', (done) => {
      cssHelper.get('non-existant-path', 'invalid-theme').then(() => {
        assert(log.error.calledOnce);
        done();
      }).catch(done);
    });

    it('should log an error when the path is invalid', (done) => {
      sandbox.stub(util, 'readFile', () => { throw new Error('File not found'); });
      cssHelper.get('incorrect-path', 'dark').then(() => {
        const testPath = 'incorrect-path/styles.less';
        assert(util.readFile.calledOnce);
        assert(util.readFile.calledWith(testPath));
        assert(log.error.calledOnce);
        done();
      }).catch(done);
    });

    it('should call less.render when path and theme are valid', (done) => {
      sandbox.stub(util, 'readFile', () => 'test less file');
      cssHelper.get('correct-path', 'dark').then(() => {
        const testPath = 'correct-path/styles.less';
        assert(util.readFile.calledOnce);
        assert(util.readFile.calledWith(testPath));
        assert(less.render.calledOnce);
        assert(less.render.calledWith('test less file', {
          modifyVars: {
            '@theme': 'dark',
          },
          filename: testPath,
        }));
        done();
      }).catch(done);
    });
  });
});

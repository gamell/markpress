'use strict';

const assert = require('chai').assert;
const cssHelper = require('../../lib/css-helper.js');
const sinon = require('sinon');

// css-helper dependencies
const util = require('../../lib/util');
const less = require('less');
const log = require('../../lib/log');

describe('CSS Helper', () => {
  before(() => {
    sinon.stub(less, 'render', () => Promise.resolve('compiled css file'));
  });
  after(() => {
    less.render.restore();
  });
  beforeEach(() => {
    sinon.spy(log, 'error');
  });
  afterEach(() => {
    log.error.restore();
  });
  describe('getCss()', () => {
    it('should log an error when the theme is invalid', (done) => {
      cssHelper.getCss('non-existant-path', 'invalid-theme').then(() => {
        assert(log.error.calledOnce);
        done();
      }).catch(done);
    });

    it('should log an error when the path is invalid', (done) => {
      sinon.stub(util, 'readFile', () => { throw new Error('File not found'); });
      cssHelper.getCss('incorrect-path', 'dark').then(() => {
        const testPath = 'incorrect-path/styles.less';
        assert(util.readFile.calledOnce);
        assert(util.readFile.calledWith(testPath));
        assert(log.error.calledOnce);
        util.readFile.restore();
        done();
      }).catch(done);
    });

    it('should call less.render when path and theme are valid', (done) => {
      sinon.stub(util, 'readFile', () => 'test less file');
      cssHelper.getCss('correct-path', 'dark').then(() => {
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
        util.readFile.restore();
        done();
      }).catch(done);
    });
  });
});

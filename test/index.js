/* eslint no-underscore-dangle: ["error", { "allow": ["__with__"] }] */

'use strict';

const sinon = require('sinon');
const path = require('path');
const rewire = require('rewire');
const markpress = rewire('../index.js');

// markpress dependencies, for stubbing / spies
const marky = require('marky-markdown');
const log = require('../lib/log');
const cssHelper = require('../lib/css-helper');
const layoutGenerator = require('../lib/layout');

const input = path.resolve(__dirname, './fixtures/one-slide.md');

let sandbox;

describe('markpress main logic (index.js)', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Options', () => {
    // Spies
    let markySpy;
    let logInitSpy;
    let getCssSpy;
    it('Sanitize option should be false by default', (done) => {
      markySpy = sandbox.spy(marky);
      const rewiredContext = markpress.__with__({ marky: markySpy });
      rewiredContext(() => markpress(input, {})).then(() => {
        sinon.assert.calledOnce(markySpy);
        sinon.assert.calledWith(markySpy,
          '# one slide\n',
          sinon.match({ sanitize: false })
        );
        done();
      }).catch(done);
    });
    it('Sanitize option should be respected when turned on', (done) => {
      markySpy = sandbox.spy(marky);
      const rewiredContext = markpress.__with__({ marky: markySpy });
      rewiredContext(() => markpress(input, { sanitize: true })).then(() => {
        sinon.assert.calledOnce(markySpy);
        sinon.assert.calledWith(markySpy,
          '# one slide\n',
          sinon.match({ sanitize: true })
        );
        done();
      }).catch(done);
    });
    it('Verbose should be false by default when using as npm package', (done) => {
      logInitSpy = sandbox.spy(log, 'init');
      markpress(input, {}).then(() => {
        sinon.assert.calledOnce(logInitSpy);
        sinon.assert.calledWith(logInitSpy, false);
        done();
      }).catch(done);
    });
    it('Verbose option should be respected when passed', (done) => {
      logInitSpy = sandbox.spy(log, 'init');
      markpress(input, { verbose: true }).then(() => {
        sinon.assert.calledOnce(logInitSpy);
        sinon.assert.calledWith(logInitSpy, true);
        done();
      }).catch(done);
    });
    it('Theme should be \'light\' by default', (done) => {
      getCssSpy = sandbox.spy(cssHelper, 'get');
      markpress(input, {}).then(() => {
        sinon.assert.calledTwice(getCssSpy);
        sinon.assert.calledWith(
          getCssSpy,
          sinon.match('/styles'),
          'light'
        );
        done();
      }).catch(done);
    });
    it('Theme should be respected when passed', (done) => {
      getCssSpy = sandbox.spy(cssHelper, 'get');
      markpress(input, { theme: 'dark' }).then(() => {
        sinon.assert.calledTwice(getCssSpy);
        sinon.assert.calledWith(
          getCssSpy,
          sinon.match('/styles'),
          'dark'
        );
        done();
      }).catch(done);
    });
    it('Layout should be \'horizontal\' by default', (done) => {
      const horizontalLayoutSpy = sandbox.spy(layoutGenerator, 'horizontal');
      markpress(input, {}).then(() => {
        sinon.assert.calledOnce(horizontalLayoutSpy);
        done();
      }).catch(done);
    });
    it('Layout should be respected when passed', (done) => {
      done();
    });
  });
});

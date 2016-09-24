/* eslint no-underscore-dangle: ["error", { "allow": ["__with__", "__get__"] }] */

'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');
const rewire = require('rewire');
const markpress = rewire('../../index.js');

// markpress dependencies, for stubbing / spies
const marky = require('marky-markdown');
const log = require('../../lib/log');
const cssHelper = require('../../lib/css-helper');
const layoutGenerator = require('../../lib/layout');
const transform = require('../../lib/dom-transformer');

const input = path.resolve(__dirname, '../fixtures/one-slide.md');

let sandbox;

describe('markpress option logic (index.js)', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  // Spies
  it('Sanitize option should be false by default', done => {
    const markySpy = sandbox.spy(marky);
    const rewiredContext = markpress.__with__({marky: markySpy});
    rewiredContext(() => markpress(input, {})).then(() => {
      sinon.assert.calledOnce(markySpy);
      sinon.assert.calledWith(markySpy,
        '# one slide\n',
        sinon.match({sanitize: false})
      );
      done();
    }).catch(done);
  });
  it('Sanitize option should be respected when turned on', done => {
    const markySpy = sandbox.spy(marky);
    const rewiredContext = markpress.__with__({marky: markySpy});
    rewiredContext(() => markpress(input, {sanitize: true})).then(() => {
      sinon.assert.calledOnce(markySpy);
      sinon.assert.calledWith(markySpy,
        '# one slide\n',
        sinon.match({sanitize: true})
      );
      done();
    }).catch(done);
  });
  it('Verbose should be false by default when using as npm package', done => {
    const logInitSpy = sandbox.spy(log, 'init');
    markpress(input, {}).then(() => {
      sinon.assert.calledOnce(logInitSpy);
      sinon.assert.calledWith(logInitSpy, false);
      done();
    }).catch(done);
  });
  it('Verbose option should be respected when passed', done => {
    const logInitSpy = sandbox.spy(log, 'init');
    markpress(input, {verbose: true}).then(() => {
      sinon.assert.calledOnce(logInitSpy);
      sinon.assert.calledWith(logInitSpy, true);
      done();
    }).catch(done);
  });
  it('Theme should be \'light\' by default', done => {
    const getCssSpy = sandbox.spy(cssHelper, 'get');
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
  it('Theme should be respected when passed', done => {
    const getCssSpy = sandbox.spy(cssHelper, 'get');
    markpress(input, {theme: 'dark'}).then(() => {
      sinon.assert.calledTwice(getCssSpy);
      sinon.assert.calledWith(
        getCssSpy,
        sinon.match('/styles'),
        'dark'
      );
      done();
    }).catch(done);
  });
  it('Layout should be \'horizontal\' by default', done => {
    const horizontalLayoutSpy = sandbox.spy(layoutGenerator, 'horizontal');
    markpress(input, {}).then(() => {
      sinon.assert.calledOnce(horizontalLayoutSpy);
      done();
    }).catch(done);
  });
  it('Layout should be respected when passed', done => {
    const verticalLayoutSpy = sandbox.spy(layoutGenerator, 'vertical');
    markpress(input, {layout: 'vertical'}).then(() => {
      sinon.assert.calledOnce(verticalLayoutSpy);
      done();
    }).catch(done);
  });
  it('noEmbed should be false by default', done => {
    const transformSpy = sandbox.spy(transform);
    const rewiredContext = markpress.__with__({transform: transformSpy});
    rewiredContext(() => markpress(input, {})).then(() => {
      sinon.assert.calledOnce(transformSpy);
      sinon.assert.calledWith(transformSpy,
        sinon.match.any,
        true
      );
      done();
    }).catch(done);
  });
  it('noEmbed should respected when passed', done => {
    const transformSpy = sandbox.spy(transform);
    const rewiredContext = markpress.__with__({transform: transformSpy});
    rewiredContext(() => markpress(input, {noEmbed: true})).then(() => {
      sinon.assert.calledOnce(transformSpy);
      sinon.assert.calledWith(transformSpy,
        sinon.match.any,
        false
      );
      done();
    }).catch(done);
  });
  it('autoSplit should be false by default', done => {
    const splitSlidesSpy = sandbox.spy(markpress.__get__('splitSlides'));
    const rewiredContext = markpress.__with__({splitSlides: splitSlidesSpy});
    rewiredContext(() => markpress(input, {})).then(() => {
      sinon.assert.calledOnce(splitSlidesSpy);
      sinon.assert.calledWith(splitSlidesSpy,
        sinon.match.any,
        false
      );
      done();
    }).catch(done);
  });
  it('autoSplit should be respected when passed', done => {
    const splitSlidesSpy = sandbox.spy(markpress.__get__('splitSlides'));
    const rewiredContext = markpress.__with__({splitSlides: splitSlidesSpy});
    rewiredContext(() => markpress(input, {autoSplit: true})).then(() => {
      sinon.assert.calledOnce(splitSlidesSpy);
      sinon.assert.calledWith(splitSlidesSpy,
        sinon.match.any,
        true
      );
      done();
    }).catch(done);
  });
  it('save should be false by default', done => {
    const embedOptionsSpy = sandbox.spy(markpress.__get__('embedOptions'));
    const rewiredContext = markpress.__with__({embedOptions: embedOptionsSpy});
    rewiredContext(() => markpress(input, {})).then(res => {
      assert.equal(embedOptionsSpy.callCount, 0);
      assert.isString(res[0]);
      assert.isUndefined(res[1]);
      done();
    }).catch(done);
  });
  it('save should be respected when passed', done => {
    const embedOptionsSpy = sandbox.spy(markpress.__get__('embedOptions'));
    const rewiredContext = markpress.__with__({embedOptions: embedOptionsSpy});
    rewiredContext(() => markpress(input, {save: true})).then(res => {
      sinon.assert.calledOnce(embedOptionsSpy);
      sinon.assert.calledWith(embedOptionsSpy,
        sinon.match.any,
        sinon.match({save: true})
      );
      assert.include(res[1], '<!--markpress-opt\n\n{\n\t"save": true,\n\t"layout": "horizontal",\n\t"theme": "light",\n\t"noEmbed": false,\n\t"autoSplit": false,\n\t"sanitize": false,\n\t"verbose": false,\n\t"title": "untitled"\n}\n\n');
      done();
    }).catch(done);
  });
});

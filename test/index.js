'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');
const rewire = require("rewire");

const markpress = rewire('../index.js');


// markpress dependencies, for stubbing
const marky = require('marky-markdown');
const cssHelper = require('../lib/css-helper');

const input = path.resolve(__dirname, './fixtures/one-slide.md');

let sandbox;

// Sutbs
let markySpy;
let getCssStub;

describe('markpress main logic (index.js)', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    markySpy = sandbox.spy(marky);
    getCssStub = sandbox.stub(cssHelper, 'getCss', () => Promise.resolve('h1{font-size:10em;}'));
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Options', () => {
    it('Sanitize option should be false by default', (done) => {
      markpress.__with__({ marky: markySpy })
      (() => markpress(input, {})).then(() => {
        sinon.assert.calledOnce(markySpy);
        sinon.assert.calledWith(markySpy,
          '# one slide\n',
          sinon.match({ sanitize: false })
        );
        done();
      }).catch(done);
    });
    it('Sanitize option should be respected when turned on', (done) => {
      markpress.__with__({ marky: markySpy })
      (() => markpress(input, { sanitize: true })).then(() => {
        sinon.assert.calledOnce(markySpy);
        sinon.assert.calledWith(markySpy,
          '# one slide\n',
          sinon.match({ sanitize: true })
        );
        done();
      }).catch(done);
    });
  });
});

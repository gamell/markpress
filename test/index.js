'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');

const markpress = require('../index.js');
const input = path.resolve(__dirname, './fixtures/input.md');

let sandbox;
let html;

describe('markpress feature test', () => {
  before((done) => {
    markpress(input, {
      autoSplit: true,
      theme: 'dark',
    }).then((content) => {
      html = content;
      done();
    }).catch(done);
  });
  after(() => {

  });
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Auto Split', () => {
    it('should split slides correctly by H1', () => {
      assert.include(
        html,
        '<h1 id="user-content-test-markdown-page" class="deep-link">Test markdown page</h1>'
      );
      assert.include(
        html,
        '<h1 id="user-content-second-slide" class="deep-link">Second slide</h1>'
      );
      assert.include(
        html,
        '<h1 id="user-content-third-slide" class="deep-link">Third slide</h1>'
      );
    });
  });
  describe('Allow HTML', () => {
    it('should allow HTML by default', () => {
      assert.include(
        html,
        '<h2>It <strong>should</strong> support HTML</h2>', 'HTML contains correct native HTML tags'
      );
    });
  });
  describe('CSS', () => {
    it('should contain Print CSS', () => {
      assert.include(html, '<style media="print"', 'HTML contains Print CSS tag');
      assert.include(
        html,
        'break-after: always !important;',
        'HTML includes page-breaks for printing'
      );
    });
    it('should contain the impressjs CSS', () => {
      assert.include(html, '<style type="text/css">', 'HTML contains general CSS tag');
      assert.include(
        html,
        'break-after: always !important;',
        'HTML includes page-breaks for printing'
      );
    });
  });
  describe('Feature Support', () => {
    it('should support Emojis', () => {
      // U+1f42a = Camel Emoji
      // &#x1F42A; = Camel Emoji encoded for HTML❤️
      assert.include(html, 'Emoji: &#x1F42A;', 'HTML contains Emoji');
    });
    it('should support simple Code Blocks', () => {
      assert.include(
        html,
        '<code>Code code code</code>',
        'HTML contains simple code blocks'
      );
    });
    it('should support language-specifc Code Blocks', () => {
      assert.include(
        html,
        '<span class="punctuation terminator statement js"><span>;</span>',
        'HTML contains language-specific code blocks'
      );
    });
    it('should support Tables', () => {
      assert.include(
        html,
        '<table>',
        'HTML contains table tag'
      );
    });
    it('should support Layouts', () => {
      assert.include(
        html,
        'class="step" data-x="2600"',
        'HTML contains layout position data attributes'
      );
    });
    it('should support Themes', () => {
      assert.include(
        html,
        'background: radial-gradient(#333, #0f0f0f);',
        'HTML contains dark theme CSS'
      );
    });
  });
});

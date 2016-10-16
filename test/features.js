'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');

const markpress = require('../index.js');
const input = path.resolve(__dirname, './fixtures/input.md');
const inputEmbeddedOptions = path.resolve(__dirname, './fixtures/embedded-options.md');

const slidesRegex = /<div class="step"/gi;

let sandbox;
let html;
let md;

const runMarkpress = (i, options, done) =>
  markpress(i, options).then(res => {
    html = res.html;
    md = res.md;
    done();
  }).catch(done);

const generateHtml = (options, done) =>
  runMarkpress(input, options, done);

const generateHtmlEmbeddedOptions = (options, done) =>
  runMarkpress(inputEmbeddedOptions, options, done);

describe('markpress feature test', function test() {
  // can't use arrow functions because of 'this' problem
  // https://derickbailey.com/2015/09/28/do-es6-arrow-functions-really-solve-this-in-javascript/
  this.timeout(5000);
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Auto-split: On', () => {
    before(done => {
      generateHtml({
        autoSplit: true
      }, done);
    });
    it('should split slides correctly by H1', () => {
      assert.include(
        html,
        '<h1 id="user-content-test-markdown-page" class="deep-link">Test markdown page</h1>'
      );
      assert.include(
        html,
        '<h1 id="user-content-second-slide" class="deep-link">Second slide</h1>'
      );
    });
    it('should not split slides by \'-----\'', () => {
      const slides = html.match(slidesRegex);
      assert.equal(slides.length, 6);
    });
  });
  describe('Auto-split: Off', () => {
    before(done => {
      generateHtml({
        autoSplit: false
      }, done);
    });
    it('should split slides by \'-----\'', () => {
      const slides = html.match(slidesRegex);
      assert.equal(slides.length, 7);
    });
  });
  describe('Sanitize: off', () => {
    before(done => {
      generateHtml({
        sanitize: false
      }, done);
    });
    it('should not remove HTML', () => {
      assert.include(
        html,
        '<h2>It <strong>should</strong> support HTML</h2>', 'HTML contains correct native HTML tags'
      );
    });
    it('should not remove <script>', () => {
      assert.include(
        html,
        '<script>var helloWorld;</script>',
        'HTML contains script tag'
      );
    });
    it('should not remove <style>', () => {
      assert.include(
        html,
        '<style>#gamell{font-weight: bold;}</style>',
        'HTML contains style tag'
      );
    });
  });
  describe('Sanitize: On', () => {
    before(done => {
      generateHtml({
        sanitize: true
      }, done);
    });
    it('should not remove HTML', () => {
      assert.include(
        html,
        '<h2>It <strong>should</strong> support HTML</h2>', 'HTML contains correct native HTML tags'
      );
    });
    it('should remove <script>', () => {
      assert.notInclude(
        html,
        '<script>var helloWorld;</script>',
        'HTML doesn\'t contain script tag'
      );
    });
    it('should not remove <style>', () => {
      assert.notInclude(
        html,
        '<style>#gamell{font-weight: bold;}</style>',
        'HTML does not contain style tag'
      );
    });
  });
  describe('Theme: Light', () => {
    before(done => {
      generateHtml({
        theme: 'light'
      }, done);
    });
    it('should contain light theme CSS', () => {
      assert.include(html, 'background: radial-gradient(#f0f0f0, #bebebe);');
    });
  });
  describe('Theme: Dark', () => {
    before(done => {
      generateHtml({
        theme: 'dark'
      }, done);
    });
    it('should contain dark theme CSS', () => {
      assert.include(html, 'background: radial-gradient(#333, #0f0f0f);');
    });
  });
  describe('Image embed: On', () => {
    before(done => {
      generateHtml({
        embed: true
      }, done);
    });
    it('should not contain the remote image url', () => {
      assert.notInclude(html, 'http://www.canbike.org/public/images/030114/Bitcoin_Logo.png');
    });
    it('should not contain local image path', () => {
      assert.notInclude(html, 'joan-gamell.png');
    });
    it('should contain remote embedded image', () => {
      assert.include(html, 'ABWggAAVoIBmJzXMQAAABl0RVh0U29mdHdh');
    });
    it('should contain local embedded image', () => {
      assert.include(html, '/4CkYFhJeWFjarSFgTxPVsG80LCCKbhyzjxyUkIhOSEpKODQAA');
    });
  });
  describe('Image embed: Off', () => {
    before(done => {
      generateHtml({
        embed: false
      }, done);
    });
    it('should contain the remote image url', () => {
      assert.include(html, 'http://www.canbike.org/public/images/030114/Bitcoin_Logo.png');
    });
    it('should contain local image path', () => {
      assert.include(html, 'joan-gamell.png');
    });
    it('should contain remote embedded image', () => {
      assert.notInclude(html, 'ABWggAAVoIBmJzXMQAAABl0RVh0U29mdHdh');
    });
    it('should contain local embedded image', () => {
      assert.notInclude(html, '/4CkYFhJeWFjarSFgTxPVsG80LCCKbhyzjxyUkIhOSEpKODQAA');
    });
  });
  describe('Feature Support', () => {
    before(done => {
      generateHtml({}, done);
    });
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
  describe('Use Embedded Options over defaults', () => {
    before(done => {
      generateHtmlEmbeddedOptions({
        autoSplit: true
      }, done);
    });
    it('Should not return markdown when save is off', () => {
      assert.isUndefined(md);
    });
    it('Should use embedded options in the Markdown file over defaults', () => {
      // default sanitize is false, but it's set to true in the embedded options, so <script> tag should be removed
      assert.isUndefined(md);
      assert.notInclude(html, '<script></script>');
    });
  });
  describe('Use CLI Options over embedded Options', () => {
    before(done => {
      generateHtmlEmbeddedOptions({
        autoSplit: true,
        sanitize: false
      }, done);
    });
    it('Should use CLI options over Markdown embedded options', () => {
      // default sanitize is false, but it's set to true in the embedded options, so <script> tag should be removed
      assert.isUndefined(md);
      assert.include(html, '<script></script>');
    });
  });
  describe('Saving Options support', () => {
    before(done => {
      generateHtmlEmbeddedOptions({
        autoSplit: true,
        save: true
      }, done);
    });
    it('markpress() should return markdown when --save is on', () => {
      assert.isString(md);
    });
    it('Should use markdown embedded options if defined over defaults', () => {
      assert.isString(md);
      assert.include(md, '"layout": "random"');
    });
    it('Should save command-line options to markdown file', () => {
      assert.isString(md);
      assert.include(md, '"autoSplit": true');
    });
    it('Should not save the `save` property itself', () => {
      assert.isString(md);
      assert.notInclude(md, '"save": true');
    });
    it('Should not destroy the Markdown file if save option passed consecutively', done => {
      // we call markpress with the same MD output from the first execution
      markpress(md, {
        autoSplit: false,
        theme: 'dark',
        save: true
      }).then(res => {
        assert.isString(res.md);
        assert.include(res.md, '"autoSplit": false');
        assert.include(res.md, '"theme": "dark"');
        assert.notInclude(md, '"save": true');
        assert.include(res.md, '# This is Markdown file tests the embedded markpress options\n## Subheader');
        done();
      }).catch(done);
    });
  });
});

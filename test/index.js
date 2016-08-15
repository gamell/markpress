'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const path = require('path');

const markpress = require('../index.js');
const input = path.resolve(__dirname, './fixtures/input.md');

const slidesRegex = /<div class\="step"/gi

let sandbox;
let html;

const generateHtml = (options, done) => {
  markpress(input, options).then((content) => {
    html = content;
    done();
  }).catch(done);
};

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
    before((done) => {
      generateHtml({
        autoSplit: true,
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
      assert.include(
        html,
        '<h1 id="user-content-third-slide" class="deep-link">Third slide</h1>'
      );
    });
    it('should not split slides by \'-----\'', () => {
      const slides = html.match(slidesRegex);
      assert.equal(slides.length, 6);
    });
  });
  describe('Auto-split: Off', () => {
    before((done) => {
      generateHtml({
        autoSplit: false,
      }, done);
    });
    it('should split slides by \'-----\'', () => {
      const slides = html.match(slidesRegex);
      assert.equal(slides.length, 7);
    });
  });
  describe('Sanitize: off', () => {
    before((done) => {
      generateHtml({
        noHtml: false,
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
  });
  describe('Sanitize: On', () => {
    before((done) => {
      generateHtml({
        noHtml: true,
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
  });
  describe('Theme: Light', () => {
    before((done) => {
      generateHtml({
        theme: 'light',
      }, done);
    });
    it('should contain light theme CSS', () => {
      assert.include(html, 'background: radial-gradient(#f0f0f0, #bebebe);');
    });
  });
  describe('Theme: Dark', () => {
    before((done) => {
      generateHtml({
        theme: 'dark',
      }, done);
    });
    it('should contain dark theme CSS', () => {
      assert.include(html, 'background: radial-gradient(#333, #0f0f0f);');
    });
  });
  // describe('CSS', () => {
  //   it('should contain Print CSS', () => {
  //     assert.include(html, '<style media="print"', 'HTML contains Print CSS tag');
  //     assert.include(
  //       html,
  //       'break-after: always !important;',
  //       'HTML includes page-breaks for printing'
  //     );
  //   });
  //   it('should contain the impressjs CSS', () => {
  //     assert.include(html, '<style type="text/css">', 'HTML contains general CSS tag');
  //     assert.include(
  //       html,
  //       'break-after: always !important;',
  //       'HTML includes page-breaks for printing'
  //     );
  //   });
  // });
  // describe('Feature Support', () => {
  //   it('should support Emojis', () => {
  //     // U+1f42a = Camel Emoji
  //     // &#x1F42A; = Camel Emoji encoded for HTML❤️
  //     assert.include(html, 'Emoji: &#x1F42A;', 'HTML contains Emoji');
  //   });
  //   it('should support simple Code Blocks', () => {
  //     assert.include(
  //       html,
  //       '<code>Code code code</code>',
  //       'HTML contains simple code blocks'
  //     );
  //   });
  //   it('should support language-specifc Code Blocks', () => {
  //     assert.include(
  //       html,
  //       '<span class="punctuation terminator statement js"><span>;</span>',
  //       'HTML contains language-specific code blocks'
  //     );
  //   });
  //   it('should support Tables', () => {
  //     assert.include(
  //       html,
  //       '<table>',
  //       'HTML contains table tag'
  //     );
  //   });
  //   it('should support Layouts', () => {
  //     assert.include(
  //       html,
  //       'class="step" data-x="2600"',
  //       'HTML contains layout position data attributes'
  //     );
  //   });
  //   it('should support Themes', () => {
  //     assert.include(
  //       html,
  //       'background: radial-gradient(#333, #0f0f0f);',
  //       'HTML contains dark theme CSS'
  //     );
  //   });
  // });
});

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
      autoSplit: true
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
        '<h2>It <strong>should</strong> support HTML</h2>', 'HTML contains correct native HTML code'
      );
    });
  });
  describe('Emoji Support', () => {

  });
  describe('Code Block support', () => {

  });
  describe('Themes', () => {

  });
  describe('Layouts', () => {

  });
});

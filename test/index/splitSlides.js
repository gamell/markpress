/* eslint no-underscore-dangle: ["error", { "allow": ["__with__", "__get__"] }] */

'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const path = require('path');
const rewire = require('rewire');
const util = require('../../lib/util.js');

const markpress = rewire('../../index.js');

const mdPath = path.resolve(__dirname, '../fixtures/three-slides.md');
const emptyFirstSlidePath = path.resolve(__dirname, '../fixtures/empty-first-slide.md');

const md = String(util.readFile(mdPath));
const emptyFirstSlide = String(util.readFile(emptyFirstSlidePath));


let sandbox;

const splitSlides = markpress.__get__('splitSlides');

describe('markpress split slides logic (index.js)', () => {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('We should have 3 slides if autoSplit is turned off', () => {
    const slides = splitSlides(md, false);
    assert.equal(slides.length, 3);
  });
  it('We should have 2 slides if autoSplit is turned on', () => {
    const slides = splitSlides(md, true);
    assert.equal(slides.length, 2);
  });
  it('There should be no slide separators after split with autoSplit off', () => {
    const slides = splitSlides(md, false);
    slides.forEach((s) => {
      assert.notInclude('-----', s);
    });
  });
  it('There should be no slide separators after split with autoSplit on', () => {
    const slides = splitSlides(md, true);
    slides.forEach((s) => {
      assert.notInclude('-----', s);
    });
  });
  it('Empty first slide should be removed when autoSplit = true', () => {
    const slides = splitSlides(emptyFirstSlide, true);
    assert.equal(slides.length, 1);
  });
  it('Empty first slide should not be removed when autoSplit = false', () => {
    const slides = splitSlides(emptyFirstSlide, false);
    assert.equal(slides.length, 2);
  });
});

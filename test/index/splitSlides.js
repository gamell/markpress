/* eslint no-underscore-dangle: ["error", { "allow": ["__with__", "__get__"] }] */

'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const path = require('path');
const rewire = require('rewire');
const util = require('../../lib/util.js');

const markpress = rewire('../../index.js');

const threeSlidesPath = path.resolve(__dirname, '../fixtures/three-slides.md');
const emptyFirstSlidePath = path.resolve(__dirname, '../fixtures/empty-first-slide.md');
const embeddedOptionsPath = path.resolve(__dirname, '../fixtures/embedded-options-split.md');

const threeSlides = String(util.readFile(threeSlidesPath));
const emptyFirstSlide = String(util.readFile(emptyFirstSlidePath));
const embeddedOptionsSlide = String(util.readFile(embeddedOptionsPath));

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
    const slides = splitSlides(threeSlides, false);
    assert.equal(slides.length, 3);
  });
  it('We should have 2 slides if autoSplit is turned on', () => {
    const slides = splitSlides(threeSlides, true);
    assert.equal(slides.length, 2);
  });
  it('There should be no slide separators after split with autoSplit off', () => {
    const slides = splitSlides(threeSlides, false);
    slides.forEach(s => {
      assert.notInclude('-----', s);
    });
  });
  it('There should be no slide separators after split with autoSplit on', () => {
    const slides = splitSlides(threeSlides, true);
    slides.forEach(s => {
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
  it('We should remove the first slide when autosplit is ON and it only contains html comments', () => {
    const slides = splitSlides(embeddedOptionsSlide, true);
    assert.notInclude(slides[0], '<!--markpress-opt');
    assert.equal(slides.length, 2);
  });
  it('We should NOT remove the first slide when autosplit is OFF and it only contains html comments', () => {
    const slides = splitSlides(embeddedOptionsSlide, false);
    assert.include(slides[0], '<!--markpress-opt');
    assert.equal(slides.length, 1);
  });
});

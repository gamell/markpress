"use strict";

const path = require("path");
const util = require("../../lib/util.js");
const markpress = require("../../index.js");

const threeSlidesPath = path.resolve(__dirname, "../fixtures/three-slides.md");
const emptyFirstSlidePath = path.resolve(
  __dirname,
  "../fixtures/empty-first-slide.md"
);
const embeddedOptionsPath = path.resolve(
  __dirname,
  "../fixtures/embedded-options-split.md"
);

const threeSlides = String(util.readFile(threeSlidesPath));
const emptyFirstSlide = String(util.readFile(emptyFirstSlidePath));
const embeddedOptionsSlide = String(util.readFile(embeddedOptionsPath));

const splitSlides = markpress.splitSlides;

describe("markpress split slides logic (index.js)", () => {
  it("We should have 3 slides if autoSplit is turned off", () => {
    const slides = splitSlides(threeSlides, false);
    expect(slides.length).toEqual(3);
  });
  it("We should have 2 slides if autoSplit is turned on", () => {
    const slides = splitSlides(threeSlides, true);
    expect(slides.length).toEqual(2);
  });
  it("There should be no slide separators after split with autoSplit off", () => {
    const slides = splitSlides(threeSlides, false);
    slides.forEach((s) => {
      expect(s).not.toMatch("-----");
    });
  });
  it("There should be no slide separators after split with autoSplit on", () => {
    const slides = splitSlides(threeSlides, true);
    slides.forEach((s) => {
      expect(s).not.toMatch("-----");
    });
  });
  it("Empty first slide should be removed when autoSplit = true", () => {
    const slides = splitSlides(emptyFirstSlide, true);
    expect(slides.length).toEqual(1);
  });
  it("Empty first slide should not be removed when autoSplit = false", () => {
    const slides = splitSlides(emptyFirstSlide, false);
    expect(slides.length).toEqual(2);
  });
  it("We should remove the first slide when autosplit is ON and it only contains html comments", () => {
    const slides = splitSlides(embeddedOptionsSlide, true);
    expect(slides.length).toEqual(2);
    expect(slides[0]).not.toMatch("<!--markpress-opt");
  });
  it("We should NOT remove the first slide when autosplit is OFF and it only contains html comments", () => {
    const slides = splitSlides(embeddedOptionsSlide, false);
    expect(slides.length).toEqual(1);
    expect(slides[0]).toMatch("<!--markpress-opt");
  });
});

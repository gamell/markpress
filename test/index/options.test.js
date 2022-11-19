"use strict";

const path = require("path");

// When modules export a function directly we need to mock them like this

jest.mock("../../lib/dom-transformer", () =>
  jest.fn((input) => Promise.resolve(input))
);

const mp = require("../../index.js");
const markpress = mp.run;

// For mocking
const dompurify = require("dompurify");
const log = require("../../lib/log");
const layoutGenerator = require("../../lib/layout");
const css = require("../../lib/css-helper");
const transform = require("../../lib/dom-transformer");

const input = path.resolve(__dirname, "../fixtures/one-slide.md");
const embeddedOptionsInput = path.resolve(
  __dirname,
  "../fixtures/embedded-options.md"
);

describe("markpress option logic (index.js)", () => {
  describe("Sanitize option", () => {
    const sanitizeMock = jest.fn();
    dompurify.sanitize = sanitizeMock;
    beforeEach(() => {
      sanitizeMock.mockClear();
    });

    it("Sanitize option should be false by default", async () => {
      await markpress(input, {});
      expect(sanitizeMock).toHaveBeenCalledTimes(0);
    });
    it("Sanitize option should be respected when turned on", async () => {
      await markpress(input, { sanitize: true });
      expect(sanitizeMock).toHaveBeenCalledTimes(1);
      expect(sanitizeMock).toHaveBeenCalledWith(
        expect.stringMatching("one slide")
      );
    });
  });
  describe("Verbose Option", () => {
    const logInitMock = jest.fn();
    log.init = logInitMock;
    beforeEach(() => {
      logInitMock.mockClear();
    });
    it("Verbose should be false by default when using as npm package", async () => {
      await markpress(input, {});
      expect(logInitMock).toHaveBeenCalledTimes(1);
      expect(logInitMock).toHaveBeenCalledWith(false);
    });
    it("Verbose option should be respected when passed", async () => {
      await markpress(input, { verbose: true });
      expect(logInitMock).toHaveBeenCalledTimes(1);
      expect(logInitMock).toHaveBeenCalledWith(true);
    });
  });
  describe("Theme option", () => {
    const cssGetHelperSpy = jest.fn();
    css.get = cssGetHelperSpy;
    beforeEach(() => {
      cssGetHelperSpy.mockClear();
    });
    it("Theme should be 'light' by default", async () => {
      await markpress(input, {});
      expect(cssGetHelperSpy).toHaveBeenCalledTimes(2);
      expect(cssGetHelperSpy).toHaveBeenCalledWith(
        expect.stringMatching("/styles"),
        "light"
      );
    });
    it("Theme should be respected when passed", async () => {
      await markpress(input, { theme: "dark" });
      expect(cssGetHelperSpy).toHaveBeenCalledTimes(2);
      expect(cssGetHelperSpy).toHaveBeenCalledWith(
        expect.stringMatching("/styles"),
        "dark"
      );
    });
  });
  describe("Layout Option", () => {
    it("Layout should be 'horizontal' by default", async () => {
      const horizontalLayoutSpy = jest.spyOn(layoutGenerator, "horizontal");
      await markpress(input, {});
      expect(horizontalLayoutSpy).toHaveBeenCalledTimes(1);
    });
    it("Layout should be respected when passed", async () => {
      const verticalLayoutSpy = jest.spyOn(layoutGenerator, "vertical");
      await markpress(input, { layout: "vertical" });
      expect(verticalLayoutSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("Embed Option", () => {
    beforeEach(() => {
      transform.mockClear();
    });
    it("embed should be true by default", async () => {
      await markpress(input, {});
      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform).toHaveBeenCalledWith(expect.anything(), true);
    });
    it("embed should respected when passed", async () => {
      await markpress(input, { embed: false });
      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform).toHaveBeenCalledWith(expect.anything(), false);
    });
  });
  describe("Autosplit Option", () => {
    const splitSlidesSpy = jest.spyOn(mp, "splitSlides");
    beforeEach(() => {
      splitSlidesSpy.mockClear();
    });
    it("autoSplit should be false by default", async () => {
      await markpress(input, {});
      expect(splitSlidesSpy).toHaveBeenCalledTimes(1);
      expect(splitSlidesSpy).toHaveBeenCalledWith(expect.anything(), false);
    });
    it("autoSplit should be respected when passed", async () => {
      await markpress(input, { autoSplit: true });
      expect(splitSlidesSpy).toHaveBeenCalledTimes(1);
      expect(splitSlidesSpy).toHaveBeenCalledWith(expect.anything(), true);
    });
  });
  describe("Save Option", () => {
    const embedOptionsSpy = jest.spyOn(mp, "embedOptions");
    beforeEach(() => {
      embedOptionsSpy.mockClear();
    });
    it("save should be false by default", async () => {
      const { html, md } = await markpress(input, {});
      expect(embedOptionsSpy).toHaveBeenCalledTimes(0);
      expect(typeof html === "string").toEqual(true);
      expect(md).toBeUndefined();
    });
    it("save should be respected when passed", async () => {
      const { md } = await markpress(input, { save: true, theme: "dark" });
      expect(embedOptionsSpy).toHaveBeenCalledTimes(1);
      expect(embedOptionsSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ theme: "dark" })
      );
      expect(md).toMatch(
        '<!--markpress-opt\n\n{\n\t"theme": "dark",\n\t"title": "one-slide",\n\t"layout": "horizontal",\n\t"embed": true,\n\t"autoSplit": false,\n\t"sanitize": false\n}\n\nmarkpress-opt-->\n# one slide\n'
      );
      expect(md).not.toMatch('"save": true');
    });
  });
  describe("Option Precedence", () => {
    const mdToHtmlSpy = jest.spyOn(mp, "mdToHtml");
    beforeEach(() => {
      mdToHtmlSpy.mockClear();
    });
    it("Default options should be used if no other options found", async () => {
      const { html } = await markpress(input, {});
      expect(mdToHtmlSpy).toHaveBeenCalledTimes(1);
      expect(typeof html === "string").toEqual(true);
      expect(mdToHtmlSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          layout: "horizontal",
          theme: "light",
          verbose: false,
        })
      );
    });
    it("Embedded options should take precedence over defaults", async () => {
      const { html } = await markpress(embeddedOptionsInput, {});
      expect(mdToHtmlSpy).toHaveBeenCalledTimes(1);
      expect(typeof html === "string").toEqual(true);
      expect(mdToHtmlSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          layout: "random",
          theme: "dark",
          verbose: false,
        })
      );
    });
    it("CLI options should take precedence over embedded", async () => {
      const { html } = await markpress(embeddedOptionsInput, {
        layout: "vertical",
        theme: "dark",
      });
      expect(mdToHtmlSpy).toHaveBeenCalledTimes(1);
      expect(typeof html === "string").toEqual(true);
      expect(mdToHtmlSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          layout: "vertical",
          theme: "dark",
          verbose: false,
        })
      );
    });
  });
});

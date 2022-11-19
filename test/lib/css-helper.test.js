"use strict";

const cssHelper = require("../../lib/css-helper.js");

// css-helper dependencies
const util = require("../../lib/util");
const less = require("less");
const log = require("../../lib/log");

describe("CSS Helper", () => {
  const lessRenderSpy = jest
    .spyOn(less, "render")
    .mockImplementation(() => Promise.resolve("compiled css file"));
  const logErrorSpy = jest.spyOn(log, "error");
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("get()", () => {
    it("should log an error when the theme is invalid", async () => {
      await cssHelper.get("non-existant-path", "invalid-theme");
      expect(logErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should log an error when the path is invalid", async () => {
      jest.spyOn(util, "readFile").mockImplementation(() => {
        throw new Error("File not found");
      });
      await cssHelper.get("incorrect-path", "dark");
      const testPath = "incorrect-path/styles.less";
      expect(util.readFile).toHaveBeenCalledTimes(1);
      expect(util.readFile).toHaveBeenCalledWith(testPath);
      expect(logErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should call lessRenderSpy when path and theme are valid", async () => {
      jest.spyOn(util, "readFile").mockImplementation(() => "test less file");
      await cssHelper.get("correct-path", "dark");
      const testPath = "correct-path/styles.less";
      expect(util.readFile).toHaveBeenCalledTimes(1);
      expect(util.readFile).toHaveBeenCalledWith(testPath);
      expect(lessRenderSpy).toHaveBeenCalledTimes(1);
      expect(lessRenderSpy).toHaveBeenCalledWith(
        "test less file",
        expect.objectContaining({
          modifyVars: {
            "@theme": "dark",
          },
          filename: testPath,
        })
      );
    });
  });
});

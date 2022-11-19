"use strict";

const intercept = require("intercept-stdout");
const log = require("../../lib/log.js");
let stdOutput;
let unhook;

describe("Log", () => {
  beforeEach(() => {
    stdOutput = "";
    errOutput = "";
    unhook = intercept(
      (txt) => {
        stdOutput += txt;
      },
      (txt) => {
        errOutput += txt;
      }
    );
  });
  afterEach(() => {
    unhook();
  });
  describe("#info", () => {
    it("should not print info log in stdout when calling log.info() and verbose is false", () => {
      log.init(false);
      log.info("test");
      expect(stdOutput).toEqual("");
    });
    it("should print info log in stdout when calling log.info() and verbose is true", () => {
      log.init(true);
      log.info("test");
      expect(stdOutput).toMatch("test");
    });
    it("should print warn log in stdout when calling log.info() and verbose is false", () => {
      log.init(false);
      log.warn("test");
      expect(stdOutput).toMatch("test");
    });
    it("should print in stdout when calling log.error() and verbose is false", () => {
      log.init(false);
      log.error("test");
      expect(stdOutput).toMatch("test");
    });
  });
});

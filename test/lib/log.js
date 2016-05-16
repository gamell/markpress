'use strict';

const assert = require('chai').assert;
const intercept = require('intercept-stdout');
const log = require('../../lib/log.js');
let stdOutput;
let errOutput;
let unhook;

describe('Log', () => {
  beforeEach(() => {
    stdOutput = '';
    errOutput = '';
    unhook = intercept((txt) => {
      stdOutput += txt;
    },
    (txt) => {
      errOutput += txt;
    });
  });
  afterEach(() => {
    unhook();
  });
  describe('#info', () => {
    it('should not print in stdout when calling log.info() and verbose is false', () => {
      log.init(false);
      log.info('test');
      assert.equal(stdOutput, '');
    });
    it('should print in stdout when calling log.info() and verbose is true', () => {
      log.init(true);
      log.info('test');
      assert.isTrue(stdOutput.indexOf('test') > -1);
    });
    it('should print in stderr when calling log.error() and verbose is true', () => {
      log.init(true);
      log.error('test');
      assert.isTrue(errOutput.indexOf('test') > -1);
    });
  });
});

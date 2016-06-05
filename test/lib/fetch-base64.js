'use strict';

const assert = require('chai').assert;
const fetch = require('../../lib/fetch-base64.js');
const sinon = require('sinon');
const fs = require('fs');

describe('Fetch Base64', () => {
  before(() => {
  });
  after(() => {
  });
  beforeEach(() => {
  });
  afterEach(() => {
  });
  describe('fetchImageBase64()', () => {
    it('should always return a promise', () => {
      assert(typeof fetch('non-existant-path').then === 'function');
      assert(typeof fetch().then === 'function');
    });

    it('it should throw an error when mime type is not an image', (done) => {
      fetch('/non-existant-path/non-image.txt').catch((e) => {
        assert.equal(e, 'The referenced file is not an image.');
        done();
      });
    });

    it('should successfully return an existing local image', (done) => {
      // call the 2nd argument passed to the readFile() function (callback) with given args
      sinon.stub(fs, 'readFile').callsArgWith(1, null, 'png-data');
      fetch('/existing-path/image.png').then((res) => {
        assert.equal(res, 'data:image/png;base64,png-data');
        done();
      });
    });
  });
});

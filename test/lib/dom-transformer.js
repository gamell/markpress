'use strict';

const assert = require('chai').assert;
const domTransformer = require('../../lib/dom-transformer.js');
const sinon = require('sinon');

// css-helper dependencies
const fetch = require('fetch-base64');

let sandbox;

describe('DOM Transformer', () => {
  before(() => {
  });
  after(() => {
  });
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('transform()', () => {
    it('should return a promise', (done) => {
      // const t1 = sandbox.stub()
      // domTransformer.transform('',)
      done();
    });

    it('should apply the given transformations to $', (done) => {
      done();
    });

    it('should log an error when the path is invalid', (done) => {
      done();
    });

    it('should call less.render when path and theme are valid', (done) => {
      done();
    });
  });
});

#! /usr/bin/env node -harmony

'use strict';

const me = require('./markpress-executor');
const log = require('../lib/log');
const StackTrace = require('stacktrace-js');

me(process.argv).then(exit => {
  if (exit) process.exit(0);
}).catch(reason => {
  log.error(`${reason} \n\nStackTrace: \n\n`);
  StackTrace.fromError(reason).then(console.log).then(() => process.exit(1));
});

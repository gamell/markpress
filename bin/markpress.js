#! /usr/bin/env node -harmony

'use strict';

const me = require('./markpress-executor');
me(process.argv).then(({code = 0, exit = true}) => {
  if (exit) process.exit(code);
}).catch(() => process.exit(1));

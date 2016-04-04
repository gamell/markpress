<!-- x=1500 y=500 z=1500 -->
# Markdown-Impress

-----------------------------
<!-- x=500 y=0 scale=0.5 -->
## What is it
*markpress* is a tool to convert markdown to an [*impressjs*](https://github.com/impress/impress.js/) html presentation. It is based on [*markdown-impress*](https://github.com/steel1990/markdown-impress) by [steel1990](https://github.com/steel1990)

-----------------------------
<!-- x=2500 y=0 -->
## How to install

### Globally
`$ npm install -g markdown-impress`

### For the current project only
`$ npm install markdown-impress`

-----------------------------
<!-- x=3000 y=1000 -->
## Markdown format
+ use `------` to separate each slide
+ use HTML comments to set impress `attr`, such as `<!-- x=0 y=0 rotate=0 scale=1 -->` please note that this will disable any `layout` selected.
<!-- + [this page](http://steel1990.github.io/markdown-impress/) is made by *markdown-impress* use [this markdown](https://raw.githubusercontent.com/steel1990/markdown-impress/master/README.md). -->

-----------------------------
<!-- x=1500 y=1000 rotate=90 -->
## How To Use
![How to use markpress](./mtoi-help.png)

-------------------------------
<!-- x=0 y=1000 -->
## Use in your code

```
var fs = require('fs');
var mtoi = require('markdown-impress');
var content = mtoi('file.md');
fs.writeFileSync('file.html', content);
```

## Todo

- Layout and Style options
- ES2015
- eslint
- unit tests


## Other packages

https://www.npmjs.com/package/impress.md
https://github.com/steel1990/markdown-impress

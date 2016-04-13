# Markpress

-----------------------------
## What is it
*markpress* is a tool to convert markdown to an [*impressjs*](https://github.com/impress/impress.js/) html presentation. It is based on [*markdown-impress*](https://github.com/steel1990/markdown-impress) by [steel1990](https://github.com/steel1990)

-----------------------------
## How to install

### Globally
`$ npm install -g markpress`

### For the current project only
`$ npm install markpress`

-----------------------------
## Markdown format
+ Use `------` to separate each slide
+ Use HTML comments to set [impress attrs](https://github.com/impress/impress.js/), such as `<!-- x=0 y=0 rotate=0 scale=1 -->` please note that comments will be ignored if the `layout` option is passed.
+ You can write embedded HTML if you pass the `-h` or `--allow-html` flag.
<!-- + [this page](http://steel1990.github.io/markdown-impress/) is made by *markdown-impress* use [this markdown](https://raw.githubusercontent.com/steel1990/markdown-impress/master/README.md). -->

-----------------------------
## How To Use

![How to use markpress](./markpress-help.png)

## Options

- `-i <path>` or `--input <path>`
- `-o <path>` or `--output <path>`
- `-a` or `--auto-split`
- `-h` or `--allow-html`
- `-t <theme>` or `--theme <theme>`

-------------------------------
## Use in your code

```js
var fs = require('fs');
var markpress = require('markpress');
// defaults:
var options = {
  layout: 'horizontal',
  theme: 'light',
  autoSplit: false,
  allowHtml: false,
  verbose: false
}
var content = markpress('file.md', options).then(() => {
      fs.writeFileSync('file.html', content);
});
```

-------------------------------
## Develop

### Running:

`$ node --harmony ./bin/markpress.js -i input.html -o output.html`

### Debugging

`$ node debug --harmony ./bin/markpress.js -i input.html -o output.html`

### Linking

`npm link`

-------------------------------
## Roadmap

- Improve style for:
  - Ordered lists
  - links
  - Code block highlighting
- Unit tests
- Allow to define slide-specific CSS
- `custom-styles` option to use your own CSS / Less files


## References

- https://www.npmjs.com/package/impress.md
- https://github.com/steel1990/markdown-impress
- Github markdown CSS: https://github.com/sindresorhus/github-markdown-css

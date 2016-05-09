# Markpress

-----------------------------
## What is it
*markpress* is a tool to convert markdown files to an [*impressjs*](https://github.com/impress/impress.js/) html presentation. It was initially based on [*markdown-impress*](https://github.com/steel1990/markdown-impress) by [steel1990](https://github.com/steel1990) and greatly extended.

-----------------------------
## How to install

`node` version >= `5.0.0` is required, as ES2015 features are used.

### Globally

`$ npm install -g markpress`  (globally)

or

`$ npm install markpress` (for the current folder only)

-----------------------------
## Features
- Automatic layout generation
- Automatic slide split by `h1`
- Built-in themes ( `dark`, `light`, `dark-serif`, `light-serif`)
- ~~Individual slide-level CSS customizations~~ (soon)
- Generates self-contained HTML file by embedding images (no network connection needed when presenting)
- Code highlighting for most common programming languages
- Supports [Emojis](http://www.emoji-cheat-sheet.com/)! :smile::thumbsup: :camel::dash:
- Responsive design adapts to different screen sizes
- Adaptive text size (using `vmin` and `vmax`)
- Github-inspired CSS styles
- Will run fine in the latest Firefox, Chrome, Safari and *probably* Edge

-----------------------------
## Markdown format
+ Standard Markdown format is supported via [marky-markdown](https://www.npmjs.com/package/marky-markdown) package.
+ Use `------` to separate each slide (optional). Example
+ Use HTML comments to set [impress slide attributes](https://github.com/impress/impress.js/blob/master/index.html#L203), such as `<!--slide-attr x=0 y=0 rotate=0 scale=1 -->`. Example
+ You can write embedded HTML unless you pass the `-nh` or `--no-html` flag (see below for more information)

-----------------------------
## How To Use

![How to use markpress](./markpress-help.png)

## Options

### `-i <path>` or `--input <path>`

Path to the input file. A [Mardown file](https://daringfireball.net/projects/markdown/) is expected.

### `-o <path>` or `--output <path>`

Path to the output HTMl file.

### `-l`, `--layout` or `{ layout: String }` in code

**Default**: `horizontal`

Automatically generate the layout for the slides. **This option will be ignored if any HTML comment specifying slide positioning attributes is found**, so please remove all HTML comments (`<!--slide-attr ... -->`) from the markdown file if you want to use this feature.

Available Layouts:

- `horizontal` (default): Slides positioned along the `x` axis. Example
- `vertical`: Slides positioned along the `y` axis. Example
- `3d-push`: Slides positioned along the `z` axis. Slide `n` will be positioned *lower* than `n+1`. Example
- `3d-pull`: Slides positioned along the `z` axis. Slide `n` will be positioned *higher* than `n+1`. Example
- `grid`: Slides positioned along the `x` and `y` axis in a grid fashion. Example
- `random`: Slides positioned randomly on a 5D space (`x`,`y`,`z`,`rotate`,`scale`). Note that this layout generator might position slides on top of each other. Re-generate until a satisfactory layout is generated. Example
- `random-7d`: [warning: **messy**] Slides positioned randomly on the 7D space (`x`,`y`,`z`,`rotate-x`,`rotate-y`,`rotate-z`,`scale`). This layout generator might position slides on top of each other. Re-generate until a satisfactory layout is generated. Example

### `-a`, `--auto-split` or `{ autoSplit: Boolean }` in code

**Default**: `false`

Automatically create a slide for every `H1` (`# Heading 1`) level element (if `------` are present will be removed and ignored)

### `-nh`, `--no-html` or `{ allowHtml: boolean }` in code

**Default**: `false` (HTML allowed)

Disallow HTML code embedded in the Markdown file. You should leave it enabled if you want to use things like `<kbd></kbd>` tags, embed videos, etc.

### `-t <theme>`, `--theme <theme>` or `{ theme: String }` in code

**Default**: `light`

Chose from the different available themes:

- `light` (default): Light theme with Sans-serif font
- `dark`: Dark theme with Sans-serif font
- `light-serif`: Light theme with Sans-Serif font
- `dark-serif`: Light theme with Serif font

### `-ne`, `--no-embed` or `{ noEmbed: true }` in code

**Default**: `false`

By default, markpress will try to download / copy and embed the referenced images into the HTML so they will be available offline and you will not have problems moving the HTML to other folders. This feature will be disabled if `--no-embed` is set to true.

### `-s`, `--silent` or `{ silent: Boolean }` in code

**Default**: `false`

Silence all console outputs.

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
## Developing

### Run

`$ node --harmony ./bin/markpress.js -i input.html -o output.html`

### Debug

`$ node debug --harmony ./bin/markpress.js -i input.html -o output.html`

### Linking

`npm link`

-------------------------------
## Roadmap

Roadmap of planned features can be found [here](https://github.com/gamell/markpress/issues?q=is%3Aopen+is%3Aissue+label%3Aroadmap). Suggestions are welcome.

## Contributing

Please see [`CONTRIBUTING.md`](https://github.com/gamell/markpress/blob/master/CONTRIBUTING.md)


## References and tools used

- Inspired by and based on:
  - https://github.com/steel1990/markdown-impress
  - https://www.npmjs.com/package/impress.md
- Styles based on:
  - Github markdown CSS: https://github.com/sindresorhus/github-markdown-css
  - Atom Code highlighting CSS:
    - Dark: https://github.com/atom/atom-dark-syntax
    - Light: https://github.com/atom/atom-light-syntax

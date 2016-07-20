<!--slide-attr x=0 y=0 -->

# Markpress

`markpress` is a command line tool and node package to convert [markdown files](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) into self-contained [*impressjs*](https://github.com/impress/impress.js/) `html` presentations. It was initially inspired and based on [*markdown-impress*](https://github.com/steel1990/markdown-impress) by [steel1990](https://github.com/steel1990).

[This is the outcome](https://gamell.github.io/markpress) of feeding this very `README.md` to markpress: `$ markpress README.md`

-----------------------------
<!--slide-attr x=2600 y=0 -->

## How to install

You'll need `node` version >= `5.0.0` installed on your system.

`$ npm install -g markpress` (globally)

or

`$ npm install markpress` (for the current folder only)

-----------------------------
<!--slide-attr x=2600 y=2600 -->

## Features

- Automatic slide layout generation
- Automatic slide split by `h1`
- Built-in themes ( `dark`, `light`, `dark-serif`, `light-serif`). Customizable through `<style>` tags.
- Generates self-contained HTML file by embedding images (no network connection needed when presenting)
- Code highlighting for most common programming languages
- Supports HTML & [Emojis](http://www.emoji-cheat-sheet.com/)! :smile::thumbsup: :camel::dash:
- Responsive design adapts to different screen sizes
- Adaptive text size (using `vmin` and `vmax`)
- Github-inspired CSS styles
- Will run fine in the latest Firefox, Chrome, Safari and *probably* Edge [*](http://caniuse.com/#feat=viewport-units)

-----------------------------
<!--slide-attr x=0 y=2600 rotate=90 -->

## Usage

### CLI

`$ markpress <input file> [output file] [options]`

If no output file is passed, the input's filename will be used, changing the extension to `.html`

More information: `$ markpress -h`

### In your code

```js
const fs = require('fs');
const markpress = require('markpress');
const options = {
  layout: 'horizontal',
  theme: 'light',
  autoSplit: true,
  allowHtml: false,
  verbose: false
}
markpress('input.md', options).then((content) => {
      fs.writeFileSync('output.html', content);
});
```

-----------------------------
<!--slide-attr x=-2600 y=1300 rotate-x=90 rotate-y=45 -->

## Markdown format, Custom Layout and Styles

+ [Github Flavored Markdown format](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) is supported via [marky-markdown](https://www.npmjs.com/package/marky-markdown) package, including [tables](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#tables).
+ Use `------` to separate each slide, or user the `-a` option to generate a slide each time an `h1` element is found.
+ Use HTML comments to set [impress slide attributes](https://github.com/impress/impress.js/blob/master/index.html#L203), such as `<!--slide-attr x=0 y=0 rotate=0 scale=1 -->`. [Example](https://gamell.github.io/markpress/examples/custom-layout.html)
+ You can **customize the styles** by embedding CSS in `<style>` tags as you would in any HTML.
+ You can **embedded any HTML in your markdown file** and it will be included in your slides HTML.

-------------------------------
<!--slide-attr x=0 y=4000 z=0 rotate-y=0 -->


## Options

### `-a`, `--auto-split` or `{ autoSplit: Boolean }` in code

**Default**: `false`

Automatically create a slide for every `H1` (`# Heading 1`) level element (if `------` are present will be removed and ignored)

------------
<!--slide-attr x=0 y=4000 z=1200 rotate-y=45 -->

### `-l`, `--layout` or `{ layout: String }` in code

**Default**: `horizontal`

Automatically generate the layout for the slides. **This option will be ignored if any HTML comment specifying slide positioning attributes is found**, so please remove all HTML comments (`<!--slide-attr ... -->`) from the markdown file if you want to use this feature. Available Layouts:

- `horizontal` (default): Slides positioned along the `x` axis. [Example](https://gamell.github.io/markpress/examples/horizontal.html)
- `vertical`: Slides positioned along the `y` axis. [Example](https://gamell.github.io/markpress/examples/vertical.html)
- `3d-push`: Slides positioned along the `z` axis. Slide `n` will be positioned *lower* than `n+1`. [Example](https://gamell.github.io/markpress/examples/3d-push.html)
- `3d-pull`: Slides positioned along the `z` axis. Slide `n` will be positioned *higher* than `n+1`.
- `grid`: Slides positioned along the `x` and `y` axis in a grid fashion. [Example](https://gamell.github.io/markpress/examples/grid.html)
- `random`: Slides positioned randomly on a 5D space (`x`,`y`,`z`,`rotate`,`scale`). Note that this layout generator might position slides on top of each other. Re-generate until a satisfactory layout is generated. [Example](https://gamell.github.io/markpress/examples/random.html)
- `random-7d`: [warning: **messy**] Slides positioned randomly on the 7D space (`x`,`y`,`z`,`rotate-x`,`rotate-y`,`rotate-z`,`scale`). This layout generator might position slides on top of each other. Re-generate until a satisfactory layout is generated. [Example](https://gamell.github.io/markpress/examples/random-7d.html)

------------
<!--slide-attr x=1200 y=4000 z=1800 rotate-y=90 -->

### `-ne`, `--no-embed` or `{ noEmbed: true }` in code

**Default**: `false`

By default, markpress will try to embed (using base64 encoding) the referenced images into the HTML so they will be available offline and you will not have problems moving the HTML to other folders. This feature will be disabled if `--no-embed` is set to true.

### `-nh`, `--no-html` or `{ allowHtml: boolean }` in code

**Default**: `false` (HTML allowed)

Disallow embedding of HTML code in the Markdown file. You should leave it enabled if you want to use things like `<kbd></kbd>` tags, embed videos, etc.

------------
<!--slide-attr x=2400 y=4000 z=2400 rotate-y=135 -->

### `-s`, `--silent` or `{ silent: Boolean }` in code

**Default**: `false`

Silence all console outputs.

### `-t <theme>`, `--theme <theme>` or `{ theme: String }` in code

**Default**: `light`

Chose from the different available themes:

- `light` (default): Light theme with Sans-serif font
- `dark`: Dark theme with Sans-serif font. [Example](https://gamell.github.io/markpress/examples/dark.html)
- `light-serif`: Light theme with Sans-Serif font. [Example](https://gamell.github.io/markpress/examples/light-serif.html)
- `dark-serif`: Light theme with Serif font

-------------------------------
<!--slide-attr x=1000 y=1000 scale=0.5 -->

## Developing

### Run

`$ node --harmony ./bin/markpress.js input.html output.html`

### Debug

`$ node debug --harmony ./bin/markpress.js input.html output.html`

### Linking

`npm link`

### Installing local version globally

`npm install . -g`

-------------------------------
<!--slide-attr x=1000 y=1500 z=500 rotate-x=90 scale=0.5 -->


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

-------------------------------
<!-- zoom-out slide -->
<!--slide-attr x=1200 y=2000 z=4000 scale=2 -->

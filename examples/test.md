# Test Markdown file

**Lorem ipsum** dolor sit amet, *consectetur* adipiscing elit. Etiam iaculis sem sit amet ultrices finibus:
- ~~Morbi non quam sit amet tortor volutpat convallis~~.
- **Fusce risus _odio_, placerat nec lectus in**, pretium volutpat nibh.
- Curabitur egestas sit amet ante ut ultricies.
  + Donec consequat neque ac molestie tempor. Morbi tellus diam, accumsan venenatis massa vel, facilisis pulvinar urna.

# Second slide

## Header two

### Header three


# Third Slide, some quote...

> Donec feugiat ligula dolor, elementum mollis ipsum vulputate sit amet. Nam tellus sem, semper eget velit a, placerat laoreet sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus a dolor dictum, consectetur tellus at, faucibus est.



# Fourth slide. Ordered lists

1. Integer gravida massa lectus, in tincidunt odio euismod a.
  1.  Donec ut risus libero. Pellentesque eget posuere nulla.
2. Duis vitae mauris dapibus, efficitur diam vitae, pellentesque urna.



# Fifth Slide, some links

[Ut vitae](http://gamell.io) erat nec tortor commodo blandit eu quis sem. Cras sed scelerisque ex, eu molestie nisl. Praesent molestie at libero in semper. Phasellus at sem ligula. Nam mi leo, faucibus et lacinia id, maximus ac leo. Mauris eget velit libero. Vestibulum ac mi nunc.


# Sixth Slide. Image example

![How to use markpress](../markpress-help.png)

# Seventh Slide. Code Syntax and Highlighting

```js
function createSlideHtml(content, layout) {
  return `<div class="step" ${getLayoutData(content, layout)}>${marked(content)}</div>`;
}
```

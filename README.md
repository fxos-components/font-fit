# font-fit [![](https://travis-ci.org/gaia-components/font-fit.svg)](https://travis-ci.org/gaia-components/font-fit)

## Installation

```bash
$ bower install gaia-components/font-fit
```

## Examples

- [Example](http://gaia-components.github.io/font-fit/)

## Usage

```js
var fontFit = new FontFit(myElement, {
  font: 'italic 24px arial',
  space: 300, // space for text,
  min: 16, // min font-size (optional)
  max: 24 // max font-size (optional)
});

var fontSize = fontFit.get();
myElement.style.fontSize = fontSize + 'px';
```

## Tests

1. Ensure Firefox Nightly is installed on your machine.
2. `$ npm install`
3. `$ npm test`

If your would like tests to run on file change use:

`$ npm run test-dev`

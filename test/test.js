/*global window,assert,suite,setup,teardown,sinon,test*/
/*jshint esnext:true*/

suite('FontFit', function() {
  'use strict';

  var fontFit = window['font-fit'];

  setup(function() {
    this.sinon = sinon.sandbox.create();
    this.el = document.createElement('h1');
  });

  teardown(function() {
    this.sinon.restore();
  });

  suite('Canvas Contexts', function() {
    test('It reuses canvas contexts when possible', function() {
      this.sinon.spy(document, 'createElement');

      var config = {
        text: 'hello world',
        font: 'italic 24px arial',
        space: 400
      };

      config.max = 24;
      fontFit(config);

      config.max = 40;
      fontFit(config);

      config.max = 40;
      fontFit(config);

      sinon.assert.calledTwice(document.createElement);
    });
  });

  suite('Font Size', function() {
    setup(function() {
      this.config = {
        font: 'italic 24px arial',
        space: 100,
        max: 24,
        min: 16
      };
    });

    test('It returns a font-size that fits the space', function() {
      this.config.text = createStringOfWidth(100, this.config.font);
      var result = fontFit(this.config);
      var font = this.config.font.replace(/\d+px/, result.fontSize + 'px');
      var width = measureText(this.config.text, font);
      assert.ok(width < this.config.space, 'should fit within the space');

      this.config.text = createStringOfWidth(150, this.config.font);
      result = fontFit(this.config);
      font = this.config.font.replace(/\d+px/, result.fontSize + 'px');
      width = measureText(this.config.text, font);
      assert.ok(width < this.config.space, 'should fit within the space');
    });

    test('It doesn\'t go any lower than the min fontSize', function() {
      this.config.text = createStringOfWidth(1000, this.config.font);
      var result = fontFit(this.config);
      assert.equal(result.fontSize, 16);
    });

    test('It doesn\'t go any higher than the max fontSize', function() {
      this.config.text = createStringOfWidth(10, this.config.font);
      var result = fontFit(this.config);
      assert.equal(result.fontSize, 24);
    });

    test('It ignores whitespace (just like HTML does)', function() {
      this.config.text = 'a a';
      var expected = fontFit(this.config);

      this.config.text = '      a a     ';
      var result = fontFit(this.config);

      assert.equal(result.fontSize, expected.fontSize);
      assert.equal(result.textWidth, expected.textWidth);

      this.config.text = 'a          a';
      result = fontFit(this.config);

      assert.equal(result.fontSize, expected.fontSize);
      assert.equal(result.textWidth, expected.textWidth);
    });
  });

  function createStringOfWidth(width, font) {
    var string = '';
    while (measureText(string + '.', font) < width) { string += '.'; }
    return string;
  }

  function measureText(text, font) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('moz-opaque', 'true');
    canvas.setAttribute('width', '1');
    canvas.setAttribute('height', '1');
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.font = font;
    return ctx.measureText(text).width;
  }
});

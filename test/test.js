/*global window,assert,suite,setup,teardown,sinon,test*/
/*jshint esnext:true*/

suite('FontFit', function() {
  'use strict';

  var FontFit = window['font-fit'];

  setup(function() {
    this.sinon = sinon.sandbox.create();
    this.el = document.createElement('h1');
  });

  suite('Canvas Contexts', function() {
    test('It reuses canvas contexts when possible', function() {
      var ctx1 = FontFit.prototype.getCanvasContext('italic 24px arial');
      var ctx2 = new FontFit.prototype.getCanvasContext('italic 24px arial');
      var ctx3 = new FontFit.prototype.getCanvasContext('italic 19px arial');

      assert.equal(ctx1, ctx2);
      assert.notEqual(ctx1, ctx3);
    });
  });

  suite('Font Size', function() {
    setup(function() {
      this.config = {
        font: 'italic 24px arial',
        width: 100
      };
    });

    test('It assigns a suitable', function() {
      var el = document.createElement('h1');
      var fontFit = new FontFit(el, this.config);

      el.textContent = createStringOfWidth(100, this.config.font);
      fontFit.calc();
      fontFit.set();
      assert.equal(el.style.fontSize, '24px');
    });

    test('It doesn\'t go any lower than the min fontSize', function() {
      var el = document.createElement('h1');
      var fontFit = new FontFit(el, this.config);

      el.textContent = createStringOfWidth(1000, this.config.font);
      fontFit.calc();
      fontFit.set();
      assert.equal(el.style.fontSize, '16px');
    });

    test('It doesn\'t go any higher than the max fontSize', function() {
      var el = document.createElement('h1');
      var fontFit = new FontFit(el, this.config);

      el.textContent = createStringOfWidth(10, this.config.font);
      fontFit.calc();
      fontFit.set();
      assert.equal(el.style.fontSize, '24px');
    });

    test('It takes into account padding', function() {
      var el = document.createElement('h1');
      var fontFit = new FontFit(el, this.config);

      this.config.width = 80;
      el.textContent = createStringOfWidth(100, this.config.font);
      fontFit.calc();
      fontFit.set();

      var first = el.style.fontSize;

      // For the second run we increase the size,
      // add equivalent padding either side and
      // define the element as 'border-box' sizing.
      // The efffective text content-space should be
      // the same as the first test.
      this.config.width = 100;
      this.config.paddingLeft = 10;
      this.config.paddingRight = 10;
      this.config.boxSizing = 'border-box';
      fontFit.calc();
      fontFit.set();

      var second = el.style.fontSize;

      assert.equal(first, second, 'both font-sizes match');
    });
  });

  function createStringOfWidth(width, font) {
    var string = '';
    while (getTextWidth(string + '.', font) < width) { string += '.'; }
    return string;
  }

  function getTextWidth(text, font) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('moz-opaque', 'true');
    canvas.setAttribute('width', '1');
    canvas.setAttribute('height', '1');
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.font = font;
    return ctx.measureText(text).width;
  }
});

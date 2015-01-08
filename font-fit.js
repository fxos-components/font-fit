;(function(define){define(function(require,exports,module){
/*jshint laxbreak:true*/
/*jshint esnext:true*/
/*jshint boss:true*/

/**
 * Exports
 */

module.exports = FontFit;

var debug = 0 ? console.log.bind(console) : function(){};
var cache = {};
var defaults = {
  min: 16,
  max: 24
};

function FontFit(el, config) {
  debug('init', el, config);
  this.config = config;
  this.min = config.min || defaults.min;
  this.max = config.max || defaults.max;
  this.el = el;
}

FontFit.prototype.run = function() {
  this.calc();
  this.set();
};

FontFit.prototype.calc = function() {
  debug('update');
  var output = this.findBestFontSize();
  this.textWidth = output.textWidth;
  this.fontSize = output.fontSize;
  return this;
};

FontFit.prototype.set = function() {
  this.el.style.fontSize = this.fontSize + 'px';
};

FontFit.prototype.overflowing = function() {
  return this.textWidth > this.config.width;
};

FontFit.prototype.getCanvasContext = function(font) {
  debug('get canvas context', font);

  var cached = cache[font];
  if (cached) { return cached; }

  var canvas = document.createElement('canvas');
  canvas.setAttribute('moz-opaque', 'true');
  canvas.setAttribute('width', '200px');
  canvas.setAttribute('height', '200x');

  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.font = font;

  return cache[font] = ctx;
};

FontFit.prototype.findBestFontSize = function() {
  debug('find best font size');
  var config = this.config;
  var space = this.getContentSpace();
  var text = this.el.textContent;
  var fontSize = this.max;
  var font;
  var textWidth;

  do {
    font = config.font.replace(/\d+px/, fontSize + 'px');
    textWidth = this.getTextWidth(text, font);
  } while (textWidth > space && --fontSize > this.min);

  return {
    textWidth: textWidth,
    fontSize: fontSize
  };
};

FontFit.prototype.getContentSpace = function() {
  var config = this.config;
  var borderBox = config.boxSizing === 'border-box';
  var padding = borderBox ? ((config.paddingLeft + config.paddingRight) || 0) : 0;
  var space = config.width - padding - 1;
  debug('content space', space);
  return space;
};

FontFit.prototype.getTextWidth = function(text, font) {
  var ctx = this.getCanvasContext(font);
  var width = ctx.measureText(text).width;
  debug('got text width', width);
  return width;
};

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('font-fit',this));

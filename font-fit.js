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
  this.font = config.font;
  this.space = config.space;
  this.min = config.min || defaults.min;
  this.max = config.max || defaults.max;
  this.el = el;
}

FontFit.prototype.get = function() {
  return this.findBestFontSize();
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
  var space = this.space - 1;
  var text = this.el.textContent;
  var fontSize = this.max;
  var textWidth;
  var font;

  do {
    font = this.font.replace(/\d+px/, fontSize + 'px');
    textWidth = this.getTextWidth(text, font);
  } while (textWidth > space && fontSize-- > this.min);

  return {
    textWidth: textWidth,
    fontSize: fontSize
  };
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

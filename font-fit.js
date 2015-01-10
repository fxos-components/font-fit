;(function(define){define(function(require,exports,module){
/*jshint laxbreak:true*/
/*jshint esnext:true*/
/*jshint boss:true*/

'use strict';

var debug = 0 ? console.log.bind(console) : function(){};
var cache = {};
var defaults = {
  min: 16,
  max: 24
};

module.exports = function(config) {
  debug('font fit', config);
  var space = config.space - 1;
  var min = config.min || defaults.min;
  var max = config.max || defaults.max;
  var fontSize = max;
  var textWidth;
  var font;

  do {
    font = config.font.replace(/\d+px/, fontSize + 'px');
    textWidth = getTextWidth(config.text, font);
  } while (textWidth > space && fontSize !== min && fontSize--);

  return {
    textWidth: textWidth,
    fontSize: fontSize
  };
};

function getCanvasContext(font) {
  debug('get canvas context', font);

  var cached = cache[font];
  if (cached) { return cached; }

  var canvas = document.createElement('canvas');
  canvas.setAttribute('moz-opaque', 'true');
  canvas.setAttribute('width', '1px');
  canvas.setAttribute('height', '1px');
  debug('created canvas', canvas);

  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.font = font;

  return cache[font] = ctx;
}

function getTextWidth(text, font) {
  var ctx = getCanvasContext(font);
  var width = ctx.measureText(text).width;
  debug('got text width', width);
  return width;
}

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('font-fit',this));

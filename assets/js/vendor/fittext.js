/*!
* FitText.js 1.0.1 jQuery free version
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
* Modified by Slawomir Kolodziej http://slawekk.info
*
* Date: Tue Aug 09 2011 10:45:54 GMT+0200 (CEST)
*
* Added robustness for fullscreen changes.
*/
(function(){

  var addEvent = function (el, type, fn) {
    if (el.addEventListener)
      el.addEventListener(type, fn, false);
    else
      el.attachEvent('on'+type, fn);
  };

  var extend = function(obj,ext){
    for(var key in ext)
      if(ext.hasOwnProperty(key))
        obj[key] = ext[key];
    return obj;
  };

  window.fitText = function (el, kompressor, options) {

    var settings = extend({
      'minFontSize' : 0, // Set a sane default
      'maxFontSize' : 1/0
    },options);

    var fit = function (el) {
      var compressor = kompressor || 1;

      var resizer = function () {
        // Debounce or delay resizing slightly to wait for layout reflow
        setTimeout(function() {
          if (el.clientWidth > 0) {
            el.style.fontSize = Math.max(Math.min(el.clientWidth / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
          }
        }, 50); // 50ms delay
      };

      // Call once to set.
      resizer();

      // Bind events
      addEvent(window, 'resize', resizer);
      addEvent(window, 'orientationchange', resizer);
      // Add fullscreen change event
      addEvent(document, 'fullscreenchange', resizer);
      addEvent(document, 'webkitfullscreenchange', resizer);
      addEvent(document, 'mozfullscreenchange', resizer);
      addEvent(document, 'MSFullscreenChange', resizer);
    };

    if (el.length)
      for(var i=0; i<el.length; i++)
        fit(el[i]);
    else
      fit(el);

    // return set of elements
    return el;
  };
})();

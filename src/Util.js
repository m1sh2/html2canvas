/*
  html2canvas @VERSION@ <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/


html2canvas = function( elements, opts ) {
    
    var queue,
    canvas,
    options = {
        // general
        logging: false,
        
        // preload options
        proxy: "http://html2canvas.appspot.com/",
        timeout: 0,    // no timeout
        useCORS: false, // try to load images as CORS (where available), before falling back to proxy
        allowTaint: false, // whether to allow images to taint the canvas, won't need proxy if set to true
        
        // parse options
        iframeDefault: "default",
        ignoreElements: "IFRAME|OBJECT|PARAM",
        useOverflow: true,
        letterRendering: false,

        // render options

        width: null,
        height: null,
        renderer: "canvas",
        taintTest: true // do a taint test with all images before applying to canvas

    };
    
    options = _html2canvas.Util.Extend(opts, options);
    
    _html2canvas.logging = options.logging;
    options.complete = function( images ) {
        if (typeof options.onpreloaded === "function") {
            if ( options.onpreloaded( images ) === false ) {
                return;
            }
        }
        queue = _html2canvas.Parse( elements, images, options);
            
        if (typeof options.onparsed === "function") {
            if ( options.onparsed( queue ) === false ) {
                return;
            }
        }
            
        canvas = _html2canvas.Renderer(queue, options);
        
        if (typeof options.onrendered === "function") {
            options.onrendered( canvas );
        }
        
        
    };
    
    // for pages without images, we still want this to be async, i.e. return methods before executing
    window.setTimeout( function(){
        _html2canvas.Preload( elements, options );
    }, 0 );    
    
    return {
        render: function( queue, opts ) {
           return _html2canvas.Renderer( queue, _html2canvas.Util.Extend(opts, options) );
        },
        parse: function( elements, images, opts ) {
           return _html2canvas.Parse( elements, images, _html2canvas.Util.Extend(opts, options) );
        },
        preload: function( elements, opts ) {
           return _html2canvas.Preload( elements, _html2canvas.Util.Extend(opts, options) );
        },
        log: h2clog
    };
};

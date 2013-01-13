/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */
(function( window, undefined ) {
var
   // A central reference to the root jQuery(document)
   rootjQuery,

   // The deferred used on DOM ready
   readyList,

   // Use the correct document accordingly with window argument (sandbox)
   document = window.document,
   location = window.location,
   navigator = window.navigator,

   // Map over jQuery in case of overwrite
   _jQuery = window.jQuery,

   // Map over the $ in case of overwrite
   _$ = window.$,

   // Save a reference to some core methods
   core_push = Array.prototype.push,
   core_slice = Array.prototype.slice,
   core_indexOf = Array.prototype.indexOf,
   core_toString = Object.prototype.toString,
   core_hasOwn = Object.prototype.hasOwnProperty,
   core_trim = String.prototype.trim,

   // Define a local copy of jQuery
   jQuery = function( selector, context ) {
      // The jQuery object is actually just the init constructor 'enhanced'
      return new jQuery.fn.init( selector, context, rootjQuery );
   },

   // Used for matching numbers
   core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

   // Used for detecting and trimming whitespace
   core_rnotwhite = /\S/,
   core_rspace = /\s+/,

   // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
   rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

   // A simple way to check for HTML strings
   // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
   rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

   // Match a standalone tag
   rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

   // JSON RegExp
   rvalidchars = /^[\],:{}\s]*$/,
   rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
   rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
   rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

   // Matches dashed string for camelizing
   rmsPrefix = /^-ms-/,
   rdashAlpha = /-([\da-z])/gi,

   // Used by jQuery.camelCase as callback to replace()
   fcamelCase = function( all, letter ) {
      return ( letter + "" ).toUpperCase();
   },

   // The ready event handler and self cleanup method
   DOMContentLoaded = function() {
      if ( document.addEventListener ) {
         document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
         jQuery.ready();
      } else if ( document.readyState === "complete" ) {
         // we're here because readyState === "complete" in oldIE
         // which is good enough for us to call the dom ready!
         document.detachEvent( "onreadystatechange", DOMContentLoaded );
         jQuery.ready();
      }
   },

   // [[Class]] -> type pairs
   class2type = {};

jQuery.fn = jQuery.prototype = {
   constructor: jQuery,
   init: function( selector, context, rootjQuery ) {
      var match, elem, ret, doc;

      // Handle $(""), $(null), $(undefined), $(false)
      if ( !selector ) {
         return this;
      }

      // Handle $(DOMElement)
      if ( selector.nodeType ) {
         this.context = this[0] = selector;
         this.length = 1;
         return this;
      }

      // Handle HTML strings
      if ( typeof selector === "string" ) {
         if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
            // Assume that strings that start and end with <> are HTML and skip the regex check
            match = [ null, selector, null ];

         } else {
            match = rquickExpr.exec( selector );
         }

         // Match html or make sure no context is specified for #id
         if ( match && (match[1] || !context) ) {

            // HANDLE: $(html) -> $(array)
            if ( match[1] ) {
               context = context instanceof jQuery ? context[0] : context;
               doc = ( context && context.nodeType ? context.ownerDocument || context : document );

               // scripts is true for back-compat
               selector = jQuery.parseHTML( match[1], doc, true );
               if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                  this.attr.call( selector, context, true );
               }

               return jQuery.merge( this, selector );

            // HANDLE: $(#id)
            } else {
               elem = document.getElementById( match[2] );

               // Check parentNode to catch when Blackberry 4.6 returns
               // nodes that are no longer in the document #6963
               if ( elem && elem.parentNode ) {
                  // Handle the case where IE and Opera return items
                  // by name instead of ID
                  if ( elem.id !== match[2] ) {
                     return rootjQuery.find( selector );
                  }

                  // Otherwise, we inject the element directly into the jQuery object
                  this.length = 1;
                  this[0] = elem;
               }

               this.context = document;
               this.selector = selector;
               return this;
            }

         // HANDLE: $(expr, $(...))
         } else if ( !context || context.jquery ) {
            return ( context || rootjQuery ).find( selector );

         // HANDLE: $(expr, context)
         // (which is just equivalent to: $(context).find(expr)
         } else {
            return this.constructor( context ).find( selector );
         }

      // HANDLE: $(function)
      // Shortcut for document ready
      } else if ( jQuery.isFunction( selector ) ) {
         return rootjQuery.ready( selector );
      }

      if ( selector.selector !== undefined ) {
         this.selector = selector.selector;
         this.context = selector.context;
      }

      return jQuery.makeArray( selector, this );
   },

   // Start with an empty selector
   selector: "",

   // The current version of jQuery being used
   jquery: "1.8.2",

   // The default length of a jQuery object is 0
   length: 0,

   // The number of elements contained in the matched element set
   size: function() {
      return this.length;
   },

   toArray: function() {
      return core_slice.call( this );
   },

   // Get the Nth element in the matched element set OR
   // Get the whole matched element set as a clean array
   get: function( num ) {
      return num == null ?

         // Return a 'clean' array
         this.toArray() :

         // Return just the object
         ( num < 0 ? this[ this.length + num ] : this[ num ] );
   },

   // Take an array of elements and push it onto the stack
   // (returning the new matched element set)
   pushStack: function( elems, name, selector ) {

      // Build a new jQuery matched element set
      var ret = jQuery.merge( this.constructor(), elems );

      // Add the old object onto the stack (as a reference)
      ret.prevObject = this;

      ret.context = this.context;

      if ( name === "find" ) {
         ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
      } else if ( name ) {
         ret.selector = this.selector + "." + name + "(" + selector + ")";
      }

      // Return the newly-formed element set
      return ret;
   },

   // Execute a callback for every element in the matched set.
   // (You can seed the arguments with an array of args, but this is
   // only used internally.)
   each: function( callback, args ) {
      return jQuery.each( this, callback, args );
   },

   ready: function( fn ) {
      // Add the callback
      jQuery.ready.promise().done( fn );

      return this;
   },

   eq: function( i ) {
      i = +i;
      return i === -1 ?
         this.slice( i ) :
         this.slice( i, i + 1 );
   },

   first: function() {
      return this.eq( 0 );
   },

   last: function() {
      return this.eq( -1 );
   },

   slice: function() {
      return this.pushStack( core_slice.apply( this, arguments ),
         "slice", core_slice.call(arguments).join(",") );
   },

   map: function( callback ) {
      return this.pushStack( jQuery.map(this, function( elem, i ) {
         return callback.call( elem, i, elem );
      }));
   },

   end: function() {
      return this.prevObject || this.constructor(null);
   },

   // For internal use only.
   // Behaves like an Array's method, not like a jQuery method.
   push: core_push,
   sort: [].sort,
   splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
   var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

   // Handle a deep copy situation
   if ( typeof target === "boolean" ) {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
   }

   // Handle case when target is a string or something (possible in deep copy)
   if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
      target = {};
   }

   // extend jQuery itself if only one argument is passed
   if ( length === i ) {
      target = this;
      --i;
   }

   for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
         // Extend the base object
         for ( name in options ) {
            src = target[ name ];
            copy = options[ name ];

            // Prevent never-ending loop
            if ( target === copy ) {
               continue;
            }

            // Recurse if we're merging plain objects or arrays
            if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
               if ( copyIsArray ) {
                  copyIsArray = false;
                  clone = src && jQuery.isArray(src) ? src : [];

               } else {
                  clone = src && jQuery.isPlainObject(src) ? src : {};
               }

               // Never move original objects, clone them
               target[ name ] = jQuery.extend( deep, clone, copy );

            // Don't bring in undefined values
            } else if ( copy !== undefined ) {
               target[ name ] = copy;
            }
         }
      }
   }

   // Return the modified object
   return target;
};

jQuery.extend({
   noConflict: function( deep ) {
      if ( window.$ === jQuery ) {
         window.$ = _$;
      }

      if ( deep && window.jQuery === jQuery ) {
         window.jQuery = _jQuery;
      }

      return jQuery;
   },

   // Is the DOM ready to be used? Set to true once it occurs.
   isReady: false,

   // A counter to track how many items to wait for before
   // the ready event fires. See #6781
   readyWait: 1,

   // Hold (or release) the ready event
   holdReady: function( hold ) {
      if ( hold ) {
         jQuery.readyWait++;
      } else {
         jQuery.ready( true );
      }
   },

   // Handle when the DOM is ready
   ready: function( wait ) {

      // Abort if there are pending holds or we're already ready
      if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
         return;
      }

      // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
      if ( !document.body ) {
         return setTimeout( jQuery.ready, 1 );
      }

      // Remember that the DOM is ready
      jQuery.isReady = true;

      // If a normal DOM Ready event fired, decrement, and wait if need be
      if ( wait !== true && --jQuery.readyWait > 0 ) {
         return;
      }

      // If there are functions bound, to execute
      readyList.resolveWith( document, [ jQuery ] );

      // Trigger any bound ready events
      if ( jQuery.fn.trigger ) {
         jQuery( document ).trigger("ready").off("ready");
      }
   },

   // See test/unit/core.js for details concerning isFunction.
   // Since version 1.3, DOM methods and functions like alert
   // aren't supported. They return false on IE (#2968).
   isFunction: function( obj ) {
      return jQuery.type(obj) === "function";
   },

   isArray: Array.isArray || function( obj ) {
      return jQuery.type(obj) === "array";
   },

   isWindow: function( obj ) {
      return obj != null && obj == obj.window;
   },

   isNumeric: function( obj ) {
      return !isNaN( parseFloat(obj) ) && isFinite( obj );
   },

   type: function( obj ) {
      return obj == null ?
         String( obj ) :
         class2type[ core_toString.call(obj) ] || "object";
   },

   isPlainObject: function( obj ) {
      // Must be an Object.
      // Because of IE, we also have to check the presence of the constructor property.
      // Make sure that DOM nodes and window objects don't pass through, as well
      if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
         return false;
      }

      try {
         // Not own constructor property must be Object
         if ( obj.constructor &&
            !core_hasOwn.call(obj, "constructor") &&
            !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
            return false;
         }
      } catch ( e ) {
         // IE8,9 Will throw exceptions on certain host objects #9897
         return false;
      }

      // Own properties are enumerated firstly, so to speed up,
      // if last one is own, then all properties are own.

      var key;
      for ( key in obj ) {}

      return key === undefined || core_hasOwn.call( obj, key );
   },

   isEmptyObject: function( obj ) {
      var name;
      for ( name in obj ) {
         return false;
      }
      return true;
   },

   error: function( msg ) {
      throw new Error( msg );
   },

   // data: string of html
   // context (optional): If specified, the fragment will be created in this context, defaults to document
   // scripts (optional): If true, will include scripts passed in the html string
   parseHTML: function( data, context, scripts ) {
      var parsed;
      if ( !data || typeof data !== "string" ) {
         return null;
      }
      if ( typeof context === "boolean" ) {
         scripts = context;
         context = 0;
      }
      context = context || document;

      // Single tag
      if ( (parsed = rsingleTag.exec( data )) ) {
         return [ context.createElement( parsed[1] ) ];
      }

      parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
      return jQuery.merge( [],
         (parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
   },

   parseJSON: function( data ) {
      if ( !data || typeof data !== "string") {
         return null;
      }

      // Make sure leading/trailing whitespace is removed (IE can't handle it)
      data = jQuery.trim( data );

      // Attempt to parse using the native JSON parser first
      if ( window.JSON && window.JSON.parse ) {
         return window.JSON.parse( data );
      }

      // Make sure the incoming data is actual JSON
      // Logic borrowed from http://json.org/json2.js
      if ( rvalidchars.test( data.replace( rvalidescape, "@" )
         .replace( rvalidtokens, "]" )
         .replace( rvalidbraces, "")) ) {

         return ( new Function( "return " + data ) )();

      }
      jQuery.error( "Invalid JSON: " + data );
   },

   // Cross-browser xml parsing
   parseXML: function( data ) {
      var xml, tmp;
      if ( !data || typeof data !== "string" ) {
         return null;
      }
      try {
         if ( window.DOMParser ) { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString( data , "text/xml" );
         } else { // IE
            xml = new ActiveXObject( "Microsoft.XMLDOM" );
            xml.async = "false";
            xml.loadXML( data );
         }
      } catch( e ) {
         xml = undefined;
      }
      if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
         jQuery.error( "Invalid XML: " + data );
      }
      return xml;
   },

   noop: function() {},

   // Evaluates a script in a global context
   // Workarounds based on findings by Jim Driscoll
   // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
   globalEval: function( data ) {
      if ( data && core_rnotwhite.test( data ) ) {
         // We use execScript on Internet Explorer
         // We use an anonymous function so that context is window
         // rather than jQuery in Firefox
         ( window.execScript || function( data ) {
            window[ "eval" ].call( window, data );
         } )( data );
      }
   },

   // Convert dashed to camelCase; used by the css and data modules
   // Microsoft forgot to hump their vendor prefix (#9572)
   camelCase: function( string ) {
      return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
   },

   nodeName: function( elem, name ) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
   },

   // args is for internal usage only
   each: function( obj, callback, args ) {
      var name,
         i = 0,
         length = obj.length,
         isObj = length === undefined || jQuery.isFunction( obj );

      if ( args ) {
         if ( isObj ) {
            for ( name in obj ) {
               if ( callback.apply( obj[ name ], args ) === false ) {
                  break;
               }
            }
         } else {
            for ( ; i < length; ) {
               if ( callback.apply( obj[ i++ ], args ) === false ) {
                  break;
               }
            }
         }

      // A special, fast, case for the most common use of each
      } else {
         if ( isObj ) {
            for ( name in obj ) {
               if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                  break;
               }
            }
         } else {
            for ( ; i < length; ) {
               if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                  break;
               }
            }
         }
      }

      return obj;
   },

   // Use native String.trim function wherever possible
   trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
      function( text ) {
         return text == null ?
            "" :
            core_trim.call( text );
      } :

      // Otherwise use our own trimming functionality
      function( text ) {
         return text == null ?
            "" :
            ( text + "" ).replace( rtrim, "" );
      },

   // results is for internal usage only
   makeArray: function( arr, results ) {
      var type,
         ret = results || [];

      if ( arr != null ) {
         // The window, strings (and functions) also have 'length'
         // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
         type = jQuery.type( arr );

         if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
            core_push.call( ret, arr );
         } else {
            jQuery.merge( ret, arr );
         }
      }

      return ret;
   },

   inArray: function( elem, arr, i ) {
      var len;

      if ( arr ) {
         if ( core_indexOf ) {
            return core_indexOf.call( arr, elem, i );
         }

         len = arr.length;
         i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

         for ( ; i < len; i++ ) {
            // Skip accessing in sparse arrays
            if ( i in arr && arr[ i ] === elem ) {
               return i;
            }
         }
      }

      return -1;
   },

   merge: function( first, second ) {
      var l = second.length,
         i = first.length,
         j = 0;

      if ( typeof l === "number" ) {
         for ( ; j < l; j++ ) {
            first[ i++ ] = second[ j ];
         }

      } else {
         while ( second[j] !== undefined ) {
            first[ i++ ] = second[ j++ ];
         }
      }

      first.length = i;

      return first;
   },

   grep: function( elems, callback, inv ) {
      var retVal,
         ret = [],
         i = 0,
         length = elems.length;
      inv = !!inv;

      // Go through the array, only saving the items
      // that pass the validator function
      for ( ; i < length; i++ ) {
         retVal = !!callback( elems[ i ], i );
         if ( inv !== retVal ) {
            ret.push( elems[ i ] );
         }
      }

      return ret;
   },

   // arg is for internal usage only
   map: function( elems, callback, arg ) {
      var value, key,
         ret = [],
         i = 0,
         length = elems.length,
         // jquery objects are treated as arrays
         isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

      // Go through the array, translating each of the items to their
      if ( isArray ) {
         for ( ; i < length; i++ ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
               ret[ ret.length ] = value;
            }
         }

      // Go through every key on the object,
      } else {
         for ( key in elems ) {
            value = callback( elems[ key ], key, arg );

            if ( value != null ) {
               ret[ ret.length ] = value;
            }
         }
      }

      // Flatten any nested arrays
      return ret.concat.apply( [], ret );
   },

   // A global GUID counter for objects
   guid: 1,

   // Bind a function to a context, optionally partially applying any
   // arguments.
   proxy: function( fn, context ) {
      var tmp, args, proxy;

      if ( typeof context === "string" ) {
         tmp = fn[ context ];
         context = fn;
         fn = tmp;
      }

      // Quick check to determine if target is callable, in the spec
      // this throws a TypeError, but we will just return undefined.
      if ( !jQuery.isFunction( fn ) ) {
         return undefined;
      }

      // Simulated bind
      args = core_slice.call( arguments, 2 );
      proxy = function() {
         return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
      };

      // Set the guid of unique handler to the same of original handler, so it can be removed
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;

      return proxy;
   },

   // Multifunctional method to get and set values of a collection
   // The value/s can optionally be executed if it's a function
   access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
      var exec,
         bulk = key == null,
         i = 0,
         length = elems.length;

      // Sets many values
      if ( key && typeof key === "object" ) {
         for ( i in key ) {
            jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
         }
         chainable = 1;

      // Sets one value
      } else if ( value !== undefined ) {
         // Optionally, function values get executed if exec is true
         exec = pass === undefined && jQuery.isFunction( value );

         if ( bulk ) {
            // Bulk operations only iterate when executing function values
            if ( exec ) {
               exec = fn;
               fn = function( elem, key, value ) {
                  return exec.call( jQuery( elem ), value );
               };

            // Otherwise they run against the entire set
            } else {
               fn.call( elems, value );
               fn = null;
            }
         }

         if ( fn ) {
            for (; i < length; i++ ) {
               fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
            }
         }

         chainable = 1;
      }

      return chainable ?
         elems :

         // Gets
         bulk ?
            fn.call( elems ) :
            length ? fn( elems[0], key ) : emptyGet;
   },

   now: function() {
      return ( new Date() ).getTime();
   }
});

jQuery.ready.promise = function( obj ) {
   if ( !readyList ) {

      readyList = jQuery.Deferred();

      // Catch cases where $(document).ready() is called after the browser event has already occurred.
      // we once tried to use readyState "interactive" here, but it caused issues like the one
      // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
      if ( document.readyState === "complete" ) {
         // Handle it asynchronously to allow scripts the opportunity to delay ready
         setTimeout( jQuery.ready, 1 );

      // Standards-based browsers support DOMContentLoaded
      } else if ( document.addEventListener ) {
         // Use the handy event callback
         document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

         // A fallback to window.onload, that will always work
         window.addEventListener( "load", jQuery.ready, false );

      // If IE event model is used
      } else {
         // Ensure firing before onload, maybe late but safe also for iframes
         document.attachEvent( "onreadystatechange", DOMContentLoaded );

         // A fallback to window.onload, that will always work
         window.attachEvent( "onload", jQuery.ready );

         // If IE and not a frame
         // continually check to see if the document is ready
         var top = false;

         try {
            top = window.frameElement == null && document.documentElement;
         } catch(e) {}

         if ( top && top.doScroll ) {
            (function doScrollCheck() {
               if ( !jQuery.isReady ) {

                  try {
                     // Use the trick by Diego Perini
                     // http://javascript.nwbox.com/IEContentLoaded/
                     top.doScroll("left");
                  } catch(e) {
                     return setTimeout( doScrollCheck, 50 );
                  }

                  // and execute any waiting functions
                  jQuery.ready();
               }
            })();
         }
      }
   }
   return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
   class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
   var object = optionsCache[ options ] = {};
   jQuery.each( options.split( core_rspace ), function( _, flag ) {
      object[ flag ] = true;
   });
   return object;
}

/*
 * Create a callback list using the following parameters:
 *
 * options: an optional list of space-separated options that will change how
 *       the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 * once:       will ensure the callback list can only be fired once (like a Deferred)
 *
 * memory:        will keep track of previous values and will call any callback added
 *             after the list has been fired right away with the latest "memorized"
 *             values (like a Deferred)
 *
 * unique:        will ensure a callback can only be added once (no duplicate in the list)
 *
 * stopOnFalse:   interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

   // Convert options from String-formatted to Object-formatted if needed
   // (we check in cache first)
   options = typeof options === "string" ?
      ( optionsCache[ options ] || createOptions( options ) ) :
      jQuery.extend( {}, options );

   var // Last fire value (for non-forgettable lists)
      memory,
      // Flag to know if list was already fired
      fired,
      // Flag to know if list is currently firing
      firing,
      // First callback to fire (used internally by add and fireWith)
      firingStart,
      // End of the loop when firing
      firingLength,
      // Index of currently firing callback (modified by remove if needed)
      firingIndex,
      // Actual callback list
      list = [],
      // Stack of fire calls for repeatable lists
      stack = !options.once && [],
      // Fire callbacks
      fire = function( data ) {
         memory = options.memory && data;
         fired = true;
         firingIndex = firingStart || 0;
         firingStart = 0;
         firingLength = list.length;
         firing = true;
         for ( ; list && firingIndex < firingLength; firingIndex++ ) {
            if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
               memory = false; // To prevent further calls using add
               break;
            }
         }
         firing = false;
         if ( list ) {
            if ( stack ) {
               if ( stack.length ) {
                  fire( stack.shift() );
               }
            } else if ( memory ) {
               list = [];
            } else {
               self.disable();
            }
         }
      },
      // Actual Callbacks object
      self = {
         // Add a callback or a collection of callbacks to the list
         add: function() {
            if ( list ) {
               // First, we save the current length
               var start = list.length;
               (function add( args ) {
                  jQuery.each( args, function( _, arg ) {
                     var type = jQuery.type( arg );
                     if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
                        list.push( arg );
                     } else if ( arg && arg.length && type !== "string" ) {
                        // Inspect recursively
                        add( arg );
                     }
                  });
               })( arguments );
               // Do we need to add the callbacks to the
               // current firing batch?
               if ( firing ) {
                  firingLength = list.length;
               // With memory, if we're not firing then
               // we should call right away
               } else if ( memory ) {
                  firingStart = start;
                  fire( memory );
               }
            }
            return this;
         },
         // Remove a callback from the list
         remove: function() {
            if ( list ) {
               jQuery.each( arguments, function( _, arg ) {
                  var index;
                  while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                     list.splice( index, 1 );
                     // Handle firing indexes
                     if ( firing ) {
                        if ( index <= firingLength ) {
                           firingLength--;
                        }
                        if ( index <= firingIndex ) {
                           firingIndex--;
                        }
                     }
                  }
               });
            }
            return this;
         },
         // Control if a given callback is in the list
         has: function( fn ) {
            return jQuery.inArray( fn, list ) > -1;
         },
         // Remove all callbacks from the list
         empty: function() {
            list = [];
            return this;
         },
         // Have the list do nothing anymore
         disable: function() {
            list = stack = memory = undefined;
            return this;
         },
         // Is it disabled?
         disabled: function() {
            return !list;
         },
         // Lock the list in its current state
         lock: function() {
            stack = undefined;
            if ( !memory ) {
               self.disable();
            }
            return this;
         },
         // Is it locked?
         locked: function() {
            return !stack;
         },
         // Call all callbacks with the given context and arguments
         fireWith: function( context, args ) {
            args = args || [];
            args = [ context, args.slice ? args.slice() : args ];
            if ( list && ( !fired || stack ) ) {
               if ( firing ) {
                  stack.push( args );
               } else {
                  fire( args );
               }
            }
            return this;
         },
         // Call all the callbacks with the given arguments
         fire: function() {
            self.fireWith( this, arguments );
            return this;
         },
         // To know if the callbacks have already been called at least once
         fired: function() {
            return !!fired;
         }
      };

   return self;
};
jQuery.extend({

   Deferred: function( func ) {
      var tuples = [
            // action, add listener, listener list, final state
            [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
            [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
            [ "notify", "progress", jQuery.Callbacks("memory") ]
         ],
         state = "pending",
         promise = {
            state: function() {
               return state;
            },
            always: function() {
               deferred.done( arguments ).fail( arguments );
               return this;
            },
            then: function( /* fnDone, fnFail, fnProgress */ ) {
               var fns = arguments;
               return jQuery.Deferred(function( newDefer ) {
                  jQuery.each( tuples, function( i, tuple ) {
                     var action = tuple[ 0 ],
                        fn = fns[ i ];
                     // deferred[ done | fail | progress ] for forwarding actions to newDefer
                     deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
                        function() {
                           var returned = fn.apply( this, arguments );
                           if ( returned && jQuery.isFunction( returned.promise ) ) {
                              returned.promise()
                                 .done( newDefer.resolve )
                                 .fail( newDefer.reject )
                                 .progress( newDefer.notify );
                           } else {
                              newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                           }
                        } :
                        newDefer[ action ]
                     );
                  });
                  fns = null;
               }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function( obj ) {
               return obj != null ? jQuery.extend( obj, promise ) : promise;
            }
         },
         deferred = {};

      // Keep pipe for back-compat
      promise.pipe = promise.then;

      // Add list-specific methods
      jQuery.each( tuples, function( i, tuple ) {
         var list = tuple[ 2 ],
            stateString = tuple[ 3 ];

         // promise[ done | fail | progress ] = list.add
         promise[ tuple[1] ] = list.add;

         // Handle state
         if ( stateString ) {
            list.add(function() {
               // state = [ resolved | rejected ]
               state = stateString;

            // [ reject_list | resolve_list ].disable; progress_list.lock
            }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
         }

         // deferred[ resolve | reject | notify ] = list.fire
         deferred[ tuple[0] ] = list.fire;
         deferred[ tuple[0] + "With" ] = list.fireWith;
      });

      // Make the deferred a promise
      promise.promise( deferred );

      // Call given func if any
      if ( func ) {
         func.call( deferred, deferred );
      }

      // All done!
      return deferred;
   },

   // Deferred helper
   when: function( subordinate /* , ..., subordinateN */ ) {
      var i = 0,
         resolveValues = core_slice.call( arguments ),
         length = resolveValues.length,

         // the count of uncompleted subordinates
         remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

         // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
         deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

         // Update function for both resolve and progress values
         updateFunc = function( i, contexts, values ) {
            return function( value ) {
               contexts[ i ] = this;
               values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
               if( values === progressValues ) {
                  deferred.notifyWith( contexts, values );
               } else if ( !( --remaining ) ) {
                  deferred.resolveWith( contexts, values );
               }
            };
         },

         progressValues, progressContexts, resolveContexts;

      // add listeners to Deferred subordinates; treat others as resolved
      if ( length > 1 ) {
         progressValues = new Array( length );
         progressContexts = new Array( length );
         resolveContexts = new Array( length );
         for ( ; i < length; i++ ) {
            if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
               resolveValues[ i ].promise()
                  .done( updateFunc( i, resolveContexts, resolveValues ) )
                  .fail( deferred.reject )
                  .progress( updateFunc( i, progressContexts, progressValues ) );
            } else {
               --remaining;
            }
         }
      }

      // if we're not waiting on anything, resolve the master
      if ( !remaining ) {
         deferred.resolveWith( resolveContexts, resolveValues );
      }

      return deferred.promise();
   }
});
jQuery.support = (function() {

   var support,
      all,
      a,
      select,
      opt,
      input,
      fragment,
      eventName,
      i,
      isSupported,
      clickFn,
      div = document.createElement("div");

   // Preliminary tests
   div.setAttribute( "className", "t" );
   div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

   all = div.getElementsByTagName("*");
   a = div.getElementsByTagName("a")[ 0 ];
   a.style.cssText = "top:1px;float:left;opacity:.5";

   // Can't get basic test support
   if ( !all || !all.length ) {
      return {};
   }

   // First batch of supports tests
   select = document.createElement("select");
   opt = select.appendChild( document.createElement("option") );
   input = div.getElementsByTagName("input")[ 0 ];

   support = {
      // IE strips leading whitespace when .innerHTML is used
      leadingWhitespace: ( div.firstChild.nodeType === 3 ),

      // Make sure that tbody elements aren't automatically inserted
      // IE will insert them into empty tables
      tbody: !div.getElementsByTagName("tbody").length,

      // Make sure that link elements get serialized correctly by innerHTML
      // This requires a wrapper element in IE
      htmlSerialize: !!div.getElementsByTagName("link").length,

      // Get the style information from getAttribute
      // (IE uses .cssText instead)
      style: /top/.test( a.getAttribute("style") ),

      // Make sure that URLs aren't manipulated
      // (IE normalizes it by default)
      hrefNormalized: ( a.getAttribute("href") === "/a" ),

      // Make sure that element opacity exists
      // (IE uses filter instead)
      // Use a regex to work around a WebKit issue. See #5145
      opacity: /^0.5/.test( a.style.opacity ),

      // Verify style float existence
      // (IE uses styleFloat instead of cssFloat)
      cssFloat: !!a.style.cssFloat,

      // Make sure that if no value is specified for a checkbox
      // that it defaults to "on".
      // (WebKit defaults to "" instead)
      checkOn: ( input.value === "on" ),

      // Make sure that a selected-by-default option has a working selected property.
      // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
      optSelected: opt.selected,

      // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
      getSetAttribute: div.className !== "t",

      // Tests for enctype support on a form(#6743)
      enctype: !!document.createElement("form").enctype,

      // Makes sure cloning an html5 element does not cause problems
      // Where outerHTML is undefined, this still works
      html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

      // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
      boxModel: ( document.compatMode === "CSS1Compat" ),

      // Will be defined later
      submitBubbles: true,
      changeBubbles: true,
      focusinBubbles: false,
      deleteExpando: true,
      noCloneEvent: true,
      inlineBlockNeedsLayout: false,
      shrinkWrapBlocks: false,
      reliableMarginRight: true,
      boxSizingReliable: true,
      pixelPosition: false
   };

   // Make sure checked status is properly cloned
   input.checked = true;
   support.noCloneChecked = input.cloneNode( true ).checked;

   // Make sure that the options inside disabled selects aren't marked as disabled
   // (WebKit marks them as disabled)
   select.disabled = true;
   support.optDisabled = !opt.disabled;

   // Test to see if it's possible to delete an expando from an element
   // Fails in Internet Explorer
   try {
      delete div.test;
   } catch( e ) {
      support.deleteExpando = false;
   }

   if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
      div.attachEvent( "onclick", clickFn = function() {
         // Cloning a node shouldn't copy over any
         // bound event handlers (IE does this)
         support.noCloneEvent = false;
      });
      div.cloneNode( true ).fireEvent("onclick");
      div.detachEvent( "onclick", clickFn );
   }

   // Check if a radio maintains its value
   // after being appended to the DOM
   input = document.createElement("input");
   input.value = "t";
   input.setAttribute( "type", "radio" );
   support.radioValue = input.value === "t";

   input.setAttribute( "checked", "checked" );

   // #11217 - WebKit loses check when the name is after the checked attribute
   input.setAttribute( "name", "t" );

   div.appendChild( input );
   fragment = document.createDocumentFragment();
   fragment.appendChild( div.lastChild );

   // WebKit doesn't clone checked state correctly in fragments
   support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

   // Check if a disconnected checkbox will retain its checked
   // value of true after appended to the DOM (IE6/7)
   support.appendChecked = input.checked;

   fragment.removeChild( input );
   fragment.appendChild( div );

   // Technique from Juriy Zaytsev
   // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
   // We only care about the case where non-standard event systems
   // are used, namely in IE. Short-circuiting here helps us to
   // avoid an eval call (in setAttribute) which can cause CSP
   // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
   if ( div.attachEvent ) {
      for ( i in {
         submit: true,
         change: true,
         focusin: true
      }) {
         eventName = "on" + i;
         isSupported = ( eventName in div );
         if ( !isSupported ) {
            div.setAttribute( eventName, "return;" );
            isSupported = ( typeof div[ eventName ] === "function" );
         }
         support[ i + "Bubbles" ] = isSupported;
      }
   }

   // Run tests that need a body at doc ready
   jQuery(function() {
      var container, div, tds, marginDiv,
         divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
         body = document.getElementsByTagName("body")[0];

      if ( !body ) {
         // Return for frameset docs that don't have a body
         return;
      }

      container = document.createElement("div");
      container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
      body.insertBefore( container, body.firstChild );

      // Construct the test element
      div = document.createElement("div");
      container.appendChild( div );

      // Check if table cells still have offsetWidth/Height when they are set
      // to display:none and there are still other visible table cells in a
      // table row; if so, offsetWidth/Height are not reliable for use when
      // determining if an element has been hidden directly using
      // display:none (it is still safe to use offsets if a parent element is
      // hidden; don safety goggles and see bug #4512 for more information).
      // (only IE 8 fails this test)
      div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
      tds = div.getElementsByTagName("td");
      tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
      isSupported = ( tds[ 0 ].offsetHeight === 0 );

      tds[ 0 ].style.display = "";
      tds[ 1 ].style.display = "none";

      // Check if empty table cells still have offsetWidth/Height
      // (IE <= 8 fail this test)
      support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

      // Check box-sizing and margin behavior
      div.innerHTML = "";
      div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
      support.boxSizing = ( div.offsetWidth === 4 );
      support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

      // NOTE: To any future maintainer, we've window.getComputedStyle
      // because jsdom on node.js will break without it.
      if ( window.getComputedStyle ) {
         support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
         support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

         // Check if div with explicit width and no margin-right incorrectly
         // gets computed margin-right based on width of container. For more
         // info see bug #3333
         // Fails in WebKit before Feb 2011 nightlies
         // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
         marginDiv = document.createElement("div");
         marginDiv.style.cssText = div.style.cssText = divReset;
         marginDiv.style.marginRight = marginDiv.style.width = "0";
         div.style.width = "1px";
         div.appendChild( marginDiv );
         support.reliableMarginRight =
            !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
      }

      if ( typeof div.style.zoom !== "undefined" ) {
         // Check if natively block-level elements act like inline-block
         // elements when setting their display to 'inline' and giving
         // them layout
         // (IE < 8 does this)
         div.innerHTML = "";
         div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
         support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

         // Check if elements with layout shrink-wrap their children
         // (IE 6 does this)
         div.style.display = "block";
         div.style.overflow = "visible";
         div.innerHTML = "<div></div>";
         div.firstChild.style.width = "5px";
         support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

         container.style.zoom = 1;
      }

      // Null elements to avoid leaks in IE
      body.removeChild( container );
      container = div = tds = marginDiv = null;
   });

   // Null elements to avoid leaks in IE
   fragment.removeChild( div );
   all = a = select = opt = input = fragment = div = null;

   return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
   rmultiDash = /([A-Z])/g;

jQuery.extend({
   cache: {},

   deletedIds: [],

   // Remove at next major release (1.9/2.0)
   uuid: 0,

   // Unique for each copy of jQuery on the page
   // Non-digits removed to match rinlinejQuery
   expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

   // The following elements throw uncatchable exceptions if you
   // attempt to add expando properties to them.
   noData: {
      "embed": true,
      // Ban all objects except for Flash (which handle expandos)
      "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      "applet": true
   },

   hasData: function( elem ) {
      elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
      return !!elem && !isEmptyDataObject( elem );
   },

   data: function( elem, name, data, pvt /* Internal Use Only */ ) {
      if ( !jQuery.acceptData( elem ) ) {
         return;
      }

      var thisCache, ret,
         internalKey = jQuery.expando,
         getByName = typeof name === "string",

         // We have to handle DOM nodes and JS objects differently because IE6-7
         // can't GC object references properly across the DOM-JS boundary
         isNode = elem.nodeType,

         // Only DOM nodes need the global jQuery cache; JS object data is
         // attached directly to the object so GC can occur automatically
         cache = isNode ? jQuery.cache : elem,

         // Only defining an ID for JS objects if its cache already exists allows
         // the code to shortcut on the same path as a DOM node with no cache
         id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

      // Avoid doing any more work than we need to when trying to get data on an
      // object that has no data at all
      if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
         return;
      }

      if ( !id ) {
         // Only DOM nodes need a new unique ID for each element since their data
         // ends up in the global cache
         if ( isNode ) {
            elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
         } else {
            id = internalKey;
         }
      }

      if ( !cache[ id ] ) {
         cache[ id ] = {};

         // Avoids exposing jQuery metadata on plain JS objects when the object
         // is serialized using JSON.stringify
         if ( !isNode ) {
            cache[ id ].toJSON = jQuery.noop;
         }
      }

      // An object can be passed to jQuery.data instead of a key/value pair; this gets
      // shallow copied over onto the existing cache
      if ( typeof name === "object" || typeof name === "function" ) {
         if ( pvt ) {
            cache[ id ] = jQuery.extend( cache[ id ], name );
         } else {
            cache[ id ].data = jQuery.extend( cache[ id ].data, name );
         }
      }

      thisCache = cache[ id ];

      // jQuery data() is stored in a separate object inside the object's internal data
      // cache in order to avoid key collisions between internal data and user-defined
      // data.
      if ( !pvt ) {
         if ( !thisCache.data ) {
            thisCache.data = {};
         }

         thisCache = thisCache.data;
      }

      if ( data !== undefined ) {
         thisCache[ jQuery.camelCase( name ) ] = data;
      }

      // Check for both converted-to-camel and non-converted data property names
      // If a data property was specified
      if ( getByName ) {

         // First Try to find as-is property data
         ret = thisCache[ name ];

         // Test for null|undefined property data
         if ( ret == null ) {

            // Try to find the camelCased property
            ret = thisCache[ jQuery.camelCase( name ) ];
         }
      } else {
         ret = thisCache;
      }

      return ret;
   },

   removeData: function( elem, name, pvt /* Internal Use Only */ ) {
      if ( !jQuery.acceptData( elem ) ) {
         return;
      }

      var thisCache, i, l,

         isNode = elem.nodeType,

         // See jQuery.data for more information
         cache = isNode ? jQuery.cache : elem,
         id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

      // If there is already no cache entry for this object, there is no
      // purpose in continuing
      if ( !cache[ id ] ) {
         return;
      }

      if ( name ) {

         thisCache = pvt ? cache[ id ] : cache[ id ].data;

         if ( thisCache ) {

            // Support array or space separated string names for data keys
            if ( !jQuery.isArray( name ) ) {

               // try the string as a key before any manipulation
               if ( name in thisCache ) {
                  name = [ name ];
               } else {

                  // split the camel cased version by spaces unless a key with the spaces exists
                  name = jQuery.camelCase( name );
                  if ( name in thisCache ) {
                     name = [ name ];
                  } else {
                     name = name.split(" ");
                  }
               }
            }

            for ( i = 0, l = name.length; i < l; i++ ) {
               delete thisCache[ name[i] ];
            }

            // If there is no data left in the cache, we want to continue
            // and let the cache object itself get destroyed
            if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
               return;
            }
         }
      }

      // See jQuery.data for more information
      if ( !pvt ) {
         delete cache[ id ].data;

         // Don't destroy the parent cache unless the internal data object
         // had been the only thing left in it
         if ( !isEmptyDataObject( cache[ id ] ) ) {
            return;
         }
      }

      // Destroy the cache
      if ( isNode ) {
         jQuery.cleanData( [ elem ], true );

      // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
      } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
         delete cache[ id ];

      // When all else fails, null
      } else {
         cache[ id ] = null;
      }
   },

   // For internal use only.
   _data: function( elem, name, data ) {
      return jQuery.data( elem, name, data, true );
   },

   // A method for determining if a DOM node can handle the data expando
   acceptData: function( elem ) {
      var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

      // nodes accept data unless otherwise specified; rejection can be conditional
      return !noData || noData !== true && elem.getAttribute("classid") === noData;
   }
});

jQuery.fn.extend({
   data: function( key, value ) {
      var parts, part, attr, name, l,
         elem = this[0],
         i = 0,
         data = null;

      // Gets all values
      if ( key === undefined ) {
         if ( this.length ) {
            data = jQuery.data( elem );

            if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
               attr = elem.attributes;
               for ( l = attr.length; i < l; i++ ) {
                  name = attr[i].name;

                  if ( !name.indexOf( "data-" ) ) {
                     name = jQuery.camelCase( name.substring(5) );

                     dataAttr( elem, name, data[ name ] );
                  }
               }
               jQuery._data( elem, "parsedAttrs", true );
            }
         }

         return data;
      }

      // Sets multiple values
      if ( typeof key === "object" ) {
         return this.each(function() {
            jQuery.data( this, key );
         });
      }

      parts = key.split( ".", 2 );
      parts[1] = parts[1] ? "." + parts[1] : "";
      part = parts[1] + "!";

      return jQuery.access( this, function( value ) {

         if ( value === undefined ) {
            data = this.triggerHandler( "getData" + part, [ parts[0] ] );

            // Try to fetch any internally stored data first
            if ( data === undefined && elem ) {
               data = jQuery.data( elem, key );
               data = dataAttr( elem, key, data );
            }

            return data === undefined && parts[1] ?
               this.data( parts[0] ) :
               data;
         }

         parts[1] = value;
         this.each(function() {
            var self = jQuery( this );

            self.triggerHandler( "setData" + part, parts );
            jQuery.data( this, key, value );
            self.triggerHandler( "changeData" + part, parts );
         });
      }, null, value, arguments.length > 1, null, false );
   },

   removeData: function( key ) {
      return this.each(function() {
         jQuery.removeData( this, key );
      });
   }
});

function dataAttr( elem, key, data ) {
   // If nothing was found internally, try to fetch any
   // data from the HTML5 data-* attribute
   if ( data === undefined && elem.nodeType === 1 ) {

      var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

      data = elem.getAttribute( name );

      if ( typeof data === "string" ) {
         try {
            data = data === "true" ? true :
            data === "false" ? false :
            data === "null" ? null :
            // Only convert to a number if it doesn't change the string
            +data + "" === data ? +data :
            rbrace.test( data ) ? jQuery.parseJSON( data ) :
               data;
         } catch( e ) {}

         // Make sure we set the data so it isn't changed later
         jQuery.data( elem, key, data );

      } else {
         data = undefined;
      }
   }

   return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
   var name;
   for ( name in obj ) {

      // if the public data object is empty, the private is still empty
      if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
         continue;
      }
      if ( name !== "toJSON" ) {
         return false;
      }
   }

   return true;
}
jQuery.extend({
   queue: function( elem, type, data ) {
      var queue;

      if ( elem ) {
         type = ( type || "fx" ) + "queue";
         queue = jQuery._data( elem, type );

         // Speed up dequeue by getting out quickly if this is just a lookup
         if ( data ) {
            if ( !queue || jQuery.isArray(data) ) {
               queue = jQuery._data( elem, type, jQuery.makeArray(data) );
            } else {
               queue.push( data );
            }
         }
         return queue || [];
      }
   },

   dequeue: function( elem, type ) {
      type = type || "fx";

      var queue = jQuery.queue( elem, type ),
         startLength = queue.length,
         fn = queue.shift(),
         hooks = jQuery._queueHooks( elem, type ),
         next = function() {
            jQuery.dequeue( elem, type );
         };

      // If the fx queue is dequeued, always remove the progress sentinel
      if ( fn === "inprogress" ) {
         fn = queue.shift();
         startLength--;
      }

      if ( fn ) {

         // Add a progress sentinel to prevent the fx queue from being
         // automatically dequeued
         if ( type === "fx" ) {
            queue.unshift( "inprogress" );
         }

         // clear up the last queue stop function
         delete hooks.stop;
         fn.call( elem, next, hooks );
      }

      if ( !startLength && hooks ) {
         hooks.empty.fire();
      }
   },

   // not intended for public consumption - generates a queueHooks object, or returns the current one
   _queueHooks: function( elem, type ) {
      var key = type + "queueHooks";
      return jQuery._data( elem, key ) || jQuery._data( elem, key, {
         empty: jQuery.Callbacks("once memory").add(function() {
            jQuery.removeData( elem, type + "queue", true );
            jQuery.removeData( elem, key, true );
         })
      });
   }
});

jQuery.fn.extend({
   queue: function( type, data ) {
      var setter = 2;

      if ( typeof type !== "string" ) {
         data = type;
         type = "fx";
         setter--;
      }

      if ( arguments.length < setter ) {
         return jQuery.queue( this[0], type );
      }

      return data === undefined ?
         this :
         this.each(function() {
            var queue = jQuery.queue( this, type, data );

            // ensure a hooks for this queue
            jQuery._queueHooks( this, type );

            if ( type === "fx" && queue[0] !== "inprogress" ) {
               jQuery.dequeue( this, type );
            }
         });
   },
   dequeue: function( type ) {
      return this.each(function() {
         jQuery.dequeue( this, type );
      });
   },
   // Based off of the plugin by Clint Helfers, with permission.
   // http://blindsignals.com/index.php/2009/07/jquery-delay/
   delay: function( time, type ) {
      time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
      type = type || "fx";

      return this.queue( type, function( next, hooks ) {
         var timeout = setTimeout( next, time );
         hooks.stop = function() {
            clearTimeout( timeout );
         };
      });
   },
   clearQueue: function( type ) {
      return this.queue( type || "fx", [] );
   },
   // Get a promise resolved when queues of a certain type
   // are emptied (fx is the type by default)
   promise: function( type, obj ) {
      var tmp,
         count = 1,
         defer = jQuery.Deferred(),
         elements = this,
         i = this.length,
         resolve = function() {
            if ( !( --count ) ) {
               defer.resolveWith( elements, [ elements ] );
            }
         };

      if ( typeof type !== "string" ) {
         obj = type;
         type = undefined;
      }
      type = type || "fx";

      while( i-- ) {
         tmp = jQuery._data( elements[ i ], type + "queueHooks" );
         if ( tmp && tmp.empty ) {
            count++;
            tmp.empty.add( resolve );
         }
      }
      resolve();
      return defer.promise( obj );
   }
});
var nodeHook, boolHook, fixSpecified,
   rclass = /[\t\r\n]/g,
   rreturn = /\r/g,
   rtype = /^(?:button|input)$/i,
   rfocusable = /^(?:button|input|object|select|textarea)$/i,
   rclickable = /^a(?:rea|)$/i,
   rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
   getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
   attr: function( name, value ) {
      return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
   },

   removeAttr: function( name ) {
      return this.each(function() {
         jQuery.removeAttr( this, name );
      });
   },

   prop: function( name, value ) {
      return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
   },

   removeProp: function( name ) {
      name = jQuery.propFix[ name ] || name;
      return this.each(function() {
         // try/catch handles cases where IE balks (such as removing a property on window)
         try {
            this[ name ] = undefined;
            delete this[ name ];
         } catch( e ) {}
      });
   },

   addClass: function( value ) {
      var classNames, i, l, elem,
         setClass, c, cl;

      if ( jQuery.isFunction( value ) ) {
         return this.each(function( j ) {
            jQuery( this ).addClass( value.call(this, j, this.className) );
         });
      }

      if ( value && typeof value === "string" ) {
         classNames = value.split( core_rspace );

         for ( i = 0, l = this.length; i < l; i++ ) {
            elem = this[ i ];

            if ( elem.nodeType === 1 ) {
               if ( !elem.className && classNames.length === 1 ) {
                  elem.className = value;

               } else {
                  setClass = " " + elem.className + " ";

                  for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                     if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
                        setClass += classNames[ c ] + " ";
                     }
                  }
                  elem.className = jQuery.trim( setClass );
               }
            }
         }
      }

      return this;
   },

   removeClass: function( value ) {
      var removes, className, elem, c, cl, i, l;

      if ( jQuery.isFunction( value ) ) {
         return this.each(function( j ) {
            jQuery( this ).removeClass( value.call(this, j, this.className) );
         });
      }
      if ( (value && typeof value === "string") || value === undefined ) {
         removes = ( value || "" ).split( core_rspace );

         for ( i = 0, l = this.length; i < l; i++ ) {
            elem = this[ i ];
            if ( elem.nodeType === 1 && elem.className ) {

               className = (" " + elem.className + " ").replace( rclass, " " );

               // loop over each item in the removal list
               for ( c = 0, cl = removes.length; c < cl; c++ ) {
                  // Remove until there is nothing to remove,
                  while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
                     className = className.replace( " " + removes[ c ] + " " , " " );
                  }
               }
               elem.className = value ? jQuery.trim( className ) : "";
            }
         }
      }

      return this;
   },

   toggleClass: function( value, stateVal ) {
      var type = typeof value,
         isBool = typeof stateVal === "boolean";

      if ( jQuery.isFunction( value ) ) {
         return this.each(function( i ) {
            jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
         });
      }

      return this.each(function() {
         if ( type === "string" ) {
            // toggle individual class names
            var className,
               i = 0,
               self = jQuery( this ),
               state = stateVal,
               classNames = value.split( core_rspace );

            while ( (className = classNames[ i++ ]) ) {
               // check each className given, space separated list
               state = isBool ? state : !self.hasClass( className );
               self[ state ? "addClass" : "removeClass" ]( className );
            }

         } else if ( type === "undefined" || type === "boolean" ) {
            if ( this.className ) {
               // store className if set
               jQuery._data( this, "__className__", this.className );
            }

            // toggle whole className
            this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
         }
      });
   },

   hasClass: function( selector ) {
      var className = " " + selector + " ",
         i = 0,
         l = this.length;
      for ( ; i < l; i++ ) {
         if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
            return true;
         }
      }

      return false;
   },

   val: function( value ) {
      var hooks, ret, isFunction,
         elem = this[0];

      if ( !arguments.length ) {
         if ( elem ) {
            hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

            if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
               return ret;
            }

            ret = elem.value;

            return typeof ret === "string" ?
               // handle most common string cases
               ret.replace(rreturn, "") :
               // handle cases where value is null/undef or number
               ret == null ? "" : ret;
         }

         return;
      }

      isFunction = jQuery.isFunction( value );

      return this.each(function( i ) {
         var val,
            self = jQuery(this);

         if ( this.nodeType !== 1 ) {
            return;
         }

         if ( isFunction ) {
            val = value.call( this, i, self.val() );
         } else {
            val = value;
         }

         // Treat null/undefined as ""; convert numbers to string
         if ( val == null ) {
            val = "";
         } else if ( typeof val === "number" ) {
            val += "";
         } else if ( jQuery.isArray( val ) ) {
            val = jQuery.map(val, function ( value ) {
               return value == null ? "" : value + "";
            });
         }

         hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

         // If set returns undefined, fall back to normal setting
         if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
            this.value = val;
         }
      });
   }
});

jQuery.extend({
   valHooks: {
      option: {
         get: function( elem ) {
            // attributes.value is undefined in Blackberry 4.7 but
            // uses .value. See #6932
            var val = elem.attributes.value;
            return !val || val.specified ? elem.value : elem.text;
         }
      },
      select: {
         get: function( elem ) {
            var value, i, max, option,
               index = elem.selectedIndex,
               values = [],
               options = elem.options,
               one = elem.type === "select-one";

            // Nothing was selected
            if ( index < 0 ) {
               return null;
            }

            // Loop through all the selected options
            i = one ? index : 0;
            max = one ? index + 1 : options.length;
            for ( ; i < max; i++ ) {
               option = options[ i ];

               // Don't return options that are disabled or in a disabled optgroup
               if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                     (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

                  // Get the specific value for the option
                  value = jQuery( option ).val();

                  // We don't need an array for one selects
                  if ( one ) {
                     return value;
                  }

                  // Multi-Selects return an array
                  values.push( value );
               }
            }

            // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
            if ( one && !values.length && options.length ) {
               return jQuery( options[ index ] ).val();
            }

            return values;
         },

         set: function( elem, value ) {
            var values = jQuery.makeArray( value );

            jQuery(elem).find("option").each(function() {
               this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
            });

            if ( !values.length ) {
               elem.selectedIndex = -1;
            }
            return values;
         }
      }
   },

   // Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
   attrFn: {},

   attr: function( elem, name, value, pass ) {
      var ret, hooks, notxml,
         nType = elem.nodeType;

      // don't get/set attributes on text, comment and attribute nodes
      if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
         return;
      }

      if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
         return jQuery( elem )[ name ]( value );
      }

      // Fallback to prop when attributes are not supported
      if ( typeof elem.getAttribute === "undefined" ) {
         return jQuery.prop( elem, name, value );
      }

      notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

      // All attributes are lowercase
      // Grab necessary hook if one is defined
      if ( notxml ) {
         name = name.toLowerCase();
         hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
      }

      if ( value !== undefined ) {

         if ( value === null ) {
            jQuery.removeAttr( elem, name );
            return;

         } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
            return ret;

         } else {
            elem.setAttribute( name, value + "" );
            return value;
         }

      } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
         return ret;

      } else {

         ret = elem.getAttribute( name );

         // Non-existent attributes return null, we normalize to undefined
         return ret === null ?
            undefined :
            ret;
      }
   },

   removeAttr: function( elem, value ) {
      var propName, attrNames, name, isBool,
         i = 0;

      if ( value && elem.nodeType === 1 ) {

         attrNames = value.split( core_rspace );

         for ( ; i < attrNames.length; i++ ) {
            name = attrNames[ i ];

            if ( name ) {
               propName = jQuery.propFix[ name ] || name;
               isBool = rboolean.test( name );

               // See #9699 for explanation of this approach (setting first, then removal)
               // Do not do this for boolean attributes (see #10870)
               if ( !isBool ) {
                  jQuery.attr( elem, name, "" );
               }
               elem.removeAttribute( getSetAttribute ? name : propName );

               // Set corresponding property to false for boolean attributes
               if ( isBool && propName in elem ) {
                  elem[ propName ] = false;
               }
            }
         }
      }
   },

   attrHooks: {
      type: {
         set: function( elem, value ) {
            // We can't allow the type property to be changed (since it causes problems in IE)
            if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
               jQuery.error( "type property can't be changed" );
            } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
               // Setting the type on a radio button after the value resets the value in IE6-9
               // Reset value to it's default in case type is set after value
               // This is for element creation
               var val = elem.value;
               elem.setAttribute( "type", value );
               if ( val ) {
                  elem.value = val;
               }
               return value;
            }
         }
      },
      // Use the value property for back compat
      // Use the nodeHook for button elements in IE6/7 (#1954)
      value: {
         get: function( elem, name ) {
            if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
               return nodeHook.get( elem, name );
            }
            return name in elem ?
               elem.value :
               null;
         },
         set: function( elem, value, name ) {
            if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
               return nodeHook.set( elem, value, name );
            }
            // Does not return so that setAttribute is also used
            elem.value = value;
         }
      }
   },

   propFix: {
      tabindex: "tabIndex",
      readonly: "readOnly",
      "for": "htmlFor",
      "class": "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable"
   },

   prop: function( elem, name, value ) {
      var ret, hooks, notxml,
         nType = elem.nodeType;

      // don't get/set properties on text, comment and attribute nodes
      if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
         return;
      }

      notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

      if ( notxml ) {
         // Fix name and attach hooks
         name = jQuery.propFix[ name ] || name;
         hooks = jQuery.propHooks[ name ];
      }

      if ( value !== undefined ) {
         if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
            return ret;

         } else {
            return ( elem[ name ] = value );
         }

      } else {
         if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
            return ret;

         } else {
            return elem[ name ];
         }
      }
   },

   propHooks: {
      tabIndex: {
         get: function( elem ) {
            // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
            // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
            var attributeNode = elem.getAttributeNode("tabindex");

            return attributeNode && attributeNode.specified ?
               parseInt( attributeNode.value, 10 ) :
               rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                  0 :
                  undefined;
         }
      }
   }
});

// Hook for boolean attributes
boolHook = {
   get: function( elem, name ) {
      // Align boolean attributes with corresponding properties
      // Fall back to attribute presence where some booleans are not supported
      var attrNode,
         property = jQuery.prop( elem, name );
      return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
         name.toLowerCase() :
         undefined;
   },
   set: function( elem, value, name ) {
      var propName;
      if ( value === false ) {
         // Remove boolean attributes when set to false
         jQuery.removeAttr( elem, name );
      } else {
         // value is true since we know at this point it's type boolean and not false
         // Set boolean attributes to the same name and set the DOM property
         propName = jQuery.propFix[ name ] || name;
         if ( propName in elem ) {
            // Only set the IDL specifically if it already exists on the element
            elem[ propName ] = true;
         }

         elem.setAttribute( name, name.toLowerCase() );
      }
      return name;
   }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

   fixSpecified = {
      name: true,
      id: true,
      coords: true
   };

   // Use this for any attribute in IE6/7
   // This fixes almost every IE6/7 issue
   nodeHook = jQuery.valHooks.button = {
      get: function( elem, name ) {
         var ret;
         ret = elem.getAttributeNode( name );
         return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
            ret.value :
            undefined;
      },
      set: function( elem, value, name ) {
         // Set the existing or create a new attribute node
         var ret = elem.getAttributeNode( name );
         if ( !ret ) {
            ret = document.createAttribute( name );
            elem.setAttributeNode( ret );
         }
         return ( ret.value = value + "" );
      }
   };

   // Set width and height to auto instead of 0 on empty string( Bug #8150 )
   // This is for removals
   jQuery.each([ "width", "height" ], function( i, name ) {
      jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
         set: function( elem, value ) {
            if ( value === "" ) {
               elem.setAttribute( name, "auto" );
               return value;
            }
         }
      });
   });

   // Set contenteditable to false on removals(#10429)
   // Setting to empty string throws an error as an invalid value
   jQuery.attrHooks.contenteditable = {
      get: nodeHook.get,
      set: function( elem, value, name ) {
         if ( value === "" ) {
            value = "false";
         }
         nodeHook.set( elem, value, name );
      }
   };
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
   jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
      jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
         get: function( elem ) {
            var ret = elem.getAttribute( name, 2 );
            return ret === null ? undefined : ret;
         }
      });
   });
}

if ( !jQuery.support.style ) {
   jQuery.attrHooks.style = {
      get: function( elem ) {
         // Return undefined in the case of empty string
         // Normalize to lowercase since IE uppercases css property names
         return elem.style.cssText.toLowerCase() || undefined;
      },
      set: function( elem, value ) {
         return ( elem.style.cssText = value + "" );
      }
   };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
   jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
      get: function( elem ) {
         var parent = elem.parentNode;

         if ( parent ) {
            parent.selectedIndex;

            // Make sure that it also works with optgroups, see #5701
            if ( parent.parentNode ) {
               parent.parentNode.selectedIndex;
            }
         }
         return null;
      }
   });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
   jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
   jQuery.each([ "radio", "checkbox" ], function() {
      jQuery.valHooks[ this ] = {
         get: function( elem ) {
            // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
            return elem.getAttribute("value") === null ? "on" : elem.value;
         }
      };
   });
}
jQuery.each([ "radio", "checkbox" ], function() {
   jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
      set: function( elem, value ) {
         if ( jQuery.isArray( value ) ) {
            return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
         }
      }
   });
});
var rformElems = /^(?:textarea|input|select)$/i,
   rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
   rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
   rkeyEvent = /^key/,
   rmouseEvent = /^(?:mouse|contextmenu)|click/,
   rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
   hoverHack = function( events ) {
      return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
   };

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

   add: function( elem, types, handler, data, selector ) {

      var elemData, eventHandle, events,
         t, tns, type, namespaces, handleObj,
         handleObjIn, handlers, special;

      // Don't attach events to noData or text/comment nodes (allow plain objects tho)
      if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
         return;
      }

      // Caller can pass in an object of custom data in lieu of the handler
      if ( handler.handler ) {
         handleObjIn = handler;
         handler = handleObjIn.handler;
         selector = handleObjIn.selector;
      }

      // Make sure that the handler has a unique ID, used to find/remove it later
      if ( !handler.guid ) {
         handler.guid = jQuery.guid++;
      }

      // Init the element's event structure and main handler, if this is the first
      events = elemData.events;
      if ( !events ) {
         elemData.events = events = {};
      }
      eventHandle = elemData.handle;
      if ( !eventHandle ) {
         elemData.handle = eventHandle = function( e ) {
            // Discard the second event of a jQuery.event.trigger() and
            // when an event is called after a page has unloaded
            return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
               jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
               undefined;
         };
         // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
         eventHandle.elem = elem;
      }

      // Handle multiple events separated by a space
      // jQuery(...).bind("mouseover mouseout", fn);
      types = jQuery.trim( hoverHack(types) ).split( " " );
      for ( t = 0; t < types.length; t++ ) {

         tns = rtypenamespace.exec( types[t] ) || [];
         type = tns[1];
         namespaces = ( tns[2] || "" ).split( "." ).sort();

         // If event changes its type, use the special event handlers for the changed type
         special = jQuery.event.special[ type ] || {};

         // If selector defined, determine special event api type, otherwise given type
         type = ( selector ? special.delegateType : special.bindType ) || type;

         // Update special based on newly reset type
         special = jQuery.event.special[ type ] || {};

         // handleObj is passed to all event handlers
         handleObj = jQuery.extend({
            type: type,
            origType: tns[1],
            data: data,
            handler: handler,
            guid: handler.guid,
            selector: selector,
            needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
            namespace: namespaces.join(".")
         }, handleObjIn );

         // Init the event handler queue if we're the first
         handlers = events[ type ];
         if ( !handlers ) {
            handlers = events[ type ] = [];
            handlers.delegateCount = 0;

            // Only use addEventListener/attachEvent if the special events handler returns false
            if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
               // Bind the global event handler to the element
               if ( elem.addEventListener ) {
                  elem.addEventListener( type, eventHandle, false );

               } else if ( elem.attachEvent ) {
                  elem.attachEvent( "on" + type, eventHandle );
               }
            }
         }

         if ( special.add ) {
            special.add.call( elem, handleObj );

            if ( !handleObj.handler.guid ) {
               handleObj.handler.guid = handler.guid;
            }
         }

         // Add to the element's handler list, delegates in front
         if ( selector ) {
            handlers.splice( handlers.delegateCount++, 0, handleObj );
         } else {
            handlers.push( handleObj );
         }

         // Keep track of which events have ever been used, for event optimization
         jQuery.event.global[ type ] = true;
      }

      // Nullify elem to prevent memory leaks in IE
      elem = null;
   },

   global: {},

   // Detach an event or set of events from an element
   remove: function( elem, types, handler, selector, mappedTypes ) {

      var t, tns, type, origType, namespaces, origCount,
         j, events, special, eventType, handleObj,
         elemData = jQuery.hasData( elem ) && jQuery._data( elem );

      if ( !elemData || !(events = elemData.events) ) {
         return;
      }

      // Once for each type.namespace in types; type may be omitted
      types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
      for ( t = 0; t < types.length; t++ ) {
         tns = rtypenamespace.exec( types[t] ) || [];
         type = origType = tns[1];
         namespaces = tns[2];

         // Unbind all events (on this namespace, if provided) for the element
         if ( !type ) {
            for ( type in events ) {
               jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
            }
            continue;
         }

         special = jQuery.event.special[ type ] || {};
         type = ( selector? special.delegateType : special.bindType ) || type;
         eventType = events[ type ] || [];
         origCount = eventType.length;
         namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

         // Remove matching events
         for ( j = 0; j < eventType.length; j++ ) {
            handleObj = eventType[ j ];

            if ( ( mappedTypes || origType === handleObj.origType ) &&
                ( !handler || handler.guid === handleObj.guid ) &&
                ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
                ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
               eventType.splice( j--, 1 );

               if ( handleObj.selector ) {
                  eventType.delegateCount--;
               }
               if ( special.remove ) {
                  special.remove.call( elem, handleObj );
               }
            }
         }

         // Remove generic event handler if we removed something and no more handlers exist
         // (avoids potential for endless recursion during removal of special event handlers)
         if ( eventType.length === 0 && origCount !== eventType.length ) {
            if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
               jQuery.removeEvent( elem, type, elemData.handle );
            }

            delete events[ type ];
         }
      }

      // Remove the expando if it's no longer used
      if ( jQuery.isEmptyObject( events ) ) {
         delete elemData.handle;

         // removeData also checks for emptiness and clears the expando if empty
         // so use it instead of delete
         jQuery.removeData( elem, "events", true );
      }
   },

   // Events that are safe to short-circuit if no handlers are attached.
   // Native DOM events should not be added, they may have inline handlers.
   customEvent: {
      "getData": true,
      "setData": true,
      "changeData": true
   },

   trigger: function( event, data, elem, onlyHandlers ) {
      // Don't do events on text and comment nodes
      if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
         return;
      }

      // Event object or event type
      var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
         type = event.type || event,
         namespaces = [];

      // focus/blur morphs to focusin/out; ensure we're not firing them right now
      if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
         return;
      }

      if ( type.indexOf( "!" ) >= 0 ) {
         // Exclusive events trigger only for the exact event (no namespaces)
         type = type.slice(0, -1);
         exclusive = true;
      }

      if ( type.indexOf( "." ) >= 0 ) {
         // Namespaced trigger; create a regexp to match event type in handle()
         namespaces = type.split(".");
         type = namespaces.shift();
         namespaces.sort();
      }

      if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
         // No jQuery handlers for this event type, and it can't have inline handlers
         return;
      }

      // Caller can pass in an Event, Object, or just an event type string
      event = typeof event === "object" ?
         // jQuery.Event object
         event[ jQuery.expando ] ? event :
         // Object literal
         new jQuery.Event( type, event ) :
         // Just the event type (string)
         new jQuery.Event( type );

      event.type = type;
      event.isTrigger = true;
      event.exclusive = exclusive;
      event.namespace = namespaces.join( "." );
      event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
      ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

      // Handle a global trigger
      if ( !elem ) {

         // TODO: Stop taunting the data cache; remove global events and always attach to document
         cache = jQuery.cache;
         for ( i in cache ) {
            if ( cache[ i ].events && cache[ i ].events[ type ] ) {
               jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
            }
         }
         return;
      }

      // Clean up the event in case it is being reused
      event.result = undefined;
      if ( !event.target ) {
         event.target = elem;
      }

      // Clone any incoming data and prepend the event, creating the handler arg list
      data = data != null ? jQuery.makeArray( data ) : [];
      data.unshift( event );

      // Allow special events to draw outside the lines
      special = jQuery.event.special[ type ] || {};
      if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
         return;
      }

      // Determine event propagation path in advance, per W3C events spec (#9951)
      // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
      eventPath = [[ elem, special.bindType || type ]];
      if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

         bubbleType = special.delegateType || type;
         cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
         for ( old = elem; cur; cur = cur.parentNode ) {
            eventPath.push([ cur, bubbleType ]);
            old = cur;
         }

         // Only add window if we got to document (e.g., not plain obj or detached DOM)
         if ( old === (elem.ownerDocument || document) ) {
            eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
         }
      }

      // Fire handlers on the event path
      for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

         cur = eventPath[i][0];
         event.type = eventPath[i][1];

         handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
         if ( handle ) {
            handle.apply( cur, data );
         }
         // Note that this is a bare JS function and not a jQuery handler
         handle = ontype && cur[ ontype ];
         if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
            event.preventDefault();
         }
      }
      event.type = type;

      // If nobody prevented the default action, do it now
      if ( !onlyHandlers && !event.isDefaultPrevented() ) {

         if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
            !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

            // Call a native DOM method on the target with the same name name as the event.
            // Can't use an .isFunction() check here because IE6/7 fails that test.
            // Don't do default actions on window, that's where global variables be (#6170)
            // IE<9 dies on focus/blur to hidden element (#1486)
            if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

               // Don't re-trigger an onFOO event when we call its FOO() method
               old = elem[ ontype ];

               if ( old ) {
                  elem[ ontype ] = null;
               }

               // Prevent re-triggering of the same event, since we already bubbled it above
               jQuery.event.triggered = type;
               elem[ type ]();
               jQuery.event.triggered = undefined;

               if ( old ) {
                  elem[ ontype ] = old;
               }
            }
         }
      }

      return event.result;
   },

   dispatch: function( event ) {

      // Make a writable jQuery.Event from the native event object
      event = jQuery.event.fix( event || window.event );

      var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
         handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
         delegateCount = handlers.delegateCount,
         args = core_slice.call( arguments ),
         run_all = !event.exclusive && !event.namespace,
         special = jQuery.event.special[ event.type ] || {},
         handlerQueue = [];

      // Use the fix-ed jQuery.Event rather than the (read-only) native event
      args[0] = event;
      event.delegateTarget = this;

      // Call the preDispatch hook for the mapped type, and let it bail if desired
      if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
         return;
      }

      // Determine handlers that should run if there are delegated events
      // Avoid non-left-click bubbling in Firefox (#3861)
      if ( delegateCount && !(event.button && event.type === "click") ) {

         for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

            // Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
            if ( cur.disabled !== true || event.type !== "click" ) {
               selMatch = {};
               matches = [];
               for ( i = 0; i < delegateCount; i++ ) {
                  handleObj = handlers[ i ];
                  sel = handleObj.selector;

                  if ( selMatch[ sel ] === undefined ) {
                     selMatch[ sel ] = handleObj.needsContext ?
                        jQuery( sel, this ).index( cur ) >= 0 :
                        jQuery.find( sel, this, null, [ cur ] ).length;
                  }
                  if ( selMatch[ sel ] ) {
                     matches.push( handleObj );
                  }
               }
               if ( matches.length ) {
                  handlerQueue.push({ elem: cur, matches: matches });
               }
            }
         }
      }

      // Add the remaining (directly-bound) handlers
      if ( handlers.length > delegateCount ) {
         handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
      }

      // Run delegates first; they may want to stop propagation beneath us
      for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
         matched = handlerQueue[ i ];
         event.currentTarget = matched.elem;

         for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
            handleObj = matched.matches[ j ];

            // Triggered event must either 1) be non-exclusive and have no namespace, or
            // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
            if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

               event.data = handleObj.data;
               event.handleObj = handleObj;

               ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                     .apply( matched.elem, args );

               if ( ret !== undefined ) {
                  event.result = ret;
                  if ( ret === false ) {
                     event.preventDefault();
                     event.stopPropagation();
                  }
               }
            }
         }
      }

      // Call the postDispatch hook for the mapped type
      if ( special.postDispatch ) {
         special.postDispatch.call( this, event );
      }

      return event.result;
   },

   // Includes some event props shared by KeyEvent and MouseEvent
   // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
   props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

   fixHooks: {},

   keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function( event, original ) {

         // Add which for key events
         if ( event.which == null ) {
            event.which = original.charCode != null ? original.charCode : original.keyCode;
         }

         return event;
      }
   },

   mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function( event, original ) {
         var eventDoc, doc, body,
            button = original.button,
            fromElement = original.fromElement;

         // Calculate pageX/Y if missing and clientX/Y available
         if ( event.pageX == null && original.clientX != null ) {
            eventDoc = event.target.ownerDocument || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
            event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
         }

         // Add relatedTarget, if necessary
         if ( !event.relatedTarget && fromElement ) {
            event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
         }

         // Add which for click: 1 === left; 2 === middle; 3 === right
         // Note: button is not normalized, so don't use it
         if ( !event.which && button !== undefined ) {
            event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
         }

         return event;
      }
   },

   fix: function( event ) {
      if ( event[ jQuery.expando ] ) {
         return event;
      }

      // Create a writable copy of the event object and normalize some properties
      var i, prop,
         originalEvent = event,
         fixHook = jQuery.event.fixHooks[ event.type ] || {},
         copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

      event = jQuery.Event( originalEvent );

      for ( i = copy.length; i; ) {
         prop = copy[ --i ];
         event[ prop ] = originalEvent[ prop ];
      }

      // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
      if ( !event.target ) {
         event.target = originalEvent.srcElement || document;
      }

      // Target should not be a text node (#504, Safari)
      if ( event.target.nodeType === 3 ) {
         event.target = event.target.parentNode;
      }

      // For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
      event.metaKey = !!event.metaKey;

      return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
   },

   special: {
      load: {
         // Prevent triggered image.load events from bubbling to window.load
         noBubble: true
      },

      focus: {
         delegateType: "focusin"
      },
      blur: {
         delegateType: "focusout"
      },

      beforeunload: {
         setup: function( data, namespaces, eventHandle ) {
            // We only want to do this special case on windows
            if ( jQuery.isWindow( this ) ) {
               this.onbeforeunload = eventHandle;
            }
         },

         teardown: function( namespaces, eventHandle ) {
            if ( this.onbeforeunload === eventHandle ) {
               this.onbeforeunload = null;
            }
         }
      }
   },

   simulate: function( type, elem, event, bubble ) {
      // Piggyback on a donor event to simulate a different one.
      // Fake originalEvent to avoid donor's stopPropagation, but if the
      // simulated event prevents default then we do the same on the donor.
      var e = jQuery.extend(
         new jQuery.Event(),
         event,
         { type: type,
            isSimulated: true,
            originalEvent: {}
         }
      );
      if ( bubble ) {
         jQuery.event.trigger( e, null, elem );
      } else {
         jQuery.event.dispatch.call( elem, e );
      }
      if ( e.isDefaultPrevented() ) {
         event.preventDefault();
      }
   }
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
   function( elem, type, handle ) {
      if ( elem.removeEventListener ) {
         elem.removeEventListener( type, handle, false );
      }
   } :
   function( elem, type, handle ) {
      var name = "on" + type;

      if ( elem.detachEvent ) {

         // #8545, #7054, preventing memory leaks for custom events in IE6-8 –
         // detachEvent needed property on element, by name of that event, to properly expose it to GC
         if ( typeof elem[ name ] === "undefined" ) {
            elem[ name ] = null;
         }

         elem.detachEvent( name, handle );
      }
   };

jQuery.Event = function( src, props ) {
   // Allow instantiation without the 'new' keyword
   if ( !(this instanceof jQuery.Event) ) {
      return new jQuery.Event( src, props );
   }

   // Event object
   if ( src && src.type ) {
      this.originalEvent = src;
      this.type = src.type;

      // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.
      this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
         src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

   // Event type
   } else {
      this.type = src;
   }

   // Put explicitly provided properties onto the event object
   if ( props ) {
      jQuery.extend( this, props );
   }

   // Create a timestamp if incoming event doesn't have one
   this.timeStamp = src && src.timeStamp || jQuery.now();

   // Mark it as fixed
   this[ jQuery.expando ] = true;
};

function returnFalse() {
   return false;
}
function returnTrue() {
   return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
   preventDefault: function() {
      this.isDefaultPrevented = returnTrue;

      var e = this.originalEvent;
      if ( !e ) {
         return;
      }

      // if preventDefault exists run it on the original event
      if ( e.preventDefault ) {
         e.preventDefault();

      // otherwise set the returnValue property of the original event to false (IE)
      } else {
         e.returnValue = false;
      }
   },
   stopPropagation: function() {
      this.isPropagationStopped = returnTrue;

      var e = this.originalEvent;
      if ( !e ) {
         return;
      }
      // if stopPropagation exists run it on the original event
      if ( e.stopPropagation ) {
         e.stopPropagation();
      }
      // otherwise set the cancelBubble property of the original event to true (IE)
      e.cancelBubble = true;
   },
   stopImmediatePropagation: function() {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
   },
   isDefaultPrevented: returnFalse,
   isPropagationStopped: returnFalse,
   isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
   mouseenter: "mouseover",
   mouseleave: "mouseout"
}, function( orig, fix ) {
   jQuery.event.special[ orig ] = {
      delegateType: fix,
      bindType: fix,

      handle: function( event ) {
         var ret,
            target = this,
            related = event.relatedTarget,
            handleObj = event.handleObj,
            selector = handleObj.selector;

         // For mousenter/leave call the handler if related is outside the target.
         // NB: No relatedTarget if the mouse left/entered the browser window
         if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
            event.type = handleObj.origType;
            ret = handleObj.handler.apply( this, arguments );
            event.type = fix;
         }
         return ret;
      }
   };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

   jQuery.event.special.submit = {
      setup: function() {
         // Only need this for delegated form submit events
         if ( jQuery.nodeName( this, "form" ) ) {
            return false;
         }

         // Lazy-add a submit handler when a descendant form may potentially be submitted
         jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
            // Node name check avoids a VML-related crash in IE (#9807)
            var elem = e.target,
               form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
            if ( form && !jQuery._data( form, "_submit_attached" ) ) {
               jQuery.event.add( form, "submit._submit", function( event ) {
                  event._submit_bubble = true;
               });
               jQuery._data( form, "_submit_attached", true );
            }
         });
         // return undefined since we don't need an event listener
      },

      postDispatch: function( event ) {
         // If form was submitted by the user, bubble the event up the tree
         if ( event._submit_bubble ) {
            delete event._submit_bubble;
            if ( this.parentNode && !event.isTrigger ) {
               jQuery.event.simulate( "submit", this.parentNode, event, true );
            }
         }
      },

      teardown: function() {
         // Only need this for delegated form submit events
         if ( jQuery.nodeName( this, "form" ) ) {
            return false;
         }

         // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
         jQuery.event.remove( this, "._submit" );
      }
   };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

   jQuery.event.special.change = {

      setup: function() {

         if ( rformElems.test( this.nodeName ) ) {
            // IE doesn't fire change on a check/radio until blur; trigger it on click
            // after a propertychange. Eat the blur-change in special.change.handle.
            // This still fires onchange a second time for check/radio after blur.
            if ( this.type === "checkbox" || this.type === "radio" ) {
               jQuery.event.add( this, "propertychange._change", function( event ) {
                  if ( event.originalEvent.propertyName === "checked" ) {
                     this._just_changed = true;
                  }
               });
               jQuery.event.add( this, "click._change", function( event ) {
                  if ( this._just_changed && !event.isTrigger ) {
                     this._just_changed = false;
                  }
                  // Allow triggered, simulated change events (#11500)
                  jQuery.event.simulate( "change", this, event, true );
               });
            }
            return false;
         }
         // Delegated event; lazy-add a change handler on descendant inputs
         jQuery.event.add( this, "beforeactivate._change", function( e ) {
            var elem = e.target;

            if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
               jQuery.event.add( elem, "change._change", function( event ) {
                  if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                     jQuery.event.simulate( "change", this.parentNode, event, true );
                  }
               });
               jQuery._data( elem, "_change_attached", true );
            }
         });
      },

      handle: function( event ) {
         var elem = event.target;

         // Swallow native change events from checkbox/radio, we already triggered them above
         if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
            return event.handleObj.handler.apply( this, arguments );
         }
      },

      teardown: function() {
         jQuery.event.remove( this, "._change" );

         return !rformElems.test( this.nodeName );
      }
   };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
   jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

      // Attach a single capturing handler while someone wants focusin/focusout
      var attaches = 0,
         handler = function( event ) {
            jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
         };

      jQuery.event.special[ fix ] = {
         setup: function() {
            if ( attaches++ === 0 ) {
               document.addEventListener( orig, handler, true );
            }
         },
         teardown: function() {
            if ( --attaches === 0 ) {
               document.removeEventListener( orig, handler, true );
            }
         }
      };
   });
}

jQuery.fn.extend({

   on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
      var origFn, type;

      // Types can be a map of types/handlers
      if ( typeof types === "object" ) {
         // ( types-Object, selector, data )
         if ( typeof selector !== "string" ) { // && selector != null
            // ( types-Object, data )
            data = data || selector;
            selector = undefined;
         }
         for ( type in types ) {
            this.on( type, selector, data, types[ type ], one );
         }
         return this;
      }

      if ( data == null && fn == null ) {
         // ( types, fn )
         fn = selector;
         data = selector = undefined;
      } else if ( fn == null ) {
         if ( typeof selector === "string" ) {
            // ( types, selector, fn )
            fn = data;
            data = undefined;
         } else {
            // ( types, data, fn )
            fn = data;
            data = selector;
            selector = undefined;
         }
      }
      if ( fn === false ) {
         fn = returnFalse;
      } else if ( !fn ) {
         return this;
      }

      if ( one === 1 ) {
         origFn = fn;
         fn = function( event ) {
            // Can use an empty set, since event contains the info
            jQuery().off( event );
            return origFn.apply( this, arguments );
         };
         // Use same guid so caller can remove using origFn
         fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
      }
      return this.each( function() {
         jQuery.event.add( this, types, fn, data, selector );
      });
   },
   one: function( types, selector, data, fn ) {
      return this.on( types, selector, data, fn, 1 );
   },
   off: function( types, selector, fn ) {
      var handleObj, type;
      if ( types && types.preventDefault && types.handleObj ) {
         // ( event )  dispatched jQuery.Event
         handleObj = types.handleObj;
         jQuery( types.delegateTarget ).off(
            handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
            handleObj.selector,
            handleObj.handler
         );
         return this;
      }
      if ( typeof types === "object" ) {
         // ( types-object [, selector] )
         for ( type in types ) {
            this.off( type, selector, types[ type ] );
         }
         return this;
      }
      if ( selector === false || typeof selector === "function" ) {
         // ( types [, fn] )
         fn = selector;
         selector = undefined;
      }
      if ( fn === false ) {
         fn = returnFalse;
      }
      return this.each(function() {
         jQuery.event.remove( this, types, fn, selector );
      });
   },

   bind: function( types, data, fn ) {
      return this.on( types, null, data, fn );
   },
   unbind: function( types, fn ) {
      return this.off( types, null, fn );
   },

   live: function( types, data, fn ) {
      jQuery( this.context ).on( types, this.selector, data, fn );
      return this;
   },
   die: function( types, fn ) {
      jQuery( this.context ).off( types, this.selector || "**", fn );
      return this;
   },

   delegate: function( selector, types, data, fn ) {
      return this.on( types, selector, data, fn );
   },
   undelegate: function( selector, types, fn ) {
      // ( namespace ) or ( selector, types [, fn] )
      return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
   },

   trigger: function( type, data ) {
      return this.each(function() {
         jQuery.event.trigger( type, data, this );
      });
   },
   triggerHandler: function( type, data ) {
      if ( this[0] ) {
         return jQuery.event.trigger( type, data, this[0], true );
      }
   },

   toggle: function( fn ) {
      // Save reference to arguments for access in closure
      var args = arguments,
         guid = fn.guid || jQuery.guid++,
         i = 0,
         toggler = function( event ) {
            // Figure out which function to execute
            var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
            jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

            // Make sure that clicks stop
            event.preventDefault();

            // and execute the function
            return args[ lastToggle ].apply( this, arguments ) || false;
         };

      // link all the functions, so any of them can unbind this click handler
      toggler.guid = guid;
      while ( i < args.length ) {
         args[ i++ ].guid = guid;
      }

      return this.click( toggler );
   },

   hover: function( fnOver, fnOut ) {
      return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
   }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
   "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
   "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

   // Handle event binding
   jQuery.fn[ name ] = function( data, fn ) {
      if ( fn == null ) {
         fn = data;
         data = null;
      }

      return arguments.length > 0 ?
         this.on( name, null, data, fn ) :
         this.trigger( name );
   };

   if ( rkeyEvent.test( name ) ) {
      jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
   }

   if ( rmouseEvent.test( name ) ) {
      jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
   }
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
   assertGetIdNotName,
   Expr,
   getText,
   isXML,
   contains,
   compile,
   sortOrder,
   hasDuplicate,
   outermostContext,

   baseHasDuplicate = true,
   strundefined = "undefined",

   expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

   Token = String,
   document = window.document,
   docElem = document.documentElement,
   dirruns = 0,
   done = 0,
   pop = [].pop,
   push = [].push,
   slice = [].slice,
   // Use a stripped-down indexOf if a native one is unavailable
   indexOf = [].indexOf || function( elem ) {
      var i = 0,
         len = this.length;
      for ( ; i < len; i++ ) {
         if ( this[i] === elem ) {
            return i;
         }
      }
      return -1;
   },

   // Augment a function for special use by Sizzle
   markFunction = function( fn, value ) {
      fn[ expando ] = value == null || value;
      return fn;
   },

   createCache = function() {
      var cache = {},
         keys = [];

      return markFunction(function( key, value ) {
         // Only keep the most recent entries
         if ( keys.push( key ) > Expr.cacheLength ) {
            delete cache[ keys.shift() ];
         }

         return (cache[ key ] = value);
      }, cache );
   },

   classCache = createCache(),
   tokenCache = createCache(),
   compilerCache = createCache(),

   // Regex

   // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
   whitespace = "[\\x20\\t\\r\\n\\f]",
   // http://www.w3.org/TR/css3-syntax/#characters
   characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

   // Loosely modeled on CSS identifier characters
   // An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
   // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
   identifier = characterEncoding.replace( "w", "w#" ),

   // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
   operators = "([*^$|!~]?=)",
   attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
      "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

   // Prefer arguments not in parens/brackets,
   //   then attribute selectors and non-pseudos (denoted by :),
   //   then anything else
   // These preferences are here to reduce the number of selectors
   //   needing tokenize in the PSEUDO preFilter
   pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

   // For matchExpr.POS and matchExpr.needsContext
   pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
      "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

   // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
   rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

   rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
   rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
   rpseudo = new RegExp( pseudos ),

   // Easily-parseable/retrievable ID or TAG or CLASS selectors
   rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

   rnot = /^:not/,
   rsibling = /[\x20\t\r\n\f]*[+~]/,
   rendsWithNot = /:not\($/,

   rheader = /h\d/i,
   rinputs = /input|select|textarea|button/i,

   rbackslash = /\\(?!\\)/g,

   matchExpr = {
      "ID": new RegExp( "^#(" + characterEncoding + ")" ),
      "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
      "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
      "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
      "ATTR": new RegExp( "^" + attributes ),
      "PSEUDO": new RegExp( "^" + pseudos ),
      "POS": new RegExp( pos, "i" ),
      "CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
         "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
         "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
      // For use in libraries implementing .is()
      "needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
   },

   // Support

   // Used for testing something on an element
   assert = function( fn ) {
      var div = document.createElement("div");

      try {
         return fn( div );
      } catch (e) {
         return false;
      } finally {
         // release memory in IE
         div = null;
      }
   },

   // Check if getElementsByTagName("*") returns only elements
   assertTagNameNoComments = assert(function( div ) {
      div.appendChild( document.createComment("") );
      return !div.getElementsByTagName("*").length;
   }),

   // Check if getAttribute returns normalized href attributes
   assertHrefNotNormalized = assert(function( div ) {
      div.innerHTML = "<a href='#'></a>";
      return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
         div.firstChild.getAttribute("href") === "#";
   }),

   // Check if attributes should be retrieved by attribute nodes
   assertAttributes = assert(function( div ) {
      div.innerHTML = "<select></select>";
      var type = typeof div.lastChild.getAttribute("multiple");
      // IE8 returns a string for some attributes even when not present
      return type !== "boolean" && type !== "string";
   }),

   // Check if getElementsByClassName can be trusted
   assertUsableClassName = assert(function( div ) {
      // Opera can't find a second classname (in 9.6)
      div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
      if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
         return false;
      }

      // Safari 3.2 caches class attributes and doesn't catch changes
      div.lastChild.className = "e";
      return div.getElementsByClassName("e").length === 2;
   }),

   // Check if getElementById returns elements by name
   // Check if getElementsByName privileges form controls or returns elements by ID
   assertUsableName = assert(function( div ) {
      // Inject content
      div.id = expando + 0;
      div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
      docElem.insertBefore( div, docElem.firstChild );

      // Test
      var pass = document.getElementsByName &&
         // buggy browsers will return fewer than the correct 2
         document.getElementsByName( expando ).length === 2 +
         // buggy browsers will return more than the correct 0
         document.getElementsByName( expando + 0 ).length;
      assertGetIdNotName = !document.getElementById( expando );

      // Cleanup
      docElem.removeChild( div );

      return pass;
   });

// If slice is not available, provide a backup
try {
   slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
   slice = function( i ) {
      var elem,
         results = [];
      for ( ; (elem = this[i]); i++ ) {
         results.push( elem );
      }
      return results;
   };
}

function Sizzle( selector, context, results, seed ) {
   results = results || [];
   context = context || document;
   var match, elem, xml, m,
      nodeType = context.nodeType;

   if ( !selector || typeof selector !== "string" ) {
      return results;
   }

   if ( nodeType !== 1 && nodeType !== 9 ) {
      return [];
   }

   xml = isXML( context );

   if ( !xml && !seed ) {
      if ( (match = rquickExpr.exec( selector )) ) {
         // Speed-up: Sizzle("#ID")
         if ( (m = match[1]) ) {
            if ( nodeType === 9 ) {
               elem = context.getElementById( m );
               // Check parentNode to catch when Blackberry 4.6 returns
               // nodes that are no longer in the document #6963
               if ( elem && elem.parentNode ) {
                  // Handle the case where IE, Opera, and Webkit return items
                  // by name instead of ID
                  if ( elem.id === m ) {
                     results.push( elem );
                     return results;
                  }
               } else {
                  return results;
               }
            } else {
               // Context is not a document
               if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                  contains( context, elem ) && elem.id === m ) {
                  results.push( elem );
                  return results;
               }
            }

         // Speed-up: Sizzle("TAG")
         } else if ( match[2] ) {
            push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
            return results;

         // Speed-up: Sizzle(".CLASS")
         } else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
            push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
            return results;
         }
      }
   }

   // All others
   return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
   return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
   return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
   return function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && elem.type === type;
   };
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
   return function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return (name === "input" || name === "button") && elem.type === type;
   };
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
   return markFunction(function( argument ) {
      argument = +argument;
      return markFunction(function( seed, matches ) {
         var j,
            matchIndexes = fn( [], seed.length, argument ),
            i = matchIndexes.length;

         // Match elements found at the specified indexes
         while ( i-- ) {
            if ( seed[ (j = matchIndexes[i]) ] ) {
               seed[j] = !(matches[j] = seed[j]);
            }
         }
      });
   });
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
   var node,
      ret = "",
      i = 0,
      nodeType = elem.nodeType;

   if ( nodeType ) {
      if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
         // Use textContent for elements
         // innerText usage removed for consistency of new lines (see #11153)
         if ( typeof elem.textContent === "string" ) {
            return elem.textContent;
         } else {
            // Traverse its children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
               ret += getText( elem );
            }
         }
      } else if ( nodeType === 3 || nodeType === 4 ) {
         return elem.nodeValue;
      }
      // Do not include comment or processing instruction nodes
   } else {

      // If no nodeType, this is expected to be an array
      for ( ; (node = elem[i]); i++ ) {
         // Do not traverse comment nodes
         ret += getText( node );
      }
   }
   return ret;
};

isXML = Sizzle.isXML = function( elem ) {
   // documentElement is verified for cases where it doesn't yet exist
   // (such as loading iframes in IE - #4833)
   var documentElement = elem && (elem.ownerDocument || elem).documentElement;
   return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
   function( a, b ) {
      var adown = a.nodeType === 9 ? a.documentElement : a,
         bup = b && b.parentNode;
      return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
   } :
   docElem.compareDocumentPosition ?
   function( a, b ) {
      return b && !!( a.compareDocumentPosition( b ) & 16 );
   } :
   function( a, b ) {
      while ( (b = b.parentNode) ) {
         if ( b === a ) {
            return true;
         }
      }
      return false;
   };

Sizzle.attr = function( elem, name ) {
   var val,
      xml = isXML( elem );

   if ( !xml ) {
      name = name.toLowerCase();
   }
   if ( (val = Expr.attrHandle[ name ]) ) {
      return val( elem );
   }
   if ( xml || assertAttributes ) {
      return elem.getAttribute( name );
   }
   val = elem.getAttributeNode( name );
   return val ?
      typeof elem[ name ] === "boolean" ?
         elem[ name ] ? name : null :
         val.specified ? val.value : null :
      null;
};

Expr = Sizzle.selectors = {

   // Can be adjusted by the user
   cacheLength: 50,

   createPseudo: markFunction,

   match: matchExpr,

   // IE6/7 return a modified href
   attrHandle: assertHrefNotNormalized ?
      {} :
      {
         "href": function( elem ) {
            return elem.getAttribute( "href", 2 );
         },
         "type": function( elem ) {
            return elem.getAttribute("type");
         }
      },

   find: {
      "ID": assertGetIdNotName ?
         function( id, context, xml ) {
            if ( typeof context.getElementById !== strundefined && !xml ) {
               var m = context.getElementById( id );
               // Check parentNode to catch when Blackberry 4.6 returns
               // nodes that are no longer in the document #6963
               return m && m.parentNode ? [m] : [];
            }
         } :
         function( id, context, xml ) {
            if ( typeof context.getElementById !== strundefined && !xml ) {
               var m = context.getElementById( id );

               return m ?
                  m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
                     [m] :
                     undefined :
                  [];
            }
         },

      "TAG": assertTagNameNoComments ?
         function( tag, context ) {
            if ( typeof context.getElementsByTagName !== strundefined ) {
               return context.getElementsByTagName( tag );
            }
         } :
         function( tag, context ) {
            var results = context.getElementsByTagName( tag );

            // Filter out possible comments
            if ( tag === "*" ) {
               var elem,
                  tmp = [],
                  i = 0;

               for ( ; (elem = results[i]); i++ ) {
                  if ( elem.nodeType === 1 ) {
                     tmp.push( elem );
                  }
               }

               return tmp;
            }
            return results;
         },

      "NAME": assertUsableName && function( tag, context ) {
         if ( typeof context.getElementsByName !== strundefined ) {
            return context.getElementsByName( name );
         }
      },

      "CLASS": assertUsableClassName && function( className, context, xml ) {
         if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
            return context.getElementsByClassName( className );
         }
      }
   },

   relative: {
      ">": { dir: "parentNode", first: true },
      " ": { dir: "parentNode" },
      "+": { dir: "previousSibling", first: true },
      "~": { dir: "previousSibling" }
   },

   preFilter: {
      "ATTR": function( match ) {
         match[1] = match[1].replace( rbackslash, "" );

         // Move the given value to match[3] whether quoted or unquoted
         match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

         if ( match[2] === "~=" ) {
            match[3] = " " + match[3] + " ";
         }

         return match.slice( 0, 4 );
      },

      "CHILD": function( match ) {
         /* matches from matchExpr["CHILD"]
            1 type (only|nth|...)
            2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
            3 xn-component of xn+y argument ([+-]?\d*n|)
            4 sign of xn-component
            5 x of xn-component
            6 sign of y-component
            7 y of y-component
         */
         match[1] = match[1].toLowerCase();

         if ( match[1] === "nth" ) {
            // nth-child requires argument
            if ( !match[2] ) {
               Sizzle.error( match[0] );
            }

            // numeric x and y parameters for Expr.filter.CHILD
            // remember that false/true cast respectively to 0/1
            match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
            match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

         // other types prohibit arguments
         } else if ( match[2] ) {
            Sizzle.error( match[0] );
         }

         return match;
      },

      "PSEUDO": function( match ) {
         var unquoted, excess;
         if ( matchExpr["CHILD"].test( match[0] ) ) {
            return null;
         }

         if ( match[3] ) {
            match[2] = match[3];
         } else if ( (unquoted = match[4]) ) {
            // Only check arguments that contain a pseudo
            if ( rpseudo.test(unquoted) &&
               // Get excess from tokenize (recursively)
               (excess = tokenize( unquoted, true )) &&
               // advance to the next closing parenthesis
               (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

               // excess is a negative index
               unquoted = unquoted.slice( 0, excess );
               match[0] = match[0].slice( 0, excess );
            }
            match[2] = unquoted;
         }

         // Return only captures needed by the pseudo filter method (type and argument)
         return match.slice( 0, 3 );
      }
   },

   filter: {
      "ID": assertGetIdNotName ?
         function( id ) {
            id = id.replace( rbackslash, "" );
            return function( elem ) {
               return elem.getAttribute("id") === id;
            };
         } :
         function( id ) {
            id = id.replace( rbackslash, "" );
            return function( elem ) {
               var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
               return node && node.value === id;
            };
         },

      "TAG": function( nodeName ) {
         if ( nodeName === "*" ) {
            return function() { return true; };
         }
         nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

         return function( elem ) {
            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
         };
      },

      "CLASS": function( className ) {
         var pattern = classCache[ expando ][ className ];
         if ( !pattern ) {
            pattern = classCache( className, new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)") );
         }
         return function( elem ) {
            return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
         };
      },

      "ATTR": function( name, operator, check ) {
         return function( elem, context ) {
            var result = Sizzle.attr( elem, name );

            if ( result == null ) {
               return operator === "!=";
            }
            if ( !operator ) {
               return true;
            }

            result += "";

            return operator === "=" ? result === check :
               operator === "!=" ? result !== check :
               operator === "^=" ? check && result.indexOf( check ) === 0 :
               operator === "*=" ? check && result.indexOf( check ) > -1 :
               operator === "$=" ? check && result.substr( result.length - check.length ) === check :
               operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
               operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
               false;
         };
      },

      "CHILD": function( type, argument, first, last ) {

         if ( type === "nth" ) {
            return function( elem ) {
               var node, diff,
                  parent = elem.parentNode;

               if ( first === 1 && last === 0 ) {
                  return true;
               }

               if ( parent ) {
                  diff = 0;
                  for ( node = parent.firstChild; node; node = node.nextSibling ) {
                     if ( node.nodeType === 1 ) {
                        diff++;
                        if ( elem === node ) {
                           break;
                        }
                     }
                  }
               }

               // Incorporate the offset (or cast to NaN), then check against cycle size
               diff -= last;
               return diff === first || ( diff % first === 0 && diff / first >= 0 );
            };
         }

         return function( elem ) {
            var node = elem;

            switch ( type ) {
               case "only":
               case "first":
                  while ( (node = node.previousSibling) ) {
                     if ( node.nodeType === 1 ) {
                        return false;
                     }
                  }

                  if ( type === "first" ) {
                     return true;
                  }

                  node = elem;

                  /* falls through */
               case "last":
                  while ( (node = node.nextSibling) ) {
                     if ( node.nodeType === 1 ) {
                        return false;
                     }
                  }

                  return true;
            }
         };
      },

      "PSEUDO": function( pseudo, argument ) {
         // pseudo-class names are case-insensitive
         // http://www.w3.org/TR/selectors/#pseudo-classes
         // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
         // Remember that setFilters inherits from pseudos
         var args,
            fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
               Sizzle.error( "unsupported pseudo: " + pseudo );

         // The user may use createPseudo to indicate that
         // arguments are needed to create the filter function
         // just as Sizzle does
         if ( fn[ expando ] ) {
            return fn( argument );
         }

         // But maintain support for old signatures
         if ( fn.length > 1 ) {
            args = [ pseudo, pseudo, "", argument ];
            return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
               markFunction(function( seed, matches ) {
                  var idx,
                     matched = fn( seed, argument ),
                     i = matched.length;
                  while ( i-- ) {
                     idx = indexOf.call( seed, matched[i] );
                     seed[ idx ] = !( matches[ idx ] = matched[i] );
                  }
               }) :
               function( elem ) {
                  return fn( elem, 0, args );
               };
         }

         return fn;
      }
   },

   pseudos: {
      "not": markFunction(function( selector ) {
         // Trim the selector passed to compile
         // to avoid treating leading and trailing
         // spaces as combinators
         var input = [],
            results = [],
            matcher = compile( selector.replace( rtrim, "$1" ) );

         return matcher[ expando ] ?
            markFunction(function( seed, matches, context, xml ) {
               var elem,
                  unmatched = matcher( seed, null, xml, [] ),
                  i = seed.length;

               // Match elements unmatched by `matcher`
               while ( i-- ) {
                  if ( (elem = unmatched[i]) ) {
                     seed[i] = !(matches[i] = elem);
                  }
               }
            }) :
            function( elem, context, xml ) {
               input[0] = elem;
               matcher( input, null, xml, results );
               return !results.pop();
            };
      }),

      "has": markFunction(function( selector ) {
         return function( elem ) {
            return Sizzle( selector, elem ).length > 0;
         };
      }),

      "contains": markFunction(function( text ) {
         return function( elem ) {
            return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
         };
      }),

      "enabled": function( elem ) {
         return elem.disabled === false;
      },

      "disabled": function( elem ) {
         return elem.disabled === true;
      },

      "checked": function( elem ) {
         // In CSS3, :checked should return both checked and selected elements
         // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
         var nodeName = elem.nodeName.toLowerCase();
         return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
      },

      "selected": function( elem ) {
         // Accessing this property makes selected-by-default
         // options in Safari work properly
         if ( elem.parentNode ) {
            elem.parentNode.selectedIndex;
         }

         return elem.selected === true;
      },

      "parent": function( elem ) {
         return !Expr.pseudos["empty"]( elem );
      },

      "empty": function( elem ) {
         // http://www.w3.org/TR/selectors/#empty-pseudo
         // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
         //   not comment, processing instructions, or others
         // Thanks to Diego Perini for the nodeName shortcut
         //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
         var nodeType;
         elem = elem.firstChild;
         while ( elem ) {
            if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
               return false;
            }
            elem = elem.nextSibling;
         }
         return true;
      },

      "header": function( elem ) {
         return rheader.test( elem.nodeName );
      },

      "text": function( elem ) {
         var type, attr;
         // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
         // use getAttribute instead to test this case
         return elem.nodeName.toLowerCase() === "input" &&
            (type = elem.type) === "text" &&
            ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
      },

      // Input types
      "radio": createInputPseudo("radio"),
      "checkbox": createInputPseudo("checkbox"),
      "file": createInputPseudo("file"),
      "password": createInputPseudo("password"),
      "image": createInputPseudo("image"),

      "submit": createButtonPseudo("submit"),
      "reset": createButtonPseudo("reset"),

      "button": function( elem ) {
         var name = elem.nodeName.toLowerCase();
         return name === "input" && elem.type === "button" || name === "button";
      },

      "input": function( elem ) {
         return rinputs.test( elem.nodeName );
      },

      "focus": function( elem ) {
         var doc = elem.ownerDocument;
         return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
      },

      "active": function( elem ) {
         return elem === elem.ownerDocument.activeElement;
      },

      // Positional types
      "first": createPositionalPseudo(function( matchIndexes, length, argument ) {
         return [ 0 ];
      }),

      "last": createPositionalPseudo(function( matchIndexes, length, argument ) {
         return [ length - 1 ];
      }),

      "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
         return [ argument < 0 ? argument + length : argument ];
      }),

      "even": createPositionalPseudo(function( matchIndexes, length, argument ) {
         for ( var i = 0; i < length; i += 2 ) {
            matchIndexes.push( i );
         }
         return matchIndexes;
      }),

      "odd": createPositionalPseudo(function( matchIndexes, length, argument ) {
         for ( var i = 1; i < length; i += 2 ) {
            matchIndexes.push( i );
         }
         return matchIndexes;
      }),

      "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
         for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
            matchIndexes.push( i );
         }
         return matchIndexes;
      }),

      "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
         for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
            matchIndexes.push( i );
         }
         return matchIndexes;
      })
   }
};

function siblingCheck( a, b, ret ) {
   if ( a === b ) {
      return ret;
   }

   var cur = a.nextSibling;

   while ( cur ) {
      if ( cur === b ) {
         return -1;
      }

      cur = cur.nextSibling;
   }

   return 1;
}

sortOrder = docElem.compareDocumentPosition ?
   function( a, b ) {
      if ( a === b ) {
         hasDuplicate = true;
         return 0;
      }

      return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
         a.compareDocumentPosition :
         a.compareDocumentPosition(b) & 4
      ) ? -1 : 1;
   } :
   function( a, b ) {
      // The nodes are identical, we can exit early
      if ( a === b ) {
         hasDuplicate = true;
         return 0;

      // Fallback to using sourceIndex (in IE) if it's available on both nodes
      } else if ( a.sourceIndex && b.sourceIndex ) {
         return a.sourceIndex - b.sourceIndex;
      }

      var al, bl,
         ap = [],
         bp = [],
         aup = a.parentNode,
         bup = b.parentNode,
         cur = aup;

      // If the nodes are siblings (or identical) we can do a quick check
      if ( aup === bup ) {
         return siblingCheck( a, b );

      // If no parents were found then the nodes are disconnected
      } else if ( !aup ) {
         return -1;

      } else if ( !bup ) {
         return 1;
      }

      // Otherwise they're somewhere else in the tree so we need
      // to build up a full list of the parentNodes for comparison
      while ( cur ) {
         ap.unshift( cur );
         cur = cur.parentNode;
      }

      cur = bup;

      while ( cur ) {
         bp.unshift( cur );
         cur = cur.parentNode;
      }

      al = ap.length;
      bl = bp.length;

      // Start walking down the tree looking for a discrepancy
      for ( var i = 0; i < al && i < bl; i++ ) {
         if ( ap[i] !== bp[i] ) {
            return siblingCheck( ap[i], bp[i] );
         }
      }

      // We ended someplace up the tree so do a sibling check
      return i === al ?
         siblingCheck( a, bp[i], -1 ) :
         siblingCheck( ap[i], b, 1 );
   };

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
   var elem,
      i = 1;

   hasDuplicate = baseHasDuplicate;
   results.sort( sortOrder );

   if ( hasDuplicate ) {
      for ( ; (elem = results[i]); i++ ) {
         if ( elem === results[ i - 1 ] ) {
            results.splice( i--, 1 );
         }
      }
   }

   return results;
};

Sizzle.error = function( msg ) {
   throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
   var matched, match, tokens, type, soFar, groups, preFilters,
      cached = tokenCache[ expando ][ selector ];

   if ( cached ) {
      return parseOnly ? 0 : cached.slice( 0 );
   }

   soFar = selector;
   groups = [];
   preFilters = Expr.preFilter;

   while ( soFar ) {

      // Comma and first run
      if ( !matched || (match = rcomma.exec( soFar )) ) {
         if ( match ) {
            soFar = soFar.slice( match[0].length );
         }
         groups.push( tokens = [] );
      }

      matched = false;

      // Combinators
      if ( (match = rcombinators.exec( soFar )) ) {
         tokens.push( matched = new Token( match.shift() ) );
         soFar = soFar.slice( matched.length );

         // Cast descendant combinators to space
         matched.type = match[0].replace( rtrim, " " );
      }

      // Filters
      for ( type in Expr.filter ) {
         if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
            // The last two arguments here are (context, xml) for backCompat
            (match = preFilters[ type ]( match, document, true ))) ) {

            tokens.push( matched = new Token( match.shift() ) );
            soFar = soFar.slice( matched.length );
            matched.type = type;
            matched.matches = match;
         }
      }

      if ( !matched ) {
         break;
      }
   }

   // Return the length of the invalid excess
   // if we're just parsing
   // Otherwise, throw an error or return tokens
   return parseOnly ?
      soFar.length :
      soFar ?
         Sizzle.error( selector ) :
         // Cache the tokens
         tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
   var dir = combinator.dir,
      checkNonElements = base && combinator.dir === "parentNode",
      doneName = done++;

   return combinator.first ?
      // Check against closest ancestor/preceding element
      function( elem, context, xml ) {
         while ( (elem = elem[ dir ]) ) {
            if ( checkNonElements || elem.nodeType === 1  ) {
               return matcher( elem, context, xml );
            }
         }
      } :

      // Check against all ancestor/preceding elements
      function( elem, context, xml ) {
         // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
         if ( !xml ) {
            var cache,
               dirkey = dirruns + " " + doneName + " ",
               cachedkey = dirkey + cachedruns;
            while ( (elem = elem[ dir ]) ) {
               if ( checkNonElements || elem.nodeType === 1 ) {
                  if ( (cache = elem[ expando ]) === cachedkey ) {
                     return elem.sizset;
                  } else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
                     if ( elem.sizset ) {
                        return elem;
                     }
                  } else {
                     elem[ expando ] = cachedkey;
                     if ( matcher( elem, context, xml ) ) {
                        elem.sizset = true;
                        return elem;
                     }
                     elem.sizset = false;
                  }
               }
            }
         } else {
            while ( (elem = elem[ dir ]) ) {
               if ( checkNonElements || elem.nodeType === 1 ) {
                  if ( matcher( elem, context, xml ) ) {
                     return elem;
                  }
               }
            }
         }
      };
}

function elementMatcher( matchers ) {
   return matchers.length > 1 ?
      function( elem, context, xml ) {
         var i = matchers.length;
         while ( i-- ) {
            if ( !matchers[i]( elem, context, xml ) ) {
               return false;
            }
         }
         return true;
      } :
      matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
   var elem,
      newUnmatched = [],
      i = 0,
      len = unmatched.length,
      mapped = map != null;

   for ( ; i < len; i++ ) {
      if ( (elem = unmatched[i]) ) {
         if ( !filter || filter( elem, context, xml ) ) {
            newUnmatched.push( elem );
            if ( mapped ) {
               map.push( i );
            }
         }
      }
   }

   return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
   if ( postFilter && !postFilter[ expando ] ) {
      postFilter = setMatcher( postFilter );
   }
   if ( postFinder && !postFinder[ expando ] ) {
      postFinder = setMatcher( postFinder, postSelector );
   }
   return markFunction(function( seed, results, context, xml ) {
      // Positional selectors apply to seed elements, so it is invalid to follow them with relative ones
      if ( seed && postFinder ) {
         return;
      }

      var i, elem, postFilterIn,
         preMap = [],
         postMap = [],
         preexisting = results.length,

         // Get initial elements from seed or context
         elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [], seed ),

         // Prefilter to get matcher input, preserving a map for seed-results synchronization
         matcherIn = preFilter && ( seed || !selector ) ?
            condense( elems, preMap, preFilter, context, xml ) :
            elems,

         matcherOut = matcher ?
            // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
            postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

               // ...intermediate processing is necessary
               [] :

               // ...otherwise use results directly
               results :
            matcherIn;

      // Find primary matches
      if ( matcher ) {
         matcher( matcherIn, matcherOut, context, xml );
      }

      // Apply postFilter
      if ( postFilter ) {
         postFilterIn = condense( matcherOut, postMap );
         postFilter( postFilterIn, [], context, xml );

         // Un-match failing elements by moving them back to matcherIn
         i = postFilterIn.length;
         while ( i-- ) {
            if ( (elem = postFilterIn[i]) ) {
               matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
            }
         }
      }

      // Keep seed and results synchronized
      if ( seed ) {
         // Ignore postFinder because it can't coexist with seed
         i = preFilter && matcherOut.length;
         while ( i-- ) {
            if ( (elem = matcherOut[i]) ) {
               seed[ preMap[i] ] = !(results[ preMap[i] ] = elem);
            }
         }
      } else {
         matcherOut = condense(
            matcherOut === results ?
               matcherOut.splice( preexisting, matcherOut.length ) :
               matcherOut
         );
         if ( postFinder ) {
            postFinder( null, results, matcherOut, xml );
         } else {
            push.apply( results, matcherOut );
         }
      }
   });
}

function matcherFromTokens( tokens ) {
   var checkContext, matcher, j,
      len = tokens.length,
      leadingRelative = Expr.relative[ tokens[0].type ],
      implicitRelative = leadingRelative || Expr.relative[" "],
      i = leadingRelative ? 1 : 0,

      // The foundational matcher ensures that elements are reachable from top-level context(s)
      matchContext = addCombinator( function( elem ) {
         return elem === checkContext;
      }, implicitRelative, true ),
      matchAnyContext = addCombinator( function( elem ) {
         return indexOf.call( checkContext, elem ) > -1;
      }, implicitRelative, true ),
      matchers = [ function( elem, context, xml ) {
         return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
            (checkContext = context).nodeType ?
               matchContext( elem, context, xml ) :
               matchAnyContext( elem, context, xml ) );
      } ];

   for ( ; i < len; i++ ) {
      if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
         matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
      } else {
         // The concatenated values are (context, xml) for backCompat
         matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

         // Return special upon seeing a positional matcher
         if ( matcher[ expando ] ) {
            // Find the next relative operator (if any) for proper handling
            j = ++i;
            for ( ; j < len; j++ ) {
               if ( Expr.relative[ tokens[j].type ] ) {
                  break;
               }
            }
            return setMatcher(
               i > 1 && elementMatcher( matchers ),
               i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
               matcher,
               i < j && matcherFromTokens( tokens.slice( i, j ) ),
               j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
               j < len && tokens.join("")
            );
         }
         matchers.push( matcher );
      }
   }

   return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
   var bySet = setMatchers.length > 0,
      byElement = elementMatchers.length > 0,
      superMatcher = function( seed, context, xml, results, expandContext ) {
         var elem, j, matcher,
            setMatched = [],
            matchedCount = 0,
            i = "0",
            unmatched = seed && [],
            outermost = expandContext != null,
            contextBackup = outermostContext,
            // We must always have either seed elements or context
            elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
            // Nested matchers should use non-integer dirruns
            dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

         if ( outermost ) {
            outermostContext = context !== document && context;
            cachedruns = superMatcher.el;
         }

         // Add elements passing elementMatchers directly to results
         for ( ; (elem = elems[i]) != null; i++ ) {
            if ( byElement && elem ) {
               for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
                  if ( matcher( elem, context, xml ) ) {
                     results.push( elem );
                     break;
                  }
               }
               if ( outermost ) {
                  dirruns = dirrunsUnique;
                  cachedruns = ++superMatcher.el;
               }
            }

            // Track unmatched elements for set filters
            if ( bySet ) {
               // They will have gone through all possible matchers
               if ( (elem = !matcher && elem) ) {
                  matchedCount--;
               }

               // Lengthen the array for every element, matched or not
               if ( seed ) {
                  unmatched.push( elem );
               }
            }
         }

         // Apply set filters to unmatched elements
         matchedCount += i;
         if ( bySet && i !== matchedCount ) {
            for ( j = 0; (matcher = setMatchers[j]); j++ ) {
               matcher( unmatched, setMatched, context, xml );
            }

            if ( seed ) {
               // Reintegrate element matches to eliminate the need for sorting
               if ( matchedCount > 0 ) {
                  while ( i-- ) {
                     if ( !(unmatched[i] || setMatched[i]) ) {
                        setMatched[i] = pop.call( results );
                     }
                  }
               }

               // Discard index placeholder values to get only actual matches
               setMatched = condense( setMatched );
            }

            // Add matches to results
            push.apply( results, setMatched );

            // Seedless set matches succeeding multiple successful matchers stipulate sorting
            if ( outermost && !seed && setMatched.length > 0 &&
               ( matchedCount + setMatchers.length ) > 1 ) {

               Sizzle.uniqueSort( results );
            }
         }

         // Override manipulation of globals by nested matchers
         if ( outermost ) {
            dirruns = dirrunsUnique;
            outermostContext = contextBackup;
         }

         return unmatched;
      };

   superMatcher.el = 0;
   return bySet ?
      markFunction( superMatcher ) :
      superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
   var i,
      setMatchers = [],
      elementMatchers = [],
      cached = compilerCache[ expando ][ selector ];

   if ( !cached ) {
      // Generate a function of recursive functions that can be used to check each element
      if ( !group ) {
         group = tokenize( selector );
      }
      i = group.length;
      while ( i-- ) {
         cached = matcherFromTokens( group[i] );
         if ( cached[ expando ] ) {
            setMatchers.push( cached );
         } else {
            elementMatchers.push( cached );
         }
      }

      // Cache the compiled function
      cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
   }
   return cached;
};

function multipleContexts( selector, contexts, results, seed ) {
   var i = 0,
      len = contexts.length;
   for ( ; i < len; i++ ) {
      Sizzle( selector, contexts[i], results, seed );
   }
   return results;
}

function select( selector, context, results, seed, xml ) {
   var i, tokens, token, type, find,
      match = tokenize( selector ),
      j = match.length;

   if ( !seed ) {
      // Try to minimize operations if there is only one group
      if ( match.length === 1 ) {

         // Take a shortcut and set the context if the root selector is an ID
         tokens = match[0] = match[0].slice( 0 );
         if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
               context.nodeType === 9 && !xml &&
               Expr.relative[ tokens[1].type ] ) {

            context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
            if ( !context ) {
               return results;
            }

            selector = selector.slice( tokens.shift().length );
         }

         // Fetch a seed set for right-to-left matching
         for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
            token = tokens[i];

            // Abort if we hit a combinator
            if ( Expr.relative[ (type = token.type) ] ) {
               break;
            }
            if ( (find = Expr.find[ type ]) ) {
               // Search, expanding context for leading sibling combinators
               if ( (seed = find(
                  token.matches[0].replace( rbackslash, "" ),
                  rsibling.test( tokens[0].type ) && context.parentNode || context,
                  xml
               )) ) {

                  // If seed is empty or no tokens remain, we can return early
                  tokens.splice( i, 1 );
                  selector = seed.length && tokens.join("");
                  if ( !selector ) {
                     push.apply( results, slice.call( seed, 0 ) );
                     return results;
                  }

                  break;
               }
            }
         }
      }
   }

   // Compile and execute a filtering function
   // Provide `match` to avoid retokenization if we modified the selector above
   compile( selector, match )(
      seed,
      context,
      xml,
      results,
      rsibling.test( selector )
   );
   return results;
}

if ( document.querySelectorAll ) {
   (function() {
      var disconnectedMatch,
         oldSelect = select,
         rescape = /'|\\/g,
         rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

         // qSa(:focus) reports false when true (Chrome 21),
         // A support test would require too much code (would include document ready)
         rbuggyQSA = [":focus"],

         // matchesSelector(:focus) reports false when true (Chrome 21),
         // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
         // A support test would require too much code (would include document ready)
         // just skip matchesSelector for :active
         rbuggyMatches = [ ":active", ":focus" ],
         matches = docElem.matchesSelector ||
            docElem.mozMatchesSelector ||
            docElem.webkitMatchesSelector ||
            docElem.oMatchesSelector ||
            docElem.msMatchesSelector;

      // Build QSA regex
      // Regex strategy adopted from Diego Perini
      assert(function( div ) {
         // Select is set to empty string on purpose
         // This is to test IE's treatment of not explictly
         // setting a boolean content attribute,
         // since its presence should be enough
         // http://bugs.jquery.com/ticket/12359
         div.innerHTML = "<select><option selected=''></option></select>";

         // IE8 - Some boolean attributes are not treated correctly
         if ( !div.querySelectorAll("[selected]").length ) {
            rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
         }

         // Webkit/Opera - :checked should return selected option elements
         // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
         // IE8 throws error here (do not put tests after this one)
         if ( !div.querySelectorAll(":checked").length ) {
            rbuggyQSA.push(":checked");
         }
      });

      assert(function( div ) {

         // Opera 10-12/IE9 - ^= $= *= and empty values
         // Should not select anything
         div.innerHTML = "<p test=''></p>";
         if ( div.querySelectorAll("[test^='']").length ) {
            rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
         }

         // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
         // IE8 throws error here (do not put tests after this one)
         div.innerHTML = "<input type='hidden'/>";
         if ( !div.querySelectorAll(":enabled").length ) {
            rbuggyQSA.push(":enabled", ":disabled");
         }
      });

      // rbuggyQSA always contains :focus, so no need for a length check
      rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

      select = function( selector, context, results, seed, xml ) {
         // Only use querySelectorAll when not filtering,
         // when this is not xml,
         // and when no QSA bugs apply
         if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
            var groups, i,
               old = true,
               nid = expando,
               newContext = context,
               newSelector = context.nodeType === 9 && selector;

            // qSA works strangely on Element-rooted queries
            // We can work around this by specifying an extra ID on the root
            // and working up from there (Thanks to Andrew Dupont for the technique)
            // IE 8 doesn't work on object elements
            if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
               groups = tokenize( selector );

               if ( (old = context.getAttribute("id")) ) {
                  nid = old.replace( rescape, "\\$&" );
               } else {
                  context.setAttribute( "id", nid );
               }
               nid = "[id='" + nid + "'] ";

               i = groups.length;
               while ( i-- ) {
                  groups[i] = nid + groups[i].join("");
               }
               newContext = rsibling.test( selector ) && context.parentNode || context;
               newSelector = groups.join(",");
            }

            if ( newSelector ) {
               try {
                  push.apply( results, slice.call( newContext.querySelectorAll(
                     newSelector
                  ), 0 ) );
                  return results;
               } catch(qsaError) {
               } finally {
                  if ( !old ) {
                     context.removeAttribute("id");
                  }
               }
            }
         }

         return oldSelect( selector, context, results, seed, xml );
      };

      if ( matches ) {
         assert(function( div ) {
            // Check to see if it's possible to do matchesSelector
            // on a disconnected node (IE 9)
            disconnectedMatch = matches.call( div, "div" );

            // This should fail with an exception
            // Gecko does not error, returns false instead
            try {
               matches.call( div, "[test!='']:sizzle" );
               rbuggyMatches.push( "!=", pseudos );
            } catch ( e ) {}
         });

         // rbuggyMatches always contains :active and :focus, so no need for a length check
         rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

         Sizzle.matchesSelector = function( elem, expr ) {
            // Make sure that attribute selectors are quoted
            expr = expr.replace( rattributeQuotes, "='$1']" );

            // rbuggyMatches always contains :active, so no need for an existence check
            if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
               try {
                  var ret = matches.call( elem, expr );

                  // IE 9's matchesSelector returns false on disconnected nodes
                  if ( ret || disconnectedMatch ||
                        // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                        elem.document && elem.document.nodeType !== 11 ) {
                     return ret;
                  }
               } catch(e) {}
            }

            return Sizzle( expr, null, null, [ elem ] ).length > 0;
         };
      }
   })();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
   rparentsprev = /^(?:parents|prev(?:Until|All))/,
   isSimple = /^.[^:#\[\.,]*$/,
   rneedsContext = jQuery.expr.match.needsContext,
   // methods guaranteed to produce a unique set when starting from a unique set
   guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true
   };

jQuery.fn.extend({
   find: function( selector ) {
      var i, l, length, n, r, ret,
         self = this;

      if ( typeof selector !== "string" ) {
         return jQuery( selector ).filter(function() {
            for ( i = 0, l = self.length; i < l; i++ ) {
               if ( jQuery.contains( self[ i ], this ) ) {
                  return true;
               }
            }
         });
      }

      ret = this.pushStack( "", "find", selector );

      for ( i = 0, l = this.length; i < l; i++ ) {
         length = ret.length;
         jQuery.find( selector, this[i], ret );

         if ( i > 0 ) {
            // Make sure that the results are unique
            for ( n = length; n < ret.length; n++ ) {
               for ( r = 0; r < length; r++ ) {
                  if ( ret[r] === ret[n] ) {
                     ret.splice(n--, 1);
                     break;
                  }
               }
            }
         }
      }

      return ret;
   },

   has: function( target ) {
      var i,
         targets = jQuery( target, this ),
         len = targets.length;

      return this.filter(function() {
         for ( i = 0; i < len; i++ ) {
            if ( jQuery.contains( this, targets[i] ) ) {
               return true;
            }
         }
      });
   },

   not: function( selector ) {
      return this.pushStack( winnow(this, selector, false), "not", selector);
   },

   filter: function( selector ) {
      return this.pushStack( winnow(this, selector, true), "filter", selector );
   },

   is: function( selector ) {
      return !!selector && (
         typeof selector === "string" ?
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            rneedsContext.test( selector ) ?
               jQuery( selector, this.context ).index( this[0] ) >= 0 :
               jQuery.filter( selector, this ).length > 0 :
            this.filter( selector ).length > 0 );
   },

   closest: function( selectors, context ) {
      var cur,
         i = 0,
         l = this.length,
         ret = [],
         pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
            jQuery( selectors, context || this.context ) :
            0;

      for ( ; i < l; i++ ) {
         cur = this[i];

         while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
            if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
               ret.push( cur );
               break;
            }
            cur = cur.parentNode;
         }
      }

      ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

      return this.pushStack( ret, "closest", selectors );
   },

   // Determine the position of an element within
   // the matched set of elements
   index: function( elem ) {

      // No argument, return index in parent
      if ( !elem ) {
         return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
      }

      // index in selector
      if ( typeof elem === "string" ) {
         return jQuery.inArray( this[0], jQuery( elem ) );
      }

      // Locate the position of the desired element
      return jQuery.inArray(
         // If it receives a jQuery object, the first element is used
         elem.jquery ? elem[0] : elem, this );
   },

   add: function( selector, context ) {
      var set = typeof selector === "string" ?
            jQuery( selector, context ) :
            jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
         all = jQuery.merge( this.get(), set );

      return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
         all :
         jQuery.unique( all ) );
   },

   addBack: function( selector ) {
      return this.add( selector == null ?
         this.prevObject : this.prevObject.filter(selector)
      );
   }
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
   return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
   do {
      cur = cur[ dir ];
   } while ( cur && cur.nodeType !== 1 );

   return cur;
}

jQuery.each({
   parent: function( elem ) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
   },
   parents: function( elem ) {
      return jQuery.dir( elem, "parentNode" );
   },
   parentsUntil: function( elem, i, until ) {
      return jQuery.dir( elem, "parentNode", until );
   },
   next: function( elem ) {
      return sibling( elem, "nextSibling" );
   },
   prev: function( elem ) {
      return sibling( elem, "previousSibling" );
   },
   nextAll: function( elem ) {
      return jQuery.dir( elem, "nextSibling" );
   },
   prevAll: function( elem ) {
      return jQuery.dir( elem, "previousSibling" );
   },
   nextUntil: function( elem, i, until ) {
      return jQuery.dir( elem, "nextSibling", until );
   },
   prevUntil: function( elem, i, until ) {
      return jQuery.dir( elem, "previousSibling", until );
   },
   siblings: function( elem ) {
      return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
   },
   children: function( elem ) {
      return jQuery.sibling( elem.firstChild );
   },
   contents: function( elem ) {
      return jQuery.nodeName( elem, "iframe" ) ?
         elem.contentDocument || elem.contentWindow.document :
         jQuery.merge( [], elem.childNodes );
   }
}, function( name, fn ) {
   jQuery.fn[ name ] = function( until, selector ) {
      var ret = jQuery.map( this, fn, until );

      if ( !runtil.test( name ) ) {
         selector = until;
      }

      if ( selector && typeof selector === "string" ) {
         ret = jQuery.filter( selector, ret );
      }

      ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

      if ( this.length > 1 && rparentsprev.test( name ) ) {
         ret = ret.reverse();
      }

      return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
   };
});

jQuery.extend({
   filter: function( expr, elems, not ) {
      if ( not ) {
         expr = ":not(" + expr + ")";
      }

      return elems.length === 1 ?
         jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
         jQuery.find.matches(expr, elems);
   },

   dir: function( elem, dir, until ) {
      var matched = [],
         cur = elem[ dir ];

      while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
         if ( cur.nodeType === 1 ) {
            matched.push( cur );
         }
         cur = cur[dir];
      }
      return matched;
   },

   sibling: function( n, elem ) {
      var r = [];

      for ( ; n; n = n.nextSibling ) {
         if ( n.nodeType === 1 && n !== elem ) {
            r.push( n );
         }
      }

      return r;
   }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

   // Can't pass null or undefined to indexOf in Firefox 4
   // Set to 0 to skip string check
   qualifier = qualifier || 0;

   if ( jQuery.isFunction( qualifier ) ) {
      return jQuery.grep(elements, function( elem, i ) {
         var retVal = !!qualifier.call( elem, i, elem );
         return retVal === keep;
      });

   } else if ( qualifier.nodeType ) {
      return jQuery.grep(elements, function( elem, i ) {
         return ( elem === qualifier ) === keep;
      });

   } else if ( typeof qualifier === "string" ) {
      var filtered = jQuery.grep(elements, function( elem ) {
         return elem.nodeType === 1;
      });

      if ( isSimple.test( qualifier ) ) {
         return jQuery.filter(qualifier, filtered, !keep);
      } else {
         qualifier = jQuery.filter( qualifier, filtered );
      }
   }

   return jQuery.grep(elements, function( elem, i ) {
      return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
   });
}
function createSafeFragment( document ) {
   var list = nodeNames.split( "|" ),
   safeFrag = document.createDocumentFragment();

   if ( safeFrag.createElement ) {
      while ( list.length ) {
         safeFrag.createElement(
            list.pop()
         );
      }
   }
   return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
      "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
   rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
   rleadingWhitespace = /^\s+/,
   rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
   rtagName = /<([\w:]+)/,
   rtbody = /<tbody/i,
   rhtml = /<|&#?\w+;/,
   rnoInnerhtml = /<(?:script|style|link)/i,
   rnocache = /<(?:script|object|embed|option|style)/i,
   rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
   rcheckableType = /^(?:checkbox|radio)$/,
   // checked="checked" or checked
   rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
   rscriptType = /\/(java|ecma)script/i,
   rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
   wrapMap = {
      option: [ 1, "<select multiple='multiple'>", "</select>" ],
      legend: [ 1, "<fieldset>", "</fieldset>" ],
      thead: [ 1, "<table>", "</table>" ],
      tr: [ 2, "<table><tbody>", "</tbody></table>" ],
      td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
      col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
      area: [ 1, "<map>", "</map>" ],
      _default: [ 0, "", "" ]
   },
   safeFragment = createSafeFragment( document ),
   fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
   wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
   text: function( value ) {
      return jQuery.access( this, function( value ) {
         return value === undefined ?
            jQuery.text( this ) :
            this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
      }, null, value, arguments.length );
   },

   wrapAll: function( html ) {
      if ( jQuery.isFunction( html ) ) {
         return this.each(function(i) {
            jQuery(this).wrapAll( html.call(this, i) );
         });
      }

      if ( this[0] ) {
         // The elements to wrap the target around
         var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

         if ( this[0].parentNode ) {
            wrap.insertBefore( this[0] );
         }

         wrap.map(function() {
            var elem = this;

            while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
               elem = elem.firstChild;
            }

            return elem;
         }).append( this );
      }

      return this;
   },

   wrapInner: function( html ) {
      if ( jQuery.isFunction( html ) ) {
         return this.each(function(i) {
            jQuery(this).wrapInner( html.call(this, i) );
         });
      }

      return this.each(function() {
         var self = jQuery( this ),
            contents = self.contents();

         if ( contents.length ) {
            contents.wrapAll( html );

         } else {
            self.append( html );
         }
      });
   },

   wrap: function( html ) {
      var isFunction = jQuery.isFunction( html );

      return this.each(function(i) {
         jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
      });
   },

   unwrap: function() {
      return this.parent().each(function() {
         if ( !jQuery.nodeName( this, "body" ) ) {
            jQuery( this ).replaceWith( this.childNodes );
         }
      }).end();
   },

   append: function() {
      return this.domManip(arguments, true, function( elem ) {
         if ( this.nodeType === 1 || this.nodeType === 11 ) {
            this.appendChild( elem );
         }
      });
   },

   prepend: function() {
      return this.domManip(arguments, true, function( elem ) {
         if ( this.nodeType === 1 || this.nodeType === 11 ) {
            this.insertBefore( elem, this.firstChild );
         }
      });
   },

   before: function() {
      if ( !isDisconnected( this[0] ) ) {
         return this.domManip(arguments, false, function( elem ) {
            this.parentNode.insertBefore( elem, this );
         });
      }

      if ( arguments.length ) {
         var set = jQuery.clean( arguments );
         return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
      }
   },

   after: function() {
      if ( !isDisconnected( this[0] ) ) {
         return this.domManip(arguments, false, function( elem ) {
            this.parentNode.insertBefore( elem, this.nextSibling );
         });
      }

      if ( arguments.length ) {
         var set = jQuery.clean( arguments );
         return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
      }
   },

   // keepData is for internal use only--do not document
   remove: function( selector, keepData ) {
      var elem,
         i = 0;

      for ( ; (elem = this[i]) != null; i++ ) {
         if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
            if ( !keepData && elem.nodeType === 1 ) {
               jQuery.cleanData( elem.getElementsByTagName("*") );
               jQuery.cleanData( [ elem ] );
            }

            if ( elem.parentNode ) {
               elem.parentNode.removeChild( elem );
            }
         }
      }

      return this;
   },

   empty: function() {
      var elem,
         i = 0;

      for ( ; (elem = this[i]) != null; i++ ) {
         // Remove element nodes and prevent memory leaks
         if ( elem.nodeType === 1 ) {
            jQuery.cleanData( elem.getElementsByTagName("*") );
         }

         // Remove any remaining nodes
         while ( elem.firstChild ) {
            elem.removeChild( elem.firstChild );
         }
      }

      return this;
   },

   clone: function( dataAndEvents, deepDataAndEvents ) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

      return this.map( function () {
         return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
      });
   },

   html: function( value ) {
      return jQuery.access( this, function( value ) {
         var elem = this[0] || {},
            i = 0,
            l = this.length;

         if ( value === undefined ) {
            return elem.nodeType === 1 ?
               elem.innerHTML.replace( rinlinejQuery, "" ) :
               undefined;
         }

         // See if we can take a shortcut and just use innerHTML
         if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
            ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
            ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
            !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

            value = value.replace( rxhtmlTag, "<$1></$2>" );

            try {
               for (; i < l; i++ ) {
                  // Remove element nodes and prevent memory leaks
                  elem = this[i] || {};
                  if ( elem.nodeType === 1 ) {
                     jQuery.cleanData( elem.getElementsByTagName( "*" ) );
                     elem.innerHTML = value;
                  }
               }

               elem = 0;

            // If using innerHTML throws an exception, use the fallback method
            } catch(e) {}
         }

         if ( elem ) {
            this.empty().append( value );
         }
      }, null, value, arguments.length );
   },

   replaceWith: function( value ) {
      if ( !isDisconnected( this[0] ) ) {
         // Make sure that the elements are removed from the DOM before they are inserted
         // this can help fix replacing a parent with child elements
         if ( jQuery.isFunction( value ) ) {
            return this.each(function(i) {
               var self = jQuery(this), old = self.html();
               self.replaceWith( value.call( this, i, old ) );
            });
         }

         if ( typeof value !== "string" ) {
            value = jQuery( value ).detach();
         }

         return this.each(function() {
            var next = this.nextSibling,
               parent = this.parentNode;

            jQuery( this ).remove();

            if ( next ) {
               jQuery(next).before( value );
            } else {
               jQuery(parent).append( value );
            }
         });
      }

      return this.length ?
         this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
         this;
   },

   detach: function( selector ) {
      return this.remove( selector, true );
   },

   domManip: function( args, table, callback ) {

      // Flatten any nested arrays
      args = [].concat.apply( [], args );

      var results, first, fragment, iNoClone,
         i = 0,
         value = args[0],
         scripts = [],
         l = this.length;

      // We can't cloneNode fragments that contain checked, in WebKit
      if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
         return this.each(function() {
            jQuery(this).domManip( args, table, callback );
         });
      }

      if ( jQuery.isFunction(value) ) {
         return this.each(function(i) {
            var self = jQuery(this);
            args[0] = value.call( this, i, table ? self.html() : undefined );
            self.domManip( args, table, callback );
         });
      }

      if ( this[0] ) {
         results = jQuery.buildFragment( args, this, scripts );
         fragment = results.fragment;
         first = fragment.firstChild;

         if ( fragment.childNodes.length === 1 ) {
            fragment = first;
         }

         if ( first ) {
            table = table && jQuery.nodeName( first, "tr" );

            // Use the original fragment for the last item instead of the first because it can end up
            // being emptied incorrectly in certain situations (#8070).
            // Fragments from the fragment cache must always be cloned and never used in place.
            for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
               callback.call(
                  table && jQuery.nodeName( this[i], "table" ) ?
                     findOrAppend( this[i], "tbody" ) :
                     this[i],
                  i === iNoClone ?
                     fragment :
                     jQuery.clone( fragment, true, true )
               );
            }
         }

         // Fix #11809: Avoid leaking memory
         fragment = first = null;

         if ( scripts.length ) {
            jQuery.each( scripts, function( i, elem ) {
               if ( elem.src ) {
                  if ( jQuery.ajax ) {
                     jQuery.ajax({
                        url: elem.src,
                        type: "GET",
                        dataType: "script",
                        async: false,
                        global: false,
                        "throws": true
                     });
                  } else {
                     jQuery.error("no ajax");
                  }
               } else {
                  jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
               }

               if ( elem.parentNode ) {
                  elem.parentNode.removeChild( elem );
               }
            });
         }
      }

      return this;
   }
});

function findOrAppend( elem, tag ) {
   return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

   if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
      return;
   }

   var type, i, l,
      oldData = jQuery._data( src ),
      curData = jQuery._data( dest, oldData ),
      events = oldData.events;

   if ( events ) {
      delete curData.handle;
      curData.events = {};

      for ( type in events ) {
         for ( i = 0, l = events[ type ].length; i < l; i++ ) {
            jQuery.event.add( dest, type, events[ type ][ i ] );
         }
      }
   }

   // make the cloned public data object a copy from the original
   if ( curData.data ) {
      curData.data = jQuery.extend( {}, curData.data );
   }
}

function cloneFixAttributes( src, dest ) {
   var nodeName;

   // We do not need to do anything for non-Elements
   if ( dest.nodeType !== 1 ) {
      return;
   }

   // clearAttributes removes the attributes, which we don't want,
   // but also removes the attachEvent events, which we *do* want
   if ( dest.clearAttributes ) {
      dest.clearAttributes();
   }

   // mergeAttributes, in contrast, only merges back on the
   // original attributes, not the events
   if ( dest.mergeAttributes ) {
      dest.mergeAttributes( src );
   }

   nodeName = dest.nodeName.toLowerCase();

   if ( nodeName === "object" ) {
      // IE6-10 improperly clones children of object elements using classid.
      // IE10 throws NoModificationAllowedError if parent is null, #12132.
      if ( dest.parentNode ) {
         dest.outerHTML = src.outerHTML;
      }

      // This path appears unavoidable for IE9. When cloning an object
      // element in IE9, the outerHTML strategy above is not sufficient.
      // If the src has innerHTML and the destination does not,
      // copy the src.innerHTML into the dest.innerHTML. #10324
      if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
         dest.innerHTML = src.innerHTML;
      }

   } else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
      // IE6-8 fails to persist the checked state of a cloned checkbox
      // or radio button. Worse, IE6-7 fail to give the cloned element
      // a checked appearance if the defaultChecked value isn't also set

      dest.defaultChecked = dest.checked = src.checked;

      // IE6-7 get confused and end up setting the value of a cloned
      // checkbox/radio button to an empty string instead of "on"
      if ( dest.value !== src.value ) {
         dest.value = src.value;
      }

   // IE6-8 fails to return the selected option to the default selected
   // state when cloning options
   } else if ( nodeName === "option" ) {
      dest.selected = src.defaultSelected;

   // IE6-8 fails to set the defaultValue to the correct value when
   // cloning other types of input fields
   } else if ( nodeName === "input" || nodeName === "textarea" ) {
      dest.defaultValue = src.defaultValue;

   // IE blanks contents when cloning scripts
   } else if ( nodeName === "script" && dest.text !== src.text ) {
      dest.text = src.text;
   }

   // Event data gets referenced instead of copied if the expando
   // gets copied too
   dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
   var fragment, cacheable, cachehit,
      first = args[ 0 ];

   // Set context from what may come in as undefined or a jQuery collection or a node
   // Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
   // also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
   context = context || document;
   context = !context.nodeType && context[0] || context;
   context = context.ownerDocument || context;

   // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
   // Cloning options loses the selected state, so don't cache them
   // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
   // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
   // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
   if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
      first.charAt(0) === "<" && !rnocache.test( first ) &&
      (jQuery.support.checkClone || !rchecked.test( first )) &&
      (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

      // Mark cacheable and look for a hit
      cacheable = true;
      fragment = jQuery.fragments[ first ];
      cachehit = fragment !== undefined;
   }

   if ( !fragment ) {
      fragment = context.createDocumentFragment();
      jQuery.clean( args, context, fragment, scripts );

      // Update the cache, but only store false
      // unless this is a second parsing of the same content
      if ( cacheable ) {
         jQuery.fragments[ first ] = cachehit && fragment;
      }
   }

   return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
   appendTo: "append",
   prependTo: "prepend",
   insertBefore: "before",
   insertAfter: "after",
   replaceAll: "replaceWith"
}, function( name, original ) {
   jQuery.fn[ name ] = function( selector ) {
      var elems,
         i = 0,
         ret = [],
         insert = jQuery( selector ),
         l = insert.length,
         parent = this.length === 1 && this[0].parentNode;

      if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
         insert[ original ]( this[0] );
         return this;
      } else {
         for ( ; i < l; i++ ) {
            elems = ( i > 0 ? this.clone(true) : this ).get();
            jQuery( insert[i] )[ original ]( elems );
            ret = ret.concat( elems );
         }

         return this.pushStack( ret, name, insert.selector );
      }
   };
});

function getAll( elem ) {
   if ( typeof elem.getElementsByTagName !== "undefined" ) {
      return elem.getElementsByTagName( "*" );

   } else if ( typeof elem.querySelectorAll !== "undefined" ) {
      return elem.querySelectorAll( "*" );

   } else {
      return [];
   }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
   if ( rcheckableType.test( elem.type ) ) {
      elem.defaultChecked = elem.checked;
   }
}

jQuery.extend({
   clone: function( elem, dataAndEvents, deepDataAndEvents ) {
      var srcElements,
         destElements,
         i,
         clone;

      if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
         clone = elem.cloneNode( true );

      // IE<=8 does not properly clone detached, unknown element nodes
      } else {
         fragmentDiv.innerHTML = elem.outerHTML;
         fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
      }

      if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
            (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
         // IE copies events bound via attachEvent when using cloneNode.
         // Calling detachEvent on the clone will also remove the events
         // from the original. In order to get around this, we use some
         // proprietary methods to clear the events. Thanks to MooTools
         // guys for this hotness.

         cloneFixAttributes( elem, clone );

         // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
         srcElements = getAll( elem );
         destElements = getAll( clone );

         // Weird iteration because IE will replace the length property
         // with an element if you are cloning the body and one of the
         // elements on the page has a name or id of "length"
         for ( i = 0; srcElements[i]; ++i ) {
            // Ensure that the destination node is not null; Fixes #9587
            if ( destElements[i] ) {
               cloneFixAttributes( srcElements[i], destElements[i] );
            }
         }
      }

      // Copy the events from the original to the clone
      if ( dataAndEvents ) {
         cloneCopyEvent( elem, clone );

         if ( deepDataAndEvents ) {
            srcElements = getAll( elem );
            destElements = getAll( clone );

            for ( i = 0; srcElements[i]; ++i ) {
               cloneCopyEvent( srcElements[i], destElements[i] );
            }
         }
      }

      srcElements = destElements = null;

      // Return the cloned set
      return clone;
   },

   clean: function( elems, context, fragment, scripts ) {
      var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
         safe = context === document && safeFragment,
         ret = [];

      // Ensure that context is a document
      if ( !context || typeof context.createDocumentFragment === "undefined" ) {
         context = document;
      }

      // Use the already-created safe fragment if context permits
      for ( i = 0; (elem = elems[i]) != null; i++ ) {
         if ( typeof elem === "number" ) {
            elem += "";
         }

         if ( !elem ) {
            continue;
         }

         // Convert html string into DOM nodes
         if ( typeof elem === "string" ) {
            if ( !rhtml.test( elem ) ) {
               elem = context.createTextNode( elem );
            } else {
               // Ensure a safe container in which to render the html
               safe = safe || createSafeFragment( context );
               div = context.createElement("div");
               safe.appendChild( div );

               // Fix "XHTML"-style tags in all browsers
               elem = elem.replace(rxhtmlTag, "<$1></$2>");

               // Go to html and back, then peel off extra wrappers
               tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
               wrap = wrapMap[ tag ] || wrapMap._default;
               depth = wrap[0];
               div.innerHTML = wrap[1] + elem + wrap[2];

               // Move to the right depth
               while ( depth-- ) {
                  div = div.lastChild;
               }

               // Remove IE's autoinserted <tbody> from table fragments
               if ( !jQuery.support.tbody ) {

                  // String was a <table>, *may* have spurious <tbody>
                  hasBody = rtbody.test(elem);
                     tbody = tag === "table" && !hasBody ?
                        div.firstChild && div.firstChild.childNodes :

                        // String was a bare <thead> or <tfoot>
                        wrap[1] === "<table>" && !hasBody ?
                           div.childNodes :
                           [];

                  for ( j = tbody.length - 1; j >= 0 ; --j ) {
                     if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                        tbody[ j ].parentNode.removeChild( tbody[ j ] );
                     }
                  }
               }

               // IE completely kills leading whitespace when innerHTML is used
               if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                  div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
               }

               elem = div.childNodes;

               // Take out of fragment container (we need a fresh div each time)
               div.parentNode.removeChild( div );
            }
         }

         if ( elem.nodeType ) {
            ret.push( elem );
         } else {
            jQuery.merge( ret, elem );
         }
      }

      // Fix #11356: Clear elements from safeFragment
      if ( div ) {
         elem = div = safe = null;
      }

      // Reset defaultChecked for any radios and checkboxes
      // about to be appended to the DOM in IE 6/7 (#8060)
      if ( !jQuery.support.appendChecked ) {
         for ( i = 0; (elem = ret[i]) != null; i++ ) {
            if ( jQuery.nodeName( elem, "input" ) ) {
               fixDefaultChecked( elem );
            } else if ( typeof elem.getElementsByTagName !== "undefined" ) {
               jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
            }
         }
      }

      // Append elements to a provided document fragment
      if ( fragment ) {
         // Special handling of each script element
         handleScript = function( elem ) {
            // Check if we consider it executable
            if ( !elem.type || rscriptType.test( elem.type ) ) {
               // Detach the script and store it in the scripts array (if provided) or the fragment
               // Return truthy to indicate that it has been handled
               return scripts ?
                  scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
                  fragment.appendChild( elem );
            }
         };

         for ( i = 0; (elem = ret[i]) != null; i++ ) {
            // Check if we're done after handling an executable script
            if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
               // Append to fragment and handle embedded scripts
               fragment.appendChild( elem );
               if ( typeof elem.getElementsByTagName !== "undefined" ) {
                  // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
                  jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

                  // Splice the scripts into ret after their former ancestor and advance our index beyond them
                  ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                  i += jsTags.length;
               }
            }
         }
      }

      return ret;
   },

   cleanData: function( elems, /* internal */ acceptData ) {
      var data, id, elem, type,
         i = 0,
         internalKey = jQuery.expando,
         cache = jQuery.cache,
         deleteExpando = jQuery.support.deleteExpando,
         special = jQuery.event.special;

      for ( ; (elem = elems[i]) != null; i++ ) {

         if ( acceptData || jQuery.acceptData( elem ) ) {

            id = elem[ internalKey ];
            data = id && cache[ id ];

            if ( data ) {
               if ( data.events ) {
                  for ( type in data.events ) {
                     if ( special[ type ] ) {
                        jQuery.event.remove( elem, type );

                     // This is a shortcut to avoid jQuery.event.remove's overhead
                     } else {
                        jQuery.removeEvent( elem, type, data.handle );
                     }
                  }
               }

               // Remove cache only if it was not already removed by jQuery.event.remove
               if ( cache[ id ] ) {

                  delete cache[ id ];

                  // IE does not allow us to delete expando properties from nodes,
                  // nor does it have a removeAttribute function on Document nodes;
                  // we must handle all of these cases
                  if ( deleteExpando ) {
                     delete elem[ internalKey ];

                  } else if ( elem.removeAttribute ) {
                     elem.removeAttribute( internalKey );

                  } else {
                     elem[ internalKey ] = null;
                  }

                  jQuery.deletedIds.push( id );
               }
            }
         }
      }
   }
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
   ua = ua.toLowerCase();

   var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];

   return {
      browser: match[ 1 ] || "",
      version: match[ 2 ] || "0"
   };
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
   browser[ matched.browser ] = true;
   browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
   browser.webkit = true;
} else if ( browser.webkit ) {
   browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
   function jQuerySub( selector, context ) {
      return new jQuerySub.fn.init( selector, context );
   }
   jQuery.extend( true, jQuerySub, this );
   jQuerySub.superclass = this;
   jQuerySub.fn = jQuerySub.prototype = this();
   jQuerySub.fn.constructor = jQuerySub;
   jQuerySub.sub = this.sub;
   jQuerySub.fn.init = function init( selector, context ) {
      if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
         context = jQuerySub( context );
      }

      return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
   };
   jQuerySub.fn.init.prototype = jQuerySub.fn;
   var rootjQuerySub = jQuerySub(document);
   return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
   ralpha = /alpha\([^)]*\)/i,
   ropacity = /opacity=([^)]*)/,
   rposition = /^(top|right|bottom|left)$/,
   // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
   // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
   rdisplayswap = /^(none|table(?!-c[ea]).+)/,
   rmargin = /^margin/,
   rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
   rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
   rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
   elemdisplay = {},

   cssShow = { position: "absolute", visibility: "hidden", display: "block" },
   cssNormalTransform = {
      letterSpacing: 0,
      fontWeight: 400
   },

   cssExpand = [ "Top", "Right", "Bottom", "Left" ],
   cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

   eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

   // shortcut for names that are not vendor prefixed
   if ( name in style ) {
      return name;
   }

   // check for vendor prefixed names
   var capName = name.charAt(0).toUpperCase() + name.slice(1),
      origName = name,
      i = cssPrefixes.length;

   while ( i-- ) {
      name = cssPrefixes[ i ] + capName;
      if ( name in style ) {
         return name;
      }
   }

   return origName;
}

function isHidden( elem, el ) {
   elem = el || elem;
   return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
   var elem, display,
      values = [],
      index = 0,
      length = elements.length;

   for ( ; index < length; index++ ) {
      elem = elements[ index ];
      if ( !elem.style ) {
         continue;
      }
      values[ index ] = jQuery._data( elem, "olddisplay" );
      if ( show ) {
         // Reset the inline display of this element to learn if it is
         // being hidden by cascaded rules or not
         if ( !values[ index ] && elem.style.display === "none" ) {
            elem.style.display = "";
         }

         // Set elements which have been overridden with display: none
         // in a stylesheet to whatever the default browser style is
         // for such an element
         if ( elem.style.display === "" && isHidden( elem ) ) {
            values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
         }
      } else {
         display = curCSS( elem, "display" );

         if ( !values[ index ] && display !== "none" ) {
            jQuery._data( elem, "olddisplay", display );
         }
      }
   }

   // Set the display of most of the elements in a second loop
   // to avoid the constant reflow
   for ( index = 0; index < length; index++ ) {
      elem = elements[ index ];
      if ( !elem.style ) {
         continue;
      }
      if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
         elem.style.display = show ? values[ index ] || "" : "none";
      }
   }

   return elements;
}

jQuery.fn.extend({
   css: function( name, value ) {
      return jQuery.access( this, function( elem, name, value ) {
         return value !== undefined ?
            jQuery.style( elem, name, value ) :
            jQuery.css( elem, name );
      }, name, value, arguments.length > 1 );
   },
   show: function() {
      return showHide( this, true );
   },
   hide: function() {
      return showHide( this );
   },
   toggle: function( state, fn2 ) {
      var bool = typeof state === "boolean";

      if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
         return eventsToggle.apply( this, arguments );
      }

      return this.each(function() {
         if ( bool ? state : isHidden( this ) ) {
            jQuery( this ).show();
         } else {
            jQuery( this ).hide();
         }
      });
   }
});

jQuery.extend({
   // Add in style property hooks for overriding the default
   // behavior of getting and setting a style property
   cssHooks: {
      opacity: {
         get: function( elem, computed ) {
            if ( computed ) {
               // We should always get a number back from opacity
               var ret = curCSS( elem, "opacity" );
               return ret === "" ? "1" : ret;

            }
         }
      }
   },

   // Exclude the following css properties to add px
   cssNumber: {
      "fillOpacity": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
   },

   // Add in properties whose names you wish to fix before
   // setting or getting the value
   cssProps: {
      // normalize float css property
      "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
   },

   // Get and set the style property on a DOM Node
   style: function( elem, name, value, extra ) {
      // Don't set styles on text and comment nodes
      if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
         return;
      }

      // Make sure that we're working with the right name
      var ret, type, hooks,
         origName = jQuery.camelCase( name ),
         style = elem.style;

      name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

      // Check if we're setting a value
      if ( value !== undefined ) {
         type = typeof value;

         // convert relative number strings (+= or -=) to relative numbers. #7345
         if ( type === "string" && (ret = rrelNum.exec( value )) ) {
            value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
            // Fixes bug #9237
            type = "number";
         }

         // Make sure that NaN and null values aren't set. See: #7116
         if ( value == null || type === "number" && isNaN( value ) ) {
            return;
         }

         // If a number was passed in, add 'px' to the (except for certain CSS properties)
         if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
            value += "px";
         }

         // If a hook was provided, use that value, otherwise just set the specified value
         if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
            // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
            // Fixes bug #5509
            try {
               style[ name ] = value;
            } catch(e) {}
         }

      } else {
         // If a hook was provided get the non-computed value from there
         if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
            return ret;
         }

         // Otherwise just get the value from the style object
         return style[ name ];
      }
   },

   css: function( elem, name, numeric, extra ) {
      var val, num, hooks,
         origName = jQuery.camelCase( name );

      // Make sure that we're working with the right name
      name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

      // If a hook was provided get the computed value from there
      if ( hooks && "get" in hooks ) {
         val = hooks.get( elem, true, extra );
      }

      // Otherwise, if a way to get the computed value exists, use that
      if ( val === undefined ) {
         val = curCSS( elem, name );
      }

      //convert "normal" to computed value
      if ( val === "normal" && name in cssNormalTransform ) {
         val = cssNormalTransform[ name ];
      }

      // Return, converting to number if forced or a qualifier was provided and val looks numeric
      if ( numeric || extra !== undefined ) {
         num = parseFloat( val );
         return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
      }
      return val;
   },

   // A method for quickly swapping in/out CSS properties to get correct calculations
   swap: function( elem, options, callback ) {
      var ret, name,
         old = {};

      // Remember the old values, and insert the new ones
      for ( name in options ) {
         old[ name ] = elem.style[ name ];
         elem.style[ name ] = options[ name ];
      }

      ret = callback.call( elem );

      // Revert the old values
      for ( name in options ) {
         elem.style[ name ] = old[ name ];
      }

      return ret;
   }
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
   curCSS = function( elem, name ) {
      var ret, width, minWidth, maxWidth,
         computed = window.getComputedStyle( elem, null ),
         style = elem.style;

      if ( computed ) {

         ret = computed[ name ];
         if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
            ret = jQuery.style( elem, name );
         }

         // A tribute to the "awesome hack by Dean Edwards"
         // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
         // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
         // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
         if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;

            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;

            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
         }
      }

      return ret;
   };
} else if ( document.documentElement.currentStyle ) {
   curCSS = function( elem, name ) {
      var left, rsLeft,
         ret = elem.currentStyle && elem.currentStyle[ name ],
         style = elem.style;

      // Avoid setting ret to empty string here
      // so we don't default to auto
      if ( ret == null && style && style[ name ] ) {
         ret = style[ name ];
      }

      // From the awesome hack by Dean Edwards
      // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

      // If we're not dealing with a regular pixel number
      // but a number that has a weird ending, we need to convert it to pixels
      // but not position css attributes, as those are proportional to the parent element instead
      // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
      if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

         // Remember the original values
         left = style.left;
         rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

         // Put in the new values to get a computed value out
         if ( rsLeft ) {
            elem.runtimeStyle.left = elem.currentStyle.left;
         }
         style.left = name === "fontSize" ? "1em" : ret;
         ret = style.pixelLeft + "px";

         // Revert the changed values
         style.left = left;
         if ( rsLeft ) {
            elem.runtimeStyle.left = rsLeft;
         }
      }

      return ret === "" ? "auto" : ret;
   };
}

function setPositiveNumber( elem, value, subtract ) {
   var matches = rnumsplit.exec( value );
   return matches ?
         Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
         value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
   var i = extra === ( isBorderBox ? "border" : "content" ) ?
      // If we already have the right measurement, avoid augmentation
      4 :
      // Otherwise initialize for horizontal or vertical properties
      name === "width" ? 1 : 0,

      val = 0;

   for ( ; i < 4; i += 2 ) {
      // both box models exclude margin, so add it if we want it
      if ( extra === "margin" ) {
         // we use jQuery.css instead of curCSS here
         // because of the reliableMarginRight CSS hook!
         val += jQuery.css( elem, extra + cssExpand[ i ], true );
      }

      // From this point on we use curCSS for maximum performance (relevant in animations)
      if ( isBorderBox ) {
         // border-box includes padding, so remove it if we want content
         if ( extra === "content" ) {
            val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
         }

         // at this point, extra isn't border nor margin, so remove border
         if ( extra !== "margin" ) {
            val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
         }
      } else {
         // at this point, extra isn't content, so add padding
         val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

         // at this point, extra isn't content nor padding, so add border
         if ( extra !== "padding" ) {
            val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
         }
      }
   }

   return val;
}

function getWidthOrHeight( elem, name, extra ) {

   // Start with offset property, which is equivalent to the border-box value
   var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
      valueIsBorderBox = true,
      isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

   // some non-html elements return undefined for offsetWidth, so check for null/undefined
   // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
   // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
   if ( val <= 0 || val == null ) {
      // Fall back to computed then uncomputed css if necessary
      val = curCSS( elem, name );
      if ( val < 0 || val == null ) {
         val = elem.style[ name ];
      }

      // Computed unit is not pixels. Stop here and return.
      if ( rnumnonpx.test(val) ) {
         return val;
      }

      // we need the check for style in case a browser which returns unreliable values
      // for getComputedStyle silently falls back to the reliable elem.style
      valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

      // Normalize "", auto, and prepare for extra
      val = parseFloat( val ) || 0;
   }

   // use the active box-sizing model to add/subtract irrelevant styles
   return ( val +
      augmentWidthOrHeight(
         elem,
         name,
         extra || ( isBorderBox ? "border" : "content" ),
         valueIsBorderBox
      )
   ) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
   if ( elemdisplay[ nodeName ] ) {
      return elemdisplay[ nodeName ];
   }

   var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
      display = elem.css("display");
   elem.remove();

   // If the simple way fails,
   // get element's real default display by attaching it to a temp iframe
   if ( display === "none" || display === "" ) {
      // Use the already-created iframe if possible
      iframe = document.body.appendChild(
         iframe || jQuery.extend( document.createElement("iframe"), {
            frameBorder: 0,
            width: 0,
            height: 0
         })
      );

      // Create a cacheable copy of the iframe document on first call.
      // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
      // document to it; WebKit & Firefox won't allow reusing the iframe document.
      if ( !iframeDoc || !iframe.createElement ) {
         iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
         iframeDoc.write("<!doctype html><html><body>");
         iframeDoc.close();
      }

      elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

      display = curCSS( elem, "display" );
      document.body.removeChild( iframe );
   }

   // Store the correct default display
   elemdisplay[ nodeName ] = display;

   return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
   jQuery.cssHooks[ name ] = {
      get: function( elem, computed, extra ) {
         if ( computed ) {
            // certain elements can have dimension info if we invisibly show them
            // however, it must have a current display style that would benefit from this
            if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
               return jQuery.swap( elem, cssShow, function() {
                  return getWidthOrHeight( elem, name, extra );
               });
            } else {
               return getWidthOrHeight( elem, name, extra );
            }
         }
      },

      set: function( elem, value, extra ) {
         return setPositiveNumber( elem, value, extra ?
            augmentWidthOrHeight(
               elem,
               name,
               extra,
               jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
            ) : 0
         );
      }
   };
});

if ( !jQuery.support.opacity ) {
   jQuery.cssHooks.opacity = {
      get: function( elem, computed ) {
         // IE uses filters for opacity
         return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
            ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
            computed ? "1" : "";
      },

      set: function( elem, value ) {
         var style = elem.style,
            currentStyle = elem.currentStyle,
            opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
            filter = currentStyle && currentStyle.filter || style.filter || "";

         // IE has trouble with opacity if it does not have layout
         // Force it by setting the zoom level
         style.zoom = 1;

         // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
         if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
            style.removeAttribute ) {

            // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
            // if "filter:" is present at all, clearType is disabled, we want to avoid this
            // style.removeAttribute is IE Only, but so apparently is this code path...
            style.removeAttribute( "filter" );

            // if there there is no filter style applied in a css rule, we are done
            if ( currentStyle && !currentStyle.filter ) {
               return;
            }
         }

         // otherwise, set new filter values
         style.filter = ralpha.test( filter ) ?
            filter.replace( ralpha, opacity ) :
            filter + " " + opacity;
      }
   };
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
   if ( !jQuery.support.reliableMarginRight ) {
      jQuery.cssHooks.marginRight = {
         get: function( elem, computed ) {
            // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
            // Work around by temporarily setting element display to inline-block
            return jQuery.swap( elem, { "display": "inline-block" }, function() {
               if ( computed ) {
                  return curCSS( elem, "marginRight" );
               }
            });
         }
      };
   }

   // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
   // getComputedStyle returns percent when specified for top/left/bottom/right
   // rather than make the css module depend on the offset module, we just check for it here
   if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
      jQuery.each( [ "top", "left" ], function( i, prop ) {
         jQuery.cssHooks[ prop ] = {
            get: function( elem, computed ) {
               if ( computed ) {
                  var ret = curCSS( elem, prop );
                  // if curCSS returns percentage, fallback to offset
                  return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
               }
            }
         };
      });
   }

});

if ( jQuery.expr && jQuery.expr.filters ) {
   jQuery.expr.filters.hidden = function( elem ) {
      return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
   };

   jQuery.expr.filters.visible = function( elem ) {
      return !jQuery.expr.filters.hidden( elem );
   };
}

// These hooks are used by animate to expand properties
jQuery.each({
   margin: "",
   padding: "",
   border: "Width"
}, function( prefix, suffix ) {
   jQuery.cssHooks[ prefix + suffix ] = {
      expand: function( value ) {
         var i,

            // assumes a single number if not a string
            parts = typeof value === "string" ? value.split(" ") : [ value ],
            expanded = {};

         for ( i = 0; i < 4; i++ ) {
            expanded[ prefix + cssExpand[ i ] + suffix ] =
               parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
         }

         return expanded;
      }
   };

   if ( !rmargin.test( prefix ) ) {
      jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
   }
});
var r20 = /%20/g,
   rbracket = /\[\]$/,
   rCRLF = /\r?\n/g,
   rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
   rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
   serialize: function() {
      return jQuery.param( this.serializeArray() );
   },
   serializeArray: function() {
      return this.map(function(){
         return this.elements ? jQuery.makeArray( this.elements ) : this;
      })
      .filter(function(){
         return this.name && !this.disabled &&
            ( this.checked || rselectTextarea.test( this.nodeName ) ||
               rinput.test( this.type ) );
      })
      .map(function( i, elem ){
         var val = jQuery( this ).val();

         return val == null ?
            null :
            jQuery.isArray( val ) ?
               jQuery.map( val, function( val, i ){
                  return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
               }) :
               { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
      }).get();
   }
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
   var prefix,
      s = [],
      add = function( key, value ) {
         // If value is a function, invoke it and return its value
         value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
         s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
      };

   // Set traditional to true for jQuery <= 1.3.2 behavior.
   if ( traditional === undefined ) {
      traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
   }

   // If an array was passed in, assume that it is an array of form elements.
   if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
      // Serialize the form elements
      jQuery.each( a, function() {
         add( this.name, this.value );
      });

   } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for ( prefix in a ) {
         buildParams( prefix, a[ prefix ], traditional, add );
      }
   }

   // Return the resulting serialization
   return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
   var name;

   if ( jQuery.isArray( obj ) ) {
      // Serialize array item.
      jQuery.each( obj, function( i, v ) {
         if ( traditional || rbracket.test( prefix ) ) {
            // Treat each array item as a scalar.
            add( prefix, v );

         } else {
            // If array item is non-scalar (array or object), encode its
            // numeric index to resolve deserialization ambiguity issues.
            // Note that rack (as of 1.0.0) can't currently deserialize
            // nested arrays properly, and attempting to do so may cause
            // a server error. Possible fixes are to modify rack's
            // deserialization algorithm or to provide an option or flag
            // to force array serialization to be shallow.
            buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
         }
      });

   } else if ( !traditional && jQuery.type( obj ) === "object" ) {
      // Serialize object item.
      for ( name in obj ) {
         buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
      }

   } else {
      // Serialize scalar item.
      add( prefix, obj );
   }
}
var
   // Document location
   ajaxLocParts,
   ajaxLocation,

   rhash = /#.*$/,
   rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
   // #7653, #8125, #8152: local protocol detection
   rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
   rnoContent = /^(?:GET|HEAD)$/,
   rprotocol = /^\/\//,
   rquery = /\?/,
   rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
   rts = /([?&])_=[^&]*/,
   rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

   // Keep a copy of the old load method
   _load = jQuery.fn.load,

   /* Prefilters
    * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    * 2) These are called:
    *    - BEFORE asking for a transport
    *    - AFTER param serialization (s.data is a string if s.processData is true)
    * 3) key is the dataType
    * 4) the catchall symbol "*" can be used
    * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    */
   prefilters = {},

   /* Transports bindings
    * 1) key is the dataType
    * 2) the catchall symbol "*" can be used
    * 3) selection will start with transport dataType and THEN go to "*" if needed
    */
   transports = {},

   // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
   allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
   ajaxLocation = location.href;
} catch( e ) {
   // Use the href attribute of an A element
   // since IE will modify it given document.location
   ajaxLocation = document.createElement( "a" );
   ajaxLocation.href = "";
   ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

   // dataTypeExpression is optional and defaults to "*"
   return function( dataTypeExpression, func ) {

      if ( typeof dataTypeExpression !== "string" ) {
         func = dataTypeExpression;
         dataTypeExpression = "*";
      }

      var dataType, list, placeBefore,
         dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
         i = 0,
         length = dataTypes.length;

      if ( jQuery.isFunction( func ) ) {
         // For each dataType in the dataTypeExpression
         for ( ; i < length; i++ ) {
            dataType = dataTypes[ i ];
            // We control if we're asked to add before
            // any existing element
            placeBefore = /^\+/.test( dataType );
            if ( placeBefore ) {
               dataType = dataType.substr( 1 ) || "*";
            }
            list = structure[ dataType ] = structure[ dataType ] || [];
            // then we add to the structure accordingly
            list[ placeBefore ? "unshift" : "push" ]( func );
         }
      }
   };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
      dataType /* internal */, inspected /* internal */ ) {

   dataType = dataType || options.dataTypes[ 0 ];
   inspected = inspected || {};

   inspected[ dataType ] = true;

   var selection,
      list = structure[ dataType ],
      i = 0,
      length = list ? list.length : 0,
      executeOnly = ( structure === prefilters );

   for ( ; i < length && ( executeOnly || !selection ); i++ ) {
      selection = list[ i ]( options, originalOptions, jqXHR );
      // If we got redirected to another dataType
      // we try there if executing only and not done already
      if ( typeof selection === "string" ) {
         if ( !executeOnly || inspected[ selection ] ) {
            selection = undefined;
         } else {
            options.dataTypes.unshift( selection );
            selection = inspectPrefiltersOrTransports(
                  structure, options, originalOptions, jqXHR, selection, inspected );
         }
      }
   }
   // If we're only executing or nothing was selected
   // we try the catchall dataType if not done already
   if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
      selection = inspectPrefiltersOrTransports(
            structure, options, originalOptions, jqXHR, "*", inspected );
   }
   // unnecessary when only executing (prefilters)
   // but it'll be ignored by the caller in that case
   return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
   var key, deep,
      flatOptions = jQuery.ajaxSettings.flatOptions || {};
   for ( key in src ) {
      if ( src[ key ] !== undefined ) {
         ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
      }
   }
   if ( deep ) {
      jQuery.extend( true, target, deep );
   }
}

jQuery.fn.load = function( url, params, callback ) {
   if ( typeof url !== "string" && _load ) {
      return _load.apply( this, arguments );
   }

   // Don't do a request if no elements are being requested
   if ( !this.length ) {
      return this;
   }

   var selector, type, response,
      self = this,
      off = url.indexOf(" ");

   if ( off >= 0 ) {
      selector = url.slice( off, url.length );
      url = url.slice( 0, off );
   }

   // If it's a function
   if ( jQuery.isFunction( params ) ) {

      // We assume that it's the callback
      callback = params;
      params = undefined;

   // Otherwise, build a param string
   } else if ( params && typeof params === "object" ) {
      type = "POST";
   }

   // Request the remote document
   jQuery.ajax({
      url: url,

      // if "type" variable is undefined, then "GET" method will be used
      type: type,
      dataType: "html",
      data: params,
      complete: function( jqXHR, status ) {
         if ( callback ) {
            self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
         }
      }
   }).done(function( responseText ) {

      // Save response for use in complete callback
      response = arguments;

      // See if a selector was specified
      self.html( selector ?

         // Create a dummy div to hold the results
         jQuery("<div>")

            // inject the contents of the document in, removing the scripts
            // to avoid any 'Permission Denied' errors in IE
            .append( responseText.replace( rscript, "" ) )

            // Locate the specified elements
            .find( selector ) :

         // If not, just inject the full result
         responseText );

   });

   return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
   jQuery.fn[ o ] = function( f ){
      return this.on( o, f );
   };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
   jQuery[ method ] = function( url, data, callback, type ) {
      // shift arguments if data argument was omitted
      if ( jQuery.isFunction( data ) ) {
         type = type || callback;
         callback = data;
         data = undefined;
      }

      return jQuery.ajax({
         type: method,
         url: url,
         data: data,
         success: callback,
         dataType: type
      });
   };
});

jQuery.extend({

   getScript: function( url, callback ) {
      return jQuery.get( url, undefined, callback, "script" );
   },

   getJSON: function( url, data, callback ) {
      return jQuery.get( url, data, callback, "json" );
   },

   // Creates a full fledged settings object into target
   // with both ajaxSettings and settings fields.
   // If target is omitted, writes into ajaxSettings.
   ajaxSetup: function( target, settings ) {
      if ( settings ) {
         // Building a settings object
         ajaxExtend( target, jQuery.ajaxSettings );
      } else {
         // Extending ajaxSettings
         settings = target;
         target = jQuery.ajaxSettings;
      }
      ajaxExtend( target, settings );
      return target;
   },

   ajaxSettings: {
      url: ajaxLocation,
      isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
      global: true,
      type: "GET",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      processData: true,
      async: true,
      /*
      timeout: 0,
      data: null,
      dataType: null,
      username: null,
      password: null,
      cache: null,
      throws: false,
      traditional: false,
      headers: {},
      */

      accepts: {
         xml: "application/xml, text/xml",
         html: "text/html",
         text: "text/plain",
         json: "application/json, text/javascript",
         "*": allTypes
      },

      contents: {
         xml: /xml/,
         html: /html/,
         json: /json/
      },

      responseFields: {
         xml: "responseXML",
         text: "responseText"
      },

      // List of data converters
      // 1) key format is "source_type destination_type" (a single space in-between)
      // 2) the catchall symbol "*" can be used for source_type
      converters: {

         // Convert anything to text
         "* text": window.String,

         // Text to html (true = no transformation)
         "text html": true,

         // Evaluate text as a json expression
         "text json": jQuery.parseJSON,

         // Parse text as xml
         "text xml": jQuery.parseXML
      },

      // For options that shouldn't be deep extended:
      // you can add your own custom options here if
      // and when you create one that shouldn't be
      // deep extended (see ajaxExtend)
      flatOptions: {
         context: true,
         url: true
      }
   },

   ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
   ajaxTransport: addToPrefiltersOrTransports( transports ),

   // Main method
   ajax: function( url, options ) {

      // If url is an object, simulate pre-1.5 signature
      if ( typeof url === "object" ) {
         options = url;
         url = undefined;
      }

      // Force options to be an object
      options = options || {};

      var // ifModified key
         ifModifiedKey,
         // Response headers
         responseHeadersString,
         responseHeaders,
         // transport
         transport,
         // timeout handle
         timeoutTimer,
         // Cross-domain detection vars
         parts,
         // To know if global events are to be dispatched
         fireGlobals,
         // Loop variable
         i,
         // Create the final options object
         s = jQuery.ajaxSetup( {}, options ),
         // Callbacks context
         callbackContext = s.context || s,
         // Context for global events
         // It's the callbackContext if one was provided in the options
         // and if it's a DOM node or a jQuery collection
         globalEventContext = callbackContext !== s &&
            ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                  jQuery( callbackContext ) : jQuery.event,
         // Deferreds
         deferred = jQuery.Deferred(),
         completeDeferred = jQuery.Callbacks( "once memory" ),
         // Status-dependent callbacks
         statusCode = s.statusCode || {},
         // Headers (they are sent all at once)
         requestHeaders = {},
         requestHeadersNames = {},
         // The jqXHR state
         state = 0,
         // Default abort message
         strAbort = "canceled",
         // Fake xhr
         jqXHR = {

            readyState: 0,

            // Caches the header
            setRequestHeader: function( name, value ) {
               if ( !state ) {
                  var lname = name.toLowerCase();
                  name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                  requestHeaders[ name ] = value;
               }
               return this;
            },

            // Raw string
            getAllResponseHeaders: function() {
               return state === 2 ? responseHeadersString : null;
            },

            // Builds headers hashtable if needed
            getResponseHeader: function( key ) {
               var match;
               if ( state === 2 ) {
                  if ( !responseHeaders ) {
                     responseHeaders = {};
                     while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                        responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                     }
                  }
                  match = responseHeaders[ key.toLowerCase() ];
               }
               return match === undefined ? null : match;
            },

            // Overrides response content-type header
            overrideMimeType: function( type ) {
               if ( !state ) {
                  s.mimeType = type;
               }
               return this;
            },

            // Cancel the request
            abort: function( statusText ) {
               statusText = statusText || strAbort;
               if ( transport ) {
                  transport.abort( statusText );
               }
               done( 0, statusText );
               return this;
            }
         };

      // Callback for when everything is done
      // It is defined here because jslint complains if it is declared
      // at the end of the function (which would be more logical and readable)
      function done( status, nativeStatusText, responses, headers ) {
         var isSuccess, success, error, response, modified,
            statusText = nativeStatusText;

         // Called once
         if ( state === 2 ) {
            return;
         }

         // State is "done" now
         state = 2;

         // Clear timeout if it exists
         if ( timeoutTimer ) {
            clearTimeout( timeoutTimer );
         }

         // Dereference transport for early garbage collection
         // (no matter how long the jqXHR object will be used)
         transport = undefined;

         // Cache response headers
         responseHeadersString = headers || "";

         // Set readyState
         jqXHR.readyState = status > 0 ? 4 : 0;

         // Get response data
         if ( responses ) {
            response = ajaxHandleResponses( s, jqXHR, responses );
         }

         // If successful, handle type chaining
         if ( status >= 200 && status < 300 || status === 304 ) {

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {

               modified = jqXHR.getResponseHeader("Last-Modified");
               if ( modified ) {
                  jQuery.lastModified[ ifModifiedKey ] = modified;
               }
               modified = jqXHR.getResponseHeader("Etag");
               if ( modified ) {
                  jQuery.etag[ ifModifiedKey ] = modified;
               }
            }

            // If not modified
            if ( status === 304 ) {

               statusText = "notmodified";
               isSuccess = true;

            // If we have data
            } else {

               isSuccess = ajaxConvert( s, response );
               statusText = isSuccess.state;
               success = isSuccess.data;
               error = isSuccess.error;
               isSuccess = !error;
            }
         } else {
            // We extract error from statusText
            // then normalize statusText and status for non-aborts
            error = statusText;
            if ( !statusText || status ) {
               statusText = "error";
               if ( status < 0 ) {
                  status = 0;
               }
            }
         }

         // Set data for the fake xhr object
         jqXHR.status = status;
         jqXHR.statusText = ( nativeStatusText || statusText ) + "";

         // Success/Error
         if ( isSuccess ) {
            deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
         } else {
            deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
         }

         // Status-dependent callbacks
         jqXHR.statusCode( statusCode );
         statusCode = undefined;

         if ( fireGlobals ) {
            globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                  [ jqXHR, s, isSuccess ? success : error ] );
         }

         // Complete
         completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

         if ( fireGlobals ) {
            globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
            // Handle the global AJAX counter
            if ( !( --jQuery.active ) ) {
               jQuery.event.trigger( "ajaxStop" );
            }
         }
      }

      // Attach deferreds
      deferred.promise( jqXHR );
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;
      jqXHR.complete = completeDeferred.add;

      // Status-dependent callbacks
      jqXHR.statusCode = function( map ) {
         if ( map ) {
            var tmp;
            if ( state < 2 ) {
               for ( tmp in map ) {
                  statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
               }
            } else {
               tmp = map[ jqXHR.status ];
               jqXHR.always( tmp );
            }
         }
         return this;
      };

      // Remove hash character (#7531: and string promotion)
      // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
      // We also use the url parameter if available
      s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

      // Extract dataTypes list
      s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

      // A cross-domain request is in order when we have a protocol:host:port mismatch
      if ( s.crossDomain == null ) {
         parts = rurl.exec( s.url.toLowerCase() ) || false;
         s.crossDomain = parts && ( parts.join(":") + ( parts[ 3 ] ? "" : parts[ 1 ] === "http:" ? 80 : 443 ) ) !==
            ( ajaxLocParts.join(":") + ( ajaxLocParts[ 3 ] ? "" : ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) );
      }

      // Convert data if not already a string
      if ( s.data && s.processData && typeof s.data !== "string" ) {
         s.data = jQuery.param( s.data, s.traditional );
      }

      // Apply prefilters
      inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

      // If request was aborted inside a prefilter, stop there
      if ( state === 2 ) {
         return jqXHR;
      }

      // We can fire global events as of now if asked to
      fireGlobals = s.global;

      // Uppercase the type
      s.type = s.type.toUpperCase();

      // Determine if request has content
      s.hasContent = !rnoContent.test( s.type );

      // Watch for a new set of requests
      if ( fireGlobals && jQuery.active++ === 0 ) {
         jQuery.event.trigger( "ajaxStart" );
      }

      // More options handling for requests with no content
      if ( !s.hasContent ) {

         // If data is available, append data to url
         if ( s.data ) {
            s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
            // #9682: remove data so that it's not used in an eventual retry
            delete s.data;
         }

         // Get ifModifiedKey before adding the anti-cache parameter
         ifModifiedKey = s.url;

         // Add anti-cache in url if needed
         if ( s.cache === false ) {

            var ts = jQuery.now(),
               // try replacing _= if it is there
               ret = s.url.replace( rts, "$1_=" + ts );

            // if nothing was replaced, add timestamp to the end
            s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
         }
      }

      // Set the correct header, if data is being sent
      if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
         jqXHR.setRequestHeader( "Content-Type", s.contentType );
      }

      // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
      if ( s.ifModified ) {
         ifModifiedKey = ifModifiedKey || s.url;
         if ( jQuery.lastModified[ ifModifiedKey ] ) {
            jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
         }
         if ( jQuery.etag[ ifModifiedKey ] ) {
            jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
         }
      }

      // Set the Accepts header for the server, depending on the dataType
      jqXHR.setRequestHeader(
         "Accept",
         s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
            s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
            s.accepts[ "*" ]
      );

      // Check for headers option
      for ( i in s.headers ) {
         jqXHR.setRequestHeader( i, s.headers[ i ] );
      }

      // Allow custom headers/mimetypes and early abort
      if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
            // Abort if not done already and return
            return jqXHR.abort();

      }

      // aborting is no longer a cancellation
      strAbort = "abort";

      // Install callbacks on deferreds
      for ( i in { success: 1, error: 1, complete: 1 } ) {
         jqXHR[ i ]( s[ i ] );
      }

      // Get transport
      transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

      // If no transport, we auto-abort
      if ( !transport ) {
         done( -1, "No Transport" );
      } else {
         jqXHR.readyState = 1;
         // Send global event
         if ( fireGlobals ) {
            globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
         }
         // Timeout
         if ( s.async && s.timeout > 0 ) {
            timeoutTimer = setTimeout( function(){
               jqXHR.abort( "timeout" );
            }, s.timeout );
         }

         try {
            state = 1;
            transport.send( requestHeaders, done );
         } catch (e) {
            // Propagate exception as error if not done
            if ( state < 2 ) {
               done( -1, e );
            // Simply rethrow otherwise
            } else {
               throw e;
            }
         }
      }

      return jqXHR;
   },

   // Counter for holding the number of active queries
   active: 0,

   // Last-Modified header cache for next request
   lastModified: {},
   etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

   var ct, type, finalDataType, firstDataType,
      contents = s.contents,
      dataTypes = s.dataTypes,
      responseFields = s.responseFields;

   // Fill responseXXX fields
   for ( type in responseFields ) {
      if ( type in responses ) {
         jqXHR[ responseFields[type] ] = responses[ type ];
      }
   }

   // Remove auto dataType and get content-type in the process
   while( dataTypes[ 0 ] === "*" ) {
      dataTypes.shift();
      if ( ct === undefined ) {
         ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
      }
   }

   // Check if we're dealing with a known content-type
   if ( ct ) {
      for ( type in contents ) {
         if ( contents[ type ] && contents[ type ].test( ct ) ) {
            dataTypes.unshift( type );
            break;
         }
      }
   }

   // Check to see if we have a response for the expected dataType
   if ( dataTypes[ 0 ] in responses ) {
      finalDataType = dataTypes[ 0 ];
   } else {
      // Try convertible dataTypes
      for ( type in responses ) {
         if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
            finalDataType = type;
            break;
         }
         if ( !firstDataType ) {
            firstDataType = type;
         }
      }
      // Or just use first one
      finalDataType = finalDataType || firstDataType;
   }

   // If we found a dataType
   // We add the dataType to the list if needed
   // and return the corresponding response
   if ( finalDataType ) {
      if ( finalDataType !== dataTypes[ 0 ] ) {
         dataTypes.unshift( finalDataType );
      }
      return responses[ finalDataType ];
   }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

   var conv, conv2, current, tmp,
      // Work with a copy of dataTypes in case we need to modify it for conversion
      dataTypes = s.dataTypes.slice(),
      prev = dataTypes[ 0 ],
      converters = {},
      i = 0;

   // Apply the dataFilter if provided
   if ( s.dataFilter ) {
      response = s.dataFilter( response, s.dataType );
   }

   // Create converters map with lowercased keys
   if ( dataTypes[ 1 ] ) {
      for ( conv in s.converters ) {
         converters[ conv.toLowerCase() ] = s.converters[ conv ];
      }
   }

   // Convert to each sequential dataType, tolerating list modification
   for ( ; (current = dataTypes[++i]); ) {

      // There's only work to do if current dataType is non-auto
      if ( current !== "*" ) {

         // Convert response if prev dataType is non-auto and differs from current
         if ( prev !== "*" && prev !== current ) {

            // Seek a direct converter
            conv = converters[ prev + " " + current ] || converters[ "* " + current ];

            // If none found, seek a pair
            if ( !conv ) {
               for ( conv2 in converters ) {

                  // If conv2 outputs current
                  tmp = conv2.split(" ");
                  if ( tmp[ 1 ] === current ) {

                     // If prev can be converted to accepted input
                     conv = converters[ prev + " " + tmp[ 0 ] ] ||
                        converters[ "* " + tmp[ 0 ] ];
                     if ( conv ) {
                        // Condense equivalence converters
                        if ( conv === true ) {
                           conv = converters[ conv2 ];

                        // Otherwise, insert the intermediate dataType
                        } else if ( converters[ conv2 ] !== true ) {
                           current = tmp[ 0 ];
                           dataTypes.splice( i--, 0, current );
                        }

                        break;
                     }
                  }
               }
            }

            // Apply converter (if not an equivalence)
            if ( conv !== true ) {

               // Unless errors are allowed to bubble, catch and return them
               if ( conv && s["throws"] ) {
                  response = conv( response );
               } else {
                  try {
                     response = conv( response );
                  } catch ( e ) {
                     return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                  }
               }
            }
         }

         // Update prev for next iteration
         prev = current;
      }
   }

   return { state: "success", data: response };
}
var oldCallbacks = [],
   rquestion = /\?/,
   rjsonp = /(=)\?(?=&|$)|\?\?/,
   nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
   jsonp: "callback",
   jsonpCallback: function() {
      var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
      this[ callback ] = true;
      return callback;
   }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

   var callbackName, overwritten, responseContainer,
      data = s.data,
      url = s.url,
      hasCallback = s.jsonp !== false,
      replaceInUrl = hasCallback && rjsonp.test( url ),
      replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
         !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
         rjsonp.test( data );

   // Handle iff the expected data type is "jsonp" or we have a parameter to set
   if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

      // Get callback name, remembering preexisting value associated with it
      callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
         s.jsonpCallback() :
         s.jsonpCallback;
      overwritten = window[ callbackName ];

      // Insert callback into url or form data
      if ( replaceInUrl ) {
         s.url = url.replace( rjsonp, "$1" + callbackName );
      } else if ( replaceInData ) {
         s.data = data.replace( rjsonp, "$1" + callbackName );
      } else if ( hasCallback ) {
         s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
      }

      // Use data converter to retrieve json after script execution
      s.converters["script json"] = function() {
         if ( !responseContainer ) {
            jQuery.error( callbackName + " was not called" );
         }
         return responseContainer[ 0 ];
      };

      // force json dataType
      s.dataTypes[ 0 ] = "json";

      // Install callback
      window[ callbackName ] = function() {
         responseContainer = arguments;
      };

      // Clean-up function (fires after converters)
      jqXHR.always(function() {
         // Restore preexisting value
         window[ callbackName ] = overwritten;

         // Save back as free
         if ( s[ callbackName ] ) {
            // make sure that re-using the options doesn't screw things around
            s.jsonpCallback = originalSettings.jsonpCallback;

            // save the callback name for future use
            oldCallbacks.push( callbackName );
         }

         // Call if it was a function and we have a response
         if ( responseContainer && jQuery.isFunction( overwritten ) ) {
            overwritten( responseContainer[ 0 ] );
         }

         responseContainer = overwritten = undefined;
      });

      // Delegate to script
      return "script";
   }
});
// Install script dataType
jQuery.ajaxSetup({
   accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
   },
   contents: {
      script: /javascript|ecmascript/
   },
   converters: {
      "text script": function( text ) {
         jQuery.globalEval( text );
         return text;
      }
   }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
   if ( s.cache === undefined ) {
      s.cache = false;
   }
   if ( s.crossDomain ) {
      s.type = "GET";
      s.global = false;
   }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

   // This transport only deals with cross domain requests
   if ( s.crossDomain ) {

      var script,
         head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

      return {

         send: function( _, callback ) {

            script = document.createElement( "script" );

            script.async = "async";

            if ( s.scriptCharset ) {
               script.charset = s.scriptCharset;
            }

            script.src = s.url;

            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function( _, isAbort ) {

               if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                  // Handle memory leak in IE
                  script.onload = script.onreadystatechange = null;

                  // Remove the script
                  if ( head && script.parentNode ) {
                     head.removeChild( script );
                  }

                  // Dereference the script
                  script = undefined;

                  // Callback if not abort
                  if ( !isAbort ) {
                     callback( 200, "success" );
                  }
               }
            };
            // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
            // This arises when a base node is used (#2709 and #4378).
            head.insertBefore( script, head.firstChild );
         },

         abort: function() {
            if ( script ) {
               script.onload( 0, 1 );
            }
         }
      };
   }
});
var xhrCallbacks,
   // #5280: Internet Explorer will keep connections alive if we don't abort on unload
   xhrOnUnloadAbort = window.ActiveXObject ? function() {
      // Abort all pending requests
      for ( var key in xhrCallbacks ) {
         xhrCallbacks[ key ]( 0, 1 );
      }
   } : false,
   xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
   try {
      return new window.XMLHttpRequest();
   } catch( e ) {}
}

function createActiveXHR() {
   try {
      return new window.ActiveXObject( "Microsoft.XMLHTTP" );
   } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
   /* Microsoft failed to properly
    * implement the XMLHttpRequest in IE7 (can't request local files),
    * so we use the ActiveXObject when it is available
    * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
    * we need a fallback.
    */
   function() {
      return !this.isLocal && createStandardXHR() || createActiveXHR();
   } :
   // For all other browsers, use the standard XMLHttpRequest object
   createStandardXHR;

// Determine support properties
(function( xhr ) {
   jQuery.extend( jQuery.support, {
      ajax: !!xhr,
      cors: !!xhr && ( "withCredentials" in xhr )
   });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

   jQuery.ajaxTransport(function( s ) {
      // Cross domain only allowed if supported through XMLHttpRequest
      if ( !s.crossDomain || jQuery.support.cors ) {

         var callback;

         return {
            send: function( headers, complete ) {

               // Get a new xhr
               var handle, i,
                  xhr = s.xhr();

               // Open the socket
               // Passing null username, generates a login popup on Opera (#2865)
               if ( s.username ) {
                  xhr.open( s.type, s.url, s.async, s.username, s.password );
               } else {
                  xhr.open( s.type, s.url, s.async );
               }

               // Apply custom fields if provided
               if ( s.xhrFields ) {
                  for ( i in s.xhrFields ) {
                     xhr[ i ] = s.xhrFields[ i ];
                  }
               }

               // Override mime type if needed
               if ( s.mimeType && xhr.overrideMimeType ) {
                  xhr.overrideMimeType( s.mimeType );
               }

               // X-Requested-With header
               // For cross-domain requests, seeing as conditions for a preflight are
               // akin to a jigsaw puzzle, we simply never set it to be sure.
               // (it can always be set on a per-request basis or even using ajaxSetup)
               // For same-domain requests, won't change header if already provided.
               if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                  headers[ "X-Requested-With" ] = "XMLHttpRequest";
               }

               // Need an extra try/catch for cross domain requests in Firefox 3
               try {
                  for ( i in headers ) {
                     xhr.setRequestHeader( i, headers[ i ] );
                  }
               } catch( _ ) {}

               // Do send the request
               // This may raise an exception which is actually
               // handled in jQuery.ajax (so no try/catch here)
               xhr.send( ( s.hasContent && s.data ) || null );

               // Listener
               callback = function( _, isAbort ) {

                  var status,
                     statusText,
                     responseHeaders,
                     responses,
                     xml;

                  // Firefox throws exceptions when accessing properties
                  // of an xhr when a network error occurred
                  // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                  try {

                     // Was never called and is aborted or complete
                     if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                        // Only called once
                        callback = undefined;

                        // Do not keep as active anymore
                        if ( handle ) {
                           xhr.onreadystatechange = jQuery.noop;
                           if ( xhrOnUnloadAbort ) {
                              delete xhrCallbacks[ handle ];
                           }
                        }

                        // If it's an abort
                        if ( isAbort ) {
                           // Abort it manually if needed
                           if ( xhr.readyState !== 4 ) {
                              xhr.abort();
                           }
                        } else {
                           status = xhr.status;
                           responseHeaders = xhr.getAllResponseHeaders();
                           responses = {};
                           xml = xhr.responseXML;

                           // Construct response list
                           if ( xml && xml.documentElement /* #4958 */ ) {
                              responses.xml = xml;
                           }

                           // When requesting binary data, IE6-9 will throw an exception
                           // on any attempt to access responseText (#11426)
                           try {
                              responses.text = xhr.responseText;
                           } catch( _ ) {
                           }

                           // Firefox throws an exception when accessing
                           // statusText for faulty cross-domain requests
                           try {
                              statusText = xhr.statusText;
                           } catch( e ) {
                              // We normalize with Webkit giving an empty statusText
                              statusText = "";
                           }

                           // Filter status for non standard behaviors

                           // If the request is local and we have data: assume a success
                           // (success with no data won't get notified, that's the best we
                           // can do given current implementations)
                           if ( !status && s.isLocal && !s.crossDomain ) {
                              status = responses.text ? 200 : 404;
                           // IE - #1450: sometimes returns 1223 when it should be 204
                           } else if ( status === 1223 ) {
                              status = 204;
                           }
                        }
                     }
                  } catch( firefoxAccessException ) {
                     if ( !isAbort ) {
                        complete( -1, firefoxAccessException );
                     }
                  }

                  // Call complete if needed
                  if ( responses ) {
                     complete( status, statusText, responses, responseHeaders );
                  }
               };

               if ( !s.async ) {
                  // if we're in sync mode we fire the callback
                  callback();
               } else if ( xhr.readyState === 4 ) {
                  // (IE6 & IE7) if it's in cache and has been
                  // retrieved directly we need to fire the callback
                  setTimeout( callback, 0 );
               } else {
                  handle = ++xhrId;
                  if ( xhrOnUnloadAbort ) {
                     // Create the active xhrs callbacks list if needed
                     // and attach the unload handler
                     if ( !xhrCallbacks ) {
                        xhrCallbacks = {};
                        jQuery( window ).unload( xhrOnUnloadAbort );
                     }
                     // Add to list of active xhrs callbacks
                     xhrCallbacks[ handle ] = callback;
                  }
                  xhr.onreadystatechange = callback;
               }
            },

            abort: function() {
               if ( callback ) {
                  callback(0,1);
               }
            }
         };
      }
   });
}
var fxNow, timerId,
   rfxtypes = /^(?:toggle|show|hide)$/,
   rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
   rrun = /queueHooks$/,
   animationPrefilters = [ defaultPrefilter ],
   tweeners = {
      "*": [function( prop, value ) {
         var end, unit,
            tween = this.createTween( prop, value ),
            parts = rfxnum.exec( value ),
            target = tween.cur(),
            start = +target || 0,
            scale = 1,
            maxIterations = 20;

         if ( parts ) {
            end = +parts[2];
            unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

            // We need to compute starting value
            if ( unit !== "px" && start ) {
               // Iteratively approximate from a nonzero starting point
               // Prefer the current property, because this process will be trivial if it uses the same units
               // Fallback to end or a simple constant
               start = jQuery.css( tween.elem, prop, true ) || end || 1;

               do {
                  // If previous iteration zeroed out, double until we get *something*
                  // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                  scale = scale || ".5";

                  // Adjust and apply
                  start = start / scale;
                  jQuery.style( tween.elem, prop, start + unit );

               // Update scale, tolerating zero or NaN from tween.cur()
               // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
               } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
            }

            tween.unit = unit;
            tween.start = start;
            // If a +=/-= token was provided, we're doing a relative animation
            tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
         }
         return tween;
      }]
   };

// Animations created synchronously will run synchronously
function createFxNow() {
   setTimeout(function() {
      fxNow = undefined;
   }, 0 );
   return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
   jQuery.each( props, function( prop, value ) {
      var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
         index = 0,
         length = collection.length;
      for ( ; index < length; index++ ) {
         if ( collection[ index ].call( animation, prop, value ) ) {

            // we're done with this property
            return;
         }
      }
   });
}

function Animation( elem, properties, options ) {
   var result,
      index = 0,
      tweenerIndex = 0,
      length = animationPrefilters.length,
      deferred = jQuery.Deferred().always( function() {
         // don't match elem in the :animated selector
         delete tick.elem;
      }),
      tick = function() {
         var currentTime = fxNow || createFxNow(),
            remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
            percent = 1 - ( remaining / animation.duration || 0 ),
            index = 0,
            length = animation.tweens.length;

         for ( ; index < length ; index++ ) {
            animation.tweens[ index ].run( percent );
         }

         deferred.notifyWith( elem, [ animation, percent, remaining ]);

         if ( percent < 1 && length ) {
            return remaining;
         } else {
            deferred.resolveWith( elem, [ animation ] );
            return false;
         }
      },
      animation = deferred.promise({
         elem: elem,
         props: jQuery.extend( {}, properties ),
         opts: jQuery.extend( true, { specialEasing: {} }, options ),
         originalProperties: properties,
         originalOptions: options,
         startTime: fxNow || createFxNow(),
         duration: options.duration,
         tweens: [],
         createTween: function( prop, end, easing ) {
            var tween = jQuery.Tween( elem, animation.opts, prop, end,
                  animation.opts.specialEasing[ prop ] || animation.opts.easing );
            animation.tweens.push( tween );
            return tween;
         },
         stop: function( gotoEnd ) {
            var index = 0,
               // if we are going to the end, we want to run all the tweens
               // otherwise we skip this part
               length = gotoEnd ? animation.tweens.length : 0;

            for ( ; index < length ; index++ ) {
               animation.tweens[ index ].run( 1 );
            }

            // resolve when we played the last frame
            // otherwise, reject
            if ( gotoEnd ) {
               deferred.resolveWith( elem, [ animation, gotoEnd ] );
            } else {
               deferred.rejectWith( elem, [ animation, gotoEnd ] );
            }
            return this;
         }
      }),
      props = animation.props;

   propFilter( props, animation.opts.specialEasing );

   for ( ; index < length ; index++ ) {
      result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
      if ( result ) {
         return result;
      }
   }

   createTweens( animation, props );

   if ( jQuery.isFunction( animation.opts.start ) ) {
      animation.opts.start.call( elem, animation );
   }

   jQuery.fx.timer(
      jQuery.extend( tick, {
         anim: animation,
         queue: animation.opts.queue,
         elem: elem
      })
   );

   // attach callbacks from options
   return animation.progress( animation.opts.progress )
      .done( animation.opts.done, animation.opts.complete )
      .fail( animation.opts.fail )
      .always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
   var index, name, easing, value, hooks;

   // camelCase, specialEasing and expand cssHook pass
   for ( index in props ) {
      name = jQuery.camelCase( index );
      easing = specialEasing[ name ];
      value = props[ index ];
      if ( jQuery.isArray( value ) ) {
         easing = value[ 1 ];
         value = props[ index ] = value[ 0 ];
      }

      if ( index !== name ) {
         props[ name ] = value;
         delete props[ index ];
      }

      hooks = jQuery.cssHooks[ name ];
      if ( hooks && "expand" in hooks ) {
         value = hooks.expand( value );
         delete props[ name ];

         // not quite $.extend, this wont overwrite keys already present.
         // also - reusing 'index' from above because we have the correct "name"
         for ( index in value ) {
            if ( !( index in props ) ) {
               props[ index ] = value[ index ];
               specialEasing[ index ] = easing;
            }
         }
      } else {
         specialEasing[ name ] = easing;
      }
   }
}

jQuery.Animation = jQuery.extend( Animation, {

   tweener: function( props, callback ) {
      if ( jQuery.isFunction( props ) ) {
         callback = props;
         props = [ "*" ];
      } else {
         props = props.split(" ");
      }

      var prop,
         index = 0,
         length = props.length;

      for ( ; index < length ; index++ ) {
         prop = props[ index ];
         tweeners[ prop ] = tweeners[ prop ] || [];
         tweeners[ prop ].unshift( callback );
      }
   },

   prefilter: function( callback, prepend ) {
      if ( prepend ) {
         animationPrefilters.unshift( callback );
      } else {
         animationPrefilters.push( callback );
      }
   }
});

function defaultPrefilter( elem, props, opts ) {
   var index, prop, value, length, dataShow, tween, hooks, oldfire,
      anim = this,
      style = elem.style,
      orig = {},
      handled = [],
      hidden = elem.nodeType && isHidden( elem );

   // handle queue: false promises
   if ( !opts.queue ) {
      hooks = jQuery._queueHooks( elem, "fx" );
      if ( hooks.unqueued == null ) {
         hooks.unqueued = 0;
         oldfire = hooks.empty.fire;
         hooks.empty.fire = function() {
            if ( !hooks.unqueued ) {
               oldfire();
            }
         };
      }
      hooks.unqueued++;

      anim.always(function() {
         // doing this makes sure that the complete handler will be called
         // before this completes
         anim.always(function() {
            hooks.unqueued--;
            if ( !jQuery.queue( elem, "fx" ).length ) {
               hooks.empty.fire();
            }
         });
      });
   }

   // height/width overflow pass
   if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
      // Make sure that nothing sneaks out
      // Record all 3 overflow attributes because IE does not
      // change the overflow attribute when overflowX and
      // overflowY are set to the same value
      opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

      // Set display property to inline-block for height/width
      // animations on inline elements that are having width/height animated
      if ( jQuery.css( elem, "display" ) === "inline" &&
            jQuery.css( elem, "float" ) === "none" ) {

         // inline-level elements accept inline-block;
         // block-level elements need to be inline with layout
         if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
            style.display = "inline-block";

         } else {
            style.zoom = 1;
         }
      }
   }

   if ( opts.overflow ) {
      style.overflow = "hidden";
      if ( !jQuery.support.shrinkWrapBlocks ) {
         anim.done(function() {
            style.overflow = opts.overflow[ 0 ];
            style.overflowX = opts.overflow[ 1 ];
            style.overflowY = opts.overflow[ 2 ];
         });
      }
   }


   // show/hide pass
   for ( index in props ) {
      value = props[ index ];
      if ( rfxtypes.exec( value ) ) {
         delete props[ index ];
         if ( value === ( hidden ? "hide" : "show" ) ) {
            continue;
         }
         handled.push( index );
      }
   }

   length = handled.length;
   if ( length ) {
      dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
      if ( hidden ) {
         jQuery( elem ).show();
      } else {
         anim.done(function() {
            jQuery( elem ).hide();
         });
      }
      anim.done(function() {
         var prop;
         jQuery.removeData( elem, "fxshow", true );
         for ( prop in orig ) {
            jQuery.style( elem, prop, orig[ prop ] );
         }
      });
      for ( index = 0 ; index < length ; index++ ) {
         prop = handled[ index ];
         tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
         orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

         if ( !( prop in dataShow ) ) {
            dataShow[ prop ] = tween.start;
            if ( hidden ) {
               tween.end = tween.start;
               tween.start = prop === "width" || prop === "height" ? 1 : 0;
            }
         }
      }
   }
}

function Tween( elem, options, prop, end, easing ) {
   return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
   constructor: Tween,
   init: function( elem, options, prop, end, easing, unit ) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || "swing";
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
   },
   cur: function() {
      var hooks = Tween.propHooks[ this.prop ];

      return hooks && hooks.get ?
         hooks.get( this ) :
         Tween.propHooks._default.get( this );
   },
   run: function( percent ) {
      var eased,
         hooks = Tween.propHooks[ this.prop ];

      if ( this.options.duration ) {
         this.pos = eased = jQuery.easing[ this.easing ](
            percent, this.options.duration * percent, 0, 1, this.options.duration
         );
      } else {
         this.pos = eased = percent;
      }
      this.now = ( this.end - this.start ) * eased + this.start;

      if ( this.options.step ) {
         this.options.step.call( this.elem, this.now, this );
      }

      if ( hooks && hooks.set ) {
         hooks.set( this );
      } else {
         Tween.propHooks._default.set( this );
      }
      return this;
   }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
   _default: {
      get: function( tween ) {
         var result;

         if ( tween.elem[ tween.prop ] != null &&
            (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
            return tween.elem[ tween.prop ];
         }

         // passing any value as a 4th parameter to .css will automatically
         // attempt a parseFloat and fallback to a string if the parse fails
         // so, simple values such as "10px" are parsed to Float.
         // complex values such as "rotate(1rad)" are returned as is.
         result = jQuery.css( tween.elem, tween.prop, false, "" );
         // Empty strings, null, undefined and "auto" are converted to 0.
         return !result || result === "auto" ? 0 : result;
      },
      set: function( tween ) {
         // use step hook for back compat - use cssHook if its there - use .style if its
         // available and use plain properties where available
         if ( jQuery.fx.step[ tween.prop ] ) {
            jQuery.fx.step[ tween.prop ]( tween );
         } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
            jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
         } else {
            tween.elem[ tween.prop ] = tween.now;
         }
      }
   }
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
   set: function( tween ) {
      if ( tween.elem.nodeType && tween.elem.parentNode ) {
         tween.elem[ tween.prop ] = tween.now;
      }
   }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
   var cssFn = jQuery.fn[ name ];
   jQuery.fn[ name ] = function( speed, easing, callback ) {
      return speed == null || typeof speed === "boolean" ||
         // special check for .toggle( handler, handler, ... )
         ( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
         cssFn.apply( this, arguments ) :
         this.animate( genFx( name, true ), speed, easing, callback );
   };
});

jQuery.fn.extend({
   fadeTo: function( speed, to, easing, callback ) {

      // show any hidden elements after setting opacity to 0
      return this.filter( isHidden ).css( "opacity", 0 ).show()

         // animate to the value specified
         .end().animate({ opacity: to }, speed, easing, callback );
   },
   animate: function( prop, speed, easing, callback ) {
      var empty = jQuery.isEmptyObject( prop ),
         optall = jQuery.speed( speed, easing, callback ),
         doAnimation = function() {
            // Operate on a copy of prop so per-property easing won't be lost
            var anim = Animation( this, jQuery.extend( {}, prop ), optall );

            // Empty animations resolve immediately
            if ( empty ) {
               anim.stop( true );
            }
         };

      return empty || optall.queue === false ?
         this.each( doAnimation ) :
         this.queue( optall.queue, doAnimation );
   },
   stop: function( type, clearQueue, gotoEnd ) {
      var stopQueue = function( hooks ) {
         var stop = hooks.stop;
         delete hooks.stop;
         stop( gotoEnd );
      };

      if ( typeof type !== "string" ) {
         gotoEnd = clearQueue;
         clearQueue = type;
         type = undefined;
      }
      if ( clearQueue && type !== false ) {
         this.queue( type || "fx", [] );
      }

      return this.each(function() {
         var dequeue = true,
            index = type != null && type + "queueHooks",
            timers = jQuery.timers,
            data = jQuery._data( this );

         if ( index ) {
            if ( data[ index ] && data[ index ].stop ) {
               stopQueue( data[ index ] );
            }
         } else {
            for ( index in data ) {
               if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                  stopQueue( data[ index ] );
               }
            }
         }

         for ( index = timers.length; index--; ) {
            if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
               timers[ index ].anim.stop( gotoEnd );
               dequeue = false;
               timers.splice( index, 1 );
            }
         }

         // start the next in the queue if the last step wasn't forced
         // timers currently will call their complete callbacks, which will dequeue
         // but only if they were gotoEnd
         if ( dequeue || !gotoEnd ) {
            jQuery.dequeue( this, type );
         }
      });
   }
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
   var which,
      attrs = { height: type },
      i = 0;

   // if we include width, step value is 1 to do all cssExpand values,
   // if we don't include width, step value is 2 to skip over Left and Right
   includeWidth = includeWidth? 1 : 0;
   for( ; i < 4 ; i += 2 - includeWidth ) {
      which = cssExpand[ i ];
      attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
   }

   if ( includeWidth ) {
      attrs.opacity = attrs.width = type;
   }

   return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
   slideDown: genFx("show"),
   slideUp: genFx("hide"),
   slideToggle: genFx("toggle"),
   fadeIn: { opacity: "show" },
   fadeOut: { opacity: "hide" },
   fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
   jQuery.fn[ name ] = function( speed, easing, callback ) {
      return this.animate( props, speed, easing, callback );
   };
});

jQuery.speed = function( speed, easing, fn ) {
   var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
      complete: fn || !fn && easing ||
         jQuery.isFunction( speed ) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
   };

   opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
      opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

   // normalize opt.queue - true/undefined/null -> "fx"
   if ( opt.queue == null || opt.queue === true ) {
      opt.queue = "fx";
   }

   // Queueing
   opt.old = opt.complete;

   opt.complete = function() {
      if ( jQuery.isFunction( opt.old ) ) {
         opt.old.call( this );
      }

      if ( opt.queue ) {
         jQuery.dequeue( this, opt.queue );
      }
   };

   return opt;
};

jQuery.easing = {
   linear: function( p ) {
      return p;
   },
   swing: function( p ) {
      return 0.5 - Math.cos( p*Math.PI ) / 2;
   }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
   var timer,
      timers = jQuery.timers,
      i = 0;

   for ( ; i < timers.length; i++ ) {
      timer = timers[ i ];
      // Checks the timer has not already been removed
      if ( !timer() && timers[ i ] === timer ) {
         timers.splice( i--, 1 );
      }
   }

   if ( !timers.length ) {
      jQuery.fx.stop();
   }
};

jQuery.fx.timer = function( timer ) {
   if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
      timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
   }
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
   clearInterval( timerId );
   timerId = null;
};

jQuery.fx.speeds = {
   slow: 600,
   fast: 200,
   // Default speed
   _default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
   jQuery.expr.filters.animated = function( elem ) {
      return jQuery.grep(jQuery.timers, function( fn ) {
         return elem === fn.elem;
      }).length;
   };
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
   if ( arguments.length ) {
      return options === undefined ?
         this :
         this.each(function( i ) {
            jQuery.offset.setOffset( this, options, i );
         });
   }

   var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
      box = { top: 0, left: 0 },
      elem = this[ 0 ],
      doc = elem && elem.ownerDocument;

   if ( !doc ) {
      return;
   }

   if ( (body = doc.body) === elem ) {
      return jQuery.offset.bodyOffset( elem );
   }

   docElem = doc.documentElement;

   // Make sure it's not a disconnected DOM node
   if ( !jQuery.contains( docElem, elem ) ) {
      return box;
   }

   // If we don't have gBCR, just use 0,0 rather than error
   // BlackBerry 5, iOS 3 (original iPhone)
   if ( typeof elem.getBoundingClientRect !== "undefined" ) {
      box = elem.getBoundingClientRect();
   }
   win = getWindow( doc );
   clientTop  = docElem.clientTop  || body.clientTop  || 0;
   clientLeft = docElem.clientLeft || body.clientLeft || 0;
   scrollTop  = win.pageYOffset || docElem.scrollTop;
   scrollLeft = win.pageXOffset || docElem.scrollLeft;
   return {
      top: box.top  + scrollTop  - clientTop,
      left: box.left + scrollLeft - clientLeft
   };
};

jQuery.offset = {

   bodyOffset: function( body ) {
      var top = body.offsetTop,
         left = body.offsetLeft;

      if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
         top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
         left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
      }

      return { top: top, left: left };
   },

   setOffset: function( elem, options, i ) {
      var position = jQuery.css( elem, "position" );

      // set position first, in-case top/left are set even on static elem
      if ( position === "static" ) {
         elem.style.position = "relative";
      }

      var curElem = jQuery( elem ),
         curOffset = curElem.offset(),
         curCSSTop = jQuery.css( elem, "top" ),
         curCSSLeft = jQuery.css( elem, "left" ),
         calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
         props = {}, curPosition = {}, curTop, curLeft;

      // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
      if ( calculatePosition ) {
         curPosition = curElem.position();
         curTop = curPosition.top;
         curLeft = curPosition.left;
      } else {
         curTop = parseFloat( curCSSTop ) || 0;
         curLeft = parseFloat( curCSSLeft ) || 0;
      }

      if ( jQuery.isFunction( options ) ) {
         options = options.call( elem, i, curOffset );
      }

      if ( options.top != null ) {
         props.top = ( options.top - curOffset.top ) + curTop;
      }
      if ( options.left != null ) {
         props.left = ( options.left - curOffset.left ) + curLeft;
      }

      if ( "using" in options ) {
         options.using.call( elem, props );
      } else {
         curElem.css( props );
      }
   }
};


jQuery.fn.extend({

   position: function() {
      if ( !this[0] ) {
         return;
      }

      var elem = this[0],

      // Get *real* offsetParent
      offsetParent = this.offsetParent(),

      // Get correct offsets
      offset       = this.offset(),
      parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
      offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

      // Add offsetParent borders
      parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
      parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

      // Subtract the two offsets
      return {
         top:  offset.top  - parentOffset.top,
         left: offset.left - parentOffset.left
      };
   },

   offsetParent: function() {
      return this.map(function() {
         var offsetParent = this.offsetParent || document.body;
         while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
            offsetParent = offsetParent.offsetParent;
         }
         return offsetParent || document.body;
      });
   }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
   var top = /Y/.test( prop );

   jQuery.fn[ method ] = function( val ) {
      return jQuery.access( this, function( elem, method, val ) {
         var win = getWindow( elem );

         if ( val === undefined ) {
            return win ? (prop in win) ? win[ prop ] :
               win.document.documentElement[ method ] :
               elem[ method ];
         }

         if ( win ) {
            win.scrollTo(
               !top ? val : jQuery( win ).scrollLeft(),
                top ? val : jQuery( win ).scrollTop()
            );

         } else {
            elem[ method ] = val;
         }
      }, method, val, arguments.length, null );
   };
});

function getWindow( elem ) {
   return jQuery.isWindow( elem ) ?
      elem :
      elem.nodeType === 9 ?
         elem.defaultView || elem.parentWindow :
         false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
   jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
      // margin is only for outerHeight, outerWidth
      jQuery.fn[ funcName ] = function( margin, value ) {
         var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
            extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

         return jQuery.access( this, function( elem, type, value ) {
            var doc;

            if ( jQuery.isWindow( elem ) ) {
               // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
               // isn't a whole lot we can do. See pull request at this URL for discussion:
               // https://github.com/jquery/jquery/pull/764
               return elem.document.documentElement[ "client" + name ];
            }

            // Get document width or height
            if ( elem.nodeType === 9 ) {
               doc = elem.documentElement;

               // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
               // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
               return Math.max(
                  elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                  elem.body[ "offset" + name ], doc[ "offset" + name ],
                  doc[ "client" + name ]
               );
            }

            return value === undefined ?
               // Get width or height on the element, requesting but not forcing parseFloat
               jQuery.css( elem, type, value, extra ) :

               // Set width or height on the element
               jQuery.style( elem, type, value, extra );
         }, type, chainable ? margin : undefined, chainable, null );
      };
   });
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
   define( "jquery", [], function () { return jQuery; } );
}

})( window );
// Knockout JavaScript library v2.1.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function(window,document,navigator,undefined){
var DEBUG=true;
!function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
	var tokens = koPath.split(".");

	// In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
	// At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
	var target = ko;

	for (var i = 0; i < tokens.length - 1; i++)
		target = target[tokens[i]];
	target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
  owner[publicName] = object;
};
ko.version = "2.1.0";

ko.exportSymbol('version', ko.version);
ko.utils = new (function () {
    var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = /Firefox\/2/i.test(navigator.userAgent) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    for (var eventType in knownEvents) {
        var knownEventsForType = knownEvents[eventType];
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    }
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    var ieVersion = (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        );
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i]);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i]))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index >= 0)
                array.splice(index, 1);
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i]));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i]))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        extend: function (target, source) {
            if (source) {
                for(var prop in source) {
                    if(source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);

            var container = document.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                ko.cleanNode(nodesArray[i]);
                container.appendChild(nodesArray[i]);
            }
            return container;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (navigator.userAgent.indexOf("MSIE 6") >= 0)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return (string || "").replace(stringTrimRegex, "");
        },

        stringTokenize: function (string, delimiter) {
            var result = [];
            var tokens = (string || "").split(delimiter);
            for (var i = 0, j = tokens.length; i < j; i++) {
                var trimmed = ko.utils.stringTrim(tokens[i]);
                if (trimmed !== "")
                    result.push(trimmed);
            }
            return result;
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        buildEvalWithinScopeFunction: function (expression, scopeLevels) {
            // Build the source for a function that evaluates "expression"
            // For each scope variable, add an extra level of "with" nesting
            // Example result: with(sc[1]) { with(sc[0]) { return (expression) } }
            var functionBody = "return (" + expression + ")";
            for (var i = 0; i < scopeLevels; i++) {
                functionBody = "with(sc[" + i + "]) { " + functionBody + " } ";
            }
            return new Function("sc", functionBody);
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node != null) {
                if (node == containedByNode)
                    return true;
                node = node.parentNode;
            }
            return false;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        registerEventHandler: function (element, eventType, handler) {
            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!mustUseAttachEvent && typeof jQuery != "undefined") {
                if (isClickOnCheckableElement(element, eventType)) {
                    // For click events on checkboxes, jQuery interferes with the event handling in an awkward way:
                    // it toggles the element checked state *after* the click event handlers run, whereas native
                    // click events toggle the checked state *before* the event handler.
                    // Fix this by intecepting the handler and applying the correct checkedness before it runs.
                    var originalHandler = handler;
                    handler = function(event, eventData) {
                        var jQuerySuppliedCheckedState = this.checked;
                        if (eventData)
                            this.checked = eventData.checkedStateBeforeEvent !== true;
                        originalHandler.call(this, event);
                        this.checked = jQuerySuppliedCheckedState; // Restore the state jQuery applied
                    };
                }
                jQuery(element)['bind'](eventType, handler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined")
                element.attachEvent("on" + eventType, function (event) {
                    handler.call(element, event);
                });
            else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            if (typeof jQuery != "undefined") {
                var eventData = [];
                if (isClickOnCheckableElement(element, eventType)) {
                    // Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
                    eventData.push({ checkedStateBeforeEvent: element.checked });
                }
                jQuery(element)['trigger'](eventType, eventData);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (typeof element.fireEvent != "undefined") {
                // Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
                // so to make it consistent, we'll do it manually here
                if (isClickOnCheckableElement(element, eventType))
                    element.checked = element.checked !== true;
                element.fireEvent("on" + eventType);
            }
            else
                throw new Error("Browser doesn't support triggering events");
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        toggleDomNodeCssClass: function (node, className, shouldHaveClass) {
            var currentClassNames = (node.className || "").split(/\s+/);
            var hasClass = ko.utils.arrayIndexOf(currentClassNames, className) >= 0;

            if (shouldHaveClass && !hasClass) {
                node.className += (currentClassNames[0] ? " " : "") + className;
            } else if (hasClass && !shouldHaveClass) {
                var newClassName = "";
                for (var i = 0; i < currentClassNames.length; i++)
                    if (currentClassNames[i] != className)
                        newClassName += currentClassNames[i] + " ";
                node.className = ko.utils.stringTrim(newClassName);
            }
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            'innerText' in element ? element.innerText = value
                                   : element.textContent = value;

            if (ieVersion >= 9) {
                // Believe it or not, this actually fixes an IE9 rendering bug
                // (See https://github.com/SteveSanderson/knockout/issues/209)
                element.style.display = element.style.display;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            if (ieVersion >= 9) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (window.JSON && window.JSON.parse) // Use native parsing where available
                        return window.JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined"))
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                var input = document.createElement("input");
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            for (var key in params) {
                var input = document.createElement("input");
                input.name = key;
                input.value = params[key];
                form.appendChild(input);
            }
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
})();

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};
    return {
        get: function (node, key) {
            var allDataForNode = ko.utils.domData.getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (ko.utils.domData.getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = ko.utils.domData.getAll(node, true);
            allDataForNode[key] = value;
        },
        getAll: function (node, createIfNotFound) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null");
            if (!hasExistingDataStore) {
                if (!createIfNotFound)
                    return undefined;
                dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                dataStore[dataStoreKey] = {};
            }
            return dataStore[dataStoreKey];
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
            }
        }
    }
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Also erase the DOM data
        ko.utils.domData.clear(node);

        // Special support for jQuery here because it's so commonly used.
        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
        // so notify it to tear down any resources associated with the node & descendants here.
        if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function"))
            jQuery['cleanData']([node]);

        // Also clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        }
    }
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html) {
        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /* anything else */                                 [0, "", ""];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof window['innerShiv'] == "function") {
            div.appendChild(window['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // Move to the right depth
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html) {
        var elems = jQuery['clean']([html]);

        // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
        // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
        // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
        if (elems && elems[0]) {
            // Find the top-most parent element that's a direct child of a document fragment
            var elem = elems[0];
            while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                elem = elem.parentNode;
            // ... then detach it
            if (elem.parentNode)
                elem.parentNode.removeChild(elem);
        }

        return elems;
    }

    ko.utils.parseHtmlFragment = function(html) {
        return typeof jQuery != 'undefined' ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                                            : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (typeof jQuery != 'undefined') {
                jQuery(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always"
            ? function() { return false } // Treat all values as not equal
            : ko.observable["fn"]["equalityComparer"];
        return target;
    }
};

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        for (var key in requestedExtenders) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, requestedExtenders[key]);
            }
        }
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    this._subscriptions = {};

    ko.utils.extend(this, ko.subscribable['fn']);
    ko.exportProperty(this, 'subscribe', this.subscribe);
    ko.exportProperty(this, 'extend', this.extend);
    ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
}

var defaultEvent = "change";

ko.subscribable['fn'] = {
    subscribe: function (callback, callbackTarget, event) {
        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(this, boundCallback, function () {
            ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
        }.bind(this));

        if (!this._subscriptions[event])
            this._subscriptions[event] = [];
        this._subscriptions[event].push(subscription);
        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (this._subscriptions[event]) {
            ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
                // In case a subscription was disposed during the arrayForEach cycle, check
                // for isDisposed on each subscription before invoking its callback
                if (subscription && (subscription.isDisposed !== true))
                    subscription.callback(valueToNotify);
            });
        }
    },

    getSubscriptionsCount: function () {
        var total = 0;
        for (var eventName in this._subscriptions) {
            if (this._subscriptions.hasOwnProperty(eventName))
                total += this._subscriptions[eventName].length;
        }
        return total;
    },

    extend: applyExtenders
};


ko.isSubscribable = function (instance) {
    return typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.dependencyDetection = (function () {
    var _frames = [];

    return {
        begin: function (callback) {
            _frames.push({ callback: callback, distinctDependencies:[] });
        },

        end: function () {
            _frames.pop();
        },

        registerDependency: function (subscribable) {
            if (!ko.isSubscribable(subscribable))
                throw new Error("Only subscribable things can act as dependencies");
            if (_frames.length > 0) {
                var topFrame = _frames[_frames.length - 1];
                if (ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
                    return;
                topFrame.distinctDependencies.push(subscribable);
                topFrame.callback(subscribable);
            }
        }
    };
})();
var primitiveTypes = { 'undefined':true, 'boolean':true, 'number':true, 'string':true };

ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if ((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
                if (DEBUG) observable._latestValue = _latestValue;
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return _latestValue;
        }
    }
    if (DEBUG) observable._latestValue = _latestValue;
    ko.subscribable.call(observable);
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
    ko.utils.extend(observable, ko.observable['fn']);

    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

    return observable;
}

ko.observable['fn'] = {
    "equalityComparer": function valuesArePrimitiveAndEqual(a, b) {
        var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
        return oldValueIsPrimitive ? (a === b) : false;
    }
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    if (arguments.length == 0) {
        // Zero-parameter constructor initializes to empty array
        initialValues = [];
    }
    if ((initialValues !== null) && (initialValues !== undefined) && !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.extend(result, ko.observableArray['fn']);
    return result;
}

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this();
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this()[index] = newItem;
            this.valueHasMutated();
        }
    }
}

// Populate ko.observableArray.fn with read/write functions from native arrays
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        this.valueWillMutate();
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

ko.exportSymbol('observableArray', ko.observableArray);
ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue,
        _hasBeenEvaluated = false,
        _isBeingEvaluated = false,
        readFunction = evaluatorFunctionOrOptions;

    if (readFunction && typeof readFunction == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = readFunction;
        readFunction = options["read"];
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (!readFunction)
            readFunction = options["read"];
    }
    // By here, "options" is always non-null
    if (typeof readFunction != "function")
        throw new Error("Pass a function that returns the value of the ko.computed");

    var writeFunction = options["write"];
    if (!evaluatorFunctionTarget)
        evaluatorFunctionTarget = options["owner"];

    var _subscriptionsToDependencies = [];
    function disposeAllSubscriptionsToDependencies() {
        ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = [];
    }
    var dispose = disposeAllSubscriptionsToDependencies;

    // Build "disposeWhenNodeIsRemoved" and "disposeWhenNodeIsRemovedCallback" option values
    // (Note: "disposeWhenNodeIsRemoved" option both proactively disposes as soon as the node is removed using ko.removeNode(),
    // plus adds a "disposeWhen" callback that, on each evaluation, disposes if the node was removed by some other means.)
    var disposeWhenNodeIsRemoved = (typeof options["disposeWhenNodeIsRemoved"] == "object") ? options["disposeWhenNodeIsRemoved"] : null;
    var disposeWhen = options["disposeWhen"] || function() { return false; };
    if (disposeWhenNodeIsRemoved) {
        dispose = function() {
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, arguments.callee);
            disposeAllSubscriptionsToDependencies();
        };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
        var existingDisposeWhenFunction = disposeWhen;
        disposeWhen = function () {
            return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || existingDisposeWhenFunction();
        }
    }

    var evaluationTimeoutInstance = null;
    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else
            evaluateImmediate();
    }

    function evaluateImmediate() {
        if (_isBeingEvaluated) {
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Don't dispose on first evaluation, because the "disposeWhen" callback might
        // e.g., dispose when the associated DOM element isn't in the doc, and it's not
        // going to be in the doc until *after* the first evaluation
        if (_hasBeenEvaluated && disposeWhen()) {
            dispose();
            return;
        }

        _isBeingEvaluated = true;
        try {
            // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
            // Then, during evaluation, we cross off any that are in fact still being used.
            var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function(item) {return item.target;});

            ko.dependencyDetection.begin(function(subscribable) {
                var inOld;
                if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0)
                    disposalCandidates[inOld] = undefined; // Don't want to dispose this subscription, as it's still being used
                else
                    _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync)); // Brand new subscription - add it
            });

            var newValue = readFunction.call(evaluatorFunctionTarget);

            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
            for (var i = disposalCandidates.length - 1; i >= 0; i--) {
                if (disposalCandidates[i])
                    _subscriptionsToDependencies.splice(i, 1)[0].dispose();
            }
            _hasBeenEvaluated = true;

            dependentObservable["notifySubscribers"](_latestValue, "beforeChange");
            _latestValue = newValue;
            if (DEBUG) dependentObservable._latestValue = _latestValue;
        } finally {
            ko.dependencyDetection.end();
        }

        dependentObservable["notifySubscribers"](_latestValue);
        _isBeingEvaluated = false;

    }

    function dependentObservable() {
        if (arguments.length > 0) {
            set.apply(dependentObservable, arguments);
        } else {
            return get();
        }
    }

    function set() {
        if (typeof writeFunction === "function") {
            // Writing a value
            writeFunction.apply(evaluatorFunctionTarget, arguments);
        } else {
            throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
        }
    }

    function get() {
        // Reading the value
        if (!_hasBeenEvaluated)
            evaluateImmediate();
        ko.dependencyDetection.registerDependency(dependentObservable);
        return _latestValue;
    }

    dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; };
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () { dispose(); };

    ko.subscribable.call(dependentObservable);
    ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

    if (options['deferEvaluation'] !== true)
        evaluateImmediate();

    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

    return dependentObservable;
};

ko.isComputed = function(instance) {
    return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
ko.exportSymbol('isComputed', ko.isComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject)
                visitorCallback(propertyName);
        }
    };

    function objectLookup() {
        var keys = [];
        var values = [];
        this.save = function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            if (existingIndex >= 0)
                values[existingIndex] = value;
            else {
                keys.push(key);
                values.push(value);
            }
        };
        this.get = function(key) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            return (existingIndex >= 0) ? values[existingIndex] : undefined;
        };
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return element.getAttribute("value");
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    for (var i = element.options.length - 1; i >= 0; i--) {
                        if (ko.selectExtensions.readValue(element.options[i]) == value) {
                            element.selectedIndex = i;
                            break;
                        }
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);

ko.jsonExpressionRewriting = (function () {
    var restoreCapturedTokensRegex = /\@ko_token_(\d+)\@/g;
    var javaScriptAssignmentTarget = /^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i;
    var javaScriptReservedWords = ["true", "false"];

    function restoreTokens(string, tokens) {
        var prevValue = null;
        while (string != prevValue) { // Keep restoring tokens until it no longer makes a difference (they may be nested)
            prevValue = string;
            string = string.replace(restoreCapturedTokensRegex, function (match, tokenIndex) {
                return tokens[tokenIndex];
            });
        }
        return string;
    }

    function isWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, ko.utils.stringTrim(expression).toLowerCase()) >= 0)
            return false;
        return expression.match(javaScriptAssignmentTarget) !== null;
    }

    function ensureQuoted(key) {
        var trimmedKey = ko.utils.stringTrim(key);
        switch (trimmedKey.length && trimmedKey.charAt(0)) {
            case "'":
            case '"':
                return key;
            default:
                return "'" + trimmedKey + "'";
        }
    }

    return {
        bindingRewriteValidators: [],

        parseObjectLiteral: function(objectLiteralString) {
            // A full tokeniser+lexer would add too much weight to this library, so here's a simple parser
            // that is sufficient just to split an object literal string into a set of top-level key-value pairs

            var str = ko.utils.stringTrim(objectLiteralString);
            if (str.length < 3)
                return [];
            if (str.charAt(0) === "{")// Ignore any braces surrounding the whole object literal
                str = str.substring(1, str.length - 1);

            // Pull out any string literals and regex literals
            var tokens = [];
            var tokenStart = null, tokenEndChar;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case '"':
                        case "'":
                        case "/":
                            tokenStart = position;
                            tokenEndChar = c;
                            break;
                    }
                } else if ((c == tokenEndChar) && (str.charAt(position - 1) !== "\\")) {
                    var token = str.substring(tokenStart, position + 1);
                    tokens.push(token);
                    var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                    str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                    position -= (token.length - replacement.length);
                    tokenStart = null;
                }
            }

            // Next pull out balanced paren, brace, and bracket blocks
            tokenStart = null;
            tokenEndChar = null;
            var tokenDepth = 0, tokenStartChar = null;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case "{": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "}";
                                  break;
                        case "(": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = ")";
                                  break;
                        case "[": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "]";
                                  break;
                    }
                }

                if (c === tokenStartChar)
                    tokenDepth++;
                else if (c === tokenEndChar) {
                    tokenDepth--;
                    if (tokenDepth === 0) {
                        var token = str.substring(tokenStart, position + 1);
                        tokens.push(token);
                        var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                        str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                        position -= (token.length - replacement.length);
                        tokenStart = null;
                    }
                }
            }

            // Now we can safely split on commas to get the key/value pairs
            var result = [];
            var keyValuePairs = str.split(",");
            for (var i = 0, j = keyValuePairs.length; i < j; i++) {
                var pair = keyValuePairs[i];
                var colonPos = pair.indexOf(":");
                if ((colonPos > 0) && (colonPos < pair.length - 1)) {
                    var key = pair.substring(0, colonPos);
                    var value = pair.substring(colonPos + 1);
                    result.push({ 'key': restoreTokens(key, tokens), 'value': restoreTokens(value, tokens) });
                } else {
                    result.push({ 'unknown': restoreTokens(pair, tokens) });
                }
            }
            return result;
        },

        insertPropertyAccessorsIntoJson: function (objectLiteralStringOrKeyValueArray) {
            var keyValueArray = typeof objectLiteralStringOrKeyValueArray === "string"
                ? ko.jsonExpressionRewriting.parseObjectLiteral(objectLiteralStringOrKeyValueArray)
                : objectLiteralStringOrKeyValueArray;
            var resultStrings = [], propertyAccessorResultStrings = [];

            var keyValueEntry;
            for (var i = 0; keyValueEntry = keyValueArray[i]; i++) {
                if (resultStrings.length > 0)
                    resultStrings.push(",");

                if (keyValueEntry['key']) {
                    var quotedKey = ensureQuoted(keyValueEntry['key']), val = keyValueEntry['value'];
                    resultStrings.push(quotedKey);
                    resultStrings.push(":");
                    resultStrings.push(val);

                    if (isWriteableValue(ko.utils.stringTrim(val))) {
                        if (propertyAccessorResultStrings.length > 0)
                            propertyAccessorResultStrings.push(", ");
                        propertyAccessorResultStrings.push(quotedKey + " : function(__ko_value) { " + val + " = __ko_value; }");
                    }
                } else if (keyValueEntry['unknown']) {
                    resultStrings.push(keyValueEntry['unknown']);
                }
            }

            var combinedResult = resultStrings.join("");
            if (propertyAccessorResultStrings.length > 0) {
                var allPropertyAccessors = propertyAccessorResultStrings.join("");
                combinedResult = combinedResult + ", '_ko_property_writers' : { " + allPropertyAccessors + " } ";
            }

            return combinedResult;
        },

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (ko.utils.stringTrim(keyValueArray[i]['key']) == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindingsAccessor: All bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindingsAccessor, key, value, checkIfDifferent) {
            if (!property || !ko.isWriteableObservable(property)) {
                var propWriters = allBindingsAccessor()['_ko_property_writers'];
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (!checkIfDifferent || property() !== value) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('jsonExpressionRewriting', ko.jsonExpressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.bindingRewriteValidators', ko.jsonExpressionRewriting.bindingRewriteValidators);
ko.exportSymbol('jsonExpressionRewriting.parseObjectLiteral', ko.jsonExpressionRewriting.parseObjectLiteral);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko\s+(.*\:.*)\s*-->$/ : /^\s*ko\s+(.*\:.*)\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        virtualNodeBindingValue: function(node) {
            var regexMatch = isStartComment(node);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName) != null;   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node) != null; // Comment node
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext);
            return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext) : null;
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext) {
            try {
                var viewModel = bindingContext['$data'],
                    scopes = (typeof viewModel == 'object' && viewModel != null) ? [viewModel, bindingContext] : [bindingContext],
                    bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, scopes.length, this.bindingCache);
                return bindingFunction(scopes);
            } catch (ex) {
                throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString);
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, scopesCount, cache) {
        var cacheKey = scopesCount + '_' + bindingsString;
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, scopesCount));
    }

    function createBindingsStringEvaluator(bindingsString, scopesCount) {
        var rewrittenBindings = " { " + ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(bindingsString) + " } ";
        return ko.utils.buildEvalWithinScopeFunction(rewrittenBindings, scopesCount);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    ko.bindingContext = function(dataItem, parentBindingContext) {
        if (parentBindingContext) {
            ko.utils.extend(this, parentBindingContext); // Inherit $root and any custom properties
            this['$parentContext'] = parentBindingContext;
            this['$parent'] = parentBindingContext['$data'];
            this['$parents'] = (parentBindingContext['$parents'] || []).slice(0);
            this['$parents'].unshift(this['$parent']);
        } else {
            this['$parents'] = [];
            this['$root'] = dataItem;
        }
        this['$data'] = dataItem;
    }
    ko.bindingContext.prototype['createChildContext'] = function (dataItem) {
        return new ko.bindingContext(dataItem, this);
    };
    ko.bindingContext.prototype['extend'] = function(properties) {
        var clone = ko.utils.extend(new ko.bindingContext(), this);
        return ko.utils.extend(clone, properties);
    };

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (viewModel, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild, nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(viewModel, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (viewModel, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, viewModel, bindingContextMayDifferFromDomParentElement).shouldBindDescendants;

        if (shouldBindDescendants) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(viewModel, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    function applyBindingsToNodeInternal (node, bindings, viewModelOrBindingContext, bindingContextMayDifferFromDomParentElement) {
        // Need to be sure that inits are only run once, and updates never run until all the inits have been run
        var initPhase = 0; // 0 = before all inits, 1 = during inits, 2 = after all inits

        // Each time the dependentObservable is evaluated (after data changes),
        // the binding attribute is reparsed so that it can pick out the correct
        // model properties in the context of the changed data.
        // DOM event callbacks need to be able to access this changed data,
        // so we need a single parsedBindings variable (shared by all callbacks
        // associated with this node's bindings) that all the closures can access.
        var parsedBindings;
        function makeValueAccessor(bindingKey) {
            return function () { return parsedBindings[bindingKey] }
        }
        function parsedBindingsAccessor() {
            return parsedBindings;
        }

        var bindingHandlerThatControlsDescendantBindings;
        ko.dependentObservable(
            function () {
                // Ensure we have a nonnull binding context to work with
                var bindingContextInstance = viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
                    ? viewModelOrBindingContext
                    : new ko.bindingContext(ko.utils.unwrapObservable(viewModelOrBindingContext));
                var viewModel = bindingContextInstance['$data'];

                // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
                // we can easily recover it just by scanning up the node's ancestors in the DOM
                // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
                if (bindingContextMayDifferFromDomParentElement)
                    ko.storedBindingContextForNode(node, bindingContextInstance);

                // Use evaluatedBindings if given, otherwise fall back on asking the bindings provider to give us some bindings
                var evaluatedBindings = (typeof bindings == "function") ? bindings() : bindings;
                parsedBindings = evaluatedBindings || ko.bindingProvider['instance']['getBindings'](node, bindingContextInstance);

                if (parsedBindings) {
                    // First run all the inits, so bindings can register for notification on changes
                    if (initPhase === 0) {
                        initPhase = 1;
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && node.nodeType === 8)
                                validateThatBindingIsAllowedForVirtualElements(bindingKey);

                            if (binding && typeof binding["init"] == "function") {
                                var handlerInitFn = binding["init"];
                                var initResult = handlerInitFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);

                                // If this binding handler claims to control descendant bindings, make a note of this
                                if (initResult && initResult['controlsDescendantBindings']) {
                                    if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                        throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                    bindingHandlerThatControlsDescendantBindings = bindingKey;
                                }
                            }
                        }
                        initPhase = 2;
                    }

                    // ... then run all the updates, which might trigger changes even on the first evaluation
                    if (initPhase === 2) {
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && typeof binding["update"] == "function") {
                                var handlerUpdateFn = binding["update"];
                                handlerUpdateFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
                            }
                        }
                    }
                }
            },
            null,
            { 'disposeWhenNodeIsRemoved' : node }
        );

        return {
            shouldBindDescendants: bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = "__ko_bindingContext__";
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2)
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
        else
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
    }

    ko.applyBindingsToNode = function (node, bindings, viewModel) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, viewModel, true);
    };

    ko.applyBindingsToDescendants = function(viewModel, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(viewModel, rootNode, true);
    };

    ko.applyBindings = function (viewModel, rootNode) {
        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
var eventHandlersWithShortcuts = ['click'];
ko.utils.arrayForEach(eventHandlersWithShortcuts, function(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
        }
    }
});


ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var eventsToHandle = valueAccessor() || {};
        for(var eventNameOutsideClosure in eventsToHandle) {
            (function() {
                var eventName = eventNameOutsideClosure; // Separate variable to be captured by event handler closure
                if (typeof eventName == "string") {
                    ko.utils.registerEventHandler(element, eventName, function (event) {
                        var handlerReturnValue;
                        var handlerFunction = valueAccessor()[eventName];
                        if (!handlerFunction)
                            return;
                        var allBindings = allBindingsAccessor();

                        try {
                            // Take all the event args, and prefix with the viewmodel
                            var argsForHandler = ko.utils.makeArray(arguments);
                            argsForHandler.unshift(viewModel);
                            handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                        } finally {
                            if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                if (event.preventDefault)
                                    event.preventDefault();
                                else
                                    event.returnValue = false;
                            }
                        }

                        var bubble = allBindings[eventName + 'Bubble'] !== false;
                        if (!bubble) {
                            event.cancelBubble = true;
                            if (event.stopPropagation)
                                event.stopPropagation();
                        }
                    });
                }
            })();
        }
    }
};

ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(viewModel, element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};

ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
}

ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};

function ensureDropdownSelectionIsConsistentWithModelValue(element, modelValue, preferModelValue) {
    if (preferModelValue) {
        if (modelValue !== ko.selectExtensions.readValue(element))
            ko.selectExtensions.writeValue(element, modelValue);
    }

    // No matter which direction we're syncing in, we want the end result to be equality between dropdown value and model value.
    // If they aren't equal, either we prefer the dropdown value, or the model value couldn't be represented, so either way,
    // change the model value to match the dropdown.
    if (modelValue !== ko.selectExtensions.readValue(element))
        ko.utils.triggerEvent(element, "change");
};

ko.bindingHandlers['value'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindingsAccessor()["valueUpdate"];
        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'value', elementValue, /* checkIfDifferent: */ true);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            var propertyChangedFired = false;
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    propertyChangedFired = false;
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() { setTimeout(valueUpdateHandler, 0) };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });
    },
    'update': function (element, valueAccessor) {
        var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
        var newValue = ko.utils.unwrapObservable(valueAccessor());
        var elementValue = ko.selectExtensions.readValue(element);
        var valueHasChanged = (newValue != elementValue);

        // JavaScript's 0 == "" behavious is unfortunate here as it prevents writing 0 to an empty text box (loose equality suggests the values are the same).
        // We don't want to do a strict equality comparison as that is more confusing for developers in certain cases, so we specifically special case 0 != "" here.
        if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0"))
            valueHasChanged = true;

        if (valueHasChanged) {
            var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
            applyValueAction();

            // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
            // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
            // to apply the value as well.
            var alsoApplyAsynchronously = valueIsSelectOption;
            if (alsoApplyAsynchronously)
                setTimeout(applyValueAction, 0);
        }

        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
        // because you're not allowed to have a model value that disagrees with a visible UI selection.
        if (valueIsSelectOption && (element.length > 0))
            ensureDropdownSelectionIsConsistentWithModelValue(element, newValue, /* preferModelValue */ false);
    }
};

ko.bindingHandlers['options'] = {
    'update': function (element, valueAccessor, allBindingsAccessor) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        var selectWasPreviouslyEmpty = element.length == 0;
        var previousSelectedValues = ko.utils.arrayMap(ko.utils.arrayFilter(element.childNodes, function (node) {
            return node.tagName && (ko.utils.tagNameLower(node) === "option") && node.selected;
        }), function (node) {
            return ko.selectExtensions.readValue(node) || node.innerText || node.textContent;
        });
        var previousScrollTop = element.scrollTop;

        var value = ko.utils.unwrapObservable(valueAccessor());
        var selectedValue = element.value;

        // Remove all existing <option>s.
        // Need to use .remove() rather than .removeChild() for <option>s otherwise IE behaves oddly (https://github.com/SteveSanderson/knockout/issues/134)
        while (element.length > 0) {
            ko.cleanNode(element.options[0]);
            element.remove(0);
        }

        if (value) {
            var allBindings = allBindingsAccessor();
            if (typeof value.length != "number")
                value = [value];
            if (allBindings['optionsCaption']) {
                var option = document.createElement("option");
                ko.utils.setHtml(option, allBindings['optionsCaption']);
                ko.selectExtensions.writeValue(option, undefined);
                element.appendChild(option);
            }
            for (var i = 0, j = value.length; i < j; i++) {
                var option = document.createElement("option");

                // Apply a value to the option element
                var optionValue = typeof allBindings['optionsValue'] == "string" ? value[i][allBindings['optionsValue']] : value[i];
                optionValue = ko.utils.unwrapObservable(optionValue);
                ko.selectExtensions.writeValue(option, optionValue);

                // Apply some text to the option element
                var optionsTextValue = allBindings['optionsText'];
                var optionText;
                if (typeof optionsTextValue == "function")
                    optionText = optionsTextValue(value[i]); // Given a function; run it against the data value
                else if (typeof optionsTextValue == "string")
                    optionText = value[i][optionsTextValue]; // Given a string; treat it as a property name on the data value
                else
                    optionText = optionValue;				 // Given no optionsText arg; use the data value itself
                if ((optionText === null) || (optionText === undefined))
                    optionText = "";

                ko.utils.setTextContent(option, optionText);

                element.appendChild(option);
            }

            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
            // That's why we first added them without selection. Now it's time to set the selection.
            var newOptions = element.getElementsByTagName("option");
            var countSelectionsRetained = 0;
            for (var i = 0, j = newOptions.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[i])) >= 0) {
                    ko.utils.setOptionNodeSelectionState(newOptions[i], true);
                    countSelectionsRetained++;
                }
            }

            element.scrollTop = previousScrollTop;

            if (selectWasPreviouslyEmpty && ('value' in allBindings)) {
                // Ensure consistency between model value and selected option.
                // If the dropdown is being populated for the first time here (or was otherwise previously empty),
                // the dropdown selection state is meaningless, so we preserve the model value.
                ensureDropdownSelectionIsConsistentWithModelValue(element, ko.utils.unwrapObservable(allBindings['value']), /* preferModelValue */ true);
            }

            // Workaround for IE9 bug
            ko.utils.ensureSelectElementIsRenderedCorrectly(element);
        }
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = '__ko.optionValueDomData__';

ko.bindingHandlers['selectedOptions'] = {
    getSelectedValuesFromSelectNode: function (selectNode) {
        var result = [];
        var nodes = selectNode.childNodes;
        for (var i = 0, j = nodes.length; i < j; i++) {
            var node = nodes[i], tagName = ko.utils.tagNameLower(node);
            if (tagName == "option" && node.selected)
                result.push(ko.selectExtensions.readValue(node));
            else if (tagName == "optgroup") {
                var selectedValuesFromOptGroup = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(node);
                Array.prototype.splice.apply(result, [result.length, 0].concat(selectedValuesFromOptGroup)); // Add new entries to existing 'result' instance
            }
        }
        return result;
    },
    'init': function (element, valueAccessor, allBindingsAccessor) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor();
            var valueToWrite = ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(this);
            ko.jsonExpressionRewriting.writeValueToProperty(value, allBindingsAccessor, 'value', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (newValue && typeof newValue.length == "number") {
            var nodes = element.childNodes;
            for (var i = 0, j = nodes.length; i < j; i++) {
                var node = nodes[i];
                if (ko.utils.tagNameLower(node) === "option")
                    ko.utils.setOptionNodeSelectionState(node, ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0);
            }
        }
    }
};

ko.bindingHandlers['text'] = {
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};

ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        ko.utils.setHtml(element, value);
    }
};

ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        for (var className in value) {
            if (typeof className == "string") {
                var shouldHaveClass = ko.utils.unwrapObservable(value[className]);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            }
        }
    }
};

ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        for (var styleName in value) {
            if (typeof styleName == "string") {
                var styleValue = ko.utils.unwrapObservable(value[styleName]);
                element.style[styleName] = styleValue || ""; // Empty string removes the value, whereas null/undefined have no effect
            }
        }
    }
};

ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            element.name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ko.utils.isIe6 || ko.utils.isIe7)
                element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;

ko.bindingHandlers['checked'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        var updateHandler = function() {
            var valueToWrite;
            if (element.type == "checkbox") {
                valueToWrite = element.checked;
            } else if ((element.type == "radio") && (element.checked)) {
                valueToWrite = element.value;
            } else {
                return; // "checked" binding only responds to checkboxes and selected radio buttons
            }

            var modelValue = valueAccessor();
            if ((element.type == "checkbox") && (ko.utils.unwrapObservable(modelValue) instanceof Array)) {
                // For checkboxes bound to an array, we add/remove the checkbox value to that array
                // This works for both observable and non-observable arrays
                var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), element.value);
                if (element.checked && (existingEntryIndex < 0))
                    modelValue.push(element.value);
                else if ((!element.checked) && (existingEntryIndex >= 0))
                    modelValue.splice(existingEntryIndex, 1);
            } else {
                ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'checked', valueToWrite, true);
            }
        };
        ko.utils.registerEventHandler(element, "click", updateHandler);

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if ((element.type == "radio") && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        if (element.type == "checkbox") {
            if (value instanceof Array) {
                // When bound to an array, the checkbox being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0;
            } else {
                // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                element.checked = value;
            }
        } else if (element.type == "radio") {
            element.checked = (element.value == value);
        }
    }
};

var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        for (var attrName in value) {
            if (typeof attrName == "string") {
                var attrValue = ko.utils.unwrapObservable(value[attrName]);

                // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
                // when someProp is a "no value"-like value (strictly null, false, or undefined)
                // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
                var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
                if (toRemove)
                    element.removeAttribute(attrName);

                // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
                // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
                // but instead of figuring out the mode, we'll just set the attribute through the Javascript
                // property for IE <= 8.
                if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                    attrName = attrHtmlToJavascriptMap[attrName];
                    if (toRemove)
                        element.removeAttribute(attrName);
                    else
                        element[attrName] = attrValue;
                } else if (!toRemove) {
                    element.setAttribute(attrName, attrValue.toString());
                }
            }
        }
    }
};

ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindingsAccessor) {
        var writeValue = function(valueToWrite) {
            var modelValue = valueAccessor();
            ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'hasfocus', valueToWrite, true);
        };
        ko.utils.registerEventHandler(element, "focus", function() { writeValue(true) });
        ko.utils.registerEventHandler(element, "focusin", function() { writeValue(true) }); // For IE
        ko.utils.registerEventHandler(element, "blur",  function() { writeValue(false) });
        ko.utils.registerEventHandler(element, "focusout",  function() { writeValue(false) }); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        value ? element.focus() : element.blur();
        ko.utils.triggerEvent(element, value ? "focusin" : "focusout"); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
    }
};

// "with: someExpression" is equivalent to "template: { if: someExpression, data: someExpression }"
ko.bindingHandlers['with'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { var value = valueAccessor(); return { 'if': value, 'data': value, 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['with'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['with'] = true;

// "if: someExpression" is equivalent to "template: { if: someExpression }"
ko.bindingHandlers['if'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { return { 'if': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['if'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['if'] = true;

// "ifnot: someExpression" is equivalent to "template: { ifnot: someExpression }"
ko.bindingHandlers['ifnot'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() { return { 'ifnot': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['ifnot'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['ifnot'] = true;

// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());

            // If bindingValue is the array, just pass it on its own
            if ((!bindingValue) || typeof bindingValue.length == "number")
                return { 'foreach': bindingValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If bindingValue.data is the array, preserve all relevant options
            return {
                'foreach': bindingValue['data'],
                'includeDestroyed': bindingValue['includeDestroyed'],
                'afterAdd': bindingValue['afterAdd'],
                'beforeRemove': bindingValue['beforeRemove'],
                'afterRender': bindingValue['afterRender'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.jsonExpressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;

    // Perf optimisation - see below
    var templateIsInExternalDocument = templateDocument && templateDocument != document;
    if (!templateIsInExternalDocument && this.knownRewrittenTemplates && this.knownRewrittenTemplates[template])
        return true;

    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);

    // Perf optimisation - for named templates, track which ones have been rewritten so we can
    // answer 'isTemplateRewritten' *without* having to use getElementById (which is slow on IE < 8)
    //
    // Note that we only cache the status for templates in the main document, because caching on a per-doc
    // basis complicates the implementation excessively. In a future version of KO, we will likely remove
    // this 'isRewritten' cache entirely anyway, because the benefit is extremely minor and only applies
    // to rewritable templates, which are pretty much deprecated since KO 2.0.
    var templateIsInExternalDocument = templateDocument && templateDocument != document;
    if (!templateIsInExternalDocument && typeof template == "string") {
        this.knownRewrittenTemplates = this.knownRewrittenTemplates || {};
        this.knownRewrittenTemplates[template] = true;
    }
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.jsonExpressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, templateEngine) {
        var dataBindKeyValueArray = ko.jsonExpressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(dataBindKeyValueArray);

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript = "ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() { \
            return (function() { return { " + rewrittenDataBindAttributeValue + " } })() \
        })";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[6], /* tagToRetain: */ arguments[1], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                if (domNode.nextSibling)
                    ko.applyBindingsToNode(domNode.nextSibling, bindings, bindingContext);
            });
        }
    }
})();

ko.exportSymbol('templateRewriting', ko.templateRewriting);
ko.exportSymbol('templateRewriting.applyMemoizedBindingsToNextSibling', ko.templateRewriting.applyMemoizedBindingsToNextSibling); // Exported only because it has to be referenced by string lookup from within rewritten template
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    ko.templateSources.domElement = function(element) {
        this.domElement = element;
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var tagNameLower = ko.utils.tagNameLower(this.domElement),
            elemContentsProperty = tagNameLower === "script" ? "text"
                                 : tagNameLower === "textarea" ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, "templateSourceData_" + key);
        } else {
            ko.utils.domData.set(this.domElement, "templateSourceData_" + key, arguments[1]);
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    var anonymousTemplatesDomDataKey = "__ko_anon_template__";
    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
        }
    };
    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            return templateData.containerData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            if (node.nodeType === 1 || node.nodeType === 8)
                action(node);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0], lastNode = continuousNodeArray[continuousNodeArray.length - 1];

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                options['afterRender'](renderedNodesArray, bindingContext['$data']);
        }

        return renderedNodesArray;
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                    // Support selecting template as a function of the data being rendered
                    var templateName = typeof(template) == 'function' ? template(bindingContext['$data']) : template;

                    var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { 'disposeWhen': whenToDispose, 'disposeWhenNodeIsRemoved': activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            var templateName = typeof(template) == 'function' ? template(arrayValue) : template;
            arrayItemContext = parentBindingContext['createChildContext'](ko.utils.unwrapObservable(arrayValue));
            arrayItemContext['$index'] = index;
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            ko.utils.setDomNodeChildrenFromArrayMapping(targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback);

        }, null, { 'disposeWhenNodeIsRemoved': targetNode });
    };

    var templateSubscriptionDomDataKey = '__ko__templateSubscriptionDomDataKey__';
    function disposeOldSubscriptionAndStoreNewOne(element, newSubscription) {
        var oldSubscription = ko.utils.domData.get(element, templateSubscriptionDomDataKey);
        if (oldSubscription && (typeof(oldSubscription.dispose) == 'function'))
            oldSubscription.dispose();
        ko.utils.domData.set(element, templateSubscriptionDomDataKey, newSubscription);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if ((typeof bindingValue != "string") && (!bindingValue['name']) && (element.nodeType == 1 || element.nodeType == 8)) {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = element.nodeType == 1 ? element.childNodes : ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            var templateName;
            var shouldDisplay = true;

            if (typeof bindingValue == "string") {
                templateName = bindingValue;
            } else {
                templateName = bindingValue['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in bindingValue)
                    shouldDisplay = shouldDisplay && ko.utils.unwrapObservable(bindingValue['if']);
                if ('ifnot' in bindingValue)
                    shouldDisplay = shouldDisplay && !ko.utils.unwrapObservable(bindingValue['ifnot']);
            }

            var templateSubscription = null;

            if ((typeof bindingValue === 'object') && ('foreach' in bindingValue)) { // Note: can't use 'in' operator on strings
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && bindingValue['foreach']) || [];
                templateSubscription = ko.renderTemplateForEach(templateName || element, dataArray, /* options: */ bindingValue, element, bindingContext);
            } else {
                if (shouldDisplay) {
                    // Render once for this single data point (or use the viewModel if no data was provided)
                    var innerBindingContext = (typeof bindingValue == 'object') && ('data' in bindingValue)
                        ? bindingContext['createChildContext'](ko.utils.unwrapObservable(bindingValue['data'])) // Given an explitit 'data' value, we create a child binding context for it
                        : bindingContext;                                                                       // Given no explicit 'data' value, we retain the same binding context
                    templateSubscription = ko.renderTemplate(templateName || element, innerBindingContext, /* options: */ bindingValue, element);
                } else
                    ko.virtualElements.emptyNode(element);
            }

            // It only makes sense to have a single template subscription per element (otherwise which one should have its output displayed?)
            disposeOldSubscriptionAndStoreNewOne(element, templateSubscription);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.jsonExpressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.jsonExpressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.jsonExpressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);

(function () {
    // Simple calculation based on Levenshtein distance.
    function calculateEditDistanceMatrix(oldArray, newArray, maxAllowedDistance) {
        var distances = [];
        for (var i = 0; i <= newArray.length; i++)
            distances[i] = [];

        // Top row - transform old array into empty array via deletions
        for (var i = 0, j = Math.min(oldArray.length, maxAllowedDistance); i <= j; i++)
            distances[0][i] = i;

        // Left row - transform empty array into new array via additions
        for (var i = 1, j = Math.min(newArray.length, maxAllowedDistance); i <= j; i++) {
            distances[i][0] = i;
        }

        // Fill out the body of the array
        var oldIndex, oldIndexMax = oldArray.length, newIndex, newIndexMax = newArray.length;
        var distanceViaAddition, distanceViaDeletion;
        for (oldIndex = 1; oldIndex <= oldIndexMax; oldIndex++) {
            var newIndexMinForRow = Math.max(1, oldIndex - maxAllowedDistance);
            var newIndexMaxForRow = Math.min(newIndexMax, oldIndex + maxAllowedDistance);
            for (newIndex = newIndexMinForRow; newIndex <= newIndexMaxForRow; newIndex++) {
                if (oldArray[oldIndex - 1] === newArray[newIndex - 1])
                    distances[newIndex][oldIndex] = distances[newIndex - 1][oldIndex - 1];
                else {
                    var northDistance = distances[newIndex - 1][oldIndex] === undefined ? Number.MAX_VALUE : distances[newIndex - 1][oldIndex] + 1;
                    var westDistance = distances[newIndex][oldIndex - 1] === undefined ? Number.MAX_VALUE : distances[newIndex][oldIndex - 1] + 1;
                    distances[newIndex][oldIndex] = Math.min(northDistance, westDistance);
                }
            }
        }

        return distances;
    }

    function findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray) {
        var oldIndex = oldArray.length;
        var newIndex = newArray.length;
        var editScript = [];
        var maxDistance = editDistanceMatrix[newIndex][oldIndex];
        if (maxDistance === undefined)
            return null; // maxAllowedDistance must be too small
        while ((oldIndex > 0) || (newIndex > 0)) {
            var me = editDistanceMatrix[newIndex][oldIndex];
            var distanceViaAdd = (newIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex] : maxDistance + 1;
            var distanceViaDelete = (oldIndex > 0) ? editDistanceMatrix[newIndex][oldIndex - 1] : maxDistance + 1;
            var distanceViaRetain = (newIndex > 0) && (oldIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex - 1] : maxDistance + 1;
            if ((distanceViaAdd === undefined) || (distanceViaAdd < me - 1)) distanceViaAdd = maxDistance + 1;
            if ((distanceViaDelete === undefined) || (distanceViaDelete < me - 1)) distanceViaDelete = maxDistance + 1;
            if (distanceViaRetain < me - 1) distanceViaRetain = maxDistance + 1;

            if ((distanceViaAdd <= distanceViaDelete) && (distanceViaAdd < distanceViaRetain)) {
                editScript.push({ status: "added", value: newArray[newIndex - 1] });
                newIndex--;
            } else if ((distanceViaDelete < distanceViaAdd) && (distanceViaDelete < distanceViaRetain)) {
                editScript.push({ status: "deleted", value: oldArray[oldIndex - 1] });
                oldIndex--;
            } else {
                editScript.push({ status: "retained", value: oldArray[oldIndex - 1] });
                newIndex--;
                oldIndex--;
            }
        }
        return editScript.reverse();
    }

    ko.utils.compareArrays = function (oldArray, newArray, maxEditsToConsider) {
        if (maxEditsToConsider === undefined) {
            return ko.utils.compareArrays(oldArray, newArray, 1)                 // First consider likely case where there is at most one edit (very fast)
                || ko.utils.compareArrays(oldArray, newArray, 10)                // If that fails, account for a fair number of changes while still being fast
                || ko.utils.compareArrays(oldArray, newArray, Number.MAX_VALUE); // Ultimately give the right answer, even though it may take a long time
        } else {
            oldArray = oldArray || [];
            newArray = newArray || [];
            var editDistanceMatrix = calculateEditDistanceMatrix(oldArray, newArray, maxEditsToConsider);
            return findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray);
        }
    };
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);

(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function fixUpVirtualElements(contiguousNodeArray) {
        // Ensures that contiguousNodeArray really *is* an array of contiguous siblings, even if some of the interior
        // ones have changed since your array was first built (e.g., because your array contains virtual elements, and
        // their virtual children changed when binding was applied to them).
        // This is needed so that we can reliably remove or update the nodes corresponding to a given array item

        if (contiguousNodeArray.length > 2) {
            // Build up the actual new contiguous node set
            var current = contiguousNodeArray[0], last = contiguousNodeArray[contiguousNodeArray.length - 1], newContiguousSet = [current];
            while (current !== last) {
                current = current.nextSibling;
                if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                    return;
                newContiguousSet.push(current);
            }

            // ... then mutate the input array to match this.
            // (The following line replaces the contents of contiguousNodeArray with newContiguousSet)
            Array.prototype.splice.apply(contiguousNodeArray, [0, contiguousNodeArray.length].concat(newContiguousSet));
        }
    }

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                fixUpVirtualElements(mappedNodes);
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    callbackAfterAddingNodes(valueToMap, newMappedNodes);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.splice(0, mappedNodes.length);
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { 'disposeWhenNodeIsRemoved': containerNode, 'disposeWhen': function() { return (mappedNodes.length == 0) || !ko.utils.domNodeIsAttachedToDocument(mappedNodes[0]) } });
        return { mappedNodes : mappedNodes, dependentObservable : dependentObservable };
    }

    var lastMappingResultDomDataKey = "setDomNodeChildrenFromArrayMapping_lastMappingResult";

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var nodesToDelete = [];
        var newMappingResultIndex = 0;
        var nodesAdded = [];
        var insertAfterNode = null;
        for (var i = 0, j = editScript.length; i < j; i++) {
            switch (editScript[i].status) {
                case "retained":
                    // Just keep the information - don't touch the nodes
                    var dataToRetain = lastMappingResult[lastMappingResultIndex];
                    dataToRetain.indexObservable(newMappingResultIndex);
                    newMappingResultIndex = newMappingResult.push(dataToRetain);
                    if (dataToRetain.domNodes.length > 0)
                        insertAfterNode = dataToRetain.domNodes[dataToRetain.domNodes.length - 1];
                    lastMappingResultIndex++;
                    break;

                case "deleted":
                    // Stop tracking changes to the mapping for these nodes
                    lastMappingResult[lastMappingResultIndex].dependentObservable.dispose();

                    // Queue these nodes for later removal
                    fixUpVirtualElements(lastMappingResult[lastMappingResultIndex].domNodes);
                    ko.utils.arrayForEach(lastMappingResult[lastMappingResultIndex].domNodes, function (node) {
                        nodesToDelete.push({
                          element: node,
                          index: i,
                          value: editScript[i].value
                        });
                        insertAfterNode = node;
                    });
                    lastMappingResultIndex++;
                    break;

                case "added":
                    var valueToMap = editScript[i].value;
                    var indexObservable = ko.observable(newMappingResultIndex);
                    var mapData = mapNodeAndRefreshWhenChanged(domNode, mapping, valueToMap, callbackAfterAddingNodes, indexObservable);
                    var mappedNodes = mapData.mappedNodes;

                    // On the first evaluation, insert the nodes at the current insertion point
                    newMappingResultIndex = newMappingResult.push({
                        arrayEntry: editScript[i].value,
                        domNodes: mappedNodes,
                        dependentObservable: mapData.dependentObservable,
                        indexObservable: indexObservable
                    });
                    for (var nodeIndex = 0, nodeIndexMax = mappedNodes.length; nodeIndex < nodeIndexMax; nodeIndex++) {
                        var node = mappedNodes[nodeIndex];
                        nodesAdded.push({
                          element: node,
                          index: i,
                          value: editScript[i].value
                        });
                        if (insertAfterNode == null) {
                            // Insert "node" (the newly-created node) as domNode's first child
                            ko.virtualElements.prepend(domNode, node);
                        } else {
                            // Insert "node" into "domNode" immediately after "insertAfterNode"
                            ko.virtualElements.insertAfter(domNode, node, insertAfterNode);
                        }
                        insertAfterNode = node;
                    }
                    if (callbackAfterAddingNodes)
                        callbackAfterAddingNodes(valueToMap, mappedNodes, indexObservable);
                    break;
            }
        }

        ko.utils.arrayForEach(nodesToDelete, function (node) { ko.cleanNode(node.element) });

        var invokedBeforeRemoveCallback = false;
        if (!isFirstExecution) {
            if (options['afterAdd']) {
                for (var i = 0; i < nodesAdded.length; i++)
                    options['afterAdd'](nodesAdded[i].element, nodesAdded[i].index, nodesAdded[i].value);
            }
            if (options['beforeRemove']) {
                for (var i = 0; i < nodesToDelete.length; i++)
                    options['beforeRemove'](nodesToDelete[i].element, nodesToDelete[i].index, nodesToDelete[i].value);
                invokedBeforeRemoveCallback = true;
            }
        }
        if (!invokedBeforeRemoveCallback && nodesToDelete.length) {
            for (var i = 0; i < nodesToDelete.length; i++) {
                var element = nodesToDelete[i].element;
                if (element.parentNode)
                    element.parentNode.removeChild(element);
            }
        }

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQuery['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQuery['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQuery['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "</script>");
        };

        if (jQueryTmplVersion > 0) {
            jQuery['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQuery['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
});
})(window,document,navigator);

/*
 * JQuery URL Parser plugin, v2.2.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */ 

;(function(factory) {
   if (typeof define === 'function' && define.amd) {
      // AMD available; use anonymous module
      if ( typeof jQuery !== 'undefined' ) {
         define(['jquery'], factory);  
      } else {
         define([], factory);
      }
   } else {
      // No AMD available; mutate global vars
      if ( typeof jQuery !== 'undefined' ) {
         factory(jQuery);
      } else {
         factory();
      }
   }
})(function($, undefined) {
   
   var tag2attr = {
         a       : 'href',
         img     : 'src',
         form    : 'action',
         base    : 'href',
         script  : 'src',
         iframe  : 'src',
         link    : 'href'
      },
      
      key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query
      
      aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability
      
      parser = {
         strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
         loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
      },
      
      toString = Object.prototype.toString,
      
      isint = /^[0-9]+$/;
   
   function parseUri( url, strictMode ) {
      var str = decodeURI( url ),
      res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
      uri = { attr : {}, param : {}, seg : {} },
      i   = 14;
      
      while ( i-- ) {
         uri.attr[ key[i] ] = res[i] || '';
      }
      
      // build query and fragment parameters    
      uri.param['query'] = parseString(uri.attr['query']);
      uri.param['fragment'] = parseString(uri.attr['fragment']);
      
      // split path and fragement into segments    
      uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');     
      uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
      
      // compile a 'base' domain attribute        
      uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';      
        
      return uri;
   };
   
   function getAttrName( elm ) {
      var tn = elm.tagName;
      if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
      return tn;
   }
   
   function promote(parent, key) {
      if (parent[key].length == 0) return parent[key] = {};
      var t = {};
      for (var i in parent[key]) t[i] = parent[key][i];
      parent[key] = t;
      return t;
   }

   function parse(parts, parent, key, val) {
      var part = parts.shift();
      if (!part) {
         if (isArray(parent[key])) {
            parent[key].push(val);
         } else if ('object' == typeof parent[key]) {
            parent[key] = val;
         } else if ('undefined' == typeof parent[key]) {
            parent[key] = val;
         } else {
            parent[key] = [parent[key], val];
         }
      } else {
         var obj = parent[key] = parent[key] || [];
         if (']' == part) {
            if (isArray(obj)) {
               if ('' != val) obj.push(val);
            } else if ('object' == typeof obj) {
               obj[keys(obj).length] = val;
            } else {
               obj = parent[key] = [parent[key], val];
            }
         } else if (~part.indexOf(']')) {
            part = part.substr(0, part.length - 1);
            if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
            // key
         } else {
            if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
         }
      }
   }

   function merge(parent, key, val) {
      if (~key.indexOf(']')) {
         var parts = key.split('['),
         len = parts.length,
         last = len - 1;
         parse(parts, parent, 'base', val);
      } else {
         if (!isint.test(key) && isArray(parent.base)) {
            var t = {};
            for (var k in parent.base) t[k] = parent.base[k];
            parent.base = t;
         }
         set(parent.base, key, val);
      }
      return parent;
   }

   function parseString(str) {
      return reduce(String(str).split(/&|;/), function(ret, pair) {
         try {
            pair = decodeURIComponent(pair.replace(/\+/g, ' '));
         } catch(e) {
            // ignore
         }
         var eql = pair.indexOf('='),
            brace = lastBraceInKey(pair),
            key = pair.substr(0, brace || eql),
            val = pair.substr(brace || eql, pair.length),
            val = val.substr(val.indexOf('=') + 1, val.length);

         if ('' == key) key = pair, val = '';

         return merge(ret, key, val);
      }, { base: {} }).base;
   }
   
   function set(obj, key, val) {
      var v = obj[key];
      if (undefined === v) {
         obj[key] = val;
      } else if (isArray(v)) {
         v.push(val);
      } else {
         obj[key] = [v, val];
      }
   }
   
   function lastBraceInKey(str) {
      var len = str.length,
          brace, c;
      for (var i = 0; i < len; ++i) {
         c = str[i];
         if (']' == c) brace = false;
         if ('[' == c) brace = true;
         if ('=' == c && !brace) return i;
      }
   }
   
   function reduce(obj, accumulator){
      var i = 0,
         l = obj.length >> 0,
         curr = arguments[2];
      while (i < l) {
         if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
         ++i;
      }
      return curr;
   }
   
   function isArray(vArg) {
      return Object.prototype.toString.call(vArg) === "[object Array]";
   }
   
   function keys(obj) {
      var keys = [];
      for ( prop in obj ) {
         if ( obj.hasOwnProperty(prop) ) keys.push(prop);
      }
      return keys;
   }
      
   function purl( url, strictMode ) {
      if ( arguments.length === 1 && url === true ) {
         strictMode = true;
         url = undefined;
      }
      strictMode = strictMode || false;
      url = url || window.location.toString();
   
      return {
         
         data : parseUri(url, strictMode),
         
         // get various attributes from the URI
         attr : function( attr ) {
            attr = aliases[attr] || attr;
            return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
         },
         
         // return query string parameters
         param : function( param ) {
            return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
         },
         
         // return fragment parameters
         fparam : function( param ) {
            return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
         },
         
         // return path segments
         segment : function( seg ) {
            if ( typeof seg === 'undefined' ) {
               return this.data.seg.path;
            } else {
               seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
               return this.data.seg.path[seg];                    
            }
         },
         
         // return fragment segments
         fsegment : function( seg ) {
            if ( typeof seg === 'undefined' ) {
               return this.data.seg.fragment;                    
            } else {
               seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
               return this.data.seg.fragment[seg];                    
            }
         }
         
      };
   
   };
   
   if ( typeof $ !== 'undefined' ) {
      
      $.fn.url = function( strictMode ) {
         var url = '';
         if ( this.length ) {
            url = $(this).attr( getAttrName(this[0]) ) || '';
         }    
         return purl( url, strictMode );
      };
      
      $.url = purl;
      
   } else {
      window.purl = purl;
   }

});

/*
 * Swipe 1.0
 *
 * Brad Birdsall, Prime
 * Copyright 2011, Licensed GPL & MIT
 *
*/

;window.Swipe = function(element, options) {

  // return immediately if element doesn't exist
  if (!element) return null;

  var _this = this;

  // retreive options
  this.options = options || {};
  this.index = this.options.startSlide || 0;
  this.speed = this.options.speed || 300;
  this.callback = this.options.callback || function() {};
  this.delay = this.options.auto || 0;

  // reference dom elements
  this.container = element;
  this.element = this.container.children[0]; // the slide pane

  // static css
  this.container.style.overflow = 'hidden';
  this.element.style.listStyle = 'none';
  this.element.style.margin = 0;

  // trigger slider initialization
  this.setup();

  // begin auto slideshow
  this.begin();

  // add event listeners
  if (this.element.addEventListener) {
    this.element.addEventListener('touchstart', this, false);
    this.element.addEventListener('touchmove', this, false);
    this.element.addEventListener('touchend', this, false);
    this.element.addEventListener('touchcancel', this, false);
    this.element.addEventListener('webkitTransitionEnd', this, false);
    this.element.addEventListener('msTransitionEnd', this, false);
    this.element.addEventListener('oTransitionEnd', this, false);
    this.element.addEventListener('transitionend', this, false);
    window.addEventListener('resize', this, false);
  }

};

Swipe.prototype = {

  setup: function() {

    // get and measure amt of slides
    this.slides = this.element.children;
    this.length = this.slides.length;

    // return immediately if their are less than two slides
    if (this.length < 2) return null;

    // determine width of each slide
    this.width = Math.ceil(("getBoundingClientRect" in this.container) ? this.container.getBoundingClientRect().width : this.container.offsetWidth);

    // Fix width for Android WebView (i.e. PhoneGap) 
    if (this.width === 0 && typeof window.getComputedStyle === 'function') {
      this.width = window.getComputedStyle(this.container, null).width.replace('px','');
    }

    // return immediately if measurement fails
    if (!this.width) return null;

    // hide slider element but keep positioning during setup
    var origVisibility = this.container.style.visibility;
    this.container.style.visibility = 'hidden';

    // dynamic css
    this.element.style.width = Math.ceil(this.slides.length * this.width) + 'px';
    var index = this.slides.length;
    while (index--) {
      var el = this.slides[index];
      el.style.width = this.width + 'px';
      el.style.display = 'table-cell';
      el.style.verticalAlign = 'top';
    }

    // set start position and force translate to remove initial flickering
    this.slide(this.index, 0); 

    // restore the visibility of the slider element
    this.container.style.visibility = origVisibility;

  },

  slide: function(index, duration) {

    var style = this.element.style;

    // fallback to default speed
    if (duration == undefined) {
        duration = this.speed;
    }

    // set duration speed (0 represents 1-to-1 scrolling)
    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + 'ms';

    // translate to given index position
    style.MozTransform = style.webkitTransform = 'translate3d(' + -(index * this.width) + 'px,0,0)';
    style.msTransform = style.OTransform = 'translateX(' + -(index * this.width) + 'px)';

    // set new index to allow for expression arguments
    this.index = index;

  },

  getPos: function() {
    
    // return current index position
    return this.index;

  },

  prev: function(delay) {

    // cancel next scheduled automatic transition, if any
    this.delay = delay || 0;
    clearTimeout(this.interval);

    if (this.index) this.slide(this.index-1, this.speed); // if not at first slide
    else this.slide(this.length - 1, this.speed); //if first slide return to end

  },

  next: function(delay) {

    // cancel next scheduled automatic transition, if any
    this.delay = delay || 0;
    clearTimeout(this.interval);

    if (this.index < this.length - 1) this.slide(this.index+1, this.speed); // if not last slide
    else this.slide(0, this.speed); //if last slide return to start

  },

  begin: function() {

    var _this = this;

    this.interval = (this.delay)
      ? setTimeout(function() { 
        _this.next(_this.delay);
      }, this.delay)
      : 0;
  
  },
  
  stop: function() {
    this.delay = 0;
    clearTimeout(this.interval);
  },
  
  resume: function() {
    this.delay = this.options.auto || 0;
    this.begin();
  },

  handleEvent: function(e) {
    switch (e.type) {
      case 'touchstart': this.onTouchStart(e); break;
      case 'touchmove': this.onTouchMove(e); break;
      case 'touchcancel' :
      case 'touchend': this.onTouchEnd(e); break;
      case 'webkitTransitionEnd':
      case 'msTransitionEnd':
      case 'oTransitionEnd':
      case 'transitionend': this.transitionEnd(e); break;
      case 'resize': this.setup(); break;
    }
  },

  transitionEnd: function(e) {
    
    if (this.delay) this.begin();

    this.callback(e, this.index, this.slides[this.index]);

  },

  onTouchStart: function(e) {
    
    this.start = {

      // get touch coordinates for delta calculations in onTouchMove
      pageX: e.touches[0].pageX,
      pageY: e.touches[0].pageY,

      // set initial timestamp of touch sequence
      time: Number( new Date() )

    };

    // used for testing first onTouchMove event
    this.isScrolling = undefined;
    
    // reset deltaX
    this.deltaX = 0;

    // set transition time to 0 for 1-to-1 touch movement
    this.element.style.MozTransitionDuration = this.element.style.webkitTransitionDuration = 0;
    
    e.stopPropagation();
  },

  onTouchMove: function(e) {

    // ensure swiping with one touch and not pinching
    if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

    this.deltaX = e.touches[0].pageX - this.start.pageX;

    // determine if scrolling test has run - one time test
    if ( typeof this.isScrolling == 'undefined') {
      this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(e.touches[0].pageY - this.start.pageY) );
    }

    // if user is not trying to scroll vertically
    if (!this.isScrolling) {

      // prevent native scrolling 
      e.preventDefault();

      // cancel slideshow
      clearTimeout(this.interval);

      // increase resistance if first or last slide
      this.deltaX = 
        this.deltaX / 
          ( (!this.index && this.deltaX > 0               // if first slide and sliding left
            || this.index == this.length - 1              // or if last slide and sliding right
            && this.deltaX < 0                            // and if sliding at all
          ) ?                      
          ( Math.abs(this.deltaX) / this.width + 1 )      // determine resistance level
          : 1 );                                          // no resistance if false
      
      // translate immediately 1-to-1
      this.element.style.MozTransform = this.element.style.webkitTransform = 'translate3d(' + (this.deltaX - this.index * this.width) + 'px,0,0)';
      
      e.stopPropagation();
    }

  },

  onTouchEnd: function(e) {

    // determine if slide attempt triggers next/prev slide
    var isValidSlide = 
          Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
          && Math.abs(this.deltaX) > 20                   // and if slide amt is greater than 20px
          || Math.abs(this.deltaX) > this.width/2,        // or if slide amt is greater than half the width

    // determine if slide attempt is past start and end
        isPastBounds = 
          !this.index && this.deltaX > 0                          // if first slide and slide amt is greater than 0
          || this.index == this.length - 1 && this.deltaX < 0;    // or if last slide and slide amt is less than 0

    // if not scrolling vertically
    if (!this.isScrolling) {

      // call slide function with slide end value based on isValidSlide and isPastBounds tests
      this.slide( this.index + ( isValidSlide && !isPastBounds ? (this.deltaX < 0 ? 1 : -1) : 0 ), this.speed );

    }
    
    e.stopPropagation();
  }

};
/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function ($, document, undefined) {

   var pluses = /\+/g;

   function raw(s) {
      return s;
   }

   function decoded(s) {
      return decodeURIComponent(s.replace(pluses, ' '));
   }

   var config = $.cookie = function (key, value, options) {

      // write
      if (value !== undefined) {
         options = $.extend({}, config.defaults, options);

         if (value === null) {
            options.expires = -1;
         }

         if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
         }

         value = config.json ? JSON.stringify(value) : String(value);

         return (document.cookie = [
            encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path    ? '; path=' + options.path : '',
            options.domain  ? '; domain=' + options.domain : '',
            options.secure  ? '; secure' : ''
         ].join(''));
      }

      // read
      var decode = config.raw ? raw : decoded;
      var cookies = document.cookie.split('; ');
      for (var i = 0, l = cookies.length; i < l; i++) {
         var parts = cookies[i].split('=');
         if (decode(parts.shift()) === key) {
            var cookie = decode(parts.join('='));
            return config.json ? JSON.parse(cookie) : cookie;
         }
      }

      return null;
   };

   config.defaults = {};

   $.removeCookie = function (key, options) {
      if ($.cookie(key) !== null) {
         $.cookie(key, null, options);
         return true;
      }
      return false;
   };

})(jQuery, document);
/*
   This is a modified version to work with how we are bypassing the normal
   authorization processes. Only the constructor as been modified.
*/

var forcetk = window.forcetk;

if (forcetk === undefined) {
   forcetk = {};
}

if (forcetk.Client === undefined) {

   // We use $j rather than $ for jQuery so it works in Visualforce
   if (window.$j === undefined) {
      $j = $;
   }

   /**
    * The Client provides a convenient wrapper for the Force.com REST API, 
    * allowing JavaScript in Visualforce pages to use the API via the Ajax
    * Proxy.
    * @param [clientId=null] 'Consumer Key' in the Remote Access app settings
    * @param [access_token=null] Access token to use for all requests
    * @param [proxyUrl=null] 
    * @constructor
    */
   forcetk.Client = function(client_id, access_token, instanceUrl) {
      this.clientId = clientId;
      this.proxyUrl = null;
      this.refreshToken = null;
      this.sessionId = null;
      this.apiVersion = null;
      this.instanceUrl = null;
      this.asyncAjax = true;
      this.loginUrl = 'https://login.salesforce.com/';
      this.authzHeader = "Authorization";
      
      this.setSessionToken(access_token, null, instanceUrl);
   }

   /**
    * Set a refresh token in the client.
    * @param refreshToken an OAuth refresh token
    */
   forcetk.Client.prototype.setRefreshToken = function(refreshToken) {
      this.refreshToken = refreshToken;
   }

   /**
    * Refresh the access token.
    * @param callback function to call on success
    * @param error function to call on failure
    */
   forcetk.Client.prototype.refreshAccessToken = function(callback, error) {
      var that = this;
      var url = this.loginUrl + '/services/oauth2/token';
      $j.ajax({
         type: 'POST',
         url: (this.proxyUrl !== null) ? this.proxyUrl: url,
         cache: false,
         processData: false,
         data: 'grant_type=refresh_token&client_id=' + this.clientId + '&refresh_token=' + this.refreshToken,
         success: callback,
         error: error,
         dataType: "json",
         beforeSend: function(xhr) {
            if (that.proxyUrl !== null) {
               xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
            }
         }
      });
   }

   /**
    * Set a session token and the associated metadata in the client.
    * @param sessionId a salesforce.com session ID. In a Visualforce page,
    *                   use '{!$Api.sessionId}' to obtain a session ID.
    * @param [apiVersion="21.0"] Force.com API version
    * @param [instanceUrl] Omit this if running on Visualforce; otherwise 
    *                   use the value from the OAuth token.
    */
   forcetk.Client.prototype.setSessionToken = function(sessionId, apiVersion, instanceUrl) {
      this.sessionId = sessionId;
      this.apiVersion = (typeof apiVersion === 'undefined' || apiVersion === null)
      ? 'v24.0': apiVersion;
      if (typeof instanceUrl === 'undefined' || instanceUrl == null) {
         // location.hostname can be of the form 'abc.na1.visual.force.com' or
         // 'na1.salesforce.com'. Split on '.', and take the [1] or [0] element
         // as appropriate
         var elements = location.hostname.split(".");
         var instance = (elements.length == 3) ? elements[0] : elements[1];
         this.instanceUrl = "https://" + instance + ".salesforce.com";
      } else {
         this.instanceUrl = instanceUrl;
      }
   }

   /*
    * Low level utility function to call the Salesforce endpoint.
    * @param path resource path relative to /services/data
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    * @param [method="GET"] HTTP method for call
    * @param [payload=null] payload for POST/PATCH etc
    */
   forcetk.Client.prototype.ajax = function(path, callback, error, method, payload, retry) {
      var that = this;
      var url = this.instanceUrl + '/services/data' + path;

      $j.ajax({
         type: method || "GET",
         async: this.asyncAjax,
         url: (this.proxyUrl !== null) ? this.proxyUrl: url,
         contentType: 'application/json',
         cache: false,
         processData: false,
         data: payload,
         success: callback,
         error: (!this.refreshToken || retry ) ? error : function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
               that.refreshAccessToken(function(oauthResponse) {
                  that.setSessionToken(oauthResponse.access_token, null,
                  oauthResponse.instance_url);
                  that.ajax(path, callback, error, method, payload, true);
               },
               error);
            } else {
               error(jqXHR, textStatus, errorThrown);
            }
         },
         dataType: "json",
         beforeSend: function(xhr) {
            if (that.proxyUrl !== null) {
               xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
            }
            xhr.setRequestHeader(that.authzHeader, "OAuth " + that.sessionId);
            xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
         }
      });
   }

   /**
    * Utility function to query the Chatter API and download a file
    * Note, raw XMLHttpRequest because JQuery mangles the arraybuffer
    * This should work on any browser that supports XMLHttpRequest 2 because arraybuffer is required. 
    * For mobile, that means iOS >= 5 and Android >= Honeycomb
    * @author Tom Gersic
    * @param path resource path relative to /services/data
    * @param mimetype of the file
    * @param callback function to which response will be passed
    * @param [error=null] function to which request will be passed in case of error
    * @param rety true if we've already tried refresh token flow once
    **/
   forcetk.Client.prototype.getChatterFile = function(path,mimeType,callback,error,retry) {
      var that = this;
      var url = this.instanceUrl + path;

      var request = new XMLHttpRequest();
              
      request.open("GET",  (this.proxyUrl !== null) ? this.proxyUrl: url, true);
      request.responseType = "arraybuffer";
      
      request.setRequestHeader(that.authzHeader, "OAuth " + that.sessionId);
      request.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
      if (this.proxyUrl !== null) {
         request.setRequestHeader('SalesforceProxy-Endpoint', url);
      }
      
      request.onreadystatechange = function() {
         // continue if the process is completed
         if (request.readyState == 4) {
            // continue only if HTTP status is "OK"
            if (request.status == 200) {
               try {
                  // retrieve the response
                  callback(request.response);
               }
               catch(e) {
                  // display error message
                  alert("Error reading the response: " + e.toString());
               }
            }
            //refresh token in 401
            else if(request.status == 401 && !retry) {
               that.refreshAccessToken(function(oauthResponse) {
                  that.setSessionToken(oauthResponse.access_token, null,oauthResponse.instance_url);
                  that.getChatterFile(path, mimeType, callback, error, true);
               },
               error);
            } 
            else {
               // display status message
               error(request,request.statusText,request.response);
            }
         }            
         
      }

      request.send();
      
   }

   /*
    * Low level utility function to call the Salesforce endpoint specific for Apex REST API.
    * @param path resource path relative to /services/apexrest
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    * @param [method="GET"] HTTP method for call
    * @param [payload=null] payload for POST/PATCH etc
   * @param [paramMap={}] parameters to send as header values for POST/PATCH etc
   * @param [retry] specifies whether to retry on error
    */
   forcetk.Client.prototype.apexrest = function(path, callback, error, method, payload, paramMap, retry) {
      var that = this;
      var url = this.instanceUrl + '/services/apexrest' + path;

      $j.ajax({
         type: method || "GET",
         async: this.asyncAjax,
         url: (this.proxyUrl !== null) ? this.proxyUrl: url,
         contentType: 'application/json',
         cache: false,
         processData: false,
         data: payload,
         success: callback,
         error: (!this.refreshToken || retry ) ? error : function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
               that.refreshAccessToken(function(oauthResponse) {
                  that.setSessionToken(oauthResponse.access_token, null,
                  oauthResponse.instance_url);
                  that.apexrest(path, callback, error, method, payload, paramMap, true);
               },
               error);
            } else {
               error(jqXHR, textStatus, errorThrown);
            }
         },
         dataType: "json",
         beforeSend: function(xhr) {
            if (that.proxyUrl !== null) {
               xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
            }
            //Add any custom headers
            if (paramMap === null) {
               paramMap = {};
            }
            for (paramName in paramMap) {
               xhr.setRequestHeader(paramName, paramMap[paramName]);
            }
            xhr.setRequestHeader(that.authzHeader, "OAuth " + that.sessionId);
            xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/' + that.apiVersion);
         }
      });
   }

   /*
    * Lists summary information about each Salesforce.com version currently 
    * available, including the version, label, and a link to each version's
    * root.
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.versions = function(callback, error) {
      this.ajax('/', callback, error);
   }

   /*
    * Lists available resources for the client's API version, including 
    * resource name and URI.
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.resources = function(callback, error) {
      this.ajax('/' + this.apiVersion + '/', callback, error);
   }

   /*
    * Lists the available objects and their metadata for your organization's 
    * data.
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.describeGlobal = function(callback, error) {
      this.ajax('/' + this.apiVersion + '/sobjects/', callback, error);
   }

   /*
    * Describes the individual metadata for the specified object.
    * @param objtype object type; e.g. "Account"
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.metadata = function(objtype, callback, error) {
      this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/'
      , callback, error);
   }

   /*
    * Completely describes the individual metadata at all levels for the 
    * specified object.
    * @param objtype object type; e.g. "Account"
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.describe = function(objtype, callback, error) {
      this.ajax('/' + this.apiVersion + '/sobjects/' + objtype
      + '/describe/', callback, error);
   }

   /*
    * Creates a new record of the given type.
    * @param objtype object type; e.g. "Account"
    * @param fields an object containing initial field names and values for 
    *               the record, e.g. {:Name "salesforce.com", :TickerSymbol 
    *               "CRM"}
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.create = function(objtype, fields, callback, error) {
      this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/'
      , callback, error, "POST", JSON.stringify(fields));
   }

   /*
    * Retrieves field values for a record of the given type.
    * @param objtype object type; e.g. "Account"
    * @param id the record's object ID
    * @param [fields=null] optional comma-separated list of fields for which 
    *               to return values; e.g. Name,Industry,TickerSymbol
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.retrieve = function(objtype, id, fieldlist, callback, error) {
      if (!arguments[4]) {
         error = callback;
         callback = fieldlist;
         fieldlist = null;
      }
      var fields = fieldlist ? '?fields=' + fieldlist : '';
      this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + id
      + fields, callback, error);
   }

   /*
    * Upsert - creates or updates record of the given type, based on the 
    * given external Id.
    * @param objtype object type; e.g. "Account"
    * @param externalIdField external ID field name; e.g. "accountMaster__c"
    * @param externalId the record's external ID value
    * @param fields an object containing field names and values for 
    *               the record, e.g. {:Name "salesforce.com", :TickerSymbol 
    *               "CRM"}
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.upsert = function(objtype, externalIdField, externalId, fields, callback, error) {
      this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + externalIdField + '/' + externalId 
      + '?_HttpMethod=PATCH', callback, error, "POST", JSON.stringify(fields));
   }

   /*
    * Updates field values on a record of the given type.
    * @param objtype object type; e.g. "Account"
    * @param id the record's object ID
    * @param fields an object containing initial field names and values for 
    *               the record, e.g. {:Name "salesforce.com", :TickerSymbol 
    *               "CRM"}
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.update = function(objtype, id, fields, callback, error) {
      this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + id 
      + '?_HttpMethod=PATCH', callback, error, "POST", JSON.stringify(fields));
   }

   /*
    * Deletes a record of the given type. Unfortunately, 'delete' is a 
    * reserved word in JavaScript.
    * @param objtype object type; e.g. "Account"
    * @param id the record's object ID
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.del = function(objtype, id, callback, error) {
      this.ajax('/' + this.apiVersion + '/sobjects/' + objtype + '/' + id
      , callback, error, "DELETE");
   }

   /*
    * Executes the specified SOQL query.
    * @param soql a string containing the query to execute - e.g. "SELECT Id, 
    *             Name from Account ORDER BY Name LIMIT 20"
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.query = function(soql, callback, error) {
      this.ajax('/' + this.apiVersion + '/query?q=' + escape(soql)
      , callback, error);
   }
   
   /*
    * Queries the next set of records based on pagination.
    * <p>This should be used if performing a query that retrieves more than can be returned
    * in accordance with http://www.salesforce.com/us/developer/docs/api_rest/Content/dome_query.htm</p>
    * <p>Ex: forcetkClient.queryMore( successResponse.nextRecordsUrl, successHandler, failureHandler )</p>
    * 
    * @param url - the url retrieved from nextRecordsUrl or prevRecordsUrl
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.queryMore = function( url, callback, error ){
      //-- ajax call adds on services/data to the url call, so only send the url after
      var serviceData = "services/data";
      var index = url.indexOf( serviceData );
      
      if( index > -1 ){
       url = url.substr( index + serviceData.length );
      } else {
       //-- leave alone
      }
      
      this.ajax( url, callback, error );
   }

   /*
    * Executes the specified SOSL search.
    * @param sosl a string containing the search to execute - e.g. "FIND 
    *             {needle}"
    * @param callback function to which response will be passed
    * @param [error=null] function to which jqXHR will be passed in case of error
    */
   forcetk.Client.prototype.search = function(sosl, callback, error) {
      this.ajax('/' + this.apiVersion + '/search?q=' + escape(sosl)
      , callback, error);
   }
}
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($, forge, ko) {
    var currentCookie, currentUser, fc, showLoading;
    $.cookie.json = true;
    currentUser = null;
    currentCookie = null;
    showLoading = false;
    fc = window.fannect = {
      viewModels: {}
    };
    fc.setActiveMenu = function(menu) {
      if (forge.is.web()) {
        $(".footer .ui-btn-active").removeClass("ui-btn-active").removeClass("ui-btn-persist");
        return $(".footer ." + menu + "-menu").addClass("ui-btn-active").addClass("ui-btn-persist");
      } else {
        fc.mobile.setActiveMenu(menu);
        return fc.setHeader();
      }
    };
    fc.setHeader = function() {
      var header, leftButton;
      if (forge.is.mobile()) {
        forge.topbar.removeButtons();
        header = $(".header", $.mobile.activePage).get(0);
        forge.topbar.setTitle($("h1", header).text());
        leftButton = $("a[data-rel=back]", header);
        if (leftButton.length > 0) {
          return forge.topbar.addButton({
            text: leftButton.text(),
            position: "left",
            type: "back",
            style: "back"
          });
        }
      }
    };
    fc.getResourceURL = function() {
      if (forge.is.web()) {
        return "http://fannect.herokuapp.com";
      } else {
        return "http://fannect.herokuapp.com";
      }
    };
    fc.getParams = function() {
      return $.url().param();
    };
    fc.loading = function(status) {
      showLoading = status === "show";
      if (showLoading) {
        return $.mobile.loading("show", {
          text: "Loading Page",
          textVisible: true,
          theme: "b",
          html: ""
        });
      } else {
        return $.mobile.loading("hide");
      }
    };
    $(".ui-page").live("pageshow", function() {
      if (showLoading) {
        return fc.loading("show");
      }
    });
    fc.ajax = function(options, done) {
      done = done || options.success;
      options.success = function(result) {
        fc.loading("hide");
        return done(null, JSON.parse(result));
      };
      options.error = function(error) {
        fc.loading("hide");
        if ((error != null ? error.statusCode : void 0) === 401) {
          return fc.redirectToLogin;
        } else {
          return done(error);
        }
      };
      fc.loading("show");
      return forge.ajax(options);
    };
    fc.clearBindings = function(context) {
      return ko.cleanNode(context);
    };
    fc.showTutorial = function() {
      var $tutorial, slider, tutorial;
      $tutorial = $(".tutorial", $.mobile.activePage).fadeIn(400);
      if (!$tutorial.data("tutorial_is_init")) {
        if ($tutorial.children(".tutorial-slider.one").length < 1) {
          tutorial = $tutorial.get(0);
          slider = new Swipe(tutorial, {
            speed: 500
          });
          $tutorial.data("tutorial_is_init", true);
          $(".tutorial-next", tutorial).click(function(e) {
            e.stopPropagation();
            return slider.next();
          });
          $(".tutorial-prev", tutorial).click(function(e) {
            e.stopPropagation();
            return slider.prev();
          });
        }
        return $(".tutorial-close", tutorial).click(function(e) {
          e.stopPropagation();
          return fc.hideTutorial();
        });
      }
    };
    fc.hideTutorial = function() {
      return $(".tutorial", $.mobile.activePage).fadeOut(400);
    };
    fc.user = {
      get: function(done) {
        if (currentUser) {
          return done(null, currentUser);
        } else {
          return fc.ajax({
            url: "" + (fc.getResourceURL()) + "/me",
            type: "GET"
          }, function(error, data) {
            currentUser = data;
            return done(error, data);
          });
        }
      },
      update: function(user) {
        return $.extend(true, currentUser, user);
      },
      save: function(user) {
        if (user) {
          return fc.user.update(user);
        }
      }
    };
    fc.cookie = {
      get: function() {
        if (!currentCookie) {
          currentCookie = $.cookie("fannect_cached");
        }
        return currentCookie || {};
      },
      update: function(data) {
        $.extend(true, currentCookie, data);
        return currentCookie;
      },
      save: function(data) {
        var cookieData;
        if (data) {
          fc.cookie.update(data);
        }
        cookieData = fc.cookie.get();
        $.cookie("fannect_cached", cookieData, {
          expires: 365,
          path: '/'
        });
        return cookieData;
      }
    };
    fc.auth = {
      login: function(email, pw, done) {
        var query;
        query = {
          email: email,
          password: pw
        };
        $.mobile.loading("show");
        return $.post("" + (fc.getResourceURL()) + "/api/login", query, function(data, status) {
          $.mobile.loading("hide");
          if (data.status === "success") {
            return done();
          } else {
            return done(data.error_message);
          }
        });
      },
      isLoggedIn: function() {
        return fc.cookie.get().refresh_token != null;
      },
      redirectToLogin: function() {
        var noAuth, _ref;
        noAuth = ["index-page", "createAccount-page"];
        if (!(_ref = $.mobile.activePage.id, __indexOf.call(noAuth, _ref) >= 0)) {
          return $.mobile.changePage("index.html", {
            transition: "slidedown"
          });
        }
      }
    };
    return fc.mobile = {
      _buttons: {},
      _addButton: function(index, text, image, target) {
        return forge.tabbar.addButton({
          icon: image,
          text: text,
          index: index
        }, function(button) {
          fc.mobile._buttons[text.toLowerCase()] = button;
          return button.onPressed.addListener(function() {
            return $.mobile.changePage(target, {
              transition: "none"
            });
          });
        });
      },
      createButtons: function() {
        fc.mobile._addButton(0, "Profile", "images/icons/Icon_TabBar_Profile@2x.png", "profile.html");
        fc.mobile._addButton(1, "Games", "images/icons/Icon_TabBar_Points@2x.png", "games.html");
        fc.mobile._addButton(2, "Leaderboard", "images/icons/Icon_TabBar_Leaderboard@2x.png", "leaderboard.html");
        return fc.mobile._addButton(3, "Connect", "images/icons/Icon_TabBar_Connect@2x.png", "connect.html");
      },
      setActiveMenu: function(name) {
        if (name) {
          forge.tabbar.show();
          console.log("ACTIVE NAME" + name);
          console.log(JSON.stringify(fc.mobile._buttons));
          return fc.mobile._buttons[name.toLowerCase()].setActive();
        } else {
          return forge.tabbar.hide();
        }
      },
      addHeaderButton: function(options, click) {
        var cb;
        if (forge.is.mobile()) {
          cb = cb || options.click;
          return forge.topbar.addButton(options, cb);
        }
      }
    };
  })(window.jQuery, window.forge, window.ko);

}).call(this);

(function() {

  (function($) {
    ko.bindingHandlers.fadeIn = {
      update: function(element, valueAccessor, allBindingAccessor, viewModel, bindingContext) {
        var duration, valueUnwrapped;
        valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
        duration = allBindingAccessor().duration || 400;
        if (valueUnwrapped) {
          return $(element).fadeIn(duration);
        } else {
          return $(element).fadeOut(duration);
        }
      }
    };
    ko.bindingHandlers.disableSlider = {
      update: function(element, valueAccessor, allBindingAccessor, viewModel, bindingContext) {
        var valueUnwrapped;
        valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
        if (valueUnwrapped) {
          return $(element).slider("disable");
        } else {
          return $(element).slider("enable");
        }
      }
    };
    ko.bindingHandlers.disableButton = {
      update: function(element, valueAccessor, allBindingAccessor, viewModel, bindingContext) {
        var valueUnwrapped;
        valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
        if (valueUnwrapped) {
          return $(element).button("disable");
        } else {
          return $(element).button("enable");
        }
      }
    };
    ko.bindingHandlers.listviewUpdate = {
      update: function(element, valueAccessor, allBindingAccessor, viewModel, bindingContext) {
        ko.utils.unwrapObservable(valueAccessor());
        return $(element).listview("refresh");
      }
    };
    return ko.bindingHandlers.sliderUpdate = {
      update: function(element, valueAccessor, allBindingAccessor, viewModel, bindingContext) {
        ko.utils.unwrapObservable(valueAccessor());
        return $(element).slider("refresh");
      }
    };
  })(jQuery);

}).call(this);

(function() {

  (function($) {
    var Scroller;
    Scroller = {
      _create: function() {
        var text, textWrap;
        text = this.element.text();
        this.element.empty().addClass("scrolling-text").append("<div class='cover'></div>");
        textWrap = $("<div class='text-wrap'></div>").appendTo(this.element);
        this.options._first = $("<span class='text'>" + text + "</span>").appendTo(textWrap);
        return this.options._second = $("<span class='text'>" + text + "</span>").appendTo(textWrap);
      },
      start: function() {
        this.options._first.css({
          "left": this.options.start_offset
        });
        this.options._second.css("left", this.options.start_offset + this.options._first.width() + this.options.space_offset);
        this._resetFirst();
        return this._resetSecond();
      },
      stop: function() {
        this.options._first.stop(true);
        this.options._second.stop(true);
        clearTimeout(this.options_hidden_timeout_id);
        return this.options._is_hidden = true;
      },
      _startScroll: function(current, next, cb) {
        var offset, width,
          _this = this;
        width = current.width();
        offset = current.position().left;
        if (!this.element.is(":visible")) {
          return this._hiddenLoop();
        }
        return current.animate({
          left: -1 * width
        }, (width + offset) * this.options.rate, "linear", function() {
          current.css("left", next.position().left + next.width() + _this.options.space_offset);
          return cb.call(_this);
        });
      },
      _resetFirst: function() {
        return this._startScroll(this.options._first, this.options._second, this._resetFirst);
      },
      _resetSecond: function() {
        return this._startScroll(this.options._second, this.options._first, this._resetSecond);
      },
      _hiddenLoop: function() {
        var _this = this;
        if (!this.options._hidden_timeout_id) {
          return this.options._hidden_timeout_id = setTimeout((function() {
            return _this._checkForVisible.call(_this);
          }), 600);
        }
      },
      _checkForVisible: function() {
        this.options._hidden_timeout_id = null;
        if (this.element.is(":visible")) {
          return this.start();
        } else {
          return this._hiddenLoop();
        }
      },
      options: {
        _first: null,
        _second: null,
        _is_stopped: false,
        _hidden_timeout_id: null,
        start_offset: 10,
        space_offset: 25,
        rate: 15
      }
    };
    return $(document).on("mobileinit", function() {
      return $.widget("ui.scroller", Scroller);
    });
  })(jQuery);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Login = (function() {

      function Login() {
        this.email = ko.observable();
        this.password = ko.observable();
      }

      Login.prototype.login = function() {
        fc.auth.login(this.email(), this.password(), function(error) {
          if (!error) {
            return $.mobile.changePage("profile.html", {
              transition: "slideup"
            });
          }
        });
        return false;
      };

      return Login;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Profile = (function() {

      function Profile(done) {
        var _this = this;
        this.editingImage = ko.observable(false);
        fc.user.get(function(err, data) {
          _this.name = ko.observable(data.name);
          _this.team_image = ko.observable(data.team_image || "");
          _this.profile_image = ko.observable(data.profile_image || "");
          _this.favorite_team = ko.observable(data.favorite_team || "Select Team");
          _this.roster = ko.observable(data.roster);
          _this.points = ko.observable(data.points);
          _this.rank = ko.observable(data.rank);
          _this.bio = ko.observable(data.bio);
          _this.game_day_spot = ko.observable(data.game_day_spot);
          _this.bragging_rights = ko.observable(data.bragging_rights);
          return done(err, _this);
        });
      }

      Profile.prototype.changeUserImage = function(data, e) {
        this.editingImage("profile");
        return $("#changeProfileImagePopup").popup("open", {
          transition: "pop",
          positionTo: "window"
        });
      };

      Profile.prototype.changeTeamImage = function(data, e) {
        this.editingImage("team");
        return $("#changeTeamImagePopup").popup("open", {
          transition: "pop",
          positionTo: "window"
        });
      };

      Profile.prototype.takeImage = function(data, e) {
        return navigator.camera.getPicture(this.onImageDataSuccess, this.phoneGapImageError, {
          quality: 80,
          allowEdit: true,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.CAMERA
        });
      };

      Profile.prototype.chooseImage = function(data, e) {
        return navigator.camera.getPicture(this.onImageDataSuccess, this.phoneGapImageError, {
          quality: 80,
          allowEdit: true,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
      };

      Profile.prototype.chooseWebImage = function() {
        return "";
      };

      Profile.prototype.onImageDataSuccess = function(image) {
        if (this.editingImage() === "profile") {
          this.profile_image(image);
          return $("#changeProfileImagePopup").popup("close");
        } else if (this.editingImage() === "team") {
          this.team_image(image);
          return $("#changeTeamImagePopup").popup("close");
        }
      };

      Profile.prototype.cancelImagePicking = function() {
        return this.editingImage("none");
      };

      Profile.prototype.phoneGapImageError = function(message) {
        alert("ERROR: " + message);
        return $("#imageFailedPopup").popup("open", {
          transition: "pop",
          positionTo: "window"
        });
      };

      return Profile;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, ko, fc) {
    return fc.viewModels.Leaderboard = (function() {

      function Leaderboard(done) {
        this.viewToggled = __bind(this.viewToggled, this);

        var _this = this;
        this.overall_loaded = false;
        this.roster_loaded = false;
        this.selected_view = ko.observable("overall");
        this.is_overall_selected = ko.computed(function() {
          return _this.selected_view() === "overall";
        });
        this.is_roster_selected = ko.computed(function() {
          return _this.selected_view() === "roster";
        });
        this.roster_fans = ko.observableArray();
        this.overall_fans = ko.observableArray();
        this.selected_view.subscribe(this.viewToggled);
        this.loadOverall(function(err, data) {
          return done(err, _this);
        });
      }

      Leaderboard.prototype.viewToggled = function() {
        if (this.selected_view() === "roster" && !this.roster_loaded) {
          return this.loadRoster();
        } else if (this.selected_view() === "overall" && !this.overall_loaded) {
          return this.loadOverall();
        }
      };

      Leaderboard.prototype.loadOverall = function(done) {
        var _this = this;
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/me/leaderboard?type=overall",
          type: "GET"
        }, function(error, data) {
          var fan, _i, _len, _ref;
          _ref = data.fans;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            fan = _ref[_i];
            _this.overall_fans.push(fan);
          }
          _this.overall_loaded = true;
          if (done) {
            return done(null, data);
          }
        });
      };

      Leaderboard.prototype.loadRoster = function(done) {
        var _this = this;
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/me/leaderboard?type=roster",
          type: "GET"
        }, function(error, data) {
          var fan, _i, _len, _ref;
          _ref = data.fans;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            fan = _ref[_i];
            _this.roster_fans.push(fan);
          }
          _this.roster_loaded = true;
          $.mobile.loading("hide");
          if (done) {
            return done(null, data);
          }
        });
      };

      return Leaderboard;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Connect = (function() {

      function Connect(done) {
        var _this = this;
        this.load(function(err, data) {
          _this.roster_fans = ko.observableArray(data.fans);
          return done(err, _this);
        });
      }

      Connect.prototype.load = function(done) {
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/me/connect",
          method: "GET"
        }, function(error, data) {
          return done(null, data);
        });
      };

      return Connect;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Profile.Invitations = (function() {

      function Invitations(done) {
        var _this = this;
        this.load(function(err, data) {
          _this.invitations = ko.observableArray(data.invitations);
          return done(err, _this);
        });
      }

      Invitations.prototype.load = function(done) {
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/me/invitations",
          method: "GET"
        }, function(error, data) {
          return done(null, data);
        });
      };

      return Invitations;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, ko, fc) {
    return fc.viewModels.Profile.InvitationProfile = (function(_super) {

      __extends(InvitationProfile, _super);

      function InvitationProfile() {
        return InvitationProfile.__super__.constructor.apply(this, arguments);
      }

      InvitationProfile.prototype.acceptInvite = function() {
        $.mobile.changePage("profile.html", {
          transition: "slideup"
        });
        return false;
      };

      InvitationProfile.prototype.changeUserImage = function() {
        return false;
      };

      InvitationProfile.prototype.changeTeamImage = function() {
        return false;
      };

      return InvitationProfile;

    })(fc.viewModels.Profile);
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Profile.EditBio = (function() {

      function EditBio(done) {
        var _this = this;
        fc.user.get(function(err, data) {
          _this.bio = ko.observable(data.bio);
          return done(err, _this);
        });
      }

      EditBio.prototype.next = function() {
        return fc.user.update({
          bio: this.bio
        });
      };

      return EditBio;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Profile.EditGameDaySpot = (function() {

      function EditGameDaySpot(done) {
        var _this = this;
        fc.user.get(function(err, data) {
          _this.game_day_spot = ko.observable(data.game_day_spot);
          return done(err, _this);
        });
      }

      EditGameDaySpot.prototype.next = function() {
        return fc.user.update({
          game_day_spot: this.game_day_spot
        });
      };

      return EditGameDaySpot;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Profile.EditBraggingRights = (function() {

      function EditBraggingRights(done) {
        var _this = this;
        fc.user.get(function(err, data) {
          _this.bragging_rights = ko.observable(data.bragging_rights);
          return done(err, _this);
        });
      }

      EditBraggingRights.prototype.updateProfile = function() {
        return fc.user.update({
          bragging_rights: this.bragging_rights
        });
      };

      return EditBraggingRights;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    fc.viewModels.Games = {};
    return fc.viewModels.Games.AttendanceStreak = (function() {

      function AttendanceStreak(done) {
        var _this = this;
        this.load(function(err, data) {
          _this.checked_in = ko.observable(data.checked_in);
          _this.no_game = data.no_game || true;
          _this.next_game = data.next_game;
          _this.stadium_name = data.stadium.name;
          _this.stadium_location = data.stadium.location;
          _this.home_team = data.home.name;
          _this.home_record = data.home.record;
          _this.away_team = data.away.name;
          _this.away_record = data.away.record;
          _this.game_preview = data.game_preview;
          return done(err, _this);
        });
      }

      AttendanceStreak.prototype.checkIn = function(data) {
        return this.checked_in(true);
      };

      AttendanceStreak.prototype.load = function(done) {
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/me/games/attendanceStreak",
          type: "GET"
        }, function(error, data) {
          return done(null, data);
        });
      };

      return AttendanceStreak;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Games.GameFace = (function() {

      function GameFace(done) {
        var _this = this;
        this.load(function(err, data) {
          _this.face_value = ko.observable("off");
          _this.face_on = ko.computed(function() {
            var _ref;
            return ((_ref = _this.face_value()) != null ? _ref.toLowerCase() : void 0) === "on";
          });
          _this.available = ko.observable(false);
          if (data.available) {
            _this.available(true);
            _this.face_value(data != null ? data.face_value : void 0);
          } else {
            _this.available(false);
            _this.face_value("off");
          }
          _this.home_team = data.home.name;
          _this.home_record = data.home.record;
          _this.away_team = data.away.name;
          _this.away_record = data.away.record;
          _this.face_on.subscribe(function(newValue) {});
          return done(err, _this);
        });
      }

      GameFace.prototype.load = function(done) {
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/me/games/gameFace",
          type: "GET"
        }, function(error, data) {
          return done(null, data);
        });
      };

      return GameFace;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Games.GuessTheScore = (function() {

      function GuessTheScore(done) {
        var _this = this;
        this.load(function(err, data) {
          _this.picked_at_load = ko.observable(data.picked);
          _this.pick_set = ko.observable(data.picked);
          _this.home_score = ko.observable(_this.picked_at_load ? data.home.picked_score : 0);
          _this.away_score = ko.observable(_this.picked_at_load ? data.away.picked_score : 0);
          _this.home_team = data.home.name;
          _this.home_record = data.home.record;
          _this.away_team = data.away.name;
          _this.away_record = data.away.record;
          _this.game_preview = data.game_preview;
          _this.input_valid = ko.computed(function() {
            return _this.home_score() >= 0 && _this.away_score() >= 0;
          });
          return done(err, _this);
        });
      }

      GuessTheScore.prototype.setPick = function() {
        if (this.input_valid()) {
          return this.pick_set(true);
        }
      };

      GuessTheScore.prototype.load = function(done) {
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/me/games/guessTheScore",
          type: "GET"
        }, function(error, data) {
          return done(null, data);
        });
      };

      return GuessTheScore;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return fc.viewModels.Connect.AddToRoster = (function() {

      function AddToRoster(done) {
        var _this = this;
        this.load(function(err, data) {
          _this.roster_fans = ko.observableArray(data.fans);
          return done(err, _this);
        });
      }

      AddToRoster.prototype.load = function(done) {
        return fc.ajax({
          url: "" + (fc.getResourceURL()) + "/api/connect/addToRoster",
          method: "GET"
        }, function(error, data) {
          return done(null, data);
        });
      };

      return AddToRoster;

    })();
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, ko, fc) {
    return fc.viewModels.Connect.AddToRosterProfile = (function(_super) {

      __extends(AddToRosterProfile, _super);

      function AddToRosterProfile() {
        return AddToRosterProfile.__super__.constructor.apply(this, arguments);
      }

      AddToRosterProfile.prototype.addToRoster = function() {
        return console.log("ADD TO ROSTER- FINISH");
      };

      AddToRosterProfile.prototype.changeUserImage = function() {
        return false;
      };

      AddToRosterProfile.prototype.changeTeamImage = function() {
        return false;
      };

      return AddToRosterProfile;

    })(fc.viewModels.Profile);
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, ko, fc) {
    return fc.viewModels.Leaderboard.RosterProfile = (function(_super) {

      __extends(RosterProfile, _super);

      function RosterProfile(done) {
        var _this = this;
        this.checkIfOnRoster(function(err, on_roster) {
          _this.on_roster = ko.observable(on_roster);
          return RosterProfile.__super__.constructor.call(_this, done);
        });
      }

      RosterProfile.prototype.checkIfOnRoster = function(done) {
        return done(null, false);
      };

      RosterProfile.prototype.sendInvite = function() {
        return false;
      };

      RosterProfile.prototype.changeUserImage = function() {
        return false;
      };

      RosterProfile.prototype.changeTeamImage = function() {
        return false;
      };

      return RosterProfile;

    })(fc.viewModels.Profile);
  })(jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  (function($, ko, fc) {
    return $(document).bind("mobileinit", function() {
      return $("#index-page").live("pagecreate", function() {
        return ko.applyBindings(new window.fannect.viewModels.Login(), this);
      }).live("pagebeforeshow", function() {
        return $.mobile.changePage("profile.html", {
          transition: "none"
        });
      });
    });
  })(window.jQuery, window.ko, window.fannect);

}).call(this);

(function() {

  $(document).bind("mobileinit", function() {
    $("#connect-page").live("pagecreate", function() {
      var _this = this;
      return new window.fannect.viewModels.Connect(function(err, vm) {
        return ko.applyBindings(vm, _this);
      });
    });
    $("#connect-addToRoster-page").live("pagecreate", function() {
      var _this = this;
      return new window.fannect.viewModels.Connect.AddToRoster(function(err, vm) {
        return ko.applyBindings(vm, _this);
      });
    });
    return $("#connect-addToRosterProfile-page").live("pagecreate", function() {
      var _this = this;
      return new window.fannect.viewModels.Connect.AddToRosterProfile(function(err, vm) {
        return ko.applyBindings(vm, _this);
      });
    });
  });

}).call(this);

(function() {

  (function($, ko) {
    var setupAttendanceStreak, setupGameFace, setupGuessTheScore;
    setupGuessTheScore = function() {
      return $("#games-guessTheScore-page").live("pagecreate", function() {
        var scroller,
          _this = this;
        scroller = $(".scrolling-text", this).scroller();
        return new window.fannect.viewModels.Games.GuessTheScore(function(err, vm) {
          return ko.applyBindings(vm, _this);
        });
      }).live("pageshow", function() {
        return $(".scrolling-text", this).scroller("start");
      }).live("pagebeforehide", function() {
        return $(".scrolling-text", this).scroller("stop");
      });
    };
    setupGameFace = function() {
      return $("#games-gameFace-page").live("pagecreate", function() {
        var _this = this;
        $(".scrolling-text", this).scroller();
        return new window.fannect.viewModels.Games.GameFace(function(err, vm) {
          return ko.applyBindings(vm, _this);
        });
      }).live("pageshow", function() {
        return $(".scrolling-text", this).scroller("start");
      }).live("pagebeforehide", function() {
        return $(".scrolling-text", this).scroller("stop");
      });
    };
    setupAttendanceStreak = function() {
      var scroller, viewModel;
      viewModel = null;
      scroller = null;
      return $("#games-attendanceStreak-page").live("pagecreate", function() {
        var _this = this;
        scroller = $(".scrolling-text", this).scroller();
        return new window.fannect.viewModels.Games.AttendanceStreak(function(err, vm) {
          viewModel = vm;
          if (vm.no_game) {
            scroller.scroller("start");
          }
          return ko.applyBindings(vm, _this);
        });
      }).live("pageshow", function() {
        if (viewModel != null ? viewModel.no_game : void 0) {
          return scroller.scroller("start");
        }
      }).live("pagebeforehide", function() {
        return scroller.scroller("stop");
      });
    };
    return $(document).bind("mobileinit", function() {
      setupGuessTheScore();
      setupGameFace();
      return setupAttendanceStreak();
    });
  })(window.jQuery, window.ko);

}).call(this);

(function() {

  $(document).bind("mobileinit", function() {
    $("#leaderboard-page").live("pagecreate", function() {
      var _this = this;
      return new window.fannect.viewModels.Leaderboard(function(err, vm) {
        return ko.applyBindings(vm, _this);
      });
    });
    return $("#leaderboard-rosterProfile-page").live("pagecreate", function() {
      var _this = this;
      return new window.fannect.viewModels.Leaderboard.RosterProfile(function(err, vm) {
        return ko.applyBindings(vm, _this);
      });
    });
  });

}).call(this);

(function() {

  $(document).bind("mobileinit", function() {});

}).call(this);

(function() {

  (function($, ko, fc) {
    return $(document).bind("mobileinit", function() {
      var profile_vm;
      profile_vm = null;
      $("#profile-page").live("pagecreate", function() {
        var _this = this;
        return new window.fannect.viewModels.Profile(function(err, vm) {
          profile_vm = vm;
          return ko.applyBindings(vm, _this);
        });
      }).live("pageshow", function() {
        return fc.mobile.addHeaderButton({
          text: "Invitations",
          position: "left",
          click: function() {
            return $.mobile.changePage("profile-invitations.html");
          }
        });
      });
      $("#profile-invitations-page").live("pagecreate", function() {
        var _this = this;
        return new window.fannect.viewModels.Profile.Invitations(function(err, vm) {
          return ko.applyBindings(vm, _this);
        });
      });
      $("#profile-invitationProfile-page").live("pagecreate", function() {
        var _this = this;
        return new window.fannect.viewModels.Profile.InvitationProfile(function(err, vm) {
          return ko.applyBindings(vm, _this);
        });
      });
      $("#profile-editBio-page").live("pagecreate", function() {
        var _this = this;
        return new window.fannect.viewModels.Profile.EditBio(function(err, vm) {
          return ko.applyBindings(vm, _this);
        });
      });
      $("#profile-editGameDaySpot-page").live("pagecreate", function() {
        var _this = this;
        return new window.fannect.viewModels.Profile.EditGameDaySpot(function(err, vm) {
          return ko.applyBindings(vm, _this);
        });
      });
      return $("#profile-editBraggingRights-page").live("pagecreate", function() {
        var _this = this;
        return new window.fannect.viewModels.Profile.EditBraggingRights(function(err, vm) {
          return ko.applyBindings(vm, _this);
        });
      });
    });
  })(window.jQuery, window.ko, window.fannect);

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($, fc, forge) {
    var getMenu, setup;
    $(document).on("mobileinit", function() {
      return setup();
    });
    $(".ui-page").live("pagecreate", function() {
      if (forge.is.mobile()) {
        $("body").addClass("is-mobile");
        $(".header", this).removeAttr("data-role data-position data-tap-toggle").css({
          display: "none"
        });
        return $(".footer", this).removeAttr("data-role data-position data-tap-toggle").css({
          display: "none"
        });
      }
    }).live("pagebeforeshow", function() {
      return fc.setActiveMenu(getMenu(this));
    }).live("pageshow", function() {
      var cookie, currentId, tutorial_pages;
      tutorial_pages = ["profile-page", "games-attendanceStreak-page", "games-gameFace-page", "games-guessTheScore-page"];
      currentId = $($.mobile.activePage).attr("id");
      cookie = fc.cookie.get();
      cookie.tutorialShown = cookie.tutorialShown || [];
      if (__indexOf.call(tutorial_pages, currentId) >= 0 && !(__indexOf.call(cookie.tutorialShown, currentId) >= 0)) {
        cookie.tutorialShown.push(currentId);
        fc.showTutorial();
        return fc.cookie.save(cookie);
      }
    }).live("pageremove", function() {
      return fc.clearBindings(this);
    });
    $(".tutorial-link").live("click", function(e) {
      e.stopPropagation();
      fc.showTutorial();
      return false;
    });
    getMenu = function(page) {
      var _ref, _ref1;
      return (_ref = $(".header h1", page)) != null ? (_ref1 = _ref.first()) != null ? _ref1.attr("data-menu-root") : void 0 : void 0;
    };
    return setup = function() {
      $.mobile.allowCrossDomainPages = true;
      $.mobile.loader.prototype.options.text = "loading";
      $.mobile.loader.prototype.options.textVisible = true;
      $.mobile.loader.prototype.options.theme = "b";
      $.mobile.loader.prototype.options.html = "";
      fc.mobile.createButtons();
      if ($.support.touch && !$.support.touchOverflow) {
        $("body").addClass("speed-up");
      }
      if (forge.is.android()) {
        return forge.event.backPressed.addListener(function() {
          return history.back();
        });
      }
    };
  })(window.jQuery, window.fannect, window.forge);

}).call(this);

/*
* jQuery Mobile Framework Git Build: SHA1: b49cc06499abf8f987cf90f35349cfac0918c939 <> Date: Tue Oct 2 11:22:34 2012 -0700
* http://jquerymobile.com
*
* Copyright 2012 jQuery Foundation and other contributors
* Released under the MIT license.
* http://jquery.org/license
*
*/


(function ( root, doc, factory ) {
   if ( typeof define === "function" && define.amd ) {
      // AMD. Register as an anonymous module.
      define( [ "jquery" ], function ( $ ) {
         factory( $, root, doc );
         return $.mobile;
      });
   } else {
      // Browser globals
      factory( root.jQuery, root, doc );
   }
}( this, document, function ( jQuery, window, document, undefined ) {
(function( $, window, undefined ) {

   var nsNormalizeDict = {};

   // jQuery.mobile configurable options
   $.mobile = $.extend( {}, {

      // Version of the jQuery Mobile Framework
      version: "1.2.0",

      // Namespace used framework-wide for data-attrs. Default is no namespace
      ns: "",

      // Define the url parameter used for referencing widget-generated sub-pages.
      // Translates to to example.html&ui-page=subpageIdentifier
      // hash segment before &ui-page= is used to make Ajax request
      subPageUrlKey: "ui-page",

      // Class assigned to page currently in view, and during transitions
      activePageClass: "ui-page-active",

      // Class used for "active" button state, from CSS framework
      activeBtnClass: "ui-btn-active",

      // Class used for "focus" form element state, from CSS framework
      focusClass: "ui-focus",

      // Automatically handle clicks and form submissions through Ajax, when same-domain
      ajaxEnabled: true,

      // Automatically load and show pages based on location.hash
      hashListeningEnabled: true,

      // disable to prevent jquery from bothering with links
      linkBindingEnabled: true,

      // Set default page transition - 'none' for no transitions
      defaultPageTransition: "fade",

      // Set maximum window width for transitions to apply - 'false' for no limit
      maxTransitionWidth: false,

      // Minimum scroll distance that will be remembered when returning to a page
      minScrollBack: 250,

      // DEPRECATED: the following property is no longer in use, but defined until 2.0 to prevent conflicts
      touchOverflowEnabled: false,

      // Set default dialog transition - 'none' for no transitions
      defaultDialogTransition: "pop",

      // Error response message - appears when an Ajax page request fails
      pageLoadErrorMessage: "Error Loading Page",

      // For error messages, which theme does the box uses?
      pageLoadErrorMessageTheme: "e",

      // replace calls to window.history.back with phonegaps navigation helper
      // where it is provided on the window object
      phonegapNavigationEnabled: false,

      //automatically initialize the DOM when it's ready
      autoInitializePage: true,

      pushStateEnabled: true,

      // allows users to opt in to ignoring content by marking a parent element as
      // data-ignored
      ignoreContentEnabled: false,

      // turn of binding to the native orientationchange due to android orientation behavior
      orientationChangeEnabled: true,

      buttonMarkup: {
         hoverDelay: 200
      },

      // TODO might be useful upstream in jquery itself ?
      keyCode: {
         ALT: 18,
         BACKSPACE: 8,
         CAPS_LOCK: 20,
         COMMA: 188,
         COMMAND: 91,
         COMMAND_LEFT: 91, // COMMAND
         COMMAND_RIGHT: 93,
         CONTROL: 17,
         DELETE: 46,
         DOWN: 40,
         END: 35,
         ENTER: 13,
         ESCAPE: 27,
         HOME: 36,
         INSERT: 45,
         LEFT: 37,
         MENU: 93, // COMMAND_RIGHT
         NUMPAD_ADD: 107,
         NUMPAD_DECIMAL: 110,
         NUMPAD_DIVIDE: 111,
         NUMPAD_ENTER: 108,
         NUMPAD_MULTIPLY: 106,
         NUMPAD_SUBTRACT: 109,
         PAGE_DOWN: 34,
         PAGE_UP: 33,
         PERIOD: 190,
         RIGHT: 39,
         SHIFT: 16,
         SPACE: 32,
         TAB: 9,
         UP: 38,
         WINDOWS: 91 // COMMAND
      },

      // Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
      silentScroll: function( ypos ) {
         if ( $.type( ypos ) !== "number" ) {
            ypos = $.mobile.defaultHomeScroll;
         }

         // prevent scrollstart and scrollstop events
         $.event.special.scrollstart.enabled = false;

         setTimeout( function() {
            window.scrollTo( 0, ypos );
            $( document ).trigger( "silentscroll", { x: 0, y: ypos });
         }, 20 );

         setTimeout( function() {
            $.event.special.scrollstart.enabled = true;
         }, 150 );
      },

      // Expose our cache for testing purposes.
      nsNormalizeDict: nsNormalizeDict,

      // Take a data attribute property, prepend the namespace
      // and then camel case the attribute string. Add the result
      // to our nsNormalizeDict so we don't have to do this again.
      nsNormalize: function( prop ) {
         if ( !prop ) {
            return;
         }

         return nsNormalizeDict[ prop ] || ( nsNormalizeDict[ prop ] = $.camelCase( $.mobile.ns + prop ) );
      },

      // Find the closest parent with a theme class on it. Note that
      // we are not using $.fn.closest() on purpose here because this
      // method gets called quite a bit and we need it to be as fast
      // as possible.
      getInheritedTheme: function( el, defaultTheme ) {
         var e = el[ 0 ],
            ltr = "",
            re = /ui-(bar|body|overlay)-([a-z])\b/,
            c, m;

         while ( e ) {
            c = e.className || "";
            if ( c && ( m = re.exec( c ) ) && ( ltr = m[ 2 ] ) ) {
               // We found a parent with a theme class
               // on it so bail from this loop.
               break;
            }

            e = e.parentNode;
         }

         // Return the theme letter we found, if none, return the
         // specified default.

         return ltr || defaultTheme || "a";
      },

      // TODO the following $ and $.fn extensions can/probably should be moved into jquery.mobile.core.helpers
      //
      // Find the closest javascript page element to gather settings data jsperf test
      // http://jsperf.com/single-complex-selector-vs-many-complex-selectors/edit
      // possibly naive, but it shows that the parsing overhead for *just* the page selector vs
      // the page and dialog selector is negligable. This could probably be speed up by
      // doing a similar parent node traversal to the one found in the inherited theme code above
      closestPageData: function( $target ) {
         return $target
            .closest( ':jqmData(role="page"), :jqmData(role="dialog")' )
            .data( "page" );
      },

      enhanceable: function( $set ) {
         return this.haveParents( $set, "enhance" );
      },

      hijackable: function( $set ) {
         return this.haveParents( $set, "ajax" );
      },

      haveParents: function( $set, attr ) {
         if ( !$.mobile.ignoreContentEnabled ) {
            return $set;
         }

         var count = $set.length,
            $newSet = $(),
            e, $element, excluded;

         for ( var i = 0; i < count; i++ ) {
            $element = $set.eq( i );
            excluded = false;
            e = $set[ i ];

            while ( e ) {
               var c = e.getAttribute ? e.getAttribute( "data-" + $.mobile.ns + attr ) : "";

               if ( c === "false" ) {
                  excluded = true;
                  break;
               }

               e = e.parentNode;
            }

            if ( !excluded ) {
               $newSet = $newSet.add( $element );
            }
         }

         return $newSet;
      },

      getScreenHeight: function() {
         // Native innerHeight returns more accurate value for this across platforms,
         // jQuery version is here as a normalized fallback for platforms like Symbian
         return window.innerHeight || $( window ).height();
      }
   }, $.mobile );

   // Mobile version of data and removeData and hasData methods
   // ensures all data is set and retrieved using jQuery Mobile's data namespace
   $.fn.jqmData = function( prop, value ) {
      var result;
      if ( typeof prop !== "undefined" ) {
         if ( prop ) {
            prop = $.mobile.nsNormalize( prop );
         }

         // undefined is permitted as an explicit input for the second param
         // in this case it returns the value and does not set it to undefined
         if( arguments.length < 2 || value === undefined ){
            result = this.data( prop );
         } else {
            result = this.data( prop, value );
         }
      }
      return result;
   };

   $.jqmData = function( elem, prop, value ) {
      var result;
      if ( typeof prop !== "undefined" ) {
         result = $.data( elem, prop ? $.mobile.nsNormalize( prop ) : prop, value );
      }
      return result;
   };

   $.fn.jqmRemoveData = function( prop ) {
      return this.removeData( $.mobile.nsNormalize( prop ) );
   };

   $.jqmRemoveData = function( elem, prop ) {
      return $.removeData( elem, $.mobile.nsNormalize( prop ) );
   };

   $.fn.removeWithDependents = function() {
      $.removeWithDependents( this );
   };

   $.removeWithDependents = function( elem ) {
      var $elem = $( elem );

      ( $elem.jqmData( 'dependents' ) || $() ).remove();
      $elem.remove();
   };

   $.fn.addDependents = function( newDependents ) {
      $.addDependents( $( this ), newDependents );
   };

   $.addDependents = function( elem, newDependents ) {
      var dependents = $( elem ).jqmData( 'dependents' ) || $();

      $( elem ).jqmData( 'dependents', $.merge( dependents, newDependents ) );
   };

   // note that this helper doesn't attempt to handle the callback
   // or setting of an html elements text, its only purpose is
   // to return the html encoded version of the text in all cases. (thus the name)
   $.fn.getEncodedText = function() {
      return $( "<div/>" ).text( $( this ).text() ).html();
   };

   // fluent helper function for the mobile namespaced equivalent
   $.fn.jqmEnhanceable = function() {
      return $.mobile.enhanceable( this );
   };

   $.fn.jqmHijackable = function() {
      return $.mobile.hijackable( this );
   };

   // Monkey-patching Sizzle to filter the :jqmData selector
   var oldFind = $.find,
      jqmDataRE = /:jqmData\(([^)]*)\)/g;

   $.find = function( selector, context, ret, extra ) {
      selector = selector.replace( jqmDataRE, "[data-" + ( $.mobile.ns || "" ) + "$1]" );

      return oldFind.call( this, selector, context, ret, extra );
   };

   $.extend( $.find, oldFind );

   $.find.matches = function( expr, set ) {
      return $.find( expr, null, null, set );
   };

   $.find.matchesSelector = function( node, expr ) {
      return $.find( expr, null, null, [ node ] ).length > 0;
   };
})( jQuery, this );


/*!
 * jQuery UI Widget v1.9.0-beta.1
 *
 * Copyright 2012, https://github.com/jquery/jquery-ui/blob/1.9.0-beta.1/AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

var uuid = 0,
   slice = Array.prototype.slice,
   _cleanData = $.cleanData;
$.cleanData = function( elems ) {
   for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
      try {
         $( elem ).triggerHandler( "remove" );
      // http://bugs.jquery.com/ticket/8235
      } catch( e ) {}
   }
   _cleanData( elems );
};

$.widget = function( name, base, prototype ) {
   var fullName, existingConstructor, constructor, basePrototype,
      namespace = name.split( "." )[ 0 ];

   name = name.split( "." )[ 1 ];
   fullName = namespace + "-" + name;

   if ( !prototype ) {
      prototype = base;
      base = $.Widget;
   }

   // create selector for plugin
   $.expr[ ":" ][ fullName ] = function( elem ) {
      return !!$.data( elem, fullName );
   };

   $[ namespace ] = $[ namespace ] || {};
   existingConstructor = $[ namespace ][ name ];
   constructor = $[ namespace ][ name ] = function( options, element ) {
      // allow instantiation without "new" keyword
      if ( !this._createWidget ) {
         return new constructor( options, element );
      }

      // allow instantiation without initializing for simple inheritance
      // must use "new" keyword (the code above always passes args)
      if ( arguments.length ) {
         this._createWidget( options, element );
      }
   };
   // extend with the existing constructor to carry over any static properties
   $.extend( constructor, existingConstructor, {
      version: prototype.version,
      // copy the object used to create the prototype in case we need to
      // redefine the widget later
      _proto: $.extend( {}, prototype ),
      // track widgets that inherit from this widget in case this widget is
      // redefined after a widget inherits from it
      _childConstructors: []
   });

   basePrototype = new base();
   // we need to make the options hash a property directly on the new instance
   // otherwise we'll modify the options hash on the prototype that we're
   // inheriting from
   basePrototype.options = $.widget.extend( {}, basePrototype.options );
   $.each( prototype, function( prop, value ) {
      if ( $.isFunction( value ) ) {
         prototype[ prop ] = (function() {
            var _super = function() {
                  return base.prototype[ prop ].apply( this, arguments );
               },
               _superApply = function( args ) {
                  return base.prototype[ prop ].apply( this, args );
               };
            return function() {
               var __super = this._super,
                  __superApply = this._superApply,
                  returnValue;

               this._super = _super;
               this._superApply = _superApply;

               returnValue = value.apply( this, arguments );

               this._super = __super;
               this._superApply = __superApply;

               return returnValue;
            };
         })();
      }
   });
   constructor.prototype = $.widget.extend( basePrototype, {
      // TODO: remove support for widgetEventPrefix
      // always use the name + a colon as the prefix, e.g., draggable:start
      // don't prefix for widgets that aren't DOM-based
      widgetEventPrefix: name
   }, prototype, {
      constructor: constructor,
      namespace: namespace,
      widgetName: name,
      // TODO remove widgetBaseClass, see #8155
      widgetBaseClass: fullName,
      widgetFullName: fullName
   });

   // If this widget is being redefined then we need to find all widgets that
   // are inheriting from it and redefine all of them so that they inherit from
   // the new version of this widget. We're essentially trying to replace one
   // level in the prototype chain.
   if ( existingConstructor ) {
      $.each( existingConstructor._childConstructors, function( i, child ) {
         var childPrototype = child.prototype;

         // redefine the child widget using the same prototype that was
         // originally used, but inherit from the new version of the base
         $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
      });
      // remove the list of existing child constructors from the old constructor
      // so the old child constructors can be garbage collected
      delete existingConstructor._childConstructors;
   } else {
      base._childConstructors.push( constructor );
   }

   $.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
   var input = slice.call( arguments, 1 ),
      inputIndex = 0,
      inputLength = input.length,
      key,
      value;
   for ( ; inputIndex < inputLength; inputIndex++ ) {
      for ( key in input[ inputIndex ] ) {
         value = input[ inputIndex ][ key ];
         if (input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
            target[ key ] = $.isPlainObject( value ) ? $.widget.extend( {}, target[ key ], value ) : value;
         }
      }
   }
   return target;
};

$.widget.bridge = function( name, object ) {
   var fullName = object.prototype.widgetFullName;
   $.fn[ name ] = function( options ) {
      var isMethodCall = typeof options === "string",
         args = slice.call( arguments, 1 ),
         returnValue = this;

      // allow multiple hashes to be passed on init
      options = !isMethodCall && args.length ?
         $.widget.extend.apply( null, [ options ].concat(args) ) :
         options;

      if ( isMethodCall ) {
         this.each(function() {
            var methodValue,
               instance = $.data( this, fullName );
            if ( !instance ) {
               return $.error( "cannot call methods on " + name + " prior to initialization; " +
                  "attempted to call method '" + options + "'" );
            }
            if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
               return $.error( "no such method '" + options + "' for " + name + " widget instance" );
            }
            methodValue = instance[ options ].apply( instance, args );
            if ( methodValue !== instance && methodValue !== undefined ) {
               returnValue = methodValue && methodValue.jquery ?
                  returnValue.pushStack( methodValue.get() ) :
                  methodValue;
               return false;
            }
         });
      } else {
         this.each(function() {
            var instance = $.data( this, fullName );
            if ( instance ) {
               instance.option( options || {} )._init();
            } else {
               new object( options, this );
            }
         });
      }

      return returnValue;
   };
};

$.Widget = function( options, element ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
   widgetName: "widget",
   widgetEventPrefix: "",
   defaultElement: "<div>",
   options: {
      disabled: false,

      // callbacks
      create: null
   },
   _createWidget: function( options, element ) {
      element = $( element || this.defaultElement || this )[ 0 ];
      this.element = $( element );
      this.uuid = uuid++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.options = $.widget.extend( {},
         this.options,
         this._getCreateOptions(),
         options );

      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();

      if ( element !== this ) {
         // 1.9 BC for #7810
         // TODO remove dual storage
         $.data( element, this.widgetName, this );
         $.data( element, this.widgetFullName, this );
         this._on({ remove: "destroy" });
         this.document = $( element.style ?
            // element within the document
            element.ownerDocument :
            // element is window or document
            element.document || element );
         this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
      }

      this._create();
      this._trigger( "create", null, this._getCreateEventData() );
      this._init();
   },
   _getCreateOptions: $.noop,
   _getCreateEventData: $.noop,
   _create: $.noop,
   _init: $.noop,

   destroy: function() {
      this._destroy();
      // we can probably remove the unbind calls in 2.0
      // all event bindings should go through this._on()
      this.element
         .unbind( this.eventNamespace )
         // 1.9 BC for #7810
         // TODO remove dual storage
         .removeData( this.widgetName )
         .removeData( this.widgetFullName )
         // support: jquery <1.6.3
         // http://bugs.jquery.com/ticket/9413
         .removeData( $.camelCase( this.widgetFullName ) );
      this.widget()
         .unbind( this.eventNamespace )
         .removeAttr( "aria-disabled" )
         .removeClass(
            this.widgetFullName + "-disabled " +
            "ui-state-disabled" );

      // clean up events and states
      this.bindings.unbind( this.eventNamespace );
      this.hoverable.removeClass( "ui-state-hover" );
      this.focusable.removeClass( "ui-state-focus" );
   },
   _destroy: $.noop,

   widget: function() {
      return this.element;
   },

   option: function( key, value ) {
      var options = key,
         parts,
         curOption,
         i;

      if ( arguments.length === 0 ) {
         // don't return a reference to the internal hash
         return $.widget.extend( {}, this.options );
      }

      if ( typeof key === "string" ) {
         // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
         options = {};
         parts = key.split( "." );
         key = parts.shift();
         if ( parts.length ) {
            curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
            for ( i = 0; i < parts.length - 1; i++ ) {
               curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
               curOption = curOption[ parts[ i ] ];
            }
            key = parts.pop();
            if ( value === undefined ) {
               return curOption[ key ] === undefined ? null : curOption[ key ];
            }
            curOption[ key ] = value;
         } else {
            if ( value === undefined ) {
               return this.options[ key ] === undefined ? null : this.options[ key ];
            }
            options[ key ] = value;
         }
      }

      this._setOptions( options );

      return this;
   },
   _setOptions: function( options ) {
      var key;

      for ( key in options ) {
         this._setOption( key, options[ key ] );
      }

      return this;
   },
   _setOption: function( key, value ) {
      this.options[ key ] = value;

      if ( key === "disabled" ) {
         this.widget()
            .toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
            .attr( "aria-disabled", value );
         this.hoverable.removeClass( "ui-state-hover" );
         this.focusable.removeClass( "ui-state-focus" );
      }

      return this;
   },

   enable: function() {
      return this._setOption( "disabled", false );
   },
   disable: function() {
      return this._setOption( "disabled", true );
   },

   _on: function( element, handlers ) {
      // no element argument, shuffle and use this.element
      if ( !handlers ) {
         handlers = element;
         element = this.element;
      } else {
         // accept selectors, DOM elements
         element = $( element );
         this.bindings = this.bindings.add( element );
      }

      var instance = this;
      $.each( handlers, function( event, handler ) {
         function handlerProxy() {
            // allow widgets to customize the disabled handling
            // - disabled as an array instead of boolean
            // - disabled class as method for disabling individual parts
            if ( instance.options.disabled === true ||
                  $( this ).hasClass( "ui-state-disabled" ) ) {
               return;
            }
            return ( typeof handler === "string" ? instance[ handler ] : handler )
               .apply( instance, arguments );
         }

         // copy the guid so direct unbinding works
         if ( typeof handler !== "string" ) {
            handlerProxy.guid = handler.guid =
               handler.guid || handlerProxy.guid || $.guid++;
         }

         var match = event.match( /^(\w+)\s*(.*)$/ ),
            eventName = match[1] + instance.eventNamespace,
            selector = match[2];
         if ( selector ) {
            instance.widget().delegate( selector, eventName, handlerProxy );
         } else {
            element.bind( eventName, handlerProxy );
         }
      });
   },

   _off: function( element, eventName ) {
      eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
      element.unbind( eventName ).undelegate( eventName );
   },

   _delay: function( handler, delay ) {
      function handlerProxy() {
         return ( typeof handler === "string" ? instance[ handler ] : handler )
            .apply( instance, arguments );
      }
      var instance = this;
      return setTimeout( handlerProxy, delay || 0 );
   },

   _hoverable: function( element ) {
      this.hoverable = this.hoverable.add( element );
      this._on( element, {
         mouseenter: function( event ) {
            $( event.currentTarget ).addClass( "ui-state-hover" );
         },
         mouseleave: function( event ) {
            $( event.currentTarget ).removeClass( "ui-state-hover" );
         }
      });
   },

   _focusable: function( element ) {
      this.focusable = this.focusable.add( element );
      this._on( element, {
         focusin: function( event ) {
            $( event.currentTarget ).addClass( "ui-state-focus" );
         },
         focusout: function( event ) {
            $( event.currentTarget ).removeClass( "ui-state-focus" );
         }
      });
   },

   _trigger: function( type, event, data ) {
      var prop, orig,
         callback = this.options[ type ];

      data = data || {};
      event = $.Event( event );
      event.type = ( type === this.widgetEventPrefix ?
         type :
         this.widgetEventPrefix + type ).toLowerCase();
      // the original event may come from any element
      // so we need to reset the target on the new event
      event.target = this.element[ 0 ];

      // copy original event properties over to the new event
      orig = event.originalEvent;
      if ( orig ) {
         for ( prop in orig ) {
            if ( !( prop in event ) ) {
               event[ prop ] = orig[ prop ];
            }
         }
      }

      this.element.trigger( event, data );
      return !( $.isFunction( callback ) &&
         callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
         event.isDefaultPrevented() );
   }
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
   $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
      if ( typeof options === "string" ) {
         options = { effect: options };
      }
      var hasOptions,
         effectName = !options ?
            method :
            options === true || typeof options === "number" ?
               defaultEffect :
               options.effect || defaultEffect;
      options = options || {};
      if ( typeof options === "number" ) {
         options = { duration: options };
      }
      hasOptions = !$.isEmptyObject( options );
      options.complete = callback;
      if ( options.delay ) {
         element.delay( options.delay );
      }
      if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
         element[ method ]( options );
      } else if ( effectName !== method && element[ effectName ] ) {
         element[ effectName ]( options.duration, options.easing, callback );
      } else {
         element.queue(function( next ) {
            $( this )[ method ]();
            if ( callback ) {
               callback.call( element[ 0 ] );
            }
            next();
         });
      }
   };
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
   $.Widget.prototype._getCreateOptions = function() {
      return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
   };
}

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.widget", {
   // decorate the parent _createWidget to trigger `widgetinit` for users
   // who wish to do post post `widgetcreate` alterations/additions
   //
   // TODO create a pull request for jquery ui to trigger this event
   // in the original _createWidget
   _createWidget: function() {
      $.Widget.prototype._createWidget.apply( this, arguments );
      this._trigger( 'init' );
   },

   _getCreateOptions: function() {

      var elem = this.element,
         options = {};

      $.each( this.options, function( option ) {

         var value = elem.jqmData( option.replace( /[A-Z]/g, function( c ) {
                     return "-" + c.toLowerCase();
                  })
               );

         if ( value !== undefined ) {
            options[ option ] = value;
         }
      });

      return options;
   },

   enhanceWithin: function( target, useKeepNative ) {
      this.enhance( $( this.options.initSelector, $( target )), useKeepNative );
   },

   enhance: function( targets, useKeepNative ) {
      var page, keepNative, $widgetElements = $( targets ), self = this;

      // if ignoreContentEnabled is set to true the framework should
      // only enhance the selected elements when they do NOT have a
      // parent with the data-namespace-ignore attribute
      $widgetElements = $.mobile.enhanceable( $widgetElements );

      if ( useKeepNative && $widgetElements.length ) {
         // TODO remove dependency on the page widget for the keepNative.
         // Currently the keepNative value is defined on the page prototype so
         // the method is as well
         page = $.mobile.closestPageData( $widgetElements );
         keepNative = ( page && page.keepNativeSelector()) || "";

         $widgetElements = $widgetElements.not( keepNative );
      }

      $widgetElements[ this.widgetName ]();
   },

   raise: function( msg ) {
      throw "Widget [" + this.widgetName + "]: " + msg;
   }
});

})( jQuery );


(function( $, window ) {
   // DEPRECATED
   // NOTE global mobile object settings
   $.extend( $.mobile, {
      // DEPRECATED Should the text be visble in the loading message?
      loadingMessageTextVisible: undefined,

      // DEPRECATED When the text is visible, what theme does the loading box use?
      loadingMessageTheme: undefined,

      // DEPRECATED default message setting
      loadingMessage: undefined,

      // DEPRECATED
      // Turn on/off page loading message. Theme doubles as an object argument
      // with the following shape: { theme: '', text: '', html: '', textVisible: '' }
      // NOTE that the $.mobile.loading* settings and params past the first are deprecated
      showPageLoadingMsg: function( theme, msgText, textonly ) {
         $.mobile.loading( 'show', theme, msgText, textonly );
      },

      // DEPRECATED
      hidePageLoadingMsg: function() {
         $.mobile.loading( 'hide' );
      },

      loading: function() {
         this.loaderWidget.loader.apply( this.loaderWidget, arguments );
      }
   });

   // TODO move loader class down into the widget settings
   var loaderClass = "ui-loader", $html = $( "html" ), $window = $( window );

   $.widget( "mobile.loader", {
      // NOTE if the global config settings are defined they will override these
      //      options
      options: {
         // the theme for the loading message
         theme: "a",

         // whether the text in the loading message is shown
         textVisible: false,

         // custom html for the inner content of the loading message
         html: "",

         // the text to be displayed when the popup is shown
         text: "loading"
      },

      defaultHtml: "<div class='" + loaderClass + "'>" +
         "<span class='ui-icon ui-icon-loading'></span>" +
         "<h1></h1>" +
         "</div>",

      // For non-fixed supportin browsers. Position at y center (if scrollTop supported), above the activeBtn (if defined), or just 100px from top
      fakeFixLoader: function() {
         var activeBtn = $( "." + $.mobile.activeBtnClass ).first();

         this.element
            .css({
               top: $.support.scrollTop && $window.scrollTop() + $window.height() / 2 ||
                  activeBtn.length && activeBtn.offset().top || 100
            });
      },

      // check position of loader to see if it appears to be "fixed" to center
      // if not, use abs positioning
      checkLoaderPosition: function() {
         var offset = this.element.offset(),
            scrollTop = $window.scrollTop(),
            screenHeight = $.mobile.getScreenHeight();

         if ( offset.top < scrollTop || ( offset.top - scrollTop ) > screenHeight ) {
            this.element.addClass( "ui-loader-fakefix" );
            this.fakeFixLoader();
            $window
               .unbind( "scroll", this.checkLoaderPosition )
               .bind( "scroll", this.fakeFixLoader );
         }
      },

      resetHtml: function() {
         this.element.html( $( this.defaultHtml ).html() );
      },

      // Turn on/off page loading message. Theme doubles as an object argument
      // with the following shape: { theme: '', text: '', html: '', textVisible: '' }
      // NOTE that the $.mobile.loading* settings and params past the first are deprecated
      // TODO sweet jesus we need to break some of this out
      show: function( theme, msgText, textonly ) {
         var textVisible, message, $header, loadSettings;

         this.resetHtml();

         // use the prototype options so that people can set them globally at
         // mobile init. Consistency, it's what's for dinner
         if ( $.type(theme) === "object" ) {
            loadSettings = $.extend( {}, this.options, theme );

            // prefer object property from the param then the old theme setting
            theme = loadSettings.theme || $.mobile.loadingMessageTheme;
         } else {
            loadSettings = this.options;

            // here we prefer the them value passed as a string argument, then
            // we prefer the global option because we can't use undefined default
            // prototype options, then the prototype option
            theme = theme || $.mobile.loadingMessageTheme || loadSettings.theme;
         }

         // set the message text, prefer the param, then the settings object
         // then loading message
         message = msgText || $.mobile.loadingMessage || loadSettings.text;

         // prepare the dom
         $html.addClass( "ui-loading" );

         if ( $.mobile.loadingMessage !== false || loadSettings.html ) {
            // boolean values require a bit more work :P, supports object properties
            // and old settings
            if ( $.mobile.loadingMessageTextVisible !== undefined ) {
               textVisible = $.mobile.loadingMessageTextVisible;
            } else {
               textVisible = loadSettings.textVisible;
            }

            // add the proper css given the options (theme, text, etc)
            // Force text visibility if the second argument was supplied, or
            // if the text was explicitly set in the object args
            this.element.attr("class", loaderClass +
               " ui-corner-all ui-body-" + theme +
               " ui-loader-" + ( textVisible || msgText || theme.text ? "verbose" : "default" ) +
               ( loadSettings.textonly || textonly ? " ui-loader-textonly" : "" ) );

            // TODO verify that jquery.fn.html is ok to use in both cases here
            //      this might be overly defensive in preventing unknowing xss
            // if the html attribute is defined on the loading settings, use that
            // otherwise use the fallbacks from above
            if ( loadSettings.html ) {
               this.element.html( loadSettings.html );
            } else {
               this.element.find( "h1" ).text( message );
            }

            // attach the loader to the DOM
            this.element.appendTo( $.mobile.pageContainer );

            // check that the loader is visible
            this.checkLoaderPosition();

            // on scroll check the loader position
            $window.bind( "scroll", $.proxy( this.checkLoaderPosition, this ) );
         }
      },

      hide: function() {
         $html.removeClass( "ui-loading" );

         if ( $.mobile.loadingMessage ) {
            this.element.removeClass( "ui-loader-fakefix" );
         }

         $( window ).unbind( "scroll", $.proxy( this.fakeFixLoader, this) );
         $( window ).unbind( "scroll", $.proxy( this.checkLoaderPosition, this ) );
      }
   });

   $window.bind( 'pagecontainercreate', function() {
      $.mobile.loaderWidget = $.mobile.loaderWidget || $( $.mobile.loader.prototype.defaultHtml ).loader();
   });
})(jQuery, this);



// This plugin is an experiment for abstracting away the touch and mouse
// events so that developers don't have to worry about which method of input
// the device their document is loaded on supports.
//
// The idea here is to allow the developer to register listeners for the
// basic mouse events, such as mousedown, mousemove, mouseup, and click,
// and the plugin will take care of registering the correct listeners
// behind the scenes to invoke the listener at the fastest possible time
// for that device, while still retaining the order of event firing in
// the traditional mouse environment, should multiple handlers be registered
// on the same element for different events.
//
// The current version exposes the following virtual events to jQuery bind methods:
// "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel"

(function( $, window, document, undefined ) {

var dataPropertyName = "virtualMouseBindings",
   touchTargetPropertyName = "virtualTouchID",
   virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split( " " ),
   touchEventProps = "clientX clientY pageX pageY screenX screenY".split( " " ),
   mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [],
   mouseEventProps = $.event.props.concat( mouseHookProps ),
   activeDocHandlers = {},
   resetTimerID = 0,
   startX = 0,
   startY = 0,
   didScroll = false,
   clickBlockList = [],
   blockMouseTriggers = false,
   blockTouchTriggers = false,
   eventCaptureSupported = "addEventListener" in document,
   $document = $( document ),
   nextTouchID = 1,
   lastTouchID = 0, threshold;

$.vmouse = {
   moveDistanceThreshold: 10,
   clickDistanceThreshold: 10,
   resetTimerDuration: 1500
};

function getNativeEvent( event ) {

   while ( event && typeof event.originalEvent !== "undefined" ) {
      event = event.originalEvent;
   }
   return event;
}

function createVirtualEvent( event, eventType ) {

   var t = event.type,
      oe, props, ne, prop, ct, touch, i, j, len;

   event = $.Event( event );
   event.type = eventType;

   oe = event.originalEvent;
   props = $.event.props;

   // addresses separation of $.event.props in to $.event.mouseHook.props and Issue 3280
   // https://github.com/jquery/jquery-mobile/issues/3280
   if ( t.search( /^(mouse|click)/ ) > -1 ) {
      props = mouseEventProps;
   }

   // copy original event properties over to the new event
   // this would happen if we could call $.event.fix instead of $.Event
   // but we don't have a way to force an event to be fixed multiple times
   if ( oe ) {
      for ( i = props.length, prop; i; ) {
         prop = props[ --i ];
         event[ prop ] = oe[ prop ];
      }
   }

   // make sure that if the mouse and click virtual events are generated
   // without a .which one is defined
   if ( t.search(/mouse(down|up)|click/) > -1 && !event.which ) {
      event.which = 1;
   }

   if ( t.search(/^touch/) !== -1 ) {
      ne = getNativeEvent( oe );
      t = ne.touches;
      ct = ne.changedTouches;
      touch = ( t && t.length ) ? t[0] : ( ( ct && ct.length ) ? ct[ 0 ] : undefined );

      if ( touch ) {
         for ( j = 0, len = touchEventProps.length; j < len; j++) {
            prop = touchEventProps[ j ];
            event[ prop ] = touch[ prop ];
         }
      }
   }

   return event;
}

function getVirtualBindingFlags( element ) {

   var flags = {},
      b, k;

   while ( element ) {

      b = $.data( element, dataPropertyName );

      for (  k in b ) {
         if ( b[ k ] ) {
            flags[ k ] = flags.hasVirtualBinding = true;
         }
      }
      element = element.parentNode;
   }
   return flags;
}

function getClosestElementWithVirtualBinding( element, eventType ) {
   var b;
   while ( element ) {

      b = $.data( element, dataPropertyName );

      if ( b && ( !eventType || b[ eventType ] ) ) {
         return element;
      }
      element = element.parentNode;
   }
   return null;
}

function enableTouchBindings() {
   blockTouchTriggers = false;
}

function disableTouchBindings() {
   blockTouchTriggers = true;
}

function enableMouseBindings() {
   lastTouchID = 0;
   clickBlockList.length = 0;
   blockMouseTriggers = false;

   // When mouse bindings are enabled, our
   // touch bindings are disabled.
   disableTouchBindings();
}

function disableMouseBindings() {
   // When mouse bindings are disabled, our
   // touch bindings are enabled.
   enableTouchBindings();
}

function startResetTimer() {
   clearResetTimer();
   resetTimerID = setTimeout( function() {
      resetTimerID = 0;
      enableMouseBindings();
   }, $.vmouse.resetTimerDuration );
}

function clearResetTimer() {
   if ( resetTimerID ) {
      clearTimeout( resetTimerID );
      resetTimerID = 0;
   }
}

function triggerVirtualEvent( eventType, event, flags ) {
   var ve;

   if ( ( flags && flags[ eventType ] ) ||
            ( !flags && getClosestElementWithVirtualBinding( event.target, eventType ) ) ) {

      ve = createVirtualEvent( event, eventType );

      $( event.target).trigger( ve );
   }

   return ve;
}

function mouseEventCallback( event ) {
   var touchID = $.data( event.target, touchTargetPropertyName );

   if ( !blockMouseTriggers && ( !lastTouchID || lastTouchID !== touchID ) ) {
      var ve = triggerVirtualEvent( "v" + event.type, event );
      if ( ve ) {
         if ( ve.isDefaultPrevented() ) {
            event.preventDefault();
         }
         if ( ve.isPropagationStopped() ) {
            event.stopPropagation();
         }
         if ( ve.isImmediatePropagationStopped() ) {
            event.stopImmediatePropagation();
         }
      }
   }
}

function handleTouchStart( event ) {

   var touches = getNativeEvent( event ).touches,
      target, flags;

   if ( touches && touches.length === 1 ) {

      target = event.target;
      flags = getVirtualBindingFlags( target );

      if ( flags.hasVirtualBinding ) {

         lastTouchID = nextTouchID++;
         $.data( target, touchTargetPropertyName, lastTouchID );

         clearResetTimer();

         disableMouseBindings();
         didScroll = false;

         var t = getNativeEvent( event ).touches[ 0 ];
         startX = t.pageX;
         startY = t.pageY;

         triggerVirtualEvent( "vmouseover", event, flags );
         triggerVirtualEvent( "vmousedown", event, flags );
      }
   }
}

function handleScroll( event ) {
   if ( blockTouchTriggers ) {
      return;
   }

   if ( !didScroll ) {
      triggerVirtualEvent( "vmousecancel", event, getVirtualBindingFlags( event.target ) );
   }

   didScroll = true;
   startResetTimer();
}

function handleTouchMove( event ) {
   if ( blockTouchTriggers ) {
      return;
   }

   var t = getNativeEvent( event ).touches[ 0 ],
      didCancel = didScroll,
      moveThreshold = $.vmouse.moveDistanceThreshold,
      flags = getVirtualBindingFlags( event.target );

      didScroll = didScroll ||
         ( Math.abs( t.pageX - startX ) > moveThreshold ||
            Math.abs( t.pageY - startY ) > moveThreshold );


   if ( didScroll && !didCancel ) {
      triggerVirtualEvent( "vmousecancel", event, flags );
   }

   triggerVirtualEvent( "vmousemove", event, flags );
   startResetTimer();
}

function handleTouchEnd( event ) {
   if ( blockTouchTriggers ) {
      return;
   }

   disableTouchBindings();

   var flags = getVirtualBindingFlags( event.target ),
      t;
   triggerVirtualEvent( "vmouseup", event, flags );

   if ( !didScroll ) {
      var ve = triggerVirtualEvent( "vclick", event, flags );
      if ( ve && ve.isDefaultPrevented() ) {
         // The target of the mouse events that follow the touchend
         // event don't necessarily match the target used during the
         // touch. This means we need to rely on coordinates for blocking
         // any click that is generated.
         t = getNativeEvent( event ).changedTouches[ 0 ];
         clickBlockList.push({
            touchID: lastTouchID,
            x: t.clientX,
            y: t.clientY
         });

         // Prevent any mouse events that follow from triggering
         // virtual event notifications.
         blockMouseTriggers = true;
      }
   }
   triggerVirtualEvent( "vmouseout", event, flags);
   didScroll = false;

   startResetTimer();
}

function hasVirtualBindings( ele ) {
   var bindings = $.data( ele, dataPropertyName ),
      k;

   if ( bindings ) {
      for ( k in bindings ) {
         if ( bindings[ k ] ) {
            return true;
         }
      }
   }
   return false;
}

function dummyMouseHandler() {}

function getSpecialEventObject( eventType ) {
   var realType = eventType.substr( 1 );

   return {
      setup: function( data, namespace ) {
         // If this is the first virtual mouse binding for this element,
         // add a bindings object to its data.

         if ( !hasVirtualBindings( this ) ) {
            $.data( this, dataPropertyName, {} );
         }

         // If setup is called, we know it is the first binding for this
         // eventType, so initialize the count for the eventType to zero.
         var bindings = $.data( this, dataPropertyName );
         bindings[ eventType ] = true;

         // If this is the first virtual mouse event for this type,
         // register a global handler on the document.

         activeDocHandlers[ eventType ] = ( activeDocHandlers[ eventType ] || 0 ) + 1;

         if ( activeDocHandlers[ eventType ] === 1 ) {
            $document.bind( realType, mouseEventCallback );
         }

         // Some browsers, like Opera Mini, won't dispatch mouse/click events
         // for elements unless they actually have handlers registered on them.
         // To get around this, we register dummy handlers on the elements.

         $( this ).bind( realType, dummyMouseHandler );

         // For now, if event capture is not supported, we rely on mouse handlers.
         if ( eventCaptureSupported ) {
            // If this is the first virtual mouse binding for the document,
            // register our touchstart handler on the document.

            activeDocHandlers[ "touchstart" ] = ( activeDocHandlers[ "touchstart" ] || 0) + 1;

            if ( activeDocHandlers[ "touchstart" ] === 1 ) {
               $document.bind( "touchstart", handleTouchStart )
                  .bind( "touchend", handleTouchEnd )

                  // On touch platforms, touching the screen and then dragging your finger
                  // causes the window content to scroll after some distance threshold is
                  // exceeded. On these platforms, a scroll prevents a click event from being
                  // dispatched, and on some platforms, even the touchend is suppressed. To
                  // mimic the suppression of the click event, we need to watch for a scroll
                  // event. Unfortunately, some platforms like iOS don't dispatch scroll
                  // events until *AFTER* the user lifts their finger (touchend). This means
                  // we need to watch both scroll and touchmove events to figure out whether
                  // or not a scroll happenens before the touchend event is fired.

                  .bind( "touchmove", handleTouchMove )
                  .bind( "scroll", handleScroll );
            }
         }
      },

      teardown: function( data, namespace ) {
         // If this is the last virtual binding for this eventType,
         // remove its global handler from the document.

         --activeDocHandlers[ eventType ];

         if ( !activeDocHandlers[ eventType ] ) {
            $document.unbind( realType, mouseEventCallback );
         }

         if ( eventCaptureSupported ) {
            // If this is the last virtual mouse binding in existence,
            // remove our document touchstart listener.

            --activeDocHandlers[ "touchstart" ];

            if ( !activeDocHandlers[ "touchstart" ] ) {
               $document.unbind( "touchstart", handleTouchStart )
                  .unbind( "touchmove", handleTouchMove )
                  .unbind( "touchend", handleTouchEnd )
                  .unbind( "scroll", handleScroll );
            }
         }

         var $this = $( this ),
            bindings = $.data( this, dataPropertyName );

         // teardown may be called when an element was
         // removed from the DOM. If this is the case,
         // jQuery core may have already stripped the element
         // of any data bindings so we need to check it before
         // using it.
         if ( bindings ) {
            bindings[ eventType ] = false;
         }

         // Unregister the dummy event handler.

         $this.unbind( realType, dummyMouseHandler );

         // If this is the last virtual mouse binding on the
         // element, remove the binding data from the element.

         if ( !hasVirtualBindings( this ) ) {
            $this.removeData( dataPropertyName );
         }
      }
   };
}

// Expose our custom events to the jQuery bind/unbind mechanism.

for ( var i = 0; i < virtualEventNames.length; i++ ) {
   $.event.special[ virtualEventNames[ i ] ] = getSpecialEventObject( virtualEventNames[ i ] );
}

// Add a capture click handler to block clicks.
// Note that we require event capture support for this so if the device
// doesn't support it, we punt for now and rely solely on mouse events.
if ( eventCaptureSupported ) {
   document.addEventListener( "click", function( e ) {
      var cnt = clickBlockList.length,
         target = e.target,
         x, y, ele, i, o, touchID;

      if ( cnt ) {
         x = e.clientX;
         y = e.clientY;
         threshold = $.vmouse.clickDistanceThreshold;

         // The idea here is to run through the clickBlockList to see if
         // the current click event is in the proximity of one of our
         // vclick events that had preventDefault() called on it. If we find
         // one, then we block the click.
         //
         // Why do we have to rely on proximity?
         //
         // Because the target of the touch event that triggered the vclick
         // can be different from the target of the click event synthesized
         // by the browser. The target of a mouse/click event that is syntehsized
         // from a touch event seems to be implementation specific. For example,
         // some browsers will fire mouse/click events for a link that is near
         // a touch event, even though the target of the touchstart/touchend event
         // says the user touched outside the link. Also, it seems that with most
         // browsers, the target of the mouse/click event is not calculated until the
         // time it is dispatched, so if you replace an element that you touched
         // with another element, the target of the mouse/click will be the new
         // element underneath that point.
         //
         // Aside from proximity, we also check to see if the target and any
         // of its ancestors were the ones that blocked a click. This is necessary
         // because of the strange mouse/click target calculation done in the
         // Android 2.1 browser, where if you click on an element, and there is a
         // mouse/click handler on one of its ancestors, the target will be the
         // innermost child of the touched element, even if that child is no where
         // near the point of touch.

         ele = target;

         while ( ele ) {
            for ( i = 0; i < cnt; i++ ) {
               o = clickBlockList[ i ];
               touchID = 0;

               if ( ( ele === target && Math.abs( o.x - x ) < threshold && Math.abs( o.y - y ) < threshold ) ||
                        $.data( ele, touchTargetPropertyName ) === o.touchID ) {
                  // XXX: We may want to consider removing matches from the block list
                  //      instead of waiting for the reset timer to fire.
                  e.preventDefault();
                  e.stopPropagation();
                  return;
               }
            }
            ele = ele.parentNode;
         }
      }
   }, true);
}
})( jQuery, window, document );

   (function( $, undefined ) {
      var support = {
         touch: "ontouchend" in document
      };

      $.mobile = $.mobile || {};
      $.mobile.support = $.mobile.support || {};
      $.extend( $.support, support );
      $.extend( $.mobile.support, support );
   }( jQuery ));


(function( $, window, undefined ) {
   // add new event shortcuts
   $.each( ( "touchstart touchmove touchend " +
      "tap taphold " +
      "swipe swipeleft swiperight " +
      "scrollstart scrollstop" ).split( " " ), function( i, name ) {

      $.fn[ name ] = function( fn ) {
         return fn ? this.bind( name, fn ) : this.trigger( name );
      };

      // jQuery < 1.8
      if ( $.attrFn ) {
         $.attrFn[ name ] = true;
      }
   });

   var supportTouch = $.mobile.support.touch,
      scrollEvent = "touchmove scroll",
      touchStartEvent = supportTouch ? "touchstart" : "mousedown",
      touchStopEvent = supportTouch ? "touchend" : "mouseup",
      touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

   function triggerCustomEvent( obj, eventType, event ) {
      var originalType = event.type;
      event.type = eventType;
      $.event.handle.call( obj, event );
      event.type = originalType;
   }

   // also handles scrollstop
   $.event.special.scrollstart = {

      enabled: true,

      setup: function() {

         var thisObject = this,
            $this = $( thisObject ),
            scrolling,
            timer;

         function trigger( event, state ) {
            scrolling = state;
            triggerCustomEvent( thisObject, scrolling ? "scrollstart" : "scrollstop", event );
         }

         // iPhone triggers scroll after a small delay; use touchmove instead
         $this.bind( scrollEvent, function( event ) {

            if ( !$.event.special.scrollstart.enabled ) {
               return;
            }

            if ( !scrolling ) {
               trigger( event, true );
            }

            clearTimeout( timer );
            timer = setTimeout( function() {
               trigger( event, false );
            }, 50 );
         });
      }
   };

   // also handles taphold
   $.event.special.tap = {
      tapholdThreshold: 750,

      setup: function() {
         var thisObject = this,
            $this = $( thisObject );

         $this.bind( "vmousedown", function( event ) {

            if ( event.which && event.which !== 1 ) {
               return false;
            }

            var origTarget = event.target,
               origEvent = event.originalEvent,
               timer;

            function clearTapTimer() {
               clearTimeout( timer );
            }

            function clearTapHandlers() {
               clearTapTimer();

               $this.unbind( "vclick", clickHandler )
                  .unbind( "vmouseup", clearTapTimer );
               $( document ).unbind( "vmousecancel", clearTapHandlers );
            }

            function clickHandler( event ) {
               clearTapHandlers();

               // ONLY trigger a 'tap' event if the start target is
               // the same as the stop target.
               if ( origTarget === event.target ) {
                  triggerCustomEvent( thisObject, "tap", event );
               }
            }

            $this.bind( "vmouseup", clearTapTimer )
               .bind( "vclick", clickHandler );
            $( document ).bind( "vmousecancel", clearTapHandlers );

            timer = setTimeout( function() {
               triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
            }, $.event.special.tap.tapholdThreshold );
         });
      }
   };

   // also handles swipeleft, swiperight
   $.event.special.swipe = {
      scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.

      durationThreshold: 1000, // More time than this, and it isn't a swipe.

      horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.

      verticalDistanceThreshold: 75,  // Swipe vertical displacement must be less than this.

      setup: function() {
         var thisObject = this,
            $this = $( thisObject );

         $this.bind( touchStartEvent, function( event ) {
            var data = event.originalEvent.touches ?
                  event.originalEvent.touches[ 0 ] : event,
               start = {
                  time: ( new Date() ).getTime(),
                  coords: [ data.pageX, data.pageY ],
                  origin: $( event.target )
               },
               stop;

            function moveHandler( event ) {

               if ( !start ) {
                  return;
               }

               var data = event.originalEvent.touches ?
                  event.originalEvent.touches[ 0 ] : event;

               stop = {
                  time: ( new Date() ).getTime(),
                  coords: [ data.pageX, data.pageY ]
               };

               // prevent scrolling
               if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
                  event.preventDefault();
               }
            }

            $this.bind( touchMoveEvent, moveHandler )
               .one( touchStopEvent, function( event ) {
                  $this.unbind( touchMoveEvent, moveHandler );

                  if ( start && stop ) {
                     if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
                        Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
                        Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

                        start.origin.trigger( "swipe" )
                           .trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight" );
                     }
                  }
                  start = stop = undefined;
               });
         });
      }
   };
   $.each({
      scrollstop: "scrollstart",
      taphold: "tap",
      swipeleft: "swipe",
      swiperight: "swipe"
   }, function( event, sourceEvent ) {

      $.event.special[ event ] = {
         setup: function() {
            $( this ).bind( sourceEvent, $.noop );
         }
      };
   });

})( jQuery, this );

   (function( $, undefined ) {
      $.extend( $.support, {
         orientation: "orientation" in window && "onorientationchange" in window
      });
   }( jQuery ));


   // throttled resize event
   (function( $ ) {
      $.event.special.throttledresize = {
         setup: function() {
            $( this ).bind( "resize", handler );
         },
         teardown: function() {
            $( this ).unbind( "resize", handler );
         }
      };

      var throttle = 250,
         handler = function() {
            curr = ( new Date() ).getTime();
            diff = curr - lastCall;

            if ( diff >= throttle ) {

               lastCall = curr;
               $( this ).trigger( "throttledresize" );

            } else {

               if ( heldCall ) {
                  clearTimeout( heldCall );
               }

               // Promise a held call will still execute
               heldCall = setTimeout( handler, throttle - diff );
            }
         },
         lastCall = 0,
         heldCall,
         curr,
         diff;
   })( jQuery );

(function( $, window ) {
   var win = $( window ),
      event_name = "orientationchange",
      special_event,
      get_orientation,
      last_orientation,
      initial_orientation_is_landscape,
      initial_orientation_is_default,
      portrait_map = { "0": true, "180": true };

   // It seems that some device/browser vendors use window.orientation values 0 and 180 to
   // denote the "default" orientation. For iOS devices, and most other smart-phones tested,
   // the default orientation is always "portrait", but in some Android and RIM based tablets,
   // the default orientation is "landscape". The following code attempts to use the window
   // dimensions to figure out what the current orientation is, and then makes adjustments
   // to the to the portrait_map if necessary, so that we can properly decode the
   // window.orientation value whenever get_orientation() is called.
   //
   // Note that we used to use a media query to figure out what the orientation the browser
   // thinks it is in:
   //
   //     initial_orientation_is_landscape = $.mobile.media("all and (orientation: landscape)");
   //
   // but there was an iPhone/iPod Touch bug beginning with iOS 4.2, up through iOS 5.1,
   // where the browser *ALWAYS* applied the landscape media query. This bug does not
   // happen on iPad.

   if ( $.support.orientation ) {

      // Check the window width and height to figure out what the current orientation
      // of the device is at this moment. Note that we've initialized the portrait map
      // values to 0 and 180, *AND* we purposely check for landscape so that if we guess
      // wrong, , we default to the assumption that portrait is the default orientation.
      // We use a threshold check below because on some platforms like iOS, the iPhone
      // form-factor can report a larger width than height if the user turns on the
      // developer console. The actual threshold value is somewhat arbitrary, we just
      // need to make sure it is large enough to exclude the developer console case.

      var ww = window.innerWidth || $( window ).width(),
         wh = window.innerHeight || $( window ).height(),
         landscape_threshold = 50;

      initial_orientation_is_landscape = ww > wh && ( ww - wh ) > landscape_threshold;


      // Now check to see if the current window.orientation is 0 or 180.
      initial_orientation_is_default = portrait_map[ window.orientation ];

      // If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
      // if the initial orientation is portrait, but window.orientation reports 90 or -90, we
      // need to flip our portrait_map values because landscape is the default orientation for
      // this device/browser.
      if ( ( initial_orientation_is_landscape && initial_orientation_is_default ) || ( !initial_orientation_is_landscape && !initial_orientation_is_default ) ) {
         portrait_map = { "-90": true, "90": true };
      }
   }

   $.event.special.orientationchange = $.extend( {}, $.event.special.orientationchange, {
      setup: function() {
         // If the event is supported natively, return false so that jQuery
         // will bind to the event using DOM methods.
         if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
            return false;
         }

         // Get the current orientation to avoid initial double-triggering.
         last_orientation = get_orientation();

         // Because the orientationchange event doesn't exist, simulate the
         // event by testing window dimensions on resize.
         win.bind( "throttledresize", handler );
      },
      teardown: function() {
         // If the event is not supported natively, return false so that
         // jQuery will unbind the event using DOM methods.
         if ( $.support.orientation && !$.event.special.orientationchange.disabled ) {
            return false;
         }

         // Because the orientationchange event doesn't exist, unbind the
         // resize event handler.
         win.unbind( "throttledresize", handler );
      },
      add: function( handleObj ) {
         // Save a reference to the bound event handler.
         var old_handler = handleObj.handler;


         handleObj.handler = function( event ) {
            // Modify event object, adding the .orientation property.
            event.orientation = get_orientation();

            // Call the originally-bound event handler and return its result.
            return old_handler.apply( this, arguments );
         };
      }
   });

   // If the event is not supported natively, this handler will be bound to
   // the window resize event to simulate the orientationchange event.
   function handler() {
      // Get the current orientation.
      var orientation = get_orientation();

      if ( orientation !== last_orientation ) {
         // The orientation has changed, so trigger the orientationchange event.
         last_orientation = orientation;
         win.trigger( event_name );
      }
   }

   // Get the current page orientation. This method is exposed publicly, should it
   // be needed, as jQuery.event.special.orientationchange.orientation()
   $.event.special.orientationchange.orientation = get_orientation = function() {
      var isPortrait = true, elem = document.documentElement;

      // prefer window orientation to the calculation based on screensize as
      // the actual screen resize takes place before or after the orientation change event
      // has been fired depending on implementation (eg android 2.3 is before, iphone after).
      // More testing is required to determine if a more reliable method of determining the new screensize
      // is possible when orientationchange is fired. (eg, use media queries + element + opacity)
      if ( $.support.orientation ) {
         // if the window orientation registers as 0 or 180 degrees report
         // portrait, otherwise landscape
         isPortrait = portrait_map[ window.orientation ];
      } else {
         isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
      }

      return isPortrait ? "portrait" : "landscape";
   };

   $.fn[ event_name ] = function( fn ) {
      return fn ? this.bind( event_name, fn ) : this.trigger( event_name );
   };

   // jQuery < 1.8
   if ( $.attrFn ) {
      $.attrFn[ event_name ] = true;
   }

}( jQuery, this ));


(function( $, undefined ) {

var $window = $( window ),
   $html = $( "html" );

/* $.mobile.media method: pass a CSS media type or query and get a bool return
   note: this feature relies on actual media query support for media queries, though types will work most anywhere
   examples:
      $.mobile.media('screen') // tests for screen media type
      $.mobile.media('screen and (min-width: 480px)') // tests for screen media type with window width > 480px
      $.mobile.media('@media screen and (-webkit-min-device-pixel-ratio: 2)') // tests for webkit 2x pixel ratio (iPhone 4)
*/
$.mobile.media = (function() {
   // TODO: use window.matchMedia once at least one UA implements it
   var cache = {},
      testDiv = $( "<div id='jquery-mediatest'></div>" ),
      fakeBody = $( "<body>" ).append( testDiv );

   return function( query ) {
      if ( !( query in cache ) ) {
         var styleBlock = document.createElement( "style" ),
            cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";

         //must set type for IE!
         styleBlock.type = "text/css";

         if ( styleBlock.styleSheet ) {
            styleBlock.styleSheet.cssText = cssrule;
         } else {
            styleBlock.appendChild( document.createTextNode(cssrule) );
         }

         $html.prepend( fakeBody ).prepend( styleBlock );
         cache[ query ] = testDiv.css( "position" ) === "absolute";
         fakeBody.add( styleBlock ).remove();
      }
      return cache[ query ];
   };
})();

})(jQuery);

(function( $, undefined ) {

// thx Modernizr
function propExists( prop ) {
   var uc_prop = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
      props = ( prop + " " + vendors.join( uc_prop + " " ) + uc_prop ).split( " " );

   for ( var v in props ) {
      if ( fbCSS[ props[ v ] ] !== undefined ) {
         return true;
      }
   }
}

var fakeBody = $( "<body>" ).prependTo( "html" ),
   fbCSS = fakeBody[ 0 ].style,
   vendors = [ "Webkit", "Moz", "O" ],
   webos = "palmGetResource" in window, //only used to rule out scrollTop
   opera = window.opera,
   operamini = window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]",
   bb = window.blackberry && !propExists( "-webkit-transform" ); //only used to rule out box shadow, as it's filled opaque on BB 5 and lower


function validStyle( prop, value, check_vend ) {
   var div = document.createElement( 'div' ),
      uc = function( txt ) {
         return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 );
      },
      vend_pref = function( vend ) {
         return  "-" + vend.charAt( 0 ).toLowerCase() + vend.substr( 1 ) + "-";
      },
      check_style = function( vend ) {
         var vend_prop = vend_pref( vend ) + prop + ": " + value + ";",
            uc_vend = uc( vend ),
            propStyle = uc_vend + uc( prop );

         div.setAttribute( "style", vend_prop );

         if ( !!div.style[ propStyle ] ) {
            ret = true;
         }
      },
      check_vends = check_vend ? [ check_vend ] : vendors,
      ret;

   for( var i = 0; i < check_vends.length; i++ ) {
      check_style( check_vends[i] );
   }
   return !!ret;
}

// Thanks to Modernizr src for this test idea. `perspective` check is limited to Moz to prevent a false positive for 3D transforms on Android.
function transform3dTest() {
   var prop = "transform-3d";
   return validStyle( 'perspective', '10px', 'moz' ) || $.mobile.media( "(-" + vendors.join( "-" + prop + "),(-" ) + "-" + prop + "),(" + prop + ")" );
}

// Test for dynamic-updating base tag support ( allows us to avoid href,src attr rewriting )
function baseTagTest() {
   var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
      base = $( "head base" ),
      fauxEle = null,
      href = "",
      link, rebase;

   if ( !base.length ) {
      base = fauxEle = $( "<base>", { "href": fauxBase }).appendTo( "head" );
   } else {
      href = base.attr( "href" );
   }

   link = $( "<a href='testurl' />" ).prependTo( fakeBody );
   rebase = link[ 0 ].href;
   base[ 0 ].href = href || location.pathname;

   if ( fauxEle ) {
      fauxEle.remove();
   }
   return rebase.indexOf( fauxBase ) === 0;
}

// Thanks Modernizr
function cssPointerEventsTest() {
   var element = document.createElement( 'x' ),
      documentElement = document.documentElement,
      getComputedStyle = window.getComputedStyle,
      supports;

   if ( !( 'pointerEvents' in element.style ) ) {
      return false;
   }

   element.style.pointerEvents = 'auto';
   element.style.pointerEvents = 'x';
   documentElement.appendChild( element );
   supports = getComputedStyle &&
   getComputedStyle( element, '' ).pointerEvents === 'auto';
   documentElement.removeChild( element );
   return !!supports;
}

function boundingRect() {
   var div = document.createElement( "div" );
   return typeof div.getBoundingClientRect !== "undefined";
}

// non-UA-based IE version check by James Padolsey, modified by jdalton - from http://gist.github.com/527683
// allows for inclusion of IE 6+, including Windows Mobile 7
$.extend( $.mobile, { browser: {} } );
$.mobile.browser.ie = (function() {
   var v = 3,
      div = document.createElement( "div" ),
      a = div.all || [];

   do {
      div.innerHTML = "<!--[if gt IE " + ( ++v ) + "]><br><![endif]-->";
   } while( a[0] );

   return v > 4 ? v : !v;
})();


$.extend( $.support, {
   cssTransitions: "WebKitTransitionEvent" in window || validStyle( 'transition', 'height 100ms linear' ) && !opera,
   pushState: "pushState" in history && "replaceState" in history,
   mediaquery: $.mobile.media( "only all" ),
   cssPseudoElement: !!propExists( "content" ),
   touchOverflow: !!propExists( "overflowScrolling" ),
   cssTransform3d: transform3dTest(),
   boxShadow: !!propExists( "boxShadow" ) && !bb,
   scrollTop: ( "pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[ 0 ] ) && !webos && !operamini,
   dynamicBaseTag: baseTagTest(),
   cssPointerEvents: cssPointerEventsTest(),
   boundingRect: boundingRect()
});

fakeBody.remove();


// $.mobile.ajaxBlacklist is used to override ajaxEnabled on platforms that have known conflicts with hash history updates (BB5, Symbian)
// or that generally work better browsing in regular http for full page refreshes (Opera Mini)
// Note: This detection below is used as a last resort.
// We recommend only using these detection methods when all other more reliable/forward-looking approaches are not possible
var nokiaLTE7_3 = (function() {

   var ua = window.navigator.userAgent;

   //The following is an attempt to match Nokia browsers that are running Symbian/s60, with webkit, version 7.3 or older
   return ua.indexOf( "Nokia" ) > -1 &&
         ( ua.indexOf( "Symbian/3" ) > -1 || ua.indexOf( "Series60/5" ) > -1 ) &&
         ua.indexOf( "AppleWebKit" ) > -1 &&
         ua.match( /(BrowserNG|NokiaBrowser)\/7\.[0-3]/ );
})();

// Support conditions that must be met in order to proceed
// default enhanced qualifications are media query support OR IE 7+

$.mobile.gradeA = function() {
   return ( $.support.mediaquery || $.mobile.browser.ie && $.mobile.browser.ie >= 7 ) && ( $.support.boundingRect || $.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/) !== null );
};

$.mobile.ajaxBlacklist =
         // BlackBerry browsers, pre-webkit
         window.blackberry && !window.WebKitPoint ||
         // Opera Mini
         operamini ||
         // Symbian webkits pre 7.3
         nokiaLTE7_3;

// Lastly, this workaround is the only way we've found so far to get pre 7.3 Symbian webkit devices
// to render the stylesheets when they're referenced before this script, as we'd recommend doing.
// This simply reappends the CSS in place, which for some reason makes it apply
if ( nokiaLTE7_3 ) {
   $(function() {
      $( "head link[rel='stylesheet']" ).attr( "rel", "alternate stylesheet" ).attr( "rel", "stylesheet" );
   });
}

// For ruling out shadows via css
if ( !$.support.boxShadow ) {
   $( "html" ).addClass( "ui-mobile-nosupport-boxshadow" );
}

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.page", $.mobile.widget, {
   options: {
      theme: "c",
      domCache: false,
      keepNativeDefault: ":jqmData(role='none'), :jqmData(role='nojs')"
   },

   _create: function() {
      
      var self = this;
      
      // if false is returned by the callbacks do not create the page
      if ( self._trigger( "beforecreate" ) === false ) {
         return false;
      }

      self.element
         .attr( "tabindex", "0" )
         .addClass( "ui-page ui-body-" + self.options.theme )
         .bind( "pagebeforehide", function() {
            self.removeContainerBackground();
         } )
         .bind( "pagebeforeshow", function() {
            self.setContainerBackground();
         } );

   },
   
   removeContainerBackground: function() {
      $.mobile.pageContainer.removeClass( "ui-overlay-" + $.mobile.getInheritedTheme( this.element.parent() ) );
   },
   
   // set the page container background to the page theme
   setContainerBackground: function( theme ) {
      if ( this.options.theme ) {
         $.mobile.pageContainer.addClass( "ui-overlay-" + ( theme || this.options.theme ) );
      }
   },

   keepNativeSelector: function() {
      var options = this.options,
         keepNativeDefined = options.keepNative && $.trim( options.keepNative );

      if ( keepNativeDefined && options.keepNative !== options.keepNativeDefault ) {
         return [options.keepNative, options.keepNativeDefault].join( ", " );
      }

      return options.keepNativeDefault;
   }
});
})( jQuery );

// Script: jQuery hashchange event
// 
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function( $, window, undefined ) {
  // Reused string.
  var str_hashchange = 'hashchange',
    
    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,
    
    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || location.href;
    return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Method: jQuery.fn.hashchange
  // 
  // Bind a handler to the window.onhashchange event or trigger all bound
  // window.onhashchange event handlers. This behavior is consistent with
  // jQuery's built-in event handlers.
  // 
  // Usage:
  // 
  // > jQuery(window).hashchange( [ handler ] );
  // 
  // Arguments:
  // 
  //  handler - (Function) Optional handler to be bound to the hashchange
  //    event. This is a "shortcut" for the more verbose form:
  //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
  //    all bound window.onhashchange event handlers will be triggered. This
  //    is a shortcut for the more verbose
  //    jQuery(window).trigger( 'hashchange' ). These forms are described in
  //    the <hashchange event> section.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
  // $(elem).hashchange() for triggering, like jQuery does for built-in events.
  $.fn[ str_hashchange ] = function( fn ) {
    return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
  };
  
  // Property: jQuery.fn.hashchange.delay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 50.
  
  // Property: jQuery.fn.hashchange.domain
  // 
  // If you're setting document.domain in your JavaScript, and you want hash
  // history to work in IE6/7, not only must this property be set, but you must
  // also set document.domain BEFORE jQuery is loaded into the page. This
  // property is only applicable if you are supporting IE6/7 (or IE8 operating
  // in "IE7 compatibility" mode).
  // 
  // In addition, the <jQuery.fn.hashchange.src> property must be set to the
  // path of the included "document-domain.html" file, which can be renamed or
  // modified if necessary (note that the document.domain specified must be the
  // same in both your main JavaScript as well as in this file).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.domain = document.domain;
  
  // Property: jQuery.fn.hashchange.src
  // 
  // If, for some reason, you need to specify an Iframe src file (for example,
  // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
  // do so using this property. Note that when using this property, history
  // won't be recorded in IE6/7 until the Iframe src file loads. This property
  // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
  // compatibility" mode).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.src = 'path/to/file.html';
  
  $.fn[ str_hashchange ].delay = 50;
  /*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // HTML5 window.onhashchange event is used, otherwise a polling loop is
  // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
  // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
  // compatibility" mode), a hidden Iframe is created to allow the back button
  // and hash-based history to work.
  // 
  // Usage as described in <jQuery.fn.hashchange>:
  // 
  // > // Bind an event handler.
  // > jQuery(window).hashchange( function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).hashchange();
  // 
  // A more verbose usage that allows for event namespacing:
  // 
  // > // Bind an event handler.
  // > jQuery(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).trigger( 'hashchange' );
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one handler
  //   is actually bound to the 'hashchange' event.
  // * If you need the bound handler(s) to execute immediately, in cases where
  //   a location.hash exists on page load, via bookmark or page refresh for
  //   example, use jQuery(window).hashchange() or the more verbose 
  //   jQuery(window).trigger( 'hashchange' ).
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a DOM ready handler.
  
  // Override existing $.event.special.hashchange methods (allowing this plugin
  // to be defined after jQuery BBQ in BBQ's source code).
  special[ str_hashchange ] = $.extend( special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function() {
    var self = {},
      timeout_id,
      
      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),
      
      fn_retval = function( val ) { return val; },
      history_set = fn_retval,
      history_get = fn_retval;
    
    // Start the polling loop.
    self.start = function() {
      timeout_id || poll();
    };
    
    // Stop the polling loop.
    self.stop = function() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // This polling loop checks every $.fn.hashchange.delay milliseconds to see
    // if location.hash has changed, and triggers the 'hashchange' event on
    // window when necessary.
    function poll() {
      var hash = get_fragment(),
        history_hash = history_get( last_hash );
      
      if ( hash !== last_hash ) {
        history_set( last_hash = hash, history_hash );
        
        $(window).trigger( str_hashchange );
        
      } else if ( history_hash !== last_hash ) {
        location.href = location.href.replace( /#.*/, '' ) + history_hash;
      }
      
      timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
    };
    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    $.browser.msie && !supports_onhashchange && (function() {
      // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
      // when running in "IE7 compatibility" mode.
      
      var iframe,
        iframe_src;
      
      // When the event is bound and polling starts in IE 6/7, create a hidden
      // Iframe for history handling.
      self.start = function() {
        if ( !iframe ) {
          iframe_src = $.fn[ str_hashchange ].src;
          iframe_src = iframe_src && iframe_src + get_fragment();
          
          // Create hidden Iframe. Attempt to make Iframe as hidden as possible
          // by using techniques from http://www.paciellogroup.com/blog/?p=604.
          iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
            
            // When Iframe has completely loaded, initialize the history and
            // start polling.
            .one( 'load', function() {
              iframe_src || history_set( get_fragment() );
              poll();
            })
            
            // Load Iframe src if specified, otherwise nothing.
            .attr( 'src', iframe_src || 'javascript:0' )
            
            // Append Iframe after the end of the body to prevent unnecessary
            // initial page scrolling (yes, this works).
            .insertAfter( 'body' )[0].contentWindow;
          
          // Whenever `document.title` changes, update the Iframe's title to
          // prettify the back/next history menu entries. Since IE sometimes
          // errors with "Unspecified error" the very first time this is set
          // (yes, very useful) wrap this with a try/catch block.
          doc.onpropertychange = function() {
            try {
              if ( event.propertyName === 'title' ) {
                iframe.document.title = doc.title;
              }
            } catch(e) {}
          };
          
        }
      };
      
      // Override the "stop" method since an IE6/7 Iframe was created. Even
      // if there are no longer any bound event handlers, the polling loop
      // is still necessary for back/next to work at all!
      self.stop = fn_retval;
      
      // Get history by looking at the hidden Iframe's location.hash.
      history_get = function() {
        return get_fragment( iframe.location.href );
      };
      
      // Set a new history item by opening and then closing the Iframe
      // document, *then* setting its location.hash. If document.domain has
      // been set, update that as well.
      history_set = function( hash, history_hash ) {
        var iframe_doc = iframe.document,
          domain = $.fn[ str_hashchange ].domain;
        
        if ( hash !== history_hash ) {
          // Update Iframe with any initial `document.title` that might be set.
          iframe_doc.title = doc.title;
          
          // Opening the Iframe's document after it has been closed is what
          // actually adds a history entry.
          iframe_doc.open();
          
          // Set document.domain for the Iframe document as well, if necessary.
          domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );
          
          iframe_doc.close();
          
          // Update the Iframe's hash, for great justice.
          iframe.location.hash = hash;
        }
      };
      
    })();
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    return self;
  })();
  
})(jQuery,this);


(function( $, window, undefined ) {

var createHandler = function( sequential ) {

   // Default to sequential
   if ( sequential === undefined ) {
      sequential = true;
   }

   return function( name, reverse, $to, $from ) {

      var deferred = new $.Deferred(),
         reverseClass = reverse ? " reverse" : "",
         active   = $.mobile.urlHistory.getActive(),
         toScroll = active.lastScroll || $.mobile.defaultHomeScroll,
         screenHeight = $.mobile.getScreenHeight(),
         maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $( window ).width() > $.mobile.maxTransitionWidth,
         none = !$.support.cssTransitions || maxTransitionOverride || !name || name === "none" || Math.max( $( window ).scrollTop(), toScroll ) > $.mobile.getMaxScrollForTransition(),
         toPreClass = " ui-page-pre-in",
         toggleViewportClass = function() {
            $.mobile.pageContainer.toggleClass( "ui-mobile-viewport-transitioning viewport-" + name );
         },
         scrollPage = function() {
            // By using scrollTo instead of silentScroll, we can keep things better in order
            // Just to be precautios, disable scrollstart listening like silentScroll would
            $.event.special.scrollstart.enabled = false;

            window.scrollTo( 0, toScroll );

            // reenable scrollstart listening like silentScroll would
            setTimeout( function() {
               $.event.special.scrollstart.enabled = true;
            }, 150 );
         },
         cleanFrom = function() {
            $from
               .removeClass( $.mobile.activePageClass + " out in reverse " + name )
               .height( "" );
         },
         startOut = function() {
            // if it's not sequential, call the doneOut transition to start the TO page animating in simultaneously
            if ( !sequential ) {
               doneOut();
            }
            else {
               $from.animationComplete( doneOut );
            }

            // Set the from page's height and start it transitioning out
            // Note: setting an explicit height helps eliminate tiling in the transitions
            $from
               .height( screenHeight + $( window ).scrollTop() )
               .addClass( name + " out" + reverseClass );
         },

         doneOut = function() {

            if ( $from && sequential ) {
               cleanFrom();
            }

            startIn();
         },

         startIn = function() {

            // Prevent flickering in phonegap container: see comments at #4024 regarding iOS
            $to.css( "z-index", -10 );

            $to.addClass( $.mobile.activePageClass + toPreClass );

            // Send focus to page as it is now display: block
            $.mobile.focusPage( $to );

            // Set to page height
            $to.height( screenHeight + toScroll );

            scrollPage();

            // Restores visibility of the new page: added together with $to.css( "z-index", -10 );
            $to.css( "z-index", "" );

            if ( !none ) {
               $to.animationComplete( doneIn );
            }

            $to
               .removeClass( toPreClass )
               .addClass( name + " in" + reverseClass );

            if ( none ) {
               doneIn();
            }

         },

         doneIn = function() {

            if ( !sequential ) {

               if ( $from ) {
                  cleanFrom();
               }
            }

            $to
               .removeClass( "out in reverse " + name )
               .height( "" );

            toggleViewportClass();

            // In some browsers (iOS5), 3D transitions block the ability to scroll to the desired location during transition
            // This ensures we jump to that spot after the fact, if we aren't there already.
            if ( $( window ).scrollTop() !== toScroll ) {
               scrollPage();
            }

            deferred.resolve( name, reverse, $to, $from, true );
         };

      toggleViewportClass();

      if ( $from && !none ) {
         startOut();
      }
      else {
         doneOut();
      }

      return deferred.promise();
   };
};

// generate the handlers from the above
var sequentialHandler = createHandler(),
   simultaneousHandler = createHandler( false ),
   defaultGetMaxScrollForTransition = function() {
      return $.mobile.getScreenHeight() * 3;
   };

// Make our transition handler the public default.
$.mobile.defaultTransitionHandler = sequentialHandler;

//transition handler dictionary for 3rd party transitions
$.mobile.transitionHandlers = {
   "default": $.mobile.defaultTransitionHandler,
   "sequential": sequentialHandler,
   "simultaneous": simultaneousHandler
};

$.mobile.transitionFallbacks = {};

// If transition is defined, check if css 3D transforms are supported, and if not, if a fallback is specified
$.mobile._maybeDegradeTransition = function( transition ) {
      if ( transition && !$.support.cssTransform3d && $.mobile.transitionFallbacks[ transition ] ) {
         transition = $.mobile.transitionFallbacks[ transition ];
      }

      return transition;
};

// Set the getMaxScrollForTransition to default if no implementation was set by user
$.mobile.getMaxScrollForTransition = $.mobile.getMaxScrollForTransition || defaultGetMaxScrollForTransition;
})( jQuery, this );

(function( $, undefined ) {

   //define vars for interal use
   var $window = $( window ),
      $html = $( 'html' ),
      $head = $( 'head' ),

      //url path helpers for use in relative url management
      path = {

         // This scary looking regular expression parses an absolute URL or its relative
         // variants (protocol, site, document, query, and hash), into the various
         // components (protocol, host, path, query, fragment, etc that make up the
         // URL as well as some other commonly used sub-parts. When used with RegExp.exec()
         // or String.match, it parses the URL into a results array that looks like this:
         //
         //     [0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content
         //     [1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
         //     [2]: http://jblas:password@mycompany.com:8080/mail/inbox
         //     [3]: http://jblas:password@mycompany.com:8080
         //     [4]: http:
         //     [5]: //
         //     [6]: jblas:password@mycompany.com:8080
         //     [7]: jblas:password
         //     [8]: jblas
         //     [9]: password
         //    [10]: mycompany.com:8080
         //    [11]: mycompany.com
         //    [12]: 8080
         //    [13]: /mail/inbox
         //    [14]: /mail/
         //    [15]: inbox
         //    [16]: ?msg=1234&type=unread
         //    [17]: #msg-content
         //
         urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

         // Abstraction to address xss (Issue #4787) by removing the authority in
         // browsers that auto   decode it. All references to location.href should be
         // replaced with a call to this method so that it can be dealt with properly here
         getLocation: function( url ) {
            var uri = url ? this.parseUrl( url ) : location,
               hash = this.parseUrl( url || location.href ).hash;

            // mimic the browser with an empty string when the hash is empty
            hash = hash === "#" ? "" : hash;

            // Make sure to parse the url or the location object for the hash because using location.hash
            // is autodecoded in firefox, the rest of the url should be from the object (location unless
            // we're testing) to avoid the inclusion of the authority
            return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
         },

         parseLocation: function() {
            return this.parseUrl( this.getLocation() );
         },

         //Parse a URL into a structure that allows easy access to
         //all of the URL components by name.
         parseUrl: function( url ) {
            // If we're passed an object, we'll assume that it is
            // a parsed url object and just return it back to the caller.
            if ( $.type( url ) === "object" ) {
               return url;
            }

            var matches = path.urlParseRE.exec( url || "" ) || [];

               // Create an object that allows the caller to access the sub-matches
               // by name. Note that IE returns an empty string instead of undefined,
               // like all other browsers do, so we normalize everything so its consistent
               // no matter what browser we're running on.
               return {
                  href:         matches[  0 ] || "",
                  hrefNoHash:   matches[  1 ] || "",
                  hrefNoSearch: matches[  2 ] || "",
                  domain:       matches[  3 ] || "",
                  protocol:     matches[  4 ] || "",
                  doubleSlash:  matches[  5 ] || "",
                  authority:    matches[  6 ] || "",
                  username:     matches[  8 ] || "",
                  password:     matches[  9 ] || "",
                  host:         matches[ 10 ] || "",
                  hostname:     matches[ 11 ] || "",
                  port:         matches[ 12 ] || "",
                  pathname:     matches[ 13 ] || "",
                  directory:    matches[ 14 ] || "",
                  filename:     matches[ 15 ] || "",
                  search:       matches[ 16 ] || "",
                  hash:         matches[ 17 ] || ""
               };
         },

         //Turn relPath into an asbolute path. absPath is
         //an optional absolute path which describes what
         //relPath is relative to.
         makePathAbsolute: function( relPath, absPath ) {
            if ( relPath && relPath.charAt( 0 ) === "/" ) {
               return relPath;
            }

            relPath = relPath || "";
            absPath = absPath ? absPath.replace( /^\/|(\/[^\/]*|[^\/]+)$/g, "" ) : "";

            var absStack = absPath ? absPath.split( "/" ) : [],
               relStack = relPath.split( "/" );
            for ( var i = 0; i < relStack.length; i++ ) {
               var d = relStack[ i ];
               switch ( d ) {
                  case ".":
                     break;
                  case "..":
                     if ( absStack.length ) {
                        absStack.pop();
                     }
                     break;
                  default:
                     absStack.push( d );
                     break;
               }
            }
            return "/" + absStack.join( "/" );
         },

         //Returns true if both urls have the same domain.
         isSameDomain: function( absUrl1, absUrl2 ) {
            return path.parseUrl( absUrl1 ).domain === path.parseUrl( absUrl2 ).domain;
         },

         //Returns true for any relative variant.
         isRelativeUrl: function( url ) {
            // All relative Url variants have one thing in common, no protocol.
            return path.parseUrl( url ).protocol === "";
         },

         //Returns true for an absolute url.
         isAbsoluteUrl: function( url ) {
            return path.parseUrl( url ).protocol !== "";
         },

         //Turn the specified realtive URL into an absolute one. This function
         //can handle all relative variants (protocol, site, document, query, fragment).
         makeUrlAbsolute: function( relUrl, absUrl ) {
            if ( !path.isRelativeUrl( relUrl ) ) {
               return relUrl;
            }

            if ( absUrl === undefined ) {
               absUrl = documentBase;
            }

            var relObj = path.parseUrl( relUrl ),
               absObj = path.parseUrl( absUrl ),
               protocol = relObj.protocol || absObj.protocol,
               doubleSlash = relObj.protocol ? relObj.doubleSlash : ( relObj.doubleSlash || absObj.doubleSlash ),
               authority = relObj.authority || absObj.authority,
               hasPath = relObj.pathname !== "",
               pathname = path.makePathAbsolute( relObj.pathname || absObj.filename, absObj.pathname ),
               search = relObj.search || ( !hasPath && absObj.search ) || "",
               hash = relObj.hash;

            return protocol + doubleSlash + authority + pathname + search + hash;
         },

         //Add search (aka query) params to the specified url.
         addSearchParams: function( url, params ) {
            var u = path.parseUrl( url ),
               p = ( typeof params === "object" ) ? $.param( params ) : params,
               s = u.search || "?";
            return u.hrefNoSearch + s + ( s.charAt( s.length - 1 ) !== "?" ? "&" : "" ) + p + ( u.hash || "" );
         },

         convertUrlToDataUrl: function( absUrl ) {
            var u = path.parseUrl( absUrl );
            if ( path.isEmbeddedPage( u ) ) {
               // For embedded pages, remove the dialog hash key as in getFilePath(),
               // otherwise the Data Url won't match the id of the embedded Page.
               return u.hash.split( dialogHashKey )[0].replace( /^#/, "" );
            } else if ( path.isSameDomain( u, documentBase ) ) {
               return u.hrefNoHash.replace( documentBase.domain, "" ).split( dialogHashKey )[0];
            }

            return window.decodeURIComponent(absUrl);
         },

         //get path from current hash, or from a file path
         get: function( newPath ) {
            if ( newPath === undefined ) {
               newPath = path.parseLocation().hash;
            }
            return path.stripHash( newPath ).replace( /[^\/]*\.[^\/*]+$/, '' );
         },

         //return the substring of a filepath before the sub-page key, for making a server request
         getFilePath: function( path ) {
            var splitkey = '&' + $.mobile.subPageUrlKey;
            return path && path.split( splitkey )[0].split( dialogHashKey )[0];
         },

         //set location hash to path
         set: function( path ) {
            location.hash = path;
         },

         //test if a given url (string) is a path
         //NOTE might be exceptionally naive
         isPath: function( url ) {
            return ( /\// ).test( url );
         },

         //return a url path with the window's location protocol/hostname/pathname removed
         clean: function( url ) {
            return url.replace( documentBase.domain, "" );
         },

         //just return the url without an initial #
         stripHash: function( url ) {
            return url.replace( /^#/, "" );
         },

         //remove the preceding hash, any query params, and dialog notations
         cleanHash: function( hash ) {
            return path.stripHash( hash.replace( /\?.*$/, "" ).replace( dialogHashKey, "" ) );
         },

         isHashValid: function( hash ) {
            return ( /^#[^#]+$/ ).test( hash );
         },

         //check whether a url is referencing the same domain, or an external domain or different protocol
         //could be mailto, etc
         isExternal: function( url ) {
            var u = path.parseUrl( url );
            return u.protocol && u.domain !== documentUrl.domain ? true : false;
         },

         hasProtocol: function( url ) {
            return ( /^(:?\w+:)/ ).test( url );
         },

         //check if the specified url refers to the first page in the main application document.
         isFirstPageUrl: function( url ) {
            // We only deal with absolute paths.
            var u = path.parseUrl( path.makeUrlAbsolute( url, documentBase ) ),

               // Does the url have the same path as the document?
               samePath = u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ),

               // Get the first page element.
               fp = $.mobile.firstPage,

               // Get the id of the first page element if it has one.
               fpId = fp && fp[0] ? fp[0].id : undefined;

               // The url refers to the first page if the path matches the document and
               // it either has no hash value, or the hash is exactly equal to the id of the
               // first page element.
               return samePath && ( !u.hash || u.hash === "#" || ( fpId && u.hash.replace( /^#/, "" ) === fpId ) );
         },

         isEmbeddedPage: function( url ) {
            var u = path.parseUrl( url );

            //if the path is absolute, then we need to compare the url against
            //both the documentUrl and the documentBase. The main reason for this
            //is that links embedded within external documents will refer to the
            //application document, whereas links embedded within the application
            //document will be resolved against the document base.
            if ( u.protocol !== "" ) {
               return ( u.hash && ( u.hrefNoHash === documentUrl.hrefNoHash || ( documentBaseDiffers && u.hrefNoHash === documentBase.hrefNoHash ) ) );
            }
            return ( /^#/ ).test( u.href );
         },


         // Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
         // requests if the document doing the request was loaded via the file:// protocol.
         // This is usually to allow the application to "phone home" and fetch app specific
         // data. We normally let the browser handle external/cross-domain urls, but if the
         // allowCrossDomainPages option is true, we will allow cross-domain http/https
         // requests to go through our page loading logic.
         isPermittedCrossDomainRequest: function( docUrl, reqUrl ) {
            return $.mobile.allowCrossDomainPages &&
               docUrl.protocol === "file:" &&
               reqUrl.search( /^https?:/ ) !== -1;
         }
      },

      //will be defined when a link is clicked and given an active class
      $activeClickedLink = null,

      //urlHistory is purely here to make guesses at whether the back or forward button was clicked
      //and provide an appropriate transition
      urlHistory = {
         // Array of pages that are visited during a single page load.
         // Each has a url and optional transition, title, and pageUrl (which represents the file path, in cases where URL is obscured, such as dialogs)
         stack: [],

         //maintain an index number for the active page in the stack
         activeIndex: 0,

         //get active
         getActive: function() {
            return urlHistory.stack[ urlHistory.activeIndex ];
         },

         getPrev: function() {
            return urlHistory.stack[ urlHistory.activeIndex - 1 ];
         },

         getNext: function() {
            return urlHistory.stack[ urlHistory.activeIndex + 1 ];
         },

         // addNew is used whenever a new page is added
         addNew: function( url, transition, title, pageUrl, role ) {
            //if there's forward history, wipe it
            if ( urlHistory.getNext() ) {
               urlHistory.clearForward();
            }

            urlHistory.stack.push( {url : url, transition: transition, title: title, pageUrl: pageUrl, role: role } );

            urlHistory.activeIndex = urlHistory.stack.length - 1;
         },

         //wipe urls ahead of active index
         clearForward: function() {
            urlHistory.stack = urlHistory.stack.slice( 0, urlHistory.activeIndex + 1 );
         },

         directHashChange: function( opts ) {
            var back , forward, newActiveIndex, prev = this.getActive();

            // check if url is in history and if it's ahead or behind current page
            $.each( urlHistory.stack, function( i, historyEntry ) {

               //if the url is in the stack, it's a forward or a back
               if ( decodeURIComponent( opts.currentUrl ) === decodeURIComponent( historyEntry.url ) ) {
                  //define back and forward by whether url is older or newer than current page
                  back = i < urlHistory.activeIndex;
                  forward = !back;
                  newActiveIndex = i;
               }
            });

            // save new page index, null check to prevent falsey 0 result
            this.activeIndex = newActiveIndex !== undefined ? newActiveIndex : this.activeIndex;

            if ( back ) {
               ( opts.either || opts.isBack )( true );
            } else if ( forward ) {
               ( opts.either || opts.isForward )( false );
            }
         },

         //disable hashchange event listener internally to ignore one change
         //toggled internally when location.hash is updated to match the url of a successful page load
         ignoreNextHashChange: false
      },

      //define first selector to receive focus when a page is shown
      focusable = "[tabindex],a,button:visible,select:visible,input",

      //queue to hold simultanious page transitions
      pageTransitionQueue = [],

      //indicates whether or not page is in process of transitioning
      isPageTransitioning = false,

      //nonsense hash change key for dialogs, so they create a history entry
      dialogHashKey = "&ui-state=dialog",

      //existing base tag?
      $base = $head.children( "base" ),

      //tuck away the original document URL minus any fragment.
      documentUrl = path.parseLocation(),

      //if the document has an embedded base tag, documentBase is set to its
      //initial value. If a base tag does not exist, then we default to the documentUrl.
      documentBase = $base.length ? path.parseUrl( path.makeUrlAbsolute( $base.attr( "href" ), documentUrl.href ) ) : documentUrl,

      //cache the comparison once.
      documentBaseDiffers = ( documentUrl.hrefNoHash !== documentBase.hrefNoHash ),

      getScreenHeight = $.mobile.getScreenHeight;

      //base element management, defined depending on dynamic base tag support
      var base = $.support.dynamicBaseTag ? {

         //define base element, for use in routing asset urls that are referenced in Ajax-requested markup
         element: ( $base.length ? $base : $( "<base>", { href: documentBase.hrefNoHash } ).prependTo( $head ) ),

         //set the generated BASE element's href attribute to a new page's base path
         set: function( href ) {
            base.element.attr( "href", path.makeUrlAbsolute( href, documentBase ) );
         },

         //set the generated BASE element's href attribute to a new page's base path
         reset: function() {
            base.element.attr( "href", documentBase.hrefNoHash );
         }

      } : undefined;

   /* internal utility functions */

   // NOTE Issue #4950 Android phonegap doesn't navigate back properly
   //      when a full page refresh has taken place. It appears that hashchange
   //      and replacestate history alterations work fine but we need to support
   //      both forms of history traversal in our code that uses backward history
   //      movement
   $.mobile.back = function() {
      var nav = window.navigator;

      // if the setting is on and the navigator object is
      // available use the phonegap navigation capability
      if( this.phonegapNavigationEnabled &&
         nav &&
         nav.app &&
         nav.app.backHistory ){
         nav.app.backHistory();
      } else {
         window.history.back();
      }
   };

   //direct focus to the page title, or otherwise first focusable element
   $.mobile.focusPage = function ( page ) {
      var autofocus = page.find( "[autofocus]" ),
         pageTitle = page.find( ".ui-title:eq(0)" );

      if ( autofocus.length ) {
         autofocus.focus();
         return;
      }

      if ( pageTitle.length ) {
         pageTitle.focus();
      } else{
         page.focus();
      }
   };

   //remove active classes after page transition or error
   function removeActiveLinkClass( forceRemoval ) {
      if ( !!$activeClickedLink && ( !$activeClickedLink.closest( "." + $.mobile.activePageClass ).length || forceRemoval ) ) {
         $activeClickedLink.removeClass( $.mobile.activeBtnClass );
      }
      $activeClickedLink = null;
   }

   function releasePageTransitionLock() {
      isPageTransitioning = false;
      if ( pageTransitionQueue.length > 0 ) {
         $.mobile.changePage.apply( null, pageTransitionQueue.pop() );
      }
   }

   // Save the last scroll distance per page, before it is hidden
   var setLastScrollEnabled = true,
      setLastScroll, delayedSetLastScroll;

   setLastScroll = function() {
      // this barrier prevents setting the scroll value based on the browser
      // scrolling the window based on a hashchange
      if ( !setLastScrollEnabled ) {
         return;
      }

      var active = $.mobile.urlHistory.getActive();

      if ( active ) {
         var lastScroll = $window.scrollTop();

         // Set active page's lastScroll prop.
         // If the location we're scrolling to is less than minScrollBack, let it go.
         active.lastScroll = lastScroll < $.mobile.minScrollBack ? $.mobile.defaultHomeScroll : lastScroll;
      }
   };

   // bind to scrollstop to gather scroll position. The delay allows for the hashchange
   // event to fire and disable scroll recording in the case where the browser scrolls
   // to the hash targets location (sometimes the top of the page). once pagechange fires
   // getLastScroll is again permitted to operate
   delayedSetLastScroll = function() {
      setTimeout( setLastScroll, 100 );
   };

   // disable an scroll setting when a hashchange has been fired, this only works
   // because the recording of the scroll position is delayed for 100ms after
   // the browser might have changed the position because of the hashchange
   $window.bind( $.support.pushState ? "popstate" : "hashchange", function() {
      setLastScrollEnabled = false;
   });

   // handle initial hashchange from chrome :(
   $window.one( $.support.pushState ? "popstate" : "hashchange", function() {
      setLastScrollEnabled = true;
   });

   // wait until the mobile page container has been determined to bind to pagechange
   $window.one( "pagecontainercreate", function() {
      // once the page has changed, re-enable the scroll recording
      $.mobile.pageContainer.bind( "pagechange", function() {

         setLastScrollEnabled = true;

         // remove any binding that previously existed on the get scroll
         // which may or may not be different than the scroll element determined for
         // this page previously
         $window.unbind( "scrollstop", delayedSetLastScroll );

         // determine and bind to the current scoll element which may be the window
         // or in the case of touch overflow the element with touch overflow
         $window.bind( "scrollstop", delayedSetLastScroll );
      });
   });

   // bind to scrollstop for the first page as "pagechange" won't be fired in that case
   $window.bind( "scrollstop", delayedSetLastScroll );

   // No-op implementation of transition degradation
   $.mobile._maybeDegradeTransition = $.mobile._maybeDegradeTransition || function( transition ) {
      return transition;
   };

   //function for transitioning between two existing pages
   function transitionPages( toPage, fromPage, transition, reverse ) {

      if ( fromPage ) {
         //trigger before show/hide events
         fromPage.data( "page" )._trigger( "beforehide", null, { nextPage: toPage } );
      }

      toPage.data( "page" )._trigger( "beforeshow", null, { prevPage: fromPage || $( "" ) } );

      //clear page loader
      $.mobile.hidePageLoadingMsg();

      transition = $.mobile._maybeDegradeTransition( transition );

      //find the transition handler for the specified transition. If there
      //isn't one in our transitionHandlers dictionary, use the default one.
      //call the handler immediately to kick-off the transition.
      var th = $.mobile.transitionHandlers[ transition || "default" ] || $.mobile.defaultTransitionHandler,
         promise = th( transition, reverse, toPage, fromPage );

      promise.done(function() {

         //trigger show/hide events
         if ( fromPage ) {
            fromPage.data( "page" )._trigger( "hide", null, { nextPage: toPage } );
         }

         //trigger pageshow, define prevPage as either fromPage or empty jQuery obj
         toPage.data( "page" )._trigger( "show", null, { prevPage: fromPage || $( "" ) } );
      });

      return promise;
   }

   //simply set the active page's minimum height to screen height, depending on orientation
   function resetActivePageHeight() {
      var aPage = $( "." + $.mobile.activePageClass ),
         aPagePadT = parseFloat( aPage.css( "padding-top" ) ),
         aPagePadB = parseFloat( aPage.css( "padding-bottom" ) ),
         aPageBorderT = parseFloat( aPage.css( "border-top-width" ) ),
         aPageBorderB = parseFloat( aPage.css( "border-bottom-width" ) );

      aPage.css( "min-height", getScreenHeight() - aPagePadT - aPagePadB - aPageBorderT - aPageBorderB );
   }

   //shared page enhancements
   function enhancePage( $page, role ) {
      // If a role was specified, make sure the data-role attribute
      // on the page element is in sync.
      if ( role ) {
         $page.attr( "data-" + $.mobile.ns + "role", role );
      }

      //run page plugin
      $page.page();
   }

   /* exposed $.mobile methods */

   //animation complete callback
   $.fn.animationComplete = function( callback ) {
      if ( $.support.cssTransitions ) {
         return $( this ).one( 'webkitAnimationEnd animationend', callback );
      }
      else{
         // defer execution for consistency between webkit/non webkit
         setTimeout( callback, 0 );
         return $( this );
      }
   };

   //expose path object on $.mobile
   $.mobile.path = path;

   //expose base object on $.mobile
   $.mobile.base = base;

   //history stack
   $.mobile.urlHistory = urlHistory;

   $.mobile.dialogHashKey = dialogHashKey;



   //enable cross-domain page support
   $.mobile.allowCrossDomainPages = false;

   //return the original document url
   $.mobile.getDocumentUrl = function( asParsedObject ) {
      return asParsedObject ? $.extend( {}, documentUrl ) : documentUrl.href;
   };

   //return the original document base url
   $.mobile.getDocumentBase = function( asParsedObject ) {
      return asParsedObject ? $.extend( {}, documentBase ) : documentBase.href;
   };

   $.mobile._bindPageRemove = function() {
      var page = $( this );

      // when dom caching is not enabled or the page is embedded bind to remove the page on hide
      if ( !page.data( "page" ).options.domCache &&
            page.is( ":jqmData(external-page='true')" ) ) {

         page.bind( 'pagehide.remove', function() {
            var $this = $( this ),
               prEvent = new $.Event( "pageremove" );

            $this.trigger( prEvent );

            if ( !prEvent.isDefaultPrevented() ) {
               $this.removeWithDependents();
            }
         });
      }
   };

   // Load a page into the DOM.
   $.mobile.loadPage = function( url, options ) {
      // This function uses deferred notifications to let callers
      // know when the page is done loading, or if an error has occurred.
      var deferred = $.Deferred(),

         // The default loadPage options with overrides specified by
         // the caller.
         settings = $.extend( {}, $.mobile.loadPage.defaults, options ),

         // The DOM element for the page after it has been loaded.
         page = null,

         // If the reloadPage option is true, and the page is already
         // in the DOM, dupCachedPage will be set to the page element
         // so that it can be removed after the new version of the
         // page is loaded off the network.
         dupCachedPage = null,

         // determine the current base url
         findBaseWithDefault = function() {
            var closestBase = ( $.mobile.activePage && getClosestBaseUrl( $.mobile.activePage ) );
            return closestBase || documentBase.hrefNoHash;
         },

         // The absolute version of the URL passed into the function. This
         // version of the URL may contain dialog/subpage params in it.
         absUrl = path.makeUrlAbsolute( url, findBaseWithDefault() );


      // If the caller provided data, and we're using "get" request,
      // append the data to the URL.
      if ( settings.data && settings.type === "get" ) {
         absUrl = path.addSearchParams( absUrl, settings.data );
         settings.data = undefined;
      }

      // If the caller is using a "post" request, reloadPage must be true
      if ( settings.data && settings.type === "post" ) {
         settings.reloadPage = true;
      }

      // The absolute version of the URL minus any dialog/subpage params.
      // In otherwords the real URL of the page to be loaded.
      var fileUrl = path.getFilePath( absUrl ),

         // The version of the Url actually stored in the data-url attribute of
         // the page. For embedded pages, it is just the id of the page. For pages
         // within the same domain as the document base, it is the site relative
         // path. For cross-domain pages (Phone Gap only) the entire absolute Url
         // used to load the page.
         dataUrl = path.convertUrlToDataUrl( absUrl );

      // Make sure we have a pageContainer to work with.
      settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;

      // Check to see if the page already exists in the DOM.
      // NOTE do _not_ use the :jqmData psuedo selector because parenthesis
      //      are a valid url char and it breaks on the first occurence
      page = settings.pageContainer.children( "[data-" + $.mobile.ns +"url='" + dataUrl + "']" );

      // If we failed to find the page, check to see if the url is a
      // reference to an embedded page. If so, it may have been dynamically
      // injected by a developer, in which case it would be lacking a data-url
      // attribute and in need of enhancement.
      if ( page.length === 0 && dataUrl && !path.isPath( dataUrl ) ) {
         page = settings.pageContainer.children( "#" + dataUrl )
            .attr( "data-" + $.mobile.ns + "url", dataUrl )
            .jqmData( "url", dataUrl );
      }

      // If we failed to find a page in the DOM, check the URL to see if it
      // refers to the first page in the application. If it isn't a reference
      // to the first page and refers to non-existent embedded page, error out.
      if ( page.length === 0 ) {
         if ( $.mobile.firstPage && path.isFirstPageUrl( fileUrl ) ) {
            // Check to make sure our cached-first-page is actually
            // in the DOM. Some user deployed apps are pruning the first
            // page from the DOM for various reasons, we check for this
            // case here because we don't want a first-page with an id
            // falling through to the non-existent embedded page error
            // case. If the first-page is not in the DOM, then we let
            // things fall through to the ajax loading code below so
            // that it gets reloaded.
            if ( $.mobile.firstPage.parent().length ) {
               page = $( $.mobile.firstPage );
            }
         } else if ( path.isEmbeddedPage( fileUrl )  ) {
            deferred.reject( absUrl, options );
            return deferred.promise();
         }
      }

      // If the page we are interested in is already in the DOM,
      // and the caller did not indicate that we should force a
      // reload of the file, we are done. Otherwise, track the
      // existing page as a duplicated.
      if ( page.length ) {
         if ( !settings.reloadPage ) {
            enhancePage( page, settings.role );
            deferred.resolve( absUrl, options, page );
            return deferred.promise();
         }
         dupCachedPage = page;
      }

      var mpc = settings.pageContainer,
         pblEvent = new $.Event( "pagebeforeload" ),
         triggerData = { url: url, absUrl: absUrl, dataUrl: dataUrl, deferred: deferred, options: settings };

      // Let listeners know we're about to load a page.
      mpc.trigger( pblEvent, triggerData );

      // If the default behavior is prevented, stop here!
      if ( pblEvent.isDefaultPrevented() ) {
         return deferred.promise();
      }

      if ( settings.showLoadMsg ) {

         // This configurable timeout allows cached pages a brief delay to load without showing a message
         var loadMsgDelay = setTimeout(function() {
               $.mobile.showPageLoadingMsg();
            }, settings.loadMsgDelay ),

            // Shared logic for clearing timeout and removing message.
            hideMsg = function() {

               // Stop message show timer
               clearTimeout( loadMsgDelay );

               // Hide loading message
               $.mobile.hidePageLoadingMsg();
            };
      }

      // Reset base to the default document base.
      if ( base ) {
         base.reset();
      }

      if ( !( $.mobile.allowCrossDomainPages || path.isSameDomain( documentUrl, absUrl ) ) ) {
         deferred.reject( absUrl, options );
      } else {
         // Load the new page.
         $.ajax({
            url: fileUrl,
            type: settings.type,
            data: settings.data,
            dataType: "html",
            success: function( html, textStatus, xhr ) {
               //pre-parse html to check for a data-url,
               //use it as the new fileUrl, base path, etc
               var all = $( "<div></div>" ),

                  //page title regexp
                  newPageTitle = html.match( /<title[^>]*>([^<]*)/ ) && RegExp.$1,

                  // TODO handle dialogs again
                  pageElemRegex = new RegExp( "(<[^>]+\\bdata-" + $.mobile.ns + "role=[\"']?page[\"']?[^>]*>)" ),
                  dataUrlRegex = new RegExp( "\\bdata-" + $.mobile.ns + "url=[\"']?([^\"'>]*)[\"']?" );


               // data-url must be provided for the base tag so resource requests can be directed to the
               // correct url. loading into a temprorary element makes these requests immediately
               if ( pageElemRegex.test( html ) &&
                     RegExp.$1 &&
                     dataUrlRegex.test( RegExp.$1 ) &&
                     RegExp.$1 ) {
                  url = fileUrl = path.getFilePath( $( "<div>" + RegExp.$1 + "</div>" ).text() );
               }

               if ( base ) {
                  base.set( fileUrl );
               }

               //workaround to allow scripts to execute when included in page divs
               all.get( 0 ).innerHTML = html;
               page = all.find( ":jqmData(role='page'), :jqmData(role='dialog')" ).first();

               //if page elem couldn't be found, create one and insert the body element's contents
               if ( !page.length ) {
                  page = $( "<div data-" + $.mobile.ns + "role='page'>" + html.split( /<\/?body[^>]*>/gmi )[1] + "</div>" );
               }

               if ( newPageTitle && !page.jqmData( "title" ) ) {
                  if ( ~newPageTitle.indexOf( "&" ) ) {
                     newPageTitle = $( "<div>" + newPageTitle + "</div>" ).text();
                  }
                  page.jqmData( "title", newPageTitle );
               }

               //rewrite src and href attrs to use a base url
               if ( !$.support.dynamicBaseTag ) {
                  var newPath = path.get( fileUrl );
                  page.find( "[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]" ).each(function() {
                     var thisAttr = $( this ).is( '[href]' ) ? 'href' :
                           $( this ).is( '[src]' ) ? 'src' : 'action',
                        thisUrl = $( this ).attr( thisAttr );

                     // XXX_jblas: We need to fix this so that it removes the document
                     //            base URL, and then prepends with the new page URL.
                     //if full path exists and is same, chop it - helps IE out
                     thisUrl = thisUrl.replace( location.protocol + '//' + location.host + location.pathname, '' );

                     if ( !/^(\w+:|#|\/)/.test( thisUrl ) ) {
                        $( this ).attr( thisAttr, newPath + thisUrl );
                     }
                  });
               }

               //append to page and enhance
               // TODO taging a page with external to make sure that embedded pages aren't removed
               //      by the various page handling code is bad. Having page handling code in many
               //      places is bad. Solutions post 1.0
               page
                  .attr( "data-" + $.mobile.ns + "url", path.convertUrlToDataUrl( fileUrl ) )
                  .attr( "data-" + $.mobile.ns + "external-page", true )
                  .appendTo( settings.pageContainer );

               // wait for page creation to leverage options defined on widget
               page.one( 'pagecreate', $.mobile._bindPageRemove );

               enhancePage( page, settings.role );

               // Enhancing the page may result in new dialogs/sub pages being inserted
               // into the DOM. If the original absUrl refers to a sub-page, that is the
               // real page we are interested in.
               if ( absUrl.indexOf( "&" + $.mobile.subPageUrlKey ) > -1 ) {
                  page = settings.pageContainer.children( "[data-" + $.mobile.ns +"url='" + dataUrl + "']" );
               }

               //bind pageHide to removePage after it's hidden, if the page options specify to do so

               // Remove loading message.
               if ( settings.showLoadMsg ) {
                  hideMsg();
               }

               // Add the page reference and xhr to our triggerData.
               triggerData.xhr = xhr;
               triggerData.textStatus = textStatus;
               triggerData.page = page;

               // Let listeners know the page loaded successfully.
               settings.pageContainer.trigger( "pageload", triggerData );

               deferred.resolve( absUrl, options, page, dupCachedPage );
            },
            error: function( xhr, textStatus, errorThrown ) {
               //set base back to current path
               if ( base ) {
                  base.set( path.get() );
               }

               // Add error info to our triggerData.
               triggerData.xhr = xhr;
               triggerData.textStatus = textStatus;
               triggerData.errorThrown = errorThrown;

               var plfEvent = new $.Event( "pageloadfailed" );

               // Let listeners know the page load failed.
               settings.pageContainer.trigger( plfEvent, triggerData );

               // If the default behavior is prevented, stop here!
               // Note that it is the responsibility of the listener/handler
               // that called preventDefault(), to resolve/reject the
               // deferred object within the triggerData.
               if ( plfEvent.isDefaultPrevented() ) {
                  return;
               }

               // Remove loading message.
               if ( settings.showLoadMsg ) {

                  // Remove loading message.
                  hideMsg();

                  // show error message
                  $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );

                  // hide after delay
                  setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
               }

               deferred.reject( absUrl, options );
            }
         });
      }

      return deferred.promise();
   };

   $.mobile.loadPage.defaults = {
      type: "get",
      data: undefined,
      reloadPage: false,
      role: undefined, // By default we rely on the role defined by the @data-role attribute.
      showLoadMsg: false,
      pageContainer: undefined,
      loadMsgDelay: 50 // This delay allows loads that pull from browser cache to occur without showing the loading message.
   };

   // Show a specific page in the page container.
   $.mobile.changePage = function( toPage, options ) {
      // If we are in the midst of a transition, queue the current request.
      // We'll call changePage() once we're done with the current transition to
      // service the request.
      if ( isPageTransitioning ) {
         pageTransitionQueue.unshift( arguments );
         return;
      }

      var settings = $.extend( {}, $.mobile.changePage.defaults, options );

      // Make sure we have a pageContainer to work with.
      settings.pageContainer = settings.pageContainer || $.mobile.pageContainer;

      // Make sure we have a fromPage.
      settings.fromPage = settings.fromPage || $.mobile.activePage;

      var mpc = settings.pageContainer,
         pbcEvent = new $.Event( "pagebeforechange" ),
         triggerData = { toPage: toPage, options: settings };

      // Let listeners know we're about to change the current page.
      mpc.trigger( pbcEvent, triggerData );

      // If the default behavior is prevented, stop here!
      if ( pbcEvent.isDefaultPrevented() ) {
         return;
      }

      // We allow "pagebeforechange" observers to modify the toPage in the trigger
      // data to allow for redirects. Make sure our toPage is updated.

      toPage = triggerData.toPage;

      // Set the isPageTransitioning flag to prevent any requests from
      // entering this method while we are in the midst of loading a page
      // or transitioning.

      isPageTransitioning = true;

      // If the caller passed us a url, call loadPage()
      // to make sure it is loaded into the DOM. We'll listen
      // to the promise object it returns so we know when
      // it is done loading or if an error ocurred.
      if ( typeof toPage === "string" ) {
         $.mobile.loadPage( toPage, settings )
            .done(function( url, options, newPage, dupCachedPage ) {
               isPageTransitioning = false;
               options.duplicateCachedPage = dupCachedPage;
               $.mobile.changePage( newPage, options );
            })
            .fail(function( url, options ) {
               isPageTransitioning = false;

               //clear out the active button state
               removeActiveLinkClass( true );

               //release transition lock so navigation is free again
               releasePageTransitionLock();
               settings.pageContainer.trigger( "pagechangefailed", triggerData );
            });
         return;
      }

      // If we are going to the first-page of the application, we need to make
      // sure settings.dataUrl is set to the application document url. This allows
      // us to avoid generating a document url with an id hash in the case where the
      // first-page of the document has an id attribute specified.
      if ( toPage[ 0 ] === $.mobile.firstPage[ 0 ] && !settings.dataUrl ) {
         settings.dataUrl = documentUrl.hrefNoHash;
      }

      // The caller passed us a real page DOM element. Update our
      // internal state and then trigger a transition to the page.
      var fromPage = settings.fromPage,
         url = ( settings.dataUrl && path.convertUrlToDataUrl( settings.dataUrl ) ) || toPage.jqmData( "url" ),
         // The pageUrl var is usually the same as url, except when url is obscured as a dialog url. pageUrl always contains the file path
         pageUrl = url,
         fileUrl = path.getFilePath( url ),
         active = urlHistory.getActive(),
         activeIsInitialPage = urlHistory.activeIndex === 0,
         historyDir = 0,
         pageTitle = document.title,
         isDialog = settings.role === "dialog" || toPage.jqmData( "role" ) === "dialog";

      // By default, we prevent changePage requests when the fromPage and toPage
      // are the same element, but folks that generate content manually/dynamically
      // and reuse pages want to be able to transition to the same page. To allow
      // this, they will need to change the default value of allowSamePageTransition
      // to true, *OR*, pass it in as an option when they manually call changePage().
      // It should be noted that our default transition animations assume that the
      // formPage and toPage are different elements, so they may behave unexpectedly.
      // It is up to the developer that turns on the allowSamePageTransitiona option
      // to either turn off transition animations, or make sure that an appropriate
      // animation transition is used.
      if ( fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition ) {
         isPageTransitioning = false;
         mpc.trigger( "pagechange", triggerData );

         // Even if there is no page change to be done, we should keep the urlHistory in sync with the hash changes
         if ( settings.fromHashChange ) {
            urlHistory.directHashChange({
               currentUrl: url,
               isBack:     function() {},
               isForward:  function() {}
            });
         }

         return;
      }

      // We need to make sure the page we are given has already been enhanced.
      enhancePage( toPage, settings.role );

      // If the changePage request was sent from a hashChange event, check to see if the
      // page is already within the urlHistory stack. If so, we'll assume the user hit
      // the forward/back button and will try to match the transition accordingly.
      if ( settings.fromHashChange ) {
         urlHistory.directHashChange({
            currentUrl: url,
            isBack:     function() { historyDir = -1; },
            isForward:  function() { historyDir = 1; }
         });
      }

      // Kill the keyboard.
      // XXX_jblas: We need to stop crawling the entire document to kill focus. Instead,
      //            we should be tracking focus with a delegate() handler so we already have
      //            the element in hand at this point.
      // Wrap this in a try/catch block since IE9 throw "Unspecified error" if document.activeElement
      // is undefined when we are in an IFrame.
      try {
         if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== 'body' ) {
            $( document.activeElement ).blur();
         } else {
            $( "input:focus, textarea:focus, select:focus" ).blur();
         }
      } catch( e ) {}

      // Record whether we are at a place in history where a dialog used to be - if so, do not add a new history entry and do not change the hash either
      var alreadyThere = false;

      // If we're displaying the page as a dialog, we don't want the url
      // for the dialog content to be used in the hash. Instead, we want
      // to append the dialogHashKey to the url of the current page.
      if ( isDialog && active ) {
         // on the initial page load active.url is undefined and in that case should
         // be an empty string. Moving the undefined -> empty string back into
         // urlHistory.addNew seemed imprudent given undefined better represents
         // the url state

         // If we are at a place in history that once belonged to a dialog, reuse
         // this state without adding to urlHistory and without modifying the hash.
         // However, if a dialog is already displayed at this point, and we're
         // about to display another dialog, then we must add another hash and
         // history entry on top so that one may navigate back to the original dialog
         if ( active.url.indexOf( dialogHashKey ) > -1 && !$.mobile.activePage.is( ".ui-dialog" ) ) {
            settings.changeHash = false;
            alreadyThere = true;
         }

         // Normally, we tack on a dialog hash key, but if this is the location of a stale dialog,
         // we reuse the URL from the entry
         url = ( active.url || "" ) + ( alreadyThere ? "" : dialogHashKey );

         // tack on another dialogHashKey if this is the same as the initial hash
         // this makes sure that a history entry is created for this dialog
         if ( urlHistory.activeIndex === 0 && url === urlHistory.initialDst ) {
            url += dialogHashKey;
         }
      }

      // Set the location hash.
      if ( settings.changeHash !== false && url ) {
         //disable hash listening temporarily
         urlHistory.ignoreNextHashChange = true;
         //update hash and history
         path.set( url );
      }

      // if title element wasn't found, try the page div data attr too
      // If this is a deep-link or a reload ( active === undefined ) then just use pageTitle
      var newPageTitle = ( !active )? pageTitle : toPage.jqmData( "title" ) || toPage.children( ":jqmData(role='header')" ).find( ".ui-title" ).getEncodedText();
      if ( !!newPageTitle && pageTitle === document.title ) {
         pageTitle = newPageTitle;
      }
      if ( !toPage.jqmData( "title" ) ) {
         toPage.jqmData( "title", pageTitle );
      }

      // Make sure we have a transition defined.
      settings.transition = settings.transition ||
         ( ( historyDir && !activeIsInitialPage ) ? active.transition : undefined ) ||
         ( isDialog ? $.mobile.defaultDialogTransition : $.mobile.defaultPageTransition );

      //add page to history stack if it's not back or forward
      if ( !historyDir ) {
         // Overwrite the current entry if it's a leftover from a dialog
         if ( alreadyThere ) {
            urlHistory.activeIndex = Math.max( 0, urlHistory.activeIndex - 1 );
         }
         urlHistory.addNew( url, settings.transition, pageTitle, pageUrl, settings.role );
      }

      //set page title
      document.title = urlHistory.getActive().title;

      //set "toPage" as activePage
      $.mobile.activePage = toPage;

      // If we're navigating back in the URL history, set reverse accordingly.
      settings.reverse = settings.reverse || historyDir < 0;

      transitionPages( toPage, fromPage, settings.transition, settings.reverse )
         .done(function( name, reverse, $to, $from, alreadyFocused ) {
            removeActiveLinkClass();

            //if there's a duplicateCachedPage, remove it from the DOM now that it's hidden
            if ( settings.duplicateCachedPage ) {
               settings.duplicateCachedPage.remove();
            }

            // Send focus to the newly shown page. Moved from promise .done binding in transitionPages
            // itself to avoid ie bug that reports offsetWidth as > 0 (core check for visibility)
            // despite visibility: hidden addresses issue #2965
            // https://github.com/jquery/jquery-mobile/issues/2965
            if ( !alreadyFocused ) {
               $.mobile.focusPage( toPage );
            }

            releasePageTransitionLock();

            // Let listeners know we're all done changing the current page.
            mpc.trigger( "pagechange", triggerData );
         });
   };

   $.mobile.changePage.defaults = {
      transition: undefined,
      reverse: false,
      changeHash: true,
      fromHashChange: false,
      role: undefined, // By default we rely on the role defined by the @data-role attribute.
      duplicateCachedPage: undefined,
      pageContainer: undefined,
      showLoadMsg: true, //loading message shows by default when pages are being fetched during changePage
      dataUrl: undefined,
      fromPage: undefined,
      allowSamePageTransition: false
   };

/* Event Bindings - hashchange, submit, and click */
   function findClosestLink( ele )
   {
      while ( ele ) {
         // Look for the closest element with a nodeName of "a".
         // Note that we are checking if we have a valid nodeName
         // before attempting to access it. This is because the
         // node we get called with could have originated from within
         // an embedded SVG document where some symbol instance elements
         // don't have nodeName defined on them, or strings are of type
         // SVGAnimatedString.
         if ( ( typeof ele.nodeName === "string" ) && ele.nodeName.toLowerCase() === "a" ) {
            break;
         }
         ele = ele.parentNode;
      }
      return ele;
   }

   // The base URL for any given element depends on the page it resides in.
   function getClosestBaseUrl( ele )
   {
      // Find the closest page and extract out its url.
      var url = $( ele ).closest( ".ui-page" ).jqmData( "url" ),
         base = documentBase.hrefNoHash;

      if ( !url || !path.isPath( url ) ) {
         url = base;
      }

      return path.makeUrlAbsolute( url, base);
   }

   //The following event bindings should be bound after mobileinit has been triggered
   //the following deferred is resolved in the init file
   $.mobile.navreadyDeferred = $.Deferred();
   $.mobile.navreadyDeferred.done(function() {
      //bind to form submit events, handle with Ajax
      $( document ).delegate( "form", "submit", function( event ) {
         var $this = $( this );

         if ( !$.mobile.ajaxEnabled ||
               // test that the form is, itself, ajax false
               $this.is( ":jqmData(ajax='false')" ) ||
               // test that $.mobile.ignoreContentEnabled is set and
               // the form or one of it's parents is ajax=false
               !$this.jqmHijackable().length ) {
            return;
         }

         var type = $this.attr( "method" ),
            target = $this.attr( "target" ),
            url = $this.attr( "action" );

         // If no action is specified, browsers default to using the
         // URL of the document containing the form. Since we dynamically
         // pull in pages from external documents, the form should submit
         // to the URL for the source document of the page containing
         // the form.
         if ( !url ) {
            // Get the @data-url for the page containing the form.
            url = getClosestBaseUrl( $this );
            if ( url === documentBase.hrefNoHash ) {
               // The url we got back matches the document base,
               // which means the page must be an internal/embedded page,
               // so default to using the actual document url as a browser
               // would.
               url = documentUrl.hrefNoSearch;
            }
         }

         url = path.makeUrlAbsolute(  url, getClosestBaseUrl( $this ) );

         if ( ( path.isExternal( url ) && !path.isPermittedCrossDomainRequest( documentUrl, url ) ) || target ) {
            return;
         }

         $.mobile.changePage(
            url,
            {
               type:    type && type.length && type.toLowerCase() || "get",
               data:    $this.serialize(),
               transition: $this.jqmData( "transition" ),
               reverse: $this.jqmData( "direction" ) === "reverse",
               reloadPage: true
            }
         );
         event.preventDefault();
      });

      //add active state on vclick
      $( document ).bind( "vclick", function( event ) {
         // if this isn't a left click we don't care. Its important to note
         // that when the virtual event is generated it will create the which attr
         if ( event.which > 1 || !$.mobile.linkBindingEnabled ) {
            return;
         }

         var link = findClosestLink( event.target );

         // split from the previous return logic to avoid find closest where possible
         // TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
         // can be avoided
         if ( !$( link ).jqmHijackable().length ) {
            return;
         }

         if ( link ) {
            if ( path.parseUrl( link.getAttribute( "href" ) || "#" ).hash !== "#" ) {
               removeActiveLinkClass( true );
               $activeClickedLink = $( link ).closest( ".ui-btn" ).not( ".ui-disabled" );
               $activeClickedLink.addClass( $.mobile.activeBtnClass );
            }
         }
      });

      // click routing - direct to HTTP or Ajax, accordingly
      $( document ).bind( "click", function( event ) {
         if ( !$.mobile.linkBindingEnabled ) {
            return;
         }

         var link = findClosestLink( event.target ), $link = $( link ), httpCleanup;

         // If there is no link associated with the click or its not a left
         // click we want to ignore the click
         // TODO teach $.mobile.hijackable to operate on raw dom elements so the link wrapping
         // can be avoided
         if ( !link || event.which > 1 || !$link.jqmHijackable().length ) {
            return;
         }

         //remove active link class if external (then it won't be there if you come back)
         httpCleanup = function() {
            window.setTimeout(function() { removeActiveLinkClass( true ); }, 200 );
         };

         //if there's a data-rel=back attr, go back in history
         if ( $link.is( ":jqmData(rel='back')" ) ) {
            $.mobile.back();
            return false;
         }

         var baseUrl = getClosestBaseUrl( $link ),

            //get href, if defined, otherwise default to empty hash
            href = path.makeUrlAbsolute( $link.attr( "href" ) || "#", baseUrl );

         //if ajax is disabled, exit early
         if ( !$.mobile.ajaxEnabled && !path.isEmbeddedPage( href ) ) {
            httpCleanup();
            //use default click handling
            return;
         }

         // XXX_jblas: Ideally links to application pages should be specified as
         //            an url to the application document with a hash that is either
         //            the site relative path or id to the page. But some of the
         //            internal code that dynamically generates sub-pages for nested
         //            lists and select dialogs, just write a hash in the link they
         //            create. This means the actual URL path is based on whatever
         //            the current value of the base tag is at the time this code
         //            is called. For now we are just assuming that any url with a
         //            hash in it is an application page reference.
         if ( href.search( "#" ) !== -1 ) {
            href = href.replace( /[^#]*#/, "" );
            if ( !href ) {
               //link was an empty hash meant purely
               //for interaction, so we ignore it.
               event.preventDefault();
               return;
            } else if ( path.isPath( href ) ) {
               //we have apath so make it the href we want to load.
               href = path.makeUrlAbsolute( href, baseUrl );
            } else {
               //we have a simple id so use the documentUrl as its base.
               href = path.makeUrlAbsolute( "#" + href, documentUrl.hrefNoHash );
            }
         }

            // Should we handle this link, or let the browser deal with it?
         var useDefaultUrlHandling = $link.is( "[rel='external']" ) || $link.is( ":jqmData(ajax='false')" ) || $link.is( "[target]" ),

            // Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
            // requests if the document doing the request was loaded via the file:// protocol.
            // This is usually to allow the application to "phone home" and fetch app specific
            // data. We normally let the browser handle external/cross-domain urls, but if the
            // allowCrossDomainPages option is true, we will allow cross-domain http/https
            // requests to go through our page loading logic.

            //check for protocol or rel and its not an embedded page
            //TODO overlap in logic from isExternal, rel=external check should be
            //     moved into more comprehensive isExternalLink
            isExternal = useDefaultUrlHandling || ( path.isExternal( href ) && !path.isPermittedCrossDomainRequest( documentUrl, href ) );

         if ( isExternal ) {
            httpCleanup();
            //use default click handling
            return;
         }

         //use ajax
         var transition = $link.jqmData( "transition" ),
            reverse = $link.jqmData( "direction" ) === "reverse" ||
                     // deprecated - remove by 1.0
                     $link.jqmData( "back" ),

            //this may need to be more specific as we use data-rel more
            role = $link.attr( "data-" + $.mobile.ns + "rel" ) || undefined;

         $.mobile.changePage( href, { transition: transition, reverse: reverse, role: role, link: $link } );
         event.preventDefault();
      });

      //prefetch pages when anchors with data-prefetch are encountered
      $( document ).delegate( ".ui-page", "pageshow.prefetch", function() {
         var urls = [];
         $( this ).find( "a:jqmData(prefetch)" ).each(function() {
            var $link = $( this ),
               url = $link.attr( "href" );

            if ( url && $.inArray( url, urls ) === -1 ) {
               urls.push( url );

               $.mobile.loadPage( url, { role: $link.attr( "data-" + $.mobile.ns + "rel" ) } );
            }
         });
      });

      $.mobile._handleHashChange = function( hash ) {
         //find first page via hash
         var to = path.stripHash( hash ),
            //transition is false if it's the first page, undefined otherwise (and may be overridden by default)
            transition = $.mobile.urlHistory.stack.length === 0 ? "none" : undefined,

            // "navigate" event fired to allow others to take advantage of the more robust hashchange handling
            navEvent = new $.Event( "navigate" ),

            // default options for the changPage calls made after examining the current state
            // of the page and the hash
            changePageOptions = {
               transition: transition,
               changeHash: false,
               fromHashChange: true
            };

         if ( 0 === urlHistory.stack.length ) {
            urlHistory.initialDst = to;
         }

         // We should probably fire the "navigate" event from those places that make calls to _handleHashChange,
         // and have _handleHashChange hook into the "navigate" event instead of triggering it here
         $.mobile.pageContainer.trigger( navEvent );
         if ( navEvent.isDefaultPrevented() ) {
            return;
         }

         //if listening is disabled (either globally or temporarily), or it's a dialog hash
         if ( !$.mobile.hashListeningEnabled || urlHistory.ignoreNextHashChange ) {
            urlHistory.ignoreNextHashChange = false;
            return;
         }

         // special case for dialogs
         if ( urlHistory.stack.length > 1 && to.indexOf( dialogHashKey ) > -1 && urlHistory.initialDst !== to ) {

            // If current active page is not a dialog skip the dialog and continue
            // in the same direction
            if ( !$.mobile.activePage.is( ".ui-dialog" ) ) {
               //determine if we're heading forward or backward and continue accordingly past
               //the current dialog
               urlHistory.directHashChange({
                  currentUrl: to,
                  isBack: function() { $.mobile.back(); },
                  isForward: function() { window.history.forward(); }
               });

               // prevent changePage()
               return;
            } else {
               // if the current active page is a dialog and we're navigating
               // to a dialog use the dialog objected saved in the stack
               urlHistory.directHashChange({
                  currentUrl: to,

                  // regardless of the direction of the history change
                  // do the following
                  either: function( isBack ) {
                     var active = $.mobile.urlHistory.getActive();

                     to = active.pageUrl;

                     // make sure to set the role, transition and reversal
                     // as most of this is lost by the domCache cleaning
                     $.extend( changePageOptions, {
                        role: active.role,
                        transition: active.transition,
                        reverse: isBack
                     });
                  }
               });
            }
         }

         //if to is defined, load it
         if ( to ) {
            // At this point, 'to' can be one of 3 things, a cached page element from
            // a history stack entry, an id, or site-relative/absolute URL. If 'to' is
            // an id, we need to resolve it against the documentBase, not the location.href,
            // since the hashchange could've been the result of a forward/backward navigation
            // that crosses from an external page/dialog to an internal page/dialog.
            to = ( typeof to === "string" && !path.isPath( to ) ) ? ( path.makeUrlAbsolute( '#' + to, documentBase ) ) : to;

            // If we're about to go to an initial URL that contains a reference to a non-existent
            // internal page, go to the first page instead. We know that the initial hash refers to a
            // non-existent page, because the initial hash did not end up in the initial urlHistory entry
            if ( to === path.makeUrlAbsolute( '#' + urlHistory.initialDst, documentBase ) &&
               urlHistory.stack.length && urlHistory.stack[0].url !== urlHistory.initialDst.replace( dialogHashKey, "" ) ) {
               to = $.mobile.firstPage;
            }
            $.mobile.changePage( to, changePageOptions );
         }  else {
            //there's no hash, go to the first page in the dom
            $.mobile.changePage( $.mobile.firstPage, changePageOptions );
         }
      };

      //hashchange event handler
      $window.bind( "hashchange", function( e, triggered ) {
         // Firefox auto-escapes the location.hash as for v13 but
         // leaves the href untouched
         $.mobile._handleHashChange( path.parseLocation().hash );
      });

      //set page min-heights to be device specific
      $( document ).bind( "pageshow", resetActivePageHeight );
      $( window ).bind( "throttledresize", resetActivePageHeight );

   });//navreadyDeferred done callback

})( jQuery );

(function( $, window ) {
   // For now, let's Monkeypatch this onto the end of $.mobile._registerInternalEvents
   // Scope self to pushStateHandler so we can reference it sanely within the
   // methods handed off as event handlers
   var   pushStateHandler = {},
      self = pushStateHandler,
      $win = $( window ),
      url = $.mobile.path.parseLocation(),
      mobileinitDeferred = $.Deferred(),
      domreadyDeferred = $.Deferred();

   $( document ).ready( $.proxy( domreadyDeferred, "resolve" ) );

   $( document ).one( "mobileinit", $.proxy( mobileinitDeferred, "resolve" ) );

   $.extend( pushStateHandler, {
      // TODO move to a path helper, this is rather common functionality
      initialFilePath: (function() {
         return url.pathname + url.search;
      })(),

      hashChangeTimeout: 200,

      hashChangeEnableTimer: undefined,

      initialHref: url.hrefNoHash,

      state: function() {
         return {
            // firefox auto decodes the url when using location.hash but not href
            hash: $.mobile.path.parseLocation().hash || "#" + self.initialFilePath,
            title: document.title,

            // persist across refresh
            initialHref: self.initialHref
         };
      },

      resetUIKeys: function( url ) {
         var dialog = $.mobile.dialogHashKey,
            subkey = "&" + $.mobile.subPageUrlKey,
            dialogIndex = url.indexOf( dialog );

         if ( dialogIndex > -1 ) {
            url = url.slice( 0, dialogIndex ) + "#" + url.slice( dialogIndex );
         } else if ( url.indexOf( subkey ) > -1 ) {
            url = url.split( subkey ).join( "#" + subkey );
         }

         return url;
      },

      // TODO sort out a single barrier to hashchange functionality
      nextHashChangePrevented: function( value ) {
         $.mobile.urlHistory.ignoreNextHashChange = value;
         self.onHashChangeDisabled = value;
      },

      // on hash change we want to clean up the url
      // NOTE this takes place *after* the vanilla navigation hash change
      // handling has taken place and set the state of the DOM
      onHashChange: function( e ) {
         // disable this hash change
         if ( self.onHashChangeDisabled ) {
            return;
         }

         var href, state,
            // firefox auto decodes the url when using location.hash but not href
            hash = $.mobile.path.parseLocation().hash,
            isPath = $.mobile.path.isPath( hash ),
            resolutionUrl = isPath ? $.mobile.path.getLocation() : $.mobile.getDocumentUrl();

         hash = isPath ? hash.replace( "#", "" ) : hash;


         // propulate the hash when its not available
         state = self.state();

         // make the hash abolute with the current href
         href = $.mobile.path.makeUrlAbsolute( hash, resolutionUrl );

         if ( isPath ) {
            href = self.resetUIKeys( href );
         }

         // replace the current url with the new href and store the state
         // Note that in some cases we might be replacing an url with the
         // same url. We do this anyways because we need to make sure that
         // all of our history entries have a state object associated with
         // them. This allows us to work around the case where $.mobile.back()
         // is called to transition from an external page to an embedded page.
         // In that particular case, a hashchange event is *NOT* generated by the browser.
         // Ensuring each history entry has a state object means that onPopState()
         // will always trigger our hashchange callback even when a hashchange event
         // is not fired.
         history.replaceState( state, document.title, href );
      },

      // on popstate (ie back or forward) we need to replace the hash that was there previously
      // cleaned up by the additional hash handling
      onPopState: function( e ) {
         var poppedState = e.originalEvent.state,
            fromHash, toHash, hashChanged;

         // if there's no state its not a popstate we care about, eg chrome's initial popstate
         if ( poppedState ) {
            // if we get two pop states in under this.hashChangeTimeout
            // make sure to clear any timer set for the previous change
            clearTimeout( self.hashChangeEnableTimer );

            // make sure to enable hash handling for the the _handleHashChange call
            self.nextHashChangePrevented( false );

            // change the page based on the hash in the popped state
            $.mobile._handleHashChange( poppedState.hash );

            // prevent any hashchange in the next self.hashChangeTimeout
            self.nextHashChangePrevented( true );

            // re-enable hash change handling after swallowing a possible hash
            // change event that comes on all popstates courtesy of browsers like Android
            self.hashChangeEnableTimer = setTimeout( function() {
               self.nextHashChangePrevented( false );
            }, self.hashChangeTimeout );
         }
      },

      init: function() {
         $win.bind( "hashchange", self.onHashChange );

         // Handle popstate events the occur through history changes
         $win.bind( "popstate", self.onPopState );

         // if there's no hash, we need to replacestate for returning to home
         if ( location.hash === "" ) {
            history.replaceState( self.state(), document.title, $.mobile.path.getLocation() );
         }
      }
   });

   // We need to init when "mobileinit", "domready", and "navready" have all happened
   $.when( domreadyDeferred, mobileinitDeferred, $.mobile.navreadyDeferred ).done(function() {
      if ( $.mobile.pushStateEnabled && $.support.pushState ) {
         pushStateHandler.init();
      }
   });
})( jQuery, this );

/*
* fallback transition for flip in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.flip = "fade";

})( jQuery, this );
/*
* fallback transition for flow in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.flow = "fade";

})( jQuery, this );
/*
* fallback transition for pop in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.pop = "fade";

})( jQuery, this );
/*
* fallback transition for slide in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

// Use the simultaneous transitions handler for slide transitions
$.mobile.transitionHandlers.slide = $.mobile.transitionHandlers.simultaneous;

// Set the slide transitions's fallback to "fade"
$.mobile.transitionFallbacks.slide = "fade";

})( jQuery, this );
/*
* fallback transition for slidedown in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.slidedown = "fade";

})( jQuery, this );
/*
* fallback transition for slidefade in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

// Set the slide transitions's fallback to "fade"
$.mobile.transitionFallbacks.slidefade = "fade";

})( jQuery, this );
/*
* fallback transition for slideup in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.slideup = "fade";

})( jQuery, this );
/*
* fallback transition for turn in non-3D supporting browsers (which tend to handle complex transitions poorly in general
*/

(function( $, window, undefined ) {

$.mobile.transitionFallbacks.turn = "fade";

})( jQuery, this );

(function( $, undefined ) {

$.mobile.page.prototype.options.degradeInputs = {
   color: false,
   date: false,
   datetime: false,
   "datetime-local": false,
   email: false,
   month: false,
   number: false,
   range: "number",
   search: "text",
   tel: false,
   time: false,
   url: false,
   week: false
};


//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {

   var page = $.mobile.closestPageData( $( e.target ) ), options;

   if ( !page ) {
      return;
   }

   options = page.options;

   // degrade inputs to avoid poorly implemented native functionality
   $( e.target ).find( "input" ).not( page.keepNativeSelector() ).each(function() {
      var $this = $( this ),
         type = this.getAttribute( "type" ),
         optType = options.degradeInputs[ type ] || "text";

      if ( options.degradeInputs[ type ] ) {
         var html = $( "<div>" ).html( $this.clone() ).html(),
            // In IE browsers, the type sometimes doesn't exist in the cloned markup, so we replace the closing tag instead
            hasType = html.indexOf( " type=" ) > -1,
            findstr = hasType ? /\s+type=["']?\w+['"]?/ : /\/?>/,
            repstr = " type=\"" + optType + "\" data-" + $.mobile.ns + "type=\"" + type + "\"" + ( hasType ? "" : ">" );

         $this.replaceWith( html.replace( findstr, repstr ) );
      }
   });

});

})( jQuery );

(function( $, window, undefined ) {

$.widget( "mobile.dialog", $.mobile.widget, {
   options: {
      closeBtnText: "Close",
      overlayTheme: "a",
      initSelector: ":jqmData(role='dialog')"
   },
   _create: function() {
      var self = this,
         $el = this.element,
         headerCloseButton = $( "<a href='#' data-" + $.mobile.ns + "icon='delete' data-" + $.mobile.ns + "iconpos='notext'>"+ this.options.closeBtnText + "</a>" ),
         dialogWrap = $( "<div/>", {
               "role" : "dialog",
               "class" : "ui-dialog-contain ui-corner-all ui-overlay-shadow"
            });

      $el.addClass( "ui-dialog ui-overlay-" + this.options.overlayTheme );

      // Class the markup for dialog styling
      // Set aria role
      $el
         .wrapInner( dialogWrap )
         .children()
            .find( ":jqmData(role='header')" )
               .prepend( headerCloseButton )
            .end()
            .children( ':first-child')
               .addClass( "ui-corner-top" )
            .end()
            .children( ":last-child" )
               .addClass( "ui-corner-bottom" );

      // this must be an anonymous function so that select menu dialogs can replace
      // the close method. This is a change from previously just defining data-rel=back
      // on the button and letting nav handle it
      //
      // Use click rather than vclick in order to prevent the possibility of unintentionally
      // reopening the dialog if the dialog opening item was directly under the close button.
      headerCloseButton.bind( "click", function() {
         self.close();
      });

      /* bind events
         - clicks and submits should use the closing transition that the dialog opened with
            unless a data-transition is specified on the link/form
         - if the click was on the close button, or the link has a data-rel="back" it'll go back in history naturally
      */
      $el.bind( "vclick submit", function( event ) {
         var $target = $( event.target ).closest( event.type === "vclick" ? "a" : "form" ),
            active;

         if ( $target.length && !$target.jqmData( "transition" ) ) {

            active = $.mobile.urlHistory.getActive() || {};

            $target.attr( "data-" + $.mobile.ns + "transition", ( active.transition || $.mobile.defaultDialogTransition ) )
               .attr( "data-" + $.mobile.ns + "direction", "reverse" );
         }
      })
      .bind( "pagehide", function( e, ui ) {
         $( this ).find( "." + $.mobile.activeBtnClass ).not( ".ui-slider-bg" ).removeClass( $.mobile.activeBtnClass );
      })
      // Override the theme set by the page plugin on pageshow
      .bind( "pagebeforeshow", function() {
         self._isCloseable = true;
         if ( self.options.overlayTheme ) {
            self.element
               .page( "removeContainerBackground" )
               .page( "setContainerBackground", self.options.overlayTheme );
         }
      });
   },

   // Close method goes back in history
   close: function() {
      var dst;

      if ( this._isCloseable ) {
         this._isCloseable = false;
         if ( $.mobile.hashListeningEnabled ) {
            $.mobile.back();
         } else {
            dst = $.mobile.urlHistory.getPrev().url;
            if ( !$.mobile.path.isPath( dst ) ) {
               dst = $.mobile.path.makeUrlAbsolute( "#" + dst );
            }

            $.mobile.changePage( dst, { changeHash: false, fromHashChange: true } );
         }
      }
   }
});

//auto self-init widgets
$( document ).delegate( $.mobile.dialog.prototype.options.initSelector, "pagecreate", function() {
   $.mobile.dialog.prototype.enhance( this );
});

})( jQuery, this );

(function( $, undefined ) {

$.mobile.page.prototype.options.backBtnText  = "Back";
$.mobile.page.prototype.options.addBackBtn   = false;
$.mobile.page.prototype.options.backBtnTheme = null;
$.mobile.page.prototype.options.headerTheme  = "a";
$.mobile.page.prototype.options.footerTheme  = "a";
$.mobile.page.prototype.options.contentTheme = null;

// NOTE bind used to force this binding to run before the buttonMarkup binding
//      which expects .ui-footer top be applied in its gigantic selector
// TODO remove the buttonMarkup giant selector and move it to the various modules
//      on which it depends
$( document ).bind( "pagecreate", function( e ) {
   var $page = $( e.target ),
      o = $page.data( "page" ).options,
      pageRole = $page.jqmData( "role" ),
      pageTheme = o.theme;

   $( ":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')", $page )
      .jqmEnhanceable()
      .each(function() {

      var $this = $( this ),
         role = $this.jqmData( "role" ),
         theme = $this.jqmData( "theme" ),
         contentTheme = theme || o.contentTheme || ( pageRole === "dialog" && pageTheme ),
         $headeranchors,
         leftbtn,
         rightbtn,
         backBtn;

      $this.addClass( "ui-" + role );

      //apply theming and markup modifications to page,header,content,footer
      if ( role === "header" || role === "footer" ) {

         var thisTheme = theme || ( role === "header" ? o.headerTheme : o.footerTheme ) || pageTheme;

         $this
            //add theme class
            .addClass( "ui-bar-" + thisTheme )
            // Add ARIA role
            .attr( "role", role === "header" ? "banner" : "contentinfo" );

         if ( role === "header") {
            // Right,left buttons
            $headeranchors = $this.children( "a, button" );
            leftbtn  = $headeranchors.hasClass( "ui-btn-left" );
            rightbtn = $headeranchors.hasClass( "ui-btn-right" );

            leftbtn = leftbtn || $headeranchors.eq( 0 ).not( ".ui-btn-right" ).addClass( "ui-btn-left" ).length;

            rightbtn = rightbtn || $headeranchors.eq( 1 ).addClass( "ui-btn-right" ).length;
         }

         // Auto-add back btn on pages beyond first view
         if ( o.addBackBtn &&
            role === "header" &&
            $( ".ui-page" ).length > 1 &&
            $page.jqmData( "url" ) !== $.mobile.path.stripHash( location.hash ) &&
            !leftbtn ) {

            backBtn = $( "<a href='javascript:void(0);' class='ui-btn-left' data-"+ $.mobile.ns +"rel='back' data-"+ $.mobile.ns +"icon='arrow-l'>"+ o.backBtnText +"</a>" )
               // If theme is provided, override default inheritance
               .attr( "data-"+ $.mobile.ns +"theme", o.backBtnTheme || thisTheme )
               .prependTo( $this );
         }

         // Page title
         $this.children( "h1, h2, h3, h4, h5, h6" )
            .addClass( "ui-title" )
            // Regardless of h element number in src, it becomes h1 for the enhanced page
            .attr({
               "role": "heading",
               "aria-level": "1"
            });

      } else if ( role === "content" ) {
         if ( contentTheme ) {
            $this.addClass( "ui-body-" + ( contentTheme ) );
         }

         // Add ARIA role
         $this.attr( "role", "main" );
      }
   });
});

})( jQuery );

(function( $, undefined ) {

// filter function removes whitespace between label and form element so we can use inline-block (nodeType 3 = text)
$.fn.fieldcontain = function( options ) {
   return this
      .addClass( "ui-field-contain ui-body ui-br" )
      .contents().filter( function() {
         return ( this.nodeType === 3 && !/\S/.test( this.nodeValue ) );
      }).remove();
};

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $( ":jqmData(role='fieldcontain')", e.target ).jqmEnhanceable().fieldcontain();
});

})( jQuery );

(function( $, undefined ) {

$.fn.grid = function( options ) {
   return this.each(function() {

      var $this = $( this ),
         o = $.extend({
            grid: null
         }, options ),
         $kids = $this.children(),
         gridCols = { solo:1, a:2, b:3, c:4, d:5 },
         grid = o.grid,
         iterator;

         if ( !grid ) {
            if ( $kids.length <= 5 ) {
               for ( var letter in gridCols ) {
                  if ( gridCols[ letter ] === $kids.length ) {
                     grid = letter;
                  }
               }
            } else {
               grid = "a";
               $this.addClass( "ui-grid-duo" );
            }
         }
         iterator = gridCols[grid];

      $this.addClass( "ui-grid-" + grid );

      $kids.filter( ":nth-child(" + iterator + "n+1)" ).addClass( "ui-block-a" );

      if ( iterator > 1 ) {
         $kids.filter( ":nth-child(" + iterator + "n+2)" ).addClass( "ui-block-b" );
      }
      if ( iterator > 2 ) {
         $kids.filter( ":nth-child(" + iterator + "n+3)" ).addClass( "ui-block-c" );
      }
      if ( iterator > 3 ) {
         $kids.filter( ":nth-child(" + iterator + "n+4)" ).addClass( "ui-block-d" );
      }
      if ( iterator > 4 ) {
         $kids.filter( ":nth-child(" + iterator + "n+5)" ).addClass( "ui-block-e" );
      }
   });
};
})( jQuery );

(function( $, undefined ) {

$( document ).bind( "pagecreate create", function( e ) {
   $( ":jqmData(role='nojs')", e.target ).addClass( "ui-nojs" );
   
});

})( jQuery );

(function( $, undefined ) {

$.fn.buttonMarkup = function( options ) {
   var $workingSet = this,
      mapToDataAttr = function( key, value ) {
         e.setAttribute( "data-" + $.mobile.ns + key, value );
         el.jqmData( key, value );
      };

   // Enforce options to be of type string
   options = ( options && ( $.type( options ) === "object" ) )? options : {};
   for ( var i = 0; i < $workingSet.length; i++ ) {
      var el = $workingSet.eq( i ),
         e = el[ 0 ],
         o = $.extend( {}, $.fn.buttonMarkup.defaults, {
            icon:       options.icon       !== undefined ? options.icon       : el.jqmData( "icon" ),
            iconpos:    options.iconpos    !== undefined ? options.iconpos    : el.jqmData( "iconpos" ),
            theme:      options.theme      !== undefined ? options.theme      : el.jqmData( "theme" ) || $.mobile.getInheritedTheme( el, "c" ),
            inline:     options.inline     !== undefined ? options.inline     : el.jqmData( "inline" ),
            shadow:     options.shadow     !== undefined ? options.shadow     : el.jqmData( "shadow" ),
            corners:    options.corners    !== undefined ? options.corners    : el.jqmData( "corners" ),
            iconshadow: options.iconshadow !== undefined ? options.iconshadow : el.jqmData( "iconshadow" ),
            mini:       options.mini       !== undefined ? options.mini       : el.jqmData( "mini" )
         }, options ),

         // Classes Defined
         innerClass = "ui-btn-inner",
         textClass = "ui-btn-text",
         buttonClass, iconClass,
         // Button inner markup
         buttonInner,
         buttonText,
         buttonIcon,
         buttonElements;

      $.each( o, mapToDataAttr );

      if ( el.jqmData( "rel" ) === "popup" && el.attr( "href" ) ) {
         e.setAttribute( "aria-haspopup", true );
         e.setAttribute( "aria-owns", e.getAttribute( "href" ) );
      }

      // Check if this element is already enhanced
      buttonElements = $.data( ( ( e.tagName === "INPUT" || e.tagName === "BUTTON" ) ? e.parentNode : e ), "buttonElements" );

      if ( buttonElements ) {
         e = buttonElements.outer;
         el = $( e );
         buttonInner = buttonElements.inner;
         buttonText = buttonElements.text;
         // We will recreate this icon below
         $( buttonElements.icon ).remove();
         buttonElements.icon = null;
      }
      else {
         buttonInner = document.createElement( o.wrapperEls );
         buttonText = document.createElement( o.wrapperEls );
      }
      buttonIcon = o.icon ? document.createElement( "span" ) : null;

      if ( attachEvents && !buttonElements ) {
         attachEvents();
      }

      // if not, try to find closest theme container
      if ( !o.theme ) {
         o.theme = $.mobile.getInheritedTheme( el, "c" );
      }

      buttonClass = "ui-btn ui-btn-up-" + o.theme;
      buttonClass += o.shadow ? " ui-shadow" : "";
      buttonClass += o.corners ? " ui-btn-corner-all" : "";

      if ( o.mini !== undefined ) {
         // Used to control styling in headers/footers, where buttons default to `mini` style.
         buttonClass += o.mini === true ? " ui-mini" : " ui-fullsize";
      }

      if ( o.inline !== undefined ) {
         // Used to control styling in headers/footers, where buttons default to `inline` style.
         buttonClass += o.inline === true ? " ui-btn-inline" : " ui-btn-block";
      }

      if ( o.icon ) {
         o.icon = "ui-icon-" + o.icon;
         o.iconpos = o.iconpos || "left";

         iconClass = "ui-icon " + o.icon;

         if ( o.iconshadow ) {
            iconClass += " ui-icon-shadow";
         }
      }

      if ( o.iconpos ) {
         buttonClass += " ui-btn-icon-" + o.iconpos;

         if ( o.iconpos === "notext" && !el.attr( "title" ) ) {
            el.attr( "title", el.getEncodedText() );
         }
      }

      innerClass += o.corners ? " ui-btn-corner-all" : "";

      if ( o.iconpos && o.iconpos === "notext" && !el.attr( "title" ) ) {
         el.attr( "title", el.getEncodedText() );
      }

      if ( buttonElements ) {
         el.removeClass( buttonElements.bcls || "" );
      }
      el.removeClass( "ui-link" ).addClass( buttonClass );

      buttonInner.className = innerClass;

      buttonText.className = textClass;
      if ( !buttonElements ) {
         buttonInner.appendChild( buttonText );
      }
      if ( buttonIcon ) {
         buttonIcon.className = iconClass;
         if ( !( buttonElements && buttonElements.icon ) ) {
            buttonIcon.innerHTML = "&#160;";
            buttonInner.appendChild( buttonIcon );
         }
      }

      while ( e.firstChild && !buttonElements ) {
         buttonText.appendChild( e.firstChild );
      }

      if ( !buttonElements ) {
         e.appendChild( buttonInner );
      }

      // Assign a structure containing the elements of this button to the elements of this button. This
      // will allow us to recognize this as an already-enhanced button in future calls to buttonMarkup().
      buttonElements = {
         bcls  : buttonClass,
         outer : e,
         inner : buttonInner,
         text  : buttonText,
         icon  : buttonIcon
      };

      $.data( e,           'buttonElements', buttonElements );
      $.data( buttonInner, 'buttonElements', buttonElements );
      $.data( buttonText,  'buttonElements', buttonElements );
      if ( buttonIcon ) {
         $.data( buttonIcon, 'buttonElements', buttonElements );
      }
   }

   return this;
};

$.fn.buttonMarkup.defaults = {
   corners: true,
   shadow: true,
   iconshadow: true,
   wrapperEls: "span"
};

function closestEnabledButton( element ) {
    var cname;

    while ( element ) {
      // Note that we check for typeof className below because the element we
      // handed could be in an SVG DOM where className on SVG elements is defined to
      // be of a different type (SVGAnimatedString). We only operate on HTML DOM
      // elements, so we look for plain "string".
        cname = ( typeof element.className === 'string' ) && ( element.className + ' ' );
        if ( cname && cname.indexOf( "ui-btn " ) > -1 && cname.indexOf( "ui-disabled " ) < 0 ) {
            break;
        }

        element = element.parentNode;
    }

    return element;
}

var attachEvents = function() {
   var hoverDelay = $.mobile.buttonMarkup.hoverDelay, hov, foc;

   $( document ).bind( {
      "vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart": function( event ) {
         var theme,
            $btn = $( closestEnabledButton( event.target ) ),
            isTouchEvent = event.originalEvent && /^touch/.test( event.originalEvent.type ),
            evt = event.type;

         if ( $btn.length ) {
            theme = $btn.attr( "data-" + $.mobile.ns + "theme" );

            if ( evt === "vmousedown" ) {
               if ( isTouchEvent ) {
                  // Use a short delay to determine if the user is scrolling before highlighting
                  hov = setTimeout( function() {
                     $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
                  }, hoverDelay );
               } else {
                  $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
               }
            } else if ( evt === "vmousecancel" || evt === "vmouseup" ) {
               $btn.removeClass( "ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
            } else if ( evt === "vmouseover" || evt === "focus" ) {
               if ( isTouchEvent ) {
                  // Use a short delay to determine if the user is scrolling before highlighting
                  foc = setTimeout( function() {
                     $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
                  }, hoverDelay );
               } else {
                  $btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
               }
            } else if ( evt === "vmouseout" || evt === "blur" || evt === "scrollstart" ) {
               $btn.removeClass( "ui-btn-hover-" + theme  + " ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
               if ( hov ) {
                  clearTimeout( hov );
               }
               if ( foc ) {
                  clearTimeout( foc );
               }
            }
         }
      },
      "focusin focus": function( event ) {
         $( closestEnabledButton( event.target ) ).addClass( $.mobile.focusClass );
      },
      "focusout blur": function( event ) {
         $( closestEnabledButton( event.target ) ).removeClass( $.mobile.focusClass );
      }
   });

   attachEvents = null;
};

//links in bars, or those with  data-role become buttons
//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {

   $( ":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a", e.target )
      .jqmEnhanceable()
      .not( "button, input, .ui-btn, :jqmData(role='none'), :jqmData(role='nojs')" )
      .buttonMarkup();
});

})( jQuery );


(function( $, undefined ) {

$.widget( "mobile.collapsible", $.mobile.widget, {
   options: {
      expandCueText: " click to expand contents",
      collapseCueText: " click to collapse contents",
      collapsed: true,
      heading: "h1,h2,h3,h4,h5,h6,legend",
      theme: null,
      contentTheme: null,
      inset: true,
      mini: false,
      initSelector: ":jqmData(role='collapsible')"
   },
   _create: function() {

      var $el = this.element,
         o = this.options,
         collapsible = $el.addClass( "ui-collapsible" ),
         collapsibleHeading = $el.children( o.heading ).first(),
         collapsedIcon = $el.jqmData( "collapsed-icon" ) || o.collapsedIcon,
         expandedIcon = $el.jqmData( "expanded-icon" ) || o.expandedIcon,
         collapsibleContent = collapsible.wrapInner( "<div class='ui-collapsible-content'></div>" ).children( ".ui-collapsible-content" ),
         collapsibleSet = $el.closest( ":jqmData(role='collapsible-set')" ).addClass( "ui-collapsible-set" );

      // Replace collapsibleHeading if it's a legend
      if ( collapsibleHeading.is( "legend" ) ) {
         collapsibleHeading = $( "<div role='heading'>"+ collapsibleHeading.html() +"</div>" ).insertBefore( collapsibleHeading );
         collapsibleHeading.next().remove();
      }

      // If we are in a collapsible set
      if ( collapsibleSet.length ) {
         // Inherit the theme from collapsible-set
         if ( !o.theme ) {
            o.theme = collapsibleSet.jqmData( "theme" ) || $.mobile.getInheritedTheme( collapsibleSet, "c" );
         }
         // Inherit the content-theme from collapsible-set
         if ( !o.contentTheme ) {
            o.contentTheme = collapsibleSet.jqmData( "content-theme" );
         }

         // Get the preference for collapsed icon in the set
         if ( !o.collapsedIcon ) {
            o.collapsedIcon = collapsibleSet.jqmData( "collapsed-icon" );
         }
         // Get the preference for expanded icon in the set
         if ( !o.expandedIcon ) {
            o.expandedIcon = collapsibleSet.jqmData( "expanded-icon" );
         }
         // Gets the preference icon position in the set
         if ( !o.iconPos ) {
            o.iconPos = collapsibleSet.jqmData( "iconpos" );
         }
         // Inherit the preference for inset from collapsible-set or set the default value to ensure equalty within a set
         if ( collapsibleSet.jqmData( "inset" ) !== undefined ) {
            o.inset = collapsibleSet.jqmData( "inset" );
         } else {
            o.inset = true;
         }
         // Gets the preference for mini in the set
         if ( !o.mini ) {
            o.mini = collapsibleSet.jqmData( "mini" );
         }
      } else {
         // get inherited theme if not a set and no theme has been set
         if ( !o.theme ) {
            o.theme = $.mobile.getInheritedTheme( $el, "c" );
         }
      }
      
      if ( !!o.inset ) {
         collapsible.addClass( "ui-collapsible-inset" );
      }
      
      collapsibleContent.addClass( ( o.contentTheme ) ? ( "ui-body-" + o.contentTheme ) : "");

      collapsedIcon = $el.jqmData( "collapsed-icon" ) || o.collapsedIcon || "plus";
      expandedIcon = $el.jqmData( "expanded-icon" ) || o.expandedIcon || "minus";

      collapsibleHeading
         //drop heading in before content
         .insertBefore( collapsibleContent )
         //modify markup & attributes
         .addClass( "ui-collapsible-heading" )
         .append( "<span class='ui-collapsible-heading-status'></span>" )
         .wrapInner( "<a href='#' class='ui-collapsible-heading-toggle'></a>" )
         .find( "a" )
            .first()
            .buttonMarkup({
               shadow: false,
               corners: false,
               iconpos: $el.jqmData( "iconpos" ) || o.iconPos || "left",
               icon: collapsedIcon,
               mini: o.mini,
               theme: o.theme
            });

      if ( !!o.inset ) {            
         collapsibleHeading
            .find( "a" ).first().add( ".ui-btn-inner", $el )
               .addClass( "ui-corner-top ui-corner-bottom" );
      }

      //events
      collapsible
         .bind( "expand collapse", function( event ) {
            if ( !event.isDefaultPrevented() ) {
               var $this = $( this ),
                  isCollapse = ( event.type === "collapse" ),
                  contentTheme = o.contentTheme;

               event.preventDefault();

               collapsibleHeading
                  .toggleClass( "ui-collapsible-heading-collapsed", isCollapse )
                  .find( ".ui-collapsible-heading-status" )
                     .text( isCollapse ? o.expandCueText : o.collapseCueText )
                  .end()
                  .find( ".ui-icon" )
                     .toggleClass( "ui-icon-" + expandedIcon, !isCollapse )
                     // logic or cause same icon for expanded/collapsed state would remove the ui-icon-class
                     .toggleClass( "ui-icon-" + collapsedIcon, ( isCollapse || expandedIcon === collapsedIcon ) )
                  .end()
                  .find( "a" ).first().removeClass( $.mobile.activeBtnClass );

               $this.toggleClass( "ui-collapsible-collapsed", isCollapse );
               collapsibleContent.toggleClass( "ui-collapsible-content-collapsed", isCollapse ).attr( "aria-hidden", isCollapse );

               if ( contentTheme && !!o.inset && ( !collapsibleSet.length || collapsible.jqmData( "collapsible-last" ) ) ) {
                  collapsibleHeading
                     .find( "a" ).first().add( collapsibleHeading.find( ".ui-btn-inner" ) )
                     .toggleClass( "ui-corner-bottom", isCollapse );
                  collapsibleContent.toggleClass( "ui-corner-bottom", !isCollapse );
               }
               collapsibleContent.trigger( "updatelayout" );
            }
         })
         .trigger( o.collapsed ? "collapse" : "expand" );

      collapsibleHeading
         .bind( "tap", function( event ) {
            collapsibleHeading.find( "a" ).first().addClass( $.mobile.activeBtnClass );
         })
         .bind( "click", function( event ) {

            var type = collapsibleHeading.is( ".ui-collapsible-heading-collapsed" ) ? "expand" : "collapse";

            collapsible.trigger( type );

            event.preventDefault();
            event.stopPropagation();
         });
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.collapsible.prototype.enhanceWithin( e.target );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.collapsibleset", $.mobile.widget, {
   options: {
      initSelector: ":jqmData(role='collapsible-set')"
   },
   _create: function() {
      var $el = this.element.addClass( "ui-collapsible-set" ),
         o = this.options;

      // Inherit the theme from collapsible-set
      if ( !o.theme ) {
         o.theme = $.mobile.getInheritedTheme( $el, "c" );
      }
      // Inherit the content-theme from collapsible-set
      if ( !o.contentTheme ) {
         o.contentTheme = $el.jqmData( "content-theme" );
      }

      if ( $el.jqmData( "inset" ) !== undefined ) {
         o.inset = $el.jqmData( "inset" );
      }
      o.inset = o.inset !== undefined ? o.inset : true;

      // Initialize the collapsible set if it's not already initialized
      if ( !$el.jqmData( "collapsiblebound" ) ) {
         $el
            .jqmData( "collapsiblebound", true )
            .bind( "expand collapse", function( event ) {
               var isCollapse = ( event.type === "collapse" ),
                  collapsible = $( event.target ).closest( ".ui-collapsible" ),
                  widget = collapsible.data( "collapsible" );
               if ( collapsible.jqmData( "collapsible-last" ) && !!o.inset ) {
                  collapsible.find( ".ui-collapsible-heading" ).first()
                     .find( "a" ).first()
                     .toggleClass( "ui-corner-bottom", isCollapse )
                     .find( ".ui-btn-inner" )
                     .toggleClass( "ui-corner-bottom", isCollapse );
                  collapsible.find( ".ui-collapsible-content" ).toggleClass( "ui-corner-bottom", !isCollapse );
               }
            })
            .bind( "expand", function( event ) {
               var closestCollapsible = $( event.target )
                  .closest( ".ui-collapsible" );
               if ( closestCollapsible.parent().is( ":jqmData(role='collapsible-set')" ) ) {
                  closestCollapsible
                     .siblings( ".ui-collapsible" )
                     .trigger( "collapse" );
               }
            });
      }
   },

   _init: function() {
      var $el = this.element,
         collapsiblesInSet = $el.children( ":jqmData(role='collapsible')" ),
         expanded = collapsiblesInSet.filter( ":jqmData(collapsed='false')" );
      this.refresh();

      // Because the corners are handled by the collapsible itself and the default state is collapsed
      // That was causing https://github.com/jquery/jquery-mobile/issues/4116
      expanded.trigger( "expand" );
   },

   refresh: function() {
      var $el = this.element,
         o = this.options,
         collapsiblesInSet = $el.children( ":jqmData(role='collapsible')" );

      $.mobile.collapsible.prototype.enhance( collapsiblesInSet.not( ".ui-collapsible" ) );

      // clean up borders
      if ( !!o.inset ) {
         collapsiblesInSet.each(function() {
            $( this ).jqmRemoveData( "collapsible-last" )
               .find( ".ui-collapsible-heading" )
               .find( "a" ).first()
               .removeClass( "ui-corner-top ui-corner-bottom" )
               .find( ".ui-btn-inner" )
               .removeClass( "ui-corner-top ui-corner-bottom" );
         });

         collapsiblesInSet.first()
            .find( "a" )
               .first()
               .addClass( "ui-corner-top" )
               .find( ".ui-btn-inner" )
                  .addClass( "ui-corner-top" );
   
         collapsiblesInSet.last()
            .jqmData( "collapsible-last", true )
            .find( "a" )
               .first()
               .addClass( "ui-corner-bottom" )
               .find( ".ui-btn-inner" )
                  .addClass( "ui-corner-bottom" );
      }
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.collapsibleset.prototype.enhanceWithin( e.target );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.navbar", $.mobile.widget, {
   options: {
      iconpos: "top",
      grid: null,
      initSelector: ":jqmData(role='navbar')"
   },

   _create: function() {

      var $navbar = this.element,
         $navbtns = $navbar.find( "a" ),
         iconpos = $navbtns.filter( ":jqmData(icon)" ).length ?
                           this.options.iconpos : undefined;

      $navbar.addClass( "ui-navbar ui-mini" )
         .attr( "role", "navigation" )
         .find( "ul" )
         .jqmEnhanceable()
         .grid({ grid: this.options.grid });

      $navbtns.buttonMarkup({
         corners: false,
         shadow:     false,
         inline:     true,
         iconpos: iconpos
      });

      $navbar.delegate( "a", "vclick", function( event ) {
         if ( !$(event.target).hasClass( "ui-disabled" ) ) {
            $navbtns.removeClass( $.mobile.activeBtnClass );
            $( this ).addClass( $.mobile.activeBtnClass );
         }
      });

      // Buttons in the navbar with ui-state-persist class should regain their active state before page show
      $navbar.closest( ".ui-page" ).bind( "pagebeforeshow", function() {
         $navbtns.filter( ".ui-state-persist" ).addClass( $.mobile.activeBtnClass );
      });
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.navbar.prototype.enhanceWithin( e.target );
});

})( jQuery );

(function( $, undefined ) {

//Keeps track of the number of lists per page UID
//This allows support for multiple nested list in the same page
//https://github.com/jquery/jquery-mobile/issues/1617
var listCountPerPage = {};

$.widget( "mobile.listview", $.mobile.widget, {

   options: {
      theme: null,
      countTheme: "c",
      headerTheme: "b",
      dividerTheme: "b",
      splitIcon: "arrow-r",
      splitTheme: "b",
      inset: false,
      initSelector: ":jqmData(role='listview')"
   },

   _create: function() {
      var t = this,
         listviewClasses = "";

      listviewClasses += t.options.inset ? " ui-listview-inset ui-corner-all ui-shadow " : "";

      // create listview markup
      t.element.addClass(function( i, orig ) {
         return orig + " ui-listview " + listviewClasses;
      });

      t.refresh( true );
   },

   _removeCorners: function( li, which ) {
      var top = "ui-corner-top ui-corner-tr ui-corner-tl",
         bot = "ui-corner-bottom ui-corner-br ui-corner-bl";

      li = li.add( li.find( ".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb" ) );

      if ( which === "top" ) {
         li.removeClass( top );
      } else if ( which === "bottom" ) {
         li.removeClass( bot );
      } else {
         li.removeClass( top + " " + bot );
      }
   },

   _refreshCorners: function( create ) {
      var $li,
         $visibleli,
         $topli,
         $bottomli;

      $li = this.element.children( "li" );
      // At create time and when autodividers calls refresh the li are not visible yet so we need to rely on .ui-screen-hidden
      $visibleli = create || $li.filter( ":visible" ).length === 0 ? $li.not( ".ui-screen-hidden" ) : $li.filter( ":visible" );

      // ui-li-last is used for setting border-bottom on the last li    
      $li.filter( ".ui-li-last" ).removeClass( "ui-li-last" );
               
      if ( this.options.inset ) {
         this._removeCorners( $li );

         // Select the first visible li element
         $topli = $visibleli.first()
            .addClass( "ui-corner-top" );

         $topli.add( $topli.find( ".ui-btn-inner" )
            .not( ".ui-li-link-alt span:first-child" ) )
               .addClass( "ui-corner-top" )
            .end()
            .find( ".ui-li-link-alt, .ui-li-link-alt span:first-child" )
               .addClass( "ui-corner-tr" )
            .end()
            .find( ".ui-li-thumb" )
               .not( ".ui-li-icon" )
               .addClass( "ui-corner-tl" );

         // Select the last visible li element
         $bottomli = $visibleli.last()
            .addClass( "ui-corner-bottom ui-li-last" );

         $bottomli.add( $bottomli.find( ".ui-btn-inner" ) )
            .find( ".ui-li-link-alt" )
               .addClass( "ui-corner-br" )
            .end()
            .find( ".ui-li-thumb" )
               .not( ".ui-li-icon" )
               .addClass( "ui-corner-bl" );
      } else {
         $visibleli.last().addClass( "ui-li-last" );
      }
      if ( !create ) {
         this.element.trigger( "updatelayout" );
      }
   },

   // This is a generic utility method for finding the first
   // node with a given nodeName. It uses basic DOM traversal
   // to be fast and is meant to be a substitute for simple
   // $.fn.closest() and $.fn.children() calls on a single
   // element. Note that callers must pass both the lowerCase
   // and upperCase version of the nodeName they are looking for.
   // The main reason for this is that this function will be
   // called many times and we want to avoid having to lowercase
   // the nodeName from the element every time to ensure we have
   // a match. Note that this function lives here for now, but may
   // be moved into $.mobile if other components need a similar method.
   _findFirstElementByTagName: function( ele, nextProp, lcName, ucName ) {
      var dict = {};
      dict[ lcName ] = dict[ ucName ] = true;
      while ( ele ) {
         if ( dict[ ele.nodeName ] ) {
            return ele;
         }
         ele = ele[ nextProp ];
      }
      return null;
   },
   _getChildrenByTagName: function( ele, lcName, ucName ) {
      var results = [],
         dict = {};
      dict[ lcName ] = dict[ ucName ] = true;
      ele = ele.firstChild;
      while ( ele ) {
         if ( dict[ ele.nodeName ] ) {
            results.push( ele );
         }
         ele = ele.nextSibling;
      }
      return $( results );
   },

   _addThumbClasses: function( containers ) {
      var i, img, len = containers.length;
      for ( i = 0; i < len; i++ ) {
         img = $( this._findFirstElementByTagName( containers[ i ].firstChild, "nextSibling", "img", "IMG" ) );
         if ( img.length ) {
            img.addClass( "ui-li-thumb" );
            $( this._findFirstElementByTagName( img[ 0 ].parentNode, "parentNode", "li", "LI" ) ).addClass( img.is( ".ui-li-icon" ) ? "ui-li-has-icon" : "ui-li-has-thumb" );
         }
      }
   },

   refresh: function( create ) {
      this.parentPage = this.element.closest( ".ui-page" );
      this._createSubPages();

      var o = this.options,
         $list = this.element,
         self = this,
         dividertheme = $list.jqmData( "dividertheme" ) || o.dividerTheme,
         listsplittheme = $list.jqmData( "splittheme" ),
         listspliticon = $list.jqmData( "spliticon" ),
         li = this._getChildrenByTagName( $list[ 0 ], "li", "LI" ),
         ol = !!$.nodeName( $list[ 0 ], "ol" ),
         jsCount = !$.support.cssPseudoElement,
         start = $list.attr( "start" ),
         itemClassDict = {},
         item, itemClass, itemTheme,
         a, last, splittheme, counter, startCount, newStartCount, countParent, icon, imgParents, img, linkIcon;

      if ( ol && jsCount ) {
         $list.find( ".ui-li-dec" ).remove();
      }

      if ( ol ) { 
         // Check if a start attribute has been set while taking a value of 0 into account
         if ( start || start === 0 ) {
            if ( !jsCount ) {
               startCount = parseFloat( start ) - 1;
               $list.css( "counter-reset", "listnumbering " + startCount );
            } else {
               counter = parseFloat( start );
            }
         } else if ( jsCount ) {
               counter = 1;
         }  
      }

      if ( !o.theme ) {
         o.theme = $.mobile.getInheritedTheme( this.element, "c" );
      }

      for ( var pos = 0, numli = li.length; pos < numli; pos++ ) {
         item = li.eq( pos );
         itemClass = "ui-li";

         // If we're creating the element, we update it regardless
         if ( create || !item.hasClass( "ui-li" ) ) {
            itemTheme = item.jqmData( "theme" ) || o.theme;
            a = this._getChildrenByTagName( item[ 0 ], "a", "A" );
            var isDivider = ( item.jqmData( "role" ) === "list-divider" );

            if ( a.length && !isDivider ) {
               icon = item.jqmData( "icon" );

               item.buttonMarkup({
                  wrapperEls: "div",
                  shadow: false,
                  corners: false,
                  iconpos: "right",
                  icon: a.length > 1 || icon === false ? false : icon || "arrow-r",
                  theme: itemTheme
               });

               if ( ( icon !== false ) && ( a.length === 1 ) ) {
                  item.addClass( "ui-li-has-arrow" );
               }

               a.first().removeClass( "ui-link" ).addClass( "ui-link-inherit" );

               if ( a.length > 1 ) {
                  itemClass += " ui-li-has-alt";

                  last = a.last();
                  splittheme = listsplittheme || last.jqmData( "theme" ) || o.splitTheme;
                  linkIcon = last.jqmData( "icon" );

                  last.appendTo( item )
                     .attr( "title", last.getEncodedText() )
                     .addClass( "ui-li-link-alt" )
                     .empty()
                     .buttonMarkup({
                        shadow: false,
                        corners: false,
                        theme: itemTheme,
                        icon: false,
                        iconpos: "notext"
                     })
                     .find( ".ui-btn-inner" )
                        .append(
                           $( document.createElement( "span" ) ).buttonMarkup({
                              shadow: true,
                              corners: true,
                              theme: splittheme,
                              iconpos: "notext",
                              // link icon overrides list item icon overrides ul element overrides options
                              icon: linkIcon || icon || listspliticon || o.splitIcon
                           })
                        );
               }
            } else if ( isDivider ) {

               itemClass += " ui-li-divider ui-bar-" + dividertheme;
               item.attr( "role", "heading" );

               if ( ol ) { 
                  //reset counter when a divider heading is encountered
                  if ( start || start === 0 ) {
                     if ( !jsCount ) {
                        newStartCount = parseFloat( start ) - 1;
                        item.css( "counter-reset", "listnumbering " + newStartCount );
                     } else {
                        counter = parseFloat( start );
                     }
                  } else if ( jsCount ) {
                        counter = 1;
                  }  
               }
            
            } else {
               itemClass += " ui-li-static ui-btn-up-" + itemTheme;
            }
         }

         if ( ol && jsCount && itemClass.indexOf( "ui-li-divider" ) < 0 ) {
            countParent = itemClass.indexOf( "ui-li-static" ) > 0 ? item : item.find( ".ui-link-inherit" );

            countParent.addClass( "ui-li-jsnumbering" )
               .prepend( "<span class='ui-li-dec'>" + ( counter++ ) + ". </span>" );
         }

         // Instead of setting item class directly on the list item and its
         // btn-inner at this point in time, push the item into a dictionary
         // that tells us what class to set on it so we can do this after this
         // processing loop is finished.

         if ( !itemClassDict[ itemClass ] ) {
            itemClassDict[ itemClass ] = [];
         }

         itemClassDict[ itemClass ].push( item[ 0 ] );
      }

      // Set the appropriate listview item classes on each list item
      // and their btn-inner elements. The main reason we didn't do this
      // in the for-loop above is because we can eliminate per-item function overhead
      // by calling addClass() and children() once or twice afterwards. This
      // can give us a significant boost on platforms like WP7.5.

      for ( itemClass in itemClassDict ) {
         $( itemClassDict[ itemClass ] ).addClass( itemClass ).children( ".ui-btn-inner" ).addClass( itemClass );
      }

      $list.find( "h1, h2, h3, h4, h5, h6" ).addClass( "ui-li-heading" )
         .end()

         .find( "p, dl" ).addClass( "ui-li-desc" )
         .end()

         .find( ".ui-li-aside" ).each(function() {
               var $this = $( this );
               $this.prependTo( $this.parent() ); //shift aside to front for css float
            })
         .end()

         .find( ".ui-li-count" ).each(function() {
               $( this ).closest( "li" ).addClass( "ui-li-has-count" );
            }).addClass( "ui-btn-up-" + ( $list.jqmData( "counttheme" ) || this.options.countTheme) + " ui-btn-corner-all" );

      // The idea here is to look at the first image in the list item
      // itself, and any .ui-link-inherit element it may contain, so we
      // can place the appropriate classes on the image and list item.
      // Note that we used to use something like:
      //
      //    li.find(">img:eq(0), .ui-link-inherit>img:eq(0)").each( ... );
      //
      // But executing a find() like that on Windows Phone 7.5 took a
      // really long time. Walking things manually with the code below
      // allows the 400 listview item page to load in about 3 seconds as
      // opposed to 30 seconds.

      this._addThumbClasses( li );
      this._addThumbClasses( $list.find( ".ui-link-inherit" ) );

      this._refreshCorners( create );

    // autodividers binds to this to redraw dividers after the listview refresh
      this._trigger( "afterrefresh" );
   },

   //create a string for ID/subpage url creation
   _idStringEscape: function( str ) {
      return str.replace(/[^a-zA-Z0-9]/g, '-');
   },

   _createSubPages: function() {
      var parentList = this.element,
         parentPage = parentList.closest( ".ui-page" ),
         parentUrl = parentPage.jqmData( "url" ),
         parentId = parentUrl || parentPage[ 0 ][ $.expando ],
         parentListId = parentList.attr( "id" ),
         o = this.options,
         dns = "data-" + $.mobile.ns,
         self = this,
         persistentFooterID = parentPage.find( ":jqmData(role='footer')" ).jqmData( "id" ),
         hasSubPages;

      if ( typeof listCountPerPage[ parentId ] === "undefined" ) {
         listCountPerPage[ parentId ] = -1;
      }

      parentListId = parentListId || ++listCountPerPage[ parentId ];

      $( parentList.find( "li>ul, li>ol" ).toArray().reverse() ).each(function( i ) {
         var self = this,
            list = $( this ),
            listId = list.attr( "id" ) || parentListId + "-" + i,
            parent = list.parent(),
            nodeElsFull = $( list.prevAll().toArray().reverse() ),
            nodeEls = nodeElsFull.length ? nodeElsFull : $( "<span>" + $.trim(parent.contents()[ 0 ].nodeValue) + "</span>" ),
            title = nodeEls.first().getEncodedText(),//url limits to first 30 chars of text
            id = ( parentUrl || "" ) + "&" + $.mobile.subPageUrlKey + "=" + listId,
            theme = list.jqmData( "theme" ) || o.theme,
            countTheme = list.jqmData( "counttheme" ) || parentList.jqmData( "counttheme" ) || o.countTheme,
            newPage, anchor;

         //define hasSubPages for use in later removal
         hasSubPages = true;

         newPage = list.detach()
                  .wrap( "<div " + dns + "role='page' " + dns + "url='" + id + "' " + dns + "theme='" + theme + "' " + dns + "count-theme='" + countTheme + "'><div " + dns + "role='content'></div></div>" )
                  .parent()
                     .before( "<div " + dns + "role='header' " + dns + "theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>" )
                     .after( persistentFooterID ? $( "<div " + dns + "role='footer' " + dns + "id='"+ persistentFooterID +"'>" ) : "" )
                     .parent()
                        .appendTo( $.mobile.pageContainer );

         newPage.page();

         anchor = parent.find( 'a:first' );

         if ( !anchor.length ) {
            anchor = $( "<a/>" ).html( nodeEls || title ).prependTo( parent.empty() );
         }

         anchor.attr( "href", "#" + id );

      }).listview();

      // on pagehide, remove any nested pages along with the parent page, as long as they aren't active
      // and aren't embedded
      if ( hasSubPages &&
         parentPage.is( ":jqmData(external-page='true')" ) &&
         parentPage.data( "page" ).options.domCache === false ) {

         var newRemove = function( e, ui ) {
            var nextPage = ui.nextPage, npURL,
               prEvent = new $.Event( "pageremove" );

            if ( ui.nextPage ) {
               npURL = nextPage.jqmData( "url" );
               if ( npURL.indexOf( parentUrl + "&" + $.mobile.subPageUrlKey ) !== 0 ) {
                  self.childPages().remove();
                  parentPage.trigger( prEvent );
                  if ( !prEvent.isDefaultPrevented() ) {
                     parentPage.removeWithDependents();
                  }
               }
            }
         };

         // unbind the original page remove and replace with our specialized version
         parentPage
            .unbind( "pagehide.remove" )
            .bind( "pagehide.remove", newRemove);
      }
   },

   // TODO sort out a better way to track sub pages of the listview this is brittle
   childPages: function() {
      var parentUrl = this.parentPage.jqmData( "url" );

      return $( ":jqmData(url^='"+  parentUrl + "&" + $.mobile.subPageUrlKey + "')" );
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.listview.prototype.enhanceWithin( e.target );
});

})( jQuery );

(function( $, undefined ) {

$.mobile.listview.prototype.options.autodividers = false;
$.mobile.listview.prototype.options.autodividersSelector = function( elt ) {
   // look for the text in the given element
   var text = elt.text() || null;

   if ( !text ) {
      return null;
   }

   // create the text for the divider (first uppercased letter)
   text = text.slice( 0, 1 ).toUpperCase();

   return text;
};

$( document ).delegate( "ul,ol", "listviewcreate", function() {

   var list = $( this ),
         listview = list.data( "listview" );

   if ( !listview || !listview.options.autodividers ) {
      return;
   }

   var replaceDividers = function () {
      list.find( "li:jqmData(role='list-divider')" ).remove();

      var lis = list.find( 'li' ),
         lastDividerText = null, li, dividerText;

      for ( var i = 0; i < lis.length ; i++ ) {
         li = lis[i];
         dividerText = listview.options.autodividersSelector( $( li ) );

         if ( dividerText && lastDividerText !== dividerText ) {
            var divider = document.createElement( 'li' );
            divider.appendChild( document.createTextNode( dividerText ) );
            divider.setAttribute( 'data-' + $.mobile.ns + 'role', 'list-divider' );
            li.parentNode.insertBefore( divider, li );
         }

         lastDividerText = dividerText;
      }
   };

   var afterListviewRefresh = function () {
      list.unbind( 'listviewafterrefresh', afterListviewRefresh );
      replaceDividers();
      listview.refresh();
      list.bind( 'listviewafterrefresh', afterListviewRefresh );
   };

   afterListviewRefresh();
});

})( jQuery );

/*
* "checkboxradio" plugin
*/

(function( $, undefined ) {

$.widget( "mobile.checkboxradio", $.mobile.widget, {
   options: {
      theme: null,
      initSelector: "input[type='checkbox'],input[type='radio']"
   },
   _create: function() {
      var self = this,
         input = this.element,
         inheritAttr = function( input, dataAttr ) {
            return input.jqmData( dataAttr ) || input.closest( "form, fieldset" ).jqmData( dataAttr );
         },
         // NOTE: Windows Phone could not find the label through a selector
         // filter works though.
         parentLabel = $( input ).closest( "label" ),
         label = parentLabel.length ? parentLabel : $( input ).closest( "form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')" ).find( "label" ).filter( "[for='" + input[0].id + "']" ).first(),
         inputtype = input[0].type,
         mini = inheritAttr( input, "mini" ),
         checkedState = inputtype + "-on",
         uncheckedState = inputtype + "-off",
         icon = input.parents( ":jqmData(type='horizontal')" ).length ? undefined : uncheckedState,
         iconpos = inheritAttr( input, "iconpos" ),
         activeBtn = icon ? "" : " " + $.mobile.activeBtnClass,
         checkedClass = "ui-" + checkedState + activeBtn,
         uncheckedClass = "ui-" + uncheckedState,
         checkedicon = "ui-icon-" + checkedState,
         uncheckedicon = "ui-icon-" + uncheckedState;

      if ( inputtype !== "checkbox" && inputtype !== "radio" ) {
         return;
      }

      // Expose for other methods
      $.extend( this, {
         label: label,
         inputtype: inputtype,
         checkedClass: checkedClass,
         uncheckedClass: uncheckedClass,
         checkedicon: checkedicon,
         uncheckedicon: uncheckedicon
      });

      // If there's no selected theme check the data attr
      if ( !this.options.theme ) {
         this.options.theme = $.mobile.getInheritedTheme( this.element, "c" );
      }

      label.buttonMarkup({
         theme: this.options.theme,
         icon: icon,
         shadow: false,
         mini: mini,
         iconpos: iconpos
      });

      // Wrap the input + label in a div
      var wrapper = document.createElement('div');
      wrapper.className = 'ui-' + inputtype;

      input.add( label ).wrapAll( wrapper );

      label.bind({
         vmouseover: function( event ) {
            if ( $( this ).parent().is( ".ui-disabled" ) ) {
               event.stopPropagation();
            }
         },

         vclick: function( event ) {
            if ( input.is( ":disabled" ) ) {
               event.preventDefault();
               return;
            }

            self._cacheVals();

            input.prop( "checked", inputtype === "radio" && true || !input.prop( "checked" ) );

            // trigger click handler's bound directly to the input as a substitute for
            // how label clicks behave normally in the browsers
            // TODO: it would be nice to let the browser's handle the clicks and pass them
            //       through to the associate input. we can swallow that click at the parent
            //       wrapper element level
            input.triggerHandler( 'click' );

            // Input set for common radio buttons will contain all the radio
            // buttons, but will not for checkboxes. clearing the checked status
            // of other radios ensures the active button state is applied properly
            self._getInputSet().not( input ).prop( "checked", false );

            self._updateAll();
            return false;
         }
      });

      input
         .bind({
            vmousedown: function() {
               self._cacheVals();
            },

            vclick: function() {
               var $this = $( this );

               // Adds checked attribute to checked input when keyboard is used
               if ( $this.is( ":checked" ) ) {

                  $this.prop( "checked", true);
                  self._getInputSet().not( $this ).prop( "checked", false );
               } else {

                  $this.prop( "checked", false );
               }

               self._updateAll();
            },

            focus: function() {
               label.addClass( $.mobile.focusClass );
            },

            blur: function() {
               label.removeClass( $.mobile.focusClass );
            }
         });

      this.refresh();
   },

   _cacheVals: function() {
      this._getInputSet().each(function() {
         $( this ).jqmData( "cacheVal", this.checked );
      });
   },

   //returns either a set of radios with the same name attribute, or a single checkbox
   _getInputSet: function() {
      if ( this.inputtype === "checkbox" ) {
         return this.element;
      }

      return this.element.closest( "form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')" )
         .find( "input[name='" + this.element[0].name + "'][type='" + this.inputtype + "']" );
   },

   _updateAll: function() {
      var self = this;

      this._getInputSet().each(function() {
         var $this = $( this );

         if ( this.checked || self.inputtype === "checkbox" ) {
            $this.trigger( "change" );
         }
      })
      .checkboxradio( "refresh" );
   },

   refresh: function() {
      var input = this.element[0],
         label = this.label,
         icon = label.find( ".ui-icon" );

      if ( input.checked ) {
         label.addClass( this.checkedClass ).removeClass( this.uncheckedClass );
         icon.addClass( this.checkedicon ).removeClass( this.uncheckedicon );
      } else {
         label.removeClass( this.checkedClass ).addClass( this.uncheckedClass );
         icon.removeClass( this.checkedicon ).addClass( this.uncheckedicon );
      }

      if ( input.disabled ) {
         this.disable();
      } else {
         this.enable();
      }
   },

   disable: function() {
      this.element.prop( "disabled", true ).parent().addClass( "ui-disabled" );
   },

   enable: function() {
      this.element.prop( "disabled", false ).parent().removeClass( "ui-disabled" );
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.checkboxradio.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.button", $.mobile.widget, {
   options: {
      theme: null,
      icon: null,
      iconpos: null,
      corners: true,
      shadow: true,
      iconshadow: true,
      initSelector: "button, [type='button'], [type='submit'], [type='reset']"
   },
   _create: function() {
      var $el = this.element,
         $button,
         o = this.options,
         type,
         name,
         inline = o.inline || $el.jqmData( "inline" ),
         mini = o.mini || $el.jqmData( "mini" ),
         classes = "",
         $buttonPlaceholder;

      // if this is a link, check if it's been enhanced and, if not, use the right function
      if ( $el[ 0 ].tagName === "A" ) {
         if ( !$el.hasClass( "ui-btn" ) ) {
            $el.buttonMarkup();
         }

         return;
      }

      // get the inherited theme
      // TODO centralize for all widgets
      if ( !this.options.theme ) {
         this.options.theme = $.mobile.getInheritedTheme( this.element, "c" );
      }

      // TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
      /* if ( $el[0].className.length ) {
         classes = $el[0].className;
      } */
      if ( !!~$el[0].className.indexOf( "ui-btn-left" ) ) {
         classes = "ui-btn-left";
      }

      if (  !!~$el[0].className.indexOf( "ui-btn-right" ) ) {
         classes = "ui-btn-right";
      }

      if (  $el.attr( "type" ) === "submit" || $el.attr( "type" ) === "reset" ) {
         classes ? classes += " ui-submit" :  classes = "ui-submit";
      }
      $( "label[for='" + $el.attr( "id" ) + "']" ).addClass( "ui-submit" );

      // Add ARIA role
      this.button = $( "<div></div>" )
         [ $el.html() ? "html" : "text" ]( $el.html() || $el.val() )
         .insertBefore( $el )
         .buttonMarkup({
            theme: o.theme,
            icon: o.icon,
            iconpos: o.iconpos,
            inline: inline,
            corners: o.corners,
            shadow: o.shadow,
            iconshadow: o.iconshadow,
            mini: mini
         })
         .addClass( classes )
         .append( $el.addClass( "ui-btn-hidden" ) );

        $button = this.button;
      type = $el.attr( "type" );
      name = $el.attr( "name" );

      // Add hidden input during submit if input type="submit" has a name.
      if ( type !== "button" && type !== "reset" && name ) {
            $el.bind( "vclick", function() {
               // Add hidden input if it doesn't already exist.
               if ( $buttonPlaceholder === undefined ) {
                  $buttonPlaceholder = $( "<input>", {
                     type: "hidden",
                     name: $el.attr( "name" ),
                     value: $el.attr( "value" )
                  }).insertBefore( $el );

                  // Bind to doc to remove after submit handling
                  $( document ).one( "submit", function() {
                     $buttonPlaceholder.remove();

                     // reset the local var so that the hidden input
                     // will be re-added on subsequent clicks
                     $buttonPlaceholder = undefined;
                  });
               }
            });
      }

      $el.bind({
         focus: function() {
            $button.addClass( $.mobile.focusClass );
         },

         blur: function() {
            $button.removeClass( $.mobile.focusClass );
         }
      });

      this.refresh();
   },

   enable: function() {
      this.element.attr( "disabled", false );
      this.button.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
      return this._setOption( "disabled", false );
   },

   disable: function() {
      this.element.attr( "disabled", true );
      this.button.addClass( "ui-disabled" ).attr( "aria-disabled", true );
      return this._setOption( "disabled", true );
   },

   refresh: function() {
      var $el = this.element;

      if ( $el.prop("disabled") ) {
         this.disable();
      } else {
         this.enable();
      }

      // Grab the button's text element from its implementation-independent data item
      $( this.button.data( 'buttonElements' ).text )[ $el.html() ? "html" : "text" ]( $el.html() || $el.val() );
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.button.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.fn.controlgroup = function( options ) {
   function flipClasses( els, flCorners  ) {
      els.removeClass( "ui-btn-corner-all ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-controlgroup-last ui-shadow" )
         .eq( 0 ).addClass( flCorners[ 0 ] )
         .end()
         .last().addClass( flCorners[ 1 ] ).addClass( "ui-controlgroup-last" );
   }

   return this.each(function() {
      var $el = $( this ),
         o = $.extend({
                  direction: $el.jqmData( "type" ) || "vertical",
                  shadow: false,
                  excludeInvisible: true,
                  mini: $el.jqmData( "mini" )
               }, options ),
         grouplegend = $el.children( "legend" ),
         groupheading = $el.children( ".ui-controlgroup-label" ),
         groupcontrols = $el.children( ".ui-controlgroup-controls" ),
         flCorners = o.direction === "horizontal" ? [ "ui-corner-left", "ui-corner-right" ] : [ "ui-corner-top", "ui-corner-bottom" ],
         type = $el.find( "input" ).first().attr( "type" );

      // First unwrap the controls if the controlgroup was already enhanced
      if ( groupcontrols.length ) {
         groupcontrols.contents().unwrap();
      }
      $el.wrapInner( "<div class='ui-controlgroup-controls'></div>" );

      if ( grouplegend.length ) {
         // Replace legend with more stylable replacement div
         $( "<div role='heading' class='ui-controlgroup-label'>" + grouplegend.html() + "</div>" ).insertBefore( $el.children( 0 ) );
         grouplegend.remove();
      } else if ( groupheading.length ) {
         // Just move the heading if the controlgroup was already enhanced
         $el.prepend( groupheading );
      }

      $el.addClass( "ui-corner-all ui-controlgroup ui-controlgroup-" + o.direction );

      flipClasses( $el.find( ".ui-btn" + ( o.excludeInvisible ? ":visible" : "" ) ).not( '.ui-slider-handle' ), flCorners );
      flipClasses( $el.find( ".ui-btn-inner" ), flCorners );

      if ( o.shadow ) {
         $el.addClass( "ui-shadow" );
      }

      if ( o.mini ) {
         $el.addClass( "ui-mini" );
      }

   });
};

// The pagecreate handler for controlgroup is in jquery.mobile.init because of the soft-dependency on the wrapped widgets

})(jQuery);

(function( $, undefined ) {

$( document ).bind( "pagecreate create", function( e ) {

   //links within content areas, tests included with page
   $( e.target )
      .find( "a" )
      .jqmEnhanceable()
      .not( ".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')" )
      .addClass( "ui-link" );

});

})( jQuery );


(function( $, undefined ) {

   function fitSegmentInsideSegment( winSize, segSize, offset, desired ) {
      var ret = desired;

      if ( winSize < segSize ) {
         // Center segment if it's bigger than the window
         ret = offset + ( winSize - segSize ) / 2;
      } else {
         // Otherwise center it at the desired coordinate while keeping it completely inside the window
         ret = Math.min( Math.max( offset, desired - segSize / 2 ), offset + winSize - segSize );
      }

      return ret;
   }

   function windowCoords() {
      var $win = $( window );

      return {
         x: $win.scrollLeft(),
         y: $win.scrollTop(),
         cx: ( window.innerWidth || $win.width() ),
         cy: ( window.innerHeight || $win.height() )
      };
   }

   $.widget( "mobile.popup", $.mobile.widget, {
      options: {
         theme: null,
         overlayTheme: null,
         shadow: true,
         corners: true,
         transition: "none",
         positionTo: "origin",
         tolerance: null,
         initSelector: ":jqmData(role='popup')",
         closeLinkSelector: "a:jqmData(rel='back')",
         closeLinkEvents: "click.popup",
         navigateEvents: "navigate.popup",
         closeEvents: "navigate.popup pagebeforechange.popup",

         // NOTE Windows Phone 7 has a scroll position caching issue that
         //      requires us to disable popup history management by default
         //      https://github.com/jquery/jquery-mobile/issues/4784
         //
         // NOTE this option is modified in _create!
         history: !$.mobile.browser.ie
      },

      _eatEventAndClose: function( e ) {
         e.preventDefault();
         e.stopImmediatePropagation();
         this.close();
         return false;
      },

      // Make sure the screen size is increased beyond the page height if the popup's causes the document to increase in height
      _resizeScreen: function() {
         var popupHeight = this._ui.container.outerHeight( true );

         this._ui.screen.removeAttr( "style" );
         if ( popupHeight > this._ui.screen.height() ) {
            this._ui.screen.height( popupHeight );
         }
      },

      _handleWindowKeyUp: function( e ) {
         if ( this._isOpen && e.keyCode === $.mobile.keyCode.ESCAPE ) {
            return this._eatEventAndClose( e );
         }
      },

      _maybeRefreshTimeout: function() {
         var winCoords = windowCoords();

         if ( this._resizeData ) {
            if ( winCoords.x === this._resizeData.winCoords.x &&
               winCoords.y === this._resizeData.winCoords.y &&
               winCoords.cx === this._resizeData.winCoords.cx &&
               winCoords.cy === this._resizeData.winCoords.cy ) {
               // timeout not refreshed
               return false;
            } else {
               // clear existing timeout - it will be refreshed below
               clearTimeout( this._resizeData.timeoutId );
            }
         }

         this._resizeData = {
            timeoutId: setTimeout( $.proxy( this, "_resizeTimeout" ), 200 ),
            winCoords: winCoords
         };

         return true;
      },

      _resizeTimeout: function() {
         if ( !this._maybeRefreshTimeout() ) {
            // effectively rapid-open the popup while leaving the screen intact
            this._trigger( "beforeposition" );
            this._ui.container
               .removeClass( "ui-selectmenu-hidden" )
               .offset( this._placementCoords( this._desiredCoords( undefined, undefined, "window" ) ) );

            this._resizeScreen();
            this._resizeData = null;
            this._orientationchangeInProgress = false;
         }
      },

      _handleWindowResize: function( e ) {
         if ( this._isOpen ) {
            this._maybeRefreshTimeout();
         }
      },

      _handleWindowOrientationchange: function( e ) {

         if ( !this._orientationchangeInProgress ) {
            // effectively rapid-close the popup while leaving the screen intact
            this._ui.container
               .addClass( "ui-selectmenu-hidden" )
               .removeAttr( "style" );

            this._orientationchangeInProgress = true;
         }
      },

      _create: function() {
         var ui = {
               screen: $( "<div class='ui-screen-hidden ui-popup-screen'></div>" ),
               placeholder: $( "<div style='display: none;'><!-- placeholder --></div>" ),
               container: $( "<div class='ui-popup-container ui-selectmenu-hidden'></div>" )
            },
            thisPage = this.element.closest( ".ui-page" ),
            myId = this.element.attr( "id" ),
            self = this;

         // We need to adjust the history option to be false if there's no AJAX nav.
         // We can't do it in the option declarations because those are run before
         // it is determined whether there shall be AJAX nav.
         this.options.history = this.options.history && $.mobile.ajaxEnabled && $.mobile.hashListeningEnabled;

         if ( thisPage.length === 0 ) {
            thisPage = $( "body" );
         }

         // define the container for navigation event bindings
         // TODO this would be nice at the the mobile widget level
         this.options.container = this.options.container || $.mobile.pageContainer;

         // Apply the proto
         thisPage.append( ui.screen );
         ui.container.insertAfter( ui.screen );
         // Leave a placeholder where the element used to be
         ui.placeholder.insertAfter( this.element );
         if ( myId ) {
            ui.screen.attr( "id", myId + "-screen" );
            ui.container.attr( "id", myId + "-popup" );
            ui.placeholder.html( "<!-- placeholder for " + myId + " -->" );
         }
         ui.container.append( this.element );

         // Add class to popup element
         this.element.addClass( "ui-popup" );

         // Define instance variables
         $.extend( this, {
            _page: thisPage,
            _ui: ui,
            _fallbackTransition: "",
            _currentTransition: false,
            _prereqs: null,
            _isOpen: false,
            _tolerance: null,
            _resizeData: null,
            _orientationchangeInProgress: false,
            _globalHandlers: [
               {
                  src: $( window ),
                  handler: {
                     orientationchange: $.proxy( this, "_handleWindowOrientationchange" ),
                     resize: $.proxy( this, "_handleWindowResize" ),
                     keyup: $.proxy( this, "_handleWindowKeyUp" )
                  }
               }
            ]
         });

         $.each( this.options, function( key, value ) {
            // Cause initial options to be applied by their handler by temporarily setting the option to undefined
            // - the handler then sets it to the initial value
            self.options[ key ] = undefined;
            self._setOption( key, value, true );
         });

         ui.screen.bind( "vclick", $.proxy( this, "_eatEventAndClose" ) );

         $.each( this._globalHandlers, function( idx, value ) {
            value.src.bind( value.handler );
         });
      },

      _applyTheme: function( dst, theme, prefix ) {
         var classes = ( dst.attr( "class" ) || "").split( " " ),
            alreadyAdded = true,
            currentTheme = null,
            matches,
            themeStr = String( theme );

         while ( classes.length > 0 ) {
            currentTheme = classes.pop();
            matches = ( new RegExp( "^ui-" + prefix + "-([a-z])$" ) ).exec( currentTheme );
            if ( matches && matches.length > 1 ) {
               currentTheme = matches[ 1 ];
               break;
            } else {
               currentTheme = null;
            }
         }

         if ( theme !== currentTheme ) {
            dst.removeClass( "ui-" + prefix + "-" + currentTheme );
            if ( ! ( theme === null || theme === "none" ) ) {
               dst.addClass( "ui-" + prefix + "-" + themeStr );
            }
         }
      },

      _setTheme: function( value ) {
         this._applyTheme( this.element, value, "body" );
      },

      _setOverlayTheme: function( value ) {
         this._applyTheme( this._ui.screen, value, "overlay" );

         if ( this._isOpen ) {
            this._ui.screen.addClass( "in" );
         }
      },

      _setShadow: function( value ) {
         this.element.toggleClass( "ui-overlay-shadow", value );
      },

      _setCorners: function( value ) {
         this.element.toggleClass( "ui-corner-all", value );
      },

      _applyTransition: function( value ) {
         this._ui.container.removeClass( this._fallbackTransition );
         if ( value && value !== "none" ) {
            this._fallbackTransition = $.mobile._maybeDegradeTransition( value );
            this._ui.container.addClass( this._fallbackTransition );
         }
      },

      _setTransition: function( value ) {
         if ( !this._currentTransition ) {
            this._applyTransition( value );
         }
      },

      _setTolerance: function( value ) {
         var tol = { t: 30, r: 15, b: 30, l: 15 };

         if ( value ) {
            var ar = String( value ).split( "," );

            $.each( ar, function( idx, val ) { ar[ idx ] = parseInt( val, 10 ); } );

            switch( ar.length ) {
               // All values are to be the same
               case 1:
                  if ( !isNaN( ar[ 0 ] ) ) {
                     tol.t = tol.r = tol.b = tol.l = ar[ 0 ];
                  }
                  break;

               // The first value denotes top/bottom tolerance, and the second value denotes left/right tolerance
               case 2:
                  if ( !isNaN( ar[ 0 ] ) ) {
                     tol.t = tol.b = ar[ 0 ];
                  }
                  if ( !isNaN( ar[ 1 ] ) ) {
                     tol.l = tol.r = ar[ 1 ];
                  }
                  break;

               // The array contains values in the order top, right, bottom, left
               case 4:
                  if ( !isNaN( ar[ 0 ] ) ) {
                     tol.t = ar[ 0 ];
                  }
                  if ( !isNaN( ar[ 1 ] ) ) {
                     tol.r = ar[ 1 ];
                  }
                  if ( !isNaN( ar[ 2 ] ) ) {
                     tol.b = ar[ 2 ];
                  }
                  if ( !isNaN( ar[ 3 ] ) ) {
                     tol.l = ar[ 3 ];
                  }
                  break;

               default:
                  break;
            }
         }

         this._tolerance = tol;
      },

      _setOption: function( key, value ) {
         var exclusions, setter = "_set" + key.charAt( 0 ).toUpperCase() + key.slice( 1 );

         if ( this[ setter ] !== undefined ) {
            this[ setter ]( value );
         }

         // TODO REMOVE FOR 1.2.1 by moving them out to a default options object
         exclusions = [
            "initSelector",
            "closeLinkSelector",
            "closeLinkEvents",
            "navigateEvents",
            "closeEvents",
            "history",
            "container"
         ];

         $.mobile.widget.prototype._setOption.apply( this, arguments );
         if ( $.inArray( key, exclusions ) === -1 ) {
            // Record the option change in the options and in the DOM data-* attributes
            this.element.attr( "data-" + ( $.mobile.ns || "" ) + ( key.replace( /([A-Z])/, "-$1" ).toLowerCase() ), value );
         }
      },

      // Try and center the overlay over the given coordinates
      _placementCoords: function( desired ) {
         // rectangle within which the popup must fit
         var
            winCoords = windowCoords(),
            rc = {
               x: this._tolerance.l,
               y: winCoords.y + this._tolerance.t,
               cx: winCoords.cx - this._tolerance.l - this._tolerance.r,
               cy: winCoords.cy - this._tolerance.t - this._tolerance.b
            },
            menuSize, ret;

         // Clamp the width of the menu before grabbing its size
         this._ui.container.css( "max-width", rc.cx );
         menuSize = {
            cx: this._ui.container.outerWidth( true ),
            cy: this._ui.container.outerHeight( true )
         };

         // Center the menu over the desired coordinates, while not going outside
         // the window tolerances. This will center wrt. the window if the popup is too large.
         ret = {
            x: fitSegmentInsideSegment( rc.cx, menuSize.cx, rc.x, desired.x ),
            y: fitSegmentInsideSegment( rc.cy, menuSize.cy, rc.y, desired.y )
         };

         // Make sure the top of the menu is visible
         ret.y = Math.max( 0, ret.y );

         // If the height of the menu is smaller than the height of the document
         // align the bottom with the bottom of the document

         // fix for $( document ).height() bug in core 1.7.2.
         var docEl = document.documentElement, docBody = document.body,
            docHeight = Math.max( docEl.clientHeight, docBody.scrollHeight, docBody.offsetHeight, docEl.scrollHeight, docEl.offsetHeight );

         ret.y -= Math.min( ret.y, Math.max( 0, ret.y + menuSize.cy - docHeight ) );

         return { left: ret.x, top: ret.y };
      },

      _createPrereqs: function( screenPrereq, containerPrereq, whenDone ) {
         var self = this, prereqs;

         // It is important to maintain both the local variable prereqs and self._prereqs. The local variable remains in
         // the closure of the functions which call the callbacks passed in. The comparison between the local variable and
         // self._prereqs is necessary, because once a function has been passed to .animationComplete() it will be called
         // next time an animation completes, even if that's not the animation whose end the function was supposed to catch
         // (for example, if an abort happens during the opening animation, the .animationComplete handler is not called for
         // that animation anymore, but the handler remains attached, so it is called the next time the popup is opened
         // - making it stale. Comparing the local variable prereqs to the widget-level variable self._prereqs ensures that
         // callbacks triggered by a stale .animationComplete will be ignored.

         prereqs = {
            screen: $.Deferred(),
            container: $.Deferred()
         };

         prereqs.screen.then( function() {
            if ( prereqs === self._prereqs ) {
               screenPrereq();
            }
         });

         prereqs.container.then( function() {
            if ( prereqs === self._prereqs ) {
               containerPrereq();
            }
         });

         $.when( prereqs.screen, prereqs.container ).done( function() {
            if ( prereqs === self._prereqs ) {
               self._prereqs = null;
               whenDone();
            }
         });

         self._prereqs = prereqs;
      },

      _animate: function( args ) {
         // NOTE before removing the default animation of the screen
         //      this had an animate callback that would relove the deferred
         //      now the deferred is resolved immediately
         // TODO remove the dependency on the screen deferred
         this._ui.screen
            .removeClass( args.classToRemove )
            .addClass( args.screenClassToAdd );

         args.prereqs.screen.resolve();

         if ( args.transition && args.transition !== "none" ) {
            if ( args.applyTransition ) {
               this._applyTransition( args.transition );
            }
            this._ui.container
               .animationComplete( $.proxy( args.prereqs.container, "resolve" ) )
               .addClass( args.containerClassToAdd )
               .removeClass( args.classToRemove );
         } else {
            args.prereqs.container.resolve();
         }
      },

      // The desired coordinates passed in will be returned untouched if no reference element can be identified via
      // desiredPosition.positionTo. Nevertheless, this function ensures that its return value always contains valid
      // x and y coordinates by specifying the center middle of the window if the coordinates are absent.
      _desiredCoords: function( x, y, positionTo ) {
         var dst = null, offset, winCoords = windowCoords();

         // Establish which element will serve as the reference
         if ( positionTo && positionTo !== "origin" ) {
            if ( positionTo === "window" ) {
               x = winCoords.cx / 2 + winCoords.x;
               y = winCoords.cy / 2 + winCoords.y;
            } else {
               try {
                  dst = $( positionTo );
               } catch( e ) {
                  dst = null;
               }
               if ( dst ) {
                  dst.filter( ":visible" );
                  if ( dst.length === 0 ) {
                     dst = null;
                  }
               }
            }
         }

         // If an element was found, center over it
         if ( dst ) {
            offset = dst.offset();
            x = offset.left + dst.outerWidth() / 2;
            y = offset.top + dst.outerHeight() / 2;
         }

         // Make sure x and y are valid numbers - center over the window
         if ( $.type( x ) !== "number" || isNaN( x ) ) {
            x = winCoords.cx / 2 + winCoords.x;
         }
         if ( $.type( y ) !== "number" || isNaN( y ) ) {
            y = winCoords.cy / 2 + winCoords.y;
         }

         return { x: x, y: y };
      },

      _openPrereqsComplete: function() {
         var self = this;

         self._ui.container.addClass( "ui-popup-active" );
         self._isOpen = true;
         self._resizeScreen();

         // Android appears to trigger the animation complete before the popup
         // is visible. Allowing the stack to unwind before applying focus prevents
         // the "blue flash" of element focus in android 4.0
         setTimeout(function(){
            self._ui.container.attr( "tabindex", "0" ).focus();
            self._trigger( "afteropen" );
         });
      },

      _open: function( options ) {
         var coords, transition,
            androidBlacklist = ( function() {
               var w = window,
                  ua = navigator.userAgent,
                  // Rendering engine is Webkit, and capture major version
                  wkmatch = ua.match( /AppleWebKit\/([0-9\.]+)/ ),
                  wkversion = !!wkmatch && wkmatch[ 1 ],
                  androidmatch = ua.match( /Android (\d+(?:\.\d+))/ ),
                  andversion = !!androidmatch && androidmatch[ 1 ],
                  chromematch = ua.indexOf( "Chrome" ) > -1;

               // Platform is Android, WebKit version is greater than 534.13 ( Android 3.2.1 ) and not Chrome.
               if( androidmatch !== null && andversion === "4.0" && wkversion && wkversion > 534.13 && !chromematch ) {
                  return true;
               }
               return false;
            }());

         // Make sure options is defined
         options = ( options || {} );

         // Copy out the transition, because we may be overwriting it later and we don't want to pass that change back to the caller
         transition = options.transition || this.options.transition;

         // Give applications a chance to modify the contents of the container before it appears
         this._trigger( "beforeposition" );

         coords = this._placementCoords( this._desiredCoords( options.x, options.y, options.positionTo || this.options.positionTo || "origin" ) );

         // Count down to triggering "popupafteropen" - we have two prerequisites:
         // 1. The popup window animation completes (container())
         // 2. The screen opacity animation completes (screen())
         this._createPrereqs(
            $.noop,
            $.noop,
            $.proxy( this, "_openPrereqsComplete" ) );

         if ( transition ) {
            this._currentTransition = transition;
            this._applyTransition( transition );
         } else {
            transition = this.options.transition;
         }

         if ( !this.options.theme ) {
            this._setTheme( this._page.jqmData( "theme" ) || $.mobile.getInheritedTheme( this._page, "c" ) );
         }

         this._ui.screen.removeClass( "ui-screen-hidden" );

         this._ui.container
            .removeClass( "ui-selectmenu-hidden" )
            .offset( coords );

         if ( this.options.overlayTheme && androidBlacklist ) {
            /* TODO:
            The native browser on Android 4.0.X ("Ice Cream Sandwich") suffers from an issue where the popup overlay appears to be z-indexed
            above the popup itself when certain other styles exist on the same page -- namely, any element set to `position: fixed` and certain
            types of input. These issues are reminiscent of previously uncovered bugs in older versions of Android's native browser:
            https://github.com/scottjehl/Device-Bugs/issues/3

            This fix closes the following bugs ( I use "closes" with reluctance, and stress that this issue should be revisited as soon as possible ):

            https://github.com/jquery/jquery-mobile/issues/4816
            https://github.com/jquery/jquery-mobile/issues/4844
            https://github.com/jquery/jquery-mobile/issues/4874
            */

            // TODO sort out why this._page isn't working
            this.element.closest( ".ui-page" ).addClass( "ui-popup-open" );
         }
         this._animate({
            additionalCondition: true,
            transition: transition,
            classToRemove: "",
            screenClassToAdd: "in",
            containerClassToAdd: "in",
            applyTransition: false,
            prereqs: this._prereqs
         });
      },

      _closePrereqScreen: function() {
         this._ui.screen
            .removeClass( "out" )
            .addClass( "ui-screen-hidden" );
      },

      _closePrereqContainer: function() {
         this._ui.container
            .removeClass( "reverse out" )
            .addClass( "ui-selectmenu-hidden" )
            .removeAttr( "style" );
      },

      _closePrereqsDone: function() {
         var self = this, opts = self.options;

         self._ui.container.removeAttr( "tabindex" );

         // remove nav bindings if they are still present
         opts.container.unbind( opts.closeEvents );

         // unbind click handlers added when history is disabled
         self.element.undelegate( opts.closeLinkSelector, opts.closeLinkEvents );

         // remove the global mutex for popups
         $.mobile.popup.active = undefined;

         // alert users that the popup is closed
         self._trigger( "afterclose" );
      },

      _close: function() {
         this._ui.container.removeClass( "ui-popup-active" );
         this._page.removeClass( "ui-popup-open" );

         this._isOpen = false;

         // Count down to triggering "popupafterclose" - we have two prerequisites:
         // 1. The popup window reverse animation completes (container())
         // 2. The screen opacity animation completes (screen())
         this._createPrereqs(
            $.proxy( this, "_closePrereqScreen" ),
            $.proxy( this, "_closePrereqContainer" ),
            $.proxy( this, "_closePrereqsDone" ) );

         this._animate( {
            additionalCondition: this._ui.screen.hasClass( "in" ),
            transition: ( this._currentTransition || this.options.transition ),
            classToRemove: "in",
            screenClassToAdd: "out",
            containerClassToAdd: "reverse out",
            applyTransition: true,
            prereqs: this._prereqs
         });
      },

      _destroy: function() {
         var self = this;

         // hide and remove bindings
         self._close();

         // Put the element back to where the placeholder was and remove the "ui-popup" class
         self._setTheme( "none" );
         self.element
            .insertAfter( self._ui.placeholder )
            .removeClass( "ui-popup ui-overlay-shadow ui-corner-all" );
         self._ui.screen.remove();
         self._ui.container.remove();
         self._ui.placeholder.remove();

         // Unbind handlers that were bound to elements outside self.element (the window, in self case)
         $.each( self._globalHandlers, function( idx, oneSrc ) {
            $.each( oneSrc.handler, function( eventType, handler ) {
               oneSrc.src.unbind( eventType, handler );
            });
         });
      },

      // any navigation event after a popup is opened should close the popup
      // NOTE the pagebeforechange is bound to catch navigation events that don't
      //      alter the url (eg, dialogs from popups)
      _bindContainerClose: function() {
         var self = this;

         self.options.container
            .one( self.options.closeEvents, $.proxy( self._close, self ));
      },

      // TODO no clear deliniation of what should be here and
      // what should be in _open. Seems to be "visual" vs "history" for now
      open: function( options ) {
         var self = this, opts = this.options, url, hashkey, activePage, currentIsDialog, hasHash, urlHistory;

         // make sure open is idempotent
         if( $.mobile.popup.active ) {
            return;
         }

         // set the global popup mutex
         $.mobile.popup.active = this;

         // if history alteration is disabled close on navigate events
         // and leave the url as is
         if( !( opts.history ) ) {
            self._open( options );
            self._bindContainerClose();

            // When histoy is disabled we have to grab the data-rel
            // back link clicks so we can close the popup instead of
            // relying on history to do it for us
            self.element
               .delegate( opts.closeLinkSelector, opts.closeLinkEvents, function( e ) {
                  self._close();

                  // NOTE prevent the browser and navigation handlers from
                  // working with the link's rel=back. This may cause
                  // issues for developers expecting the event to bubble
                  return false;
               });

            return;
         }

         // cache some values for min/readability
         hashkey = $.mobile.dialogHashKey;
         activePage = $.mobile.activePage;
         currentIsDialog = activePage.is( ".ui-dialog" );
         url = $.mobile.urlHistory.getActive().url;
         hasHash = ( url.indexOf( hashkey ) > -1 ) && !currentIsDialog;
         urlHistory = $.mobile.urlHistory;

         if ( hasHash ) {
            self._open( options );
            self._bindContainerClose();
            return;
         }

         // if the current url has no dialog hash key proceed as normal
         // otherwise, if the page is a dialog simply tack on the hash key
         if ( url.indexOf( hashkey ) === -1 && !currentIsDialog ){
            url = url + hashkey;
         } else {
            url = $.mobile.path.parseLocation().hash + hashkey;
         }

         // Tack on an extra hashkey if this is the first page and we've just reconstructed the initial hash
         if ( urlHistory.activeIndex === 0 && url === urlHistory.initialDst ) {
            url += hashkey;
         }

         // swallow the the initial navigation event, and bind for the next
         opts.container.one( opts.navigateEvents, function( e ) {
            e.preventDefault();
            self._open( options );
            self._bindContainerClose();
         });

         urlHistory.ignoreNextHashChange = currentIsDialog;

         // Gotta love methods with 1mm args :(
         urlHistory.addNew( url, undefined, undefined, undefined, "dialog" );

         // set the new url with (or without) the new dialog hash key
         $.mobile.path.set( url );
      },

      close: function() {
         // make sure close is idempotent
         if( !$.mobile.popup.active ){
            return;
         }

         if( this.options.history ) {
            $.mobile.back();
         } else {
            this._close();
         }
      }
   });


   // TODO this can be moved inside the widget
   $.mobile.popup.handleLink = function( $link ) {
      var closestPage = $link.closest( ":jqmData(role='page')" ),
         scope = ( ( closestPage.length === 0 ) ? $( "body" ) : closestPage ),
         // NOTE make sure to get only the hash, ie7 (wp7) return the absolute href
         //      in this case ruining the element selection
         popup = $( $.mobile.path.parseUrl($link.attr( "href" )).hash, scope[0] ),
         offset;

      if ( popup.data( "popup" ) ) {
         offset = $link.offset();
         popup.popup( "open", {
            x: offset.left + $link.outerWidth() / 2,
            y: offset.top + $link.outerHeight() / 2,
            transition: $link.jqmData( "transition" ),
            positionTo: $link.jqmData( "position-to" ),
            link: $link
         });
      }

      //remove after delay
      setTimeout( function() {
         $link.removeClass( $.mobile.activeBtnClass );
      }, 300 );
   };

   // TODO move inside _create
   $( document ).bind( "pagebeforechange", function( e, data ) {
      if ( data.options.role === "popup" ) {
         $.mobile.popup.handleLink( data.options.link );
         e.preventDefault();
      }
   });

   $( document ).bind( "pagecreate create", function( e )  {
      $.mobile.popup.prototype.enhanceWithin( e.target, true );
   });

})( jQuery );

(function( $ ) {
   var   meta = $( "meta[name=viewport]" ),
      initialContent = meta.attr( "content" ),
      disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
      enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
      disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test( initialContent );

   $.mobile.zoom = $.extend( {}, {
      enabled: !disabledInitially,
      locked: false,
      disable: function( lock ) {
         if ( !disabledInitially && !$.mobile.zoom.locked ) {
            meta.attr( "content", disabledZoom );
            $.mobile.zoom.enabled = false;
            $.mobile.zoom.locked = lock || false;
         }
      },
      enable: function( unlock ) {
         if ( !disabledInitially && ( !$.mobile.zoom.locked || unlock === true ) ) {
            meta.attr( "content", enabledZoom );
            $.mobile.zoom.enabled = true;
            $.mobile.zoom.locked = false;
         }
      },
      restore: function() {
         if ( !disabledInitially ) {
            meta.attr( "content", initialContent );
            $.mobile.zoom.enabled = true;
         }
      }
   });

}( jQuery ));

(function( $, undefined ) {

$.widget( "mobile.textinput", $.mobile.widget, {
   options: {
      theme: null,
      // This option defaults to true on iOS devices.
      preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
      initSelector: "input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])",
      clearSearchButtonText: "clear text",
      disabled: false
   },

   _create: function() {

      var self = this,
         input = this.element,
         o = this.options,
         theme = o.theme || $.mobile.getInheritedTheme( this.element, "c" ),
         themeclass  = " ui-body-" + theme,
         mini = input.jqmData( "mini" ) === true,
         miniclass = mini ? " ui-mini" : "",
         focusedEl, clearbtn;

      function toggleClear() {
         setTimeout( function() {
            clearbtn.toggleClass( "ui-input-clear-hidden", !input.val() );
         }, 0 );
      }

      $( "label[for='" + input.attr( "id" ) + "']" ).addClass( "ui-input-text" );

      focusedEl = input.addClass("ui-input-text ui-body-"+ theme );

      // XXX: Temporary workaround for issue 785 (Apple bug 8910589).
      //      Turn off autocorrect and autocomplete on non-iOS 5 devices
      //      since the popup they use can't be dismissed by the user. Note
      //      that we test for the presence of the feature by looking for
      //      the autocorrect property on the input element. We currently
      //      have no test for iOS 5 or newer so we're temporarily using
      //      the touchOverflow support flag for jQM 1.0. Yes, I feel dirty. - jblas
      if ( typeof input[0].autocorrect !== "undefined" && !$.support.touchOverflow ) {
         // Set the attribute instead of the property just in case there
         // is code that attempts to make modifications via HTML.
         input[0].setAttribute( "autocorrect", "off" );
         input[0].setAttribute( "autocomplete", "off" );
      }


      //"search" input widget
      if ( input.is( "[type='search'],:jqmData(type='search')" ) ) {

         focusedEl = input.wrap( "<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield" + themeclass + miniclass + "'></div>" ).parent();
         clearbtn = $( "<a href='#' class='ui-input-clear' title='" + o.clearSearchButtonText + "'>" + o.clearSearchButtonText + "</a>" )
            .bind('click', function( event ) {
               input
                  .val( "" )
                  .focus()
                  .trigger( "change" );
               clearbtn.addClass( "ui-input-clear-hidden" );
               event.preventDefault();
            })
            .appendTo( focusedEl )
            .buttonMarkup({
               icon: "delete",
               iconpos: "notext",
               corners: true,
               shadow: true,
               mini: mini
            });

         toggleClear();

         input.bind( 'paste cut keyup focus change blur', toggleClear );

      } else {
         input.addClass( "ui-corner-all ui-shadow-inset" + themeclass + miniclass );
      }

      input.focus(function() {
            focusedEl.addClass( $.mobile.focusClass );
         })
         .blur(function() {
            focusedEl.removeClass( $.mobile.focusClass );
         })
         // In many situations, iOS will zoom into the select upon tap, this prevents that from happening
         .bind( "focus", function() {
            if ( o.preventFocusZoom ) {
               $.mobile.zoom.disable( true );
            }
         })
         .bind( "blur", function() {
            if ( o.preventFocusZoom ) {
               $.mobile.zoom.enable( true );
            }
         });

      // Autogrow
      if ( input.is( "textarea" ) ) {
         var extraLineHeight = 15,
            keyupTimeoutBuffer = 100,
            keyupTimeout;

         this._keyup = function() {
            var scrollHeight = input[ 0 ].scrollHeight,
               clientHeight = input[ 0 ].clientHeight;

            if ( clientHeight < scrollHeight ) {
               input.height(scrollHeight + extraLineHeight);
            }
         };

         input.keyup(function() {
            clearTimeout( keyupTimeout );
            keyupTimeout = setTimeout( self._keyup, keyupTimeoutBuffer );
         });

         // binding to pagechange here ensures that for pages loaded via
         // ajax the height is recalculated without user input
         this._on( $(document), {"pagechange": "_keyup" });

         // Issue 509: the browser is not providing scrollHeight properly until the styles load
         if ( $.trim( input.val() ) ) {
            // bind to the window load to make sure the height is calculated based on BOTH
            // the DOM and CSS
            this._on( $(window), {"load": "_keyup"});
         }
      }
      if ( input.attr( "disabled" ) ) {
         this.disable();
      }
   },

   disable: function() {
      var $el;
      if ( this.element.attr( "disabled", true ).is( "[type='search'], :jqmData(type='search')" ) ) {
         $el = this.element.parent();
      } else {
         $el = this.element;
      }
      $el.addClass( "ui-disabled" );
      return this._setOption( "disabled", true );
   },

   enable: function() {
      var $el;

      // TODO using more than one line of code is acceptable ;)
      if ( this.element.attr( "disabled", false ).is( "[type='search'], :jqmData(type='search')" ) ) {
         $el = this.element.parent();
      } else {
         $el = this.element;
      }
      $el.removeClass( "ui-disabled" );
      return this._setOption( "disabled", false );
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.textinput.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.mobile.listview.prototype.options.filter = false;
$.mobile.listview.prototype.options.filterPlaceholder = "Filter items...";
$.mobile.listview.prototype.options.filterTheme = "c";
// TODO rename callback/deprecate and default to the item itself as the first argument
var defaultFilterCallback = function( text, searchValue, item ) {
      return text.toString().toLowerCase().indexOf( searchValue ) === -1;
   };

$.mobile.listview.prototype.options.filterCallback = defaultFilterCallback;

$( document ).delegate( ":jqmData(role='listview')", "listviewcreate", function() {

   var list = $( this ),
      listview = list.data( "listview" );

   if ( !listview.options.filter ) {
      return;
   }

   var wrapper = $( "<form>", {
         "class": "ui-listview-filter ui-bar-" + listview.options.filterTheme,
         "role": "search"
      }),
      search = $( "<input>", {
         placeholder: listview.options.filterPlaceholder
      })
      .attr( "data-" + $.mobile.ns + "type", "search" )
      .jqmData( "lastval", "" )
      .bind( "keyup change", function() {

         var $this = $( this ),
            val = this.value.toLowerCase(),
            listItems = null,
            lastval = $this.jqmData( "lastval" ) + "",
            childItems = false,
            itemtext = "",
            item,
            // Check if a custom filter callback applies
            isCustomFilterCallback = listview.options.filterCallback !== defaultFilterCallback;

         listview._trigger( "beforefilter", "beforefilter", { input: this } );

         // Change val as lastval for next execution
         $this.jqmData( "lastval" , val );
         if ( isCustomFilterCallback || val.length < lastval.length || val.indexOf( lastval ) !== 0 ) {

            // Custom filter callback applies or removed chars or pasted something totally different, check all items
            listItems = list.children();
         } else {

            // Only chars added, not removed, only use visible subset
            listItems = list.children( ":not(.ui-screen-hidden)" );
         }

         if ( val ) {

            // This handles hiding regular rows without the text we search for
            // and any list dividers without regular rows shown under it

            for ( var i = listItems.length - 1; i >= 0; i-- ) {
               item = $( listItems[ i ] );
               itemtext = item.jqmData( "filtertext" ) || item.text();

               if ( item.is( "li:jqmData(role=list-divider)" ) ) {

                  item.toggleClass( "ui-filter-hidequeue" , !childItems );

                  // New bucket!
                  childItems = false;

               } else if ( listview.options.filterCallback( itemtext, val, item ) ) {

                  //mark to be hidden
                  item.toggleClass( "ui-filter-hidequeue" , true );
               } else {

                  // There's a shown item in the bucket
                  childItems = true;
               }
            }

            // Show items, not marked to be hidden
            listItems
               .filter( ":not(.ui-filter-hidequeue)" )
               .toggleClass( "ui-screen-hidden", false );

            // Hide items, marked to be hidden
            listItems
               .filter( ".ui-filter-hidequeue" )
               .toggleClass( "ui-screen-hidden", true )
               .toggleClass( "ui-filter-hidequeue", false );

         } else {

            //filtervalue is empty => show all
            listItems.toggleClass( "ui-screen-hidden", false );
         }
         listview._refreshCorners();
      })
      .appendTo( wrapper )
      .textinput();

   if ( listview.options.inset ) {
      wrapper.addClass( "ui-listview-filter-inset" );
   }

   wrapper.bind( "submit", function() {
      return false;
   })
   .insertBefore( list );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.slider", $.mobile.widget, {
   widgetEventPrefix: "slide",

   options: {
      theme: null,
      trackTheme: null,
      disabled: false,
      initSelector: "input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",
      mini: false
   },

   _create: function() {

      // TODO: Each of these should have comments explain what they're for
      var self = this,

         control = this.element,

         parentTheme = $.mobile.getInheritedTheme( control, "c" ),

         theme = this.options.theme || parentTheme,

         trackTheme = this.options.trackTheme || parentTheme,

         cType = control[ 0 ].nodeName.toLowerCase(),

         selectClass = ( cType === "select" ) ? "ui-slider-switch" : "",

         controlID = control.attr( "id" ),

         $label = $( "[for='" + controlID + "']" ),

         labelID = $label.attr( "id" ) || controlID + "-label",

         label = $label.attr( "id", labelID ),

         val = function() {
            return  cType === "input"  ? parseFloat( control.val() ) : control[0].selectedIndex;
         },

         min =  cType === "input" ? parseFloat( control.attr( "min" ) ) : 0,

         max =  cType === "input" ? parseFloat( control.attr( "max" ) ) : control.find( "option" ).length-1,

         step = window.parseFloat( control.attr( "step" ) || 1 ),

         inlineClass = ( this.options.inline || control.jqmData( "inline" ) === true ) ? " ui-slider-inline" : "",

         miniClass = ( this.options.mini || control.jqmData( "mini" ) ) ? " ui-slider-mini" : "",


         domHandle = document.createElement( 'a' ),
         handle = $( domHandle ),
         domSlider = document.createElement( 'div' ),
         slider = $( domSlider ),

         valuebg = control.jqmData( "highlight" ) && cType !== "select" ? (function() {
            var bg = document.createElement('div');
            bg.className = 'ui-slider-bg ' + $.mobile.activeBtnClass + ' ui-btn-corner-all';
            return $( bg ).prependTo( slider );
         })() : false,

         options;

      this._type = cType;

      domHandle.setAttribute( 'href', "#" );
      domSlider.setAttribute('role','application');
      domSlider.className = ['ui-slider ',selectClass," ui-btn-down-",trackTheme,' ui-btn-corner-all', inlineClass, miniClass].join( "" );
      domHandle.className = 'ui-slider-handle';
      domSlider.appendChild( domHandle );

      handle.buttonMarkup({ corners: true, theme: theme, shadow: true })
            .attr({
               "role": "slider",
               "aria-valuemin": min,
               "aria-valuemax": max,
               "aria-valuenow": val(),
               "aria-valuetext": val(),
               "title": val(),
               "aria-labelledby": labelID
            });

      $.extend( this, {
         slider: slider,
         handle: handle,
         valuebg: valuebg,
         dragging: false,
         beforeStart: null,
         userModified: false,
         mouseMoved: false
      });

      if ( cType === "select" ) {
         var wrapper = document.createElement('div');
         wrapper.className = 'ui-slider-inneroffset';

         for ( var j = 0,length = domSlider.childNodes.length;j < length;j++ ) {
            wrapper.appendChild( domSlider.childNodes[j] );
         }

         domSlider.appendChild( wrapper );

         // slider.wrapInner( "<div class='ui-slider-inneroffset'></div>" );

         // make the handle move with a smooth transition
         handle.addClass( "ui-slider-handle-snapping" );

         options = control.find( "option" );

         for ( var i = 0, optionsCount = options.length; i < optionsCount; i++ ) {
            var side = !i ? "b" : "a",
               sliderTheme = !i ? " ui-btn-down-" + trackTheme : ( " " + $.mobile.activeBtnClass ),
               sliderLabel = document.createElement( 'div' ),
               sliderImg = document.createElement( 'span' );

            sliderImg.className = ['ui-slider-label ui-slider-label-',side,sliderTheme," ui-btn-corner-all"].join( "" );
            sliderImg.setAttribute('role','img');
            sliderImg.appendChild( document.createTextNode( options[i].innerHTML ) );
            $(sliderImg).prependTo( slider );
         }

         self._labels = $( ".ui-slider-label", slider );

      }

      label.addClass( "ui-slider" );

      // monitor the input for updated values
      control.addClass( cType === "input" ? "ui-slider-input" : "ui-slider-switch" )
         .change(function() {
            // if the user dragged the handle, the "change" event was triggered from inside refresh(); don't call refresh() again
            if ( !self.mouseMoved ) {
               self.refresh( val(), true );
            }
         })
         .keyup(function() { // necessary?
            self.refresh( val(), true, true );
         })
         .blur(function() {
            self.refresh( val(), true );
         });

      this._preventDocumentDrag = function( event ) {
         // NOTE: we don't do this in refresh because we still want to
         //       support programmatic alteration of disabled inputs
         if ( self.dragging && !self.options.disabled ) {

            // self.mouseMoved must be updated before refresh() because it will be used in the control "change" event
            self.mouseMoved = true;

            if ( cType === "select" ) {
               // make the handle move in sync with the mouse
               handle.removeClass( "ui-slider-handle-snapping" );
            }

            self.refresh( event );

            // only after refresh() you can calculate self.userModified
            self.userModified = self.beforeStart !== control[0].selectedIndex;
            return false;
         }
      }

      this._on( $( document ), { "vmousemove": this._preventDocumentDrag });

      // it appears the clicking the up and down buttons in chrome on
      // range/number inputs doesn't trigger a change until the field is
      // blurred. Here we check thif the value has changed and refresh
      control.bind( "vmouseup", $.proxy( self._checkedRefresh, self));

      slider.bind( "vmousedown", function( event ) {
         // NOTE: we don't do this in refresh because we still want to
         //       support programmatic alteration of disabled inputs
         if ( self.options.disabled ) {
            return false;
         }

         self.dragging = true;
         self.userModified = false;
         self.mouseMoved = false;

         if ( cType === "select" ) {
            self.beforeStart = control[0].selectedIndex;
         }

         self.refresh( event );
         self._trigger( "start" );
         return false;
      })
      .bind( "vclick", false );

      this._sliderMouseUp = function() {
         if ( self.dragging ) {
            self.dragging = false;

            if ( cType === "select") {
               // make the handle move with a smooth transition
               handle.addClass( "ui-slider-handle-snapping" );

               if ( self.mouseMoved ) {
                  // this is a drag, change the value only if user dragged enough
                  if ( self.userModified ) {
                      self.refresh( self.beforeStart === 0 ? 1 : 0 );
                  }
                  else {
                      self.refresh( self.beforeStart );
                  }
               }
               else {
                  // this is just a click, change the value
                  self.refresh( self.beforeStart === 0 ? 1 : 0 );
               }
            }

            self.mouseMoved = false;
            self._trigger( "stop" );
            return false;
         }
      };

      this._on( slider.add( document ), { "vmouseup": this._sliderMouseUp });
      slider.insertAfter( control );

      // Only add focus class to toggle switch, sliders get it automatically from ui-btn
      if ( cType === 'select' ) {
         this.handle.bind({
            focus: function() {
               slider.addClass( $.mobile.focusClass );
            },

            blur: function() {
               slider.removeClass( $.mobile.focusClass );
            }
         });
      }

      this.handle.bind({
         // NOTE force focus on handle
         vmousedown: function() {
            $( this ).focus();
         },

         vclick: false,

         keydown: function( event ) {
            var index = val();

            if ( self.options.disabled ) {
               return;
            }

            // In all cases prevent the default and mark the handle as active
            switch ( event.keyCode ) {
               case $.mobile.keyCode.HOME:
               case $.mobile.keyCode.END:
               case $.mobile.keyCode.PAGE_UP:
               case $.mobile.keyCode.PAGE_DOWN:
               case $.mobile.keyCode.UP:
               case $.mobile.keyCode.RIGHT:
               case $.mobile.keyCode.DOWN:
               case $.mobile.keyCode.LEFT:
                  event.preventDefault();

                  if ( !self._keySliding ) {
                     self._keySliding = true;
                     $( this ).addClass( "ui-state-active" );
                  }
                  break;
            }

            // move the slider according to the keypress
            switch ( event.keyCode ) {
               case $.mobile.keyCode.HOME:
                  self.refresh( min );
                  break;
               case $.mobile.keyCode.END:
                  self.refresh( max );
                  break;
               case $.mobile.keyCode.PAGE_UP:
               case $.mobile.keyCode.UP:
               case $.mobile.keyCode.RIGHT:
                  self.refresh( index + step );
                  break;
               case $.mobile.keyCode.PAGE_DOWN:
               case $.mobile.keyCode.DOWN:
               case $.mobile.keyCode.LEFT:
                  self.refresh( index - step );
                  break;
            }
         }, // remove active mark

         keyup: function( event ) {
            if ( self._keySliding ) {
               self._keySliding = false;
               $( this ).removeClass( "ui-state-active" );
            }
         }
         });

      this.refresh( undefined, undefined, true );
   },

   _checkedRefresh: function() {
      if( this.value != this._value() ){
         this.refresh( this._value() );
      }
   },

   _value: function() {
      return  this._type === "input" ?
         parseFloat( this.element.val() ) : this.element[0].selectedIndex;
   },

   refresh: function( val, isfromControl, preventInputUpdate ) {

      // NOTE: we don't return here because we want to support programmatic
      //       alteration of the input value, which should still update the slider
      if ( this.options.disabled || this.element.attr('disabled')) {
         this.disable();
      }

      // set the stored value for comparison later
      this.value = this._value();

      var control = this.element, percent,
         cType = control[0].nodeName.toLowerCase(),
         min = cType === "input" ? parseFloat( control.attr( "min" ) ) : 0,
         max = cType === "input" ? parseFloat( control.attr( "max" ) ) : control.find( "option" ).length - 1,
         step = ( cType === "input" && parseFloat( control.attr( "step" ) ) > 0 ) ? parseFloat( control.attr( "step" ) ) : 1;

      if ( typeof val === "object" ) {
         var data = val,
            // a slight tolerance helped get to the ends of the slider
            tol = 8;
         if ( !this.dragging ||
               data.pageX < this.slider.offset().left - tol ||
               data.pageX > this.slider.offset().left + this.slider.width() + tol ) {
            return;
         }
         percent = Math.round( ( ( data.pageX - this.slider.offset().left ) / this.slider.width() ) * 100 );
      } else {
         if ( val == null ) {
            val = cType === "input" ? parseFloat( control.val() || 0 ) : control[0].selectedIndex;
         }
         percent = ( parseFloat( val ) - min ) / ( max - min ) * 100;
      }

      if ( isNaN( percent ) ) {
         return;
      }

      if ( percent < 0 ) {
         percent = 0;
      }

      if ( percent > 100 ) {
         percent = 100;
      }

      var newval = ( percent / 100 ) * ( max - min ) + min;

      //from jQuery UI slider, the following source will round to the nearest step
      var valModStep = ( newval - min ) % step;
      var alignValue = newval - valModStep;

      if ( Math.abs( valModStep ) * 2 >= step ) {
         alignValue += ( valModStep > 0 ) ? step : ( -step );
      }
      // Since JavaScript has problems with large floats, round
      // the final value to 5 digits after the decimal point (see jQueryUI: #4124)
      newval = parseFloat( alignValue.toFixed(5) );

      if ( newval < min ) {
         newval = min;
      }

      if ( newval > max ) {
         newval = max;
      }

      this.handle.css( "left", percent + "%" );
      this.handle.attr( {
            "aria-valuenow": cType === "input" ? newval : control.find( "option" ).eq( newval ).attr( "value" ),
            "aria-valuetext": cType === "input" ? newval : control.find( "option" ).eq( newval ).getEncodedText(),
            title: cType === "input" ? newval : control.find( "option" ).eq( newval ).getEncodedText()
         });

      if ( this.valuebg ) {
         this.valuebg.css( "width", percent + "%" );
      }

      // drag the label widths
      if ( this._labels ) {
         var handlePercent = this.handle.width() / this.slider.width() * 100,
            aPercent = percent && handlePercent + ( 100 - handlePercent ) * percent / 100,
            bPercent = percent === 100 ? 0 : Math.min( handlePercent + 100 - aPercent, 100 );

         this._labels.each(function() {
            var ab = $( this ).is( ".ui-slider-label-a" );
            $( this ).width( ( ab ? aPercent : bPercent  ) + "%" );
         });
      }

      if ( !preventInputUpdate ) {
         var valueChanged = false;

         // update control"s value
         if ( cType === "input" ) {
            valueChanged = control.val() !== newval;
            control.val( newval );
         } else {
            valueChanged = control[ 0 ].selectedIndex !== newval;
            control[ 0 ].selectedIndex = newval;
         }
         if ( !isfromControl && valueChanged ) {
            control.trigger( "change" );
         }
      }
   },

   enable: function() {
      this.element.attr( "disabled", false );
      this.slider.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
      return this._setOption( "disabled", false );
   },

   disable: function() {
      this.element.attr( "disabled", true );
      this.slider.addClass( "ui-disabled" ).attr( "aria-disabled", true );
      return this._setOption( "disabled", true );
   }

});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.slider.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

(function( $, undefined ) {

$.widget( "mobile.selectmenu", $.mobile.widget, {
   options: {
      theme: null,
      disabled: false,
      icon: "arrow-d",
      iconpos: "right",
      inline: false,
      corners: true,
      shadow: true,
      iconshadow: true,
      overlayTheme: "a",
      hidePlaceholderMenuItems: true,
      closeText: "Close",
      nativeMenu: true,
      // This option defaults to true on iOS devices.
      preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
      initSelector: "select:not( :jqmData(role='slider') )",
      mini: false
   },

   _button: function() {
      return $( "<div/>" );
   },

   _setDisabled: function( value ) {
      this.element.attr( "disabled", value );
      this.button.attr( "aria-disabled", value );
      return this._setOption( "disabled", value );
   },

   _focusButton : function() {
      var self = this;

      setTimeout( function() {
         self.button.focus();
      }, 40);
   },

   _selectOptions: function() {
      return this.select.find( "option" );
   },

   // setup items that are generally necessary for select menu extension
   _preExtension: function() {
      var classes = "";
      // TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
      /* if ( $el[0].className.length ) {
         classes = $el[0].className;
      } */
      if ( !!~this.element[0].className.indexOf( "ui-btn-left" ) ) {
         classes =  " ui-btn-left";
      }

      if (  !!~this.element[0].className.indexOf( "ui-btn-right" ) ) {
         classes = " ui-btn-right";
      }

      this.select = this.element.wrap( "<div class='ui-select" + classes + "'>" );
      this.selectID  = this.select.attr( "id" );
      this.label = $( "label[for='"+ this.selectID +"']" ).addClass( "ui-select" );
      this.isMultiple = this.select[ 0 ].multiple;
      if ( !this.options.theme ) {
         this.options.theme = $.mobile.getInheritedTheme( this.select, "c" );
      }
   },

   _create: function() {
      this._preExtension();

      // Allows for extension of the native select for custom selects and other plugins
      // see select.custom for example extension
      // TODO explore plugin registration
      this._trigger( "beforeCreate" );

      this.button = this._button();

      var self = this,

         options = this.options,

         inline = options.inline || this.select.jqmData( "inline" ),
         mini = options.mini || this.select.jqmData( "mini" ),
         iconpos = options.icon ? ( options.iconpos || this.select.jqmData( "iconpos" ) ) : false,

         // IE throws an exception at options.item() function when
         // there is no selected item
         // select first in this case
         selectedIndex = this.select[ 0 ].selectedIndex === -1 ? 0 : this.select[ 0 ].selectedIndex,

         // TODO values buttonId and menuId are undefined here
         button = this.button
            .insertBefore( this.select )
            .buttonMarkup( {
               theme: options.theme,
               icon: options.icon,
               iconpos: iconpos,
               inline: inline,
               corners: options.corners,
               shadow: options.shadow,
               iconshadow: options.iconshadow,
               mini: mini
            });

      this.setButtonText();

      // Opera does not properly support opacity on select elements
      // In Mini, it hides the element, but not its text
      // On the desktop,it seems to do the opposite
      // for these reasons, using the nativeMenu option results in a full native select in Opera
      if ( options.nativeMenu && window.opera && window.opera.version ) {
         button.addClass( "ui-select-nativeonly" );
      }

      // Add counter for multi selects
      if ( this.isMultiple ) {
         this.buttonCount = $( "<span>" )
            .addClass( "ui-li-count ui-btn-up-c ui-btn-corner-all" )
            .hide()
            .appendTo( button.addClass('ui-li-has-count') );
      }

      // Disable if specified
      if ( options.disabled || this.element.attr('disabled')) {
         this.disable();
      }

      // Events on native select
      this.select.change(function() {
         self.refresh();
      });

      this.build();
   },

   build: function() {
      var self = this;

      this.select
         .appendTo( self.button )
         .bind( "vmousedown", function() {
            // Add active class to button
            self.button.addClass( $.mobile.activeBtnClass );
         })
         .bind( "focus", function() {
            self.button.addClass( $.mobile.focusClass );
         })
         .bind( "blur", function() {
            self.button.removeClass( $.mobile.focusClass );
         })
         .bind( "focus vmouseover", function() {
            self.button.trigger( "vmouseover" );
         })
         .bind( "vmousemove", function() {
            // Remove active class on scroll/touchmove
            self.button.removeClass( $.mobile.activeBtnClass );
         })
         .bind( "change blur vmouseout", function() {
            self.button.trigger( "vmouseout" )
               .removeClass( $.mobile.activeBtnClass );
         })
         .bind( "change blur", function() {
            self.button.removeClass( "ui-btn-down-" + self.options.theme );
         });

      // In many situations, iOS will zoom into the select upon tap, this prevents that from happening
      self.button.bind( "vmousedown", function() {
         if ( self.options.preventFocusZoom ) {
            $.mobile.zoom.disable( true );
         }
      }).bind( "mouseup", function() {
         if ( self.options.preventFocusZoom ) {
            setTimeout(function() {
               $.mobile.zoom.enable( true );
            }, 0);
         }
      });
   },

   selected: function() {
      return this._selectOptions().filter( ":selected" );
   },

   selectedIndices: function() {
      var self = this;

      return this.selected().map(function() {
         return self._selectOptions().index( this );
      }).get();
   },

   setButtonText: function() {
      var self = this,
         selected = this.selected(),
         text = this.placeholder,
         span = $( document.createElement( "span" ) );

      this.button.find( ".ui-btn-text" ).html(function() {
         if ( selected.length ) {
            text = selected.map(function() {
               return $( this ).text();
            }).get().join( ", " );
         } else {
            text = self.placeholder;
         }

         // TODO possibly aggregate multiple select option classes
         return span.text( text )
            .addClass( self.select.attr( "class" ) )
            .addClass( selected.attr( "class" ) );
      });
   },

   setButtonCount: function() {
      var selected = this.selected();

      // multiple count inside button
      if ( this.isMultiple ) {
         this.buttonCount[ selected.length > 1 ? "show" : "hide" ]().text( selected.length );
      }
   },

   refresh: function() {
      this.setButtonText();
      this.setButtonCount();
   },

   // open and close preserved in native selects
   // to simplify users code when looping over selects
   open: $.noop,
   close: $.noop,

   disable: function() {
      this._setDisabled( true );
      this.button.addClass( "ui-disabled" );
   },

   enable: function() {
      this._setDisabled( false );
      this.button.removeClass( "ui-disabled" );
   }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
   $.mobile.selectmenu.prototype.enhanceWithin( e.target, true );
});
})( jQuery );

/*
* custom "selectmenu" plugin
*/

(function( $, undefined ) {
   var extendSelect = function( widget ) {

      var select = widget.select,
         selectID  = widget.selectID,
         label = widget.label,
         thisPage = widget.select.closest( ".ui-page" ),
         selectOptions = widget._selectOptions(),
         isMultiple = widget.isMultiple = widget.select[ 0 ].multiple,
         buttonId = selectID + "-button",
         menuId = selectID + "-menu",
         menuPage = $( "<div data-" + $.mobile.ns + "role='dialog' data-" +$.mobile.ns + "theme='"+ widget.options.theme +"' data-" +$.mobile.ns + "overlay-theme='"+ widget.options.overlayTheme +"'>" +
            "<div data-" + $.mobile.ns + "role='header'>" +
            "<div class='ui-title'>" + label.getEncodedText() + "</div>"+
            "</div>"+
            "<div data-" + $.mobile.ns + "role='content'></div>"+
            "</div>" ),

         listbox =  $( "<div>", { "class": "ui-selectmenu" } ).insertAfter( widget.select ).popup( { theme: "a" } ),

         list = $( "<ul>", {
            "class": "ui-selectmenu-list",
            "id": menuId,
            "role": "listbox",
            "aria-labelledby": buttonId
         }).attr( "data-" + $.mobile.ns + "theme", widget.options.theme ).appendTo( listbox ),

         header = $( "<div>", {
            "class": "ui-header ui-bar-" + widget.options.theme
         }).prependTo( listbox ),

         headerTitle = $( "<h1>", {
            "class": "ui-title"
         }).appendTo( header ),

         menuPageContent,
         menuPageClose,
         headerClose;

      if ( widget.isMultiple ) {
         headerClose = $( "<a>", {
            "text": widget.options.closeText,
            "href": "#",
            "class": "ui-btn-left"
         }).attr( "data-" + $.mobile.ns + "iconpos", "notext" ).attr( "data-" + $.mobile.ns + "icon", "delete" ).appendTo( header ).buttonMarkup();
      }

      $.extend( widget, {
         select: widget.select,
         selectID: selectID,
         buttonId: buttonId,
         menuId: menuId,
         thisPage: thisPage,
         menuPage: menuPage,
         label: label,
         selectOptions: selectOptions,
         isMultiple: isMultiple,
         theme: widget.options.theme,
         listbox: listbox,
         list: list,
         header: header,
         headerTitle: headerTitle,
         headerClose: headerClose,
         menuPageContent: menuPageContent,
         menuPageClose: menuPageClose,
         placeholder: "",

         build: function() {
            var self = this;

            // Create list from select, update state
            self.refresh();

            self.select.attr( "tabindex", "-1" ).focus(function() {
               $( this ).blur();
               self.button.focus();
            });

            // Button events
            self.button.bind( "vclick keydown" , function( event ) {
               if (event.type === "vclick" ||
                     event.keyCode && (event.keyCode === $.mobile.keyCode.ENTER ||
                                                event.keyCode === $.mobile.keyCode.SPACE)) {

                  self.open();
                  event.preventDefault();
               }
            });

            // Events for list items
            self.list.attr( "role", "listbox" )
               .bind( "focusin", function( e ) {
                  $( e.target )
                     .attr( "tabindex", "0" )
                     .trigger( "vmouseover" );

               })
               .bind( "focusout", function( e ) {
                  $( e.target )
                     .attr( "tabindex", "-1" )
                     .trigger( "vmouseout" );
               })
               .delegate( "li:not(.ui-disabled, .ui-li-divider)", "click", function( event ) {

                  // index of option tag to be selected
                  var oldIndex = self.select[ 0 ].selectedIndex,
                     newIndex = self.list.find( "li:not(.ui-li-divider)" ).index( this ),
                     option = self._selectOptions().eq( newIndex )[ 0 ];

                  // toggle selected status on the tag for multi selects
                  option.selected = self.isMultiple ? !option.selected : true;

                  // toggle checkbox class for multiple selects
                  if ( self.isMultiple ) {
                     $( this ).find( ".ui-icon" )
                        .toggleClass( "ui-icon-checkbox-on", option.selected )
                        .toggleClass( "ui-icon-checkbox-off", !option.selected );
                  }

                  // trigger change if value changed
                  if ( self.isMultiple || oldIndex !== newIndex ) {
                     self.select.trigger( "change" );
                  }

                  // hide custom select for single selects only - otherwise focus clicked item
                  // We need to grab the clicked item the hard way, because the list may have been rebuilt
                  if ( self.isMultiple ) {
                     self.list.find( "li:not(.ui-li-divider)" ).eq( newIndex )
                        .addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
                  }
                  else {
                     self.close();
                  }

                  event.preventDefault();
               })
               .keydown(function( event ) {  //keyboard events for menu items
                  var target = $( event.target ),
                     li = target.closest( "li" ),
                     prev, next;

                  // switch logic based on which key was pressed
                  switch ( event.keyCode ) {
                     // up or left arrow keys
                  case 38:
                     prev = li.prev().not( ".ui-selectmenu-placeholder" );

                     if ( prev.is( ".ui-li-divider" ) ) {
                        prev = prev.prev();
                     }

                     // if there's a previous option, focus it
                     if ( prev.length ) {
                        target
                           .blur()
                           .attr( "tabindex", "-1" );

                        prev.addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
                     }

                     return false;
                     // down or right arrow keys
                  case 40:
                     next = li.next();

                     if ( next.is( ".ui-li-divider" ) ) {
                        next = next.next();
                     }

                     // if there's a next option, focus it
                     if ( next.length ) {
                        target
                           .blur()
                           .attr( "tabindex", "-1" );

                        next.addClass( "ui-btn-down-" + widget.options.theme ).find( "a" ).first().focus();
                     }

                     return false;
                     // If enter or space is pressed, trigger click
                  case 13:
                  case 32:
                     target.trigger( "click" );

                     return false;
                  }
               });

            // button refocus ensures proper height calculation
            // by removing the inline style and ensuring page inclusion
            self.menuPage.bind( "pagehide", function() {
               self.list.appendTo( self.listbox );
               self._focusButton();

               // TODO centralize page removal binding / handling in the page plugin.
               // Suggestion from @jblas to do refcounting
               //
               // TODO extremely confusing dependency on the open method where the pagehide.remove
               // bindings are stripped to prevent the parent page from disappearing. The way
               // we're keeping pages in the DOM right now sucks
               //
               // rebind the page remove that was unbound in the open function
               // to allow for the parent page removal from actions other than the use
               // of a dialog sized custom select
               //
               // doing this here provides for the back button on the custom select dialog
               $.mobile._bindPageRemove.call( self.thisPage );
            });

            // Events on the popup
            self.listbox.bind( "popupafterclose", function( event ) {
               self.close();
            });

            // Close button on small overlays
            if ( self.isMultiple ) {
               self.headerClose.click(function() {
                  if ( self.menuType === "overlay" ) {
                     self.close();
                     return false;
                  }
               });
            }

            // track this dependency so that when the parent page
            // is removed on pagehide it will also remove the menupage
            self.thisPage.addDependents( this.menuPage );
         },

         _isRebuildRequired: function() {
            var list = this.list.find( "li" ),
               options = this._selectOptions();

            // TODO exceedingly naive method to determine difference
            // ignores value changes etc in favor of a forcedRebuild
            // from the user in the refresh method
            return options.text() !== list.text();
         },

         selected: function() {
            return this._selectOptions().filter( ":selected:not( :jqmData(placeholder='true') )" );
         },

         refresh: function( forceRebuild , foo ) {
            var self = this,
            select = this.element,
            isMultiple = this.isMultiple,
            indicies;

            if (  forceRebuild || this._isRebuildRequired() ) {
               self._buildList();
            }

            indicies = this.selectedIndices();

            self.setButtonText();
            self.setButtonCount();

            self.list.find( "li:not(.ui-li-divider)" )
               .removeClass( $.mobile.activeBtnClass )
               .attr( "aria-selected", false )
               .each(function( i ) {

                  if ( $.inArray( i, indicies ) > -1 ) {
                     var item = $( this );

                     // Aria selected attr
                     item.attr( "aria-selected", true );

                     // Multiple selects: add the "on" checkbox state to the icon
                     if ( self.isMultiple ) {
                        item.find( ".ui-icon" ).removeClass( "ui-icon-checkbox-off" ).addClass( "ui-icon-checkbox-on" );
                     } else {
                        if ( item.is( ".ui-selectmenu-placeholder" ) ) {
                           item.next().addClass( $.mobile.activeBtnClass );
                        } else {
                           item.addClass( $.mobile.activeBtnClass );
                        }
                     }
                  }
               });
         },

         close: function() {
            if ( this.options.disabled || !this.isOpen ) {
               return;
            }

            var self = this;

            if ( self.menuType === "page" ) {
               // doesn't solve the possible issue with calling change page
               // where the objects don't define data urls which prevents dialog key
               // stripping - changePage has incoming refactor
               $.mobile.back();
            } else {
               self.listbox.popup( "close" );
               self.list.appendTo( self.listbox );
               self._focusButton();
            }

            // allow the dialog to be closed again
            self.isOpen = false;
         },

         open: function() {
            if ( this.options.disabled ) {
               return;
            }

            var self = this,
               $window = $( window ),
               selfListParent = self.list.parent(),
               menuHeight = selfListParent.outerHeight(),
               menuWidth = selfListParent.outerWidth(),
               activePage = $( "." + $.mobile.activePageClass ),
               scrollTop = $window.scrollTop(),
               btnOffset = self.button.offset().top,
               screenHeight = $window.height(),
               screenWidth = $window.width();

            //add active class to button
            self.button.addClass( $.mobile.activeBtnClass );

            //remove after delay
            setTimeout( function() {
               self.button.removeClass( $.mobile.activeBtnClass );
            }, 300);

            function focusMenuItem() {
               var selector = self.list.find( "." + $.mobile.activeBtnClass + " a" );
               if ( selector.length === 0 ) {
                  selector = self.list.find( "li.ui-btn:not( :jqmData(placeholder='true') ) a" );
               }
               selector.first().focus().closest( "li" ).addClass( "ui-btn-down-" + widget.options.theme );
            }

            if ( menuHeight > screenHeight - 80 || !$.support.scrollTop ) {

               self.menuPage.appendTo( $.mobile.pageContainer ).page();
               self.menuPageContent = menuPage.find( ".ui-content" );
               self.menuPageClose = menuPage.find( ".ui-header a" );

               // prevent the parent page from being removed from the DOM,
               // otherwise the results of selecting a list item in the dialog
               // fall into a black hole
               self.thisPage.unbind( "pagehide.remove" );

               //for WebOS/Opera Mini (set lastscroll using button offset)
               if ( scrollTop === 0 && btnOffset > screenHeight ) {
                  self.thisPage.one( "pagehide", function() {
                     $( this ).jqmData( "lastScroll", btnOffset );
                  });
               }

               self.menuPage.one( "pageshow", function() {
                  focusMenuItem();
                  self.isOpen = true;
               });

               self.menuType = "page";
               self.menuPageContent.append( self.list );
               self.menuPage.find("div .ui-title").text(self.label.text());
               $.mobile.changePage( self.menuPage, {
                  transition: $.mobile.defaultDialogTransition
               });
            } else {
               self.menuType = "overlay";

               self.listbox
                  .one( "popupafteropen", focusMenuItem )
                  .popup( "open", {
                     x: self.button.offset().left + self.button.outerWidth() / 2,
                     y: self.button.offset().top + self.button.outerHeight() / 2
                  });

               // duplicate with value set in page show for dialog sized selects
               self.isOpen = true;
            }
         },

         _buildList: function() {
            var self = this,
               o = this.options,
               placeholder = this.placeholder,
               needPlaceholder = true,
               optgroups = [],
               lis = [],
               dataIcon = self.isMultiple ? "checkbox-off" : "false";

            self.list.empty().filter( ".ui-listview" ).listview( "destroy" );

            var $options = self.select.find( "option" ),
               numOptions = $options.length,
               select = this.select[ 0 ],
               dataPrefix = 'data-' + $.mobile.ns,
               dataIndexAttr = dataPrefix + 'option-index',
               dataIconAttr = dataPrefix + 'icon',
               dataRoleAttr = dataPrefix + 'role',
               dataPlaceholderAttr = dataPrefix + 'placeholder',
               fragment = document.createDocumentFragment(),
               isPlaceholderItem = false,
               optGroup;

            for (var i = 0; i < numOptions;i++, isPlaceholderItem = false) {
               var option = $options[i],
                  $option = $( option ),
                  parent = option.parentNode,
                  text = $option.text(),
                  anchor  = document.createElement( 'a' ),
                  classes = [];

               anchor.setAttribute( 'href', '#' );
               anchor.appendChild( document.createTextNode( text ) );

               // Are we inside an optgroup?
               if ( parent !== select && parent.nodeName.toLowerCase() === "optgroup" ) {
                  var optLabel = parent.getAttribute( 'label' );
                  if ( optLabel !== optGroup ) {
                     var divider = document.createElement( 'li' );
                     divider.setAttribute( dataRoleAttr, 'list-divider' );
                     divider.setAttribute( 'role', 'option' );
                     divider.setAttribute( 'tabindex', '-1' );
                     divider.appendChild( document.createTextNode( optLabel ) );
                     fragment.appendChild( divider );
                     optGroup = optLabel;
                  }
               }

               if ( needPlaceholder && ( !option.getAttribute( "value" ) || text.length === 0 || $option.jqmData( "placeholder" ) ) ) {
                  needPlaceholder = false;
                  isPlaceholderItem = true;

                  // If we have identified a placeholder, mark it retroactively in the select as well
                  option.setAttribute( dataPlaceholderAttr, true );
                  if ( o.hidePlaceholderMenuItems ) {
                     classes.push( "ui-selectmenu-placeholder" );
                  }
                  if (!placeholder) {
                     placeholder = self.placeholder = text;
                  }
               }

               var item = document.createElement('li');
               if ( option.disabled ) {
                  classes.push( "ui-disabled" );
                  item.setAttribute('aria-disabled',true);
               }
               item.setAttribute( dataIndexAttr,i );
               item.setAttribute( dataIconAttr, dataIcon );
               if ( isPlaceholderItem ) {
                  item.setAttribute( dataPlaceholderAttr, true );
               }
               item.className = classes.join( " " );
               item.setAttribute( 'role', 'option' );
               anchor.setAttribute( 'tabindex', '-1' );
               item.appendChild( anchor );
               fragment.appendChild( item );
            }

            self.list[0].appendChild( fragment );

            // Hide header if it's not a multiselect and there's no placeholder
            if ( !this.isMultiple && !placeholder.length ) {
               this.header.hide();
            } else {
               this.headerTitle.text( this.placeholder );
            }

            // Now populated, create listview
            self.list.listview();
         },

         _button: function() {
            return $( "<a>", {
               "href": "#",
               "role": "button",
               // TODO value is undefined at creation
               "id": this.buttonId,
               "aria-haspopup": "true",

               // TODO value is undefined at creation
               "aria-owns": this.menuId
            });
         }
      });
   };

   // issue #3894 - core doesn't trigger events on disabled delegates
   $( document ).bind( "selectmenubeforecreate", function( event ) {
      var selectmenuWidget = $( event.target ).data( "selectmenu" );

      if ( !selectmenuWidget.options.nativeMenu &&
            selectmenuWidget.element.parents( ":jqmData(role='popup')" ).length === 0 ) {
         extendSelect( selectmenuWidget );
      }
   });
})( jQuery );

(function( $, undefined ) {


   $.widget( "mobile.fixedtoolbar", $.mobile.widget, {
      options: {
         visibleOnPageShow: true,
         disablePageZoom: true,
         transition: "slide", //can be none, fade, slide (slide maps to slideup or slidedown)
         fullscreen: false,
         tapToggle: true,
         tapToggleBlacklist: "a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .ui-popup",
         hideDuringFocus: "input, textarea, select",
         updatePagePadding: true,
         trackPersistentToolbars: true,

         // Browser detection! Weeee, here we go...
         // Unfortunately, position:fixed is costly, not to mention probably impossible, to feature-detect accurately.
         // Some tests exist, but they currently return false results in critical devices and browsers, which could lead to a broken experience.
         // Testing fixed positioning is also pretty obtrusive to page load, requiring injected elements and scrolling the window
         // The following function serves to rule out some popular browsers with known fixed-positioning issues
         // This is a plugin option like any other, so feel free to improve or overwrite it
         supportBlacklist: function() {
            var w = window,
               ua = navigator.userAgent,
               platform = navigator.platform,
               // Rendering engine is Webkit, and capture major version
               wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
               wkversion = !!wkmatch && wkmatch[ 1 ],
               ffmatch = ua.match( /Fennec\/([0-9]+)/ ),
               ffversion = !!ffmatch && ffmatch[ 1 ],
               operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ ),
               omversion = !!operammobilematch && operammobilematch[ 1 ];

            if(
               // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
               ( ( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534 ) ||
               // Opera Mini
               ( w.operamini && ({}).toString.call( w.operamini ) === "[object OperaMini]" ) ||
               ( operammobilematch && omversion < 7458 ) ||
               //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
               ( ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533 ) ||
               // Firefox Mobile before 6.0 -
               ( ffversion && ffversion < 6 ) ||
               // WebOS less than 3
               ( "palmGetResource" in window && wkversion && wkversion < 534 )   ||
               // MeeGo
               ( ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1 ) ) {
               return true;
            }

            return false;
         },
         initSelector: ":jqmData(position='fixed')"
      },

      _create: function() {

         var self = this,
            o = self.options,
            $el = self.element,
            tbtype = $el.is( ":jqmData(role='header')" ) ? "header" : "footer",
            $page = $el.closest( ".ui-page" );

         // Feature detecting support for
         if ( o.supportBlacklist() ) {
            self.destroy();
            return;
         }

         $el.addClass( "ui-"+ tbtype +"-fixed" );

         // "fullscreen" overlay positioning
         if ( o.fullscreen ) {
            $el.addClass( "ui-"+ tbtype +"-fullscreen" );
            $page.addClass( "ui-page-" + tbtype + "-fullscreen" );
         }
         // If not fullscreen, add class to page to set top or bottom padding
         else{
            $page.addClass( "ui-page-" + tbtype + "-fixed" );
         }

         self._addTransitionClass();
         self._bindPageEvents();
         self._bindToggleHandlers();
      },

      _addTransitionClass: function() {
         var tclass = this.options.transition;

         if ( tclass && tclass !== "none" ) {
            // use appropriate slide for header or footer
            if ( tclass === "slide" ) {
               tclass = this.element.is( ".ui-header" ) ? "slidedown" : "slideup";
            }

            this.element.addClass( tclass );
         }
      },

      _bindPageEvents: function() {
         var self = this,
            o = self.options,
            $el = self.element;

         //page event bindings
         // Fixed toolbars require page zoom to be disabled, otherwise usability issues crop up
         // This method is meant to disable zoom while a fixed-positioned toolbar page is visible
         $el.closest( ".ui-page" )
            .bind( "pagebeforeshow", function() {
               if ( o.disablePageZoom ) {
                  $.mobile.zoom.disable( true );
               }
               if ( !o.visibleOnPageShow ) {
                  self.hide( true );
               }
            } )
            .bind( "webkitAnimationStart animationstart updatelayout", function() {
               var thisPage = this;
               if ( o.updatePagePadding ) {
                  self.updatePagePadding( thisPage );
               }
            })
            .bind( "pageshow", function() {
               var thisPage = this;
               self.updatePagePadding( thisPage );
               if ( o.updatePagePadding ) {
                  $( window ).bind( "throttledresize." + self.widgetName, function() {
                     self.updatePagePadding( thisPage );
                  });
               }
            })
            .bind( "pagebeforehide", function( e, ui ) {
               if ( o.disablePageZoom ) {
                  $.mobile.zoom.enable( true );
               }
               if ( o.updatePagePadding ) {
                  $( window ).unbind( "throttledresize." + self.widgetName );
               }

               if ( o.trackPersistentToolbars ) {
                  var thisFooter = $( ".ui-footer-fixed:jqmData(id)", this ),
                     thisHeader = $( ".ui-header-fixed:jqmData(id)", this ),
                     nextFooter = thisFooter.length && ui.nextPage && $( ".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData( "id" ) + "')", ui.nextPage ) || $(),
                     nextHeader = thisHeader.length && ui.nextPage && $( ".ui-header-fixed:jqmData(id='" + thisHeader.jqmData( "id" ) + "')", ui.nextPage ) || $();

                     if ( nextFooter.length || nextHeader.length ) {

                        nextFooter.add( nextHeader ).appendTo( $.mobile.pageContainer );

                        ui.nextPage.one( "pageshow", function() {
                           nextFooter.add( nextHeader ).appendTo( this );
                        });
                     }
               }
            });
      },

      _visible: true,

      // This will set the content element's top or bottom padding equal to the toolbar's height
      updatePagePadding: function( tbPage ) {
         var $el = this.element,
            header = $el.is( ".ui-header" );

         // This behavior only applies to "fixed", not "fullscreen"
         if ( this.options.fullscreen ) { return; }

         tbPage = tbPage || $el.closest( ".ui-page" );
         $( tbPage ).css( "padding-" + ( header ? "top" : "bottom" ), $el.outerHeight() );
      },

      _useTransition: function( notransition ) {
         var $win = $( window ),
            $el = this.element,
            scroll = $win.scrollTop(),
            elHeight = $el.height(),
            pHeight = $el.closest( ".ui-page" ).height(),
            viewportHeight = $.mobile.getScreenHeight(),
            tbtype = $el.is( ":jqmData(role='header')" ) ? "header" : "footer";

         return !notransition &&
            ( this.options.transition && this.options.transition !== "none" &&
            (
               ( tbtype === "header" && !this.options.fullscreen && scroll > elHeight ) ||
               ( tbtype === "footer" && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight )
            ) || this.options.fullscreen
            );
      },

      show: function( notransition ) {
         var hideClass = "ui-fixed-hidden",
            $el = this.element;

         if ( this._useTransition( notransition ) ) {
            $el
               .removeClass( "out " + hideClass )
               .addClass( "in" );
         }
         else {
            $el.removeClass( hideClass );
         }
         this._visible = true;
      },

      hide: function( notransition ) {
         var hideClass = "ui-fixed-hidden",
            $el = this.element,
            // if it's a slide transition, our new transitions need the reverse class as well to slide outward
            outclass = "out" + ( this.options.transition === "slide" ? " reverse" : "" );

         if( this._useTransition( notransition ) ) {
            $el
               .addClass( outclass )
               .removeClass( "in" )
               .animationComplete(function() {
                  $el.addClass( hideClass ).removeClass( outclass );
               });
         }
         else {
            $el.addClass( hideClass ).removeClass( outclass );
         }
         this._visible = false;
      },

      toggle: function() {
         this[ this._visible ? "hide" : "show" ]();
      },

      _bindToggleHandlers: function() {
         var self = this,
            o = self.options,
            $el = self.element;

         // tap toggle
         $el.closest( ".ui-page" )
            .bind( "vclick", function( e ) {
               if ( o.tapToggle && !$( e.target ).closest( o.tapToggleBlacklist ).length ) {
                  self.toggle();
               }
            })
            .bind( "focusin focusout", function( e ) {
               if ( screen.width < 500 && $( e.target ).is( o.hideDuringFocus ) && !$( e.target ).closest( ".ui-header-fixed, .ui-footer-fixed" ).length ) {
                  self[ ( e.type === "focusin" && self._visible ) ? "hide" : "show" ]();
               }
            });
      },

      destroy: function() {
         this.element.removeClass( "ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden" );
         this.element.closest( ".ui-page" ).removeClass( "ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen" );
      }

   });

   //auto self-init widgets
   $( document )
      .bind( "pagecreate create", function( e ) {

         // DEPRECATED in 1.1: support for data-fullscreen=true|false on the page element.
         // This line ensures it still works, but we recommend moving the attribute to the toolbars themselves.
         if ( $( e.target ).jqmData( "fullscreen" ) ) {
            $( $.mobile.fixedtoolbar.prototype.options.initSelector, e.target ).not( ":jqmData(fullscreen)" ).jqmData( "fullscreen", true );
         }

         $.mobile.fixedtoolbar.prototype.enhanceWithin( e.target );
      });

})( jQuery );

(function( $, window ) {

   // This fix addresses an iOS bug, so return early if the UA claims it's something else.
   if ( !(/iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) ) {
      return;
   }

  var zoom = $.mobile.zoom,
      evt, x, y, z, aig;

  function checkTilt( e ) {
      evt = e.originalEvent;
      aig = evt.accelerationIncludingGravity;

      x = Math.abs( aig.x );
      y = Math.abs( aig.y );
      z = Math.abs( aig.z );

      // If portrait orientation and in one of the danger zones
    if ( !window.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ) {
         if ( zoom.enabled ) {
            zoom.disable();
         }
    } else if ( !zoom.enabled ) {
         zoom.enable();
    }
  }

  $( window )
      .bind( "orientationchange.iosorientationfix", zoom.enable )
      .bind( "devicemotion.iosorientationfix", checkTilt );

}( jQuery, this ));

(function( $, window, undefined ) {
   var   $html = $( "html" ),
         $head = $( "head" ),
         $window = $( window );

   //remove initial build class (only present on first pageshow)
   function hideRenderingClass() {
      $html.removeClass( "ui-mobile-rendering" );
   }

   // trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
   $( window.document ).trigger( "mobileinit" );

   // support conditions
   // if device support condition(s) aren't met, leave things as they are -> a basic, usable experience,
   // otherwise, proceed with the enhancements
   if ( !$.mobile.gradeA() ) {
      return;
   }

   // override ajaxEnabled on platforms that have known conflicts with hash history updates
   // or generally work better browsing in regular http for full page refreshes (BB5, Opera Mini)
   if ( $.mobile.ajaxBlacklist ) {
      $.mobile.ajaxEnabled = false;
   }

   // Add mobile, initial load "rendering" classes to docEl
   $html.addClass( "ui-mobile ui-mobile-rendering" );

   // This is a fallback. If anything goes wrong (JS errors, etc), or events don't fire,
   // this ensures the rendering class is removed after 5 seconds, so content is visible and accessible
   setTimeout( hideRenderingClass, 5000 );

   $.extend( $.mobile, {
      // find and enhance the pages in the dom and transition to the first page.
      initializePage: function() {
         // find present pages
         var $pages = $( ":jqmData(role='page'), :jqmData(role='dialog')" ),
            hash = $.mobile.path.parseLocation().hash.replace("#", ""),
            hashPage = document.getElementById( hash );

         // if no pages are found, create one with body's inner html
         if ( !$pages.length ) {
            $pages = $( "body" ).wrapInner( "<div data-" + $.mobile.ns + "role='page'></div>" ).children( 0 );
         }

         // add dialogs, set data-url attrs
         $pages.each(function() {
            var $this = $( this );

            // unless the data url is already set set it to the pathname
            if ( !$this.jqmData( "url" ) ) {
               $this.attr( "data-" + $.mobile.ns + "url", $this.attr( "id" ) || location.pathname + location.search );
            }
         });

         // define first page in dom case one backs out to the directory root (not always the first page visited, but defined as fallback)
         $.mobile.firstPage = $pages.first();

         // define page container
         $.mobile.pageContainer = $pages.first().parent().addClass( "ui-mobile-viewport" );

         // alert listeners that the pagecontainer has been determined for binding
         // to events triggered on it
         $window.trigger( "pagecontainercreate" );

         // cue page loading message
         $.mobile.showPageLoadingMsg();

         //remove initial build class (only present on first pageshow)
         hideRenderingClass();

         // if hashchange listening is disabled, there's no hash deeplink,
         // the hash is not valid (contains more than one # or does not start with #)
         // or there is no page with that hash, change to the first page in the DOM
         // Remember, however, that the hash can also be a path!
         if ( ! ( $.mobile.hashListeningEnabled &&
            $.mobile.path.isHashValid( location.hash ) &&
            ( $( hashPage ).is( ':jqmData(role="page")' ) ||
               $.mobile.path.isPath( hash ) ||
               hash === $.mobile.dialogHashKey ) ) ) {

            // Store the initial destination
            if ( $.mobile.path.isHashValid( location.hash ) ) {
               $.mobile.urlHistory.initialDst = hash.replace( "#", "" );
            }
            $.mobile.changePage( $.mobile.firstPage, { transition: "none", reverse: true, changeHash: false, fromHashChange: true } );
         }
         // otherwise, trigger a hashchange to load a deeplink
         else {
            $window.trigger( "hashchange", [ true ] );
         }
      }
   });

   // initialize events now, after mobileinit has occurred
   $.mobile.navreadyDeferred.resolve();

   // check which scrollTop value should be used by scrolling to 1 immediately at domready
   // then check what the scroll top is. Android will report 0... others 1
   // note that this initial scroll won't hide the address bar. It's just for the check.
   $(function() {
      window.scrollTo( 0, 1 );

      // if defaultHomeScroll hasn't been set yet, see if scrollTop is 1
      // it should be 1 in most browsers, but android treats 1 as 0 (for hiding addr bar)
      // so if it's 1, use 0 from now on
      $.mobile.defaultHomeScroll = ( !$.support.scrollTop || $( window ).scrollTop() === 1 ) ? 0 : 1;


      // TODO: Implement a proper registration mechanism with dependency handling in order to not have exceptions like the one below
      //auto self-init widgets for those widgets that have a soft dependency on others
      if ( $.fn.controlgroup ) {
         $( document ).bind( "pagecreate create", function( e ) {
            $( ":jqmData(role='controlgroup')", e.target )
               .jqmEnhanceable()
               .controlgroup({ excludeInvisible: false });
         });
      }

      //dom-ready inits
      if ( $.mobile.autoInitializePage ) {
         $.mobile.initializePage();
      }

      // window load event
      // hide iOS browser chrome on load
      $window.load( $.mobile.silentScroll );

      if ( !$.support.cssPointerEvents ) {
         // IE and Opera don't support CSS pointer-events: none that we use to disable link-based buttons
         // by adding the 'ui-disabled' class to them. Using a JavaScript workaround for those browser.
         // https://github.com/jquery/jquery-mobile/issues/3558

         $( document ).delegate( ".ui-disabled", "vclick",
            function( e ) {
               e.preventDefault();
               e.stopImmediatePropagation();
            }
         );
      }
   });
}( jQuery, this ));

}));
(function() {



}).call(this);

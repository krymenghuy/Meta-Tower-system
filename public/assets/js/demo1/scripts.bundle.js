"use strict";

/**
 * @class KApp
 */
let KTApp = new function(){
   this.initAbsoluteDropdown = function (context) {
        let dropdownMenu;

        if (!context) {
            return;
        }

        $('body').on('show.bs.dropdown', context, function (e) {
            dropdownMenu = $(e.target).find('.dropdown-menu');
            $('body').append(dropdownMenu.detach());
            dropdownMenu.css('display', 'block');
            dropdownMenu.position({
                'my': 'right top',
                'at': 'right bottom',
                'of': $(e.relatedTarget),
            });
        }).on('hide.bs.dropdown', context, function (e) {
            $(e.target).append(dropdownMenu.detach());
            dropdownMenu.hide();
        });
    }
}

//let KTApp = function () {
    /** @type {object} colors State colors **/
    //let colors = {};

    // let initTooltip = function (el) {
    //     let skin = el.data('skin') ? 'tooltip-' + el.data('skin') : '';
    //     let width = el.data('width') == 'auto' ? 'tooltop-auto-width' : '';
    //     let triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';
    //     let placement = el.data('placement') ? el.data('placement') : 'left';

    //     el.tooltip({
    //         trigger: triggerValue,
    //         template: '<div class="tooltip ' + skin + ' ' + width + '" role="tooltip">\
    //             <div class="arrow"></div>\
    //             <div class="tooltip-inner"></div>\
    //         </div>'
    //     });
    // }

//     let initTooltips = function () {
//         // init bootstrap tooltips
//         $('[data-toggle="kt-tooltip"]').each(function () {
//             initTooltip($(this));
//         });
//     }

//     let initPopover = function (el) {
//         let skin = el.data('skin') ? 'popover-' + el.data('skin') : '';
//         let triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';

//         el.popover({
//             trigger: triggerValue,
//             template: '\
//             <div class="popover ' + skin + '" role="tooltip">\
//                 <div class="arrow"></div>\
//                 <h3 class="popover-header"></h3>\
//                 <div class="popover-body"></div>\
//             </div>'
//         });
//     }

//     let initPopovers = function () {
//         // init bootstrap popover
//         $('[data-toggle="kt-popover"]').each(function () {
//             initPopover($(this));
//         });
//     }
  
    // let initScroll = function () {
    //     $('[data-scroll="true"]').each(function () {
    //         let el = $(this);
    //         KTUtil.scrollInit(this, {
    //             mobileNativeScroll: true,
    //             handleWindowResize: true,
    //             rememberPosition: (el.data('remember-position') == 'true' ? true : false),
    //             height: function () {
    //                 if (KTUtil.isInResponsiveRange('tablet-and-mobile') && el.data('mobile-height')) {
    //                     return el.data('mobile-height');
    //                 } else {
    //                     return el.data('height');
    //                 }
    //             }
    //         });
    //     });
    // }

    // let initAlerts = function () {
    //     // init bootstrap popover
    //     $('body').on('click', '[data-close=alert]', function () {
    //         $(this).closest('.alert').hide();
    //     });
    // }

    // let initSticky = function () {
    //     let sticky = new Sticky('[data-sticky="true"]');
    // }

    // let initAbsoluteDropdown = function (context) {
    //     let dropdownMenu;

    //     if (!context) {
    //         return;
    //     }

    //     $('body').on('show.bs.dropdown', context, function (e) {
    //         dropdownMenu = $(e.target).find('.dropdown-menu');
    //         $('body').append(dropdownMenu.detach());
    //         dropdownMenu.css('display', 'block');
    //         dropdownMenu.position({
    //             'my': 'right top',
    //             'at': 'right bottom',
    //             'of': $(e.relatedTarget),
    //         });
    //     }).on('hide.bs.dropdown', context, function (e) {
    //         $(e.target).append(dropdownMenu.detach());
    //         dropdownMenu.hide();
    //     });
    // }

    // let initAbsoluteDropdowns = function () {
    //     $('body').on('show.bs.dropdown', function (e) {
    //         if ($(e.target).find("[data-attach='body']").length === 0) {
    //             return;
    //         }

    //         let dropdownMenu = $(e.target).find('.dropdown-menu');

    //         $('body').append(dropdownMenu.detach());
    //         dropdownMenu.css('display', 'block');
    //         dropdownMenu.position({
    //             'my': 'right top',
    //             'at': 'right bottom',
    //             'of': $(e.relatedTarget)
    //         });
    //     });

    //     $('body').on('hide.bs.dropdown', function (e) {
    //         if ($(e.target).find("[data-attach='body']").length === 0) {
    //             return;
    //         }

    //         let dropdownMenu = $(e.target).find('.dropdown-menu');

    //         $(e.target).append(dropdownMenu.detach());
    //         dropdownMenu.hide();
    //     });
    // }

    // return {
    //     init: function (options) {
    //         if (options && options.colors) {
    //             colors = options.colors;
    //         }

    //         KTApp.initComponents();
    //     },
    //     initComponents: function () {
    //         initScroll();
    //         initTooltips();
    //         initPopovers();
    //         //initAlerts();
    //         //initPortlets();
    //         //initFileInput();
    //         //initSticky();
    //         //initAbsoluteDropdowns();
    //     },
    //     initTooltips: function () {
    //         initTooltips();
    //     },

    //     initTooltip: function (el) {
    //         initTooltip(el);
    //     },
    //     initPopovers: function () {
    //         initPopovers();
    //     },

    //     initPopover: function (el) {
    //         initPopover(el);
    //     }

//         //, initPortlet: function (el, options) {
//         //     initPortlet(el, options);
//         // },

//         // initPortlets: function () {
//         //     initPortlets();
//         // },

//         // initSticky: function () {
//         //     initSticky();
//         // },

//         // initAbsoluteDropdown: function (context) {
//         //     initAbsoluteDropdown(context);
//         // },

//         block: function (target, options) {
//             el = $(target);
//             options = $.extend(true, {
//                 opacity: 0.05,
//                 overlayColor: '#000000',
//                 type: '',
//                 size: '',
//                 state: 'brand',
//                 centerX: true,
//                 centerY: true,
//                 message: '',
//                 shadow: true,
//                 width: 'auto'
//             }, options);

//             let html;
//             let version = options.type ? 'kt-spinner--' + options.type : '';
//             let state = options.state ? 'kt-spinner--' + options.state : '';
//             let size = options.size ? 'kt-spinner--' + options.size : '';
//             let spinner = '<div class="kt-spinner ' + version + ' ' + state + ' ' + size + '"></div';

//             if (options.message && options.message.length > 0) {
//                 let classes = 'blockui ' + (options.shadow === false ? 'blockui' : '');

//                 html = '<div class="' + classes + '"><span>' + options.message + '</span><span>' + spinner + '</span></div>';

//                 let el = document.createElement('div');
//                 KTUtil.get('body').prepend(el);
//                 KTUtil.addClass(el, classes);
//                 el.innerHTML = '<span>' + options.message + '</span><span>' + spinner + '</span>';
//                 options.width = KTUtil.actualWidth(el) + 10;
//                 KTUtil.remove(el);

//                 if (target == 'body') {
//                     html = '<div class="' + classes + '" style="margin-left:-' + (options.width / 2) + 'px;"><span>' + options.message + '</span><span>' + spinner + '</span></div>';
//                 }
//             } else {
//                 html = spinner;
//             }

//             let params = {
//                 message: html,
//                 centerY: options.centerY,
//                 centerX: options.centerX,
//                 css: {
//                     top: '30%',
//                     left: '50%',
//                     border: '0',
//                     padding: '0',
//                     backgroundColor: 'none',
//                     width: options.width
//                 },
//                 overlayCSS: {
//                     backgroundColor: options.overlayColor,
//                     opacity: options.opacity,
//                     cursor: 'wait',
//                     zIndex: '10'
//                 },
//                 onUnblock: function () {
//                     if (el && el[0]) {
//                         KTUtil.css(el[0], 'position', '');
//                         KTUtil.css(el[0], 'zoom', '');
//                     }
//                 }
//             };

//             if (target == 'body') {
//                 params.css.top = '50%';
//                 $.blockUI(params);
//             } else {
//                 let el = $(target);
//                 el.block(params);
//             }
//         },

//         unblock: function (target) {
//             if (target && target != 'body') {
//                 $(target).unblock();
//             } else {
//                 $.unblockUI();
//             }
//         },

//         blockPage: function (options) {
//             return KTApp.block('body', options);
//         },

//         unblockPage: function () {
//             return KTApp.unblock('body');
//         },

//         progress: function (target, options) {
//             let skin = (options && options.skin) ? options.skin : 'light';
//             let alignment = (options && options.alignment) ? options.alignment : 'right';
//             let size = (options && options.size) ? 'kt-spinner--' + options.size : '';
//             let classes = 'kt-spinner ' + 'kt-spinner--' + skin + ' kt-spinner--' + alignment + ' kt-spinner--' + size;

//             KTApp.unprogress(target);

//             $(target).addClass(classes);
//             $(target).data('progress-classes', classes);
//         },

//         unprogress: function (target) {
//             $(target).removeClass($(target).data('progress-classes'));
//         },

//         getStateColor: function (name) {
//             return colors["state"][name];
//         },

//         getBaseColor: function (type, level) {
//             return colors["base"][type][level - 1];
//         }
//     };
//}

// // Initialize KTApp class on document ready
// window.addEventListener('DOMContentLoaded',()=>{
//     KTApp.init(KTAppOptions);
// });

"use strict";
/**
 * @class KTUtil  base utilize class that privides helper functions
 */
// Polyfill
// matches polyfill
this.Element && function (ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function (selector) {
            let node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && nodes[i] != node);
            return !!nodes[i];
        }
}(Element.prototype);

// closest polyfill
this.Element && function (ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
        function (selector) {
            let el = this;
            while (el.matches && !el.matches(selector)) el = el.parentNode;
            return el.matches ? el : null;
        }
}(Element.prototype);

// remove polyfill
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// matches polyfill
this.Element && function (ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        function (selector) {
            let node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && nodes[i] != node);
            return !!nodes[i];
        }
}(Element.prototype);

//
// requestAnimationFrame polyfill by Erik Möller.
//  With fixes from Paul Irish and Tino Zijdel
//
//  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
//
//  MIT license
//
(function () {
    let lastTime = 0;
    let vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            let id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                let argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function (argItem) {
                    let isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

// Global variables 
window.KTUtilElementDataStore = {};
window.KTUtilElementDataStoreID = 0;
window.KTUtilDelegatedEventHandlers = {};

let KTUtil = function () {
    let resizeHandlers = [];

    /** @type {object} breakpoints The device width breakpoints **/
    let breakpoints = {
        sm: 544, // Small screen / phone           
        md: 768, // Medium screen / tablet            
        lg: 1024, // Large screen / desktop        
        xl: 1200 // Extra large screen / wide desktop
    };

    /**
     * Handle window resize event with some 
     * delay to attach event handlers upon resize complete 
     */
    let _windowResizeHandler = function () {
        let _runResizeHandlers = function () {
            // reinitialize other subscribed elements
            for (let i = 0; i < resizeHandlers.length; i++) {
                let each = resizeHandlers[i];
                each.call();
            }
        };

        let timeout = false; // holder for timeout id
        let delay = 250; // delay after event is "complete" to run callback

        window.addEventListener('resize', function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                _runResizeHandlers();
            }, delay); // wait 50ms until window resize finishes.
        });
    };

    return {
        /**
         * Class main initializer.
         * @param {object} options.
         * @returns null
         */
        //main function to initiate the theme
        init: function (options) {
            if (options && options.breakpoints) {
                breakpoints = options.breakpoints;
            }

            _windowResizeHandler();
        },

        /**
         * Adds window resize event handler.
         * @param {function} callback function.
         */
        addResizeHandler: function (callback) {
            resizeHandlers.push(callback);
        },

        /**
         * Removes window resize event handler.
         * @param {function} callback function.
         */
        removeResizeHandler: function (callback) {
            for (let i = 0; i < resizeHandlers.length; i++) {
                if (callback === resizeHandlers[i]) {
                    delete resizeHandlers[i];
                }
            }
        },

        /**
         * Trigger window resize handlers.
         */
        runResizeHandlers: function () {
            _runResizeHandlers();
        },

        resize: function () {
            if (typeof (Event) === 'function') {
                // modern browsers
                window.dispatchEvent(new Event('resize'));
            } else {
                // for IE and other old browsers
                // causes deprecation warning on modern browsers
                let evt = window.document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            }
        },

        /**
         * Get GET parameter value from URL.
         * @param {string} paramName Parameter name.
         * @returns {string}  
         */
        getURLParam: function (paramName) {
            let searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }

            return null;
        },

        /**
         * Checks whether current device is mobile touch.
         * @returns {boolean}  
         */
        isMobileDevice: function () {
            return (this.getViewPort().width < this.getBreakpoint('lg') ? true : false);
        },

        /**
         * Checks whether current device is desktop.
         * @returns {boolean}  
         */
        isDesktopDevice: function () {
            return KTUtil.isMobileDevice() ? false : true;
        },

        /**
         * Gets browser window viewport size. Ref:
         * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
         * @returns {object}  
         */
        getViewPort: function () {
            let e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        /**
         * Checks whether given device mode is currently activated.
         * @param {string} mode Responsive mode name(e.g: desktop,
         *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}  
         */
        isInResponsiveRange: function (mode) {
            let breakpoint = this.getViewPort().width;

            if (mode == 'general') {
                return true;
            } else if (mode == 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode == 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode == 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode == 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode == 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            } else if (mode == 'minimal-desktop-and-below' && breakpoint <= this.getBreakpoint('xl')) {
                return true;
            }

            return false;
        },

        /**
         * Generates unique ID for give prefix.
         * @param {string} prefix Prefix for generated ID
         * @returns {boolean}  
         */
        getUniqueID: function (prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
         * Gets window width for give breakpoint mode.
         * @param {string} mode Responsive mode name(e.g: xl, lg, md, sm)
         * @returns {number}  
         */
        getBreakpoint: function (mode) {
            return breakpoints[mode];
        },

        /**
         * Checks whether object has property matchs given key path.
         * @param {object} obj Object contains values paired with given key path
         * @param {string} keys Keys path seperated with dots
         * @returns {object}  
         */
        isset: function (obj, keys) {
            let stone;

            keys = keys || '';

            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }

            keys = keys.split('.');

            do {
                if (obj === undefined) {
                    return false;
                }

                stone = keys.shift();

                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }

                obj = obj[stone];

            } while (keys.length);

            return true;
        },

        /**
         * Gets highest z-index of the given element parents
         * @param {object} el jQuery element object
         * @returns {number}  
         */
        getHighestZindex: function (el) {
            let elem = KTUtil.get(el),
                position, value;

            while (elem && elem !== document) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = KTUtil.css(elem, 'position');

                if (position === "absolute" || position === "relative" || position === "fixed") {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt(KTUtil.css(elem, 'z-index'));

                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }

                elem = elem.parentNode;
            }

            return null;
        },

        /**
         * Checks whether the element has any parent with fixed positionfreg
         * @param {object} el jQuery element object
         * @returns {boolean}  
         */
        hasFixedPositionedParent: function (el) {
            while (el && el !== document) {
                position = KTUtil.css(el, 'position');

                if (position === "fixed") {
                    return true;
                }

                el = el.parentNode;
            }

            return false;
        },

        /**
         * Simulates delay
         */
        sleep: function (milliseconds) {
            let start = new Date().getTime();
            for (let i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        },

        /**
         * Gets randomly generated integer value within given min and max range
         * @param {number} min Range start value
         * @param {number} max Range end value
         * @returns {number}
         */
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Checks whether Angular library is included
         * @returns {boolean}  
         */
        isAngularVersion: function () {
            return window.Zone !== undefined ? true : false;
        },

        // jQuery Workarounds

        // Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function (out) {
            out = out || {};

            for (let i = 1; i < arguments.length; i++) {
                let obj = arguments[i];

                if (!obj)
                    continue;

                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = KTUtil.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        },

        // extend:  $.extend({}, objA, objB); 
        extend: function (out) {
            out = out || {};

            for (let i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (let key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        },

        get: function (query) {
            let el;

            if (query === document) {
                return document;
            }

            if (!!(query && query.nodeType === 1)) {
                return query;
            }

            if (el = document.getElementById(query)) {
                return el;
            } else if (el = document.getElementsByTagName(query)) {
                return el[0];
            } else if (el = document.getElementsByClassName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        getByID: function (query) {
            if (!!(query && query.nodeType === 1)) {
                return query;
            }

            return document.getElementById(query);
        },

        getByTag: function (query) {
            let el;

            if (el = document.getElementsByTagName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        getByClass: function (query) {
            let el;

            if (el = document.getElementsByClassName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        /**
         * Checks whether the element has given classes
         * @param {object} el jQuery element object
         * @param {string} Classes string
         * @returns {boolean}  
         */
        hasClasses: function (el, classes) {
            if (!el) {
                return;
            }

            let classesArr = classes.split(" ");

            for (let i = 0; i < classesArr.length; i++) {
                if (KTUtil.hasClass(el, KTUtil.trim(classesArr[i])) == false) {
                    return false;
                }
            }

            return true;
        },

        hasClass: function (el, className) {
            if (!el) {
                return;
            }

            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        },

        addClass: function (el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            let classNames = className.split(' ');

            if (el.classList) {
                for (let i = 0; i < classNames.length; i++) {
                    if (classNames[i] && classNames[i].length > 0) {
                        el.classList.add(KTUtil.trim(classNames[i]));
                    }
                }
            } else if (!KTUtil.hasClass(el, className)) {
                for (let i = 0; i < classNames.length; i++) {
                    el.className += ' ' + KTUtil.trim(classNames[i]);
                }
            }
        },

        removeClass: function (el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            let classNames = className.split(' ');

            if (el.classList) {
                for (let i = 0; i < classNames.length; i++) {
                    el.classList.remove(KTUtil.trim(classNames[i]));
                }
            } else if (KTUtil.hasClass(el, className)) {
                for (let i = 0; i < classNames.length; i++) {
                    el.className = el.className.replace(new RegExp('\\b' + KTUtil.trim(classNames[i]) + '\\b', 'g'), '');
                }
            }
        },

        triggerCustomEvent: function (el, eventName, data) {
            if (window.CustomEvent) {
                let event = new CustomEvent(eventName, {
                    detail: data
                });
            } else {
                let event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            el.dispatchEvent(event);
        },

        triggerEvent: function (node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
            let doc;
            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9) {
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to fireEvent: " + node.id);
            }

            if (node.dispatchEvent) {
                // Gecko-style approach (now the standard) takes more work
                let eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                    case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                    case "mouseenter":
                    case "mouseleave":
                    case "mousedown":
                    case "mouseup":
                        eventClass = "MouseEvents";
                        break;

                    case "focus":
                    case "change":
                    case "blur":
                    case "select":
                        eventClass = "HTMLEvents";
                        break;

                    default:
                        throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                        break;
                }
                let event = doc.createEvent(eventClass);

                let bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                // The second parameter says go ahead with the default action
                node.dispatchEvent(event, true);
            } else if (node.fireEvent) {
                // IE-old school style
                let event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            }
        },

        index: function (elm) {
            elm = KTUtil.get(elm);
            let c = elm.parentNode.children, i = 0;
            for (; i < c.length; i++)
                if (c[i] == elm) return i;
        },

        trim: function (string) {
            return string.trim();
        },

        eventTriggered: function (e) {
            if (e.currentTarget.dataset.triggered) {
                return true;
            } else {
                e.currentTarget.dataset.triggered = true;

                return false;
            }
        },

        remove: function (el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        find: function (parent, query) {
            parent = KTUtil.get(parent);
            if (parent) {
                return parent.querySelector(query);
            }
        },

        findAll: function (parent, query) {
            parent = KTUtil.get(parent);
            if (parent) {
                return parent.querySelectorAll(query);
            }
        },

        insertAfter: function (el, referenceNode) {
            return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        },

        parents: function (elem, selector) {
            // Element.matches() polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                    Element.prototype.matchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.oMatchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    function (s) {
                        let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                            i = matches.length;
                        while (--i >= 0 && matches.item(i) !== this) { }
                        return i > -1;
                    };
            }

            // Set up a parent array
            let parents = [];

            // Push each parent element to the array
            for (; elem && elem !== document; elem = elem.parentNode) {
                if (selector) {
                    if (elem.matches(selector)) {
                        parents.push(elem);
                    }
                    continue;
                }
                parents.push(elem);
            }

            // Return our parent array
            return parents;
        },

        children: function (el, selector, log) {
            if (!el || !el.childNodes) {
                return null;
            }

            let result = [],i = 0,c=null;
            let l = el.childNodes.length;
             //nodeType =3 Text, 1 = Element
             let childNodes = el.childNodes;
             do{
               c = childNodes[i];
               if(!c) break;
                //console.error(c.nodeType +' | ' + c.textContent);
                if (c.nodeType == 1 && KTUtil.matches(c, selector, log)) {
                    result.push(c);
                }
               i++;
             }while(c);

            // for (let i; i < l; ++i) {
            //     let child = el.childNodes[i];
            //     alert(child.textContent);
            //     if (child.nodeType == 1 && KTUtil.matches(child, selector, log)) {
            //         result.push(child);
            //     }
            // }
            return result;
        },

        child: function (el, selector, log) {
            let children = KTUtil.children(el, selector, log);

            return children ? children[0] : null;
        },

        matches: function (el, selector, log) {
            let p = Element.prototype;
            let f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            if (el && el.tagName) {
                return f.call(el, selector);
            } else {
                return false;
            }
        },

        data: function (element) {
            element = KTUtil.get(element);

            return {
                set: function (name, data) {
                    if (element === undefined) {
                        return;
                    }

                    if (element.customDataTag === undefined) {
                        KTUtilElementDataStoreID++;
                        element.customDataTag = KTUtilElementDataStoreID;
                    }

                    if (KTUtilElementDataStore[element.customDataTag] === undefined) {
                        KTUtilElementDataStore[element.customDataTag] = {};
                    }

                    KTUtilElementDataStore[element.customDataTag][name] = data;
                },

                get: function (name) {
                    if (element === undefined) {
                        return;
                    }

                    if (element.customDataTag === undefined) {
                        return null;
                    }

                    return this.has(name) ? KTUtilElementDataStore[element.customDataTag][name] : null;
                },

                has: function (name) {
                    if (element === undefined) {
                        return false;
                    }

                    if (element.customDataTag === undefined) {
                        return false;
                    }

                    return (KTUtilElementDataStore[element.customDataTag] && KTUtilElementDataStore[element.customDataTag][name]) ? true : false;
                },

                remove: function (name) {
                    if (element && this.has(name)) {
                        delete KTUtilElementDataStore[element.customDataTag][name];
                    }
                }
            };
        },

        outerWidth: function (el, margin) {
            let width;

            if (margin === true) {
                let width = parseFloat(el.offsetWidth);
                width += parseFloat(KTUtil.css(el, 'margin-left')) + parseFloat(KTUtil.css(el, 'margin-right'));

                return parseFloat(width);
            } else {
                let width = parseFloat(el.offsetWidth);

                return width;
            }
        },

        offset: function (elem) {
            let rect, win;
            elem = KTUtil.get(elem);

            if (!elem) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error

            if (!elem.getClientRects().length) {
                return { top: 0, left: 0 };
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;

            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        height: function (el) {
            return KTUtil.css(el, 'height');
        },

        visible: function (el) {
            return !(el.offsetWidth === 0 && el.offsetHeight === 0);
        },

        attr: function (el, name, value) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },

        hasAttr: function (el, name) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            return el.getAttribute(name) ? true : false;
        },

        removeAttr: function (el, name) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },

        animate: function (from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            let easings = {};
            easings.linear = function (t, b, c, d) {
                return c * t / d + b;
            };

            easing = easings.linear;

            // Early bail out if called incorrectly
            if (typeof from !== 'number' ||
                typeof to !== 'number' ||
                typeof duration !== 'number' ||
                typeof update !== 'function') {
                return;
            }

            // Create mock done() function if necessary
            if (typeof done !== 'function') {
                done = function () { };
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            let rAF = window.requestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 50);
            };

            // Animation loop
            let canceled = false;
            let change = to - from;

            function loop(timestamp) {
                let time = (timestamp || +new Date()) - start;

                if (time >= 0) {
                    update(easing(time, from, change, duration));
                }
                if (time >= 0 && time >= duration) {
                    update(to);
                    done();
                } else {
                    rAF(loop);
                }
            }

            update(from);

            // Start animation loop
            let start = window.performance && window.performance.now ? window.performance.now() : +new Date();

            rAF(loop);
        },

        actualCss: function (el, prop, cache) {
            el = KTUtil.get(el);
            let css = '';

            if (el instanceof HTMLElement === false) {
                return;
            }

            if (!el.getAttribute('kt-hidden-' + prop) || cache === false) {
                let value;

                // the element is hidden so:
                // making the el block so we can meassure its height but still be hidden
                css = el.style.cssText;
                el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

                if (prop == 'width') {
                    value = el.offsetWidth;
                } else if (prop == 'height') {
                    value = el.offsetHeight;
                }

                el.style.cssText = css;

                // store it in cache
                el.setAttribute('kt-hidden-' + prop, value);

                return parseFloat(value);
            } else {
                // store it in cache
                return parseFloat(el.getAttribute('kt-hidden-' + prop));
            }
        },

        actualHeight: function (el, cache) {
            return KTUtil.actualCss(el, 'height', cache);
        },

        actualWidth: function (el, cache) {
            return KTUtil.actualCss(el, 'width', cache);
        },

        getScroll: function (element, method) {
            // The passed in `method` value should be 'Top' or 'Left'
            method = 'scroll' + method;
            return (element == window || element == document) ? (
                self[(method == 'scrollTop') ? 'pageYOffset' : 'pageXOffset'] ||
                (browserSupportsBoxModel && document.documentElement[method]) ||
                document.body[method]
            ) : element[method];
        },

        css: function (el, styleProp, value) {
            el = KTUtil.get(el);

            if (!el) {
                return;
            }

            if (value !== undefined) {
                el.style[styleProp] = value;
            } else {
                let value, defaultView = (el.ownerDocument || document).defaultView;
                // W3C standard way:
                if (defaultView && defaultView.getComputedStyle) {
                    // sanitize property name to css notation
                    // (hyphen separated words eg. font-Size)
                    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
                    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                } else if (el.currentStyle) { // IE
                    // sanitize property name to camelCase
                    styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
                        return letter.toUpperCase();
                    });
                    value = el.currentStyle[styleProp];
                    // convert other units to pixels on IE
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return (function (value) {
                            let oldLeft = el.style.left,
                                oldRsLeft = el.runtimeStyle.left;
                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = value || 0;
                            value = el.style.pixelLeft + "px";
                            el.style.left = oldLeft;
                            el.runtimeStyle.left = oldRsLeft;
                            return value;
                        })(value);
                    }
                    return value;
                }
            }
        },

        slide: function (el, dir, speed, callback, recalcMaxHeight) {
            if (!el || (dir == 'up' && KTUtil.visible(el) === false) || (dir == 'down' && KTUtil.visible(el) === true)) {
                return;
            }

            speed = (speed ? speed : 600);
            let calcHeight = KTUtil.actualHeight(el);
            let calcPaddingTop = false;
            let calcPaddingBottom = false;

            if (KTUtil.css(el, 'padding-top') && KTUtil.data(el).has('slide-padding-top') !== true) {
                KTUtil.data(el).set('slide-padding-top', KTUtil.css(el, 'padding-top'));
            }

            if (KTUtil.css(el, 'padding-bottom') && KTUtil.data(el).has('slide-padding-bottom') !== true) {
                KTUtil.data(el).set('slide-padding-bottom', KTUtil.css(el, 'padding-bottom'));
            }

            if (KTUtil.data(el).has('slide-padding-top')) {
                calcPaddingTop = parseInt(KTUtil.data(el).get('slide-padding-top'));
            }

            if (KTUtil.data(el).has('slide-padding-bottom')) {
                calcPaddingBottom = parseInt(KTUtil.data(el).get('slide-padding-bottom'));
            }

            if (dir == 'up') { // up          
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function (value) {
                        el.style.paddingTop = (calcPaddingTop - value) + 'px';
                    }, 'linear');
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function (value) {
                        el.style.paddingBottom = (calcPaddingBottom - value) + 'px';
                    }, 'linear');
                }

                KTUtil.animate(0, calcHeight, speed, function (value) {
                    el.style.height = (calcHeight - value) + 'px';
                }, 'linear', function () {
                    callback();
                    el.style.height = '';
                    el.style.display = 'none';
                });


            } else if (dir == 'down') { // down
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function (value) {
                        el.style.paddingTop = value + 'px';
                    }, 'linear', function () {
                        el.style.paddingTop = '';
                    });
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function (value) {
                        el.style.paddingBottom = value + 'px';
                    }, 'linear', function () {
                        el.style.paddingBottom = '';
                    });
                }

                KTUtil.animate(0, calcHeight, speed, function (value) {
                    el.style.height = value + 'px';
                }, 'linear', function () {
                    callback();
                    el.style.height = '';
                    el.style.display = '';
                    el.style.overflow = '';
                });
            }
        },

        slideUp: function (el, speed, callback) {
            KTUtil.slide(el, 'up', speed, callback);
        },

        slideDown: function (el, speed, callback) {
            KTUtil.slide(el, 'down', speed, callback);
        },

        show: function (el, display) {
            if (typeof el !== 'undefined') {
                el.style.display = (display ? display : 'block');
            }
        },

        hide: function (el) {
            if (typeof el !== 'undefined') {
                el.style.display = 'none';
            }
        },

        addEvent: function (el, type, handler, one) {
            el = KTUtil.get(el);
            if (typeof el !== 'undefined') {
                el.addEventListener(type, handler);
            }
        },

        removeEvent: function (el, type, handler) {
            el = KTUtil.get(el);
            el.removeEventListener(type, handler);
        },

        on: function (element, selector, event, handler) {
            if (!selector) {
                return;
            }

            let eventId = KTUtil.getUniqueID('event');

            KTUtilDelegatedEventHandlers[eventId] = function (e) {
                let targets = element.querySelectorAll(selector);
                let target = e.target;

                while (target && target !== element) {
                    for (let i = 0, j = targets.length; i < j; i++) {
                        if (target === targets[i]) {
                            handler.call(target, e);
                        }
                    }

                    target = target.parentNode;
                }
            }

            KTUtil.addEvent(element, event, KTUtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function (element, event, eventId) {
            if (!element || !KTUtilDelegatedEventHandlers[eventId]) {
                return;
            }

            KTUtil.removeEvent(element, event, KTUtilDelegatedEventHandlers[eventId]);

            delete KTUtilDelegatedEventHandlers[eventId];
        },

        one: function onetime(el, type, callback) {
            el = KTUtil.get(el);

            el.addEventListener(type, function callee(e) {
                // remove event
                if (e.target && e.target.removeEventListener) {
                    e.target.removeEventListener(e.type, callee);
                }

                // call handler
                return callback(e);
            });
        },

        hash: function (str) {
            let hash = 0,
                i, chr;

            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        },

        animateClass: function (el, animationName, callback) {
            let animation;
            let animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd',
            };

            for (let t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.addClass(el, 'animated ' + animationName);

            KTUtil.one(el, animation, function () {
                KTUtil.removeClass(el, 'animated ' + animationName);
            });

            if (callback) {
                KTUtil.one(el, animation, callback);
            }
        },

        transitionEnd: function (el, callback) {
            let transition;
            let transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'mozTransitionEnd',
                WebkitTransition: 'webkitTransitionEnd',
                msTransition: 'msTransitionEnd'
            };

            for (let t in transitions) {
                if (el.style[t] !== undefined) {
                    transition = transitions[t];
                }
            }

            KTUtil.one(el, transition, callback);
        },

        animationEnd: function (el, callback) {
            let animation;
            let animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd'
            };

            for (let t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.one(el, animation, callback);
        },

        animateDelay: function (el, value) {
            let vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (let i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-delay', value);
            }
        },

        animateDuration: function (el, value) {
            let vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (let i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-duration', value);
            }
        },

        scrollTo: function (target, offset, duration=500) {
            duration = duration ? duration : 500;
            target = KTUtil.get(target);
            let targetPos = target ? KTUtil.offset(target).top : 0;
            let scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            let from, to;

            if (targetPos > scrollPos) {
                from = targetPos;
                to = scrollPos;
            } else {
                from = scrollPos;
                to = targetPos;
            }

            if (offset) {
                to += offset;
            }

            KTUtil.animate(from, to, duration, function (value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },

        scrollTop: function (offset, duration) {
            KTUtil.scrollTo(null, offset, duration);
        },

        isArray: function (obj) {
            return obj && Array.isArray(obj);
        },

        ready: function (callback) {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        },

        isEmpty: function (obj) {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        },

        numberString: function (nStr) {
            nStr += '';
            let x = nStr.split('.');
            let x1 = x[0];
            let x2 = x.length > 1 ? '.' + x[1] : '';
            let rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        detectIE: function () {
            let ua = window.navigator.userAgent;

            // Test values; Uncomment to check result …

            // IE 10
            // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

            // IE 11
            // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

            // Edge 12 (Spartan)
            // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

            // Edge 13
            // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

            let msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            let trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                let rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            let edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        },

        isRTL: function () {
            return (KTUtil.attr(KTUtil.get('html'), 'direction') == 'rtl');
        },

        // 

        // Scroller
        scrollInit: function (element, options) {
            if (!element) return;
            // Define init function
            function init() {
                let ps;
                let height;

                if (options.height instanceof Function) {
                    height = parseInt(options.height.call());
                } else {
                    height = parseInt(options.height);
                }

                // Destroy scroll on table and mobile modes
                if ((options.mobileNativeScroll || options.disableForMobile) && KTUtil.isInResponsiveRange('tablet-and-mobile')) {
                    if (ps = KTUtil.data(element).get('ps')) {
                        if (options.resetHeightOnDestroy) {
                            KTUtil.css(element, 'height', 'auto');
                        } else {
                            KTUtil.css(element, 'overflow', 'auto');
                            if (height > 0) {
                                KTUtil.css(element, 'height', height + 'px');
                            }
                        }

                        ps.destroy();
                        ps = KTUtil.data(element).remove('ps');
                    } else if (height > 0) {
                        KTUtil.css(element, 'overflow', 'auto');
                        KTUtil.css(element, 'height', height + 'px');
                    }

                    return;
                }

                if (height > 0) {
                    KTUtil.css(element, 'height', height + 'px');
                }

                if (options.desktopNativeScroll) {
                    KTUtil.css(element, 'overflow', 'auto');
                    return;
                }

                // Init scroll
                KTUtil.css(element, 'overflow', 'hidden');

                if (ps = KTUtil.data(element).get('ps')) {
                    ps.update();
                } else {
                    KTUtil.addClass(element, 'kt-scroll');
                    ps = new PerfectScrollbar(element, {
                        wheelSpeed: 0.5,
                        swipeEasing: true,
                        wheelPropagation: (options.windowScroll === false ? false : true),
                        minScrollbarLength: 40,
                        maxScrollbarLength: 300,
                        suppressScrollX: KTUtil.attr(element, 'data-scroll-x') != 'true' ? true : false
                    });

                    KTUtil.data(element).set('ps', ps);
                }

                // Remember scroll position in cookie
                let uid = KTUtil.attr(element, 'id');

                if (options.rememberPosition === true && Cookies && uid) {
                    if (Cookies.get(uid)) {
                        let pos = parseInt(Cookies.get(uid));

                        if (pos > 0) {
                            element.scrollTop = pos;
                        }
                    }

                    element.addEventListener('ps-scroll-y', function () {
                        Cookies.set(uid, element.scrollTop);
                    });
                }
            }

            // Init
            init();

            // Handle window resize
            if (options.handleWindowResize) {
                KTUtil.addResizeHandler(function () {
                    init();
                });
            }
        },

        scrollUpdate: function (element) {
            let ps;
            if (ps = KTUtil.data(element).get('ps')) {
                ps.update();
            }
        },

        scrollUpdateAll: function (parent) {
            let scrollers = KTUtil.findAll(parent, '.ps');
            for (let i = 0, len = scrollers.length; i < len; i++) {
                KTUtil.scrollerUpdate(scrollers[i]);
            }
        },

        scrollDestroy: function (element) {
            let ps;
            if (ps = KTUtil.data(element).get('ps')) {
                ps.destroy();
                ps = KTUtil.data(element).remove('ps');
            }
        },

        setHTML: function (el, html) {
            if (KTUtil.get(el)) {
                KTUtil.get(el).innerHTML = html;
            }
        },

        getHTML: function (el) {
            if (KTUtil.get(el)) {
                return KTUtil.get(el).innerHTML;
            }
        }
    }
}();

// Initialize KTUtil class on document ready
KTUtil.ready(function () {
    KTUtil.init();
});

// CSS3 Transitions only after page load(.kt-page-loading class added to body tag and remove with JS on page load)
window.onload = function () {
    KTUtil.removeClass(KTUtil.get('body'), 'kt-page--loading');
}
// plugin setup
let KTAvatar = function (elementId, options) {
    // Main object
    let the = this;
    let init = false;

    // Get element object
    let element = KTUtil.get(elementId);
    let body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    let defaultOptions = {
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Construct
         */

        construct: function (options) {
            if (KTUtil.data(element).has('avatar')) {
                the = KTUtil.data(element).get('avatar');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('avatar', the);
            }

            return the;
        },

        /**
         * Init avatar
         */
        init: function (options) {
            the.element = element;
            the.events = [];

            the.input = KTUtil.find(element, 'input[type="file"]');
            the.holder = KTUtil.find(element, '.kt-avatar__holder');
            the.cancel = KTUtil.find(element, '.kt-avatar__cancel');
            the.src = KTUtil.css(the.holder, 'backgroundImage');

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Build Form Wizard
         */
        build: function () {
            // Handle avatar change
            KTUtil.addEvent(the.input, 'change', function (e) {
                e.preventDefault();

                if (the.input && the.input.files && the.input.files[0]) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        KTUtil.css(the.holder, 'background-image', 'url(' + e.target.result + ')');
                    }
                    reader.readAsDataURL(the.input.files[0]);

                    KTUtil.addClass(the.element, 'kt-avatar--changed');
                }
            });

            // Handle avatar cancel
            KTUtil.addEvent(the.cancel, 'click', function (e) {
                e.preventDefault();

                KTUtil.removeClass(the.element, 'kt-avatar--changed');
                KTUtil.css(the.holder, 'background-image', the.src);
                the.input.value = "";
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function (name) {
            //KTUtil.triggerCustomEvent(name);
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the);
                        }
                    } else {
                        event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function (name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function (options) {
        defaultOptions = options;
    };

    /**
     * Attach event
     */
    the.on = function (name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function (name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};
  
"use strict";
let KTHeader = function (elementId, options) {
    // Main object
    let the = this;
    let init = false;

    // Get element object
    let element = KTUtil.get(elementId);
    let body = KTUtil.get('body');

    if (element === undefined) {
        return;
    }

    // Default options
    let defaultOptions = {
        classic: false,
        offset: {
            mobile: 150,
            desktop: 200
        },
        minimize: {
            mobile: false,
            desktop: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {KTHeader}
         */
        construct: function (options) {
            if (KTUtil.data(element).has('header')) {
                the = KTUtil.data(element).get('header');
            } else {
                // reset header
                Plugin.init(options);

                // build header
                Plugin.build();

                KTUtil.data(element).set('header', the);
            }

            return the;
        },

        /**
         * Handles subheader click toggle
         * @returns {KTHeader}
         */
        init: function (options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Reset header
         * @returns {KTHeader}
         */
        build: function () {
            let lastScrollTop = 0;
            let eventTriggerState = true;
            let viewportHeight = KTUtil.getViewPort().height;

            if (the.options.minimize.mobile === false && the.options.minimize.desktop === false) {
                return;
            }

            window.addEventListener('scroll', function () {
                let offset = 0, on, off, st;

                if (KTUtil.isInResponsiveRange('desktop')) {
                    offset = the.options.offset.desktop;
                    on = the.options.minimize.desktop.on;
                    off = the.options.minimize.desktop.off;
                } else if (KTUtil.isInResponsiveRange('tablet-and-mobile')) {
                    offset = the.options.offset.mobile;
                    on = the.options.minimize.mobile.on;
                    off = the.options.minimize.mobile.off;
                }

                st = window.pageYOffset;

                if (
                    (KTUtil.isInResponsiveRange('tablet-and-mobile') && the.options.classic && the.options.classic.mobile) ||
                    (KTUtil.isInResponsiveRange('desktop') && the.options.classic && the.options.classic.desktop)

                ) {
                    if (st > offset) { // down scroll mode
                        KTUtil.addClass(body, on);
                        KTUtil.removeClass(body, off);

                        if (eventTriggerState) {
                            Plugin.eventTrigger('minimizeOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        KTUtil.addClass(body, off);
                        KTUtil.removeClass(body, on);

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('minimizeOff', the);
                            eventTriggerState = true;
                        }
                    }
                } else {
                    if (st > offset && lastScrollTop < st) { // down scroll mode
                        KTUtil.addClass(body, on);
                        KTUtil.removeClass(body, off);

                        if (eventTriggerState) {
                            Plugin.eventTrigger('minimizeOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        KTUtil.addClass(body, off);
                        KTUtil.removeClass(body, on);

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('minimizeOff', the);
                            eventTriggerState = true;
                        }
                    }

                    lastScrollTop = st;
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function (name, args) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the, args);
                        }
                    } else {
                        event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function (name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function (options) {
        defaultOptions = options;
    };

    /**
     * Register event
     */
    the.on = function (name, handler) {
        return Plugin.addEvent(name, handler);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

"use strict";
let KTMenu = function (elementId, options) {
    // Main object
    let the = this;
    let init = false;

    // Get element object
    let element = KTUtil.get(elementId);
    let body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    let defaultOptions = {
        // scrollable area with Perfect Scroll
        scroll: {
            rememberPosition: false
        },

        // accordion submenu mode
        accordion: {
            slideSpeed: 300, // accordion toggle slide speed in milliseconds
            autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
            autoScrollSpeed: 1200,
            expandAll: true // allow having multiple expanded accordions in the menu
        },

        // dropdown submenu mode
        dropdown: {
            timeout: 500 // timeout in milliseconds to show and hide the hoverable submenu dropdown
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {KTMenu}
         */
        construct: function (options) {
            if (KTUtil.data(element).has('menu')) {
                the = KTUtil.data(element).get('menu');
            } else {
                // reset menu
                Plugin.init(options);

                // reset menu
                Plugin.reset();

                // build menu
                Plugin.build();

                KTUtil.data(element).set('menu', the);
            }

            return the;
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        init: function (options) {
            the.events = [];

            the.eventHandlers = {};

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

            the.uid = KTUtil.getUniqueID();
        },

        update: function (options) {
            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

            // reset menu
            Plugin.reset();

            the.eventHandlers = {};

            // build menu
            Plugin.build();

            KTUtil.data(element).set('menu', the);
        },

        reload: function () {
            // reset menu
            Plugin.reset();

            // build menu
            Plugin.build();

            // reset submenu props
            Plugin.resetSubmenuProps();
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        build: function () {
            // General accordion submenu toggle
            the.eventHandlers['event_1'] = KTUtil.on(element, '.kt-menu__toggle', 'click', Plugin.handleSubmenuAccordion);

            // Dropdown mode(hoverable)
            if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {
                // dropdown submenu - hover toggle
                the.eventHandlers['event_2'] = KTUtil.on(element, '[data-ktmenu-submenu-toggle="hover"]', 'mouseover', Plugin.handleSubmenuDrodownHoverEnter);
                the.eventHandlers['event_3'] = KTUtil.on(element, '[data-ktmenu-submenu-toggle="hover"]', 'mouseout', Plugin.handleSubmenuDrodownHoverExit);

                // dropdown submenu - click toggle
                the.eventHandlers['event_4'] = KTUtil.on(element, '[data-ktmenu-submenu-toggle="click"] > .kt-menu__toggle, [data-ktmenu-submenu-toggle="click"] > .kt-menu__link .kt-menu__toggle', 'click', Plugin.handleSubmenuDropdownClick);
                the.eventHandlers['event_5'] = KTUtil.on(element, '[data-ktmenu-submenu-toggle="tab"] > .kt-menu__toggle, [data-ktmenu-submenu-toggle="tab"] > .kt-menu__link .kt-menu__toggle', 'click', Plugin.handleSubmenuDropdownTabClick);
            }

            // handle link click
            the.eventHandlers['event_6'] = KTUtil.on(element, '.kt-menu__item > .kt-menu__link:not(.kt-menu__toggle):not(.kt-menu__link--toggle-skip)', 'click', Plugin.handleLinkClick);

            // Init scrollable menu
            if (the.options.scroll && the.options.scroll.height) {
                Plugin.scrollInit();
            }
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        reset: function () {
            KTUtil.off(element, 'click', the.eventHandlers['event_1']);

            // dropdown submenu - hover toggle
            KTUtil.off(element, 'mouseover', the.eventHandlers['event_2']);
            KTUtil.off(element, 'mouseout', the.eventHandlers['event_3']);

            // dropdown submenu - click toggle
            KTUtil.off(element, 'click', the.eventHandlers['event_4']);
            KTUtil.off(element, 'click', the.eventHandlers['event_5']);

            // handle link click
            KTUtil.off(element, 'click', the.eventHandlers['event_6']);
        },

        /**
         * Init scroll menu
         *
        */
        scrollInit: function () {
            if (the.options.scroll && the.options.scroll.height) {
                KTUtil.scrollDestroy(element);
                KTUtil.scrollInit(element, { mobileNativeScroll: true, windowScroll: false, resetHeightOnDestroy: true, handleWindowResize: true, height: the.options.scroll.height, rememberPosition: the.options.scroll.rememberPosition });
            } else {
                KTUtil.scrollDestroy(element);
            }
        },

        /**
         * Update scroll menu
        */
        scrollUpdate: function () {
            if (the.options.scroll && the.options.scroll.height) {
                KTUtil.scrollUpdate(element);
            }
        },

        /**
         * Scroll top
        */
        scrollTop: function () {
            if (the.options.scroll && the.options.scroll.height) {
                KTUtil.scrollTop(element);
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        getSubmenuMode: function (el) {
            if (KTUtil.isInResponsiveRange('desktop')) {
                if (el && KTUtil.hasAttr(el, 'data-ktmenu-submenu-toggle') && KTUtil.attr(el, 'data-ktmenu-submenu-toggle') == 'hover') {
                    return 'dropdown';
                }

                if (KTUtil.isset(the.options.submenu, 'desktop.state.body')) {
                    if (KTUtil.hasClasses(body, the.options.submenu.desktop.state.body)) {
                        return the.options.submenu.desktop.state.mode;
                    } else {
                        return the.options.submenu.desktop.default;
                    }
                } else if (KTUtil.isset(the.options.submenu, 'desktop')) {
                    return the.options.submenu.desktop;
                }
            } else if (KTUtil.isInResponsiveRange('tablet') && KTUtil.isset(the.options.submenu, 'tablet')) {
                return the.options.submenu.tablet;
            } else if (KTUtil.isInResponsiveRange('mobile') && KTUtil.isset(the.options.submenu, 'mobile')) {
                return the.options.submenu.mobile;
            } else {
                return false;
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        isConditionalSubmenuDropdown: function () {
            if (KTUtil.isInResponsiveRange('desktop') && KTUtil.isset(the.options.submenu, 'desktop.state.body')) {
                return true;
            } else {
                return false;
            }
        },


        /**
         * Reset submenu attributes
         * @returns {KTMenu}
         */
        resetSubmenuProps: function (e) {
            let submenus = KTUtil.findAll(element, '.kt-menu__submenu');
            if (submenus) {
                for (let i = 0, len = submenus.length; i < len; i++) {
                    KTUtil.css(submenus[0], 'display', '');
                    KTUtil.css(submenus[0], 'overflow', '');
                }
            }
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverEnter: function (e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }

            if (the.resumeDropdownHover() === false) {
                return;
            }

            let item = this;

            if (item.getAttribute('data-hover') == '1') {
                item.removeAttribute('data-hover');
                clearTimeout(item.getAttribute('data-timeout'));
                item.removeAttribute('data-timeout');
                //Plugin.hideSubmenuDropdown(item, false);
            }

            // console.log('test!');

            Plugin.showSubmenuDropdown(item);
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverExit: function (e) {
            if (the.resumeDropdownHover() === false) {
                return;
            }

            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }

            let item = this;
            let time = the.options.dropdown.timeout;

            let timeout = setTimeout(function () {
                if (item.getAttribute('data-hover') == '1') {
                    Plugin.hideSubmenuDropdown(item, true);
                }
            }, time);

            item.setAttribute('data-hover', '1');
            item.setAttribute('data-timeout', timeout);
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClick: function (e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }

            let item = this.closest('.kt-menu__item');

            if (item.getAttribute('data-ktmenu-submenu-mode') == 'accordion') {
                return;
            }

            // if ( KTUtil.hasClass(item, 'kt-menu__item--hover') === false ) {
            //     KTUtil.addClass(item, 'kt-menu__item--open-dropdown');
            //     Plugin.showSubmenuDropdown(item);
            // } else {
            //     KTUtil.removeClass(item, 'kt-menu__item--open-dropdown' );
            //     Plugin.hideSubmenuDropdown(item, true);
            // }

            e.preventDefault();
        },

        /**
         * Handles tab click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownTabClick: function (e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }

            let item = this.closest('.kt-menu__item');

            if (item.getAttribute('data-ktmenu-submenu-mode') == 'accordion') {
                return;
            }

            if (KTUtil.hasClass(item, 'kt-menu__item--hover') == false) {
                KTUtil.addClass(item, 'kt-menu__item--open-dropdown');
                Plugin.showSubmenuDropdown(item);
            }

            e.preventDefault();
        },

        /**
         * Handles link click
         * @returns {KTMenu}
         */
        handleLinkClick: function (e) {
            let submenu = this.closest('.kt-menu__item.kt-menu__item--submenu'); //

            let result = Plugin.eventTrigger('linkClick', this, e);
            if (result === false) {
                return;
            }

            if (submenu && Plugin.getSubmenuMode(submenu) === 'dropdown') {
                Plugin.hideSubmenuDropdowns();
            }
        },

        /**
         * Handles submenu dropdown close on link click
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClose: function (e, el) {
            // exit if its not submenu dropdown mode
            if (Plugin.getSubmenuMode(el) === 'accordion') {
                return;
            }

            let shown = element.querySelectorAll('.kt-menu__item.kt-menu__item--submenu.kt-menu__item--hover:not(.kt-menu__item--tabs)');

            // check if currently clicked link's parent item ha
            if (shown.length > 0 && KTUtil.hasClass(el, 'kt-menu__toggle') === false && el.querySelectorAll('.kt-menu__toggle').length === 0) {
                // close opened dropdown menus
                for (let i = 0, len = shown.length; i < len; i++) {
                    Plugin.hideSubmenuDropdown(shown[0], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        handleSubmenuAccordion: function (e, el) {
            let query;
            let item = el ? el : this;
            if (Plugin.getSubmenuMode(el) === 'dropdown' && (query == item.closest('.kt-menu__item'))) {
            
                if (query.getAttribute('data-ktmenu-submenu-mode') != 'accordion') {
                    e.preventDefault();
                    return;
                }
            }
 
            let li = item.closest('.kt-menu__item');
            let submenu = KTUtil.child(li, '.kt-menu__submenu, .kt-menu__inner');

            if (KTUtil.hasClass(item.closest('.kt-menu__item'), 'kt-menu__item--open-always')) {
                return;
            }

            if (li && submenu) {
                e.preventDefault();
                let speed =the.options.accordion.slideSpeed; //original line
                //let speed =500;
                let hasClosables = false;

                if (KTUtil.hasClass(li, 'kt-menu__item--open') === false) {
                    // hide other accordions                    
                    if (the.options.accordion.expandAll === false) {
                        let subnav = item.closest('.kt-menu__nav, .kt-menu__subnav');
                        let closables = KTUtil.children(subnav, '.kt-menu__item.kt-menu__item--open.kt-menu__item--submenu:not(.kt-menu__item--here):not(.kt-menu__item--open-always)');

                        if (subnav && closables) {
                            for (let i = 0, len = closables.length; i < len; i++) {
                                let el_ = closables[0];
                                let submenu_ = KTUtil.child(el_, '.kt-menu__submenu');
                                if (submenu_) {
                                    KTUtil.slideUp(submenu_, speed, function () {
                                        Plugin.scrollUpdate();
                                        KTUtil.removeClass(el_, 'kt-menu__item--open');
                                    });
                                }
                            }
                        }
                    }

                    KTUtil.slideDown(submenu, speed, function () {
                        Plugin.scrollToItem(item);
                        Plugin.scrollUpdate();

                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    KTUtil.addClass(li, 'kt-menu__item--open');

                } else {
                    KTUtil.slideUp(submenu, speed, function () {
                        Plugin.scrollToItem(item);
                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    KTUtil.removeClass(li, 'kt-menu__item--open');
                }
            }
        },

        /**
         * scroll to item function
         * @returns {KTMenu}
         */
        scrollToItem: function (item) {
            // handle auto scroll for accordion submenus
            if (KTUtil.isInResponsiveRange('desktop') && the.options.accordion.autoScroll && element.getAttribute('data-ktmenu-scroll') !== '1') {
                KTUtil.scrollTo(item, the.options.accordion.autoScrollSpeed);
            }
        },

        /**
         * Hide submenu dropdown
         * @returns {KTMenu}
         */
        hideSubmenuDropdown: function (item, classAlso) {
            // remove submenu activation class
            if (classAlso) {
                KTUtil.removeClass(item, 'kt-menu__item--hover');
                KTUtil.removeClass(item, 'kt-menu__item--active-tab');
            }

            // clear timeout
            item.removeAttribute('data-hover');

            if (item.getAttribute('data-ktmenu-dropdown-toggle-class')) {
                KTUtil.removeClass(body, item.getAttribute('data-ktmenu-dropdown-toggle-class'));
            }

            let timeout = item.getAttribute('data-timeout');
            item.removeAttribute('data-timeout');
            clearTimeout(timeout);
        },

        /**
         * Hide submenu dropdowns
         * @returns {KTMenu}
         */
        hideSubmenuDropdowns: function () {
            let items;
            if (items = element.querySelectorAll('.kt-menu__item--submenu.kt-menu__item--hover:not(.kt-menu__item--tabs):not([data-ktmenu-submenu-toggle="tab"])')) {
                for (let j = 0, cnt = items.length; j < cnt; j++) {
                    Plugin.hideSubmenuDropdown(items[j], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        showSubmenuDropdown: function (item) {
            // close active submenus
            let list = element.querySelectorAll('.kt-menu__item--submenu.kt-menu__item--hover, .kt-menu__item--submenu.kt-menu__item--active-tab');

            if (list) {
                for (let i = 0, len = list.length; i < len; i++) {
                    let el = list[i];
                    if (item !== el && el.contains(item) === false && item.contains(el) === false) {
                        Plugin.hideSubmenuDropdown(el, true);
                    }
                }
            }

            // add submenu activation class
            KTUtil.addClass(item, 'kt-menu__item--hover');

            if (item.getAttribute('data-ktmenu-dropdown-toggle-class')) {
                KTUtil.addClass(body, item.getAttribute('data-ktmenu-dropdown-toggle-class'));
            }
        },

        /**
         * Handles submenu slide toggle
         * @returns {KTMenu}
         */
        createSubmenuDropdownClickDropoff: function (el) {
            let query;
            let zIndex = (query = KTUtil.child(el, '.kt-menu__submenu') ? KTUtil.css(query, 'z-index') : 0) - 1;

            let dropoff = document.createElement('<div class="kt-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');

            body.appendChild(dropoff);

            KTUtil.addEvent(dropoff, 'click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                KTUtil.remove(this);
                Plugin.hideSubmenuDropdown(el, true);
            });
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        pauseDropdownHover: function (time) {
            let date = new Date();

            the.pauseDropdownHoverTime = date.getTime() + time;
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        resumeDropdownHover: function () {
            let date = new Date();

            return (date.getTime() > the.pauseDropdownHoverTime ? true : false);
        },

        /**
         * Reset menu's current active item
         * @returns {KTMenu}
         */
        resetActiveItem: function (item) {
            let list;
            let parents;

            list = element.querySelectorAll('.kt-menu__item--active');

            for (let i = 0, len = list.length; i < len; i++) {
                let el = list[0];
                KTUtil.removeClass(el, 'kt-menu__item--active');
                KTUtil.hide(KTUtil.child(el, '.kt-menu__submenu'));
                parents = KTUtil.parents(el, '.kt-menu__item--submenu') || [];

                for (let i_ = 0, len_ = parents.length; i_ < len_; i_++) {
                    let el_ = parents[i];
                    KTUtil.removeClass(el_, 'kt-menu__item--open');
                    KTUtil.hide(KTUtil.child(el_, '.kt-menu__submenu'));
                }
            }

            // close open submenus
            if (the.options.accordion.expandAll === false) {
                if (list = element.querySelectorAll('.kt-menu__item--open')) {
                    for (let i = 0, len = list.length; i < len; i++) {
                        KTUtil.removeClass(parents[0], 'kt-menu__item--open');
                    }
                }
            }
        },

        /**
         * Sets menu's active item
         * @returns {KTMenu}
         */
        setActiveItem: function (item) {
            // reset current active item
            Plugin.resetActiveItem();

            let parents = KTUtil.parents(item, '.kt-menu__item--submenu') || [];
            for (let i = 0, len = parents.length; i < len; i++) {
                KTUtil.addClass(KTUtil.get(parents[i]), 'kt-menu__item--open');
            }

            KTUtil.addClass(KTUtil.get(item), 'kt-menu__item--active');
        },

        /**
         * Returns page breadcrumbs for the menu's active item
         * @returns {KTMenu}
         */
        getBreadcrumbs: function (item) {
            let query;
            let breadcrumbs = [];
            let link = KTUtil.child(item, '.kt-menu__link');

            breadcrumbs.push({
                text: (query = KTUtil.child(link, '.kt-menu__link-text') ? query.innerHTML : ''),
                title: link.getAttribute('title'),
                href: link.getAttribute('href')
            });

            let parents = KTUtil.parents(item, '.kt-menu__item--submenu');
            for (let i = 0, len = parents.length; i < len; i++) {
                let submenuLink = KTUtil.child(parents[i], '.kt-menu__link');

                breadcrumbs.push({
                    text: (query = KTUtil.child(submenuLink, '.kt-menu__link-text') ? query.innerHTML : ''),
                    title: submenuLink.getAttribute('title'),
                    href: submenuLink.getAttribute('href')
                });
            }

            return breadcrumbs.reverse();
        },

        /**
         * Returns page title for the menu's active item
         * @returns {KTMenu}
         */
        getPageTitle: function (item) {
            let query;

            return (query = KTUtil.child(item, '.kt-menu__link-text') ? query.innerHTML : '');
        },

        /**
         * Trigger events
         */
        eventTrigger: function (name, target, e) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, target, e);
                        }
                    } else {
                        return event.handler.call(this, target, e);
                    }
                }
            }
        },

        addEvent: function (name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        },

        removeEvent: function (name) {
            if (the.events[name]) {
                delete the.events[name];
            }
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function (options) {
        defaultOptions = options;
    };

    /**
     * Update scroll
     */
    the.scrollUpdate = function () {
        return Plugin.scrollUpdate();
    };

    /**
     * Re-init scroll
     */
    the.scrollReInit = function () {
        return Plugin.scrollInit();
    };

    /**
     * Scroll top
     */
    the.scrollTop = function () {
        return Plugin.scrollTop();
    };

    /**
     * Set active menu item
     */
    the.setActiveItem = function (item) {
        return Plugin.setActiveItem(item);
    };

    the.reload = function () {
        return Plugin.reload();
    };

    the.update = function (options) {
        return Plugin.update(options);
    };

    /**
     * Set breadcrumb for menu item
     */
    the.getBreadcrumbs = function (item) {
        return Plugin.getBreadcrumbs(item);
    };

    /**
     * Set page title for menu item
     */
    the.getPageTitle = function (item) {
        return Plugin.getPageTitle(item);
    };

    /**
     * Get submenu mode
     */
    the.getSubmenuMode = function (el) {
        return Plugin.getSubmenuMode(el);
    };

    /**
     * Hide dropdown
     * @returns {Object}
     */
    the.hideDropdown = function (item) {
        Plugin.hideSubmenuDropdown(item, true);
    };

    /**
     * Hide dropdowns
     * @returns {Object}
     */
    the.hideDropdowns = function () {
        Plugin.hideSubmenuDropdowns();
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.pauseDropdownHover = function (time) {
        Plugin.pauseDropdownHover(time);
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.resumeDropdownHover = function () {
        return Plugin.resumeDropdownHover();
    };

    /**
     * Register event
     */
    the.on = function (name, handler) {
        return Plugin.addEvent(name, handler);
    };

    the.off = function (name) {
        return Plugin.removeEvent(name);
    };

    the.one = function (name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Handle plugin on window resize
    KTUtil.addResizeHandler(function () {
        if (init) {
            the.reload();
        }
    });

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// Plugin global lazy initialization
document.addEventListener("click", function (e) {
    let body = KTUtil.get('body');
    let query;
    if (query = body.querySelectorAll('.kt-menu__nav .kt-menu__item.kt-menu__item--submenu.kt-menu__item--hover:not(.kt-menu__item--tabs)[data-ktmenu-submenu-toggle="click"]')) {
        for (let i = 0, len = query.length; i < len; i++) {
            let element = query[i].closest('.kt-menu__nav').parentNode;

            if (element) {
                let the = KTUtil.data(element).get('menu');

                if (!the) {
                    break;
                }

                if (!the || the.getSubmenuMode() !== 'dropdown') {
                    break;
                }

                if (e.target !== element && element.contains(e.target) === false) {
                    the.hideDropdowns();
                }
            }
        }
    }
});
"use strict";
let KTOffcanvas = function (elementId, options) {
    // Main object
    let the = this;
    let init = false;

    // Get element object
    let element = KTUtil.get(elementId);
    let body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    let defaultOptions = {};

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    let Plugin = {
        construct: function (options) {
            if (KTUtil.data(element).has('offcanvas')) {
                the = KTUtil.data(element).get('offcanvas');
            } else {
                // reset offcanvas
                Plugin.init(options);

                // build offcanvas
                Plugin.build();

                KTUtil.data(element).set('offcanvas', the);
            }

            return the;
        },

        init: function (options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
            the.overlay;

            the.classBase = the.options.baseClass;
            the.classShown = the.classBase + '--on';
            the.classOverlay = the.classBase + '-overlay';

            the.state = KTUtil.hasClass(element, the.classShown) ? 'shown' : 'hidden';
        },

        build: function () {
            // offcanvas toggle
            if (the.options.toggleBy) {
                if (typeof the.options.toggleBy === 'string') {
                    KTUtil.addEvent(the.options.toggleBy, 'click', function (e) {
                        e.preventDefault();
                        Plugin.toggle();
                    });
                } else if (the.options.toggleBy && the.options.toggleBy[0]) {
                    if (the.options.toggleBy[0].target) {
                        for (let i in the.options.toggleBy) {
                            KTUtil.addEvent(the.options.toggleBy[i].target, 'click', function (e) {
                                e.preventDefault();
                                Plugin.toggle();
                            });
                        }
                    } else {
                        for (let i in the.options.toggleBy) {
                            KTUtil.addEvent(the.options.toggleBy[i], 'click', function (e) {
                                e.preventDefault();
                                Plugin.toggle();
                            });
                        }
                    }

                } else if (the.options.toggleBy && the.options.toggleBy.target) {
                    KTUtil.addEvent(the.options.toggleBy.target, 'click', function (e) {
                        e.preventDefault();
                        Plugin.toggle();
                    });
                }
            }

            // offcanvas close
            let closeBy = KTUtil.get(the.options.closeBy);
            if (closeBy) {
                KTUtil.addEvent(closeBy, 'click', function (e) {
                    e.preventDefault();
                    Plugin.hide();
                });
            }

            // Window resize
            KTUtil.addResizeHandler(function () {
                if (parseInt(KTUtil.css(element, 'left')) >= 0 || parseInt(KTUtil.css(element, 'right') >= 0) || KTUtil.css(element, 'position') != 'fixed') {
                    KTUtil.css(element, 'opacity', '1');
                }
            });
        },

        isShown: function (target) {
            return (the.state == 'shown' ? true : false);
        },

        toggle: function () {
            ;
            Plugin.eventTrigger('toggle');

            if (the.state == 'shown') {
                Plugin.hide(this);
            } else {
                Plugin.show(this);
            }
        },

        show: function (target) {
            if (the.state == 'shown') {
                return;
            }

            Plugin.eventTrigger('beforeShow');

            Plugin.togglerClass(target, 'show');

            // Offcanvas panel
            KTUtil.addClass(body, the.classShown);
            KTUtil.addClass(element, the.classShown);
            KTUtil.css(element, 'opacity', '1');

            the.state = 'shown';

            if (the.options.overlay) {
                the.overlay = KTUtil.insertAfter(document.createElement('DIV'), element);
                KTUtil.addClass(the.overlay, the.classOverlay);
                KTUtil.addEvent(the.overlay, 'click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    Plugin.hide(target);
                });
            }

            Plugin.eventTrigger('afterShow');
        },

        hide: function (target) {
            if (the.state == 'hidden') {
                return;
            }

            Plugin.eventTrigger('beforeHide');

            Plugin.togglerClass(target, 'hide');

            KTUtil.removeClass(body, the.classShown);
            KTUtil.removeClass(element, the.classShown);

            the.state = 'hidden';

            if (the.options.overlay && the.overlay) {
                KTUtil.remove(the.overlay);
            }

            KTUtil.transitionEnd(element, function () {
                KTUtil.css(element, 'opacity', '1');
            });

            Plugin.eventTrigger('afterHide');
        },

        togglerClass: function (target, mode) {
            // Toggler
            let id = KTUtil.attr(target, 'id');
            let toggleBy;

            if (the.options.toggleBy && the.options.toggleBy[0] && the.options.toggleBy[0].target) {
                for (let i in the.options.toggleBy) {
                    if (the.options.toggleBy[i].target === id) {
                        toggleBy = the.options.toggleBy[i];
                    }
                }
            } else if (the.options.toggleBy && the.options.toggleBy.target) {
                toggleBy = the.options.toggleBy;
            }

            if (toggleBy) {
                let el = KTUtil.get(toggleBy.target);

                if (mode === 'show') {
                    KTUtil.addClass(el, toggleBy.state);
                }

                if (mode === 'hide') {
                    KTUtil.removeClass(el, toggleBy.state);
                }
            }
        },

        eventTrigger: function (name, args) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the, args);
                        }
                    } else {
                        event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function (name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////
    the.setDefaults = function (options) {
        defaultOptions = options;
    };

    the.isShown = function () {
        return Plugin.isShown();
    };

    the.hide = function () {
        return Plugin.hide();
    };

    the.show = function () {
        return Plugin.show();
    };

    the.on = function (name, handler) {
        return Plugin.addEvent(name, handler);
    };

    the.one = function (name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
  };

// "use strict";
//  // plugin setup
//  let KTPortlet = function (elementId, options) {
//     // Main object
//     let the = this;
//     let init = false;

//     // Get element object
//     let element = KTUtil.get(elementId);
//     let body = KTUtil.get('body');

//     if (!element) {
//         return;
//     }

//     // Default options
//     let defaultOptions = {
//         bodyToggleSpeed: 400,
//         tooltips: true,
//         tools: {
//             toggle: {
//                 collapse: 'Collapse',
//                 expand: 'Expand'
//             },
//             reload: 'Reload',
//             remove: 'Remove',
//             fullscreen: {
//                 on: 'Fullscreen',
//                 off: 'Exit Fullscreen'
//             }
//         },
//         sticky: {
//             offset: 300,
//             zIndex: 101
//         }
//     };

//     ////////////////////////////
//     // ** Private Methods  ** //
//     ////////////////////////////

//     let Plugin = {
//         /**
//          * Construct
//          */

//         construct: function (options) {
//             if (KTUtil.data(element).has('portlet')) {
//                 the = KTUtil.data(element).get('portlet');
//             } else {
//                 // reset menu
//                 Plugin.init(options);

//                 // build menu
//                 Plugin.build();

//                 KTUtil.data(element).set('portlet', the);
//             }

//             return the;
//         },

//         /**
//          * Init portlet
//          */
//         init: function (options) {
//             the.element = element;
//             the.events = [];

//             // merge default and user defined options
//             the.options = KTUtil.deepExtend({}, defaultOptions, options);
//             the.head = KTUtil.child(element, '.kt-portlet__head');
//             the.foot = KTUtil.child(element, '.kt-portlet__foot');

//             if (KTUtil.child(element, '.kt-portlet__body')) {
//                 the.body = KTUtil.child(element, '.kt-portlet__body');
//             } else if (KTUtil.child(element, '.kt-form')) {
//                 the.body = KTUtil.child(element, '.kt-form');
//             }
//         },

//         /**
//          * Build Form Wizard
//          */
//         build: function () {
//             // Remove
//             let remove = KTUtil.find(the.head, '[data-ktportlet-tool=remove]');
//             if (remove) {
//                 KTUtil.addEvent(remove, 'click', function (e) {
//                     e.preventDefault();
//                     Plugin.remove();
//                 });
//             }

//             // Reload
//             let reload = KTUtil.find(the.head, '[data-ktportlet-tool=reload]');
//             if (reload) {
//                 KTUtil.addEvent(reload, 'click', function (e) {
//                     e.preventDefault();
//                     Plugin.reload();
//                 });
//             }

//             // Toggle
//             let toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
//             if (toggle) {
//                 KTUtil.addEvent(toggle, 'click', function (e) {
//                     e.preventDefault();
//                     Plugin.toggle();
//                 });
//             }

//             //== Fullscreen
//             let fullscreen = KTUtil.find(the.head, '[data-ktportlet-tool=fullscreen]');
//             if (fullscreen) {
//                 KTUtil.addEvent(fullscreen, 'click', function (e) {
//                     e.preventDefault();
//                     Plugin.fullscreen();
//                 });
//             }

//             Plugin.setupTooltips();
//         },

//         /**
//          * Enable stickt mode
//          */
        // initSticky: function () {
        //     let lastScrollTop = 0;
        //     let offset = the.options.sticky.offset;

        //     if (!the.head) {
        //         return;
        //     }

        //     window.addEventListener('scroll', Plugin.onScrollSticky);
        // }

//         /**
//          * Window scroll handle event for sticky portlet
//          */
//         onScrollSticky: function (e) {
//             let offset = the.options.sticky.offset;
//             if (isNaN(offset)) return;

//             let st = document.documentElement.scrollTop;

//             if (st >= offset && KTUtil.hasClass(body, 'kt-portlet--sticky') === false) {
//                 Plugin.eventTrigger('stickyOn');

//                 KTUtil.addClass(body, 'kt-portlet--sticky');
//                 KTUtil.addClass(element, 'kt-portlet--sticky');

//                 Plugin.updateSticky();

//             } else if ((st * 1.5) <= offset && KTUtil.hasClass(body, 'kt-portlet--sticky')) {
//                 // back scroll mode
//                 Plugin.eventTrigger('stickyOff');

//                 KTUtil.removeClass(body, 'kt-portlet--sticky');
//                 KTUtil.removeClass(element, 'kt-portlet--sticky');

//                 Plugin.resetSticky();
//             }
//         },

//         updateSticky: function () {
//             if (!the.head) {
//                 return;
//             }

//             let top;

//             if (KTUtil.hasClass(body, 'kt-portlet--sticky')) {
//                 if (the.options.sticky.position.top instanceof Function) {
//                     top = parseInt(the.options.sticky.position.top.call(this, the));
//                 } else {
//                     top = parseInt(the.options.sticky.position.top);
//                 }

//                 let left;
//                 if (the.options.sticky.position.left instanceof Function) {
//                     left = parseInt(the.options.sticky.position.left.call(this, the));
//                 } else {
//                     left = parseInt(the.options.sticky.position.left);
//                 }

//                 let right;
//                 if (the.options.sticky.position.right instanceof Function) {
//                     right = parseInt(the.options.sticky.position.right.call(this, the));
//                 } else {
//                     right = parseInt(the.options.sticky.position.right);
//                 }

//                 KTUtil.css(the.head, 'z-index', the.options.sticky.zIndex);
//                 KTUtil.css(the.head, 'top', top + 'px');
//                 KTUtil.css(the.head, 'left', left + 'px');
//                 KTUtil.css(the.head, 'right', right + 'px');
//             }
//         },

//         resetSticky: function () {
//             if (!the.head) {
//                 return;
//             }

//             if (KTUtil.hasClass(body, 'kt-portlet--sticky') === false) {
//                 KTUtil.css(the.head, 'z-index', '');
//                 KTUtil.css(the.head, 'top', '');
//                 KTUtil.css(the.head, 'left', '');
//                 KTUtil.css(the.head, 'right', '');
//             }
//         },

//         /**
//          * Remove portlet
//          */
//         remove: function () {
//             if (Plugin.eventTrigger('beforeRemove') === false) {
//                 return;
//             }

//             if (KTUtil.hasClass(body, 'kt-portlet--fullscreen') && KTUtil.hasClass(element, 'kt-portlet--fullscreen')) {
//                 Plugin.fullscreen('off');
//             }

//             Plugin.removeTooltips();

//             KTUtil.remove(element);

//             Plugin.eventTrigger('afterRemove');
//         },

//         /**
//          * Set content
//          */
//         setContent: function (html) {
//             if (html) {
//                 the.body.innerHTML = html;
//             }
//         },

//         /**
//          * Get body
//          */
//         getBody: function () {
//             return the.body;
//         },

//         /**
//          * Get self
//          */
//         getSelf: function () {
//             return element;
//         },

//         /**
//          * Setup tooltips
//          */
//         setupTooltips: function () {
//             if (the.options.tooltips) {
//                 let collapsed = KTUtil.hasClass(element, 'kt-portlet--collapse') || KTUtil.hasClass(element, 'kt-portlet--collapsed');
//                 let fullscreenOn = KTUtil.hasClass(body, 'kt-portlet--fullscreen') && KTUtil.hasClass(element, 'kt-portlet--fullscreen');

//                 //== Remove
//                 let remove = KTUtil.find(the.head, '[data-ktportlet-tool=remove]');
//                 if (remove) {
//                     let placement = (fullscreenOn ? 'bottom' : 'top');
//                     let tip = new Tooltip(remove, {
//                         title: the.options.tools.remove,
//                         placement: placement,
//                         offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
//                         trigger: 'hover',
//                         template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
//                             <div class="tooltip-arrow arrow"></div>\
//                             <div class="tooltip-inner"></div>\
//                         </div>'
//                     });

//                     KTUtil.data(remove).set('tooltip', tip);
//                 }

//                 //== Reload
//                 let reload = KTUtil.find(the.head, '[data-ktportlet-tool=reload]');
//                 if (reload) {
//                     let placement = (fullscreenOn ? 'bottom' : 'top');
//                     let tip = new Tooltip(reload, {
//                         title: the.options.tools.reload,
//                         placement: placement,
//                         offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
//                         trigger: 'hover',
//                         template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
//                             <div class="tooltip-arrow arrow"></div>\
//                             <div class="tooltip-inner"></div>\
//                         </div>'
//                     });

//                     KTUtil.data(reload).set('tooltip', tip);
//                 }

//                 //== Toggle
//                 let toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
//                 if (toggle) {
//                     let placement = (fullscreenOn ? 'bottom' : 'top');
//                     let tip = new Tooltip(toggle, {
//                         title: (collapsed ? the.options.tools.toggle.expand : the.options.tools.toggle.collapse),
//                         placement: placement,
//                         offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
//                         trigger: 'hover',
//                         template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
//                             <div class="tooltip-arrow arrow"></div>\
//                             <div class="tooltip-inner"></div>\
//                         </div>'
//                     });

//                     KTUtil.data(toggle).set('tooltip', tip);
//                 }

//                 //== Fullscreen
//                 let fullscreen = KTUtil.find(the.head, '[data-ktportlet-tool=fullscreen]');
//                 if (fullscreen) {
//                     let placement = (fullscreenOn ? 'bottom' : 'top');
//                     let tip = new Tooltip(fullscreen, {
//                         title: (fullscreenOn ? the.options.tools.fullscreen.off : the.options.tools.fullscreen.on),
//                         placement: placement,
//                         offset: (fullscreenOn ? '0,10px,0,0' : '0,5px'),
//                         trigger: 'hover',
//                         template: '<div class="tooltip tooltip-portlet tooltip bs-tooltip-' + placement + '" role="tooltip">\
//                             <div class="tooltip-arrow arrow"></div>\
//                             <div class="tooltip-inner"></div>\
//                         </div>'
//                     });

//                     KTUtil.data(fullscreen).set('tooltip', tip);
//                 }
//             }
//         },

//         /**
//          * Setup tooltips
//          */
//         removeTooltips: function () {
//             if (the.options.tooltips) {
//                 //== Remove
//                 let remove = KTUtil.find(the.head, '[data-ktportlet-tool=remove]');
//                 if (remove && KTUtil.data(remove).has('tooltip')) {
//                     KTUtil.data(remove).get('tooltip').dispose();
//                 }

//                 //== Reload
//                 let reload = KTUtil.find(the.head, '[data-ktportlet-tool=reload]');
//                 if (reload && KTUtil.data(reload).has('tooltip')) {
//                     KTUtil.data(reload).get('tooltip').dispose();
//                 }

//                 //== Toggle
//                 let toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
//                 if (toggle && KTUtil.data(toggle).has('tooltip')) {
//                     KTUtil.data(toggle).get('tooltip').dispose();
//                 }

//                 //== Fullscreen
//                 let fullscreen = KTUtil.find(the.head, '[data-ktportlet-tool=fullscreen]');
//                 if (fullscreen && KTUtil.data(fullscreen).has('tooltip')) {
//                     KTUtil.data(fullscreen).get('tooltip').dispose();
//                 }
//             }
//         },

//         /**
//          * Reload
//          */
//         reload: function () {
//             Plugin.eventTrigger('reload');
//         },

//         /**
//          * Toggle
//          */
//         toggle: function () {
//             if (KTUtil.hasClass(element, 'kt-portlet--collapse') || KTUtil.hasClass(element, 'kt-portlet--collapsed')) {
//                 Plugin.expand();
//             } else {
//                 Plugin.collapse();
//             }
//         },

//         /**
//          * Collapse
//          */
//         collapse: function () {
//             if (Plugin.eventTrigger('beforeCollapse') === false) {
//                 return;
//             }

//             KTUtil.slideUp(the.body, the.options.bodyToggleSpeed, function () {
//                 Plugin.eventTrigger('afterCollapse');
//             });

//             KTUtil.addClass(element, 'kt-portlet--collapse');

//             let toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
//             if (toggle && KTUtil.data(toggle).has('tooltip')) {
//                 KTUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.expand);
//             }
//         },

//         /**
//          * Expand
//          */
//         expand: function () {
//             if (Plugin.eventTrigger('beforeExpand') === false) {
//                 return;
//             }

//             KTUtil.slideDown(the.body, the.options.bodyToggleSpeed, function () {
//                 Plugin.eventTrigger('afterExpand');
//             });

//             KTUtil.removeClass(element, 'kt-portlet--collapse');
//             KTUtil.removeClass(element, 'kt-portlet--collapsed');

//             let toggle = KTUtil.find(the.head, '[data-ktportlet-tool=toggle]');
//             if (toggle && KTUtil.data(toggle).has('tooltip')) {
//                 KTUtil.data(toggle).get('tooltip').updateTitleContent(the.options.tools.toggle.collapse);
//             }
//         },

//         /**
//          * fullscreen
//          */
//         fullscreen: function (mode) {
//             let d = {};
//             let speed = 300;

//             if (mode === 'off' || (KTUtil.hasClass(body, 'kt-portlet--fullscreen') && KTUtil.hasClass(element, 'kt-portlet--fullscreen'))) {
//                 Plugin.eventTrigger('beforeFullscreenOff');

//                 KTUtil.removeClass(body, 'kt-portlet--fullscreen');
//                 KTUtil.removeClass(element, 'kt-portlet--fullscreen');

//                 Plugin.removeTooltips();
//                 Plugin.setupTooltips();

//                 if (the.foot) {
//                     KTUtil.css(the.body, 'margin-bottom', '');
//                     KTUtil.css(the.foot, 'margin-top', '');
//                 }

//                 Plugin.eventTrigger('afterFullscreenOff');
//             } else {
//                 Plugin.eventTrigger('beforeFullscreenOn');

//                 KTUtil.addClass(element, 'kt-portlet--fullscreen');
//                 KTUtil.addClass(body, 'kt-portlet--fullscreen');

//                 Plugin.removeTooltips();
//                 Plugin.setupTooltips();


//                 if (the.foot) {
//                     let height1 = parseInt(KTUtil.css(the.foot, 'height'));
//                     let height2 = parseInt(KTUtil.css(the.foot, 'height')) + parseInt(KTUtil.css(the.head, 'height'));
//                     KTUtil.css(the.body, 'margin-bottom', height1 + 'px');
//                     KTUtil.css(the.foot, 'margin-top', '-' + height2 + 'px');
//                 }

//                 Plugin.eventTrigger('afterFullscreenOn');
//             }
//         },

//         /**
//          * Trigger events
//          */
//         eventTrigger: function (name) {
//             //KTUtil.triggerCustomEvent(name);
//             for (let i = 0; i < the.events.length; i++) {
//                 let event = the.events[i];
//                 if (event.name == name) {
//                     if (event.one == true) {
//                         if (event.fired == false) {
//                             the.events[i].fired = true;
//                             event.handler.call(this, the);
//                         }
//                     } else {
//                         event.handler.call(this, the);
//                     }
//                 }
//             }
//         },

//         addEvent: function (name, handler, one) {
//             the.events.push({
//                 name: name,
//                 handler: handler,
//                 one: one,
//                 fired: false
//             });

//             return the;
//         }
//     };

//     //////////////////////////
//     // ** Public Methods ** //
//     //////////////////////////

//     /**
//      * Set default options
//      */

//     the.setDefaults = function (options) {
//         defaultOptions = options;
//     };

//     /**
//      * Remove portlet
//      * @returns {KTPortlet}
//      */
//     the.remove = function () {
//         return Plugin.remove(html);
//     };

//     /**
//      * Remove portlet
//      * @returns {KTPortlet}
//      */
    // the.initSticky = function () {
    //     return Plugin.initSticky();
    // };

//     /**
//      * Remove portlet
//      * @returns {KTPortlet}
//      */
//     the.updateSticky = function () {
//         return Plugin.updateSticky();
//     };

//     /**
//      * Remove portlet
//      * @returns {KTPortlet}
//      */
//     the.resetSticky = function () {
//         return Plugin.resetSticky();
//     };

//     /**
//      * Destroy sticky portlet
//      */
//     the.destroySticky = function () {
//         Plugin.resetSticky();
//         window.removeEventListener('scroll', Plugin.onScrollSticky);
//     };

//     /**
//      * Reload portlet
//      * @returns {KTPortlet}
//      */
//     the.reload = function () {
//         return Plugin.reload();
//     };

//     /**
//      * Set portlet content
//      * @returns {KTPortlet}
//      */
//     the.setContent = function (html) {
//         return Plugin.setContent(html);
//     };

//     /**
//      * Toggle portlet
//      * @returns {KTPortlet}
//      */
//     the.toggle = function () {
//         return Plugin.toggle();
//     };

//     /**
//      * Collapse portlet
//      * @returns {KTPortlet}
//      */
//     the.collapse = function () {
//         return Plugin.collapse();
//     };

//     /**
//      * Expand portlet
//      * @returns {KTPortlet}
//      */
//     the.expand = function () {
//         return Plugin.expand();
//     };

//     /**
//      * Fullscreen portlet
//      * @returns {MPortlet}
//      */
//     the.fullscreen = function () {
//         return Plugin.fullscreen('on');
//     };

//     /**
//      * Fullscreen portlet
//      * @returns {MPortlet}
//      */
//     the.unFullscreen = function () {
//         return Plugin.fullscreen('off');
//     };

//     /**
//      * Get portletbody
//      * @returns {jQuery}
//      */
//     the.getBody = function () {
//         return Plugin.getBody();
//     };

//     /**
//      * Get portletbody
//      * @returns {jQuery}
//      */
//     the.getSelf = function () {
//         return Plugin.getSelf();
//     };

//     /**
//      * Attach event
//      */
//     the.on = function (name, handler) {
//         return Plugin.addEvent(name, handler);
//     };

//     /**
//      * Attach event that will be fired once
//      */
//     the.one = function (name, handler) {
//         return Plugin.addEvent(name, handler, true);
//     };

//     // Construct plugin
//     Plugin.construct.apply(the, [options]);

//     return the;
// };

"use strict";
let KTScrolltop = function (elementId, options) {
    // Main object
    let the = this;
    let init = false;

    // Get element object
    let element = KTUtil.get(elementId);
    let body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    let defaultOptions = {
        offset: 300,
        speed: 600,
        toggleClass: 'kt-scrolltop--on'
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Run plugin
         * @returns {mscrolltop}
         */
        construct: function (options) {
            if (KTUtil.data(element).has('scrolltop')) {
                the = KTUtil.data(element).get('scrolltop');
            } else {
                // reset scrolltop
                Plugin.init(options);

                // build scrolltop
                Plugin.build();

                KTUtil.data(element).set('scrolltop', the);
            }

            return the;
        },

        /**
         * Handles subscrolltop click toggle
         * @returns {mscrolltop}
         */
        init: function (options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        build: function () {
            // handle window scroll
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                window.addEventListener('touchend', function () {
                    Plugin.handle();
                });

                window.addEventListener('touchcancel', function () {
                    Plugin.handle();
                });

                window.addEventListener('touchleave', function () {
                    Plugin.handle();
                });
            } else {
                window.addEventListener('scroll', function () {
                    Plugin.handle();
                });
            }

            // handle button click 
            KTUtil.addEvent(element, 'click', Plugin.scroll);
        },

        /**
         * Handles scrolltop click scrollTop
         */
        handle: function () {
            let pos = window.pageYOffset; // current vertical position
            if (pos > the.options.offset) {
                KTUtil.addClass(body, the.options.toggleClass);
            } else {
                KTUtil.removeClass(body, the.options.toggleClass);
            }
        },

        /**
         * Handles scrolltop click scrollTop
         */
        scroll: function (e) {
            e.preventDefault();

            KTUtil.scrollTop(0, the.options.speed);
        },


        /**
         * Trigger events
         */
        eventTrigger: function (name, args) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the, args);
                        }
                    } else {
                        event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function (name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function (options) {
        defaultOptions = options;
    };

    /**
     * Get subscrolltop mode
     */
    the.on = function (name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Set scrolltop content
     * @returns {mscrolltop}
     */
    the.one = function (name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};
"use strict";

// plugin setup
let KTToggle = function (elementId, options) {
    // Main object
    let the = this;
    //let init = false;

    // Get element object
    let element = KTUtil.get(elementId);
    //let app_container = $(KTUtil.getByID('_app_content')); //customizing, added let => It is app content or app content container
    //let body = KTUtil.get('body');

    if (!element) {
        return;
    }

    // Default options
    let defaultOptions = {
        togglerState: '',
        targetState: ''
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    let Plugin = {
        /**
         * Construct
         */

        construct: function (options) {
            if (KTUtil.data(element).has('toggle')) {
                the = KTUtil.data(element).get('toggle');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('toggle', the);
            }

            return the;
        },

        /**
         * Handles subtoggle click toggle
         */
        init: function (options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            the.target = KTUtil.get(the.options.target);
            the.targetState = the.options.targetState;
            the.togglerState = the.options.togglerState;

            the.state = KTUtil.hasClasses(the.target, the.targetState) ? 'on' : 'off';
        },

        /**
         * Setup toggle
         */
        build: function () {
            KTUtil.addEvent(element, 'mouseup', Plugin.toggle);//here
        },

        /**
         * Handles offcanvas click toggle
         */

        toggle: function (e) {
            Plugin.eventTrigger('beforeToggle');

            if (the.state == 'off') {
                Plugin.toggleOn();
                /** play effect during the aside menu ON **/
                //app_container.removeClass('content-zoomout');//.addClass('content-normal'); 
                //KTUtil.addClass(app_container,'content-zoomout');
            } else {
                Plugin.toggleOff();
                //app_container.addClass('content-zoomout'); 
                //KTUtil.addClass(app_container,'content-zoomout');    
            }

            Plugin.eventTrigger('afterToggle');

            if (e) e.preventDefault();

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOn: function () {
            Plugin.eventTrigger('beforeOn');

            KTUtil.addClass(the.target, the.targetState);

            if (the.togglerState) {
                KTUtil.addClass(element, the.togglerState);
            }

            the.state = 'on';

            Plugin.eventTrigger('afterOn');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOff: function () {
            Plugin.eventTrigger('beforeOff');

            KTUtil.removeClass(the.target, the.targetState);

            if (the.togglerState) {
                KTUtil.removeClass(element, the.togglerState);
            }

            the.state = 'off';

            Plugin.eventTrigger('afterOff');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Trigger events
         */
        eventTrigger: function (name) {
            for (let i = 0; i < the.events.length; i++) {
                let event = the.events[i];

                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            event.handler.call(this, the);
                        }
                    } else {
                        event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function (name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options 
     */

    the.setDefaults = function (options) {
        defaultOptions = options;
    };

    /**
     * Get toggle state 
     */
    the.getState = function () {
        return the.state;
    };

    /**
     * Toggle 
     */
    the.toggle = function () {
        return Plugin.toggle();
    };

    /**
     * Toggle on 
     */
    the.toggleOn = function () {
        return Plugin.toggleOn();
    };

    /**
     * Toggle off 
     */
    the.toggleOff = function () {
        return Plugin.toggleOff();
    };

    /**
     * Attach event
     * @returns {KTToggle}
     */
    the.on = function (name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {KTToggle}
     */
    the.one = function (name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

//Todo: fix => If use "let" => error "Defaults is already declared"
//Define pagination buttons for DataTable. @defaults is used in dataTables.bundle.min.js
let defaults = {
    layout: {
        icons: {
            pagination: {
                next: 'flaticon2-next',
                prev: 'flaticon2-back',
                first: 'flaticon2-fast-back',
                last: 'flaticon2-fast-next',
                more: 'flaticon-more-1',
            },
            rowDetail: { expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right' },
        }
    }
};

if (KTUtil.isRTL()) {
    defaults = {
        layout: {
            icons: {
                pagination: {
                    next: 'flaticon2-back',
                    prev: 'flaticon2-next',
                    first: 'flaticon2-fast-next',
                    last: 'flaticon2-fast-back',
                },
                rowDetail: { collapse: 'fa fa-caret-down', expand: 'fa fa-caret-right' },
            }
        }
    }
}
 
"use strict";
let KTLayout = function () {
    let body;

    let header;
    let headerMenu;
    let headerMenuOffcanvas;

    let asideMenu;
    let asideMenuOffcanvas;
    let asideToggler;

    let asideSecondary;
    let asideSecondaryToggler;

    let scrollTop;

    let pageStickyPortlet;
 
    // Aside
    let initAside = function () {
        // init aside left offcanvas
        //let asidBrandHover = false;
        let aside = KTUtil.get('kt_aside');
        //let asideBrand = KTUtil.get('kt_aside_brand');

        let asideOffcanvasClass = KTUtil.hasClass(aside, 'kt-aside--offcanvas-default') ? 'kt-aside--offcanvas-default' : 'kt-aside';
        asideMenuOffcanvas = new KTOffcanvas('kt_aside', {
            baseClass: asideOffcanvasClass,
            overlay: true,
            closeBy: 'kt_aside_toggler',
            toggleBy: {
                target: 'kt_aside_mobile_toggler',
                state: 'kt-header-mobile__toolbar-toggler--active'
            }
        });


        // // Handle minimzied aside hover. Uncomment the following to hide Aside menu when user's mouse out of Aside menu panel
        // if (KTUtil.hasClass(body, 'kt-aside--fixed')) {
        //      let insideTm;
        //      let outsideTm;

        //     KTUtil.addEvent(aside, 'mouseenter', function (e) {
        //         e.preventDefault();

        //         if (KTUtil.isInResponsiveRange('desktop') === false) {
        //             return;
        //         }

        //         if (outsideTm) {
        //         	clearTimeout(outsideTm);
        //         	outsideTm = null;
        //         }

        //         insideTm = setTimeout(function() {
        //         	if (KTUtil.hasClass(body, 'kt-aside--minimize') && KTUtil.isInResponsiveRange('desktop')) {
        //         		KTUtil.removeClass(body, 'kt-aside--minimize');

        //         		// Minimizing class
        //         		KTUtil.addClass(body, 'kt-aside--minimizing');
        //         		KTUtil.transitionEnd(body, function() {
        //         			KTUtil.removeClass(body, 'kt-aside--minimizing');
        //         		});

        //         		// Hover class
        //         		KTUtil.addClass(body, 'kt-aside--minimize-hover');
        //         		asideMenu.scrollUpdate();
        //         		asideMenu.scrollTop();
        //         	}
        //         }, 50);
        //     });

        //     KTUtil.addEvent(aside, 'mouseleave', function (e) {
        //         e.preventDefault();

        //         if (KTUtil.isInResponsiveRange('desktop') === false) {
        //             return;
        //         }

        //         if (insideTm) {
        //         	clearTimeout(insideTm);
        //         	insideTm = null;
        //         }

        //         outsideTm = setTimeout(function() {
        //         	if (KTUtil.hasClass(body, 'kt-aside--minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
        //         		KTUtil.removeClass(body, 'kt-aside--minimize-hover');
        //         		KTUtil.addClass(body, 'kt-aside--minimize');

        //         		// Minimizing class
        //         		KTUtil.addClass(body, 'kt-aside--minimizing');
        //         		KTUtil.transitionEnd(body, function() {
        //         			KTUtil.removeClass(body, 'kt-aside--minimizing');
        //         		});

        //         		// Hover class
        //         		asideMenu.scrollUpdate();
        //         		asideMenu.scrollTop();
        //         	}
        //         }, 50);
        //     });
        // }
    }

    // Aside menu
    let initAsideMenu = function () {
        // Init aside menu
        let menu = $(KTUtil.getByID('kt_aside_menu'));
        //Set background color of side menu
        //menu.css('background-color','#081880');

        let menuDesktopMode = (KTUtil.attr(menu, 'data-ktmenu-dropdown') === '1' ? 'dropdown' : 'accordion');

        let scroll;
        if (KTUtil.attr(menu, 'data-ktmenu-scroll') === '1') {
            scroll = {
                rememberPosition: true, // remember position on page reload
                height: function () { // calculate available scrollable area height
                    let height;

                    if (KTUtil.isInResponsiveRange('desktop')) {
                        height =
                            parseInt(KTUtil.getViewPort().height) -
                            parseInt(KTUtil.actualHeight('kt_aside_brand')) -
                            parseInt(KTUtil.getByID('kt_aside_footer') ? KTUtil.actualHeight('kt_aside_footer') : 0);
                    } else {
                        height =
                            parseInt(KTUtil.getViewPort().height) -
                            parseInt(KTUtil.getByID('kt_aside_footer') ? KTUtil.actualHeight('kt_aside_footer') : 0);
                    }

                    height = height - (parseInt(KTUtil.css(menu, 'marginBottom')) + parseInt(KTUtil.css(menu, 'marginTop')));

                    return height;
                }
            };
        }

        //manage toggling of sub menus on Aside menu
        asideMenu = new KTMenu('kt_aside_menu', {
            // vertical scroll
            scroll: scroll,

            // submenu setup
            submenu: {
                desktop: menuDesktopMode,
                tablet: 'accordion', // menu set to accordion in tablet mode
                mobile: 'accordion' // menu set to accordion in mobile mode
            },

            //accordion setup
            accordion: {
                expandAll: false // allow having multiple expanded accordions in the menu
            }
        });

        asideToggler = new KTToggle('kt_aside_toggler', {
            target: 'body',
            targetState: 'kt-aside--minimize',
            togglerState: 'kt-aside__brand-aside-toggler--active'
        });

        /** when user clicks on kt-menu-item on aside menu => minimize the aside menu pane **/
        // //menu is a jquery object, example $(menu)
        // menu.on('click','a.menu-item',function(e){
        //     asideToggler.toggle(); //here
        // });

        KTUtil.transitionEnd(body, function () {
            KTUtil.removeClass(body, 'kt-aside--minimizing');
        });

        // sample set active menu
        // asideMenu.setActiveItem($('a[href="?page=custom/pages/pricing/pricing-1&demo=demo1"]').closest('.kt-menu__item')[0]);
    }

    // Sidebar toggle
    let initAsideToggler = function () {
        let brand_label = $('#_dms_brand_label');
        if (!KTUtil.get('kt_aside_toggler')) {
            return;
        }

        asideToggler = new KTToggle('kt_aside_toggler', {
            target: 'body',
            targetState: 'kt-aside--minimize',
            togglerState: 'kt-aside__brand-aside-toggler--active'
        });

        asideToggler.on('toggle', function (toggle) {
            KTUtil.addClass(body, 'kt-aside--minimizing');

            if (KTUtil.get('kt_page_portlet')) {
                pageStickyPortlet.updateSticky();
            }

            KTUtil.transitionEnd(body, function () {
                KTUtil.removeClass(body, 'kt-aside--minimizing');
            });

            //headerMenu.pauseDropdownHover(800);
            //asideMenu.pauseDropdownHover(300);

            // Remember state in cookie //toggle.getState() = {'on','off'}
            let toggle_state = toggle.getState();//here
            Cookies.set('kt_aside_toggle_state', toggle_state);
            if (toggle_state == 'on')
                brand_label.hide();
            else
                brand_label.show();


            // to set default minimized left aside use this cookie value in your 
            // server side code and add "kt-brand--minimize kt-aside--minimize" classes to
            // the body tag in order to initialize the minimized left aside mode during page loading.
        });

        asideToggler.on('beforeToggle', function (toggle) {
            let body = KTUtil.get('body');
            if (KTUtil.hasClass(body, 'kt-aside--minimize') === false && KTUtil.hasClass(body, 'kt-aside--minimize-hover')) {
                KTUtil.removeClass(body, 'kt-aside--minimize-hover');
            }
        });
    }

    // Aside secondary
    let initAsideSecondary = function () {
        if (!KTUtil.get('kt_aside_secondary')) {
            return;
        }

        asideSecondaryToggler = new KTToggle('kt_aside_secondary_toggler', {
            target: 'body',
            targetState: 'kt-aside-secondary--expanded'
        });

        asideSecondaryToggler.on('toggle', function (toggle) {
            if (KTUtil.get('kt_page_portlet')) {
                pageStickyPortlet.updateSticky();
            }
        });
    }

    // // Scrolltop
    // let initScrolltop = function () {
    //     let scrolltop = new KTScrolltop('kt_scrolltop', {
    //         offset: 300,
    //         speed: 600
    //     });
    // }

    // // Init page sticky portlet
    // let initPageStickyPortlet = function () {
    //     return new KTPortlet('kt_page_portlet', {
    //         sticky: {
    //             offset: parseInt(KTUtil.css(KTUtil.get('kt_header'), 'height')),
    //             zIndex: 90,
    //             position: {
    //                 top: function () {
    //                     let pos = 0;

    //                     if (KTUtil.isInResponsiveRange('desktop')) {
    //                         if (KTUtil.hasClass(body, 'kt-header--fixed')) {
    //                             pos = pos + parseInt(KTUtil.css(KTUtil.get('kt_header'), 'height'));
    //                         }

    //                         if (KTUtil.hasClass(body, 'kt-subheader--fixed') && KTUtil.get('kt_subheader')) {
    //                             pos = pos + parseInt(KTUtil.css(KTUtil.get('kt_subheader'), 'height'));
    //                         }
    //                     } else {
    //                         if (KTUtil.hasClass(body, 'kt-header-mobile--fixed')) {
    //                             pos = pos + parseInt(KTUtil.css(KTUtil.get('kt_header_mobile'), 'height'));
    //                         }
    //                     }

    //                     return pos;
    //                 },
    //                 left: function (portlet) {
    //                     let porletEl = portlet.getSelf();

    //                     return KTUtil.offset(porletEl).left;
    //                 },
    //                 right: function (portlet) {
    //                     let porletEl = portlet.getSelf();

    //                     let portletWidth = parseInt(KTUtil.css(porletEl, 'width'));
    //                     let bodyWidth = parseInt(KTUtil.css(KTUtil.get('body'), 'width'));
    //                     let portletOffsetLeft = KTUtil.offset(porletEl).left;

    //                     return bodyWidth - portletWidth - portletOffsetLeft;
    //                 }
    //             }
    //         }
    //     });
    // }

    // Calculate content available full height
    let getContentHeight = function () {
        let height;

        height = KTUtil.getViewPort().height;

        if (KTUtil.getByID('kt_header')) {
            height = height - KTUtil.actualHeight('kt_header');
        }

        if (KTUtil.getByID('kt_subheader')) {
            height = height - KTUtil.actualHeight('kt_subheader');
        }

        if (KTUtil.getByID('kt_footer')) {
            height = height - parseInt(KTUtil.css('kt_footer', 'height'));
        }

        if (KTUtil.getByID('kt_content')) {
            height = height - parseInt(KTUtil.css('kt_content', 'padding-top')) - parseInt(KTUtil.css('kt_content', 'padding-bottom'));
        }

        return height;
    }

    return {
        init: function () {
            body = KTUtil.get('body');

            //this.initHeader();
            this.initAside();
            this.initAsideSecondary();
            //this.initPageStickyPortlet();

            // Non functional links notice(can be removed in production)
            // $('#kt_aside_menu, #kt_header_menu').on('click', '.kt-menu__link[href="#"]', function(e) {
            // 	swal.fire("", "You have clicked on a non-functional dummy link!");

            // 	e.preventDefault();
            // });
        },

        // initHeader: function() {
        // 	initHeader();
        // 	initHeaderMenu();
        // 	initHeaderTopbar();
        // 	initScrolltop();
        // },

        initAside: function () {
            initAside();
            initAsideMenu();
            initAsideToggler();

            this.onAsideToggle(function (e) {
                // Update sticky portlet
                if (pageStickyPortlet) {
                    pageStickyPortlet.updateSticky();
                }

                // Reload datatable
                let datatables = $('.kt-datatable');
                if (datatables) {
                    datatables.each(function () {
                        $(this).KTDatatable('redraw');
                    });
                }
            });
        },

        initAsideSecondary: function () {
            initAsideSecondary();
        },

        // initPageStickyPortlet: function () {
        //     if (!KTUtil.get('kt_page_portlet')) {
        //         return;
        //     }

        //     pageStickyPortlet = initPageStickyPortlet();
        //     //pageStickyPortlet.initSticky();

        //     KTUtil.addResizeHandler(function () {
        //         pageStickyPortlet.updateSticky();
        //     });

        //     initPageStickyPortlet();
        // },

        getAsideMenu: function () {
            return asideMenu;
        },

        onAsideToggle: function (handler) {
            if (typeof asideToggler.element !== 'undefined') {
                asideToggler.on('toggle', handler);
            }
        },

        getAsideToggler: function () {
            return asideToggler;
        },

        openAsideSecondary: function () {
            asideSecondaryToggler.toggleOn();
        },

        closeAsideSecondary: function () {
            asideSecondaryToggler.toggleOff();
        },

        getAsideSecondaryToggler: function () {
            return asideSecondaryToggler;
        },

        onAsideSecondaryToggle: function (handler) {
            if (asideSecondaryToggler) {
                asideSecondaryToggler.on('toggle', handler);
            }
        },

        closeMobileAsideMenuOffcanvas: function () {
            if (KTUtil.isMobileDevice()) {
                asideMenuOffcanvas.hide();
            }
        },

        closeMobileHeaderMenuOffcanvas: function () {
            if (KTUtil.isMobileDevice()) {
                headerMenuOffcanvas.hide();
            }
        },

        getContentHeight: function () {
            return getContentHeight();
        }
    };
}();

KTUtil.ready(function () {
    KTLayout.init();
});
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Project = factory();
})(this, function () {
    'use strict';

    /**
     * Dynamic object with linear interpolation.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var DynamicObject = function DynamicObject(props) {
        var _this = this;

        _classCallCheck(this, DynamicObject);

        for (var key in props) {
            this[key] = props[key];
        }this.lerp = function (v, alpha) {
            for (var _key in props) {
                _this[_key] += (v[_key] - _this[_key]) * alpha;
            }return _this;
        };
    };

    /**
     * Browser detection and vendor prefixes.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Device = new ( // Singleton static pattern

    function () {
        function Device() {
            var _this2 = this;

            _classCallCheck(this, Device);

            this.agent = navigator.userAgent.toLowerCase();
            this.prefix = function () {
                var pre = '',
                    dom = '',
                    styles = window.getComputedStyle(document.documentElement, '');
                pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
                dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
                var IE = _this2.detect('trident');
                return {
                    unprefixed: IE && !_this2.detect('msie 9'),
                    dom: dom,
                    lowercase: pre,
                    css: '-' + pre + '-',
                    js: (IE ? pre[0] : pre[0].toUpperCase()) + pre.substr(1)
                };
            }();
            this.transformProperty = function () {
                var pre = void 0;
                switch (_this2.prefix.lowercase) {
                    case 'webkit':
                        pre = '-webkit-transform';
                        break;
                    case 'moz':
                        pre = '-moz-transform';
                        break;
                    case 'o':
                        pre = '-o-transform';
                        break;
                    case 'ms':
                        pre = '-ms-transform';
                        break;
                    default:
                        pre = 'transform';
                        break;
                }
                return pre;
            }();
            this.mobile = !!('ontouchstart' in window || 'onpointerdown' in window) && this.detect(['ios', 'iphone', 'ipad', 'android', 'blackberry']) ? {} : false;
            this.tablet = function () {
                if (window.innerWidth > window.innerHeight) return document.body.clientWidth > 800;else return document.body.clientHeight > 800;
            }();
            this.phone = !this.tablet;
            this.type = this.phone ? 'phone' : 'tablet';
        }

        _createClass(Device, [{
            key: 'detect',
            value: function detect(array) {
                if (typeof array === 'string') array = [array];
                for (var i = 0; i < array.length; i++) {
                    if (this.agent.indexOf(array[i]) > -1) return true;
                }return false;
            }
        }, {
            key: 'vendor',
            value: function vendor(style) {
                return this.prefix.js + style;
            }
        }, {
            key: 'vibrate',
            value: function vibrate(time) {
                navigator.vibrate && navigator.vibrate(time);
            }
        }]);

        return Device;
    }())(); // Singleton static pattern

    /**
     * Alien utilities.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Utils = new ( // Singleton static pattern

    function () {
        function Utils() {
            _classCallCheck(this, Utils);
        }

        _createClass(Utils, [{
            key: 'rand',
            value: function rand(min, max) {
                return new DynamicObject({ v: min }).lerp({ v: max }, Math.random()).v;
            }
        }, {
            key: 'doRandom',
            value: function doRandom(min, max, precision) {
                if (typeof precision === 'number') {
                    var p = Math.pow(10, precision);
                    return Math.round(this.rand(min, max) * p) / p;
                } else {
                    return Math.round(this.rand(min - 0.5, max + 0.5));
                }
            }
        }, {
            key: 'headsTails',
            value: function headsTails(heads, tails) {
                return !this.doRandom(0, 1) ? heads : tails;
            }
        }, {
            key: 'toDegrees',
            value: function toDegrees(rad) {
                return rad * (180 / Math.PI);
            }
        }, {
            key: 'toRadians',
            value: function toRadians(deg) {
                return deg * (Math.PI / 180);
            }
        }, {
            key: 'findDistance',
            value: function findDistance(p1, p2) {
                var dx = p2.x - p1.x,
                    dy = p2.y - p1.y;
                return Math.sqrt(dx * dx + dy * dy);
            }
        }, {
            key: 'timestamp',
            value: function timestamp() {
                return (Date.now() + this.doRandom(0, 99999)).toString();
            }
        }, {
            key: 'pad',
            value: function pad(number) {
                return number < 10 ? '0' + number : number;
            }
        }, {
            key: 'touchEvent',
            value: function touchEvent(e) {
                var touchEvent = {};
                touchEvent.x = 0;
                touchEvent.y = 0;
                if (!e) return touchEvent;
                if (Device.mobile && (e.touches || e.changedTouches)) {
                    if (e.touches.length) {
                        touchEvent.x = e.touches[0].pageX;
                        touchEvent.y = e.touches[0].pageY;
                    } else {
                        touchEvent.x = e.changedTouches[0].pageX;
                        touchEvent.y = e.changedTouches[0].pageY;
                    }
                } else {
                    touchEvent.x = e.pageX;
                    touchEvent.y = e.pageY;
                }
                return touchEvent;
            }
        }, {
            key: 'clamp',
            value: function clamp(num, min, max) {
                return Math.min(Math.max(num, min), max);
            }
        }, {
            key: 'constrain',
            value: function constrain(num, min, max) {
                return Math.min(Math.max(num, Math.min(min, max)), Math.max(min, max));
            }
        }, {
            key: 'convertRange',
            value: function convertRange(oldValue, oldMin, oldMax, newMin, newMax, constrain) {
                var oldRange = oldMax - oldMin,
                    newRange = newMax - newMin,
                    newValue = (oldValue - oldMin) * newRange / oldRange + newMin;
                return constrain ? this.constrain(newValue, newMin, newMax) : newValue;
            }
        }, {
            key: 'nullObject',
            value: function nullObject(object) {
                for (var key in object) {
                    if (typeof object[key] !== 'undefined') object[key] = null;
                }return null;
            }
        }, {
            key: 'cloneObject',
            value: function cloneObject(object) {
                return JSON.parse(JSON.stringify(object));
            }
        }, {
            key: 'mergeObject',
            value: function mergeObject() {
                var object = {};

                for (var _len = arguments.length, objects = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
                    objects[_key2] = arguments[_key2];
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var obj = _step.value;
                        for (var key in obj) {
                            object[key] = obj[key];
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return object;
            }
        }, {
            key: 'cloneArray',
            value: function cloneArray(array) {
                return array.slice(0);
            }
        }, {
            key: 'toArray',
            value: function toArray(object) {
                return Object.keys(object).map(function (key) {
                    return object[key];
                });
            }
        }, {
            key: 'queryString',
            value: function queryString(key) {
                return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[.+*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
            }
        }, {
            key: 'basename',
            value: function basename(path) {
                return path.replace(/.*\//, '').replace(/(.*)\..*$/, '$1');
            }
        }, {
            key: 'base64',
            value: function base64(str) {
                return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
            }
        }]);

        return Utils;
    }())(); // Singleton static pattern

    /**
     * Event helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    window.Events = {
        BROWSER_FOCUS: 'browser_focus',
        KEYBOARD_PRESS: 'keyboard_press',
        KEYBOARD_DOWN: 'keyboard_down',
        KEYBOARD_UP: 'keyboard_up',
        RESIZE: 'resize',
        COMPLETE: 'complete',
        PROGRESS: 'progress',
        UPDATE: 'update',
        LOADED: 'loaded',
        ERROR: 'error',
        READY: 'ready',
        HOVER: 'hover',
        CLICK: 'click'
    };

    var EventManager = function EventManager() {
        _classCallCheck(this, EventManager);

        var events = [];

        this.add = function (event, callback) {
            events.push({ event: event, callback: callback });
        };

        this.remove = function (event, callback) {
            for (var i = events.length - 1; i > -1; i--) {
                if (events[i].event === event && events[i].callback === callback) {
                    events[i] = null;
                    events.splice(i, 1);
                    break;
                }
            }
        };

        this.destroy = function () {
            for (var i = events.length - 1; i > -1; i--) {
                events[i] = null;
                events.splice(i, 1);
            }
            return null;
        };

        this.fire = function (event) {
            var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var clone = Utils.cloneArray(events);
            for (var i = 0; i < clone.length; i++) {
                if (clone[i].event === event) clone[i].callback(object);
            }
        };
    };

    window.events = new EventManager();

    /**
     * Render loop.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        return Delayed(callback, 1000 / 60);
    };

    var Render = new // Singleton static pattern

    function Render() {
        var _this3 = this;

        _classCallCheck(this, Render);

        this.TIME = Date.now();
        var last = void 0,
            render = [],
            time = Date.now(),
            timeSinceRender = 0,
            rendering = false;

        var focus = function focus(e) {
            if (e.type === 'focus') last = Date.now();
        };

        var step = function step() {
            var t = Date.now(),
                timeSinceLoad = t - time,
                diff = 0,
                fps = 60;
            if (last) {
                diff = t - last;
                fps = 1000 / diff;
            }
            last = t;
            _this3.TIME = t;
            for (var i = render.length - 1; i > -1; i--) {
                var callback = render[i];
                if (!callback) continue;
                if (callback.fps) {
                    timeSinceRender += diff > 200 ? 0 : diff;
                    if (timeSinceRender < 1000 / callback.fps) continue;
                    timeSinceRender -= 1000 / callback.fps;
                }
                callback(t, timeSinceLoad, diff, fps, callback.frameCount++);
            }
            if (render.length) {
                window.requestAnimationFrame(step);
            } else {
                rendering = false;
                window.events.remove(Events.BROWSER_FOCUS, focus);
            }
        };

        this.start = function (callback) {
            callback.frameCount = 0;
            if (render.indexOf(callback) === -1) render.push(callback);
            if (render.length && !rendering) {
                rendering = true;
                window.requestAnimationFrame(step);
                window.events.add(Events.BROWSER_FOCUS, focus);
            }
        };

        this.stop = function (callback) {
            render.findAndRemove(callback);
        };
    }(); // Singleton static pattern

    /**
     * Interpolation helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Interpolation = new // Singleton static pattern

    function Interpolation() {
        var _this4 = this;

        _classCallCheck(this, Interpolation);

        this.convertEase = function (ease) {
            return function () {
                var fn = void 0;
                switch (ease) {
                    case 'easeInQuad':
                        fn = _this4.Quad.In;
                        break;
                    case 'easeInCubic':
                        fn = _this4.Cubic.In;
                        break;
                    case 'easeInQuart':
                        fn = _this4.Quart.In;
                        break;
                    case 'easeInQuint':
                        fn = _this4.Quint.In;
                        break;
                    case 'easeInSine':
                        fn = _this4.Sine.In;
                        break;
                    case 'easeInExpo':
                        fn = _this4.Expo.In;
                        break;
                    case 'easeInCirc':
                        fn = _this4.Circ.In;
                        break;
                    case 'easeInElastic':
                        fn = _this4.Elastic.In;
                        break;
                    case 'easeInBack':
                        fn = _this4.Back.In;
                        break;
                    case 'easeInBounce':
                        fn = _this4.Bounce.In;
                        break;
                    case 'easeOutQuad':
                        fn = _this4.Quad.Out;
                        break;
                    case 'easeOutCubic':
                        fn = _this4.Cubic.Out;
                        break;
                    case 'easeOutQuart':
                        fn = _this4.Quart.Out;
                        break;
                    case 'easeOutQuint':
                        fn = _this4.Quint.Out;
                        break;
                    case 'easeOutSine':
                        fn = _this4.Sine.Out;
                        break;
                    case 'easeOutExpo':
                        fn = _this4.Expo.Out;
                        break;
                    case 'easeOutCirc':
                        fn = _this4.Circ.Out;
                        break;
                    case 'easeOutElastic':
                        fn = _this4.Elastic.Out;
                        break;
                    case 'easeOutBack':
                        fn = _this4.Back.Out;
                        break;
                    case 'easeOutBounce':
                        fn = _this4.Bounce.Out;
                        break;
                    case 'easeInOutQuad':
                        fn = _this4.Quad.InOut;
                        break;
                    case 'easeInOutCubic':
                        fn = _this4.Cubic.InOut;
                        break;
                    case 'easeInOutQuart':
                        fn = _this4.Quart.InOut;
                        break;
                    case 'easeInOutQuint':
                        fn = _this4.Quint.InOut;
                        break;
                    case 'easeInOutSine':
                        fn = _this4.Sine.InOut;
                        break;
                    case 'easeInOutExpo':
                        fn = _this4.Expo.InOut;
                        break;
                    case 'easeInOutCirc':
                        fn = _this4.Circ.InOut;
                        break;
                    case 'easeInOutElastic':
                        fn = _this4.Elastic.InOut;
                        break;
                    case 'easeInOutBack':
                        fn = _this4.Back.InOut;
                        break;
                    case 'easeInOutBounce':
                        fn = _this4.Bounce.InOut;
                        break;
                    case 'linear':
                        fn = _this4.Linear.None;
                        break;
                }
                return fn;
            }() || _this4.Cubic.Out;
        };

        this.Linear = {
            None: function None(k) {
                return k;
            }
        };

        this.Quad = {
            In: function In(k) {
                return k * k;
            },
            Out: function Out(k) {
                return k * (2 - k);
            },
            InOut: function InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            }
        };

        this.Cubic = {
            In: function In(k) {
                return k * k * k;
            },
            Out: function Out(k) {
                return --k * k * k + 1;
            },
            InOut: function InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k;
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        };

        this.Quart = {
            In: function In(k) {
                return k * k * k * k;
            },
            Out: function Out(k) {
                return 1 - --k * k * k * k;
            },
            InOut: function InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k;
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }
        };

        this.Quint = {
            In: function In(k) {
                return k * k * k * k * k;
            },
            Out: function Out(k) {
                return --k * k * k * k * k + 1;
            },
            InOut: function InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }
        };

        this.Sine = {
            In: function In(k) {
                return 1 - Math.cos(k * Math.PI / 2);
            },
            Out: function Out(k) {
                return Math.sin(k * Math.PI / 2);
            },
            InOut: function InOut(k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        };

        this.Expo = {
            In: function In(k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            },
            Out: function Out(k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            },
            InOut: function InOut(k) {
                if (k === 0) return 0;
                if (k === 1) return 1;
                if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        };

        this.Circ = {
            In: function In(k) {
                return 1 - Math.sqrt(1 - k * k);
            },
            Out: function Out(k) {
                return Math.sqrt(1 - --k * k);
            },
            InOut: function InOut(k) {
                if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        };

        this.Elastic = {
            In: function In(k) {
                var s = void 0,
                    a = 0.1,
                    p = 0.4;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            },
            Out: function Out(k) {
                var s = void 0,
                    a = 0.1,
                    p = 0.4;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
            },
            InOut: function InOut(k) {
                var s = void 0,
                    a = 0.1,
                    p = 0.4;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
            }
        };

        this.Back = {
            In: function In(k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            },
            Out: function Out(k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            },
            InOut: function InOut(k) {
                var s = 1.70158 * 1.525;
                if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        };

        this.Bounce = {
            In: function In(k) {
                return 1 - this.Bounce.Out(1 - k);
            },
            Out: function Out(k) {
                if (k < 1 / 2.75) return 7.5625 * k * k;else if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;else if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;else return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            },
            InOut: function InOut(k) {
                if (k < 0.5) return this.Bounce.In(k * 2) * 0.5;
                return this.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        };
    }(); // Singleton static pattern

    /**
     * Mathematical.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var MathTween = function MathTween(object, props, time, ease, delay, update, callback) {
        _classCallCheck(this, MathTween);

        var self = this;
        var startTime = void 0,
            startValues = void 0,
            endValues = void 0,
            paused = void 0,
            elapsed = void 0;

        start();

        function killed() {
            return !self || self.kill || !object;
        }

        function start() {
            if (killed()) return;
            if (!object.multiTween && object.mathTween) {
                object.mathTween.kill = true;
                TweenManager.clearTween(object);
            }
            TweenManager.addMathTween(self);
            object.mathTween = self;
            ease = Interpolation.convertEase(ease);
            startTime = Date.now();
            startTime += delay;
            endValues = props;
            startValues = {};
            for (var prop in endValues) {
                if (typeof object[prop] === 'number') startValues[prop] = object[prop];
            }
        }

        function clear(stop) {
            if (killed()) return;
            self.kill = true;
            if (!stop) {
                for (var prop in endValues) {
                    if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
                }if (object.transform) object.transform();
            }
            TweenManager.removeMathTween(self);
            object.mathTween = null;
        }

        this.update = function (t) {
            if (killed()) return;
            if (paused || t < startTime) return;
            elapsed = (t - startTime) / time;
            elapsed = elapsed > 1 ? 1 : elapsed;
            var delta = ease(elapsed);
            for (var prop in startValues) {
                if (typeof startValues[prop] === 'number') {
                    var _start = startValues[prop],
                        end = endValues[prop];
                    object[prop] = _start + (end - _start) * delta;
                }
            }
            if (update) update(delta);
            if (elapsed === 1) {
                clear();
                if (callback) callback();
            }
            if (object.transform) object.transform();
        };

        this.pause = function () {
            paused = true;
        };

        this.resume = function () {
            paused = false;
            startTime = Date.now() - elapsed * time;
        };

        this.stop = function () {
            return clear(true);
        };
    };

    /**
     * Spring math.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var SpringTween = function SpringTween(object, props, friction, ease, delay, update, callback) {
        _classCallCheck(this, SpringTween);

        var self = this;
        var startTime = void 0,
            velocityValues = void 0,
            endValues = void 0,
            startValues = void 0,
            damping = void 0,
            count = void 0,
            paused = void 0;

        start();

        function killed() {
            return !self || self.kill || !object;
        }

        function start() {
            if (killed()) return;
            if (!object.multiTween && object.mathTween) {
                object.mathTween.kill = true;
                TweenManager.clearTween(object);
            }
            TweenManager.addMathTween(self);
            object.mathTween = self;
            startTime = Date.now();
            startTime += delay;
            endValues = {};
            startValues = {};
            velocityValues = {};
            if (props.x || props.y || props.z) {
                if (typeof props.x === 'undefined') props.x = object.x;
                if (typeof props.y === 'undefined') props.y = object.y;
                if (typeof props.z === 'undefined') props.z = object.z;
            }
            count = 0;
            damping = props.damping || 0.1;
            delete props.damping;
            for (var prop in props) {
                if (typeof props[prop] === 'number') {
                    velocityValues[prop] = 0;
                    endValues[prop] = props[prop];
                }
            }
            for (var _prop in props) {
                if (typeof object[_prop] === 'number') {
                    startValues[_prop] = object[_prop] || 0;
                    props[_prop] = startValues[_prop];
                }
            }
        }

        function clear(stop) {
            if (killed()) return;
            self.kill = true;
            if (!stop) {
                for (var prop in endValues) {
                    if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
                }if (object.transform) object.transform();
            }
            TweenManager.removeMathTween(self);
            object.mathTween = null;
        }

        this.update = function (t) {
            if (killed()) return;
            if (paused || t < startTime) return;
            var vel = void 0;
            for (var prop in startValues) {
                if (typeof startValues[prop] === 'number') {
                    var end = endValues[prop],
                        val = props[prop],
                        d = end - val,
                        a = d * damping;
                    velocityValues[prop] += a;
                    velocityValues[prop] *= friction;
                    props[prop] += velocityValues[prop];
                    object[prop] = props[prop];
                    vel = velocityValues[prop];
                }
            }
            if (update) update(t);
            if (Math.abs(vel) < 0.001) {
                count++;
                if (count > 30) {
                    clear();
                    if (callback) callback();
                }
            }
            if (object.transform) object.transform();
        };

        this.pause = function () {
            paused = true;
        };

        this.stop = function () {
            return clear(true);
        };
    };

    /**
     * Tween helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var TweenManager = new ( // Singleton static pattern

    function () {
        function TweenManager() {
            _classCallCheck(this, TweenManager);

            this.TRANSFORMS = ['x', 'y', 'z', 'scale', 'scaleX', 'scaleY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'skewX', 'skewY', 'perspective'];
            this.CSS_EASES = {
                easeOutCubic: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                easeOutQuad: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                easeOutQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
                easeOutQuint: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
                easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
                easeOutExpo: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                easeOutCirc: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
                easeOutBack: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
                easeInCubic: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
                easeInQuad: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
                easeInQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
                easeInQuint: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                easeInSine: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
                easeInCirc: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
                easeInBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
                easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                easeInOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
                easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
                easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
                easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
                easeInOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
                easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
                easeInOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
                easeInOut: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
                linear: 'linear'
            };
            var tweens = [],
                rendering = false;

            var updateTweens = function updateTweens(t) {
                if (tweens.length) {
                    for (var i = 0; i < tweens.length; i++) {
                        tweens[i].update(t);
                    }
                } else {
                    rendering = false;
                    Render.stop(updateTweens);
                }
            };

            this.addMathTween = function (tween) {
                tweens.push(tween);
                if (!rendering) {
                    rendering = true;
                    Render.start(updateTweens);
                }
            };

            this.removeMathTween = function (tween) {
                tweens.findAndRemove(tween);
            };
        }

        _createClass(TweenManager, [{
            key: 'tween',
            value: function tween(object, props, time, ease, delay, callback, update) {
                if (typeof delay !== 'number') {
                    update = callback;
                    callback = delay;
                    delay = 0;
                }
                var promise = null;
                if (typeof Promise !== 'undefined') {
                    promise = Promise.create();
                    if (callback) promise.then(callback);
                    callback = promise.resolve;
                }
                var tween = ease === 'spring' ? new SpringTween(object, props, time, ease, delay, update, callback) : new MathTween(object, props, time, ease, delay, update, callback);
                return promise || tween;
            }
        }, {
            key: 'clearTween',
            value: function clearTween(object) {
                if (object.mathTween) object.mathTween.stop();
            }
        }, {
            key: 'clearCSSTween',
            value: function clearCSSTween(object) {
                if (object.cssTween) object.cssTween.stop();
            }
        }, {
            key: 'checkTransform',
            value: function checkTransform(key) {
                return this.TRANSFORMS.indexOf(key) > -1;
            }
        }, {
            key: 'getEase',
            value: function getEase(name) {
                return this.CSS_EASES[name] || this.CSS_EASES.easeOutCubic;
            }
        }, {
            key: 'getAllTransforms',
            value: function getAllTransforms(object) {
                var obj = {};
                for (var i = this.TRANSFORMS.length - 1; i > -1; i--) {
                    var key = this.TRANSFORMS[i],
                        val = object[key];
                    if (val !== 0 && typeof val === 'number') obj[key] = val;
                }
                return obj;
            }
        }, {
            key: 'parseTransform',
            value: function parseTransform(props) {
                var transforms = '';
                if (typeof props.x !== 'undefined' || typeof props.y !== 'undefined' || typeof props.z !== 'undefined') {
                    var x = props.x || 0,
                        y = props.y || 0,
                        z = props.z || 0,
                        translate = '';
                    translate += x + 'px, ';
                    translate += y + 'px, ';
                    translate += z + 'px';
                    transforms += 'translate3d(' + translate + ')';
                }
                if (typeof props.scale !== 'undefined') {
                    transforms += 'scale(' + props.scale + ')';
                } else {
                    if (typeof props.scaleX !== 'undefined') transforms += 'scaleX(' + props.scaleX + ')';
                    if (typeof props.scaleY !== 'undefined') transforms += 'scaleY(' + props.scaleY + ')';
                }
                if (typeof props.rotation !== 'undefined') transforms += 'rotate(' + props.rotation + 'deg)';
                if (typeof props.rotationX !== 'undefined') transforms += 'rotateX(' + props.rotationX + 'deg)';
                if (typeof props.rotationY !== 'undefined') transforms += 'rotateY(' + props.rotationY + 'deg)';
                if (typeof props.rotationZ !== 'undefined') transforms += 'rotateZ(' + props.rotationZ + 'deg)';
                if (typeof props.skewX !== 'undefined') transforms += 'skewX(' + props.skewX + 'deg)';
                if (typeof props.skewY !== 'undefined') transforms += 'skewY(' + props.skewY + 'deg)';
                if (typeof props.perspective !== 'undefined') transforms += 'perspective(' + props.perspective + 'px)';
                return transforms;
            }
        }]);

        return TweenManager;
    }())(); // Singleton static pattern

    /**
     * CSS3 transition animation.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CSSTransition = function CSSTransition(object, props, time, ease, delay, callback) {
        _classCallCheck(this, CSSTransition);

        var self = this;
        var transform = TweenManager.getAllTransforms(object),
            properties = [];

        initProperties();
        initCSSTween();

        function killed() {
            return !self || self.kill || !object || !object.element;
        }

        function initProperties() {
            for (var key in props) {
                if (TweenManager.checkTransform(key)) {
                    transform.use = true;
                    transform[key] = props[key];
                    delete props[key];
                } else {
                    if (typeof props[key] === 'number' || key.indexOf('-') > -1) properties.push(key);
                }
            }
            if (transform.use) properties.push(Device.transformProperty);
            delete transform.use;
        }

        function initCSSTween() {
            if (killed()) return;
            if (object.cssTween) object.cssTween.kill = true;
            object.cssTween = self;
            var transition = '';
            for (var i = 0; i < properties.length; i++) {
                transition += (transition.length ? ', ' : '') + properties[i] + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
            }Delayed(function () {
                if (killed()) return;
                object.element.style[Device.vendor('Transition')] = transition;
                object.css(props);
                object.transform(transform);
                Delayed(function () {
                    if (killed()) return;
                    clear();
                    if (callback) callback();
                }, time + delay);
            }, 50);
        }

        function clear() {
            if (killed()) return;
            self.kill = true;
            object.element.style[Device.vendor('Transition')] = '';
            object.cssTween = null;
            Utils.nullObject(self);
        }

        this.stop = function () {
            return clear();
        };
    };

    /**
     * Alien interface.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Interface = function () {
        function Interface(name) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
            var detached = arguments[2];

            _classCallCheck(this, Interface);

            this.events = new EventManager();
            if (typeof name !== 'string') {
                this.element = name;
            } else {
                this.name = name;
                this.type = type;
                if (this.type === 'svg') {
                    var qualifiedName = detached || 'svg';
                    detached = true;
                    this.element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
                    this.element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
                } else {
                    this.element = document.createElement(this.type);
                    if (name[0] !== '.') this.element.id = name;else this.element.className = name.substr(1);
                }
                this.element.style.position = 'absolute';
                if (!detached) (window.Alien && window.Alien.Stage ? window.Alien.Stage : document.body).appendChild(this.element);
            }
            this.element.object = this;
        }

        _createClass(Interface, [{
            key: 'initClass',
            value: function initClass(object) {
                for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
                    params[_key3 - 1] = arguments[_key3];
                }

                var child = new (Function.prototype.bind.apply(object, [null].concat(params)))();
                this.add(child);
                return child;
            }
        }, {
            key: 'clone',
            value: function clone() {
                return new Interface(this.element.cloneNode(true));
            }
        }, {
            key: 'create',
            value: function create(name, type) {
                var child = new Interface(name, type);
                this.add(child);
                return child;
            }
        }, {
            key: 'empty',
            value: function empty() {
                this.element.innerHTML = '';
                return this;
            }
        }, {
            key: 'add',
            value: function add(child) {
                if (child.element) {
                    this.element.appendChild(child.element);
                    child.parent = this;
                } else if (child.nodeName) {
                    this.element.appendChild(child);
                }
                return this;
            }
        }, {
            key: 'remove',
            value: function remove(child) {
                if (child.element) child.destroy();else if (child.nodeName) child.parentNode.removeChild(child);
                return this;
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                if (this.loop) Render.stop(this.loop);
                this.events = this.events.destroy();
                this.removed = true;
                var parent = this.parent;
                if (parent && !parent.removed && parent.remove) parent.remove(this.element);
                return Utils.nullObject(this);
            }
        }, {
            key: 'text',
            value: function text(_text) {
                if (typeof _text === 'undefined') return this.element.textContent;else this.element.textContent = _text;
                return this;
            }
        }, {
            key: 'html',
            value: function html(text) {
                if (typeof text === 'undefined') return this.element.innerHTML;else this.element.innerHTML = text;
                return this;
            }
        }, {
            key: 'hide',
            value: function hide() {
                this.element.style.display = 'none';
                return this;
            }
        }, {
            key: 'show',
            value: function show() {
                this.element.style.display = '';
                return this;
            }
        }, {
            key: 'visible',
            value: function visible() {
                this.element.style.visibility = 'visible';
                return this;
            }
        }, {
            key: 'invisible',
            value: function invisible() {
                this.element.style.visibility = 'hidden';
                return this;
            }
        }, {
            key: 'setZ',
            value: function setZ(z) {
                this.element.style.zIndex = z;
                return this;
            }
        }, {
            key: 'clearAlpha',
            value: function clearAlpha() {
                this.element.style.opacity = '';
                return this;
            }
        }, {
            key: 'size',
            value: function size(w, h) {
                if (typeof w !== 'undefined') {
                    if (typeof h === 'undefined') h = w;
                    if (typeof w === 'string') {
                        if (typeof h !== 'string') h = h + 'px';
                        this.element.style.width = w;
                        this.element.style.height = h;
                    } else {
                        this.element.style.width = w + 'px';
                        this.element.style.height = h + 'px';
                        this.element.style.backgroundSize = w + 'px ' + h + 'px';
                    }
                }
                this.width = this.element.offsetWidth;
                this.height = this.element.offsetHeight;
                return this;
            }
        }, {
            key: 'mouseEnabled',
            value: function mouseEnabled(bool) {
                this.element.style.pointerEvents = bool ? 'auto' : 'none';
                return this;
            }
        }, {
            key: 'fontStyle',
            value: function fontStyle(fontFamily, fontSize, color, _fontStyle) {
                this.css({ fontFamily: fontFamily, fontSize: fontSize, color: color, fontStyle: _fontStyle });
                return this;
            }
        }, {
            key: 'bg',
            value: function bg(src, x, y, repeat) {
                if (src.indexOf('.') > -1 || src.indexOf('data:') > -1) this.element.style.backgroundImage = 'url(' + src + ')';else this.element.style.backgroundColor = src;
                if (typeof x !== 'undefined') {
                    x = typeof x === 'number' ? x + 'px' : x;
                    y = typeof y === 'number' ? y + 'px' : y;
                    this.element.style.backgroundPosition = x + ' ' + y;
                }
                if (repeat) {
                    this.element.style.backgroundSize = '';
                    this.element.style.backgroundRepeat = repeat;
                }
                if (x === 'cover' || x === 'contain') {
                    this.element.style.backgroundSize = x;
                    this.element.style.backgroundRepeat = 'no-repeat';
                    this.element.style.backgroundPosition = typeof y !== 'undefined' ? y + ' ' + repeat : 'center';
                }
                return this;
            }
        }, {
            key: 'center',
            value: function center(x, y, noPos) {
                var css = {};
                if (typeof x === 'undefined') {
                    css.left = '50%';
                    css.top = '50%';
                    css.marginLeft = -this.width / 2;
                    css.marginTop = -this.height / 2;
                } else {
                    if (x) {
                        css.left = '50%';
                        css.marginLeft = -this.width / 2;
                    }
                    if (y) {
                        css.top = '50%';
                        css.marginTop = -this.height / 2;
                    }
                }
                if (noPos) {
                    delete css.left;
                    delete css.top;
                }
                this.css(css);
                return this;
            }
        }, {
            key: 'mask',
            value: function mask(src) {
                this.element.style[Device.vendor('Mask')] = (src.indexOf('.') > -1 ? 'url(' + src + ')' : src) + ' no-repeat';
                this.element.style[Device.vendor('MaskSize')] = 'contain';
                return this;
            }
        }, {
            key: 'blendMode',
            value: function blendMode(mode, bg) {
                this.element.style[bg ? 'background-blend-mode' : 'mix-blend-mode'] = mode;
                return this;
            }
        }, {
            key: 'css',
            value: function css(props, value) {
                if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') {
                    if (!value) {
                        var style = this.element.style[props];
                        if (typeof style !== 'number') {
                            if (style.indexOf('px') > -1) style = Number(style.slice(0, -2));
                            if (props === 'opacity') style = !isNaN(Number(this.element.style.opacity)) ? Number(this.element.style.opacity) : 1;
                        }
                        if (!style) style = 0;
                        return style;
                    } else {
                        this.element.style[props] = value;
                        return this;
                    }
                }
                for (var key in props) {
                    var val = props[key];
                    if (!(typeof val === 'string' || typeof val === 'number')) continue;
                    if (typeof val !== 'string' && key !== 'opacity' && key !== 'zIndex') val += 'px';
                    this.element.style[key] = val;
                }
                return this;
            }
        }, {
            key: 'transform',
            value: function transform(props) {
                if (!props) props = this;else for (var key in props) {
                    if (typeof props[key] === 'number') this[key] = props[key];
                }this.element.style[Device.vendor('Transform')] = TweenManager.parseTransform(props);
                return this;
            }
        }, {
            key: 'enable3D',
            value: function enable3D(perspective, x, y) {
                this.element.style[Device.vendor('TransformStyle')] = 'preserve-3d';
                if (perspective) this.element.style[Device.vendor('Perspective')] = perspective + 'px';
                if (typeof x !== 'undefined') {
                    x = typeof x === 'number' ? x + 'px' : x;
                    y = typeof y === 'number' ? y + 'px' : y;
                    this.element.style[Device.vendor('PerspectiveOrigin')] = x + ' ' + y;
                }
                return this;
            }
        }, {
            key: 'disable3D',
            value: function disable3D() {
                this.element.style[Device.vendor('TransformStyle')] = '';
                this.element.style[Device.vendor('Perspective')] = '';
                return this;
            }
        }, {
            key: 'transformPoint',
            value: function transformPoint(x, y, z) {
                var origin = '';
                if (typeof x !== 'undefined') origin += typeof x === 'number' ? x + 'px ' : x + ' ';
                if (typeof y !== 'undefined') origin += typeof y === 'number' ? y + 'px ' : y + ' ';
                if (typeof z !== 'undefined') origin += typeof z === 'number' ? z + 'px' : z;
                this.element.style[Device.vendor('TransformOrigin')] = origin;
                return this;
            }
        }, {
            key: 'tween',
            value: function tween(props, time, ease, delay, callback) {
                if (typeof delay !== 'number') {
                    callback = delay;
                    delay = 0;
                }
                var promise = null;
                if (typeof Promise !== 'undefined') {
                    promise = Promise.create();
                    if (callback) promise.then(callback);
                    callback = promise.resolve;
                }
                var tween = new CSSTransition(this, props, time, ease, delay, callback);
                return promise || tween;
            }
        }, {
            key: 'clearTransform',
            value: function clearTransform() {
                if (typeof this.x === 'number') this.x = 0;
                if (typeof this.y === 'number') this.y = 0;
                if (typeof this.z === 'number') this.z = 0;
                if (typeof this.scale === 'number') this.scale = 1;
                if (typeof this.scaleX === 'number') this.scaleX = 1;
                if (typeof this.scaleY === 'number') this.scaleY = 1;
                if (typeof this.rotation === 'number') this.rotation = 0;
                if (typeof this.rotationX === 'number') this.rotationX = 0;
                if (typeof this.rotationY === 'number') this.rotationY = 0;
                if (typeof this.rotationZ === 'number') this.rotationZ = 0;
                if (typeof this.skewX === 'number') this.skewX = 0;
                if (typeof this.skewY === 'number') this.skewY = 0;
                this.element.style[Device.transformProperty] = '';
                return this;
            }
        }, {
            key: 'stopTween',
            value: function stopTween() {
                if (this.cssTween) this.cssTween.stop();
                if (this.mathTween) this.mathTween.stop();
                return this;
            }
        }, {
            key: 'attr',
            value: function attr(_attr, value) {
                if (typeof value === 'undefined') return this.element.getAttribute(_attr);else if (value === '') this.element.removeAttribute(_attr);else this.element.setAttribute(_attr, value);
                return this;
            }
        }, {
            key: 'svgSymbol',
            value: function svgSymbol(id, width, height) {
                /* eslint-disable no-undef */
                if (typeof SVGSymbol !== 'undefined') {
                    var config = SVGSymbol.getConfig(id);
                    this.html('<svg viewBox="0 0 ' + config.width + ' ' + config.height + '" width="' + width + '" height="' + height + '"><use xlink:href="#' + config.id + '" x="0" y="0"/></svg>');
                }
                /* eslint-enable no-undef */
            }
        }, {
            key: 'startRender',
            value: function startRender(callback) {
                this.loop = callback;
                Render.start(callback);
            }
        }, {
            key: 'stopRender',
            value: function stopRender(callback) {
                this.loop = null;
                Render.stop(callback);
            }
        }, {
            key: 'click',
            value: function click(callback) {
                var _this5 = this;

                var clicked = function clicked(e) {
                    e.object = _this5.element.className === 'hit' ? _this5.parent : _this5;
                    e.action = 'click';
                    if (callback) callback(e);
                };
                this.element.addEventListener('click', clicked);
                this.element.style.cursor = 'pointer';
                return this;
            }
        }, {
            key: 'hover',
            value: function hover(callback) {
                var _this6 = this;

                var hovered = function hovered(e) {
                    e.object = _this6.element.className === 'hit' ? _this6.parent : _this6;
                    e.action = e.type === 'mouseout' ? 'out' : 'over';
                    if (callback) callback(e);
                };
                this.element.addEventListener('mouseover', hovered);
                this.element.addEventListener('mouseout', hovered);
                return this;
            }
        }, {
            key: 'press',
            value: function press(callback) {
                var _this7 = this;

                var pressed = function pressed(e) {
                    e.object = _this7.element.className === 'hit' ? _this7.parent : _this7;
                    e.action = e.type === 'mousedown' ? 'down' : 'up';
                    if (callback) callback(e);
                };
                this.element.addEventListener('mousedown', pressed);
                this.element.addEventListener('mouseup', pressed);
                return this;
            }
        }, {
            key: 'bind',
            value: function bind(event, callback) {
                if (event === 'touchstart' && !Device.mobile) event = 'mousedown';else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
                this.element.addEventListener(event, callback);
                return this;
            }
        }, {
            key: 'unbind',
            value: function unbind(event, callback) {
                if (event === 'touchstart' && !Device.mobile) event = 'mousedown';else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
                this.element.removeEventListener(event, callback);
                return this;
            }
        }, {
            key: 'interact',
            value: function interact(overCallback, clickCallback) {
                this.hit = this.create('.hit').css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 99999
                });
                if (Device.mobile) this.hit.touchClick(overCallback, clickCallback);else this.hit.hover(overCallback).click(clickCallback);
                return this;
            }
        }, {
            key: 'touchClick',
            value: function touchClick(hover, click) {
                var _this8 = this;

                var time = void 0,
                    move = void 0,
                    start = {},
                    touch = {};
                var touchMove = function touchMove(e) {
                    touch = Utils.touchEvent(e);
                    move = Utils.findDistance(start, touch) > 5;
                };
                var setTouch = function setTouch(e) {
                    var touch = Utils.touchEvent(e);
                    e.touchX = touch.x;
                    e.touchY = touch.y;
                    start.x = e.touchX;
                    start.y = e.touchY;
                };
                var touchStart = function touchStart(e) {
                    time = Date.now();
                    e.action = 'over';
                    e.object = _this8.element.className === 'hit' ? _this8.parent : _this8;
                    setTouch(e);
                    if (hover && !move) hover(e);
                };
                var touchEnd = function touchEnd(e) {
                    var t = Date.now();
                    e.object = _this8.element.className === 'hit' ? _this8.parent : _this8;
                    setTouch(e);
                    if (time && t - time < 750) {
                        if (click && !move) {
                            e.action = 'click';
                            if (click && !move) click(e);
                        }
                    }
                    if (hover) {
                        e.action = 'out';
                        hover(e);
                    }
                    move = false;
                };
                this.element.addEventListener('touchmove', touchMove, { passive: true });
                this.element.addEventListener('touchstart', touchStart, { passive: true });
                this.element.addEventListener('touchend', touchEnd, { passive: true });
                return this;
            }
        }, {
            key: 'split',
            value: function split() {
                var by = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                var style = {
                    position: 'relative',
                    display: 'block',
                    width: 'auto',
                    height: 'auto',
                    margin: 0,
                    padding: 0,
                    cssFloat: 'left'
                },
                    array = [],
                    split = this.text().split(by);
                this.empty();
                for (var i = 0; i < split.length; i++) {
                    if (split[i] === ' ') split[i] = '&nbsp;';
                    array.push(this.create('.t', 'span').html(split[i]).css(style));
                    if (by !== '' && i < split.length - 1) array.push(this.create('.t', 'span').html(by).css(style));
                }
                return array;
            }
        }]);

        return Interface;
    }();

    /**
     * Canvas interface.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Canvas = function () {
        function Canvas(w) {
            var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;
            var retina = arguments[2];

            _classCallCheck(this, Canvas);

            this.element = document.createElement('canvas');
            this.context = this.element.getContext('2d');
            this.object = new Interface(this.element);
            this.children = [];
            this.retina = retina;
            this.size(w, h, retina);
        }

        _createClass(Canvas, [{
            key: 'size',
            value: function size(w, h, retina) {
                var ratio = retina ? 2 : 1;
                this.element.width = w * ratio;
                this.element.height = h * ratio;
                this.width = w;
                this.height = h;
                this.scale = ratio;
                this.object.size(this.width, this.height);
                this.context.scale(ratio, ratio);
                this.element.style.width = w + 'px';
                this.element.style.height = h + 'px';
            }
        }, {
            key: 'toDataURL',
            value: function toDataURL(type, quality) {
                return this.element.toDataURL(type, quality);
            }
        }, {
            key: 'render',
            value: function render(noClear) {
                if (!(typeof noClear === 'boolean' && noClear)) this.clear();
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].render();
                }
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.context.clearRect(0, 0, this.element.width, this.element.height);
            }
        }, {
            key: 'add',
            value: function add(display) {
                display.setCanvas(this);
                display.parent = this;
                this.children.push(display);
                display.z = this.children.length;
            }
        }, {
            key: 'remove',
            value: function remove(display) {
                display.canvas = null;
                display.parent = null;
                this.children.findAndRemove(display);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].destroy();
                }return this.object = this.object.destroy();
            }
        }, {
            key: 'getImageData',
            value: function getImageData() {
                var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.element.width;
                var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.element.height;

                this.imageData = this.context.getImageData(x, y, w, h);
                return this.imageData;
            }
        }, {
            key: 'getPixel',
            value: function getPixel(x, y, dirty) {
                if (!this.imageData || dirty) this.getImageData();
                var imgData = {},
                    index = (x + y * this.element.width) * 4,
                    pixels = this.imageData.data;
                imgData.r = pixels[index];
                imgData.g = pixels[index + 1];
                imgData.b = pixels[index + 2];
                imgData.a = pixels[index + 3];
                return imgData;
            }
        }, {
            key: 'putImageData',
            value: function putImageData(imageData) {
                this.context.putImageData(imageData, 0, 0);
            }
        }]);

        return Canvas;
    }();

    /**
     * Canvas values.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasValues = function () {
        function CanvasValues(style) {
            _classCallCheck(this, CanvasValues);

            this.styles = {};
            if (!style) this.data = new Float32Array(6);else this.styled = false;
        }

        _createClass(CanvasValues, [{
            key: 'setTRSA',
            value: function setTRSA(x, y, r, sx, sy, a) {
                var m = this.data;
                m[0] = x;
                m[1] = y;
                m[2] = r;
                m[3] = sx;
                m[4] = sy;
                m[5] = a;
            }
        }, {
            key: 'calculate',
            value: function calculate(values) {
                var v = values.data,
                    m = this.data;
                m[0] = m[0] + v[0];
                m[1] = m[1] + v[1];
                m[2] = m[2] + v[2];
                m[3] = m[3] * v[3];
                m[4] = m[4] * v[4];
                m[5] = m[5] * v[5];
            }
        }, {
            key: 'calculateStyle',
            value: function calculateStyle(parent) {
                if (!parent.styled) return false;
                this.styled = true;
                var values = parent.values;
                for (var key in values) {
                    if (!this.styles[key]) this.styles[key] = values[key];
                }
            }
        }, {
            key: 'shadowOffsetX',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowOffsetX = val;
            },
            get: function get() {
                return this.styles.shadowOffsetX;
            }
        }, {
            key: 'shadowOffsetY',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowOffsetY = val;
            },
            get: function get() {
                return this.styles.shadowOffsetY;
            }
        }, {
            key: 'shadowBlur',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowBlur = val;
            },
            get: function get() {
                return this.styles.shadowBlur;
            }
        }, {
            key: 'shadowColor',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowColor = val;
            },
            get: function get() {
                return this.styles.shadowColor;
            }
        }, {
            key: 'values',
            get: function get() {
                return this.styles;
            }
        }]);

        return CanvasValues;
    }();

    /**
     * Canvas object.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasObject = function () {
        function CanvasObject() {
            _classCallCheck(this, CanvasObject);

            this.visible = true;
            this.blendMode = 'source-over';
            this.x = 0;
            this.y = 0;
            this.px = 0;
            this.py = 0;
            this.clipX = 0;
            this.clipY = 0;
            this.clipWidth = 0;
            this.clipHeight = 0;
            this.width = 0;
            this.height = 0;
            this.rotation = 0;
            this.scale = 1;
            this.opacity = 1;
            this.values = new CanvasValues();
            this.styles = new CanvasValues(true);
            this.children = [];
        }

        _createClass(CanvasObject, [{
            key: 'updateValues',
            value: function updateValues() {
                this.values.setTRSA(this.x, this.y, Utils.toRadians(this.rotation), this.scaleX || this.scale, this.scaleY || this.scale, this.opacity);
                if (this.parent.values) this.values.calculate(this.parent.values);
                if (this.parent.styles) this.styles.calculateStyle(this.parent.styles);
            }
        }, {
            key: 'render',
            value: function render(override) {
                if (!this.visible) return false;
                this.updateValues();
                if (this.draw) this.draw(override);
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].render(override);
                }
            }
        }, {
            key: 'startDraw',
            value: function startDraw(ox, oy, override) {
                var context = this.canvas.context,
                    v = this.values.data,
                    x = v[0] + (ox || 0),
                    y = v[1] + (oy || 0);
                context.save();
                if (!override) context.globalCompositeOperation = this.blendMode;
                context.translate(x, y);
                context.rotate(v[2]);
                context.scale(v[3], v[4]);
                context.globalAlpha = v[5];
                if (this.styles.styled) {
                    var values = this.styles.values;
                    for (var key in values) {
                        context[key] = values[key];
                    }
                }
            }
        }, {
            key: 'endDraw',
            value: function endDraw() {
                this.canvas.context.restore();
            }
        }, {
            key: 'add',
            value: function add(display) {
                display.canvas = this.canvas;
                display.parent = this;
                this.children.push(display);
                display.z = this.children.length;
                for (var i = this.children.length - 1; i > -1; i--) {
                    this.children[i].setCanvas(this.canvas);
                }
            }
        }, {
            key: 'setCanvas',
            value: function setCanvas(canvas) {
                this.canvas = canvas;
                for (var i = this.children.length - 1; i > -1; i--) {
                    this.children[i].setCanvas(canvas);
                }
            }
        }, {
            key: 'remove',
            value: function remove(display) {
                display.canvas = null;
                display.parent = null;
                this.children.findAndRemove(display);
            }
        }, {
            key: 'isMask',
            value: function isMask() {
                var obj = this;
                while (obj) {
                    if (obj.masked) return true;
                    obj = obj.parent;
                }
                return false;
            }
        }, {
            key: 'unmask',
            value: function unmask() {
                this.masked.mask(null);
                this.masked = null;
            }
        }, {
            key: 'setZ',
            value: function setZ(z) {
                this.z = z;
                this.parent.children.sort(function (a, b) {
                    return a.z - b.z;
                });
            }
        }, {
            key: 'follow',
            value: function follow(object) {
                this.x = object.x;
                this.y = object.y;
                this.px = object.px;
                this.py = object.py;
                this.clipX = object.clipX;
                this.clipY = object.clipY;
                this.clipWidth = object.clipWidth;
                this.clipHeight = object.clipHeight;
                this.width = object.width;
                this.height = object.height;
                this.rotation = object.rotation;
                this.scale = object.scale;
                this.scaleX = object.scaleX || object.scale;
                this.scaleY = object.scaleY || object.scale;
                return this;
            }
        }, {
            key: 'visible',
            value: function visible() {
                this.visible = true;
                return this;
            }
        }, {
            key: 'invisible',
            value: function invisible() {
                this.visible = false;
                return this;
            }
        }, {
            key: 'transform',
            value: function transform(props) {
                for (var key in props) {
                    if (typeof props[key] === 'number') this[key] = props[key];
                }return this;
            }
        }, {
            key: 'transformPoint',
            value: function transformPoint(x, y) {
                this.px = typeof x === 'number' ? x : this.width * (parseFloat(x) / 100);
                this.py = typeof y === 'number' ? y : this.height * (parseFloat(y) / 100);
                return this;
            }
        }, {
            key: 'clip',
            value: function clip(x, y, w, h) {
                this.clipX = x;
                this.clipY = y;
                this.clipWidth = w;
                this.clipHeight = h;
                return this;
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].destroy();
                }return Utils.nullObject(this);
            }
        }]);

        return CanvasObject;
    }();

    /**
     * Image helper class with promise method.
     *
     * Currently no CORS support.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Images = new ( // Singleton static pattern

    function () {
        function Images() {
            _classCallCheck(this, Images);
        }

        _createClass(Images, [{
            key: 'createImg',
            value: function createImg(src, callback) {
                var img = new Image();
                img.src = (Config.CDN || '') + src;
                img.onload = function () {
                    if (callback) callback();
                };
                return img;
            }
        }, {
            key: 'promise',
            value: function promise(img) {
                var p = Promise.create();
                img.onload = p.resolve;
                return p;
            }
        }]);

        return Images;
    }())(); // Singleton static pattern

    /**
     * Canvas graphics.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasGraphics = function (_CanvasObject) {
        _inherits(CanvasGraphics, _CanvasObject);

        function CanvasGraphics() {
            var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;

            _classCallCheck(this, CanvasGraphics);

            var _this9 = _possibleConstructorReturn(this, (CanvasGraphics.__proto__ || Object.getPrototypeOf(CanvasGraphics)).call(this));

            var self = _this9;
            _this9.width = w;
            _this9.height = h;
            _this9.props = {};
            var images = {},
                draw = [],
                mask = void 0;

            function setProperties(context) {
                for (var key in self.props) {
                    context[key] = self.props[key];
                }
            }

            _this9.draw = function (override) {
                if (_this9.isMask() && !override) return false;
                var context = _this9.canvas.context;
                _this9.startDraw(_this9.px, _this9.py, override);
                setProperties(context);
                if (_this9.clipWidth && _this9.clipHeight) {
                    context.beginPath();
                    context.rect(_this9.clipX, _this9.clipY, _this9.clipWidth, _this9.clipHeight);
                    context.clip();
                }
                for (var i = 0; i < draw.length; i++) {
                    var cmd = draw[i];
                    if (!cmd) continue;
                    var fn = cmd.shift();
                    context[fn].apply(context, cmd);
                    cmd.unshift(fn);
                }
                _this9.endDraw();
                if (mask) {
                    context.globalCompositeOperation = mask.blendMode;
                    mask.render(true);
                }
            };

            _this9.clear = function () {
                for (var i = 0; i < draw.length; i++) {
                    draw[i].length = 0;
                }draw.length = 0;
            };

            _this9.arc = function () {
                var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var endAngle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _this9.radius || _this9.width / 2;
                var startAngle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
                var counterclockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

                if (x && !y) {
                    endAngle = x;
                    x = 0;
                    y = 0;
                }
                endAngle -= 90;
                startAngle -= 90;
                draw.push(['beginPath']);
                draw.push(['arc', x, y, radius, Utils.toRadians(startAngle), Utils.toRadians(endAngle), counterclockwise]);
            };

            _this9.quadraticCurveTo = function (cpx, cpy, x, y) {
                draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
            };

            _this9.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
            };

            _this9.fillRect = function (x, y, w, h) {
                draw.push(['fillRect', x, y, w, h]);
            };

            _this9.clearRect = function (x, y, w, h) {
                draw.push(['clearRect', x, y, w, h]);
            };

            _this9.strokeRect = function (x, y, w, h) {
                draw.push(['strokeRect', x, y, w, h]);
            };

            _this9.moveTo = function (x, y) {
                draw.push(['moveTo', x, y]);
            };

            _this9.lineTo = function (x, y) {
                draw.push(['lineTo', x, y]);
            };

            _this9.stroke = function () {
                draw.push(['stroke']);
            };

            _this9.fill = function () {
                if (!mask) draw.push(['fill']);
            };

            _this9.beginPath = function () {
                draw.push(['beginPath']);
            };

            _this9.closePath = function () {
                draw.push(['closePath']);
            };

            _this9.fillText = function (text, x, y) {
                draw.push(['fillText', text, x, y]);
            };

            _this9.strokeText = function (text, x, y) {
                draw.push(['strokeText', text, x, y]);
            };

            _this9.setLineDash = function (value) {
                draw.push(['setLineDash', value]);
            };

            _this9.createImage = function (src, force) {
                if (!images[src] || force) {
                    var img = Images.createImg(src);
                    if (force) return img;
                    images[src] = img;
                }
                return images[src];
            };

            _this9.drawImage = function (img) {
                var sx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var sy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var sWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : img.width;
                var sHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : img.height;
                var dx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
                var dy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
                var dWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : img.width;
                var dHeight = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : img.height;

                if (typeof img === 'string') img = _this9.createImage(img);
                draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx + -_this9.px, dy + -_this9.py, dWidth, dHeight]);
            };

            _this9.mask = function (object) {
                if (!object) return mask = null;
                mask = object;
                object.masked = _this9;
                for (var i = 0; i < draw.length; i++) {
                    if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                        draw[i].length = 0;
                        draw.splice(i, 1);
                    }
                }
            };

            _this9.clone = function () {
                var object = new CanvasGraphics(_this9.width, _this9.height);
                object.visible = _this9.visible;
                object.blendMode = _this9.blendMode;
                object.opacity = _this9.opacity;
                object.follow(_this9);
                object.props = Utils.cloneObject(_this9.props);
                object.setDraw(Utils.cloneArray(draw));
                return object;
            };

            _this9.setDraw = function (array) {
                draw = array;
            };
            return _this9;
        }

        _createClass(CanvasGraphics, [{
            key: 'strokeStyle',
            set: function set(val) {
                this.props.strokeStyle = val;
            },
            get: function get() {
                return this.props.strokeStyle;
            }
        }, {
            key: 'fillStyle',
            set: function set(val) {
                this.props.fillStyle = val;
            },
            get: function get() {
                return this.props.fillStyle;
            }
        }, {
            key: 'lineWidth',
            set: function set(val) {
                this.props.lineWidth = val;
            },
            get: function get() {
                return this.props.lineWidth;
            }
        }, {
            key: 'lineCap',
            set: function set(val) {
                this.props.lineCap = val;
            },
            get: function get() {
                return this.props.lineCap;
            }
        }, {
            key: 'lineDashOffset',
            set: function set(val) {
                this.props.lineDashOffset = val;
            },
            get: function get() {
                return this.props.lineDashOffset;
            }
        }, {
            key: 'lineJoin',
            set: function set(val) {
                this.props.lineJoin = val;
            },
            get: function get() {
                return this.props.lineJoin;
            }
        }, {
            key: 'miterLimit',
            set: function set(val) {
                this.props.miterLimit = val;
            },
            get: function get() {
                return this.props.miterLimit;
            }
        }, {
            key: 'font',
            set: function set(val) {
                this.props.font = val;
            },
            get: function get() {
                return this.props.font;
            }
        }, {
            key: 'textAlign',
            set: function set(val) {
                this.props.textAlign = val;
            },
            get: function get() {
                return this.props.textAlign;
            }
        }, {
            key: 'textBaseline',
            set: function set(val) {
                this.props.textBaseline = val;
            },
            get: function get() {
                return this.props.textBaseline;
            }
        }]);

        return CanvasGraphics;
    }(CanvasObject);

    /**
     * Canvas font utilities.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * 3D utilities.
     *
     * Currently no CORS support.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /* global THREE */

    /**
     * Stage reference class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Stage = new ( // Singleton static pattern

    function (_Interface) {
        _inherits(Stage, _Interface);

        function Stage() {
            _classCallCheck(this, Stage);

            var _this10 = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this, 'Stage'));

            var self = _this10;
            var last = void 0;

            initHTML();
            addListeners();
            resizeHandler();

            function initHTML() {
                self.css({ overflow: 'hidden' });
            }

            function addListeners() {
                window.addEventListener('focus', function () {
                    if (last !== 'focus') {
                        last = 'focus';
                        window.events.fire(Events.BROWSER_FOCUS, { type: 'focus' });
                        self.events.fire(Events.BROWSER_FOCUS, { type: 'focus' });
                    }
                });
                window.addEventListener('blur', function () {
                    if (last !== 'blur') {
                        last = 'blur';
                        window.events.fire(Events.BROWSER_FOCUS, { type: 'blur' });
                        self.events.fire(Events.BROWSER_FOCUS, { type: 'blur' });
                    }
                });
                window.addEventListener('keydown', function () {
                    return self.events.fire(Events.KEYBOARD_DOWN);
                });
                window.addEventListener('keyup', function () {
                    return self.events.fire(Events.KEYBOARD_UP);
                });
                window.addEventListener('keypress', function () {
                    return self.events.fire(Events.KEYBOARD_PRESS);
                });
                window.addEventListener('resize', function () {
                    return self.events.fire(Events.RESIZE);
                });
                self.events.add(Events.RESIZE, resizeHandler);
            }

            function resizeHandler() {
                self.size();
                self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            }
            return _this10;
        }

        return Stage;
    }(Interface))(); // Singleton static pattern

    /**
     * Screen projection.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /* global THREE */

    /**
     * Object pool.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * 2D vector.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * 3D vector.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * Mouse helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * Accelerometer helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * XMLHttpRequest helper class with promise support.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var XHR = new // Singleton static pattern

    function XHR() {
        var _this11 = this;

        _classCallCheck(this, XHR);

        this.headers = {};
        this.options = {};
        var serial = [];

        var serialize = function serialize(key, data) {
            if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
                for (var i in data) {
                    var newKey = key + '[' + i + ']';
                    if (_typeof(data[i]) === 'object') serialize(newKey, data[i]);else serial.push(newKey + '=' + data[i]);
                }
            } else {
                serial.push(key + '=' + data);
            }
        };

        this.get = function (url, data, callback, type) {
            if (typeof data === 'function') {
                type = callback;
                callback = data;
                data = null;
            } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
                for (var key in data) {
                    serialize(key, data[key]);
                }data = serial.join('&');
                data = data.replace(/\[/g, '%5B');
                data = data.replace(/\]/g, '%5D');
                serial = null;
                url += '?' + data;
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            if (type === 'arraybuffer') xhr.responseType = 'arraybuffer';
            if (type === 'blob') xhr.responseType = 'blob';
            if (type === 'text') xhr.overrideMimeType('text/plain');
            if (type === 'json') xhr.setRequestHeader('Accept', 'application/json');
            for (var _key4 in _this11.headers) {
                xhr.setRequestHeader(_key4, _this11.headers[_key4]);
            }for (var _key5 in _this11.options) {
                xhr[_key5] = _this11.options[_key5];
            }var promise = null;
            if (typeof Promise !== 'undefined') {
                promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
            }
            xhr.send();
            xhr.onreadystatechange = function () {
                if (callback) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        if (type === 'arraybuffer' || type === 'blob') callback(xhr.response);else if (type === 'text') callback(xhr.responseText);else callback(JSON.parse(xhr.responseText));
                    } else if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                        if (promise) promise.reject(xhr);else callback(xhr);
                    }
                }
            };
            return promise || xhr;
        };

        this.post = function (url, data, callback, type) {
            if (typeof data === 'function') {
                type = callback;
                callback = data;
                data = null;
            } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
                if (type === 'json') {
                    data = JSON.stringify(data);
                } else {
                    for (var key in data) {
                        serialize(key, data[key]);
                    }data = serial.join('&');
                    data = data.replace(/\[/g, '%5B');
                    data = data.replace(/\]/g, '%5D');
                    serial = null;
                }
            }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            if (type === 'arraybuffer') xhr.responseType = 'arraybuffer';
            if (type === 'blob') xhr.responseType = 'blob';
            if (type === 'text') xhr.overrideMimeType('text/plain');
            if (type === 'json') xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded');
            for (var _key6 in _this11.headers) {
                xhr.setRequestHeader(_key6, _this11.headers[_key6]);
            }for (var _key7 in _this11.options) {
                xhr[_key7] = _this11.options[_key7];
            }var promise = null;
            if (typeof Promise !== 'undefined') {
                promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
            }
            xhr.send();
            xhr.onreadystatechange = function () {
                if (callback) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        if (type === 'arraybuffer' || type === 'blob') callback(xhr.response);else if (type === 'text') callback(xhr.responseText);else callback(JSON.parse(xhr.responseText));
                    } else if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                        if (promise) promise.reject(xhr);else callback(xhr);
                    }
                }
            };
            return promise || xhr;
        };
    }(); // Singleton static pattern

    /**
     * Asset loader with promise method.
     *
     * Currently no CORS support.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var AssetLoader = function () {
        function AssetLoader(assets, callback) {
            _classCallCheck(this, AssetLoader);

            if (Array.isArray(assets)) {
                assets = function () {
                    var keys = assets.map(function (path) {
                        return Utils.basename(path);
                    });
                    return keys.reduce(function (o, k, i) {
                        o[k] = assets[i];
                        return o;
                    }, {});
                }();
            }
            var self = this;
            this.events = new EventManager();
            this.CDN = Config.CDN || '';
            var total = Object.keys(assets).length,
                loaded = 0,
                percent = 0;

            for (var key in assets) {
                loadAsset(key, this.CDN + assets[key]);
            }function loadAsset(key, asset) {
                var name = asset.split('/');
                name = name[name.length - 1];
                var split = name.split('.'),
                    ext = split[split.length - 1].split('?')[0];
                switch (ext) {
                    case 'mp3':
                        /* eslint-disable no-undef */
                        if (typeof WebAudio !== 'undefined') {
                            if (!window.AudioContext) return assetLoaded();
                            XHR.get(asset, function (contents) {
                                WebAudio.createSound(key, contents, assetLoaded);
                            }, 'arraybuffer');
                        } else {
                            return assetLoaded();
                        }
                        /* eslint-enable no-undef */
                        break;
                    case 'js':
                        XHR.get(asset, function (script) {
                            script = script.replace('use strict', '');
                            eval.call(window, script);
                            assetLoaded(asset);
                        }, 'text');
                        break;
                    default:
                        Images.createImg(asset, assetLoaded);
                        break;
                }
            }

            function assetLoaded() {
                loaded++;
                percent = loaded / total;
                self.events.fire(Events.PROGRESS, { percent: percent });
                if (loaded === total) {
                    self.complete = true;
                    self.events.fire(Events.COMPLETE);
                    if (callback) callback();
                }
            }
        }

        _createClass(AssetLoader, null, [{
            key: 'loadAssets',
            value: function loadAssets(assets, callback) {
                var promise = Promise.create();
                if (!callback) callback = promise.resolve;
                new AssetLoader(assets, callback);
                return promise;
            }
        }]);

        return AssetLoader;
    }();

    /**
     * Font loader with promise method.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var FontLoader = function () {
        function FontLoader(fonts, callback) {
            _classCallCheck(this, FontLoader);

            var self = this;
            this.events = new EventManager();
            var element = void 0;

            initFonts();
            finish();

            function initFonts() {
                if (!Array.isArray(fonts)) fonts = [fonts];
                element = Stage.create('FontLoader');
                for (var i = 0; i < fonts.length; i++) {
                    element.create('font').fontStyle(fonts[i], 12, '#000').text('LOAD').css({ top: -999 });
                }
            }

            function finish() {
                Delayed(function () {
                    element.destroy();
                    self.complete = true;
                    self.events.fire(Events.COMPLETE);
                    if (callback) callback();
                }, 500);
            }
        }

        _createClass(FontLoader, null, [{
            key: 'loadFonts',
            value: function loadFonts(fonts, callback) {
                var promise = Promise.create();
                if (!callback) callback = promise.resolve;
                new FontLoader(fonts, callback);
                return promise;
            }
        }]);

        return FontLoader;
    }();

    /**
     * SVG interface.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * SVG symbol helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * Storage helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /**
     * Web audio engine.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

    /**
     * @author Patrick Schroen / https://github.com/pschroen
     */

    if (typeof Promise !== 'undefined') Promise.create = function () {
        var resolve = void 0,
            reject = void 0,
            promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        promise.resolve = resolve;
        promise.reject = reject;
        return promise;
    };

    Array.prototype.findAndRemove = function (reference) {
        var index = this.indexOf(reference);
        if (index > -1) return this.splice(index, 1);
    };

    /**
     * Alien abduction point.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    window.getURL = function (url) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_blank';
        return window.open(url, target);
    };
    window.Delayed = function (callback) {
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var params = arguments[2];
        return window.setTimeout(function () {
            if (callback) callback(params);
        }, time);
    };

    if (!window.Global) window.Global = {};
    if (!window.Config) window.Config = {};

    /**
     * Alien.js Example Project.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    Config.UI_COLOR = 'white';

    Config.ASSETS = ['assets/images/alienkitty.svg', 'assets/images/alienkitty_eyelid.svg'];

    var AlienKittyCanvas = function (_Interface2) {
        _inherits(AlienKittyCanvas, _Interface2);

        function AlienKittyCanvas() {
            _classCallCheck(this, AlienKittyCanvas);

            var _this12 = _possibleConstructorReturn(this, (AlienKittyCanvas.__proto__ || Object.getPrototypeOf(AlienKittyCanvas)).call(this, 'AlienKittyCanvas'));

            var self = _this12;
            var canvas = void 0,
                alienkittyimg = void 0,
                eyelidimg = void 0,
                alienkitty = void 0,
                eyelid1 = void 0,
                eyelid2 = void 0;

            initHTML();
            initCanvas();
            initImages();

            function initHTML() {
                self.size(90, 86).center().css({ opacity: 0 });
            }

            function initCanvas() {
                canvas = self.initClass(Canvas, 90, 86, true);
            }

            function initImages() {
                var promise = function promise(img) {
                    var p = Promise.create();
                    img.onload = p.resolve;
                    return p;
                };
                alienkittyimg = Images.createImg('assets/images/alienkitty.svg');
                eyelidimg = Images.createImg('assets/images/alienkitty_eyelid.svg');
                Promise.all([promise(alienkittyimg), promise(eyelidimg)]).then(finishSetup);
            }

            function finishSetup() {
                alienkitty = new CanvasGraphics(90, 86);
                alienkitty.drawImage(alienkittyimg);
                eyelid1 = new CanvasGraphics(24, 14);
                eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
                eyelid1.drawImage(eyelidimg);
                eyelid2 = new CanvasGraphics(24, 14);
                eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
                eyelid2.drawImage(eyelidimg);
                canvas.add(alienkitty);
                canvas.add(eyelid1);
                canvas.add(eyelid2);
            }

            function loop() {
                canvas.render();
            }

            function blink() {
                Delayed(Utils.headsTails(blink1, blink2), Utils.doRandom(0, 10000));
            }

            function blink1() {
                TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', function () {
                    TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
                });
                TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', function () {
                    TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', function () {
                        blink();
                    });
                });
            }

            function blink2() {
                TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', function () {
                    TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
                });
                TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', function () {
                    TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', function () {
                        blink();
                    });
                });
            }

            _this12.animateIn = function () {
                blink();
                _this12.tween({ opacity: 1 }, 500, 'easeOutQuart');
                _this12.startRender(loop);
            };

            _this12.animateOut = function (callback) {
                _this12.tween({ opacity: 0 }, 500, 'easeInOutQuad', function () {
                    self.stopRender(loop);
                    if (callback) callback();
                });
            };
            return _this12;
        }

        return AlienKittyCanvas;
    }(Interface);

    var Progress = function (_Interface3) {
        _inherits(Progress, _Interface3);

        function Progress() {
            _classCallCheck(this, Progress);

            var _this13 = _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).call(this, 'Progress'));

            var self = _this13;
            _this13.progress = 0;
            var canvas = void 0,
                context = void 0,
                size = 90;

            initHTML();
            initCanvas();
            _this13.startRender(loop);

            function initHTML() {
                self.size(size).center();
            }

            function initCanvas() {
                canvas = self.initClass(Canvas, size, size, true);
                context = canvas.context;
                context.lineWidth = 5;
            }

            function loop() {
                if (self.progress >= 1 && !self.complete) complete();
                context.clearRect(0, 0, size, size);
                var progress = self.progress || 0,
                    x = size / 2,
                    y = size / 2,
                    radius = size * 0.4,
                    startAngle = Utils.toRadians(-90),
                    endAngle = Utils.toRadians(-90) + Utils.toRadians(progress * 360);
                context.beginPath();
                context.arc(x, y, radius, startAngle, endAngle, false);
                context.strokeStyle = Config.UI_COLOR;
                context.stroke();
            }

            function complete() {
                self.complete = true;
                self.events.fire(Events.COMPLETE);
                self.stopRender(loop);
            }

            _this13.update = function (e) {
                if (_this13.complete) return;
                TweenManager.tween(_this13, { progress: e.percent }, 500, 'easeOutCubic');
            };

            _this13.animateOut = function (callback) {
                _this13.tween({ scale: 0.9, opacity: 0 }, 400, 'easeInCubic', callback);
            };
            return _this13;
        }

        return Progress;
    }(Interface);

    var Loader = function (_Interface4) {
        _inherits(Loader, _Interface4);

        function Loader() {
            _classCallCheck(this, Loader);

            var _this14 = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this, 'Loader'));

            var self = _this14;
            var loader = void 0,
                progress = void 0;

            initHTML();
            initLoader();
            initProgress();

            function initHTML() {
                self.size('100%');
            }

            function initLoader() {
                loader = new AssetLoader(Config.ASSETS);
                loader.events.add(Events.PROGRESS, loadUpdate);
            }

            function initProgress() {
                progress = self.initClass(Progress);
                progress.events.add(Events.COMPLETE, loadComplete);
            }

            function loadUpdate(e) {
                progress.update(e);
            }

            function loadComplete() {
                FontLoader.loadFonts(['Titillium Web', 'Lato', 'icomoon']).then(function () {
                    self.loaded = true;
                    self.events.fire(Events.COMPLETE);
                });
            }

            _this14.animateOut = function (callback) {
                progress.animateOut(callback);
            };
            return _this14;
        }

        return Loader;
    }(Interface);

    var Main = function Main(_ref) {
        var container = _ref.container;

        _classCallCheck(this, Main);

        container.appendChild(Stage.element);

        var self = this;
        var loader = void 0,
            wrapper = void 0,
            alienkitty = void 0;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%').enable3D(2000);
            wrapper = Stage.create('.wrapper');
            wrapper.size('100%').transform({ z: -300 }).enable3D();
            alienkitty = wrapper.initClass(AlienKittyCanvas);
        }

        function initLoader() {
            loader = Stage.initClass(Loader);
            loader.events.add(Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            self.loaded = true;
            loader.animateOut(function () {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            wrapper.tween({ z: 0 }, 7000, 'easeOutCubic');
            alienkitty.animateIn();
        }
    };

    return Main;
});

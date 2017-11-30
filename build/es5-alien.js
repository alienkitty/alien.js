var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Utils = new ( // Singleton reassignment pattern

function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, [{
        key: 'random',
        value: function random(min, max) {
            var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            if (typeof min === 'undefined') return Math.random();
            if (min === max) return min;
            min = min || 0;
            max = max || 1;
            var p = Math.pow(10, precision);
            return Math.round((min + Math.random() * (max - min)) * p) / p;
        }
    }, {
        key: 'headsTails',
        value: function headsTails(heads, tails) {
            return this.random(0, 1) ? tails : heads;
        }
    }, {
        key: 'queryString',
        value: function queryString(key) {
            var str = decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[.+*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
            if (!str.length || str === '0' || str === 'false') return false;
            return str;
        }
    }, {
        key: 'getConstructorName',
        value: function getConstructorName(object) {
            return object.constructor.name || object.constructor.toString().match(/function ([^(]+)/)[1];
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

            for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
                objects[_key] = arguments[_key];
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
        key: 'toArray',
        value: function toArray(object) {
            return Object.keys(object).map(function (key) {
                return object[key];
            });
        }
    }, {
        key: 'cloneArray',
        value: function cloneArray(array) {
            return array.slice(0);
        }
    }, {
        key: 'basename',
        value: function basename(path, ext) {
            var name = path.split('/').last();
            return !ext ? name.split('.')[0] : name;
        }
    }, {
        key: 'extension',
        value: function extension(path) {
            return path.split('.').last().split('?')[0].toLowerCase();
        }
    }, {
        key: 'base64',
        value: function base64(str) {
            return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        }
    }, {
        key: 'timestamp',
        value: function timestamp() {
            return (Date.now() + this.random(0, 99999)).toString();
        }
    }, {
        key: 'pad',
        value: function pad(number) {
            return number < 10 ? '0' + number : number;
        }
    }]);

    return Utils;
}())(); // Singleton reassignment pattern

/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Events = function Events() {
    var _this = this;

    _classCallCheck(this, Events);

    var events = {};

    this.add = function (event, callback) {
        if (!events[event]) events[event] = [];
        events[event].push(callback);
    };

    this.remove = function (event, callback) {
        if (!events[event]) return;
        events[event].remove(callback);
    };

    this.destroy = function () {
        for (var event in events) {
            for (var i = events[event].length - 1; i > -1; i--) {
                events[event][i] = null;
                events[event].splice(i, 1);
            }
        }
        return Utils.nullObject(_this);
    };

    this.fire = function (event) {
        var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!events[event]) return;
        events[event].forEach(function (callback) {
            return callback(object);
        });
    };
};

Events.VISIBILITY = 'visibility';
Events.KEYBOARD_PRESS = 'keyboard_press';
Events.KEYBOARD_DOWN = 'keyboard_down';
Events.KEYBOARD_UP = 'keyboard_up';
Events.RESIZE = 'resize';
Events.COMPLETE = 'complete';
Events.PROGRESS = 'progress';
Events.UPDATE = 'update';
Events.LOADED = 'loaded';
Events.ERROR = 'error';
Events.READY = 'ready';
Events.HOVER = 'hover';
Events.CLICK = 'click';

/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function () {
    var start = Date.now();
    return function (callback) {
        return setTimeout(function () {
            return callback(Date.now() - start);
        }, 1000 / 60);
    };
}();

var Render = new // Singleton reassignment pattern

function Render() {
    var _this2 = this;

    _classCallCheck(this, Render);

    var self = this;
    var render = [],
        skipLimit = 200;
    var last = performance.now();

    requestAnimationFrame(step);

    function step(t) {
        var delta = Math.min(skipLimit, t - last);
        last = t;
        self.TIME = t;
        self.DELTA = delta;
        for (var i = render.length - 1; i >= 0; i--) {
            var callback = render[i];
            if (!callback) {
                render.remove(callback);
                continue;
            }
            if (callback.fps) {
                if (t - callback.last < 1000 / callback.fps) continue;
                callback(++callback.frame);
                callback.last = t;
                continue;
            }
            callback(t, delta);
        }
        if (!self.paused) requestAnimationFrame(step);
    }

    this.start = function (callback, fps) {
        if (fps) {
            callback.fps = fps;
            callback.last = -Infinity;
            callback.frame = -1;
        }
        if (!~render.indexOf(callback)) render.unshift(callback);
    };

    this.stop = function (callback) {
        render.remove(callback);
    };

    this.pause = function () {
        _this2.paused = true;
    };

    this.resume = function () {
        if (!_this2.paused) return;
        _this2.paused = false;
        requestAnimationFrame(step);
    };
}(); // Singleton reassignment pattern

/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Device = new ( // Singleton reassignment pattern

function () {
    function Device() {
        var _this3 = this;

        _classCallCheck(this, Device);

        this.agent = navigator.userAgent.toLowerCase();
        this.pixelRatio = window.devicePixelRatio;
        this.prefix = function () {
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice.call(styles).join('').match(/-(webkit|moz|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
            return {
                lowercase: pre,
                js: pre[0].toUpperCase() + pre.substr(1)
            };
        }();
        this.transformProperty = function () {
            var pre = void 0;
            switch (_this3.prefix.lowercase) {
                case 'webkit':
                    pre = '-webkit-transform';
                    break;
                case 'moz':
                    pre = '-moz-transform';
                    break;
                case 'ms':
                    pre = '-ms-transform';
                    break;
                case 'o':
                    pre = '-o-transform';
                    break;
                default:
                    pre = 'transform';
                    break;
            }
            return pre;
        }();
        this.mobile = ('ontouchstart' in window || 'onpointerdown' in window) && this.detect(['ios', 'iphone', 'ipad', 'android', 'blackberry']) ? {} : false;
        this.tablet = window.innerWidth > window.innerHeight ? document.body.clientWidth > 800 : document.body.clientHeight > 800;
        this.phone = !this.tablet;
    }

    _createClass(Device, [{
        key: 'detect',
        value: function detect(array) {
            if (typeof array === 'string') array = [array];
            for (var i = 0; i < array.length; i++) {
                if (~this.agent.indexOf(array[i])) return true;
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
}())(); // Singleton reassignment pattern

/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interpolation = new // Singleton reassignment pattern

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
            var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;

            var s = void 0;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
            return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        },
        Out: function Out(k) {
            var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;

            var s = void 0;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
            return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
        },
        InOut: function InOut(k) {
            var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;

            var s = void 0;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
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
            if (k < 1 / 2.75) return 7.5625 * k * k;
            if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
            if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
            return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
        },
        InOut: function InOut(k) {
            if (k < 0.5) return this.Bounce.In(k * 2) * 0.5;
            return this.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    };
}(); // Singleton reassignment pattern

/**
 * Mathematical.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var MathTween = function MathTween(object, props, time, ease, delay, update, callback) {
    var _this5 = this;

    _classCallCheck(this, MathTween);

    var self = this;
    var startTime = void 0,
        startValues = void 0,
        endValues = void 0,
        paused = void 0,
        spring = void 0,
        damping = void 0,
        elapsed = void 0;

    initMathTween();

    function initMathTween() {
        if (!object.multiTween && object.mathTween) TweenManager.clearTween(object);
        TweenManager.addMathTween(self);
        object.mathTween = self;
        if (object.multiTween) {
            if (!object.mathTweens) object.mathTweens = [];
            object.mathTweens.push(self);
        }
        ease = Interpolation.convertEase(ease);
        startTime = performance.now();
        startTime += delay;
        endValues = props;
        startValues = {};
        if (props.spring) spring = props.spring;
        if (props.damping) damping = props.damping;
        for (var prop in endValues) {
            if (typeof object[prop] === 'number') startValues[prop] = object[prop];
        }
    }

    function clear() {
        if (!object && !props) return false;
        object.mathTween = null;
        TweenManager.removeMathTween(self);
        Utils.nullObject(self);
        if (object.mathTweens) object.mathTweens.remove(self);
    }

    this.update = function (t) {
        if (paused || t < startTime) return;
        elapsed = (t - startTime) / time;
        elapsed = elapsed > 1 ? 1 : elapsed;
        var delta = _this5.interpolate(elapsed);
        if (update) update(delta);
        if (elapsed === 1) {
            if (callback) callback();
            clear();
        }
    };

    this.stop = function () {
        clear();
    };

    this.pause = function () {
        paused = true;
    };

    this.resume = function () {
        paused = false;
        startTime = performance.now() - elapsed * time;
    };

    this.interpolate = function (elapsed) {
        var delta = ease(elapsed, spring, damping);
        for (var prop in startValues) {
            if (typeof startValues[prop] === 'number' && typeof endValues[prop] === 'number') {
                var start = startValues[prop],
                    end = endValues[prop];
                object[prop] = start + (end - start) * delta;
            }
        }
        return delta;
    };
};

/**
 * Tween helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var TweenManager = new ( // Singleton reassignment pattern

function () {
    function TweenManager() {
        _classCallCheck(this, TweenManager);

        var self = this;
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
        var tweens = [];

        Render.start(updateTweens);

        function updateTweens(t) {
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if (tween.update) tween.update(t);else self.removeMathTween(tween);
            }
        }

        this.addMathTween = function (tween) {
            tweens.push(tween);
        };

        this.removeMathTween = function (tween) {
            tweens.remove(tween);
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
            var tween = new MathTween(object, props, time, ease, delay, update, callback);
            return promise || tween;
        }
    }, {
        key: 'clearTween',
        value: function clearTween(object) {
            if (object.mathTween) object.mathTween.stop();
            if (object.mathTweens) {
                var _tweens = object.mathTweens;
                for (var i = 0; i < _tweens.length; i++) {
                    var tween = _tweens[i];
                    if (tween) tween.stop();
                }
                object.mathTweens = null;
            }
        }
    }, {
        key: 'parseTransform',
        value: function parseTransform(props) {
            var transforms = '';
            if (typeof props.x !== 'undefined' || typeof props.y !== 'undefined' || typeof props.z !== 'undefined') {
                var x = props.x || 0,
                    y = props.y || 0,
                    z = props.z || 0;
                var translate = '';
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
    }, {
        key: 'isTransform',
        value: function isTransform(key) {
            return ~this.TRANSFORMS.indexOf(key);
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
        key: 'getEase',
        value: function getEase(name) {
            return this.CSS_EASES[name] || this.CSS_EASES.easeOutCubic;
        }
    }]);

    return TweenManager;
}())(); // Singleton reassignment pattern

/**
 * CSS3 transition animation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var CSSTransition = function CSSTransition(object, props, time, ease, delay, callback) {
    _classCallCheck(this, CSSTransition);

    var self = this;
    var transformProps = void 0,
        transitionProps = void 0;

    initProperties();
    initCSSTween();

    function killed() {
        return !self || self.kill || !object || !object.element;
    }

    function initProperties() {
        var transform = TweenManager.getAllTransforms(object),
            properties = [];
        for (var key in props) {
            if (TweenManager.isTransform(key)) {
                transform.use = true;
                transform[key] = props[key];
                delete props[key];
            } else if (typeof props[key] === 'number' || ~key.indexOf('-')) {
                properties.push(key);
            }
        }
        if (transform.use) {
            properties.push(Device.transformProperty);
            delete transform.use;
        }
        transformProps = transform;
        transitionProps = properties;
    }

    function initCSSTween() {
        if (killed()) return;
        if (object.cssTween) object.cssTween.kill = true;
        object.cssTween = self;
        var strings = buildStrings(time, ease, delay);
        object.willChange(strings.props);
        setTimeout(function () {
            if (killed()) return;
            object.element.style[Device.vendor('Transition')] = strings.transition;
            object.css(props);
            object.transform(transformProps);
            setTimeout(function () {
                if (killed()) return;
                clearCSSTween();
                if (callback) callback();
            }, time + delay);
        }, 50);
    }

    function buildStrings(time, ease, delay) {
        var props = '',
            transition = '';
        for (var i = 0; i < transitionProps.length; i++) {
            var transitionProp = transitionProps[i];
            props += (props.length ? ', ' : '') + transitionProp;
            transition += (transition.length ? ', ' : '') + transitionProp + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
        }
        return {
            props: props,
            transition: transition
        };
    }

    function clearCSSTween() {
        if (killed()) return;
        self.kill = true;
        object.element.style[Device.vendor('Transition')] = '';
        object.cssTween = null;
        object.willChange(null);
        object = props = null;
        Utils.nullObject(self);
    }

    this.stop = clearCSSTween;
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

        this.events = new Events();
        this.classes = [];
        this.timers = [];
        this.loops = [];
        if (typeof name !== 'undefined') {
            if (typeof name === 'string') {
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
            } else {
                this.element = name;
            }
            this.element.object = this;
        }
    }

    _createClass(Interface, [{
        key: 'initClass',
        value: function initClass(object) {
            for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                params[_key2 - 1] = arguments[_key2];
            }

            var child = new (Function.prototype.bind.apply(object, [null].concat(params)))();
            this.add(child);
            return child;
        }
    }, {
        key: 'add',
        value: function add(child) {
            var element = this.element;
            if (child.element) {
                element.appendChild(child.element);
                this.classes.push(child);
                child.parent = this;
            } else if (child.nodeName) {
                element.appendChild(child);
            }
            return this;
        }
    }, {
        key: 'delayedCall',
        value: function delayedCall(callback) {
            for (var _len3 = arguments.length, params = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                params[_key3 - 2] = arguments[_key3];
            }

            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var timer = setTimeout(function () {
                if (callback) callback.apply(undefined, params);
            }, time);
            this.timers.push(timer);
            if (this.timers.length > 50) this.timers.shift();
            return timer;
        }
    }, {
        key: 'clearTimers',
        value: function clearTimers() {
            for (var i = this.timers.length - 1; i >= 0; i--) {
                clearTimeout(this.timers[i]);
            }this.timers.length = 0;
        }
    }, {
        key: 'startRender',
        value: function startRender(callback, fps) {
            this.loops.push(callback);
            Render.start(callback, fps);
        }
    }, {
        key: 'stopRender',
        value: function stopRender(callback) {
            this.loops.remove(callback);
            Render.stop(callback);
        }
    }, {
        key: 'clearRenders',
        value: function clearRenders() {
            for (var i = this.loops.length - 1; i >= 0; i--) {
                this.stopRender(this.loops[i]);
            }this.loops.length = 0;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.removed = true;
            var parent = this.parent;
            if (parent && !parent.removed && parent.remove) parent.remove(this);
            for (var i = this.classes.length - 1; i >= 0; i--) {
                var child = this.classes[i];
                if (child && child.destroy) child.destroy();
            }
            this.classes.length = 0;
            this.element.object = null;
            this.clearRenders();
            this.clearTimers();
            this.events.destroy();
            return Utils.nullObject(this);
        }
    }, {
        key: 'remove',
        value: function remove(child) {
            child.element.parentNode.removeChild(child.element);
            this.classes.remove(child);
        }
    }, {
        key: 'create',
        value: function create(name, type) {
            var child = new Interface(name, type);
            this.add(child);
            return child;
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new Interface(this.element.cloneNode(true));
        }
    }, {
        key: 'empty',
        value: function empty() {
            this.element.innerHTML = '';
            return this;
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
            if (src.includes(['data:', '.'])) this.element.style.backgroundImage = 'url(' + src + ')';else this.element.style.backgroundColor = src;
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
            this.element.style[Device.vendor('Mask')] = (~src.indexOf('.') ? 'url(' + src + ')' : src) + ' no-repeat';
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
                        if (~style.indexOf('px')) style = Number(style.slice(0, -2));
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
        key: 'willChange',
        value: function willChange(props) {
            if (typeof props === 'boolean') this.willChangeLock = props;else if (this.willChangeLock) return;
            var string = typeof props === 'string';
            if (props) this.element.style['will-change'] = string ? props : Device.transformProperty + ', opacity';else this.element.style['will-change'] = '';
        }
    }, {
        key: 'backfaceVisibility',
        value: function backfaceVisibility(visible) {
            if (visible) this.element.style[Device.vendor('BackfaceVisibility')] = 'visible';else this.element.style[Device.vendor('BackfaceVisibility')] = 'hidden';
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
        key: 'clearTween',
        value: function clearTween() {
            if (this.cssTween) this.cssTween.stop();
            if (this.mathTween) this.mathTween.stop();
            return this;
        }
    }, {
        key: 'attr',
        value: function attr(_attr, value) {
            if (typeof value === 'undefined') return this.element.getAttribute(_attr);
            if (value === '') this.element.removeAttribute(_attr);else this.element.setAttribute(_attr, value);
            return this;
        }
    }, {
        key: 'convertTouchEvent',
        value: function convertTouchEvent(e) {
            var touchEvent = {};
            touchEvent.x = 0;
            touchEvent.y = 0;
            if (!e) return touchEvent;
            if (e.touches || e.changedTouches) {
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
        key: 'click',
        value: function click(callback) {
            var _this6 = this;

            var click = function click(e) {
                if (!_this6.element) return false;
                e.object = _this6.element.className === 'hit' ? _this6.parent : _this6;
                e.action = 'click';
                if (callback) callback(e);
            };
            this.element.addEventListener('click', click, true);
            this.element.style.cursor = 'pointer';
            return this;
        }
    }, {
        key: 'hover',
        value: function hover(callback) {
            var _this7 = this;

            var hover = function hover(e) {
                if (!_this7.element) return false;
                e.object = _this7.element.className === 'hit' ? _this7.parent : _this7;
                e.action = e.type === 'mouseout' ? 'out' : 'over';
                if (callback) callback(e);
            };
            this.element.addEventListener('mouseover', hover, true);
            this.element.addEventListener('mouseout', hover, true);
            return this;
        }
    }, {
        key: 'press',
        value: function press(callback) {
            var _this8 = this;

            var press = function press(e) {
                if (!_this8.element) return false;
                e.object = _this8.element.className === 'hit' ? _this8.parent : _this8;
                e.action = e.type === 'mousedown' ? 'down' : 'up';
                if (callback) callback(e);
            };
            this.element.addEventListener('mousedown', press, true);
            this.element.addEventListener('mouseup', press, true);
            return this;
        }
    }, {
        key: 'bind',
        value: function bind(event, callback) {
            var _this9 = this;

            if (event === 'touchstart' && !Device.mobile) event = 'mousedown';else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
            if (!this.events['bind_' + event]) this.events['bind_' + event] = [];
            var events = this.events['bind_' + event];
            events.push({ target: this.element, callback: callback });

            var touchEvent = function touchEvent(e) {
                var touch = _this9.convertTouchEvent(e);
                e.x = touch.x;
                e.y = touch.y;
                events.forEach(function (event) {
                    if (event.target === e.currentTarget) event.callback(e);
                });
            };

            if (!this.events['fn_' + event]) {
                this.events['fn_' + event] = touchEvent;
                this.element.addEventListener(event, touchEvent, true);
            }
            return this;
        }
    }, {
        key: 'unbind',
        value: function unbind(event, callback) {
            if (event === 'touchstart' && !Device.mobile) event = 'mousedown';else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
            var events = this.events['bind_' + event];
            if (!events) return this;
            events.forEach(function (event, i) {
                if (event.callback === callback) events.splice(i, 1);
            });
            if (this.events['fn_' + event] && !events.length) {
                this.element.removeEventListener(event, this.events['fn_' + event], true);
                this.events['fn_' + event] = null;
            }
            return this;
        }
    }, {
        key: 'interact',
        value: function interact(overCallback, clickCallback) {
            this.hit = this.create('.hit');
            this.hit.css({
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
            var _this10 = this;

            var start = {};
            var time = void 0,
                move = void 0,
                touch = void 0;

            var findDistance = function findDistance(p1, p2) {
                var dx = p2.x - p1.x,
                    dy = p2.y - p1.y;
                return Math.sqrt(dx * dx + dy * dy);
            };

            var touchMove = function touchMove(e) {
                if (!_this10.element) return false;
                touch = _this10.convertTouchEvent(e);
                move = findDistance(start, touch) > 5;
            };

            var setTouch = function setTouch(e) {
                var touchEvent = _this10.convertTouchEvent(e);
                e.touchX = touchEvent.x;
                e.touchY = touchEvent.y;
                start.x = e.touchX;
                start.y = e.touchY;
            };

            var touchStart = function touchStart(e) {
                if (!_this10.element) return false;
                time = performance.now();
                e.object = _this10.element.className === 'hit' ? _this10.parent : _this10;
                e.action = 'over';
                setTouch(e);
                if (hover && !move) hover(e);
            };

            var touchEnd = function touchEnd(e) {
                if (!_this10.element) return false;
                var t = performance.now();
                e.object = _this10.element.className === 'hit' ? _this10.parent : _this10;
                setTouch(e);
                if (time && t - time < 750 && click && !move) {
                    e.action = 'click';
                    click(e);
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
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Stage = new ( // Singleton reassignment pattern

function (_Interface) {
    _inherits(Stage, _Interface);

    function Stage() {
        _classCallCheck(this, Stage);

        var _this11 = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this, 'Stage'));

        var self = _this11;
        var last = void 0;

        initHTML();
        addListeners();

        function initHTML() {
            self.css({ overflow: 'hidden' });
        }

        function addListeners() {
            window.addEventListener('focus', function () {
                if (last !== 'focus') {
                    last = 'focus';
                    self.events.fire(Events.VISIBILITY, { type: 'focus' });
                }
            }, true);
            window.addEventListener('blur', function () {
                if (last !== 'blur') {
                    last = 'blur';
                    self.events.fire(Events.VISIBILITY, { type: 'blur' });
                }
            }, true);
            window.addEventListener('keydown', function () {
                return self.events.fire(Events.KEYBOARD_DOWN);
            }, true);
            window.addEventListener('keyup', function () {
                return self.events.fire(Events.KEYBOARD_UP);
            }, true);
            window.addEventListener('keypress', function () {
                return self.events.fire(Events.KEYBOARD_PRESS);
            }, true);
            window.addEventListener('resize', function () {
                return self.events.fire(Events.RESIZE);
            }, true);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.size();
            self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
        return _this11;
    }

    return Stage;
}(Interface))(); // Singleton reassignment pattern

/**
 * Alien component.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Component = function () {
    function Component() {
        _classCallCheck(this, Component);

        this.events = new Events();
        this.classes = [];
        this.timers = [];
        this.loops = [];
    }

    _createClass(Component, [{
        key: 'initClass',
        value: function initClass(object) {
            for (var _len4 = arguments.length, params = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                params[_key4 - 1] = arguments[_key4];
            }

            var child = new (Function.prototype.bind.apply(object, [null].concat(params)))();
            this.add(child);
            return child;
        }
    }, {
        key: 'add',
        value: function add(child) {
            if (child.destroy) {
                this.classes.push(child);
                child.parent = this;
            }
            return this;
        }
    }, {
        key: 'delayedCall',
        value: function delayedCall(callback) {
            for (var _len5 = arguments.length, params = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                params[_key5 - 2] = arguments[_key5];
            }

            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var timer = setTimeout(function () {
                if (callback) callback.apply(undefined, params);
            }, time);
            this.timers.push(timer);
            if (this.timers.length > 50) this.timers.shift();
            return timer;
        }
    }, {
        key: 'clearTimers',
        value: function clearTimers() {
            for (var i = this.timers.length - 1; i >= 0; i--) {
                clearTimeout(this.timers[i]);
            }this.timers.length = 0;
        }
    }, {
        key: 'startRender',
        value: function startRender(callback, fps) {
            this.loops.push(callback);
            Render.start(callback, fps);
        }
    }, {
        key: 'stopRender',
        value: function stopRender(callback) {
            this.loops.remove(callback);
            Render.stop(callback);
        }
    }, {
        key: 'clearRenders',
        value: function clearRenders() {
            for (var i = this.loops.length - 1; i >= 0; i--) {
                this.stopRender(this.loops[i]);
            }this.loops.length = 0;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.removed = true;
            var parent = this.parent;
            if (parent && !parent.removed && parent.remove) parent.remove(this);
            for (var i = this.classes.length - 1; i >= 0; i--) {
                var child = this.classes[i];
                if (child && child.destroy) child.destroy();
            }
            this.classes.length = 0;
            this.clearRenders();
            this.clearTimers();
            this.events.destroy();
            return Utils.nullObject(this);
        }
    }, {
        key: 'remove',
        value: function remove(child) {
            this.classes.remove(child);
        }
    }]);

    return Component;
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
        value: function add(child) {
            child.setCanvas(this);
            child.parent = this;
            this.children.push(child);
            child.z = this.children.length;
        }
    }, {
        key: 'remove',
        value: function remove(child) {
            child.canvas = null;
            child.parent = null;
            this.children.remove(child);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].destroy();
            }this.object.destroy();
            return Utils.nullObject(this);
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
            this.values.setTRSA(this.x, this.y, Math.radians(this.rotation), this.scaleX || this.scale, this.scaleY || this.scale, this.opacity);
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
        value: function add(child) {
            child.canvas = this.canvas;
            child.parent = this;
            this.children.push(child);
            child.z = this.children.length;
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
        value: function remove(child) {
            child.canvas = null;
            child.parent = null;
            this.children.remove(child);
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

        var _this12 = _possibleConstructorReturn(this, (CanvasGraphics.__proto__ || Object.getPrototypeOf(CanvasGraphics)).call(this));

        var self = _this12;
        _this12.width = w;
        _this12.height = h;
        _this12.props = {};
        var draw = [],
            mask = void 0;

        function setProperties(context) {
            for (var key in self.props) {
                context[key] = self.props[key];
            }
        }

        _this12.draw = function (override) {
            if (_this12.isMask() && !override) return false;
            var context = _this12.canvas.context;
            _this12.startDraw(_this12.px, _this12.py, override);
            setProperties(context);
            if (_this12.clipWidth && _this12.clipHeight) {
                context.beginPath();
                context.rect(_this12.clipX, _this12.clipY, _this12.clipWidth, _this12.clipHeight);
                context.clip();
            }
            for (var i = 0; i < draw.length; i++) {
                var cmd = draw[i];
                if (!cmd) continue;
                var fn = cmd.shift();
                context[fn].apply(context, cmd);
                cmd.unshift(fn);
            }
            _this12.endDraw();
            if (mask) {
                context.globalCompositeOperation = mask.blendMode;
                mask.render(true);
            }
        };

        _this12.clear = function () {
            for (var i = 0; i < draw.length; i++) {
                draw[i].length = 0;
            }draw.length = 0;
        };

        _this12.arc = function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var endAngle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _this12.radius || _this12.width / 2;
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
            draw.push(['arc', x, y, radius, Math.radians(startAngle), Math.radians(endAngle), counterclockwise]);
        };

        _this12.quadraticCurveTo = function (cpx, cpy, x, y) {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        _this12.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        _this12.fillRect = function (x, y, w, h) {
            draw.push(['fillRect', x, y, w, h]);
        };

        _this12.clearRect = function (x, y, w, h) {
            draw.push(['clearRect', x, y, w, h]);
        };

        _this12.strokeRect = function (x, y, w, h) {
            draw.push(['strokeRect', x, y, w, h]);
        };

        _this12.moveTo = function (x, y) {
            draw.push(['moveTo', x, y]);
        };

        _this12.lineTo = function (x, y) {
            draw.push(['lineTo', x, y]);
        };

        _this12.stroke = function () {
            draw.push(['stroke']);
        };

        _this12.fill = function () {
            if (!mask) draw.push(['fill']);
        };

        _this12.beginPath = function () {
            draw.push(['beginPath']);
        };

        _this12.closePath = function () {
            draw.push(['closePath']);
        };

        _this12.fillText = function (text, x, y) {
            draw.push(['fillText', text, x, y]);
        };

        _this12.strokeText = function (text, x, y) {
            draw.push(['strokeText', text, x, y]);
        };

        _this12.setLineDash = function (value) {
            draw.push(['setLineDash', value]);
        };

        _this12.drawImage = function (img) {
            var sx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var sy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var sWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : img.width;
            var sHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : img.height;
            var dx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var dy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
            var dWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : img.width;
            var dHeight = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : img.height;

            draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx + -_this12.px, dy + -_this12.py, dWidth, dHeight]);
        };

        _this12.mask = function (object) {
            if (!object) return mask = null;
            mask = object;
            object.masked = _this12;
            for (var i = 0; i < draw.length; i++) {
                if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                    draw[i].length = 0;
                    draw.splice(i, 1);
                }
            }
        };

        _this12.clone = function () {
            var object = new CanvasGraphics(_this12.width, _this12.height);
            object.visible = _this12.visible;
            object.blendMode = _this12.blendMode;
            object.opacity = _this12.opacity;
            object.follow(_this12);
            object.props = Utils.cloneObject(_this12.props);
            object.setDraw(Utils.cloneArray(draw));
            return object;
        };

        _this12.setDraw = function (array) {
            draw = array;
        };
        return _this12;
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

var CanvasFont = new // Singleton reassignment pattern

function CanvasFont() {
    _classCallCheck(this, CanvasFont);

    function createText(canvas, width, height, str, font, fillStyle, letterSpacing, textAlign) {
        var context = canvas.context,
            graphics = new CanvasGraphics(width, height);
        graphics.font = font;
        graphics.fillStyle = fillStyle;
        graphics.totalWidth = 0;
        graphics.totalHeight = height;
        var characters = str.split('');
        var chr = void 0,
            index = 0,
            currentPosition = 0;
        context.font = font;
        for (var i = 0; i < characters.length; i++) {
            graphics.totalWidth += context.measureText(characters[i]).width + letterSpacing;
        }switch (textAlign) {
            case 'start':
            case 'left':
                currentPosition = 0;
                break;
            case 'end':
            case 'right':
                currentPosition = width - graphics.totalWidth;
                break;
            case 'center':
                currentPosition = (width - graphics.totalWidth) / 2;
                break;
        }
        do {
            chr = characters[index++];
            graphics.fillText(chr, currentPosition, 0);
            currentPosition += context.measureText(chr).width + letterSpacing;
        } while (index < str.length);
        return graphics;
    }

    this.createText = function (canvas, width, height, str, font, fillStyle, _ref) {
        var _ref$letterSpacing = _ref.letterSpacing,
            letterSpacing = _ref$letterSpacing === undefined ? 0 : _ref$letterSpacing,
            _ref$lineHeight = _ref.lineHeight,
            lineHeight = _ref$lineHeight === undefined ? height : _ref$lineHeight,
            _ref$textAlign = _ref.textAlign,
            textAlign = _ref$textAlign === undefined ? 'start' : _ref$textAlign;

        var context = canvas.context;
        if (height === lineHeight) {
            return createText(canvas, width, height, str, font, fillStyle, letterSpacing, textAlign);
        } else {
            var text = new CanvasGraphics(width, height),
                words = str.split(' '),
                lines = [];
            var line = '';
            text.totalWidth = 0;
            text.totalHeight = 0;
            context.font = font;
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ',
                    characters = testLine.split('');
                var testWidth = 0;
                for (var i = 0; i < characters.length; i++) {
                    testWidth += context.measureText(characters[i]).width + letterSpacing;
                }if (testWidth > width && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);
            lines.every(function (e, i) {
                var graphics = createText(canvas, width, lineHeight, e, font, fillStyle, letterSpacing, textAlign);
                graphics.y = i * lineHeight;
                text.add(graphics);
                text.totalWidth = Math.max(graphics.totalWidth, text.totalWidth);
                text.totalHeight += lineHeight;
                return true;
            });
            return text;
        }
    };
}(); // Singleton reassignment pattern

/**
 * 2D vector.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Vector2 = function () {
    function Vector2(x, y) {
        _classCallCheck(this, Vector2);

        this.x = typeof x === 'number' ? x : 0;
        this.y = typeof y === 'number' ? y : 0;
        this.type = 'vector2';
    }

    _createClass(Vector2, [{
        key: 'set',
        value: function set(x, y) {
            this.x = x || 0;
            this.y = y || 0;
            return this;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.x = 0;
            this.y = 0;
            return this;
        }
    }, {
        key: 'copyTo',
        value: function copyTo(v) {
            v.x = this.x;
            v.y = this.y;
            return this;
        }
    }, {
        key: 'copyFrom',
        value: function copyFrom(v) {
            this.x = v.x || 0;
            this.y = v.y || 0;
            return this;
        }
    }, {
        key: 'lengthSq',
        value: function lengthSq() {
            return this.x * this.x + this.y * this.y || 0.00001;
        }
    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.lengthSq());
        }
    }, {
        key: 'normalize',
        value: function normalize() {
            var length = this.length();
            this.x /= length;
            this.y /= length;
            return this;
        }
    }, {
        key: 'setLength',
        value: function setLength(length) {
            this.normalize().multiply(length);
            return this;
        }
    }, {
        key: 'addVectors',
        value: function addVectors(a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        }
    }, {
        key: 'subVectors',
        value: function subVectors(a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        }
    }, {
        key: 'multiplyVectors',
        value: function multiplyVectors(a, b) {
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            return this;
        }
    }, {
        key: 'add',
        value: function add(v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        }
    }, {
        key: 'sub',
        value: function sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }
    }, {
        key: 'multiply',
        value: function multiply(v) {
            this.x *= v;
            this.y *= v;
            return this;
        }
    }, {
        key: 'divide',
        value: function divide(v) {
            this.x /= v;
            this.y /= v;
            return this;
        }
    }, {
        key: 'perpendicular',
        value: function perpendicular() {
            var tx = this.x,
                ty = this.y;
            this.x = -ty;
            this.y = tx;
            return this;
        }
    }, {
        key: 'lerp',
        value: function lerp(v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            return this;
        }
    }, {
        key: 'deltaLerp',
        value: function deltaLerp(v, alpha) {
            var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            for (var i = 0; i < delta; i++) {
                this.lerp(v, alpha);
            }return this;
        }
    }, {
        key: 'interp',
        value: function interp(v, alpha, ease) {
            var dist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;

            if (!this.calc) this.calc = new Vector2();
            this.calc.subVectors(this, v);
            var fn = Interpolation.convertEase(ease),
                a = fn(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
            return this.lerp(v, a);
        }
    }, {
        key: 'setAngleRadius',
        value: function setAngleRadius(a, r) {
            this.x = Math.cos(a) * r;
            this.y = Math.sin(a) * r;
            return this;
        }
    }, {
        key: 'addAngleRadius',
        value: function addAngleRadius(a, r) {
            this.x += Math.cos(a) * r;
            this.y += Math.sin(a) * r;
            return this;
        }
    }, {
        key: 'dot',
        value: function dot(a) {
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

            return a.x * b.x + a.y * b.y;
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new Vector2(this.x, this.y);
        }
    }, {
        key: 'distanceTo',
        value: function distanceTo(v, noSq) {
            var dx = this.x - v.x,
                dy = this.y - v.y;
            if (!noSq) return Math.sqrt(dx * dx + dy * dy);
            return dx * dx + dy * dy;
        }
    }, {
        key: 'solveAngle',
        value: function solveAngle(a) {
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

            return Math.atan2(a.y - b.y, a.x - b.x);
        }
    }, {
        key: 'equals',
        value: function equals(v) {
            return this.x === v.x && this.y === v.y;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var split = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';

            return this.x + split + this.y;
        }
    }]);

    return Vector2;
}();

/**
 * Interaction helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interaction = function Interaction() {
    var _this13 = this;

    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Stage;

    _classCallCheck(this, Interaction);

    if (!Interaction.instance) {
        Interaction.CLICK = 'interaction_click';
        Interaction.START = 'interaction_start';
        Interaction.MOVE = 'interaction_move';
        Interaction.DRAG = 'interaction_drag';
        Interaction.END = 'interaction_end';

        var events = {
            touchstart: [],
            touchmove: [],
            touchend: []
        },
            touchStart = function touchStart(e) {
            return events.touchstart.forEach(function (callback) {
                return callback(e);
            });
        },
            touchMove = function touchMove(e) {
            return events.touchmove.forEach(function (callback) {
                return callback(e);
            });
        },
            touchEnd = function touchEnd(e) {
            return events.touchend.forEach(function (callback) {
                return callback(e);
            });
        };

        Interaction.bind = function (event, callback) {
            return events[event].push(callback);
        };
        Interaction.unbind = function (event, callback) {
            return events[event].remove(callback);
        };

        Stage.bind('touchstart', touchStart);
        Stage.bind('touchmove', touchMove);
        Stage.bind('touchend', touchEnd);
        Stage.bind('touchcancel', touchEnd);
        Stage.bind('contextmenu', touchEnd);

        Interaction.instance = this;
    }

    var self = this;
    this.events = new Events();
    this.x = 0;
    this.y = 0;
    this.hold = new Vector2();
    this.last = new Vector2();
    this.delta = new Vector2();
    this.move = new Vector2();
    this.velocity = new Vector2();
    var distance = void 0,
        timeDown = void 0,
        timeMove = void 0;

    addListeners();

    function addListeners() {
        if (object === Stage) Interaction.bind('touchstart', down);else object.bind('touchstart', down);
        Interaction.bind('touchmove', move);
        Interaction.bind('touchend', up);
    }

    function down(e) {
        self.isTouching = true;
        self.x = e.x;
        self.y = e.y;
        self.hold.x = self.last.x = e.x;
        self.hold.y = self.last.y = e.y;
        self.delta.x = self.move.x = self.velocity.x = 0;
        self.delta.y = self.move.y = self.velocity.y = 0;
        distance = 0;
        self.events.fire(Interaction.START, e);
        timeDown = timeMove = Render.TIME;
    }

    function move(e) {
        if (self.isTouching) {
            self.move.x = e.x - self.hold.x;
            self.move.y = e.y - self.hold.y;
        }
        self.x = e.x;
        self.y = e.y;
        self.delta.x = e.x - self.last.x;
        self.delta.y = e.y - self.last.y;
        self.last.x = e.x;
        self.last.y = e.y;
        distance += self.delta.length();
        var delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
        timeMove = Render.TIME;
        self.velocity.x = Math.abs(self.delta.x) / delta;
        self.velocity.y = Math.abs(self.delta.y) / delta;
        self.events.fire(Interaction.MOVE, e);
        if (self.isTouching) self.events.fire(Interaction.DRAG, e);
    }

    function up(e) {
        if (!self.isTouching) return;
        self.isTouching = false;
        self.move.x = 0;
        self.move.y = 0;
        var delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
        if (delta > 100) {
            self.delta.x = 0;
            self.delta.y = 0;
        }
        self.events.fire(Interaction.END, e);
        if (distance < 20 && Render.TIME - timeDown < 2000) self.events.fire(Interaction.CLICK, e);
    }

    this.destroy = function () {
        Interaction.unbind('touchstart', down);
        Interaction.unbind('touchmove', move);
        Interaction.unbind('touchend', up);
        if (object !== Stage && object.unbind) object.unbind('touchstart', down);
        _this13.events.destroy();
        return Utils.nullObject(_this13);
    };
};

/**
 * Mouse interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Mouse = new // Singleton reassignment pattern

function Mouse() {
    var _this14 = this;

    _classCallCheck(this, Mouse);

    var self = this;
    this.x = 0;
    this.y = 0;
    this.normal = {
        x: 0,
        y: 0
    };
    this.tilt = {
        x: 0,
        y: 0
    };
    this.inverseNormal = {
        x: 0,
        y: 0
    };

    function update(e) {
        self.x = e.x;
        self.y = e.y;
        self.normal.x = e.x / Stage.width;
        self.normal.y = e.y / Stage.height;
        self.tilt.x = self.normal.x * 2 - 1;
        self.tilt.y = 1 - self.normal.y * 2;
        self.inverseNormal.x = self.normal.x;
        self.inverseNormal.y = 1 - self.normal.y;
    }

    this.init = function () {
        _this14.input = new Interaction();
        _this14.input.events.add(Interaction.START, update);
        _this14.input.events.add(Interaction.MOVE, update);
        update({
            x: Stage.width / 2,
            y: Stage.height / 2
        });
    };
}(); // Singleton reassignment pattern

/**
 * Accelerometer helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Accelerometer = new // Singleton reassignment pattern

function Accelerometer() {
    _classCallCheck(this, Accelerometer);

    var self = this;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;
    this.heading = 0;
    this.rotationRate = {};
    this.rotationRate.alpha = 0;
    this.rotationRate.beta = 0;
    this.rotationRate.gamma = 0;
    this.toRadians = Device.os === 'iOS' ? Math.PI / 180 : 1;

    function updateAccel(e) {
        switch (window.orientation) {
            case 0:
                self.x = -e.accelerationIncludingGravity.x;
                self.y = e.accelerationIncludingGravity.y;
                self.z = e.accelerationIncludingGravity.z;
                if (e.rotationRate) {
                    self.rotationRate.alpha = e.rotationRate.beta * self.toRadians;
                    self.rotationRate.beta = -e.rotationRate.alpha * self.toRadians;
                    self.rotationRate.gamma = e.rotationRate.gamma * self.toRadians;
                }
                break;
            case 180:
                self.x = e.accelerationIncludingGravity.x;
                self.y = -e.accelerationIncludingGravity.y;
                self.z = e.accelerationIncludingGravity.z;
                if (e.rotationRate) {
                    self.rotationRate.alpha = -e.rotationRate.beta * self.toRadians;
                    self.rotationRate.beta = e.rotationRate.alpha * self.toRadians;
                    self.rotationRate.gamma = e.rotationRate.gamma * self.toRadians;
                }
                break;
            case 90:
                self.x = e.accelerationIncludingGravity.y;
                self.y = e.accelerationIncludingGravity.x;
                self.z = e.accelerationIncludingGravity.z;
                if (e.rotationRate) {
                    self.rotationRate.alpha = e.rotationRate.alpha * self.toRadians;
                    self.rotationRate.beta = e.rotationRate.beta * self.toRadians;
                    self.rotationRate.gamma = e.rotationRate.gamma * self.toRadians;
                }
                break;
            case -90:
                self.x = -e.accelerationIncludingGravity.y;
                self.y = -e.accelerationIncludingGravity.x;
                self.z = e.accelerationIncludingGravity.z;
                if (e.rotationRate) {
                    self.rotationRate.alpha = -e.rotationRate.alpha * self.toRadians;
                    self.rotationRate.beta = -e.rotationRate.beta * self.toRadians;
                    self.rotationRate.gamma = e.rotationRate.gamma * self.toRadians;
                }
                break;
        }
    }

    function updateOrientation(e) {
        for (var key in e) {
            if (~key.toLowerCase().indexOf('heading')) self.heading = e[key];
        }switch (window.orientation) {
            case 0:
                self.alpha = e.beta * self.toRadians;
                self.beta = -e.alpha * self.toRadians;
                self.gamma = e.gamma * self.toRadians;
                break;
            case 180:
                self.alpha = -e.beta * self.toRadians;
                self.beta = e.alpha * self.toRadians;
                self.gamma = e.gamma * self.toRadians;
                break;
            case 90:
                self.alpha = e.alpha * self.toRadians;
                self.beta = e.beta * self.toRadians;
                self.gamma = e.gamma * self.toRadians;
                break;
            case -90:
                self.alpha = -e.alpha * self.toRadians;
                self.beta = -e.beta * self.toRadians;
                self.gamma = e.gamma * self.toRadians;
                break;
        }
        self.tilt = e.beta * self.toRadians;
        self.yaw = e.alpha * self.toRadians;
        self.roll = -e.gamma * self.toRadians;
        if (Device.os === 'Android') self.heading = compassHeading(e.alpha, e.beta, e.gamma);
    }

    function compassHeading(alpha, beta, gamma) {
        var degtorad = Math.PI / 180,
            x = beta ? beta * degtorad : 0,
            y = gamma ? gamma * degtorad : 0,
            z = alpha ? alpha * degtorad : 0,
            cY = Math.cos(y),
            cZ = Math.cos(z),
            sX = Math.sin(x),
            sY = Math.sin(y),
            sZ = Math.sin(z),
            Vx = -cZ * sY - sZ * sX * cY,
            Vy = -sZ * sY + cZ * sX * cY;
        var compassHeading = Math.atan(Vx / Vy);
        if (Vy < 0) compassHeading += Math.PI;else if (Vx < 0) compassHeading += 2 * Math.PI;
        return compassHeading * (180 / Math.PI);
    }

    this.init = function () {
        window.addEventListener('devicemotion', updateAccel, true);
        window.addEventListener('deviceorientation', updateOrientation, true);
    };
}(); // Singleton reassignment pattern

/**
 * Image helper class with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Images = new ( // Singleton reassignment pattern

function () {
    function Images() {
        _classCallCheck(this, Images);

        this.CORS = null;
    }

    _createClass(Images, [{
        key: 'createImg',
        value: function createImg(src, callback) {
            var img = new Image();
            img.crossOrigin = this.CORS;
            img.src = src;
            img.onload = callback;
            img.onerror = callback;
            return img;
        }
    }, {
        key: 'promise',
        value: function promise(img) {
            if (typeof img === 'string') img = this.createImg(img);
            var promise = Promise.create();
            img.onload = promise.resolve;
            img.onerror = promise.resolve;
            return promise;
        }
    }]);

    return Images;
}())(); // Singleton reassignment pattern

/**
 * Asset loader with promise method.
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
        this.events = new Events();
        this.CDN = Config.CDN || '';
        var total = Object.keys(assets).length;
        var loaded = 0;

        for (var key in assets) {
            loadAsset(key, this.CDN + assets[key]);
        }function loadAsset(key, asset) {
            var ext = Utils.extension(asset);
            if (ext.includes(['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                Images.createImg(asset, assetLoaded);
                return;
            }
            if (ext.includes(['mp3', 'm4a', 'ogg', 'wav', 'aif'])) {
                if (!window.AudioContext || !window.WebAudio) return assetLoaded();
                window.fetch(asset).then(function (response) {
                    if (!response.ok) return assetLoaded();
                    response.arrayBuffer().then(function (data) {
                        return window.WebAudio.createSound(key, data, assetLoaded);
                    });
                }).catch(function () {
                    assetLoaded();
                });
                return;
            }
            window.get(asset).then(function (data) {
                if (ext === 'js') window.eval(data.replace('use strict', ''));else if (ext.includes(['fs', 'vs', 'glsl']) && window.Shaders) window.Shaders.parse(data, asset);
                assetLoaded();
            }).catch(function () {
                assetLoaded();
            });
        }

        function assetLoaded() {
            self.events.fire(Events.PROGRESS, { percent: ++loaded / total });
            if (loaded === total) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE);
            if (callback) callback();
        }
    }

    _createClass(AssetLoader, null, [{
        key: 'loadAssets',
        value: function loadAssets(assets, callback) {
            var promise = Promise.create();
            if (!callback) callback = promise.resolve;
            promise.loader = new AssetLoader(assets, callback);
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
        this.events = new Events();
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
            setTimeout(function () {
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
            promise.loader = new FontLoader(fonts, callback);
            return promise;
        }
    }]);

    return FontLoader;
}();

/**
 * Video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Video = function (_Component) {
    _inherits(Video, _Component);

    function Video(params) {
        _classCallCheck(this, Video);

        var _this15 = _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this));

        var self = _this15;
        _this15.CDN = Config.CDN || '';
        _this15.loaded = {
            start: 0,
            end: 0,
            percent: 0
        };
        var event = {};
        var lastTime = void 0,
            buffering = void 0,
            seekTo = void 0,
            forceRender = void 0,
            tick = 0;

        createElement();
        if (params.preload !== false) preload();

        function createElement() {
            var src = params.src;
            if (src) src = self.CDN + params.src;
            self.element = document.createElement('video');
            if (src) self.element.src = src;
            self.element.controls = params.controls;
            self.element.id = params.id || '';
            self.element.width = params.width;
            self.element.height = params.height;
            self.element.loop = params.loop;
            self.object = new Interface(self.element);
            self.width = params.width;
            self.height = params.height;
            self.object.size(self.width, self.height);
            if (Device.mobile) {
                self.object.attr('webkit-playsinline', true);
                self.object.attr('playsinline', true);
            }
        }

        function preload() {
            self.element.preload = 'auto';
            self.element.load();
        }

        function step() {
            if (!self.element) return self.stopRender(step);
            self.duration = self.element.duration;
            self.time = self.element.currentTime;
            if (self.element.currentTime === lastTime) {
                tick++;
                if (tick > 30 && !buffering) {
                    buffering = true;
                    self.events.fire(Events.ERROR);
                }
            } else {
                tick = 0;
                if (buffering) {
                    self.events.fire(Events.READY);
                    buffering = false;
                }
            }
            lastTime = self.element.currentTime;
            if (self.element.currentTime >= (self.duration || self.element.duration) - 0.001) {
                if (!self.loop) {
                    if (!forceRender) self.stopRender(step);
                    self.events.fire(Events.COMPLETE);
                }
            }
            event.time = self.element.currentTime;
            event.duration = self.element.duration;
            event.loaded = self.loaded;
            self.events.fire(Events.UPDATE, event);
        }

        function checkReady() {
            if (!self.element) return false;
            if (!seekTo) {
                self.buffered = self.element.readyState === self.element.HAVE_ENOUGH_DATA;
            } else {
                var seekable = self.element.seekable;
                var max = -1;
                if (seekable) {
                    for (var i = 0; i < seekable.length; i++) {
                        if (seekable.start(i) < seekTo) max = seekable.end(i) - 0.5;
                    }if (max >= seekTo) self.buffered = true;
                } else {
                    self.buffered = true;
                }
            }
            if (self.buffered) {
                self.stopRender(checkReady);
                self.events.fire(Events.READY);
            }
        }

        function handleProgress() {
            if (!self.ready()) return;
            var bf = self.element.buffered,
                time = self.element.currentTime;
            var range = 0;
            while (!(bf.start(range) <= time && time <= bf.end(range))) {
                range += 1;
            }self.loaded.start = bf.start(range) / self.element.duration;
            self.loaded.end = bf.end(range) / self.element.duration;
            self.loaded.percent = self.loaded.end - self.loaded.start;
            self.events.fire(Events.PROGRESS, self.loaded);
        }

        _this15.play = function () {
            _this15.playing = true;
            _this15.element.play();
            _this15.startRender(step);
        };

        _this15.pause = function () {
            _this15.playing = false;
            _this15.element.pause();
            _this15.stopRender(step);
        };

        _this15.stop = function () {
            _this15.playing = false;
            _this15.element.pause();
            _this15.stopRender(step);
            if (_this15.ready()) _this15.element.currentTime = 0;
        };

        _this15.volume = function (v) {
            _this15.element.volume = v;
            if (_this15.muted) {
                _this15.muted = false;
                _this15.object.attr('muted', '');
            }
        };

        _this15.mute = function () {
            _this15.volume(0);
            _this15.muted = true;
            _this15.object.attr('muted', true);
        };

        _this15.seek = function (t) {
            if (_this15.element.readyState <= 1) {
                _this15.delayedCall(function () {
                    if (_this15.seek) _this15.seek(t);
                }, 32);
                return;
            }
            _this15.element.currentTime = t;
        };

        _this15.canPlayTo = function (t) {
            seekTo = null;
            if (t) seekTo = t;
            if (!_this15.buffered) _this15.startRender(checkReady);
            return _this15.buffered;
        };

        _this15.ready = function () {
            return _this15.element.readyState >= 2;
        };

        _this15.size = function (w, h) {
            _this15.element.width = _this15.width = w;
            _this15.element.height = _this15.height = h;
            _this15.object.size(_this15.width, _this15.height);
        };

        _this15.forceRender = function () {
            forceRender = true;
            _this15.startRender(step);
        };

        _this15.trackProgress = function () {
            _this15.element.addEventListener('progress', handleProgress, true);
        };

        _this15.destroy = function () {
            _this15.stop();
            _this15.element.src = '';
            _this15.object.destroy();
            return _get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), 'destroy', _this15).call(_this15);
        };
        return _this15;
    }

    _createClass(Video, [{
        key: 'loop',
        set: function set(bool) {
            this.element.loop = bool;
        },
        get: function get() {
            return this.element.loop;
        }
    }, {
        key: 'src',
        set: function set(src) {
            this.element.src = this.CDN + src;
        },
        get: function get() {
            return this.element.src;
        }
    }]);

    return Video;
}(Component);

/**
 * SVG interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var SVG = function SVG(name, type, params) {
    var _this16 = this;

    _classCallCheck(this, SVG);

    var self = this;
    var svg = void 0;

    createSVG();

    function createSVG() {
        switch (type) {
            case 'svg':
                createView();
                break;
            case 'radialGradient':
                createGradient();
                break;
            case 'linearGradient':
                createGradient();
                break;
            default:
                createElement();
                break;
        }
    }

    function createView() {
        svg = new Interface(name, 'svg');
        svg.element.setAttribute('preserveAspectRatio', 'xMinYMid meet');
        svg.element.setAttribute('version', '1.1');
        svg.element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        if (params.width) {
            svg.element.setAttribute('viewBox', '0 0 ' + params.width + ' ' + params.height);
            svg.element.style.width = params.width + 'px';
            svg.element.style.height = params.height + 'px';
        }
        self.object = svg;
    }

    function createElement() {
        svg = new Interface(name, 'svg', type);
        if (type === 'circle') setCircle();else if (type === 'radialGradient') setGradient();
        self.object = svg;
    }

    function setCircle() {
        ['cx', 'cy', 'r'].forEach(function (attr) {
            if (params.stroke && attr === 'r') svg.element.setAttributeNS(null, attr, params.width / 2 - params.stroke);else svg.element.setAttributeNS(null, attr, params.width / 2);
        });
    }

    function setGradient() {
        ['cx', 'cy', 'r', 'fx', 'fy', 'name'].forEach(function (attr) {
            svg.element.setAttributeNS(null, attr === 'name' ? 'id' : attr, params[attr]);
        });
        svg.element.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
    }

    function createColorStop(obj) {
        var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        ['offset', 'style'].forEach(function (attr) {
            stop.setAttributeNS(null, attr, attr === 'style' ? 'stop-color:' + obj[attr] : obj[attr]);
        });
        return stop;
    }

    function createGradient() {
        createElement();
        params.colors.forEach(function (param) {
            svg.element.appendChild(createColorStop(param));
        });
    }

    this.addTo = function (element) {
        if (element.points) element = element.points;else if (element.element) element = element.element;else if (element.object) element = element.object.element;
        element.appendChild(svg.element);
    };

    this.destroy = function () {
        _this16.object.destroy();
        return Utils.nullObject(_this16);
    };
};

/**
 * Storage helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Storage = new ( // Singleton reassignment pattern

function () {
    function Storage() {
        _classCallCheck(this, Storage);
    }

    _createClass(Storage, [{
        key: 'set',
        value: function set(key, value) {
            if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') value = JSON.stringify(value);
            if (value === null) window.localStorage.removeItem(key);else window.localStorage[key] = value;
        }
    }, {
        key: 'get',
        value: function get(key) {
            var value = window.localStorage[key];
            if (value) {
                var char0 = void 0;
                if (value.charAt) char0 = value.charAt(0);
                if (char0 === '{' || char0 === '[') value = JSON.parse(value);
                if (value === 'true' || value === 'false') value = value === 'true';
            }
            return value;
        }
    }]);

    return Storage;
}())(); // Singleton reassignment pattern

/**
 * Web audio engine.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

var WebAudio = new // Singleton reassignment pattern

function WebAudio() {
    var _this17 = this;

    _classCallCheck(this, WebAudio);

    var sounds = {};
    var context = void 0;

    this.init = function () {
        if (window.AudioContext) context = new AudioContext();
        if (!context) return;
        _this17.globalGain = context.createGain();
        _this17.globalGain.connect(context.destination);
    };

    this.createSound = function (id, audioData, callback) {
        var sound = {};
        context.decodeAudioData(audioData, function (buffer) {
            sound.buffer = buffer;
            sound.audioGain = context.createGain();
            sound.audioGain.connect(_this17.globalGain);
            sound.complete = true;
            if (callback) callback();
        });
        sounds[id] = sound;
    };

    this.getSound = function (id) {
        return sounds[id];
    };

    this.trigger = function (id) {
        if (!context) return;
        var sound = _this17.getSound(id),
            source = context.createBufferSource();
        source.buffer = sound.buffer;
        source.connect(sound.audioGain);
        source.loop = !!sound.loop;
        source.start(0);
    };

    this.mute = function () {
        if (!context) return;
        TweenManager.tween(_this17.globalGain.gain, { value: 0 }, 300, 'easeOutSine');
    };

    this.unmute = function () {
        if (!context) return;
        TweenManager.tween(_this17.globalGain.gain, { value: 1 }, 500, 'easeOutSine');
    };

    window.WebAudio = this;
}(); // Singleton reassignment pattern

/**
 * Linked list.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var LinkedList = function LinkedList() {
    var _this18 = this;

    _classCallCheck(this, LinkedList);

    this.first = null;
    this.last = null;
    this.current = null;
    this.prev = null;
    var nodes = [];

    function add(object) {
        return nodes[nodes.push({ object: object, prev: null, next: null }) - 1];
    }

    function remove(object) {
        for (var i = nodes.length - 1; i > -1; i--) {
            if (nodes[i].object === object) {
                nodes[i] = null;
                nodes.splice(i, 1);
                break;
            }
        }
    }

    function destroy() {
        for (var i = nodes.length - 1; i > -1; i--) {
            nodes[i] = null;
            nodes.splice(i, 1);
        }
        return Utils.nullObject(this);
    }

    function find(object) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].object === object) return nodes[i];
        }return null;
    }

    this.push = function (object) {
        var obj = add(object);
        if (!_this18.first) {
            obj.next = obj.prev = _this18.last = _this18.first = obj;
        } else {
            obj.next = _this18.first;
            obj.prev = _this18.last;
            _this18.last.next = obj;
            _this18.last = obj;
        }
    };

    this.remove = function (object) {
        var obj = find(object);
        if (!obj || !obj.next) return;
        if (nodes.length <= 1) {
            _this18.empty();
        } else {
            if (obj === _this18.first) {
                _this18.first = obj.next;
                _this18.last.next = _this18.first;
                _this18.first.prev = _this18.last;
            } else if (obj == _this18.last) {
                _this18.last = obj.prev;
                _this18.last.next = _this18.first;
                _this18.first.prev = _this18.last;
            } else {
                obj.prev.next = obj.next;
                obj.next.prev = obj.prev;
            }
        }
        remove(object);
    };

    this.empty = function () {
        _this18.first = null;
        _this18.last = null;
        _this18.current = null;
        _this18.prev = null;
    };

    this.start = function () {
        _this18.current = _this18.first;
        _this18.prev = _this18.current;
        return _this18.current;
    };

    this.next = function () {
        if (!_this18.current) return;
        if (nodes.length === 1 || _this18.prev.next === _this18.first) return;
        _this18.current = _this18.current.next;
        _this18.prev = _this18.current;
        return _this18.current;
    };

    this.destroy = destroy;
};

/**
 * Object pool.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var ObjectPool = function ObjectPool(type, number) {
    var _this19 = this;

    _classCallCheck(this, ObjectPool);

    var pool = [];
    this.array = pool;

    if (type) {
        number = number || 10;
        for (var i = 0; i < number; i++) {
            pool.push(new type());
        }
    }

    this.get = function () {
        return pool.shift() || (type ? new type() : null);
    };

    this.empty = function () {
        pool.length = 0;
    };

    this.put = function (object) {
        if (object) pool.push(object);
    };

    this.insert = function (array) {
        if (typeof array.push === 'undefined') array = [array];
        for (var _i = 0; _i < array.length; _i++) {
            pool.push(array[_i]);
        }
    };

    this.length = function () {
        return pool.length;
    };

    this.destroy = function () {
        for (var _i2 = 0; _i2 < pool.length; _i2++) {
            if (pool[_i2].destroy) pool[_i2].destroy();
        }return Utils.nullObject(_this19);
    };
};

/**
 * 3D vector.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Vector3 = function () {
    function Vector3(x, y, z, w) {
        _classCallCheck(this, Vector3);

        this.x = typeof x === 'number' ? x : 0;
        this.y = typeof y === 'number' ? y : 0;
        this.z = typeof z === 'number' ? z : 0;
        this.w = typeof w === 'number' ? w : 1;
        this.type = 'vector3';
    }

    _createClass(Vector3, [{
        key: 'set',
        value: function set(x, y, z, w) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;
            return this;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
            return this;
        }
    }, {
        key: 'copyTo',
        value: function copyTo(p) {
            p.x = this.x;
            p.y = this.y;
            p.z = this.z;
            p.w = this.w;
            return p;
        }
    }, {
        key: 'copyFrom',
        value: function copyFrom(p) {
            this.x = p.x || 0;
            this.y = p.y || 0;
            this.z = p.z || 0;
            this.w = p.w || 1;
            return this;
        }
    }, {
        key: 'lengthSq',
        value: function lengthSq() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }
    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.lengthSq());
        }
    }, {
        key: 'normalize',
        value: function normalize() {
            var m = 1 / this.length();
            this.set(this.x * m, this.y * m, this.z * m);
            return this;
        }
    }, {
        key: 'setLength',
        value: function setLength(length) {
            this.normalize().multiply(length);
            return this;
        }
    }, {
        key: 'addVectors',
        value: function addVectors(a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        }
    }, {
        key: 'subVectors',
        value: function subVectors(a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        }
    }, {
        key: 'multiplyVectors',
        value: function multiplyVectors(a, b) {
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;
            return this;
        }
    }, {
        key: 'add',
        value: function add(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }
    }, {
        key: 'sub',
        value: function sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        }
    }, {
        key: 'multiply',
        value: function multiply(v) {
            this.x *= v;
            this.y *= v;
            this.z *= v;
            return this;
        }
    }, {
        key: 'divide',
        value: function divide(v) {
            this.x /= v;
            this.y /= v;
            this.z /= v;
            return this;
        }
    }, {
        key: 'limit',
        value: function limit(max) {
            if (this.length() > max) {
                this.normalize();
                this.multiply(max);
            }
        }
    }, {
        key: 'heading2D',
        value: function heading2D() {
            return -Math.atan2(-this.y, this.x);
        }
    }, {
        key: 'lerp',
        value: function lerp(v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
        }
    }, {
        key: 'deltaLerp',
        value: function deltaLerp(v, alpha) {
            var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            for (var i = 0; i < delta; i++) {
                this.lerp(v, alpha);
            }return this;
        }
    }, {
        key: 'interp',
        value: function interp(v, alpha, ease) {
            var dist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;

            if (!this.calc) this.calc = new Vector3();
            this.calc.subVectors(this, v);
            var fn = Interpolation.convertEase(ease),
                a = fn(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
            return this.lerp(v, a);
        }
    }, {
        key: 'setAngleRadius',
        value: function setAngleRadius(a, r) {
            this.x = Math.cos(a) * r;
            this.y = Math.sin(a) * r;
            this.z = Math.sin(a) * r;
            return this;
        }
    }, {
        key: 'addAngleRadius',
        value: function addAngleRadius(a, r) {
            this.x += Math.cos(a) * r;
            this.y += Math.sin(a) * r;
            this.z += Math.sin(a) * r;
            return this;
        }
    }, {
        key: 'applyQuaternion',
        value: function applyQuaternion(q) {
            var x = this.x,
                y = this.y,
                z = this.z,
                qx = q.x,
                qy = q.y,
                qz = q.z,
                qw = q.w,
                ix = qw * x + qy * z - qz * y,
                iy = qw * y + qz * x - qx * z,
                iz = qw * z + qx * y - qy * x,
                iw = -qx * x - qy * y - qz * z;
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        }
    }, {
        key: 'dot',
        value: function dot(a) {
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new Vector3(this.x, this.y, this.z);
        }
    }, {
        key: 'cross',
        value: function cross(a) {
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

            var x = a.y * b.z - a.z * b.y,
                y = a.z * b.x - a.x * b.z,
                z = a.x * b.y - a.y * b.x;
            this.set(x, y, z, this.w);
            return this;
        }
    }, {
        key: 'distanceTo',
        value: function distanceTo(v, noSq) {
            var dx = this.x - v.x,
                dy = this.y - v.y,
                dz = this.z - v.z;
            if (!noSq) return Math.sqrt(dx * dx + dy * dy + dz * dz);
            return dx * dx + dy * dy + dz * dz;
        }
    }, {
        key: 'solveAngle',
        value: function solveAngle(a) {
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

            return Math.acos(a.dot(b) / (a.length() * b.length() || 0.00001));
        }
    }, {
        key: 'solveAngle2D',
        value: function solveAngle2D(a) {
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

            var calc = new Vector2(),
                calc2 = new Vector2();
            calc.copyFrom(a);
            calc2.copyFrom(b);
            return calc.solveAngle(calc2);
        }
    }, {
        key: 'equals',
        value: function equals(v) {
            return this.x === v.x && this.y === v.y && this.z === v.z;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var split = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';

            return this.x + split + this.y + split + this.z;
        }
    }]);

    return Vector3;
}();

/**
 * 3D utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

var Utils3D = new // Singleton reassignment pattern

function Utils3D() {
    var _this20 = this;

    _classCallCheck(this, Utils3D);

    this.PATH = '';
    var textures = {};
    var objectLoader = void 0,
        geomLoader = void 0,
        bufferGeomLoader = void 0;

    this.decompose = function (local, world) {
        local.matrixWorld.decompose(world.position, world.quaternion, world.scale);
    };

    this.createDebug = function () {
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;
        var color = arguments[1];

        var geom = new THREE.IcosahedronGeometry(size, 1),
            mat = color ? new THREE.MeshBasicMaterial({ color: color }) : new THREE.MeshNormalMaterial();
        return new THREE.Mesh(geom, mat);
    };

    this.createRT = function (width, height) {
        var params = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        };
        return new THREE.WebGLRenderTarget(width, height, params);
    };

    this.getTexture = function (src) {
        if (!textures[src]) {
            var img = Images.createImg(_this20.PATH + src),
                texture = new THREE.Texture(img);
            img.onload = function () {
                texture.needsUpdate = true;
                if (texture.onload) {
                    texture.onload();
                    texture.onload = null;
                }
                if (!THREE.Math.isPowerOfTwo(img.width * img.height)) texture.minFilter = THREE.LinearFilter;
            };
            textures[src] = texture;
        }
        return textures[src];
    };

    this.setInfinity = function (v) {
        var inf = Number.POSITIVE_INFINITY;
        v.set(inf, inf, inf);
        return v;
    };

    this.freezeMatrix = function (mesh) {
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
    };

    this.getCubemap = function (src) {
        var path = 'cube_' + (Array.isArray(src) ? src[0] : src);
        if (!textures[path]) {
            var images = [];
            for (var i = 0; i < 6; i++) {
                var img = Images.createImg(_this20.PATH + (Array.isArray(src) ? src[i] : src));
                images.push(img);
                img.onload = function () {
                    textures[path].needsUpdate = true;
                };
            }
            textures[path] = new THREE.Texture();
            textures[path].image = images;
            textures[path].minFilter = THREE.LinearFilter;
        }
        return textures[path];
    };

    this.loadObject = function (data) {
        if (!objectLoader) objectLoader = new THREE.ObjectLoader();
        return objectLoader.parse(data);
    };

    this.loadGeometry = function (data) {
        if (!geomLoader) geomLoader = new THREE.JSONLoader();
        if (!bufferGeomLoader) bufferGeomLoader = new THREE.BufferGeometryLoader();
        if (data.type === 'BufferGeometry') return bufferGeomLoader.parse(data);else return geomLoader.parse(data.data).geometry;
    };

    this.disposeAllTextures = function () {
        for (var key in textures) {
            textures[key].dispose();
        }
    };

    this.loadBufferGeometry = function (data) {
        var geometry = new THREE.BufferGeometry();
        if (data.data) data = data.data;
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal || data.position.length), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv || data.position.length / 3 * 2), 2));
        return geometry;
    };

    this.loadSkinnedGeometry = function (data) {
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv), 2));
        geometry.addAttribute('skinIndex', new THREE.BufferAttribute(new Float32Array(data.skinIndices), 4));
        geometry.addAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(data.skinWeights), 4));
        geometry.bones = data.bones;
        return geometry;
    };

    this.loadCurve = function (data) {
        var points = [];
        for (var i = 0; i < data.length; i += 3) {
            points.push(new THREE.Vector3(data[i + 0], data[i + 1], data[i + 2]));
        }return new THREE.CatmullRomCurve3(points);
    };

    this.setLightCamera = function (light, size, near, far, texture) {
        light.shadow.camera.left = -size;
        light.shadow.camera.right = size;
        light.shadow.camera.top = size;
        light.shadow.camera.bottom = -size;
        light.castShadow = true;
        if (near) light.shadow.camera.near = near;
        if (far) light.shadow.camera.far = far;
        if (texture) light.shadow.mapSize.width = light.shadow.mapSize.height = texture;
        light.shadow.camera.updateProjectionMatrix();
    };

    this.getRepeatTexture = function (src) {
        var texture = _this20.getTexture(src);
        texture.onload = function () {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        };
        return texture;
    };
}(); // Singleton reassignment pattern

/**
 * Raycaster.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

var Raycaster = function Raycaster(camera) {
    var _this21 = this;

    _classCallCheck(this, Raycaster);

    this.camera = camera;
    var calc = new THREE.Vector2(),
        raycaster = new THREE.Raycaster();
    var debug = void 0;

    function ascSort(a, b) {
        return a.distance - b.distance;
    }

    function intersectObject(object, raycaster, intersects, recursive) {
        if (object.visible === false) return;
        var parent = object.parent;
        while (parent) {
            if (parent.visible === false) return;
            parent = parent.parent;
        }
        object.raycast(raycaster, intersects);
        if (recursive === true) {
            var children = object.children;
            for (var i = 0, l = children.length; i < l; i++) {
                intersectObject(children[i], raycaster, intersects, true);
            }
        }
    }

    function intersect(objects) {
        if (!Array.isArray(objects)) objects = [objects];
        var intersects = [];
        objects.forEach(function (object) {
            return intersectObject(object, raycaster, intersects, false);
        });
        intersects.sort(ascSort);
        if (debug) updateDebug();
        return intersects;
    }

    function updateDebug() {
        var vertices = debug.geometry.vertices;
        vertices[0].copy(raycaster.ray.origin.clone());
        vertices[1].copy(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(10000)));
        debug.geometry.verticesNeedUpdate = true;
    }

    this.pointsThreshold = function (value) {
        raycaster.params.Points.threshold = value;
    };

    this.debug = function (scene) {
        var geom = new THREE.Geometry();
        geom.vertices.push(new THREE.Vector3(-100, 0, 0));
        geom.vertices.push(new THREE.Vector3(100, 0, 0));
        var mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
        debug = new THREE.Line(geom, mat);
        scene.add(debug);
    };

    this.checkHit = function (objects) {
        var mouse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Mouse;

        var rect = _this21.rect || Stage;
        if (mouse === Mouse && rect === Stage) {
            calc.copy(Mouse.tilt);
        } else {
            calc.x = mouse.x / rect.width * 2 - 1;
            calc.y = -(mouse.y / rect.height) * 2 + 1;
        }
        raycaster.setFromCamera(calc, camera);
        return intersect(objects);
    };

    this.checkFromValues = function (objects, origin, direction) {
        raycaster.set(origin, direction, 0, Number.POSITIVE_INFINITY);
        return intersect(objects);
    };

    this.destroy = function () {
        return Utils.nullObject(_this21);
    };
};

/**
 * 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interaction3D = function () {
    function Interaction3D(camera) {
        var _this22 = this;

        _classCallCheck(this, Interaction3D);

        if (!Interaction3D.instance) {
            Interaction3D.HOVER = 'interaction3d_hover';
            Interaction3D.CLICK = 'interaction3d_click';

            Interaction3D.instance = this;
        }

        var self = this;
        this.events = new Events();
        this.ray = new Raycaster(camera);
        this.meshes = [];
        this.meshCallbacks = [];
        this.cursor = 'auto';
        this.enabled = true;
        var event = {};
        var hoverTarget = void 0,
            clickTarget = void 0;

        addListeners();

        function addListeners() {
            Mouse.input.events.add(Interaction.START, start);
            Mouse.input.events.add(Interaction.MOVE, move);
            Mouse.input.events.add(Interaction.CLICK, click);
        }

        function start() {
            if (!self.enabled) return;
            var hit = move();
            if (hit) {
                clickTarget = hit.object;
                clickTarget.time = Render.TIME;
            } else {
                clickTarget = null;
            }
        }

        function move() {
            if (!self.enabled) return;
            var hit = self.ray.checkHit(self.meshes)[0];
            if (hit) {
                var mesh = hit.object;
                if (mesh !== hoverTarget) {
                    if (hoverTarget) triggerHover('out', hoverTarget);
                    hoverTarget = mesh;
                    triggerHover('over', hoverTarget);
                    Stage.css('cursor', 'pointer');
                }
                return hit;
            } else {
                if (hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', self.cursor);
                }
                return false;
            }
        }

        function click() {
            if (!self.enabled) return;
            if (!clickTarget) return;
            var hit = self.ray.checkHit(self.meshes)[0];
            if (hit && hit.object === clickTarget) triggerClick(clickTarget);
            clickTarget = null;
        }

        function triggerHover(action, mesh) {
            event.action = action;
            event.mesh = mesh;
            self.events.fire(Interaction3D.HOVER, event);
            var i = self.meshes.indexOf(hoverTarget);
            if (self.meshCallbacks[i].hoverCallback) self.meshCallbacks[i].hoverCallback(event);
        }

        function triggerClick(mesh) {
            event.action = 'click';
            event.mesh = mesh;
            self.events.fire(Interaction3D.CLICK, event);
            var i = self.meshes.indexOf(clickTarget);
            if (self.meshCallbacks[i].clickCallback) self.meshCallbacks[i].clickCallback(event);
        }

        function parseMeshes(meshes) {
            if (!Array.isArray(meshes)) meshes = [meshes];
            var output = [];
            meshes.forEach(checkMesh);

            function checkMesh(mesh) {
                if (mesh.type === 'Mesh' && mesh.mouseEnabled) output.push(mesh);
                if (mesh.children.length) mesh.children.forEach(checkMesh);
            }

            return output;
        }

        this.add = function (meshes, hoverCallback, clickCallback, parse) {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(function (mesh) {
                _this22.meshes.push(mesh);
                _this22.meshCallbacks.push({ hoverCallback: hoverCallback, clickCallback: clickCallback });
            });
        };

        this.remove = function (meshes, parse) {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(function (mesh) {
                if (mesh === hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', _this22.cursor);
                }
                for (var i = _this22.meshes.length - 1; i >= 0; i--) {
                    if (_this22.meshes[i] === mesh) {
                        _this22.meshes.splice(i, 1);
                        _this22.meshCallbacks.splice(i, 1);
                    }
                }
            });
        };

        this.destroy = function () {
            return Utils.nullObject(_this22);
        };
    }

    _createClass(Interaction3D, [{
        key: 'camera',
        set: function set(c) {
            this.ray.camera = c;
        }
    }]);

    return Interaction3D;
}();

/**
 * Screen projection.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

var ScreenProjection = function ScreenProjection(camera) {
    var _this23 = this;

    _classCallCheck(this, ScreenProjection);

    var v3 = new THREE.Vector3(),
        v32 = new THREE.Vector3(),
        value = new THREE.Vector3();

    this.set = function (v) {
        camera = v;
    };

    this.unproject = function (mouse, distance) {
        var rect = _this23.rect || Stage;
        v3.set(mouse.x / rect.width * 2 - 1, -(mouse.y / rect.height) * 2 + 1, 0.5);
        v3.unproject(camera);
        var pos = camera.position;
        v3.sub(pos).normalize();
        var dist = distance || -pos.z / v3.z;
        value.copy(pos).add(v3.multiplyScalar(dist));
        return value;
    };

    this.project = function (pos) {
        var rect = _this23.rect || Stage;
        if (pos instanceof THREE.Object3D) {
            pos.updateMatrixWorld();
            v32.set(0, 0, 0).setFromMatrixPosition(pos.matrixWorld);
        } else {
            v32.copy(pos);
        }
        v32.project(camera);
        v32.x = (v32.x + 1) / 2 * rect.width;
        v32.y = -(v32.y - 1) / 2 * rect.height;
        return v32;
    };
};

/**
 * Shader parser.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Shaders = new // Singleton reassignment pattern

function Shaders() {
    _classCallCheck(this, Shaders);

    var shaders = {};

    function parseSingleShader(code) {
        var attributes = code.split('#!ATTRIBUTES')[1].split('#!')[0],
            uniforms = code.split('#!UNIFORMS')[1].split('#!')[0],
            varyings = code.split('#!VARYINGS')[1].split('#!')[0];
        while (~code.indexOf('#!SHADER')) {
            code = code.slice(code.indexOf('#!SHADER'));
            var split = code.split('#!SHADER')[1],
                br = split.indexOf('\n'),
                name = split.slice(0, br).split(': ')[1];
            var glsl = split.slice(br);
            if (~name.indexOf('.vs')) glsl = attributes + uniforms + varyings + glsl;else glsl = uniforms + varyings + glsl;
            shaders[name] = glsl;
            code = code.replace('#!SHADER', '$');
        }
    }

    function parseCompiled(code) {
        var split = code.split('{@}');
        split.shift();
        for (var i = 0; i < split.length; i += 2) {
            var name = split[i],
                text = split[i + 1];
            if (~text.indexOf('#!UNIFORMS')) parseSingleShader(text);else shaders[name] = text;
        }
    }

    function parseRequirements() {
        for (var key in shaders) {
            var object = shaders[key];
            if (typeof object === 'string' && ~object.indexOf('require')) shaders[key] = require(object);
        }
    }

    function require(shader) {
        while (~shader.indexOf('#require')) {
            var split = shader.split('#require('),
                name = split[1].split(')')[0];
            shader = shader.replace('#require(' + name + ')', shaders[name]);
        }
        return shader;
    }

    this.parse = function (code, path) {
        if (!~code.indexOf('{@}')) {
            shaders[path.split('/').last()] = code;
        } else {
            parseCompiled(code);
            parseRequirements();
        }
    };

    this.getShader = function (file) {
        return shaders[file];
    };

    window.Shaders = this;
}(); // Singleton reassignment pattern

/**
 * Shader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

var Shader = function () {
    function Shader(vertexShader, fragmentShader, props) {
        _classCallCheck(this, Shader);

        if (typeof fragmentShader !== 'string') {
            props = fragmentShader;
            fragmentShader = vertexShader;
        }
        var self = this;
        this.uniforms = {};
        this.properties = {};

        initProperties();
        initShaders();

        function initProperties() {
            for (var key in props) {
                if (typeof props[key].value !== 'undefined') self.uniforms[key] = props[key];else self.properties[key] = props[key];
            }
        }

        function initShaders() {
            var params = {};
            params.vertexShader = process(Shaders.getShader(vertexShader + '.vs') || vertexShader, 'vs');
            params.fragmentShader = process(Shaders.getShader(fragmentShader + '.fs') || fragmentShader, 'fs');
            params.uniforms = self.uniforms;
            for (var key in self.properties) {
                params[key] = self.properties[key];
            }self.material = new THREE.RawShaderMaterial(params);
            self.material.shader = self;
            self.uniforms = self.material.uniforms;
        }

        function process(code, type) {
            var header = void 0;
            if (type === 'vs') {
                header = ['precision highp float;', 'precision highp int;', 'attribute vec2 uv;', 'attribute vec3 position;', 'attribute vec3 normal;', 'uniform mat4 modelViewMatrix;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelMatrix;', 'uniform mat4 viewMatrix;', 'uniform mat3 normalMatrix;', 'uniform vec3 cameraPosition;'].join('\n');
            } else {
                header = [~code.indexOf('dFdx') ? '#extension GL_OES_standard_derivatives : enable' : '', 'precision highp float;', 'precision highp int;', 'uniform mat4 modelViewMatrix;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelMatrix;', 'uniform mat4 viewMatrix;', 'uniform mat3 normalMatrix;', 'uniform vec3 cameraPosition;'].join('\n');
            }
            code = header + code;
            var threeChunk = function threeChunk(a, b) {
                return THREE.ShaderChunk[b] + '\n';
            };
            return code.replace(/#s?chunk\(\s?(\w+)\s?\);/g, threeChunk);
        }
    }

    _createClass(Shader, [{
        key: 'set',
        value: function set(key, value) {
            TweenManager.clearTween(this.uniforms[key]);
            this.uniforms[key].value = value;
        }
    }, {
        key: 'tween',
        value: function tween(key, value, time, ease, delay, callback, update) {
            return TweenManager.tween(this.uniforms[key], { value: value }, time, ease, delay, callback, update);
        }
    }, {
        key: 'getValues',
        value: function getValues() {
            var out = {};
            for (var key in this.uniforms) {
                out[key] = this.uniforms[key].value;
            }return out;
        }
    }, {
        key: 'copyUniformsTo',
        value: function copyUniformsTo(object) {
            for (var key in this.uniforms) {
                object.uniforms[key] = this.uniforms[key];
            }
        }
    }, {
        key: 'cloneUniformsTo',
        value: function cloneUniformsTo(object) {
            for (var key in this.uniforms) {
                object.uniforms[key] = { type: this.uniforms[key].type, value: this.uniforms[key].value };
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.material.dispose();
            return Utils.nullObject(this);
        }
    }]);

    return Shader;
}();

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

Math.sign = function (x) {
    x = +x;
    if (x === 0 || isNaN(x)) return Number(x);
    return x > 0 ? 1 : -1;
};

Math.degrees = function (radians) {
    return radians * (180 / Math.PI);
};

Math.radians = function (degrees) {
    return degrees * (Math.PI / 180);
};

Math.clamp = function (value) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

Math.range = function (value) {
    var oldMin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var oldMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var newMin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var newMax = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var isClamp = arguments[5];

    var newValue = (value - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    if (isClamp) return Math.clamp(newValue, Math.min(newMin, newMax), Math.max(newMin, newMax));
    return newValue;
};

Math.mix = function (a, b, alpha) {
    return a * (1 - alpha) + b * alpha;
};

Math.step = function (edge, value) {
    return value < edge ? 0 : 1;
};

Math.smoothStep = function (min, max, value) {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

Math.fract = function (value) {
    return value - Math.floor(value);
};

Math.mod = function (value, n) {
    return (value % n + n) % n;
};

Array.prototype.remove = function (element) {
    var index = this.indexOf(element);
    if (~index) return this.splice(index, 1);
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

String.prototype.includes = function (str) {
    if (!Array.isArray(str)) return ~this.indexOf(str);
    for (var i = str.length - 1; i >= 0; i--) {
        if (~this.indexOf(str[i])) return true;
    }return false;
};

String.prototype.clip = function (num, end) {
    return this.length > num ? this.slice(0, num) + end : this;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function (find, replace) {
    return this.split(find).join(replace);
};

if (!window.fetch) window.fetch = function (url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var promise = Promise.create(),
        request = new XMLHttpRequest();
    request.open(options.method || 'GET', url);
    for (var i in options.headers) {
        request.setRequestHeader(i, options.headers[i]);
    }request.onload = function () {
        return promise.resolve(response());
    };
    request.onerror = promise.reject;
    request.send(options.body);

    function response() {
        var _keys = [],
            all = [],
            headers = {},
            header = void 0;
        request.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm, function (m, key, value) {
            _keys.push(key = key.toLowerCase());
            all.push([key, value]);
            header = headers[key];
            headers[key] = header ? header + ',' + value : value;
        });
        return {
            ok: (request.status / 200 | 0) == 1,
            status: request.status,
            statusText: request.statusText,
            url: request.responseURL,
            clone: response,
            text: function text() {
                return Promise.resolve(request.responseText);
            },
            json: function json() {
                return Promise.resolve(request.responseText).then(JSON.parse);
            },
            xml: function xml() {
                return Promise.resolve(request.responseXML);
            },
            blob: function blob() {
                return Promise.resolve(new Blob([request.response]));
            },
            arrayBuffer: function arrayBuffer() {
                return Promise.resolve(new ArrayBuffer([request.response]));
            },

            headers: {
                keys: function keys() {
                    return _keys;
                },
                entries: function entries() {
                    return all;
                },
                get: function get(n) {
                    return headers[n.toLowerCase()];
                },
                has: function has(n) {
                    return n.toLowerCase() in headers;
                }
            }
        };
    }
    return promise;
};

window.get = function (url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var promise = Promise.create();
    options.method = 'GET';
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(function (text) {
            if (text.charAt(0).includes(['[', '{'])) {
                try {
                    promise.resolve(JSON.parse(text));
                } catch (err) {
                    promise.resolve(text);
                }
            } else {
                promise.resolve(text);
            }
        });
    }
    return promise;
};

window.post = function (url, body) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var promise = Promise.create();
    options.method = 'POST';
    options.body = JSON.stringify(body);
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(function (text) {
            if (text.charAt(0).includes(['[', '{'])) {
                try {
                    promise.resolve(JSON.parse(text));
                } catch (err) {
                    promise.resolve(text);
                }
            } else {
                promise.resolve(text);
            }
        });
    }
    return promise;
};

window.getURL = function (url) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_blank';

    window.open(url, target);
};

if (!window.Global) window.Global = {};
if (!window.Config) window.Config = {};

/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

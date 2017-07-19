var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.Events) window.Events = {
    BROWSER_FOCUS: 'browser_focus',
    KEYBOARD_DOWN: 'keyboard_down',
    KEYBOARD_UP: 'keyboard_up',
    KEYBOARD_PRESS: 'keyboard_press',
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
    var _this = this;

    classCallCheck(this, EventManager);

    var events = [];

    this.add = function (event, callback, object) {
        events.push({ event: event, callback: callback, object: object });
    };

    this.remove = function (eventString, callback) {
        for (var i = events.length - 1; i > -1; i--) {
            if (events[i].event === eventString && events[i].callback === callback) {
                events[i] = null;
                events.splice(i, 1);
            }
        }
    };

    this.destroy = function (object) {
        if (object) {
            for (var i = events.length - 1; i > -1; i--) {
                if (events[i].object === object) {
                    events[i] = null;
                    events.splice(i, 1);
                }
            }
        } else {
            window.events.destroy(_this);
            for (var _i = events.length - 1; _i > -1; _i--) {
                events[_i] = null;
                events.splice(_i, 1);
            }
            return null;
        }
    };

    this.fire = function (eventString) {
        var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        for (var i = 0; i < events.length; i++) {
            if (events[i].event === eventString) events[i].callback(object);
        }
    };

    this.subscribe = function (event, callback) {
        window.events.add(event, callback, _this);
        return callback;
    };

    this.unsubscribe = function (event, callback) {
        window.events.remove(event, callback, _this);
    };
};

if (!window.events) window.events = new EventManager();

/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    return Delayed(callback, 1000 / 60);
};

var Render = new // Singleton pattern

function Render() {
    classCallCheck(this, Render);

    var last = void 0,
        render = [],
        time = Date.now(),
        timeSinceRender = 0,
        rendering = false;

    function focus(e) {
        if (e.type === 'focus') last = Date.now();
    }

    function step() {
        var t = Date.now(),
            timeSinceLoad = t - time,
            diff = 0,
            fps = 60;
        if (last) {
            diff = t - last;
            fps = 1000 / diff;
        }
        last = t;
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
    }

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
        var i = render.indexOf(callback);
        if (i > -1) render.splice(i, 1);
    };
}(); // Singleton pattern

/**
 * Dynamic object with linear interpolation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var DynamicObject = function DynamicObject(props) {
    var _this = this;

    classCallCheck(this, DynamicObject);

    for (var key in props) {
        this[key] = props[key];
    }this.lerp = function (v, ratio) {
        for (var _key in props) {
            _this[_key] += (v[_key] - _this[_key]) * ratio;
        }return _this;
    };
};

/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Device = new ( // Singleton pattern

function () {
    function Device() {
        var _this = this;

        classCallCheck(this, Device);

        this.agent = navigator.userAgent.toLowerCase();
        this.prefix = function () {
            var pre = '',
                dom = '',
                styles = window.getComputedStyle(document.documentElement, '');
            pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
            dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
            var IE = _this.detect('trident');
            return {
                unprefixed: IE && !_this.detect('msie 9'),
                dom: dom,
                lowercase: pre,
                css: '-' + pre + '-',
                js: (IE ? pre[0] : pre[0].toUpperCase()) + pre.substr(1)
            };
        }();
        this.transformProperty = function () {
            var pre = void 0;
            switch (_this.prefix.lowercase) {
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

    createClass(Device, [{
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
}())(); // Singleton pattern

/**
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Utils = new ( // Singleton pattern

function () {
    function Utils() {
        classCallCheck(this, Utils);
    }

    createClass(Utils, [{
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
        key: 'cloneArray',
        value: function cloneArray(array) {
            return array.slice(0);
        }
    }, {
        key: 'toArray',
        value: function toArray$$1(object) {
            return Object.keys(object).map(function (key) {
                return object[key];
            });
        }
    }, {
        key: 'queryString',
        value: function queryString(key) {
            // eslint-disable-next-line no-useless-escape
            return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
        }
    }, {
        key: 'basename',
        value: function basename(path) {
            return path.replace(/.*\//, '').replace(/(.*)\..*$/, '$1');
        }
    }]);
    return Utils;
}())(); // Singleton pattern

/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interpolation = new // Singleton pattern

function Interpolation() {
    var _this = this;

    classCallCheck(this, Interpolation);

    this.convertEase = function (ease) {
        return function () {
            var fn = void 0;
            switch (ease) {
                case 'easeInQuad':
                    fn = _this.Quad.In;
                    break;
                case 'easeInCubic':
                    fn = _this.Cubic.In;
                    break;
                case 'easeInQuart':
                    fn = _this.Quart.In;
                    break;
                case 'easeInQuint':
                    fn = _this.Quint.In;
                    break;
                case 'easeInSine':
                    fn = _this.Sine.In;
                    break;
                case 'easeInExpo':
                    fn = _this.Expo.In;
                    break;
                case 'easeInCirc':
                    fn = _this.Circ.In;
                    break;
                case 'easeInElastic':
                    fn = _this.Elastic.In;
                    break;
                case 'easeInBack':
                    fn = _this.Back.In;
                    break;
                case 'easeInBounce':
                    fn = _this.Bounce.In;
                    break;
                case 'easeOutQuad':
                    fn = _this.Quad.Out;
                    break;
                case 'easeOutCubic':
                    fn = _this.Cubic.Out;
                    break;
                case 'easeOutQuart':
                    fn = _this.Quart.Out;
                    break;
                case 'easeOutQuint':
                    fn = _this.Quint.Out;
                    break;
                case 'easeOutSine':
                    fn = _this.Sine.Out;
                    break;
                case 'easeOutExpo':
                    fn = _this.Expo.Out;
                    break;
                case 'easeOutCirc':
                    fn = _this.Circ.Out;
                    break;
                case 'easeOutElastic':
                    fn = _this.Elastic.Out;
                    break;
                case 'easeOutBack':
                    fn = _this.Back.Out;
                    break;
                case 'easeOutBounce':
                    fn = _this.Bounce.Out;
                    break;
                case 'easeInOutQuad':
                    fn = _this.Quad.InOut;
                    break;
                case 'easeInOutCubic':
                    fn = _this.Cubic.InOut;
                    break;
                case 'easeInOutQuart':
                    fn = _this.Quart.InOut;
                    break;
                case 'easeInOutQuint':
                    fn = _this.Quint.InOut;
                    break;
                case 'easeInOutSine':
                    fn = _this.Sine.InOut;
                    break;
                case 'easeInOutExpo':
                    fn = _this.Expo.InOut;
                    break;
                case 'easeInOutCirc':
                    fn = _this.Circ.InOut;
                    break;
                case 'easeInOutElastic':
                    fn = _this.Elastic.InOut;
                    break;
                case 'easeInOutBack':
                    fn = _this.Back.InOut;
                    break;
                case 'easeInOutBounce':
                    fn = _this.Bounce.InOut;
                    break;
                case 'linear':
                    fn = _this.Linear.None;
                    break;
            }
            return fn;
        }() || _this.Cubic.Out;
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
            return 1 - _this.Bounce.Out(1 - k);
        },
        Out: function Out(k) {
            if (k < 1 / 2.75) return 7.5625 * k * k;else if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;else if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;else return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
        },
        InOut: function InOut(k) {
            if (k < 0.5) return _this.Bounce.In(k * 2) * 0.5;
            return _this.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    };
}(); // Singleton pattern

/**
 * Mathematical.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var MathTween = function MathTween(object, props, time, ease, delay, callback) {
    classCallCheck(this, MathTween);

    var self = this;
    var startTime = void 0,
        startValues = void 0,
        endValues = void 0,
        paused = void 0,
        elapsed = void 0;

    initMathTween();

    function initMathTween() {
        TweenManager.clearTween(object);
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
        object.mathTween = null;
        if (!stop) for (var prop in endValues) {
            if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
        }TweenManager.removeMathTween(self);
    }

    this.update = function (t) {
        if (paused || t < startTime) return;
        elapsed = (t - startTime) / time;
        elapsed = elapsed > 1 ? 1 : elapsed;
        var delta = ease(elapsed);
        for (var prop in startValues) {
            if (typeof startValues[prop] === 'number') {
                var start = startValues[prop],
                    end = endValues[prop];
                object[prop] = start + (end - start) * delta;
            }
        }
        if (elapsed === 1) {
            clear();
            if (callback) callback();
        }
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

var SpringTween = function SpringTween(object, props, friction, ease, delay, callback) {
    classCallCheck(this, SpringTween);

    var self = this;
    var startTime = void 0,
        velocityValues = void 0,
        endValues = void 0,
        startValues = void 0,
        damping = void 0,
        count = void 0,
        paused = void 0;

    initSpringTween();

    function initSpringTween() {
        TweenManager.clearTween(object);
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
        object.mathTween = null;
        if (!stop) for (var prop in endValues) {
            if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
        }TweenManager.removeMathTween(self);
    }

    this.update = function (t) {
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
        if (Math.abs(vel) < 0.001) {
            count++;
            if (count > 30) {
                clear();
                if (callback) callback();
            }
        }
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

var TweenManager = new ( // Singleton pattern

function () {
    function TweenManager() {
        classCallCheck(this, TweenManager);

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

        function updateTweens(t) {
            if (tweens.length) {
                for (var i = 0; i < tweens.length; i++) {
                    tweens[i].update(t);
                }
            } else {
                rendering = false;
                Render.stop(updateTweens);
            }
        }

        this.addMathTween = function (tween) {
            tweens.push(tween);
            if (!rendering) {
                rendering = true;
                Render.start(updateTweens);
            }
        };

        this.removeMathTween = function (tween) {
            var i = tweens.indexOf(tween);
            if (i > -1) tweens.splice(i, 1);
        };
    }

    createClass(TweenManager, [{
        key: 'tween',
        value: function tween(object, props, time, ease, delay, callback) {
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
            var tween = ease === 'spring' ? new SpringTween(object, props, time, ease, delay, callback) : new MathTween(object, props, time, ease, delay, callback);
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
            var eases = this.CSS_EASES;
            return eases[name] || eases.easeOutCubic;
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
}())(); // Singleton pattern

/**
 * CSS3 transition animation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var CSSTransition = function CSSTransition(object, props, time, ease, delay, callback) {
    classCallCheck(this, CSSTransition);

    var self = this;
    var transform = TweenManager.getAllTransforms(object),
        properties = [];

    initProperties();
    initCSSTween();

    function killed() {
        return !object || !object.element;
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
        TweenManager.clearCSSTween(object);
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
        object.element.style[Device.vendor('Transition')] = '';
        object.cssTween = null;
    }

    this.stop = function () {
        return clear();
    };
};

/**
 * SVG helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var SVG = new // Singleton pattern

function SVG() {
    classCallCheck(this, SVG);

    var symbols = [];

    this.defineSymbol = function (id, width, height, innerHTML) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('style', 'display: none;');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.innerHTML = '<symbol id="' + id + '">' + innerHTML + '</symbol>';
        document.body.insertBefore(svg, document.body.firstChild);
        symbols.push({ id: id, width: width, height: height });
    };

    this.getSymbolConfig = function (id) {
        for (var i = 0; i < symbols.length; i++) {
            if (symbols[i].id === id) return symbols[i];
        }return null;
    };
}(); // Singleton pattern

/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interface = function () {
    function Interface(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
        var detached = arguments[2];
        classCallCheck(this, Interface);

        this.events = new EventManager();
        this.name = name;
        this.type = type;
        if (this.type === 'svg') {
            this.element = document.createElementNS('http://www.w3.org/2000/svg', this.type);
            this.element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        } else {
            this.element = document.createElement(this.type);
        }
        if (name[0] === '.') this.element.className = name.substr(1);else this.element.id = name;
        this.element.style.position = 'absolute';
        if (!detached) {
            var stage = window.Alien && window.Alien.Stage ? window.Alien.Stage : document.body;
            stage.appendChild(this.element);
        }
    }

    createClass(Interface, [{
        key: 'initClass',
        value: function initClass(object) {
            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                params[_key - 1] = arguments[_key];
            }

            var child = new (Function.prototype.bind.apply(object, [null].concat(params)))();
            if (child.element) this.element.appendChild(child.element);
            child.parent = this;
            return child;
        }
    }, {
        key: 'create',
        value: function create(name, type) {
            var child = new Interface(name, type);
            this.element.appendChild(child.element);
            child.parent = this;
            return child;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.loop) Render.stop(this.loop);
            this.events = this.events.destroy();
            this.element.parentNode.removeChild(this.element);
            return Utils.nullObject(this);
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
            var config = SVG.getSymbolConfig(id);
            this.html('<svg viewBox="0 0 ' + config.width + ' ' + config.height + '" width="' + width + '" height="' + height + '"><use xlink:href="#' + config.id + '" x="0" y="0"/></svg>');
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
            var _this = this;

            var clicked = function clicked(e) {
                e.object = _this.element.className === 'hit' ? _this.parent : _this;
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
            var _this2 = this;

            var hovered = function hovered(e) {
                e.object = _this2.element.className === 'hit' ? _this2.parent : _this2;
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
            var _this3 = this;

            var pressed = function pressed(e) {
                e.object = _this3.element.className === 'hit' ? _this3.parent : _this3;
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
            if (!Device.mobile) this.hit.hover(overCallback).click(clickCallback);else this.hit.touchClick(overCallback, clickCallback);
            return this;
        }
    }, {
        key: 'touchSwipe',
        value: function touchSwipe(callback) {
            var _this4 = this;

            var distance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 75;

            var startX = void 0,
                startY = void 0,
                moving = false,
                move = {};
            var touchStart = function touchStart(e) {
                var touch = Utils.touchEvent(e);
                if (e.touches.length === 1) {
                    startX = touch.x;
                    startY = touch.y;
                    moving = true;
                    _this4.element.addEventListener('touchmove', touchMove, { passive: true });
                }
            };
            var touchMove = function touchMove(e) {
                if (moving) {
                    var touch = Utils.touchEvent(e),
                        dx = startX - touch.x,
                        dy = startY - touch.y;
                    move.direction = null;
                    move.moving = null;
                    move.x = null;
                    move.y = null;
                    move.evt = e;
                    if (Math.abs(dx) >= distance) {
                        touchEnd();
                        move.direction = dx > 0 ? 'left' : 'right';
                    } else if (Math.abs(dy) >= distance) {
                        touchEnd();
                        move.direction = dy > 0 ? 'up' : 'down';
                    } else {
                        move.moving = true;
                        move.x = dx;
                        move.y = dy;
                    }
                    if (callback) callback(move, e);
                }
            };
            var touchEnd = function touchEnd() {
                startX = startY = moving = false;
                _this4.element.removeEventListener('touchmove', touchMove);
            };
            this.element.addEventListener('touchstart', touchStart, { passive: true });
            this.element.addEventListener('touchend', touchEnd, { passive: true });
            this.element.addEventListener('touchcancel', touchEnd, { passive: true });
            return this;
        }
    }, {
        key: 'touchClick',
        value: function touchClick(hover, click) {
            var _this5 = this;

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
                e.object = _this5.element.className === 'hit' ? _this5.parent : _this5;
                setTouch(e);
                if (hover && !move) hover(e);
            };
            var touchEnd = function touchEnd(e) {
                var t = Date.now();
                e.object = _this5.element.className === 'hit' ? _this5.parent : _this5;
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

var Canvas = function (_Interface) {
    inherits(Canvas, _Interface);

    function Canvas(name, w) {
        var h = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : w;
        var retina = arguments[3];
        var detached = arguments[4];
        classCallCheck(this, Canvas);

        var _this = possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, name, 'canvas', detached));

        _this.children = [];
        _this.retina = retina;
        _this.context = _this.element.getContext('2d');
        var ratio = retina ? 2 : 1;
        _this.element.width = w * ratio;
        _this.element.height = h * ratio;
        _this.context.scale(ratio, ratio);
        _this.size(w, h);
        return _this;
    }

    createClass(Canvas, [{
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
            var i = this.children.indexOf(display);
            if (i > -1) this.children.splice(i, 1);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.stopRender();
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].destroy();
            }return Utils.nullObject(this);
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
}(Interface);

/**
 * Canvas values.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var CanvasValues = function () {
    function CanvasValues(style) {
        classCallCheck(this, CanvasValues);

        this.styles = {};
        if (!style) this.data = new Float32Array(6);else this.styled = false;
    }

    createClass(CanvasValues, [{
        key: "setTRSA",
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
        key: "calculate",
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
        key: "calculateStyle",
        value: function calculateStyle(parent) {
            if (!parent.styled) return false;
            this.styled = true;
            var values = parent.values;
            for (var key in values) {
                if (!this.styles[key]) this.styles[key] = values[key];
            }
        }
    }, {
        key: "shadowOffsetX",
        set: function set$$1(val) {
            this.styled = true;
            this.styles.shadowOffsetX = val;
        },
        get: function get$$1() {
            return this.styles.shadowOffsetX;
        }
    }, {
        key: "shadowOffsetY",
        set: function set$$1(val) {
            this.styled = true;
            this.styles.shadowOffsetY = val;
        },
        get: function get$$1() {
            return this.styles.shadowOffsetY;
        }
    }, {
        key: "shadowBlur",
        set: function set$$1(val) {
            this.styled = true;
            this.styles.shadowBlur = val;
        },
        get: function get$$1() {
            return this.styles.shadowBlur;
        }
    }, {
        key: "shadowColor",
        set: function set$$1(val) {
            this.styled = true;
            this.styles.shadowColor = val;
        },
        get: function get$$1() {
            return this.styles.shadowColor;
        }
    }, {
        key: "values",
        get: function get$$1() {
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
        classCallCheck(this, CanvasObject);

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

    createClass(CanvasObject, [{
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
            var i = this.children.indexOf(display);
            if (i > -1) this.children.splice(i, 1);
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

var Images = new ( // Singleton pattern

function () {
    function Images() {
        classCallCheck(this, Images);
    }

    createClass(Images, [{
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
}())(); // Singleton pattern

/**
 * Canvas graphics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var CanvasGraphics = function (_CanvasObject) {
    inherits(CanvasGraphics, _CanvasObject);

    function CanvasGraphics() {
        var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;
        classCallCheck(this, CanvasGraphics);

        var _this = possibleConstructorReturn(this, (CanvasGraphics.__proto__ || Object.getPrototypeOf(CanvasGraphics)).call(this));

        var self = _this;
        _this.width = w;
        _this.height = h;
        _this.props = {};
        var images = {},
            draw = [],
            mask = void 0;

        function setProperties(context) {
            for (var key in self.props) {
                context[key] = self.props[key];
            }
        }

        _this.draw = function (override) {
            if (_this.isMask() && !override) return false;
            var context = _this.canvas.context;
            _this.startDraw(-_this.px, -_this.py, override);
            setProperties(context);
            if (_this.clipWidth && _this.clipHeight) {
                context.beginPath();
                context.rect(_this.clipX, _this.clipY, _this.clipWidth, _this.clipHeight);
                context.clip();
            }
            for (var i = 0; i < draw.length; i++) {
                var cmd = draw[i];
                if (!cmd) continue;
                var fn = cmd.shift();
                context[fn].apply(context, cmd);
                cmd.unshift(fn);
            }
            _this.endDraw();
            if (mask) {
                context.globalCompositeOperation = mask.blendMode;
                mask.render(true);
            }
        };

        _this.clear = function () {
            for (var i = 0; i < draw.length; i++) {
                draw[i].length = 0;
            }draw.length = 0;
        };

        _this.arc = function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var endAngle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _this.radius || _this.width / 2;
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

        _this.quadraticCurveTo = function (cpx, cpy, x, y) {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        _this.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        _this.fillRect = function (x, y, w, h) {
            draw.push(['fillRect', x, y, w, h]);
        };

        _this.clearRect = function (x, y, w, h) {
            draw.push(['clearRect', x, y, w, h]);
        };

        _this.strokeRect = function (x, y, w, h) {
            draw.push(['strokeRect', x, y, w, h]);
        };

        _this.moveTo = function (x, y) {
            draw.push(['moveTo', x, y]);
        };

        _this.lineTo = function (x, y) {
            draw.push(['lineTo', x, y]);
        };

        _this.stroke = function () {
            draw.push(['stroke']);
        };

        _this.fill = function () {
            if (!mask) draw.push(['fill']);
        };

        _this.beginPath = function () {
            draw.push(['beginPath']);
        };

        _this.closePath = function () {
            draw.push(['closePath']);
        };

        _this.fillText = function (text, x, y) {
            draw.push(['fillText', text, x, y]);
        };

        _this.strokeText = function (text, x, y) {
            draw.push(['strokeText', text, x, y]);
        };

        _this.setLineDash = function (value) {
            draw.push(['setLineDash', value]);
        };

        _this.createImage = function (src, force) {
            if (!images[src] || force) {
                var img = Images.createImg(src);
                if (force) return img;
                images[src] = img;
            }
            return images[src];
        };

        _this.drawImage = function (img) {
            var sx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var sy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var sWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : img.width;
            var sHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : img.height;
            var dx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var dy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
            var dWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : img.width;
            var dHeight = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : img.height;

            if (typeof img === 'string') img = _this.createImage(img);
            draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight]);
        };

        _this.mask = function (object) {
            if (!object) return mask = null;
            mask = object;
            object.masked = _this;
            for (var i = 0; i < draw.length; i++) {
                if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                    draw[i].length = 0;
                    draw.splice(i, 1);
                }
            }
        };

        _this.clone = function () {
            var object = new CanvasGraphics(_this.width, _this.height);
            object.visible = _this.visible;
            object.blendMode = _this.blendMode;
            object.opacity = _this.opacity;
            object.follow(_this);
            object.props = Utils.cloneObject(_this.props);
            object.setDraw(Utils.cloneArray(draw));
            return object;
        };

        _this.setDraw = function (array) {
            draw = array;
        };
        return _this;
    }

    createClass(CanvasGraphics, [{
        key: 'strokeStyle',
        set: function set$$1(val) {
            this.props.strokeStyle = val;
        },
        get: function get$$1() {
            return this.props.strokeStyle;
        }
    }, {
        key: 'fillStyle',
        set: function set$$1(val) {
            this.props.fillStyle = val;
        },
        get: function get$$1() {
            return this.props.fillStyle;
        }
    }, {
        key: 'lineWidth',
        set: function set$$1(val) {
            this.props.lineWidth = val;
        },
        get: function get$$1() {
            return this.props.lineWidth;
        }
    }, {
        key: 'lineCap',
        set: function set$$1(val) {
            this.props.lineCap = val;
        },
        get: function get$$1() {
            return this.props.lineCap;
        }
    }, {
        key: 'lineDashOffset',
        set: function set$$1(val) {
            this.props.lineDashOffset = val;
        },
        get: function get$$1() {
            return this.props.lineDashOffset;
        }
    }, {
        key: 'lineJoin',
        set: function set$$1(val) {
            this.props.lineJoin = val;
        },
        get: function get$$1() {
            return this.props.lineJoin;
        }
    }, {
        key: 'miterLimit',
        set: function set$$1(val) {
            this.props.miterLimit = val;
        },
        get: function get$$1() {
            return this.props.miterLimit;
        }
    }, {
        key: 'font',
        set: function set$$1(val) {
            this.props.font = val;
        },
        get: function get$$1() {
            return this.props.font;
        }
    }, {
        key: 'textAlign',
        set: function set$$1(val) {
            this.props.textAlign = val;
        },
        get: function get$$1() {
            return this.props.textAlign;
        }
    }, {
        key: 'textBaseline',
        set: function set$$1(val) {
            this.props.textBaseline = val;
        },
        get: function get$$1() {
            return this.props.textBaseline;
        }
    }]);
    return CanvasGraphics;
}(CanvasObject);

/**
 * Canvas with a single image.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var CanvasImage = function (_CanvasGraphics) {
    inherits(CanvasImage, _CanvasGraphics);

    function CanvasImage(parent, name, w) {
        var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : w;
        classCallCheck(this, CanvasImage);

        var _this = possibleConstructorReturn(this, (CanvasImage.__proto__ || Object.getPrototypeOf(CanvasImage)).call(this, w, h));

        var canvas = parent.initClass(Canvas, name, w, h);

        _this.img = function (src) {
            _this.drawImage(src, 0, 0, w, h);
            canvas.add(_this);
            return _this;
        };
        return _this;
    }

    return CanvasImage;
}(CanvasGraphics);

/**
 * Canvas font utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var CanvasFont = new // Singleton pattern

function CanvasFont() {
    classCallCheck(this, CanvasFont);


    function createText(canvas, width, height, str, font, fillStyle, letterSpacing, textAlign) {
        var context = canvas.context,
            graphics = canvas.initClass(CanvasGraphics, width, height);
        graphics.font = font;
        graphics.fillStyle = fillStyle;
        graphics.totalWidth = 0;
        graphics.totalHeight = height;
        var chr = void 0,
            characters = str.split(''),
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
            var text = canvas.initClass(CanvasGraphics, width, height),
                words = str.split(' '),
                line = '',
                lines = [];
            text.totalWidth = 0;
            text.totalHeight = 0;
            context.font = font;
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ',
                    characters = testLine.split(''),
                    testWidth = 0;
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
}(); // Singleton pattern

/**
 * Mouse helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Mouse = new // Singleton pattern

function Mouse() {
    var _this = this;

    classCallCheck(this, Mouse);

    this.x = 0;
    this.y = 0;

    var moved = function moved(e) {
        _this.x = e.x;
        _this.y = e.y;
    };

    this.capture = function () {
        _this.x = 0;
        _this.y = 0;
        if (!Device.mobile) {
            window.addEventListener('mousemove', moved);
        } else {
            window.addEventListener('touchmove', moved);
            window.addEventListener('touchstart', moved);
        }
    };

    this.stop = function () {
        _this.x = 0;
        _this.y = 0;
        if (!Device.mobile) {
            window.removeEventListener('mousemove', moved);
        } else {
            window.removeEventListener('touchmove', moved);
            window.removeEventListener('touchstart', moved);
        }
    };
}(); // Singleton pattern

/**
 * XMLHttpRequest helper class with promise support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var XHR = new // Singleton pattern

function XHR() {
    var _this = this;

    classCallCheck(this, XHR);

    this.headers = {};
    this.options = {};
    var serial = [];

    function serialize(key, data) {
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
            for (var i in data) {
                var newKey = key + '[' + i + ']';
                if (_typeof(data[i]) === 'object') serialize(newKey, data[i]);else serial.push(newKey + '=' + data[i]);
            }
        } else {
            serial.push(key + '=' + data);
        }
    }

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
        for (var _key in _this.headers) {
            xhr.setRequestHeader(_key, _this.headers[_key]);
        }for (var _key2 in _this.options) {
            xhr[_key2] = _this.options[_key2];
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
        for (var _key3 in _this.headers) {
            xhr.setRequestHeader(_key3, _this.headers[_key3]);
        }for (var _key4 in _this.options) {
            xhr[_key4] = _this.options[_key4];
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
}(); // Singleton pattern

/**
 * WebAudio helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

var WebAudio = new // Singleton pattern

function WebAudio() {
    var _this = this;

    classCallCheck(this, WebAudio);

    var context = void 0,
        sounds = [];

    this.init = function () {
        context = new window.AudioContext();
        _this.globalGain = context.createGain();
        _this.globalGain.connect(context.destination);
    };

    this.createSound = function (id, audioData, callback) {
        var sound = { id: id };
        context.decodeAudioData(audioData, function (buffer) {
            sound.buffer = buffer;
            sound.audioGain = context.createGain();
            sound.audioGain.connect(_this.globalGain);
            sound.complete = true;
            if (callback) callback();
        });
        sounds.push(sound);
    };

    this.getSound = function (id) {
        for (var i = 0; i < sounds.length; i++) {
            if (sounds[i].id === id) return sounds[i];
        }return null;
    };

    this.trigger = function (id) {
        if (!context) return;
        var sound = _this.getSound(id),
            source = context.createBufferSource();
        source.buffer = sound.buffer;
        source.connect(sound.audioGain);
        source.start(0);
    };

    this.mute = function () {
        if (!context) return;
        TweenManager.tween(_this.globalGain.gain, { value: 0 }, 300, 'easeOutSine');
    };

    this.unmute = function () {
        if (!context) return;
        TweenManager.tween(_this.globalGain.gain, { value: 1 }, 500, 'easeOutSine');
    };
}(); // Singleton pattern

/**
 * Asset loader with promise method.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var AssetLoader = function AssetLoader(assets, callback) {
    classCallCheck(this, AssetLoader);

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
                if (!window.AudioContext) return assetLoaded();
                XHR.get(asset, function (contents) {
                    WebAudio.createSound(key, contents, assetLoaded);
                }, 'arraybuffer');
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
};

AssetLoader.loadAssets = function (assets, callback) {
    var promise = Promise.create();
    if (!callback) callback = promise.resolve;
    new AssetLoader(assets, callback);
    return promise;
};

/**
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Stage = new ( // Singleton pattern

function (_Interface) {
    inherits(Stage, _Interface);

    function Stage() {
        classCallCheck(this, Stage);

        var _this = possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this, 'Stage'));

        var self = _this;
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
                }
            });
            window.addEventListener('blur', function () {
                if (last !== 'blur') {
                    last = 'blur';
                    window.events.fire(Events.BROWSER_FOCUS, { type: 'blur' });
                }
            });
            window.addEventListener('keydown', function () {
                return window.events.fire(Events.KEYBOARD_DOWN);
            });
            window.addEventListener('keyup', function () {
                return window.events.fire(Events.KEYBOARD_UP);
            });
            window.addEventListener('keypress', function () {
                return window.events.fire(Events.KEYBOARD_PRESS);
            });
            window.addEventListener('resize', function () {
                return window.events.fire(Events.RESIZE);
            });
            self.events.subscribe(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            self.size();
            if (Device.mobile) self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
        return _this;
    }

    return Stage;
}(Interface))(); // Singleton pattern

/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var FontLoader = function FontLoader(fonts, callback) {
    classCallCheck(this, FontLoader);

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
};

FontLoader.loadFonts = function (fonts, callback) {
    var promise = Promise.create();
    if (!callback) callback = promise.resolve;
    new FontLoader(fonts, callback);
    return promise;
};

/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

// Polyfills
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

// Globals
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

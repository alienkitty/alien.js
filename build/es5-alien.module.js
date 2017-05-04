(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Alien = global.Alien || {})));
}(this, (function (exports) { 'use strict';

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

if (window.Events === undefined) window.Events = {
    BROWSER_FOCUS: 'browser_focus',
    COMPLETE: 'complete',
    PROGRESS: 'progress',
    UPDATE: 'update',
    LOADED: 'loaded',
    ERROR: 'error',
    RESIZE: 'resize',
    HOVER: 'hover',
    CLICK: 'click'
};

var EventManager = function EventManager() {
    classCallCheck(this, EventManager);

    var events = [];

    this.add = function (event, callback) {
        events.push({ event: event, callback: callback });
    };

    this.remove = function (eventString, callback) {
        for (var i = events.length - 1; i > -1; i--) {
            if (events[i].event === eventString && events[i].callback === callback) events.splice(i, 1);
        }
    };

    this.fire = function (eventString) {
        var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        for (var i = 0; i < events.length; i++) {
            if (events[i].event === eventString) events[i].callback(object);
        }
    };
};

if (window.events === undefined) window.events = new EventManager();

/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

// Shim layer with setTimeout fallback
if (window.requestAnimationFrame === undefined) {
    window.requestAnimationFrame = function () {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            Delayed(callback, 1000 / 60);
        };
    }();
}

var Render = function Render() {
    var _this = this;

    classCallCheck(this, Render);

    this.TIME = Date.now();
    this.TARGET_FPS = 60;
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
        _this.FPS = fps;
        _this.TIME = t;
        _this.DELTA = diff;
        _this.TSL = timeSinceLoad;
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

    this.start = function (callback, fps) {
        if (_this.TARGET_FPS < 60) fps = _this.TARGET_FPS;
        if (typeof fps === 'number') callback.fps = fps;
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
};

/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Device = function () {
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
        this.system = {};
        this.system.retina = window.devicePixelRatio > 1;
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
    }]);
    return Device;
}();

/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interpolation = function Interpolation() {
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
            if (k < 1 / 2.75) {
                return 7.5625 * k * k;
            } else if (k < 2 / 2.75) {
                return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
            } else if (k < 2.5 / 2.75) {
                return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
            } else {
                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            }
        },
        InOut: function InOut(k) {
            if (k < 0.5) return _this.Bounce.In(k * 2) * 0.5;
            return _this.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    };
};

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

    this.update = function (time) {
        if (paused || time < startTime) return;
        elapsed = (time - startTime) / time;
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

    this.update = function (time) {
        if (paused || time < startTime) return;
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

var TweenManager = function () {
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

        var updateTweens = function updateTweens(time) {
            if (tweens.length) {
                for (var i = 0; i < tweens.length; i++) {
                    tweens[i].update(time);
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
}();

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
        TweenManager.clearCSSTween(object);
        object.cssTween = self;
        var transition = '';
        for (var i = 0; i < properties.length; i++) {
            transition += (transition.length ? ', ' : '') + properties[i] + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
        }Delayed(function () {
            object.element.style[Device.vendor('Transition')] = transition;
            object.css(props);
            object.transform(transform);
            Delayed(function () {
                clear();
                if (callback) callback();
            }, time + delay);
        }, 50);
    }

    function clear() {
        object.element.style[Device.vendor('Transition')] = '';
        object.cssTween = null;
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
    function Interface(name, node) {
        classCallCheck(this, Interface);

        this.events = new EventManager();
        var stage = window.Alien && window.Alien.Stage ? window.Alien.Stage : document.body,
            element = node || document.createElement('div');
        if (name[0] === '.') element.className = name.substr(1);else element.id = name;
        element.style.position = 'absolute';
        stage.appendChild(element);
        this.element = element;
        this.name = name;
    }

    createClass(Interface, [{
        key: 'initClass',
        value: function initClass(object, params) {
            var child = new object(params);
            if (child.element) this.element.appendChild(child.element);
            child.parent = this;
            return child;
        }
    }, {
        key: 'create',
        value: function create(name, node) {
            var child = new Interface(name, node);
            this.element.appendChild(child.element);
            child.parent = this;
            return child;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.loop) Render.stop(this.loop);
            this.element.parentNode.removeChild(this.element);
            return null;
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
            if (typeof _text !== 'undefined') {
                this.element.textContent = _text;
                return this;
            } else {
                return this.element.textContent;
            }
        }
    }, {
        key: 'html',
        value: function html(text) {
            if (typeof text !== 'undefined') {
                this.element.innerHTML = text;
                return this;
            } else {
                return this.element.innerHTML;
            }
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
        key: 'enablePointer',
        value: function enablePointer(bool) {
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
            if (src.indexOf('.') === -1) this.element.style.backgroundColor = src;else this.element.style.backgroundImage = 'url(' + src + ')';
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
            if (_attr && value) {
                if (value === '') this.element.removeAttribute(_attr);else this.element.setAttribute(_attr, value);
            } else if (_attr) {
                return this.element.getAttribute(_attr);
            }
            return this;
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

            this.element.addEventListener('click', function (e) {
                e.object = _this.element.className === 'hit' ? _this.parent : _this;
                e.action = 'click';
                if (!e.pageX) {
                    e.pageX = e.clientX;
                    e.pageY = e.clientY;
                }
                if (callback) callback(e);
            }, false);
            this.element.style.cursor = 'pointer';
            return this;
        }
    }, {
        key: 'hover',
        value: function hover(callback) {
            var _this2 = this;

            this.element.addEventListener('mouseover', function (e) {
                e.object = _this2.element.className === 'hit' ? _this2.parent : _this2;
                e.action = 'over';
                if (callback) callback(e);
            }, false);
            this.element.addEventListener('mouseout', function (e) {
                e.object = _this2.element.className === 'hit' ? _this2.parent : _this2;
                e.action = 'out';
                if (callback) callback(e);
            }, false);
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
            }).enablePointer(true).hover(overCallback).click(clickCallback);
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
                array.push(this.create('.t', document.createElement('span')).html(split[i]).css(style));
                if (by !== '' && i < split.length - 1) array.push(this.create('.t', document.createElement('span')).html(by).css(style));
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

    function Canvas(name, w, h) {
        classCallCheck(this, Canvas);

        var _this = possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, name, document.createElement('canvas')));

        _this.context = _this.element.getContext('2d');
        var ratio = Device.system.retina ? 2 : 1;
        _this.element.width = w * ratio;
        _this.element.height = h * ratio;
        _this.size(w, h);
        _this.context.scale(ratio, ratio);
        return _this;
    }

    createClass(Canvas, [{
        key: 'toDataURL',
        value: function toDataURL(type, quality) {
            return this.element.toDataURL(type, quality);
        }
    }, {
        key: 'getImageData',
        value: function getImageData() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.width;
            var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.height;

            this.imageData = this.context.getImageData(x, y, w, h);
            return this.imageData;
        }
    }, {
        key: 'getPixel',
        value: function getPixel(x, y, dirty) {
            if (!this.imageData || dirty) this.getImageData(0, 0, this.width, this.height);
            var imgData = {},
                index = (x + y * this.width) * 4,
                pixels = this.imageData.data;
            imgData.r = pixels[index];
            imgData.g = pixels[index + 1];
            imgData.b = pixels[index + 2];
            imgData.a = pixels[index + 3];
            return imgData;
        }
    }]);
    return Canvas;
}(Interface);

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
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Utils = function () {
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
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }, {
        key: 'timestamp',
        value: function timestamp() {
            return (Date.now() + this.doRandom(0, 99999)).toString();
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
            var oldRange = oldMax - oldMin;
            var newRange = newMax - newMin;
            var newValue = (oldValue - oldMin) * newRange / oldRange + newMin;
            return constrain ? this.constrain(newValue, newMin, newMax) : newValue;
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
        key: 'queryString',
        value: function queryString(key) {
            return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
        }
    }]);
    return Utils;
}();

/**
 * Mouse helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Mouse = function Mouse() {
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
        window.addEventListener('mousemove', moved, false);
    };

    this.stop = function () {
        _this.x = 0;
        _this.y = 0;
        window.removeEventListener('mousemove', moved, false);
    };
};

/**
 * Event based asset loader.
 *
 * Currently only images are supported.
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var AssetLoader = function AssetLoader(assets, callback) {
    classCallCheck(this, AssetLoader);

    var self = this;
    this.events = new EventManager();
    this.CDN = Config.CDN || '';
    var total = assets.length,
        loaded = 0,
        percent = 0;

    for (var i = 0; i < assets.length; i++) {
        loadAsset(this.CDN + assets[i]);
    }function loadAsset(asset) {
        var image = new Image();
        image.src = asset;
        image.onload = assetLoaded;
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

/**
 * XMLHttpRequest helper class with promise support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var XHR = function XHR() {
    var _this = this;

    classCallCheck(this, XHR);

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
            if (xhr.readyState === 4 && xhr.status === 200) {
                var _data = xhr.responseText;
                if (type === 'text') {
                    if (callback) callback(_data);
                } else {
                    try {
                        if (callback) callback(JSON.parse(_data));
                    } catch (e) {
                        throw e;
                    }
                }
            }
            if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                if (callback) {
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
            if (xhr.readyState === 4 && xhr.status === 200) {
                var _data2 = xhr.responseText;
                if (type === 'text') {
                    if (callback) callback(_data2);
                } else {
                    try {
                        if (callback) callback(JSON.parse(_data2));
                    } catch (e) {
                        throw e;
                    }
                }
            }
            if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                if (callback) {
                    if (promise) promise.reject(xhr);else callback(xhr);
                }
            }
        };
        return promise || xhr;
    };
};

/**
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Stage = function (_Interface) {
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
            }, false);
            window.addEventListener('blur', function () {
                if (last !== 'blur') {
                    last = 'blur';
                    window.events.fire(Events.BROWSER_FOCUS, { type: 'blur' });
                }
            }, false);
            window.addEventListener('resize', function () {
                window.events.fire(Events.RESIZE);
            }, false);
            window.events.add(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            self.size();
        }
        return _this;
    }

    return Stage;
}(Interface);

/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

// Polyfills
if (typeof Promise !== 'undefined' && typeof Promise.create === 'undefined') Promise.create = function () {
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
if (typeof window.getURL === 'undefined') window.getURL = function (url) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_blank';
    return window.open(url, target);
};

if (typeof window.Delayed === 'undefined') window.Delayed = function (callback) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var params = arguments[2];
    return window.setTimeout(function () {
        callback && callback(params);
    }, time);
};

if (typeof window.Global === 'undefined') window.Global = {};
if (typeof window.Config === 'undefined') window.Config = {};

// Illegal reassignment for instances
Function(function () {
    var instances = '';
    ['Render', 'Utils', 'Device', 'Mouse', 'TweenManager', 'Interpolation', 'XHR', 'Stage'].forEach(function (i) {
        instances += 'try {' + i + ' = new ' + i + '();} catch(e) {}';
    });
    return instances;
}())();

exports.EventManager = EventManager;
exports.Interface = Interface;
exports.Canvas = Canvas;
exports.Render = Render;
exports.DynamicObject = DynamicObject;
exports.Utils = Utils;
exports.Device = Device;
exports.Mouse = Mouse;
exports.TweenManager = TweenManager;
exports.Interpolation = Interpolation;
exports.MathTween = MathTween;
exports.SpringTween = SpringTween;
exports.AssetLoader = AssetLoader;
exports.XHR = XHR;
exports.Stage = Stage;

Object.defineProperty(exports, '__esModule', { value: true });

})));

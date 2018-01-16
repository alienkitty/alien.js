var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    if (isClamp) return Math.clamp(newValue, newMin, newMax);
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
    for (var i = 0; i < str.length; i++) {
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

if (!window.URL) window.URL = window.webkitURL;

if (!window.Config) window.Config = {};
if (!window.Global) window.Global = {};

/**
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Utils = new ( // Singleton pattern (IICE)

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
}())(); // Singleton pattern (IICE)

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

var Render = new // Singleton pattern (IICE)

function Render() {
    var _this = this;

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
        _this.paused = true;
    };

    this.resume = function () {
        if (!_this.paused) return;
        _this.paused = false;
        requestAnimationFrame(step);
    };
}(); // Singleton pattern (IICE)

/**
 * Timer helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Timer = new // Singleton pattern (IICE)

function Timer() {
    _classCallCheck(this, Timer);

    var callbacks = [],
        discard = [];

    Render.start(loop);

    function loop(t, delta) {
        for (var i = 0; i < discard.length; i++) {
            var obj = discard[i];
            obj.callback = null;
            callbacks.remove(obj);
        }
        if (discard.length) discard.length = 0;
        for (var _i = 0; _i < callbacks.length; _i++) {
            var _obj = callbacks[_i];
            if (!_obj) {
                callbacks.remove(_obj);
                continue;
            }
            if ((_obj.current += delta) >= _obj.time) {
                if (_obj.callback) _obj.callback.apply(_obj, _toConsumableArray(_obj.args));
                discard.push(_obj);
            }
        }
    }

    function find(ref) {
        for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i].ref === ref) return callbacks[i];
        }return null;
    }

    this.clearTimeout = function (ref) {
        var obj = find(ref);
        if (!obj) return false;
        obj.callback = null;
        callbacks.remove(obj);
        return true;
    };

    this.create = function (callback, time) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
        }

        var obj = {
            time: Math.max(1, time || 1),
            current: 0,
            ref: Utils.timestamp(),
            callback: callback,
            args: args
        };
        callbacks.push(obj);
        return obj.ref;
    };
}(); // Singleton pattern (IICE)

/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Events = function Events() {
    var _this2 = this;

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
            for (var i = events[event].length - 1; i >= 0; i--) {
                events[event][i] = null;
                events[event].splice(i, 1);
            }
        }
        return Utils.nullObject(_this2);
    };

    this.fire = function (event) {
        var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!events[event]) return;
        var clone = Utils.cloneArray(events[event]);
        clone.forEach(function (callback) {
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
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Device = new ( // Singleton pattern (IICE)

function () {
    function Device() {
        var _this3 = this;

        _classCallCheck(this, Device);

        this.agent = navigator.userAgent.toLowerCase();
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
        this.pixelRatio = window.devicePixelRatio;
        this.os = function () {
            if (_this3.detect(['iphone', 'ipad'])) return 'ios';
            if (_this3.detect(['android'])) return 'android';
            if (_this3.detect(['blackberry'])) return 'blackberry';
            if (_this3.detect(['mac os'])) return 'mac';
            if (_this3.detect(['windows'])) return 'windows';
            if (_this3.detect(['linux'])) return 'linux';
            return 'unknown';
        }();
        this.browser = function () {
            if (_this3.os === 'ios') {
                if (_this3.detect(['safari'])) return 'safari';
                return 'unknown';
            }
            if (_this3.os === 'android') {
                if (_this3.detect(['chrome'])) return 'chrome';
                if (_this3.detect(['firefox'])) return 'firefox';
                return 'browser';
            }
            if (_this3.detect(['msie'])) return 'ie';
            if (_this3.detect(['trident']) && _this3.detect(['rv:'])) return 'ie';
            if (_this3.detect(['windows']) && _this3.detect(['edge'])) return 'ie';
            if (_this3.detect(['chrome'])) return 'chrome';
            if (_this3.detect(['safari'])) return 'safari';
            if (_this3.detect(['firefox'])) return 'firefox';
            return 'unknown';
        }();
        this.mobile = 'ontouchstart' in window && this.detect(['iphone', 'ipad', 'android', 'blackberry']);
        this.tablet = Math.max(screen.width, screen.height) > 800;
        this.phone = !this.tablet;
        this.webgl = function () {
            try {
                var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'],
                    canvas = document.createElement('canvas');
                var gl = void 0;
                for (var i = 0; i < names.length; i++) {
                    gl = canvas.getContext(names[i]);
                    if (gl) break;
                }
                var info = gl.getExtension('WEBGL_debug_renderer_info'),
                    output = {};
                if (info) {
                    var gpu = info.UNMASKED_RENDERER_WEBGL;
                    output.gpu = gl.getParameter(gpu).toLowerCase();
                }
                output.renderer = gl.getParameter(gl.RENDERER).toLowerCase();
                output.version = gl.getParameter(gl.VERSION).toLowerCase();
                output.glsl = gl.getParameter(gl.SHADING_LANGUAGE_VERSION).toLowerCase();
                output.extensions = gl.getSupportedExtensions();
                output.detect = function (matches) {
                    if (output.gpu && output.gpu.includes(matches)) return true;
                    if (output.version && output.version.includes(matches)) return true;
                    for (var _i2 = 0; _i2 < output.extensions.length; _i2++) {
                        if (output.extensions[_i2].toLowerCase().includes(matches)) return true;
                    }return false;
                };
                return output;
            } catch (e) {
                return false;
            }
        }();
    }

    _createClass(Device, [{
        key: 'detect',
        value: function detect(matches) {
            return this.agent.includes(matches);
        }
    }, {
        key: 'vendor',
        value: function vendor(style) {
            return this.prefix.js + style;
        }
    }, {
        key: 'vibrate',
        value: function vibrate(time) {
            if (navigator.vibrate) navigator.vibrate(time);
        }
    }]);

    return Device;
}())(); // Singleton pattern (IICE)

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
            for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                params[_key3 - 1] = arguments[_key3];
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
            for (var _len4 = arguments.length, params = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                params[_key4 - 2] = arguments[_key4];
            }

            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var timer = Timer.create(function () {
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
                Timer.clearTimeout(this.timers[i]);
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
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interpolation = new // Singleton pattern (IICE)

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
}(); // Singleton pattern (IICE)

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

var TweenManager = new ( // Singleton pattern (IICE)

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
                for (var i = _tweens.length - 1; i >= 0; i--) {
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
            for (var i = 0; i < this.TRANSFORMS.length; i++) {
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
}())(); // Singleton pattern (IICE)

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
        Timer.create(function () {
            if (killed()) return;
            object.element.style[Device.vendor('Transition')] = strings.transition;
            object.css(props);
            object.transform(transformProps);
            Timer.create(function () {
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
                if (!detached) document.body.appendChild(this.element);
            } else {
                this.element = name;
            }
            this.element.object = this;
        }
    }

    _createClass(Interface, [{
        key: 'initClass',
        value: function initClass(object) {
            for (var _len5 = arguments.length, params = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                params[_key5 - 1] = arguments[_key5];
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
            for (var _len6 = arguments.length, params = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                params[_key6 - 2] = arguments[_key6];
            }

            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var timer = Timer.create(function () {
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
                Timer.clearTimeout(this.timers[i]);
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
        value: function size(w) {
            var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;

            if (typeof w !== 'undefined') {
                if (typeof w === 'string' || typeof h === 'string') {
                    if (typeof w !== 'string') w = w + 'px';
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
                    return style || 0;
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
            var touch = {};
            touch.x = 0;
            touch.y = 0;
            if (!e) return touch;
            if (e.touches || e.changedTouches) {
                if (e.touches.length) {
                    touch.x = e.touches[0].pageX;
                    touch.y = e.touches[0].pageY;
                } else {
                    touch.x = e.changedTouches[0].pageX;
                    touch.y = e.changedTouches[0].pageY;
                }
            } else {
                touch.x = e.pageX;
                touch.y = e.pageY;
            }
            return touch;
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
                if (!(e instanceof MouseEvent)) {
                    e.x = touch.x;
                    e.y = touch.y;
                }
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
            if (by === ' ') by = '&nbsp;';
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

var Stage = new ( // Singleton pattern (IICE)

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
            window.addEventListener('focus', focus, true);
            window.addEventListener('blur', blur, true);
            window.addEventListener('keydown', function (e) {
                return self.events.fire(Events.KEYBOARD_DOWN, e);
            }, true);
            window.addEventListener('keyup', function (e) {
                return self.events.fire(Events.KEYBOARD_UP, e);
            }, true);
            window.addEventListener('keypress', function (e) {
                return self.events.fire(Events.KEYBOARD_PRESS, e);
            }, true);
            window.addEventListener('resize', function () {
                return self.events.fire(Events.RESIZE);
            }, true);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function focus() {
            if (last !== 'focus') {
                last = 'focus';
                self.events.fire(Events.VISIBILITY, { type: 'focus' });
            }
        }

        function blur() {
            if (last !== 'blur') {
                last = 'blur';
                self.events.fire(Events.VISIBILITY, { type: 'blur' });
            }
        }

        function resize() {
            self.size();
            self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
        return _this11;
    }

    return Stage;
}(Interface))(); // Singleton pattern (IICE)

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
    var _this12 = this;

    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Stage;

    _classCallCheck(this, Interaction);

    if (!Interaction.initialized) {
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

        Interaction.initialized = true;
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
        e.preventDefault();
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
        _this12.events.destroy();
        return Utils.nullObject(_this12);
    };
};

/**
 * Accelerometer helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Accelerometer = new // Singleton pattern (IICE)

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
    this.toRadians = Device.os === 'ios' ? Math.PI / 180 : 1;

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
}(); // Singleton pattern (IICE)

/**
 * Mouse interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Mouse = new // Singleton pattern (IICE)

function Mouse() {
    var _this13 = this;

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
        _this13.input = new Interaction();
        _this13.input.events.add(Interaction.START, update);
        _this13.input.events.add(Interaction.MOVE, update);
        update({
            x: Stage.width / 2,
            y: Stage.height / 2
        });
    };
}(); // Singleton pattern (IICE)

/**
 * Image helper class with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Assets = new ( // Singleton pattern (IICE)

function () {
    function Assets() {
        var _this14 = this;

        _classCallCheck(this, Assets);

        this.CDN = '';
        this.CORS = null;
        var images = {};

        this.createImage = function (src, store, callback) {
            if (typeof store !== 'boolean') {
                callback = store;
                store = undefined;
            }
            var img = new Image();
            img.crossOrigin = _this14.CORS;
            img.src = src;
            img.onload = callback;
            img.onerror = callback;
            if (store) images[src] = img;
            return img;
        };

        this.getImage = function (src) {
            return images[src];
        };
    }

    _createClass(Assets, [{
        key: 'loadImage',
        value: function loadImage(img) {
            if (typeof img === 'string') img = this.createImage(img);
            var promise = Promise.create();
            img.onload = promise.resolve;
            img.onerror = promise.resolve;
            return promise;
        }
    }]);

    return Assets;
}())(); // Singleton pattern (IICE)

/**
 * Asset loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var AssetLoader = function (_Component) {
    _inherits(AssetLoader, _Component);

    function AssetLoader(assets, callback) {
        _classCallCheck(this, AssetLoader);

        var _this15 = _possibleConstructorReturn(this, (AssetLoader.__proto__ || Object.getPrototypeOf(AssetLoader)).call(this));

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
        var self = _this15;
        _this15.events = new Events();
        var total = Object.keys(assets).length;
        var loaded = 0;

        for (var key in assets) {
            loadAsset(key, Assets.CDN + assets[key]);
        }function loadAsset(key, asset) {
            var ext = Utils.extension(asset);
            if (ext.includes(['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                Assets.createImage(asset, assetLoaded);
                return;
            }
            if (ext.includes(['mp3', 'm4a', 'ogg', 'wav', 'aif'])) {
                if (!window.AudioContext || !window.WebAudio) return assetLoaded();
                window.WebAudio.createSound(key, asset, assetLoaded);
                return;
            }
            window.get(asset).then(function (data) {
                if (ext === 'js') window.eval(data.replace('use strict', ''));
                assetLoaded();
            }).catch(function () {
                assetLoaded();
            });
        }

        function assetLoaded() {
            self.percent = ++loaded / total;
            self.events.fire(Events.PROGRESS, { percent: self.percent });
            if (loaded === total) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE);
            if (callback) callback();
        }
        return _this15;
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
}(Component);

/**
 * Loader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var MultiLoader = function (_Component2) {
    _inherits(MultiLoader, _Component2);

    function MultiLoader() {
        _classCallCheck(this, MultiLoader);

        var _this16 = _possibleConstructorReturn(this, (MultiLoader.__proto__ || Object.getPrototypeOf(MultiLoader)).call(this));

        var self = _this16;
        _this16.events = new Events();
        var loaders = [];
        var loaded = 0;

        function progress() {
            var percent = 0;
            for (var i = 0; i < loaders.length; i++) {
                percent += loaders[i].percent || 0;
            }percent /= loaders.length;
            self.events.fire(Events.PROGRESS, { percent: percent });
        }

        function complete() {
            if (++loaded === loaders.length) self.events.fire(Events.COMPLETE);
        }

        _this16.push = function (loader) {
            loaders.push(loader);
            loader.events.add(Events.PROGRESS, progress);
            loader.events.add(Events.COMPLETE, complete);
        };

        _this16.complete = function () {
            _this16.events.fire(Events.PROGRESS, { percent: 1 });
            _this16.events.fire(Events.COMPLETE);
        };
        return _this16;
    }

    return MultiLoader;
}(Component);

/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var FontLoader = function (_Component3) {
    _inherits(FontLoader, _Component3);

    function FontLoader(fonts, callback) {
        _classCallCheck(this, FontLoader);

        var _this17 = _possibleConstructorReturn(this, (FontLoader.__proto__ || Object.getPrototypeOf(FontLoader)).call(this));

        var self = _this17;
        _this17.events = new Events();
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
            var ready = function ready() {
                element.destroy();
                self.percent = 1;
                self.events.fire(Events.PROGRESS, { percent: self.percent });
                self.events.fire(Events.COMPLETE);
                if (callback) callback();
            };
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);else self.delayedCall(ready, 500);
        }
        return _this17;
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
}(Component);

/**
 * State dispatcher.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var StateDispatcher = function StateDispatcher(forceHash) {
    var _this18 = this;

    _classCallCheck(this, StateDispatcher);

    var self = this;
    this.events = new Events();
    this.locked = false;
    var storePath = void 0,
        storeState = void 0,
        rootPath = '/';

    createListener();
    storePath = getPath();

    function createListener() {
        if (forceHash) window.addEventListener('hashchange', function () {
            return handleStateChange(null, getPath());
        }, true);else window.addEventListener('popstate', function (e) {
            return handleStateChange(e.state, getPath());
        }, true);
    }

    function getPath() {
        if (forceHash) return location.hash.slice(3);
        return rootPath !== '/' ? location.pathname.split(rootPath)[1] : location.pathname.slice(1) || '';
    }

    function handleStateChange(state, path) {
        if (path !== storePath) {
            if (!self.locked) {
                storePath = path;
                storeState = state;
                self.events.fire(Events.UPDATE, { value: state, path: path, split: path.split('/') });
            } else if (storePath) {
                if (forceHash) location.hash = '!/' + storePath;else history.pushState(storeState, null, rootPath + storePath);
            }
        }
    }

    this.getState = function () {
        var path = getPath();
        return { value: storeState, path: path, split: path.split('/') };
    };

    this.setState = function (state, path) {
        if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') {
            path = state;
            state = null;
        }
        if (path !== storePath) {
            storePath = path;
            storeState = state;
            if (forceHash) location.hash = '!/' + path;else history.pushState(state, null, rootPath + path);
        }
    };

    this.replaceState = function (state, path) {
        if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') {
            path = state;
            state = null;
        }
        if (path !== storePath) {
            storePath = path;
            storeState = state;
            if (forceHash) history.replaceState(null, null, '#!/' + path);else history.replaceState(state, null, rootPath + path);
        }
    };

    this.setTitle = function (title) {
        return document.title = title;
    };

    this.lock = function () {
        return _this18.locked = true;
    };

    this.unlock = function () {
        return _this18.locked = false;
    };

    this.forceHash = function () {
        return forceHash = true;
    };

    this.setPathRoot = function (path) {
        if (path.charAt(0) === '/') rootPath = path;else rootPath = '/' + path;
    };
};

/**
 * Storage helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Storage = new ( // Singleton pattern (IICE)

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
}())(); // Singleton pattern (IICE)

/**
 * Web audio engine.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

var WebAudio = new // Singleton pattern (IICE)

function WebAudio() {
    var _this19 = this;

    _classCallCheck(this, WebAudio);

    var self = this;
    var sounds = {};
    var context = void 0;

    this.init = function () {
        if (window.AudioContext) context = new AudioContext();
        if (!context) return;
        _this19.globalGain = context.createGain();
        _this19.globalGain.connect(context.destination);
        _this19.globalGain.value = _this19.globalGain.gain.defaultValue;
        _this19.gain = {
            set value(value) {
                self.globalGain.value = value;
                self.globalGain.gain.setTargetAtTime(value, context.currentTime, 0.01);
            },
            get value() {
                return self.globalGain.value;
            }
        };
    };

    this.loadSound = function (id, callback) {
        var promise = Promise.create();
        if (callback) promise.then(callback);
        callback = promise.resolve;
        var sound = _this19.getSound(id);
        window.fetch(sound.asset).then(function (response) {
            if (!response.ok) return callback();
            response.arrayBuffer().then(function (data) {
                context.decodeAudioData(data, function (buffer) {
                    sound.buffer = buffer;
                    sound.complete = true;
                    callback();
                });
            });
        }).catch(function () {
            callback();
        });
        sound.ready = function () {
            return promise;
        };
    };

    this.createSound = function (id, asset, callback) {
        var sound = {};
        sound.asset = asset;
        sound.audioGain = context.createGain();
        sound.audioGain.connect(_this19.globalGain);
        sound.audioGain.value = sound.audioGain.gain.defaultValue;
        sound.gain = {
            set value(value) {
                sound.audioGain.value = value;
                sound.audioGain.gain.setTargetAtTime(value, context.currentTime, 0.01);
            },
            get value() {
                return sound.audioGain.value;
            }
        };
        sounds[id] = sound;
        if (Device.os === 'ios') callback();else _this19.loadSound(id, callback);
    };

    this.getSound = function (id) {
        return sounds[id];
    };

    this.trigger = function (id) {
        if (!context) return;
        if (context.state === 'suspended') context.resume();
        var sound = _this19.getSound(id);
        if (!sound.ready) _this19.loadSound(id);
        sound.ready().then(function () {
            if (sound.complete) {
                var source = context.createBufferSource();
                source.buffer = sound.buffer;
                source.connect(sound.audioGain);
                sound.audioGain.gain.setValueAtTime(sound.audioGain.value, context.currentTime);
                source.loop = !!sound.loop;
                source.start(0);
            }
        });
    };

    this.mute = function () {
        if (!context) return;
        TweenManager.tween(_this19.gain, { value: 0 }, 300, 'easeOutSine');
    };

    this.unmute = function () {
        if (!context) return;
        TweenManager.tween(_this19.gain, { value: 1 }, 500, 'easeOutSine');
    };

    window.WebAudio = this;
}(); // Singleton pattern (IICE)

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
            child.setCanvas(this.canvas);
            child.parent = this;
            this.children.push(child);
            child.z = this.children.length;
        }
    }, {
        key: 'setCanvas',
        value: function setCanvas(canvas) {
            this.canvas = canvas;
            for (var i = 0; i < this.children.length; i++) {
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
            for (var i = this.children.length - 1; i >= 0; i--) {
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

        var _this20 = _possibleConstructorReturn(this, (CanvasGraphics.__proto__ || Object.getPrototypeOf(CanvasGraphics)).call(this));

        var self = _this20;
        _this20.width = w;
        _this20.height = h;
        _this20.props = {};
        var draw = [],
            mask = void 0;

        function setProperties(context) {
            for (var key in self.props) {
                context[key] = self.props[key];
            }
        }

        _this20.draw = function (override) {
            if (_this20.isMask() && !override) return false;
            var context = _this20.canvas.context;
            _this20.startDraw(_this20.px, _this20.py, override);
            setProperties(context);
            if (_this20.clipWidth && _this20.clipHeight) {
                context.beginPath();
                context.rect(_this20.clipX, _this20.clipY, _this20.clipWidth, _this20.clipHeight);
                context.clip();
            }
            for (var i = 0; i < draw.length; i++) {
                var cmd = draw[i];
                if (!cmd) continue;
                var fn = cmd.shift();
                context[fn].apply(context, cmd);
                cmd.unshift(fn);
            }
            _this20.endDraw();
            if (mask) {
                context.globalCompositeOperation = mask.blendMode;
                mask.render(true);
            }
        };

        _this20.clear = function () {
            for (var i = draw.length - 1; i >= 0; i--) {
                draw[i].length = 0;
            }draw.length = 0;
        };

        _this20.arc = function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var endAngle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _this20.radius || _this20.width / 2;
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

        _this20.quadraticCurveTo = function (cpx, cpy, x, y) {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        _this20.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        _this20.fillRect = function (x, y, w, h) {
            draw.push(['fillRect', x, y, w, h]);
        };

        _this20.clearRect = function (x, y, w, h) {
            draw.push(['clearRect', x, y, w, h]);
        };

        _this20.strokeRect = function (x, y, w, h) {
            draw.push(['strokeRect', x, y, w, h]);
        };

        _this20.moveTo = function (x, y) {
            draw.push(['moveTo', x, y]);
        };

        _this20.lineTo = function (x, y) {
            draw.push(['lineTo', x, y]);
        };

        _this20.stroke = function () {
            draw.push(['stroke']);
        };

        _this20.fill = function () {
            if (!mask) draw.push(['fill']);
        };

        _this20.beginPath = function () {
            draw.push(['beginPath']);
        };

        _this20.closePath = function () {
            draw.push(['closePath']);
        };

        _this20.fillText = function (text, x, y) {
            draw.push(['fillText', text, x, y]);
        };

        _this20.strokeText = function (text, x, y) {
            draw.push(['strokeText', text, x, y]);
        };

        _this20.setLineDash = function (value) {
            draw.push(['setLineDash', value]);
        };

        _this20.drawImage = function (img) {
            var sx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var sy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var sWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : img.width;
            var sHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : img.height;
            var dx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var dy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
            var dWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : img.width;
            var dHeight = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : img.height;

            draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx + -_this20.px, dy + -_this20.py, dWidth, dHeight]);
        };

        _this20.mask = function (object) {
            if (!object) return mask = null;
            mask = object;
            object.masked = _this20;
            for (var i = 0; i < draw.length; i++) {
                if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                    draw[i].length = 0;
                    draw.splice(i, 1);
                }
            }
        };

        _this20.clone = function () {
            var object = new CanvasGraphics(_this20.width, _this20.height);
            object.visible = _this20.visible;
            object.blendMode = _this20.blendMode;
            object.opacity = _this20.opacity;
            object.follow(_this20);
            object.props = Utils.cloneObject(_this20.props);
            object.setDraw(Utils.cloneArray(draw));
            return object;
        };

        _this20.setDraw = function (array) {
            draw = array;
        };
        return _this20;
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
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Canvas = function Canvas(w) {
    var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;

    var _this21 = this;

    var retina = arguments[2];
    var whiteAlpha = arguments[3];

    _classCallCheck(this, Canvas);

    var self = this;
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');
    this.object = new Interface(this.element);
    this.children = [];
    this.retina = retina;

    size(w, h, retina);

    function size(w, h, retina) {
        var ratio = retina ? 2 : 1;
        self.element.width = w * ratio;
        self.element.height = h * ratio;
        self.width = w;
        self.height = h;
        self.scale = ratio;
        self.object.size(self.width, self.height);
        self.context.scale(ratio, ratio);
        self.element.style.width = w + 'px';
        self.element.style.height = h + 'px';
        if (whiteAlpha) {
            var alpha = new CanvasGraphics(self.width, self.height);
            alpha.fillStyle = 'rgba(255, 255, 255, 0.002)';
            alpha.fillRect(0, 0, self.width, self.height);
            alpha.setCanvas(self);
            alpha.parent = self;
            self.children[0] = alpha;
            alpha.z = 1;
        }
    }

    this.size = size;

    this.toDataURL = function (type, quality) {
        return _this21.element.toDataURL(type, quality);
    };

    this.render = function (noClear) {
        if (!(typeof noClear === 'boolean' && noClear)) _this21.clear();
        for (var i = 0; i < _this21.children.length; i++) {
            _this21.children[i].render();
        }
    };

    this.clear = function () {
        _this21.context.clearRect(0, 0, _this21.element.width, _this21.element.height);
    };

    this.add = function (child) {
        child.setCanvas(_this21);
        child.parent = _this21;
        _this21.children.push(child);
        child.z = _this21.children.length;
    };

    this.remove = function (child) {
        child.canvas = null;
        child.parent = null;
        _this21.children.remove(child);
    };

    this.destroy = function () {
        for (var i = _this21.children.length - 1; i >= 0; i--) {
            _this21.children[i].destroy();
        }_this21.object.destroy();
        return Utils.nullObject(_this21);
    };

    this.getImageData = function () {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this21.element.width;
        var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _this21.element.height;

        _this21.imageData = _this21.context.getImageData(x, y, w, h);
        return _this21.imageData;
    };

    this.getPixel = function (x, y, dirty) {
        if (!_this21.imageData || dirty) _this21.getImageData();
        var imgData = {},
            index = (x + y * _this21.element.width) * 4,
            pixels = _this21.imageData.data;
        imgData.r = pixels[index];
        imgData.g = pixels[index + 1];
        imgData.b = pixels[index + 2];
        imgData.a = pixels[index + 3];
        return imgData;
    };

    this.putImageData = function (imageData) {
        _this21.context.putImageData(imageData, 0, 0);
    };
};

/**
 * Canvas font utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var CanvasFont = new // Singleton pattern (IICE)

function CanvasFont() {
    _classCallCheck(this, CanvasFont);

    function createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign) {
        var context = canvas.context,
            graphics = new CanvasGraphics(width, height);
        graphics.font = font;
        graphics.fillStyle = fillStyle;
        graphics.textBaseline = textBaseline;
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
        var _ref$textBaseline = _ref.textBaseline,
            textBaseline = _ref$textBaseline === undefined ? 'alphabetic' : _ref$textBaseline,
            _ref$lineHeight = _ref.lineHeight,
            lineHeight = _ref$lineHeight === undefined ? height : _ref$lineHeight,
            _ref$letterSpacing = _ref.letterSpacing,
            letterSpacing = _ref$letterSpacing === undefined ? 0 : _ref$letterSpacing,
            _ref$textAlign = _ref.textAlign,
            textAlign = _ref$textAlign === undefined ? 'start' : _ref$textAlign;

        var context = canvas.context;
        if (height === lineHeight) {
            return createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign);
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
            lines.forEach(function (line, i) {
                var graphics = createText(canvas, width, lineHeight, line.slice(0, -1), font, fillStyle, textBaseline, letterSpacing, textAlign);
                graphics.y = i * lineHeight;
                text.add(graphics);
                text.totalWidth = Math.max(graphics.totalWidth, text.totalWidth);
                text.totalHeight += lineHeight;
            });
            return text;
        }
    };
}(); // Singleton pattern (IICE)

/**
 * Video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Video = function (_Component4) {
    _inherits(Video, _Component4);

    function Video(params) {
        _classCallCheck(this, Video);

        var _this22 = _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this));

        var self = _this22;
        _this22.loaded = {
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
            if (src) src = Assets.CDN + src;
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

        _this22.play = function () {
            _this22.playing = true;
            _this22.element.play();
            _this22.startRender(step);
        };

        _this22.pause = function () {
            _this22.playing = false;
            _this22.element.pause();
            _this22.stopRender(step);
        };

        _this22.stop = function () {
            _this22.playing = false;
            _this22.element.pause();
            _this22.stopRender(step);
            if (_this22.ready()) _this22.element.currentTime = 0;
        };

        _this22.volume = function (v) {
            _this22.element.volume = v;
            if (_this22.muted) {
                _this22.muted = false;
                _this22.object.attr('muted', '');
            }
        };

        _this22.mute = function () {
            _this22.volume(0);
            _this22.muted = true;
            _this22.object.attr('muted', true);
        };

        _this22.seek = function (t) {
            if (_this22.element.readyState <= 1) {
                _this22.delayedCall(function () {
                    if (_this22.seek) _this22.seek(t);
                }, 32);
                return;
            }
            _this22.element.currentTime = t;
        };

        _this22.canPlayTo = function (t) {
            seekTo = null;
            if (t) seekTo = t;
            if (!_this22.buffered) _this22.startRender(checkReady);
            return _this22.buffered;
        };

        _this22.ready = function () {
            return _this22.element.readyState > _this22.element.HAVE_CURRENT_DATA;
        };

        _this22.size = function (w, h) {
            _this22.element.width = _this22.width = w;
            _this22.element.height = _this22.height = h;
            _this22.object.size(_this22.width, _this22.height);
        };

        _this22.forceRender = function () {
            forceRender = true;
            _this22.startRender(step);
        };

        _this22.trackProgress = function () {
            _this22.element.addEventListener('progress', handleProgress, true);
        };

        _this22.destroy = function () {
            _this22.stop();
            _this22.element.src = '';
            _this22.object.destroy();
            return _get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), 'destroy', _this22).call(_this22);
        };
        return _this22;
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
            this.element.src = Assets.CDN + src;
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
    var _this23 = this;

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
        _this23.object.destroy();
        return Utils.nullObject(_this23);
    };
};

/**
 * Scroll interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Scroll = function (_Component5) {
    _inherits(Scroll, _Component5);

    function Scroll(object, params) {
        _classCallCheck(this, Scroll);

        var _this24 = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this));

        if (!object || !object.element) {
            params = object;
            object = null;
        }
        if (!params) params = {};
        var self = _this24;
        _this24.x = 0;
        _this24.y = 0;
        _this24.max = {
            x: 0,
            y: 0
        };
        _this24.delta = {
            x: 0,
            y: 0
        };
        _this24.enabled = true;
        var scrollTarget = {
            x: 0,
            y: 0
        };
        var axes = ['x', 'y'];

        initParameters();
        addListeners();
        _this24.startRender(loop);

        function initParameters() {
            self.object = object;
            self.hitObject = params.hitObject || self.object;
            self.max.y = params.height || 0;
            self.max.x = params.width || 0;
            if (Array.isArray(params.axes)) axes = params.axes;
            if (self.object) self.object.css({ overflow: 'auto' });
        }

        function addListeners() {
            Stage.bind('wheel', scroll);
            if (self.hitObject) self.hitObject.bind('touchstart', function (e) {
                return e.preventDefault();
            });
            var input = self.hitObject ? new Interaction(self.hitObject) : Mouse.input;
            input.events.add(Interaction.START, down);
            input.events.add(Interaction.DRAG, drag);
            input.events.add(Interaction.END, up);
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function stopInertia() {
            TweenManager.clearTween(scrollTarget);
        }

        function scroll(e) {
            if (!self.enabled) return;
            e.preventDefault();
            stopInertia();
            axes.forEach(function (axis) {
                if (!self.max[axis]) return;
                scrollTarget[axis] += e['delta' + axis.toUpperCase()];
            });
        }

        function down() {
            if (!self.enabled) return;
            stopInertia();
        }

        function drag() {
            if (!self.enabled) return;
            axes.forEach(function (axis) {
                if (!self.max[axis]) return;
                scrollTarget[axis] -= Mouse.input.delta[axis];
            });
        }

        function up() {
            if (!self.enabled) return;
            var m = function () {
                if (Device.os === 'android') return 35;
                return 25;
            }(),
                obj = {};
            axes.forEach(function (axis) {
                if (!self.max[axis]) return;
                obj[axis] = scrollTarget[axis] - Mouse.input.delta[axis] * m;
            });
            TweenManager.tween(scrollTarget, obj, 2500, 'easeOutQuint');
        }

        function resize() {
            if (!self.enabled) return;
            stopInertia();
            if (!self.object) return;
            var p = {};
            if (Device.mobile) axes.forEach(function (axis) {
                return p[axis] = self.max[axis] ? scrollTarget[axis] / self.max[axis] : 0;
            });
            if (typeof params.height === 'undefined') self.max.y = self.object.element.scrollHeight - self.object.element.clientHeight;
            if (typeof params.width === 'undefined') self.max.x = self.object.element.scrollWidth - self.object.element.clientWidth;
            if (Device.mobile) axes.forEach(function (axis) {
                return self[axis] = scrollTarget[axis] = p[axis] * self.max[axis];
            });
        }

        function loop() {
            axes.forEach(function (axis) {
                if (!self.max[axis]) return;
                scrollTarget[axis] = Math.clamp(scrollTarget[axis], 0, self.max[axis]);
                self.delta[axis] = scrollTarget[axis] - self[axis];
                self[axis] += self.delta[axis];
                if (self.object) {
                    if (axis === 'x') self.object.element.scrollLeft = self.x;
                    if (axis === 'y') self.object.element.scrollTop = self.y;
                }
            });
        }

        _this24.destroy = function () {
            Stage.unbind('wheel', scroll);
            return _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'destroy', _this24).call(_this24);
        };
        return _this24;
    }

    return Scroll;
}(Component);

/**
 * Slide interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Slide = function (_Component6) {
    _inherits(Slide, _Component6);

    function Slide() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Slide);

        var _this25 = _possibleConstructorReturn(this, (Slide.__proto__ || Object.getPrototypeOf(Slide)).call(this));

        var self = _this25;
        _this25.x = 0;
        _this25.y = 0;
        _this25.max = {
            x: 0,
            y: 0
        };
        _this25.delta = {
            x: 0,
            y: 0
        };
        _this25.direction = {
            x: 0,
            y: 0
        };
        _this25.position = 0;
        _this25.progress = 0;
        _this25.floor = 0;
        _this25.ceil = 0;
        _this25.index = 0;
        _this25.enabled = true;
        var scrollTarget = {
            x: 0,
            y: 0
        },
            scrollInertia = {
            x: 0,
            y: 0
        },
            ease = Interpolation.convertEase('easeOutSine'),
            event = {};
        var axes = ['x', 'y'],
            slideIndex = void 0;

        initParameters();
        addListeners();
        _this25.startRender(loop);

        function initParameters() {
            self.num = params.num || 0;
            if (params.max) self.max = params.max;
            if (params.index) {
                self.index = params.index;
                self.x = scrollTarget.x = self.index * self.max.x;
                self.y = scrollTarget.y = self.index * self.max.y;
            }
            if (params.axes) axes = params.axes;
        }

        function addListeners() {
            Stage.bind('wheel', scroll);
            Mouse.input.events.add(Interaction.START, down);
            Mouse.input.events.add(Interaction.DRAG, drag);
            Stage.events.add(Events.KEYBOARD_DOWN, keyPress);
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function stopInertia() {
            self.isInertia = false;
            TweenManager.clearTween(scrollTarget);
        }

        function scroll(e) {
            if (!self.enabled) return;
            if (e.preventDefault) e.preventDefault();
            stopInertia();
            axes.forEach(function (axis) {
                if (!self.max[axis]) return;
                scrollTarget[axis] += e['delta' + axis.toUpperCase()];
            });
        }

        function down() {
            if (!self.enabled) return;
            stopInertia();
        }

        function drag() {
            if (!self.enabled) return;
            axes.forEach(function (axis) {
                if (!self.max[axis]) return;
                scrollTarget[axis] += -Mouse.input.delta[axis] * 4;
                scrollInertia[axis] = -Mouse.input.delta[axis] * 4;
                self.isInertia = true;
            });
        }

        function keyPress(e) {
            if (!self.enabled) return;
            if (e.keyCode === 40) self.next(); // Down
            if (e.keyCode === 39) self.next(); // Right
            if (e.keyCode === 38) self.prev(); // Up
            if (e.keyCode === 37) self.prev(); // Left
        }

        function resize() {
            if (!self.enabled) return;
            stopInertia();
        }

        function loop() {
            axes.forEach(function (axis) {
                if (!self.max[axis]) return;
                var progress = self[axis] / self.max[axis],
                    i = Math.round(progress);
                if (scrollTarget[axis] === i * self.max[axis]) return;
                if (scrollInertia[axis] !== 0) {
                    scrollInertia[axis] *= 0.9;
                    if (Math.abs(scrollInertia[axis]) < 0.001) scrollInertia[axis] = 0;
                    scrollTarget[axis] += scrollInertia[axis];
                }
                var limit = self.max[axis] * 0.035;
                scrollTarget[axis] += ease(Math.round(self.progress) - self.progress) * limit;
                if (Math.abs(scrollTarget[axis] - self[axis]) > limit) scrollTarget[axis] -= (scrollTarget[axis] - self[axis]) * 0.5;else if (Math.abs(scrollTarget[axis] - self[axis]) < 0.001) scrollTarget[axis] = i * self.max[axis];
                self.delta[axis] = scrollTarget[axis] - self[axis];
                self.delta[axis] = self.delta[axis] < 0 ? Math.max(self.delta[axis], -limit) : Math.min(self.delta[axis], limit);
                self[axis] += self.delta[axis];
            });
            self.position = (self.x + self.y) / (self.max.x + self.max.y) % self.num + self.num;
            self.progress = self.position % 1;
            self.floor = Math.floor(self.position) % self.num;
            self.ceil = Math.ceil(self.position) % self.num;
            self.index = Math.round(self.position) % self.num;
            if (slideIndex !== self.index) {
                slideIndex = self.index;
                self.direction.x = self.delta.x < 0 ? -1 : 1;
                self.direction.y = self.delta.y < 0 ? -1 : 1;
                event.index = self.index;
                event.direction = self.direction;
                self.events.fire(Events.UPDATE, event);
            }
        }

        _this25.goto = function (i) {
            var obj = {};
            obj.x = i * _this25.max.x;
            obj.y = i * _this25.max.y;
            TweenManager.tween(scrollTarget, obj, 2500, 'easeOutQuint');
        };

        _this25.next = function () {
            var progress = (_this25.x + _this25.y) / (_this25.max.x + _this25.max.y),
                i = Math.round(progress);
            _this25.goto(i + 1);
        };

        _this25.prev = function () {
            var progress = (_this25.x + _this25.y) / (_this25.max.x + _this25.max.y),
                i = Math.round(progress);
            _this25.goto(i - 1);
        };

        _this25.destroy = function () {
            Stage.unbind('wheel', scroll);
            return _get(Slide.prototype.__proto__ || Object.getPrototypeOf(Slide.prototype), 'destroy', _this25).call(_this25);
        };
        return _this25;
    }

    return Slide;
}(Component);

/**
 * Slide video.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var SlideVideo = function (_Component7) {
    _inherits(SlideVideo, _Component7);

    function SlideVideo(params, callback) {
        _classCallCheck(this, SlideVideo);

        var _this26 = _possibleConstructorReturn(this, (SlideVideo.__proto__ || Object.getPrototypeOf(SlideVideo)).call(this));

        if (!SlideVideo.initialized) {
            SlideVideo.test = SlideVideo.test || !Device.mobile && Device.browser !== 'safari' && !Device.detect('trident');

            SlideVideo.initialized = true;
        }
        var self = _this26;
        _this26.events = new Events();
        _this26.img = params.img;
        if (_this26.img) _this26.img = Assets.CDN + _this26.img;
        _this26.src = params.src;
        if (_this26.src) _this26.src = Assets.CDN + _this26.src;

        if (_this26.src && SlideVideo.test) {
            window.fetch(_this26.src).then(function (response) {
                if (!response.ok) return error();
                response.blob().then(function (data) {
                    _this26.element = document.createElement('video');
                    _this26.element.src = URL.createObjectURL(data);
                    _this26.element.muted = true;
                    _this26.element.loop = true;
                    ready();
                    if (callback) callback();
                });
            }).catch(function () {
                error();
                if (callback) callback();
            });
        } else {
            var img = Assets.createImage(_this26.img);
            img.onload = function () {
                _this26.element = img;
                if (callback) callback();
            };
            img.onerror = error;
        }

        function error() {
            self.events.fire(Events.ERROR);
        }

        function ready() {
            self.element.addEventListener('playing', playing, true);
            self.element.addEventListener('pause', pause, true);
            if (self.willPlay) self.play();
        }

        function playing() {
            self.playing = true;
            self.events.fire(Events.READY);
        }

        function pause() {
            self.playing = false;
        }

        _this26.resume = function () {
            _this26.play(true);
        };

        _this26.play = function () {
            var resume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            _this26.willPlay = true;
            if (_this26.element && _this26.element.paused && !_this26.playing) {
                if (!resume) _this26.element.currentTime = 0;
                _this26.element.play();
            }
        };

        _this26.pause = function () {
            _this26.willPlay = false;
            if (_this26.element && !_this26.element.paused && _this26.playing) _this26.element.pause();
        };

        _this26.ready = function () {
            return _this26.element.readyState > _this26.element.HAVE_CURRENT_DATA;
        };

        _this26.destroy = function () {
            _this26.pause();
            _this26.element.src = '';
            return _get(SlideVideo.prototype.__proto__ || Object.getPrototypeOf(SlideVideo.prototype), 'destroy', _this26).call(_this26);
        };
        return _this26;
    }

    return SlideVideo;
}(Component);

/**
 * Slide loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var SlideLoader = function (_Component8) {
    _inherits(SlideLoader, _Component8);

    function SlideLoader(slides, callback) {
        _classCallCheck(this, SlideLoader);

        var _this27 = _possibleConstructorReturn(this, (SlideLoader.__proto__ || Object.getPrototypeOf(SlideLoader)).call(this));

        var self = _this27;
        _this27.events = new Events();
        _this27.list = [];
        _this27.pathList = [];
        var loaded = 0;

        slides.forEach(function (params) {
            _this27.list.push(_this27.initClass(SlideVideo, params, slideLoaded));
            _this27.pathList.push(params.path);
        });

        function slideLoaded() {
            self.percent = ++loaded / self.list.length;
            self.events.fire(Events.PROGRESS, { percent: self.percent });
            if (loaded === self.list.length) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE);
            if (callback) callback();
        }
        return _this27;
    }

    _createClass(SlideLoader, null, [{
        key: 'loadSlides',
        value: function loadSlides(slides, callback) {
            var promise = Promise.create();
            if (!callback) callback = promise.resolve;
            promise.loader = new SlideLoader(slides, callback);
            return promise;
        }
    }]);

    return SlideLoader;
}(Component);

/**
 * Linked list.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var LinkedList = function LinkedList() {
    var _this28 = this;

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
        for (var i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].object === object) {
                nodes[i] = null;
                nodes.splice(i, 1);
                break;
            }
        }
    }

    function destroy() {
        for (var i = nodes.length - 1; i >= 0; i--) {
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
        if (!_this28.first) {
            obj.next = obj.prev = _this28.last = _this28.first = obj;
        } else {
            obj.next = _this28.first;
            obj.prev = _this28.last;
            _this28.last.next = obj;
            _this28.last = obj;
        }
    };

    this.remove = function (object) {
        var obj = find(object);
        if (!obj || !obj.next) return;
        if (nodes.length <= 1) {
            _this28.empty();
        } else {
            if (obj === _this28.first) {
                _this28.first = obj.next;
                _this28.last.next = _this28.first;
                _this28.first.prev = _this28.last;
            } else if (obj == _this28.last) {
                _this28.last = obj.prev;
                _this28.last.next = _this28.first;
                _this28.first.prev = _this28.last;
            } else {
                obj.prev.next = obj.next;
                obj.next.prev = obj.prev;
            }
        }
        remove(object);
    };

    this.empty = function () {
        _this28.first = null;
        _this28.last = null;
        _this28.current = null;
        _this28.prev = null;
    };

    this.start = function () {
        _this28.current = _this28.first;
        _this28.prev = _this28.current;
        return _this28.current;
    };

    this.next = function () {
        if (!_this28.current) return;
        if (nodes.length === 1 || _this28.prev.next === _this28.first) return;
        _this28.current = _this28.current.next;
        _this28.prev = _this28.current;
        return _this28.current;
    };

    this.destroy = destroy;
};

/**
 * Object pool.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var ObjectPool = function ObjectPool(type, number) {
    var _this29 = this;

    _classCallCheck(this, ObjectPool);

    var pool = [];
    this.array = pool;

    if (type) for (var i = 0; i < number || 10; i++) {
        pool.push(new type());
    }this.get = function () {
        return pool.shift() || (type ? new type() : null);
    };

    this.empty = function () {
        pool.length = 0;
    };

    this.put = function (object) {
        pool.push(object);
    };

    this.insert = function (array) {
        if (!Array.isArray(array)) array = [array];
        pool.push.apply(pool, _toConsumableArray(array));
    };

    this.length = function () {
        return pool.length;
    };

    this.destroy = function () {
        for (var _i3 = pool.length - 1; _i3 >= 0; _i3--) {
            if (pool[_i3].destroy) pool[_i3].destroy();
        }return Utils.nullObject(_this29);
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

var Utils3D = new // Singleton pattern (IICE)

function Utils3D() {
    var _this30 = this;

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
            var img = Assets.createImage(_this30.PATH + src),
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
                var img = Assets.createImage(_this30.PATH + (Array.isArray(src) ? src[i] : src));
                images.push(img);
                img.onload = function () {
                    return textures[path].needsUpdate = true;
                };
            }
            textures[path] = new THREE.Texture(images);
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
        var texture = _this30.getTexture(src);
        texture.onload = function () {
            return texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        };
        return texture;
    };
}(); // Singleton pattern (IICE)

/**
 * Raycaster.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

var Raycaster = function (_Component9) {
    _inherits(Raycaster, _Component9);

    function Raycaster(camera) {
        _classCallCheck(this, Raycaster);

        var _this31 = _possibleConstructorReturn(this, (Raycaster.__proto__ || Object.getPrototypeOf(Raycaster)).call(this));

        _this31.camera = camera;
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
            if (recursive === true) object.children.forEach(function (object) {
                return intersectObject(object, raycaster, intersects, true);
            });
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

        _this31.pointsThreshold = function (value) {
            raycaster.params.Points.threshold = value;
        };

        _this31.debug = function (scene) {
            var geom = new THREE.Geometry();
            geom.vertices.push(new THREE.Vector3(-100, 0, 0));
            geom.vertices.push(new THREE.Vector3(100, 0, 0));
            var mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
            debug = new THREE.Line(geom, mat);
            scene.add(debug);
        };

        _this31.checkHit = function (objects) {
            var mouse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Mouse;

            var rect = _this31.rect || Stage;
            if (mouse === Mouse && rect === Stage) {
                calc.copy(Mouse.tilt);
            } else {
                calc.x = mouse.x / rect.width * 2 - 1;
                calc.y = -(mouse.y / rect.height) * 2 + 1;
            }
            raycaster.setFromCamera(calc, camera);
            return intersect(objects);
        };

        _this31.checkFromValues = function (objects, origin, direction) {
            raycaster.set(origin, direction, 0, Number.POSITIVE_INFINITY);
            return intersect(objects);
        };
        return _this31;
    }

    return Raycaster;
}(Component);

/**
 * 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

var Interaction3D = function () {
    function Interaction3D(camera) {
        var _this32 = this;

        _classCallCheck(this, Interaction3D);

        if (!Interaction3D.initialized) {
            Interaction3D.HOVER = 'interaction3d_hover';
            Interaction3D.CLICK = 'interaction3d_click';

            Interaction3D.initialized = true;
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
                _this32.meshes.push(mesh);
                _this32.meshCallbacks.push({ hoverCallback: hoverCallback, clickCallback: clickCallback });
            });
        };

        this.remove = function (meshes, parse) {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(function (mesh) {
                if (mesh === hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', _this32.cursor);
                }
                for (var i = _this32.meshes.length - 1; i >= 0; i--) {
                    if (_this32.meshes[i] === mesh) {
                        _this32.meshes.splice(i, 1);
                        _this32.meshCallbacks.splice(i, 1);
                    }
                }
            });
        };

        this.destroy = function () {
            return Utils.nullObject(_this32);
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

var ScreenProjection = function (_Component10) {
    _inherits(ScreenProjection, _Component10);

    function ScreenProjection(camera) {
        _classCallCheck(this, ScreenProjection);

        var _this33 = _possibleConstructorReturn(this, (ScreenProjection.__proto__ || Object.getPrototypeOf(ScreenProjection)).call(this));

        var v3 = new THREE.Vector3(),
            v32 = new THREE.Vector3(),
            value = new THREE.Vector3();

        _this33.set = function (v) {
            camera = v;
        };

        _this33.unproject = function (mouse, distance) {
            var rect = _this33.rect || Stage;
            v3.set(mouse.x / rect.width * 2 - 1, -(mouse.y / rect.height) * 2 + 1, 0.5);
            v3.unproject(camera);
            var pos = camera.position;
            v3.sub(pos).normalize();
            var dist = distance || -pos.z / v3.z;
            value.copy(pos).add(v3.multiplyScalar(dist));
            return value;
        };

        _this33.project = function (pos) {
            var rect = _this33.rect || Stage;
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
        return _this33;
    }

    return ScreenProjection;
}(Component);

/**
 * Shader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

var Shader = function (_Component11) {
    _inherits(Shader, _Component11);

    function Shader(vertexShader, fragmentShader, props) {
        _classCallCheck(this, Shader);

        var _this34 = _possibleConstructorReturn(this, (Shader.__proto__ || Object.getPrototypeOf(Shader)).call(this));

        var self = _this34;
        _this34.uniforms = {};
        _this34.properties = {};

        initProperties();
        initShaders();

        function initProperties() {
            for (var key in props) {
                if (typeof props[key].value !== 'undefined') self.uniforms[key] = props[key];else self.properties[key] = props[key];
            }
        }

        function initShaders() {
            var params = {};
            params.vertexShader = process(vertexShader, 'vs');
            params.fragmentShader = process(fragmentShader, 'fs');
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
            code = header + '\n\n' + code;
            var threeChunk = function threeChunk(a, b) {
                return THREE.ShaderChunk[b] + '\n';
            };
            return code.replace(/#s?chunk\(\s?(\w+)\s?\);/g, threeChunk);
        }
        return _this34;
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
            return _get(Shader.prototype.__proto__ || Object.getPrototypeOf(Shader.prototype), 'destroy', this).call(this);
        }
    }]);

    return Shader;
}(Component);

/**
 * Post processing effects.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

var Effects = function (_Component12) {
    _inherits(Effects, _Component12);

    function Effects(stage, params) {
        _classCallCheck(this, Effects);

        var _this35 = _possibleConstructorReturn(this, (Effects.__proto__ || Object.getPrototypeOf(Effects)).call(this));

        var self = _this35;
        _this35.stage = stage;
        _this35.renderer = params.renderer;
        _this35.scene = params.scene;
        _this35.camera = params.camera;
        _this35.shader = params.shader;
        _this35.dpr = params.dpr || 1;
        var renderTarget = void 0,
            camera = void 0,
            scene = void 0,
            mesh = void 0;

        initEffects();
        addListeners();

        function initEffects() {
            renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            self.texture = renderTarget.texture;
            self.texture.minFilter = THREE.LinearFilter;
            camera = new THREE.OrthographicCamera(self.stage.width / -2, self.stage.width / 2, self.stage.height / 2, self.stage.height / -2, 1, 1000);
            scene = new THREE.Scene();
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), self.shader.material);
            scene.add(mesh);
        }

        function addListeners() {
            Stage.events.add(Events.RESIZE, resize);
        }

        function resize() {
            renderTarget.dispose();
            renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            camera.left = self.stage.width / -2;
            camera.right = self.stage.width / 2;
            camera.top = self.stage.height / 2;
            camera.bottom = self.stage.height / -2;
            camera.updateProjectionMatrix();
        }

        _this35.render = function () {
            _this35.renderer.render(_this35.scene, _this35.camera, renderTarget, true);
            mesh.material.uniforms.texture.value = renderTarget.texture;
            _this35.renderer.render(scene, camera);
        };
        return _this35;
    }

    return Effects;
}(Component);

/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

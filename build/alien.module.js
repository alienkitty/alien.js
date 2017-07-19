(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Alien = {})));
}(this, (function (exports) { 'use strict';

/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.Events) window.Events = {
    BROWSER_FOCUS:  'browser_focus',
    KEYBOARD_DOWN:  'keyboard_down',
    KEYBOARD_UP:    'keyboard_up',
    KEYBOARD_PRESS: 'keyboard_press',
    RESIZE:         'resize',
    COMPLETE:       'complete',
    PROGRESS:       'progress',
    UPDATE:         'update',
    LOADED:         'loaded',
    ERROR:          'error',
    READY:          'ready',
    HOVER:          'hover',
    CLICK:          'click'
};

class EventManager {

    constructor() {
        let events = [];

        this.add = (event, callback, object) => {
            events.push({event, callback, object});
        };

        this.remove = (eventString, callback) => {
            for (let i = events.length - 1; i > -1; i--) {
                if (events[i].event === eventString && events[i].callback === callback) {
                    events[i] = null;
                    events.splice(i, 1);
                }
            }
        };

        this.destroy = object => {
            if (object) {
                for (let i = events.length - 1; i > -1; i--) {
                    if (events[i].object === object) {
                        events[i] = null;
                        events.splice(i, 1);
                    }
                }
            } else {
                window.events.destroy(this);
                for (let i = events.length - 1; i > -1; i--) {
                    events[i] = null;
                    events.splice(i, 1);
                }
                return null;
            }
        };

        this.fire = (eventString, object = {}) => {
            for (let i = 0; i < events.length; i++) if (events[i].event === eventString) events[i].callback(object);
        };

        this.subscribe = (event, callback) => {
            window.events.add(event, callback, this);
            return callback;
        };

        this.unsubscribe = (event, callback) => {
            window.events.remove(event, callback, this);
        };
    }
}

if (!window.events) window.events = new EventManager();

/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (callback => Delayed(callback, 1000 / 60));

let Render = new ( // Singleton pattern

class Render {

    constructor() {
        let last,
            render = [],
            time = Date.now(),
            timeSinceRender = 0,
            rendering = false;

        function focus(e) {
            if (e.type === 'focus') last = Date.now();
        }

        function step() {
            let t = Date.now(),
                timeSinceLoad = t - time,
                diff = 0,
                fps = 60;
            if (last) {
                diff = t - last;
                fps = 1000 / diff;
            }
            last = t;
            for (let i = render.length - 1; i > -1; i--) {
                let callback = render[i];
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

        this.start = callback => {
            callback.frameCount = 0;
            if (render.indexOf(callback) === -1) render.push(callback);
            if (render.length && !rendering) {
                rendering = true;
                window.requestAnimationFrame(step);
                window.events.add(Events.BROWSER_FOCUS, focus);
            }
        };

        this.stop = callback => {
            let i = render.indexOf(callback);
            if (i > -1) render.splice(i, 1);
        };
    }
}

)(); // Singleton pattern

/**
 * Dynamic object with linear interpolation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class DynamicObject {

    constructor(props) {
        for (let key in props) this[key] = props[key];

        this.lerp = (v, ratio) => {
            for (let key in props) this[key] += (v[key] - this[key]) * ratio;
            return this;
        };
    }
}

/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Device = new ( // Singleton pattern

class Device {

    constructor() {
        this.agent = navigator.userAgent.toLowerCase();
        this.prefix = (() => {
            let pre = '',
                dom = '',
                styles = window.getComputedStyle(document.documentElement, '');
            pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
            dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
            var IE = this.detect('trident');
            return {
                unprefixed: IE && !this.detect('msie 9'),
                dom: dom,
                lowercase: pre,
                css: '-' + pre + '-',
                js: (IE ? pre[0] : pre[0].toUpperCase()) + pre.substr(1)
            };
        })();
        this.transformProperty = (() => {
            let pre;
            switch (this.prefix.lowercase) {
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
        })();
        this.mobile = !!('ontouchstart' in window || 'onpointerdown' in window) && this.detect(['ios', 'iphone', 'ipad', 'android', 'blackberry']) ? {} : false;
        this.tablet = (() => {
            if (window.innerWidth > window.innerHeight) return document.body.clientWidth > 800;
            else return document.body.clientHeight > 800;
        })();
        this.phone = !this.tablet;
        this.type = this.phone ? 'phone' : 'tablet';
    }

    detect(array) {
        if (typeof array === 'string') array = [array];
        for (let i = 0; i < array.length; i++) if (this.agent.indexOf(array[i]) > -1) return true;
        return false;
    }

    vendor(style) {
        return this.prefix.js + style;
    }

    vibrate(time) {
        navigator.vibrate && navigator.vibrate(time);
    }
}

)(); // Singleton pattern

/**
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Utils = new ( // Singleton pattern

class Utils {

    rand(min, max) {
        return (new DynamicObject({v:min})).lerp({v:max}, Math.random()).v;
    }

    doRandom(min, max, precision) {
        if (typeof precision === 'number') {
            let p = Math.pow(10, precision);
            return Math.round(this.rand(min, max) * p) / p;
        } else {
            return Math.round(this.rand(min - 0.5, max + 0.5));
        }
    }

    headsTails(heads, tails) {
        return !this.doRandom(0, 1) ? heads : tails;
    }

    toDegrees(rad) {
        return rad * (180 / Math.PI);
    }

    toRadians(deg) {
        return deg * (Math.PI / 180);
    }

    findDistance(p1, p2) {
        let dx = p2.x - p1.x,
            dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    timestamp() {
        return (Date.now() + this.doRandom(0, 99999)).toString();
    }

    pad(number) {
        return number < 10 ? '0' + number : number;
    }

    touchEvent(e) {
        let touchEvent = {};
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

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    constrain(num, min, max) {
        return Math.min(Math.max(num, Math.min(min, max)), Math.max(min, max));
    }

    convertRange(oldValue, oldMin, oldMax, newMin, newMax, constrain) {
        let oldRange = oldMax - oldMin,
            newRange = newMax - newMin,
            newValue = (oldValue - oldMin) * newRange / oldRange + newMin;
        return constrain ? this.constrain(newValue, newMin, newMax) : newValue;
    }

    nullObject(object) {
        for (let key in object) if (typeof object[key] !== 'undefined') object[key] = null;
        return null;
    }

    cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    mergeObject(...objects) {
        let object = {};
        for (let obj of objects) for (let key in obj) object[key] = obj[key];
        return object;
    }

    cloneArray(array) {
        return array.slice(0);
    }

    toArray(object) {
        return Object.keys(object).map(key => {
            return object[key];
        });
    }

    queryString(key) {
        // eslint-disable-next-line no-useless-escape
        return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
    }

    basename(path) {
        return path.replace(/.*\//, '').replace(/(.*)\..*$/, '$1');
    }
}

)(); // Singleton pattern

/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Interpolation = new ( // Singleton pattern

class Interpolation {

    constructor() {
        this.convertEase = ease => {
            return (() => {
                let fn;
                switch (ease) {
                    case 'easeInQuad':
                        fn = this.Quad.In;
                        break;
                    case 'easeInCubic':
                        fn = this.Cubic.In;
                        break;
                    case 'easeInQuart':
                        fn = this.Quart.In;
                        break;
                    case 'easeInQuint':
                        fn = this.Quint.In;
                        break;
                    case 'easeInSine':
                        fn = this.Sine.In;
                        break;
                    case 'easeInExpo':
                        fn = this.Expo.In;
                        break;
                    case 'easeInCirc':
                        fn = this.Circ.In;
                        break;
                    case 'easeInElastic':
                        fn = this.Elastic.In;
                        break;
                    case 'easeInBack':
                        fn = this.Back.In;
                        break;
                    case 'easeInBounce':
                        fn = this.Bounce.In;
                        break;
                    case 'easeOutQuad':
                        fn = this.Quad.Out;
                        break;
                    case 'easeOutCubic':
                        fn = this.Cubic.Out;
                        break;
                    case 'easeOutQuart':
                        fn = this.Quart.Out;
                        break;
                    case 'easeOutQuint':
                        fn = this.Quint.Out;
                        break;
                    case 'easeOutSine':
                        fn = this.Sine.Out;
                        break;
                    case 'easeOutExpo':
                        fn = this.Expo.Out;
                        break;
                    case 'easeOutCirc':
                        fn = this.Circ.Out;
                        break;
                    case 'easeOutElastic':
                        fn = this.Elastic.Out;
                        break;
                    case 'easeOutBack':
                        fn = this.Back.Out;
                        break;
                    case 'easeOutBounce':
                        fn = this.Bounce.Out;
                        break;
                    case 'easeInOutQuad':
                        fn = this.Quad.InOut;
                        break;
                    case 'easeInOutCubic':
                        fn = this.Cubic.InOut;
                        break;
                    case 'easeInOutQuart':
                        fn = this.Quart.InOut;
                        break;
                    case 'easeInOutQuint':
                        fn = this.Quint.InOut;
                        break;
                    case 'easeInOutSine':
                        fn = this.Sine.InOut;
                        break;
                    case 'easeInOutExpo':
                        fn = this.Expo.InOut;
                        break;
                    case 'easeInOutCirc':
                        fn = this.Circ.InOut;
                        break;
                    case 'easeInOutElastic':
                        fn = this.Elastic.InOut;
                        break;
                    case 'easeInOutBack':
                        fn = this.Back.InOut;
                        break;
                    case 'easeInOutBounce':
                        fn = this.Bounce.InOut;
                        break;
                    case 'linear':
                        fn = this.Linear.None;
                        break;
                }
                return fn;
            })() || this.Cubic.Out;
        };

        this.Linear = {
            None: k => {
                return k;
            }
        };

        this.Quad = {
            In: k => {
                return k * k;
            },
            Out: k => {
                return k * (2 - k);
            },
            InOut: k => {
                if ((k *= 2) < 1) return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            }
        };

        this.Cubic = {
            In: k => {
                return k * k * k;
            },
            Out: k => {
                return --k * k * k + 1;
            },
            InOut: k => {
                if ((k *= 2) < 1) return 0.5 * k * k * k;
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        };

        this.Quart = {
            In: k => {
                return k * k * k * k;
            },
            Out: k => {
                return 1 - (--k * k * k * k);
            },
            InOut: k => {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k;
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }
        };

        this.Quint = {
            In: k => {
                return k * k * k * k * k;
            },
            Out: k => {
                return --k * k * k * k * k + 1;
            },
            InOut: k => {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }
        };

        this.Sine = {
            In: k => {
                return 1 - Math.cos(k * Math.PI / 2);
            },
            Out: k => {
                return Math.sin(k * Math.PI / 2);
            },
            InOut: k => {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        };

        this.Expo = {
            In: k => {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            },
            Out: k => {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            },
            InOut: k => {
                if (k === 0) return 0;
                if (k === 1) return 1;
                if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        };

        this.Circ = {
            In: k => {
                return 1 - Math.sqrt(1 - k * k);
            },
            Out: k => {
                return Math.sqrt(1 - (--k * k));
            },
            InOut: k => {
                if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        };

        this.Elastic = {
            In: k => {
                let s, a = 0.1, p = 0.4;
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
            Out: k => {
                let s, a = 0.1, p = 0.4;
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
            InOut: k => {
                let s, a = 0.1, p = 0.4;
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
            In: k => {
                let s = 1.70158;
                return k * k * ((s + 1) * k - s);
            },
            Out: k => {
                let s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            },
            InOut: k => {
                let s = 1.70158 * 1.525;
                if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        };

        this.Bounce = {
            In: k => {
                return 1 - this.Bounce.Out(1 - k);
            },
            Out: k => {
                if (k < 1 / 2.75) return 7.5625 * k * k;
                else if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
                else if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
                else return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            },
            InOut: k => {
                if (k < 0.5) return this.Bounce.In(k * 2) * 0.5;
                return this.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        };
    }
}

)(); // Singleton pattern

/**
 * Mathematical.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class MathTween {

    constructor(object, props, time, ease, delay, callback) {
        let self = this;
        let startTime, startValues, endValues, paused, elapsed;

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
            for (let prop in endValues) if (typeof object[prop] === 'number') startValues[prop] = object[prop];
        }

        function clear(stop) {
            object.mathTween = null;
            if (!stop) for (let prop in endValues) if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
            TweenManager.removeMathTween(self);
        }

        this.update = t => {
            if (paused || t < startTime) return;
            elapsed = (t - startTime) / time;
            elapsed = elapsed > 1 ? 1 : elapsed;
            let delta = ease(elapsed);
            for (let prop in startValues) {
                if (typeof startValues[prop] === 'number') {
                    let start = startValues[prop],
                        end = endValues[prop];
                    object[prop] = start + (end - start) * delta;
                }
            }
            if (elapsed === 1) {
                clear();
                if (callback) callback();
            }
        };

        this.pause = () => {
            paused = true;
        };

        this.resume = () => {
            paused = false;
            startTime = Date.now() - elapsed * time;
        };

        this.stop = () => clear(true);
    }
}

/**
 * Spring math.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class SpringTween {

    constructor(object, props, friction, ease, delay, callback) {
        let self = this;
        let startTime, velocityValues, endValues, startValues, damping, count, paused;

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
            for (let prop in props) {
                if (typeof props[prop] === 'number') {
                    velocityValues[prop] = 0;
                    endValues[prop] = props[prop];
                }
            }
            for (let prop in props) {
                if (typeof object[prop] === 'number') {
                    startValues[prop] = object[prop] || 0;
                    props[prop] = startValues[prop];
                }
            }
        }

        function clear(stop) {
            object.mathTween = null;
            if (!stop) for (let prop in endValues) if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
            TweenManager.removeMathTween(self);
        }

        this.update = t => {
            if (paused || t < startTime) return;
            let vel;
            for (let prop in startValues) {
                if (typeof startValues[prop] === 'number') {
                    let end = endValues[prop],
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

        this.pause = () => {
            paused = true;
        };

        this.stop = () => clear(true);
    }
}

/**
 * Tween helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let TweenManager = new ( // Singleton pattern

class TweenManager {

    constructor() {
        this.TRANSFORMS = ['x', 'y', 'z', 'scale', 'scaleX', 'scaleY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'skewX', 'skewY', 'perspective'];
        this.CSS_EASES = {
            easeOutCubic:   'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            easeOutQuad:    'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
            easeOutQuart:   'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
            easeOutQuint:   'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
            easeOutSine:    'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
            easeOutExpo:    'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
            easeOutCirc:    'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
            easeOutBack:    'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
            easeInCubic:    'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
            easeInQuad:     'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
            easeInQuart:    'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
            easeInQuint:    'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
            easeInSine:     'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
            easeInCirc:     'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
            easeInBack:     'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
            easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
            easeInOutQuad:  'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
            easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
            easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
            easeInOutSine:  'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
            easeInOutExpo:  'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
            easeInOutCirc:  'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
            easeInOutBack:  'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
            easeInOut:      'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
            linear:         'linear'
        };
        let tweens = [],
            rendering = false;

        function updateTweens(t) {
            if (tweens.length) {
                for (let i = 0; i < tweens.length; i++) tweens[i].update(t);
            } else {
                rendering = false;
                Render.stop(updateTweens);
            }
        }

        this.addMathTween = tween => {
            tweens.push(tween);
            if (!rendering) {
                rendering = true;
                Render.start(updateTweens);
            }
        };

        this.removeMathTween = tween => {
            let i = tweens.indexOf(tween);
            if (i > -1) tweens.splice(i, 1);
        };
    }

    tween(object, props, time, ease, delay, callback) {
        if (typeof delay !== 'number') {
            callback = delay;
            delay = 0;
        }
        let promise = null;
        if (typeof Promise !== 'undefined') {
            promise = Promise.create();
            if (callback) promise.then(callback);
            callback = promise.resolve;
        }
        let tween = ease === 'spring' ? new SpringTween(object, props, time, ease, delay, callback) : new MathTween(object, props, time, ease, delay, callback);
        return promise || tween;
    }

    clearTween(object) {
        if (object.mathTween) object.mathTween.stop();
    }

    clearCSSTween(object) {
        if (object.cssTween) object.cssTween.stop();
    }

    checkTransform(key) {
        return this.TRANSFORMS.indexOf(key) > -1;
    }

    getEase(name) {
        let eases = this.CSS_EASES;
        return eases[name] || eases.easeOutCubic;
    }

    getAllTransforms(object) {
        let obj = {};
        for (let i = this.TRANSFORMS.length - 1; i > -1; i--) {
            let key = this.TRANSFORMS[i],
                val = object[key];
            if (val !== 0 && typeof val === 'number') obj[key] = val;
        }
        return obj;
    }

    parseTransform(props) {
        let transforms = '';
        if (typeof props.x !== 'undefined' || typeof props.y !== 'undefined' || typeof props.z !== 'undefined') {
            let x = props.x || 0,
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
}

)(); // Singleton pattern

/**
 * CSS3 transition animation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CSSTransition {

    constructor(object, props, time, ease, delay, callback) {
        let self = this;
        let transform = TweenManager.getAllTransforms(object),
            properties = [];

        initProperties();
        initCSSTween();

        function killed() {
            return !object || !object.element;
        }

        function initProperties() {
            for (let key in props) {
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
            let transition = '';
            for (let i = 0; i < properties.length; i++) transition += (transition.length ? ', ' : '') + properties[i] + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
            Delayed(() => {
                if (killed()) return;
                object.element.style[Device.vendor('Transition')] = transition;
                object.css(props);
                object.transform(transform);
                Delayed(() => {
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

        this.stop = () => clear();
    }
}

/**
 * SVG helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let SVG = new ( // Singleton pattern

class SVG {

    constructor() {
        let symbols = [];

        this.defineSymbol = (id, width, height, innerHTML) => {
            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('style', 'display: none;');
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svg.innerHTML = `<symbol id="${id}">${innerHTML}</symbol>`;
            document.body.insertBefore(svg, document.body.firstChild);
            symbols.push({id, width, height});
        };

        this.getSymbolConfig = id => {
            for (let i = 0; i < symbols.length; i++) if (symbols[i].id === id) return symbols[i];
            return null;
        };
    }
}

)(); // Singleton pattern

/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Interface {

    constructor(name, type = 'div', detached) {
        this.events = new EventManager();
        this.name = name;
        this.type = type;
        if (this.type === 'svg') {
            this.element = document.createElementNS('http://www.w3.org/2000/svg', this.type);
            this.element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        } else {
            this.element = document.createElement(this.type);
        }
        if (name[0] === '.') this.element.className = name.substr(1);
        else this.element.id = name;
        this.element.style.position = 'absolute';
        if (!detached) {
            let stage = window.Alien && window.Alien.Stage ? window.Alien.Stage : document.body;
            stage.appendChild(this.element);
        }
    }

    initClass(object, ...params) {
        let child = new object(...params);
        if (child.element) this.element.appendChild(child.element);
        child.parent = this;
        return child;
    }

    create(name, type) {
        let child = new Interface(name, type);
        this.element.appendChild(child.element);
        child.parent = this;
        return child;
    }

    destroy() {
        if (this.loop) Render.stop(this.loop);
        this.events = this.events.destroy();
        this.element.parentNode.removeChild(this.element);
        return Utils.nullObject(this);
    }

    empty() {
        this.element.innerHTML = '';
        return this;
    }

    text(text) {
        if (typeof text === 'undefined') return this.element.textContent;
        else this.element.textContent = text;
        return this;
    }

    html(text) {
        if (typeof text === 'undefined') return this.element.innerHTML;
        else this.element.innerHTML = text;
        return this;
    }

    hide() {
        this.element.style.display = 'none';
        return this;
    }

    show() {
        this.element.style.display = '';
        return this;
    }

    visible() {
        this.element.style.visibility = 'visible';
        return this;
    }

    invisible() {
        this.element.style.visibility = 'hidden';
        return this;
    }

    setZ(z) {
        this.element.style.zIndex = z;
        return this;
    }

    clearAlpha() {
        this.element.style.opacity = '';
        return this;
    }

    size(w, h) {
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

    mouseEnabled(bool) {
        this.element.style.pointerEvents = bool ? 'auto' : 'none';
        return this;
    }

    fontStyle(fontFamily, fontSize, color, fontStyle) {
        this.css({fontFamily, fontSize, color, fontStyle});
        return this;
    }

    bg(src, x, y, repeat) {
        if (src.indexOf('.') > -1 || src.indexOf('data:') > -1) this.element.style.backgroundImage = 'url(' + src + ')';
        else this.element.style.backgroundColor = src;
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

    center(x, y, noPos) {
        let css = {};
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

    mask(src) {
        this.element.style[Device.vendor('Mask')] = (src.indexOf('.') > -1 ? 'url(' + src + ')' : src) + ' no-repeat';
        this.element.style[Device.vendor('MaskSize')] = 'contain';
        return this;
    }

    blendMode(mode, bg) {
        this.element.style[bg ? 'background-blend-mode' : 'mix-blend-mode'] = mode;
        return this;
    }

    css(props, value) {
        if (typeof props !== 'object') {
            if (!value) {
                let style = this.element.style[props];
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
        for (let key in props) {
            let val = props[key];
            if (!(typeof val === 'string' || typeof val === 'number')) continue;
            if (typeof val !== 'string' && key !== 'opacity' && key !== 'zIndex') val += 'px';
            this.element.style[key] = val;
        }
        return this;
    }

    transform(props) {
        if (!props) props = this;
        else for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        this.element.style[Device.vendor('Transform')] = TweenManager.parseTransform(props);
        return this;
    }

    enable3D(perspective, x, y) {
        this.element.style[Device.vendor('TransformStyle')] = 'preserve-3d';
        if (perspective) this.element.style[Device.vendor('Perspective')] = perspective + 'px';
        if (typeof x !== 'undefined') {
            x = typeof x === 'number' ? x + 'px' : x;
            y = typeof y === 'number' ? y + 'px' : y;
            this.element.style[Device.vendor('PerspectiveOrigin')] = x + ' ' + y;
        }
        return this;
    }

    disable3D() {
        this.element.style[Device.vendor('TransformStyle')] = '';
        this.element.style[Device.vendor('Perspective')] = '';
        return this;
    }

    transformPoint(x, y, z) {
        let origin = '';
        if (typeof x !== 'undefined') origin += typeof x === 'number' ? x + 'px ' : x + ' ';
        if (typeof y !== 'undefined') origin += typeof y === 'number' ? y + 'px ' : y + ' ';
        if (typeof z !== 'undefined') origin += typeof z === 'number' ? z + 'px' : z;
        this.element.style[Device.vendor('TransformOrigin')] = origin;
        return this;
    }

    tween(props, time, ease, delay, callback) {
        if (typeof delay !== 'number') {
            callback = delay;
            delay = 0;
        }
        let promise = null;
        if (typeof Promise !== 'undefined') {
            promise = Promise.create();
            if (callback) promise.then(callback);
            callback = promise.resolve;
        }
        let tween = new CSSTransition(this, props, time, ease, delay, callback);
        return promise || tween;
    }

    clearTransform() {
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

    stopTween() {
        if (this.cssTween) this.cssTween.stop();
        if (this.mathTween) this.mathTween.stop();
        return this;
    }

    attr(attr, value) {
        if (typeof value === 'undefined') return this.element.getAttribute(attr);
        else if (value === '') this.element.removeAttribute(attr);
        else this.element.setAttribute(attr, value);
        return this;
    }

    svgSymbol(id, width, height) {
        let config = SVG.getSymbolConfig(id);
        this.html(`<svg viewBox="0 0 ${config.width} ${config.height}" width="${width}" height="${height}"><use xlink:href="#${config.id}" x="0" y="0"/></svg>`);
    }

    startRender(callback) {
        this.loop = callback;
        Render.start(callback);
    }

    stopRender(callback) {
        this.loop = null;
        Render.stop(callback);
    }

    click(callback) {
        let clicked = e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'click';
            if (callback) callback(e);
        };
        this.element.addEventListener('click', clicked);
        this.element.style.cursor = 'pointer';
        return this;
    }

    hover(callback) {
        let hovered = e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = e.type === 'mouseout' ? 'out' : 'over';
            if (callback) callback(e);
        };
        this.element.addEventListener('mouseover', hovered);
        this.element.addEventListener('mouseout', hovered);
        return this;
    }

    press(callback) {
        let pressed = e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = e.type === 'mousedown' ? 'down' : 'up';
            if (callback) callback(e);
        };
        this.element.addEventListener('mousedown', pressed);
        this.element.addEventListener('mouseup', pressed);
        return this;
    }

    bind(event, callback) {
        if (event === 'touchstart' && !Device.mobile) event = 'mousedown';
        else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';
        else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
        this.element.addEventListener(event, callback);
        return this;
    }

    unbind(event, callback) {
        if (event === 'touchstart' && !Device.mobile) event = 'mousedown';
        else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';
        else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
        this.element.removeEventListener(event, callback);
        return this;
    }

    interact(overCallback, clickCallback) {
        this.hit = this.create('.hit').css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 99999
        });
        if (!Device.mobile) this.hit.hover(overCallback).click(clickCallback);
        else this.hit.touchClick(overCallback, clickCallback);
        return this;
    }

    touchSwipe(callback, distance = 75) {
        let startX, startY,
            moving = false,
            move = {};
        let touchStart = e => {
            let touch = Utils.touchEvent(e);
            if (e.touches.length === 1) {
                startX = touch.x;
                startY = touch.y;
                moving = true;
                this.element.addEventListener('touchmove', touchMove, {passive:true});
            }
        };
        let touchMove = e => {
            if (moving) {
                let touch = Utils.touchEvent(e),
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
        let touchEnd = () => {
            startX = startY = moving = false;
            this.element.removeEventListener('touchmove', touchMove);
        };
        this.element.addEventListener('touchstart', touchStart, {passive:true});
        this.element.addEventListener('touchend', touchEnd, {passive:true});
        this.element.addEventListener('touchcancel', touchEnd, {passive:true});
        return this;
    }

    touchClick(hover, click) {
        let time, move,
            start = {},
            touch = {};
        let touchMove = e => {
            touch = Utils.touchEvent(e);
            move = Utils.findDistance(start, touch) > 5;
        };
        let setTouch = e => {
            let touch = Utils.touchEvent(e);
            e.touchX = touch.x;
            e.touchY = touch.y;
            start.x = e.touchX;
            start.y = e.touchY;
        };
        let touchStart = e => {
            time = Date.now();
            e.action = 'over';
            e.object = this.element.className === 'hit' ? this.parent : this;
            setTouch(e);
            if (hover && !move) hover(e);
        };
        let touchEnd = e => {
            let t = Date.now();
            e.object = this.element.className === 'hit' ? this.parent : this;
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
        this.element.addEventListener('touchmove', touchMove, {passive:true});
        this.element.addEventListener('touchstart', touchStart, {passive:true});
        this.element.addEventListener('touchend', touchEnd, {passive:true});
        return this;
    }

    split(by = '') {
        let style = {
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
        for (let i = 0; i < split.length; i++) {
            if (split[i] === ' ') split[i] = '&nbsp;';
            array.push(this.create('.t', 'span').html(split[i]).css(style));
            if (by !== '' && i < split.length - 1) array.push(this.create('.t', 'span').html(by).css(style));
        }
        return array;
    }
}

/**
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Canvas extends Interface {

    constructor(name, w, h = w, retina, detached) {
        super(name, 'canvas', detached);
        this.children = [];
        this.retina = retina;
        this.context = this.element.getContext('2d');
        let ratio = retina ? 2 : 1;
        this.element.width = w * ratio;
        this.element.height = h * ratio;
        this.context.scale(ratio, ratio);
        this.size(w, h);
    }

    toDataURL(type, quality) {
        return this.element.toDataURL(type, quality);
    }

    render(noClear) {
        if (!(typeof noClear === 'boolean' && noClear)) this.clear();
        for (let i = 0; i < this.children.length; i++) this.children[i].render();
    }

    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }

    add(display) {
        display.setCanvas(this);
        display.parent = this;
        this.children.push(display);
        display.z = this.children.length;
    }

    remove(display) {
        display.canvas = null;
        display.parent = null;
        let i = this.children.indexOf(display);
        if (i > -1) this.children.splice(i, 1);
    }

    destroy() {
        this.stopRender();
        for (let i = 0; i < this.children.length; i++) this.children[i].destroy();
        return Utils.nullObject(this);
    }

    getImageData(x = 0, y = 0, w = this.element.width, h = this.element.height) {
        this.imageData = this.context.getImageData(x, y, w, h);
        return this.imageData;
    }

    getPixel(x, y, dirty) {
        if (!this.imageData || dirty) this.getImageData();
        let imgData = {},
            index = (x + y * this.element.width) * 4,
            pixels = this.imageData.data;
        imgData.r = pixels[index];
        imgData.g = pixels[index + 1];
        imgData.b = pixels[index + 2];
        imgData.a = pixels[index + 3];
        return imgData;
    }

    putImageData(imageData) {
        this.context.putImageData(imageData, 0, 0);
    }
}

/**
 * Canvas values.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasValues {

    constructor(style) {
        this.styles = {};
        if (!style) this.data = new Float32Array(6);
        else this.styled = false;
    }

    set shadowOffsetX(val) {
        this.styled = true;
        this.styles.shadowOffsetX = val;
    }

    get shadowOffsetX() {
        return this.styles.shadowOffsetX;
    }

    set shadowOffsetY(val) {
        this.styled = true;
        this.styles.shadowOffsetY = val;
    }

    get shadowOffsetY() {
        return this.styles.shadowOffsetY;
    }

    set shadowBlur(val) {
        this.styled = true;
        this.styles.shadowBlur = val;
    }

    get shadowBlur() {
        return this.styles.shadowBlur;
    }

    set shadowColor(val) {
        this.styled = true;
        this.styles.shadowColor = val;
    }

    get shadowColor() {
        return this.styles.shadowColor;
    }

    get values() {
        return this.styles;
    }

    setTRSA(x, y, r, sx, sy, a) {
        let m = this.data;
        m[0] = x;
        m[1] = y;
        m[2] = r;
        m[3] = sx;
        m[4] = sy;
        m[5] = a;
    }

    calculate(values) {
        let v = values.data,
            m = this.data;
        m[0] = m[0] + v[0];
        m[1] = m[1] + v[1];
        m[2] = m[2] + v[2];
        m[3] = m[3] * v[3];
        m[4] = m[4] * v[4];
        m[5] = m[5] * v[5];
    }

    calculateStyle(parent) {
        if (!parent.styled) return false;
        this.styled = true;
        let values = parent.values;
        for (let key in values) if (!this.styles[key]) this.styles[key] = values[key];
    }
}

/**
 * Canvas object.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasObject {

    constructor() {
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

    updateValues() {
        this.values.setTRSA(this.x, this.y, Utils.toRadians(this.rotation), this.scaleX || this.scale, this.scaleY || this.scale, this.opacity);
        if (this.parent.values) this.values.calculate(this.parent.values);
        if (this.parent.styles) this.styles.calculateStyle(this.parent.styles);
    }

    render(override) {
        if (!this.visible) return false;
        this.updateValues();
        if (this.draw) this.draw(override);
        for (let i = 0; i < this.children.length; i++) this.children[i].render(override);
    }

    startDraw(ox, oy, override) {
        let context = this.canvas.context,
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
            let values = this.styles.values;
            for (let key in values) context[key] = values[key];
        }
    }

    endDraw() {
        this.canvas.context.restore();
    }

    add(display) {
        display.canvas = this.canvas;
        display.parent = this;
        this.children.push(display);
        display.z = this.children.length;
        for (let i = this.children.length - 1; i > -1; i--) this.children[i].setCanvas(this.canvas);
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        for (let i = this.children.length - 1; i > -1; i--) this.children[i].setCanvas(canvas);
    }

    remove(display) {
        display.canvas = null;
        display.parent = null;
        let i = this.children.indexOf(display);
        if (i > -1) this.children.splice(i, 1);
    }

    isMask() {
        let obj = this;
        while (obj) {
            if (obj.masked) return true;
            obj = obj.parent;
        }
        return false;
    }

    unmask() {
        this.masked.mask(null);
        this.masked = null;
    }

    setZ(z) {
        this.z = z;
        this.parent.children.sort((a, b) => {
            return a.z - b.z;
        });
    }

    follow(object) {
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

    visible() {
        this.visible = true;
        return this;
    }

    invisible() {
        this.visible = false;
        return this;
    }

    transform(props) {
        for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        return this;
    }

    transformPoint(x, y) {
        this.px = typeof x === 'number' ? x : this.width * (parseFloat(x) / 100);
        this.py = typeof y === 'number' ? y : this.height * (parseFloat(y) / 100);
        return this;
    }

    clip(x, y, w, h) {
        this.clipX = x;
        this.clipY = y;
        this.clipWidth = w;
        this.clipHeight = h;
        return this;
    }

    destroy() {
        for (let i = 0; i < this.children.length; i++) this.children[i].destroy();
        return Utils.nullObject(this);
    }
}

/**
 * Image helper class with promise method.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Images = new ( // Singleton pattern

class Images {

    createImg(src, callback) {
        let img = new Image();
        img.src = (Config.CDN || '') + src;
        img.onload = () => {
            if (callback) callback();
        };
        return img;
    }

    promise(img) {
        let p = Promise.create();
        img.onload = p.resolve;
        return p;
    }
}

)(); // Singleton pattern

/**
 * Canvas graphics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasGraphics extends CanvasObject {

    constructor(w = 0, h = w) {
        super();
        let self = this;
        this.width = w;
        this.height = h;
        this.props = {};
        let images = {},
            draw = [],
            mask;

        function setProperties(context) {
            for (let key in self.props) context[key] = self.props[key];
        }

        this.draw = override => {
            if (this.isMask() && !override) return false;
            let context = this.canvas.context;
            this.startDraw(-this.px, -this.py, override);
            setProperties(context);
            if (this.clipWidth && this.clipHeight) {
                context.beginPath();
                context.rect(this.clipX, this.clipY, this.clipWidth, this.clipHeight);
                context.clip();
            }
            for (let i = 0; i < draw.length; i++) {
                let cmd = draw[i];
                if (!cmd) continue;
                let fn = cmd.shift();
                context[fn].apply(context, cmd);
                cmd.unshift(fn);
            }
            this.endDraw();
            if (mask) {
                context.globalCompositeOperation = mask.blendMode;
                mask.render(true);
            }
        };

        this.clear = () => {
            for (let i = 0; i < draw.length; i++) draw[i].length = 0;
            draw.length = 0;
        };

        this.arc = (x = 0, y = 0, endAngle = 0, radius = this.radius || this.width / 2, startAngle = 0, counterclockwise = false) => {
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

        this.quadraticCurveTo = (cpx, cpy, x, y) => {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        this.bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        this.fillRect = (x, y, w, h) => {
            draw.push(['fillRect', x, y, w, h]);
        };

        this.clearRect = (x, y, w, h) => {
            draw.push(['clearRect', x, y, w, h]);
        };

        this.strokeRect = (x, y, w, h) => {
            draw.push(['strokeRect', x, y, w, h]);
        };

        this.moveTo = (x, y) => {
            draw.push(['moveTo', x, y]);
        };

        this.lineTo = (x, y) => {
            draw.push(['lineTo', x, y]);
        };

        this.stroke = () => {
            draw.push(['stroke']);
        };

        this.fill = () => {
            if (!mask) draw.push(['fill']);
        };

        this.beginPath = () => {
            draw.push(['beginPath']);
        };

        this.closePath = () => {
            draw.push(['closePath']);
        };

        this.fillText = (text, x, y) => {
            draw.push(['fillText', text, x, y]);
        };

        this.strokeText = (text, x, y) => {
            draw.push(['strokeText', text, x, y]);
        };

        this.setLineDash = value => {
            draw.push(['setLineDash', value]);
        };

        this.createImage = (src, force) => {
            if (!images[src] || force) {
                let img = Images.createImg(src);
                if (force) return img;
                images[src] = img;
            }
            return images[src];
        };

        this.drawImage = (img, sx = 0, sy = 0, sWidth = img.width, sHeight = img.height, dx = 0, dy = 0, dWidth = img.width, dHeight = img.height) => {
            if (typeof img === 'string') img = this.createImage(img);
            draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight]);
        };

        this.mask = object => {
            if (!object) return mask = null;
            mask = object;
            object.masked = this;
            for (let i = 0; i < draw.length; i++) {
                if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                    draw[i].length = 0;
                    draw.splice(i, 1);
                }
            }
        };

        this.clone = () => {
            let object = new CanvasGraphics(this.width, this.height);
            object.visible = this.visible;
            object.blendMode = this.blendMode;
            object.opacity = this.opacity;
            object.follow(this);
            object.props = Utils.cloneObject(this.props);
            object.setDraw(Utils.cloneArray(draw));
            return object;
        };

        this.setDraw = array => {
            draw = array;
        };
    }

    set strokeStyle(val) {
        this.props.strokeStyle = val;
    }

    get strokeStyle() {
        return this.props.strokeStyle;
    }

    set fillStyle(val) {
        this.props.fillStyle = val;
    }

    get fillStyle() {
        return this.props.fillStyle;
    }

    set lineWidth(val) {
        this.props.lineWidth = val;
    }

    get lineWidth() {
        return this.props.lineWidth;
    }

    set lineCap(val) {
        this.props.lineCap = val;
    }

    get lineCap() {
        return this.props.lineCap;
    }

    set lineDashOffset(val) {
        this.props.lineDashOffset = val;
    }

    get lineDashOffset() {
        return this.props.lineDashOffset;
    }

    set lineJoin(val) {
        this.props.lineJoin = val;
    }

    get lineJoin() {
        return this.props.lineJoin;
    }

    set miterLimit(val) {
        this.props.miterLimit = val;
    }

    get miterLimit() {
        return this.props.miterLimit;
    }

    set font(val) {
        this.props.font = val;
    }

    get font() {
        return this.props.font;
    }

    set textAlign(val) {
        this.props.textAlign = val;
    }

    get textAlign() {
        return this.props.textAlign;
    }

    set textBaseline(val) {
        this.props.textBaseline = val;
    }

    get textBaseline() {
        return this.props.textBaseline;
    }
}

/**
 * Canvas with a single image.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasImage extends CanvasGraphics {

    constructor(parent, name, w, h = w) {
        super(w, h);
        let canvas = parent.initClass(Canvas, name, w, h);

        this.img = src => {
            this.drawImage(src, 0, 0, w, h);
            canvas.add(this);
            return this;
        };
    }
}

/**
 * Canvas font utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let CanvasFont = new ( // Singleton pattern

class CanvasFont {

    constructor() {

        function createText(canvas, width, height, str, font, fillStyle, letterSpacing, textAlign) {
            let context = canvas.context,
                graphics = canvas.initClass(CanvasGraphics, width, height);
            graphics.font = font;
            graphics.fillStyle = fillStyle;
            graphics.totalWidth = 0;
            graphics.totalHeight = height;
            let chr,
                characters = str.split(''),
                index = 0,
                currentPosition = 0;
            context.font = font;
            for (let i = 0; i < characters.length; i++) graphics.totalWidth += context.measureText(characters[i]).width + letterSpacing;
            switch (textAlign) {
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

        this.createText = (canvas, width, height, str, font, fillStyle, {letterSpacing = 0, lineHeight = height, textAlign = 'start'}) => {
            let context = canvas.context;
            if (height === lineHeight) {
                return createText(canvas, width, height, str, font, fillStyle, letterSpacing, textAlign);
            } else {
                let text = canvas.initClass(CanvasGraphics, width, height),
                    words = str.split(' '),
                    line = '',
                    lines = [];
                text.totalWidth = 0;
                text.totalHeight = 0;
                context.font = font;
                for (let n = 0; n < words.length; n++) {
                    let testLine = line + words[n] + ' ',
                        characters = testLine.split(''),
                        testWidth = 0;
                    for (let i = 0; i < characters.length; i++) testWidth += context.measureText(characters[i]).width + letterSpacing;
                    if (testWidth > width && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                lines.every((e, i) => {
                    let graphics = createText(canvas, width, lineHeight, e, font, fillStyle, letterSpacing, textAlign);
                    graphics.y = i * lineHeight;
                    text.add(graphics);
                    text.totalWidth = Math.max(graphics.totalWidth, text.totalWidth);
                    text.totalHeight += lineHeight;
                    return true;
                });
                return text;
            }
        };
    }
}

)(); // Singleton pattern

/**
 * Mouse helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Mouse = new ( // Singleton pattern

class Mouse {

    constructor() {
        this.x = 0;
        this.y = 0;

        let moved = e => {
            this.x = e.x;
            this.y = e.y;
        };

        this.capture = () => {
            this.x = 0;
            this.y = 0;
            if (!Device.mobile) {
                window.addEventListener('mousemove', moved);
            } else {
                window.addEventListener('touchmove', moved);
                window.addEventListener('touchstart', moved);
            }
        };

        this.stop = () => {
            this.x = 0;
            this.y = 0;
            if (!Device.mobile) {
                window.removeEventListener('mousemove', moved);
            } else {
                window.removeEventListener('touchmove', moved);
                window.removeEventListener('touchstart', moved);
            }
        };
    }
}

)(); // Singleton pattern

/**
 * XMLHttpRequest helper class with promise support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let XHR = new ( // Singleton pattern

class XHR {

    constructor() {
        this.headers = {};
        this.options = {};
        let serial = [];

        function serialize(key, data) {
            if (typeof data === 'object') {
                for (let i in data) {
                    let newKey = key + '[' + i + ']';
                    if (typeof data[i] === 'object') serialize(newKey, data[i]);
                    else serial.push(newKey + '=' + data[i]);
                }
            } else {
                serial.push(key + '=' + data);
            }
        }

        this.get = (url, data, callback, type) => {
            if (typeof data === 'function') {
                type = callback;
                callback = data;
                data = null;
            } else if (typeof data === 'object') {
                for (let key in data) serialize(key, data[key]);
                data = serial.join('&');
                data = data.replace(/\[/g, '%5B');
                data = data.replace(/\]/g, '%5D');
                serial = null;
                url += '?' + data;
            }
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            if (type === 'arraybuffer') xhr.responseType = 'arraybuffer';
            if (type === 'blob') xhr.responseType = 'blob';
            if (type === 'text') xhr.overrideMimeType('text/plain');
            if (type === 'json') xhr.setRequestHeader('Accept', 'application/json');
            for (let key in this.headers) xhr.setRequestHeader(key, this.headers[key]);
            for (let key in this.options) xhr[key] = this.options[key];
            let promise = null;
            if (typeof Promise !== 'undefined') {
                promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
            }
            xhr.send();
            xhr.onreadystatechange = () => {
                if (callback) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        if (type === 'arraybuffer' || type === 'blob') callback(xhr.response);
                        else if (type === 'text') callback(xhr.responseText);
                        else callback(JSON.parse(xhr.responseText));
                    } else if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                        if (promise) promise.reject(xhr);
                        else callback(xhr);
                    }
                }
            };
            return promise || xhr;
        };

        this.post = (url, data, callback, type) => {
            if (typeof data === 'function') {
                type = callback;
                callback = data;
                data = null;
            } else if (typeof data === 'object') {
                if (type === 'json') {
                    data = JSON.stringify(data);
                } else {
                    for (let key in data) serialize(key, data[key]);
                    data = serial.join('&');
                    data = data.replace(/\[/g, '%5B');
                    data = data.replace(/\]/g, '%5D');
                    serial = null;
                }
            }
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            if (type === 'arraybuffer') xhr.responseType = 'arraybuffer';
            if (type === 'blob') xhr.responseType = 'blob';
            if (type === 'text') xhr.overrideMimeType('text/plain');
            if (type === 'json') xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Content-Type', type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded');
            for (let key in this.headers) xhr.setRequestHeader(key, this.headers[key]);
            for (let key in this.options) xhr[key] = this.options[key];
            let promise = null;
            if (typeof Promise !== 'undefined') {
                promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
            }
            xhr.send();
            xhr.onreadystatechange = () => {
                if (callback) {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        if (type === 'arraybuffer' || type === 'blob') callback(xhr.response);
                        else if (type === 'text') callback(xhr.responseText);
                        else callback(JSON.parse(xhr.responseText));
                    } else if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                        if (promise) promise.reject(xhr);
                        else callback(xhr);
                    }
                }
            };
            return promise || xhr;
        };
    }
}

)(); // Singleton pattern

/**
 * WebAudio helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

let WebAudio = new ( // Singleton pattern

class WebAudio {

    constructor() {
        let context,
            sounds = [];

        this.init = () => {
            context = new window.AudioContext();
            this.globalGain = context.createGain();
            this.globalGain.connect(context.destination);
        };

        this.createSound = (id, audioData, callback) => {
            let sound = {id};
            context.decodeAudioData(audioData, buffer => {
                sound.buffer = buffer;
                sound.audioGain = context.createGain();
                sound.audioGain.connect(this.globalGain);
                sound.complete = true;
                if (callback) callback();
            });
            sounds.push(sound);
        };

        this.getSound = id => {
            for (let i = 0; i < sounds.length; i++) if (sounds[i].id === id) return sounds[i];
            return null;
        };

        this.trigger = id => {
            if (!context) return;
            let sound = this.getSound(id),
                source = context.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(sound.audioGain);
            source.start(0);
        };

        this.mute = () => {
            if (!context) return;
            TweenManager.tween(this.globalGain.gain, {value:0}, 300, 'easeOutSine');
        };

        this.unmute = () => {
            if (!context) return;
            TweenManager.tween(this.globalGain.gain, {value:1}, 500, 'easeOutSine');
        };
    }
}

)(); // Singleton pattern

/**
 * Asset loader with promise method.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class AssetLoader {

    constructor(assets, callback) {
        if (Array.isArray(assets)) {
            assets = (() => {
                let keys = assets.map(path => {
                    return Utils.basename(path);
                });
                return keys.reduce((o, k, i) => {
                    o[k] = assets[i];
                    return o;
                }, {});
            })();
        }
        let self = this;
        this.events = new EventManager();
        this.CDN = Config.CDN || '';
        let total = Object.keys(assets).length,
            loaded = 0,
            percent = 0;

        for (let key in assets) loadAsset(key, this.CDN + assets[key]);

        function loadAsset(key, asset) {
            let name = asset.split('/');
            name = name[name.length - 1];
            let split = name.split('.'),
                ext = split[split.length - 1].split('?')[0];
            switch (ext) {
                case 'mp3':
                    if (!window.AudioContext) return assetLoaded();
                    XHR.get(asset, contents => {
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
            self.events.fire(Events.PROGRESS, {percent});
            if (loaded === total) {
                self.complete = true;
                self.events.fire(Events.COMPLETE);
                if (callback) callback();
            }
        }
    }
}

AssetLoader.loadAssets = (assets, callback) => {
    let promise = Promise.create();
    if (!callback) callback = promise.resolve;
    new AssetLoader(assets, callback);
    return promise;
};

/**
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let Stage = new ( // Singleton pattern

class Stage extends Interface {

    constructor() {
        super('Stage');
        let self = this;
        let last;

        initHTML();
        addListeners();
        resizeHandler();

        function initHTML() {
            self.css({overflow:'hidden'});
        }

        function addListeners() {
            window.addEventListener('focus', () => {
                if (last !== 'focus') {
                    last = 'focus';
                    window.events.fire(Events.BROWSER_FOCUS, {type:'focus'});
                }
            });
            window.addEventListener('blur', () => {
                if (last !== 'blur') {
                    last = 'blur';
                    window.events.fire(Events.BROWSER_FOCUS, {type:'blur'});
                }
            });
            window.addEventListener('keydown', () => window.events.fire(Events.KEYBOARD_DOWN));
            window.addEventListener('keyup', () => window.events.fire(Events.KEYBOARD_UP));
            window.addEventListener('keypress', () => window.events.fire(Events.KEYBOARD_PRESS));
            window.addEventListener('resize', () => window.events.fire(Events.RESIZE));
            self.events.subscribe(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            self.size();
            if (Device.mobile) self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
    }
}

)(); // Singleton pattern

/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class FontLoader {

    constructor(fonts, callback) {
        let self = this;
        this.events = new EventManager();
        let element;

        initFonts();
        finish();

        function initFonts() {
            if (!Array.isArray(fonts)) fonts = [fonts];
            element = Stage.create('FontLoader');
            for (let i = 0; i < fonts.length; i++) element.create('font').fontStyle(fonts[i], 12, '#000').text('LOAD').css({top:-999});
        }

        function finish() {
            Delayed(() => {
                element.destroy();
                self.complete = true;
                self.events.fire(Events.COMPLETE);
                if (callback) callback();
            }, 500);
        }
    }
}

FontLoader.loadFonts = (fonts, callback) => {
    let promise = Promise.create();
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
if (typeof Promise !== 'undefined') Promise.create = () => {
    let resolve,
        reject,
        promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

// Globals
window.getURL = (url, target = '_blank') => window.open(url, target);
window.Delayed = (callback, time = 0, params) => window.setTimeout(() => {
    if (callback) callback(params);
}, time);

if (!window.Global) window.Global = {};
if (!window.Config) window.Config = {};

exports.EventManager = EventManager;
exports.Interface = Interface;
exports.Canvas = Canvas;
exports.CanvasGraphics = CanvasGraphics;
exports.CanvasImage = CanvasImage;
exports.CanvasFont = CanvasFont;
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
exports.FontLoader = FontLoader;
exports.Images = Images;
exports.SVG = SVG;
exports.XHR = XHR;
exports.WebAudio = WebAudio;
exports.Stage = Stage;

Object.defineProperty(exports, '__esModule', { value: true });

})));

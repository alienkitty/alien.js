(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Alien = global.Alien || {})));
}(this, (function (exports) { 'use strict';

/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.Events) window.Events = {
    BROWSER_FOCUS: 'browser_focus',
    COMPLETE:      'complete',
    PROGRESS:      'progress',
    UPDATE:        'update',
    LOADED:        'loaded',
    ERROR:         'error',
    RESIZE:        'resize',
    HOVER:         'hover',
    CLICK:         'click'
};

class EventManager {

    constructor() {
        let events = [];

        this.add = (event, callback) => {
            events.push({event, callback});
        };

        this.remove = (eventString, callback) => {
            for (let i = events.length - 1; i > -1; i--) if (events[i].event === eventString && events[i].callback === callback) events.splice(i, 1);
        };

        this.fire = (eventString, object = {}) => {
            for (let i = 0; i < events.length; i++) if (events[i].event === eventString) events[i].callback(object);
        };
    }
}

if (!window.events) window.events = new EventManager();

/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

// Shim layer with setTimeout fallback
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (() => {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (callback => {
            Delayed(callback, 1000 / 60);
        });
    })();
}

class Render {

    constructor() {
        this.TIME = Date.now();
        this.TARGET_FPS = 60;
        let last,
            render = [],
            time = Date.now(),
            timeSinceRender = 0,
            rendering = false;

        let focus = e => {
            if (e.type === 'focus') last = Date.now();
        };

        let step = () => {
            let t = Date.now(),
                timeSinceLoad = t - time,
                diff = 0,
                fps = 60;
            if (last) {
                diff = t - last;
                fps = 1000 / diff;
            }
            last = t;
            this.FPS = fps;
            this.TIME = t;
            this.DELTA = diff;
            this.TSL = timeSinceLoad;
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
        };

        this.start = (callback, fps) => {
            if (this.TARGET_FPS < 60) fps = this.TARGET_FPS;
            if (typeof fps === 'number') callback.fps = fps;
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

/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
        this.system = {};
        this.system.retina = window.devicePixelRatio > 1;
    }

    detect(array) {
        if (typeof array === 'string') array = [array];
        for (let i = 0; i < array.length; i++) if (this.agent.indexOf(array[i]) > -1) return true;
        return false;
    }

    vendor(style) {
        return this.prefix.js + style;
    }
}

/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
            InOut: k => {
                if (k < 0.5) return this.Bounce.In(k * 2) * 0.5;
                return this.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        };
    }
}

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

        let updateTweens = t => {
            if (tweens.length) {
                for (let i = 0; i < tweens.length; i++) tweens[i].update(t);
            } else {
                rendering = false;
                Render.stop(updateTweens);
            }
        };

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
            TweenManager.clearCSSTween(object);
            object.cssTween = self;
            let transition = '';
            for (let i = 0; i < properties.length; i++) transition += (transition.length ? ', ' : '') + properties[i] + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
            Delayed(() => {
                object.element.style[Device.vendor('Transition')] = transition;
                object.css(props);
                object.transform(transform);
                Delayed(() => {
                    clear();
                    if (callback) callback();
                }, time + delay);
            }, 50);
        }

        function clear() {
            object.element.style[Device.vendor('Transition')] = '';
            object.cssTween = null;
        }

        this.stop = () => clear();
    }
}

/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Interface {

    constructor(name, node) {
        this.events = new EventManager();
        let stage = window.Alien && window.Alien.Stage ? window.Alien.Stage : document.body,
            element = node || document.createElement('div');
        if (name[0] === '.') element.className = name.substr(1);
        else element.id = name;
        element.style.position = 'absolute';
        stage.appendChild(element);
        this.element = element;
        this.name = name;
    }

    initClass(object, params) {
        let child = new object(params);
        if (child.element) this.element.appendChild(child.element);
        child.parent = this;
        return child;
    }

    create(name, node) {
        let child = new Interface(name, node);
        this.element.appendChild(child.element);
        child.parent = this;
        return child;
    }

    destroy() {
        if (this.loop) Render.stop(this.loop);
        this.element.parentNode.removeChild(this.element);
        return null;
    }

    empty() {
        this.element.innerHTML = '';
        return this;
    }

    text(text) {
        if (typeof text !== 'undefined') {
            this.element.textContent = text;
            return this;
        } else {
            return this.element.textContent;
        }
    }

    html(text) {
        if (typeof text !== 'undefined') {
            this.element.innerHTML = text;
            return this;
        } else {
            return this.element.innerHTML;
        }
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

    enablePointer(bool) {
        this.element.style.pointerEvents = bool ? 'auto' : 'none';
        return this;
    }

    fontStyle(fontFamily, fontSize, color, fontStyle) {
        this.css({fontFamily, fontSize, color, fontStyle});
        return this;
    }

    bg(src, x, y, repeat) {
        if (src.indexOf('.') === -1) this.element.style.backgroundColor = src;
        else this.element.style.backgroundImage = 'url(' + src + ')';
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
        if (attr && value) {
            if (value === '') this.element.removeAttribute(attr);
            else this.element.setAttribute(attr, value);
        } else if (attr) {
            return this.element.getAttribute(attr);
        }
        return this;
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
        this.element.addEventListener('click', e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
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

    hover(callback) {
        this.element.addEventListener('mouseover', e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'over';
            if (callback) callback(e);
        }, false);
        this.element.addEventListener('mouseout', e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'out';
            if (callback) callback(e);
        }, false);
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
        }).enablePointer(true).hover(overCallback).click(clickCallback);
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
            array.push(this.create('.t', document.createElement('span')).html(split[i]).css(style));
            if (by !== '' && i < split.length - 1) array.push(this.create('.t', document.createElement('span')).html(by).css(style));
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

    constructor(name, w, h) {
        super(name, document.createElement('canvas'));
        this.context = this.element.getContext('2d');
        let ratio = Device.system.retina ? 2 : 1;
        this.element.width = w * ratio;
        this.element.height = h * ratio;
        this.size(w, h);
        this.context.scale(ratio, ratio);
    }

    toDataURL(type, quality) {
        return this.element.toDataURL(type, quality);
    }

    getImageData(x = 0, y = 0, w = this.width, h = this.height) {
        this.imageData = this.context.getImageData(x, y, w, h);
        return this.imageData;
    }

    getPixel(x, y, dirty) {
        if (!this.imageData || dirty) this.getImageData(0, 0, this.width, this.height);
        let imgData = {},
            index = (x + y * this.width) * 4,
            pixels = this.imageData.data;
        imgData.r = pixels[index];
        imgData.g = pixels[index + 1];
        imgData.b = pixels[index + 2];
        imgData.a = pixels[index + 3];
        return imgData;
    }
}

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
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    timestamp() {
        return (Date.now() + this.doRandom(0, 99999)).toString();
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    constrain(num, min, max) {
        return Math.min(Math.max(num, Math.min(min, max)), Math.max(min, max));
    }

    convertRange(oldValue, oldMin, oldMax, newMin, newMax, constrain) {
        let oldRange = oldMax - oldMin;
        let newRange = newMax - newMin;
        let newValue = (oldValue - oldMin) * newRange / oldRange + newMin;
        return constrain ? this.constrain(newValue, newMin, newMax) : newValue;
    }

    cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    mergeObject(...objects) {
        let object = {};
        for (let obj of objects) for (let key in obj) object[key] = obj[key];
        return object;
    }

    queryString(key) {
        return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
    }
}

/**
 * Mouse helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
            window.addEventListener('mousemove', moved, false);
        };

        this.stop = () => {
            this.x = 0;
            this.y = 0;
            window.removeEventListener('mousemove', moved, false);
        };
    }
}

/**
 * Event based asset loader.
 *
 * Currently only images are supported.
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class AssetLoader {

    constructor(assets, callback) {
        let self = this;
        this.events = new EventManager();
        this.CDN = Config.CDN || '';
        let total = assets.length,
            loaded = 0,
            percent = 0;

        for (let i = 0; i < assets.length; i++) loadAsset(this.CDN + assets[i]);

        function loadAsset(asset) {
            let image = new Image();
            image.src = asset;
            image.onload = assetLoaded;
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

/**
 * XMLHttpRequest helper class with promise support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class XHR {

    constructor() {
        this.headers = {};
        this.options = {};
        let serial = [];

        let serialize = (key, data) => {
            if (typeof data === 'object') {
                for (let i in data) {
                    let newKey = key + '[' + i + ']';
                    if (typeof data[i] === 'object') serialize(newKey, data[i]);
                    else serial.push(newKey + '=' + data[i]);
                }
            } else {
                serial.push(key + '=' + data);
            }
        };

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
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = xhr.responseText;
                    if (type === 'text') {
                        if (callback) callback(data);
                    } else {
                        try {
                            if (callback) callback(JSON.parse(data));
                        } catch (e) {
                            throw e;
                        }
                    }
                }
                if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                    if (callback) {
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
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = xhr.responseText;
                    if (type === 'text') {
                        if (callback) callback(data);
                    } else {
                        try {
                            if (callback) callback(JSON.parse(data));
                        } catch (e) {
                            throw e;
                        }
                    }
                }
                if (xhr.status == 0 || xhr.status == 400 || xhr.status == 401 || xhr.status == 404 || xhr.status == 500) {
                    if (callback) {
                        if (promise) promise.reject(xhr);
                        else callback(xhr);
                    }
                }
            };
            return promise || xhr;
        };
    }
}

/**
 * Stage reference class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
            }, false);
            window.addEventListener('blur', () => {
                if (last !== 'blur') {
                    last = 'blur';
                    window.events.fire(Events.BROWSER_FOCUS, {type:'blur'});
                }
            }, false);
            window.addEventListener('resize', () => {
                window.events.fire(Events.RESIZE);
            }, false);
            window.events.add(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            self.size();
        }
    }
}

/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

// Polyfills
if (typeof Promise !== 'undefined' && !Promise.create) Promise.create = () => {
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
if (!window.getURL) window.getURL = (url, target = '_blank') => window.open(url, target);

if (!window.Delayed) window.Delayed = (callback, time = 0, params) => window.setTimeout(() => {
    callback && callback(params);
}, time);

if (!window.Global) window.Global = {};
if (!window.Config) window.Config = {};

// Illegal reassignment for instances
Function((() => {
    let instances = '';
    ['Render', 'Utils', 'Device', 'Mouse', 'TweenManager', 'Interpolation', 'XHR', 'Stage'].forEach(i => {
        instances += `try {${i} = new ${i}();} catch(e) {}`;
    });
    return instances;
})())();

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

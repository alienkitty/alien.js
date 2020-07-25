/**
 * @author pschroen / https://ufo.ai/
 */

import gsap from 'gsap';

// CSS units
gsap.config({
    units: {
        x: 'px',
        y: 'px',
        z: 'px',
        top: 'px',
        right: 'px',
        bottom: 'px',
        left: 'px',
        width: 'px',
        minWidth: 'px',
        maxWidth: 'px',
        height: 'px',
        minHeight: 'px',
        maxHeight: 'px',
        fontSize: 'px',
        lineHeight: 'px',
        letterSpacing: 'px',
        padding: 'px',
        paddingTop: 'px',
        paddingRight: 'px',
        paddingBottom: 'px',
        paddingLeft: 'px',
        margin: 'px',
        marginTop: 'px',
        marginRight: 'px',
        marginBottom: 'px',
        marginLeft: 'px',
        borderWidth: 'px',
        borderTopWidth: 'px',
        borderRightWidth: 'px',
        borderBottomWidth: 'px',
        borderLeftWidth: 'px',
        borderRadius: 'px',
        borderTopLeftRadius: 'px',
        borderTopRightRadius: 'px',
        borderBottomRightRadius: 'px',
        borderBottomLeftRadius: 'px',
        perspective: 'px'
    }
});

/**
 * Global requestAnimationFrame event loop.
 *
 * See the gsap.ticker documentation for usage examples.
 * https://greensock.com/docs/v3/GSAP/gsap.ticker
 *
 * @export
 * @returns {object}
 * @example
 * ticker.add(loop);
 */
export const ticker = gsap.ticker;

/**
 * Manually update the global timeline.
 *
 * See the gsap.updateRoot() documentation for usage examples.
 * https://greensock.com/docs/v3/GSAP/gsap.updateRoot()
 *
 * @export
 * @param {number} time Time in milliseconds.
 * @returns {void}
 * @example
 * gsap.ticker.remove(gsap.updateRoot);
 * updateRoot(time);
 */
export function updateRoot(time) {
    gsap.updateRoot(time * 0.001);
}

/**
 * Converts a common name for an easing function to the corresponding GSAP format.
 *
 * See the Eases documentation for parameter options.
 * https://greensock.com/docs/v3/Eases
 *
 * See the Easing Functions Cheat Sheet for examples by name.
 * https://easings.net/
 *
 * @export
 * @param {string} ease Ease string.
 * @param {object} props Ease properties.
 * @returns {string}
 * @example
 * console.log(getEase('easeOutCubic')); // power2.out
 * console.log(getEase('easeOutElastic', { spring: 1, damping: 0.3 })); // elastic.out(1, 0.3)
 * console.log(getEase('easeOutBack', { amount: 1.7 })); // back.out(1.7)
 */
export function getEase(ease, {
    spring: amplitude = 1,
    damping: period = 0.3,
    amount = 1.7
} = {}) {
    switch (ease) {
        case 'easeInQuad':
            return 'power1.in';
        case 'easeInCubic':
            return 'power2.in';
        case 'easeInQuart':
            return 'power3.in';
        case 'easeInQuint':
            return 'power4.in';
        case 'easeInSine':
            return 'sine.in';
        case 'easeInExpo':
            return 'expo.in';
        case 'easeInCirc':
            return 'circ.in';
        case 'easeInElastic':
            return `elastic.in(${amplitude}, ${period})`;
        case 'easeInBack':
            return `back.in(${amount})`;
        case 'easeInBounce':
            return 'bounce.in';
        case 'easeOutQuad':
            return 'power1.out';
        case 'easeOutCubic':
            return 'power2.out';
        case 'easeOutQuart':
            return 'power3.out';
        case 'easeOutQuint':
            return 'power4.out';
        case 'easeOutSine':
            return 'sine.out';
        case 'easeOutExpo':
            return 'expo.out';
        case 'easeOutCirc':
            return 'circ.out';
        case 'easeOutElastic':
            return `elastic.out(${amplitude}, ${period})`;
        case 'easeOutBack':
            return `back.out(${amount})`;
        case 'easeOutBounce':
            return 'bounce.out';
        case 'easeInOutQuad':
            return 'power1.inOut';
        case 'easeInOutCubic':
            return 'power2.inOut';
        case 'easeInOutQuart':
            return 'power3.inOut';
        case 'easeInOutQuint':
            return 'power4.inOut';
        case 'easeInOutSine':
            return 'sine.inOut';
        case 'easeInOutExpo':
            return 'expo.inOut';
        case 'easeInOutCirc':
            return 'circ.inOut';
        case 'easeInOutElastic':
            return `elastic.inOut(${amplitude}, ${period})`;
        case 'easeInOutBack':
            return `back.inOut(${amount})`;
        case 'easeInOutBounce':
            return 'bounce.inOut';
        case 'linear':
            return 'none';
        default:
            return ease;
    }
}

/**
 * Defers a function by the specified time.
 *
 * @export
 * @param {number} time Time to wait in milliseconds.
 * @param {function} callback Callback function.
 * @param {...any} [params] Callback parameters.
 * @returns {function}
 * @example
 * delayedCall(500, animateIn);
 * delayedCall(500, animateIn, delay);
 * delayedCall(500, () => animateIn(delay));
 * timeout = delayedCall(500, () => animateIn(delay));
 */
export function delayedCall(time, callback, ...params) {
    gsap.delayedCall(time * 0.001, callback, params);

    return callback;
}

/**
 * Defers by the specified time.
 *
 * @export
 * @param {number} [time=0] Time to wait in milliseconds.
 * @returns {Promise}
 * @example
 * await wait(250);
 */
export function wait(time = 0) {
    return new Promise(resolve => delayedCall(time, resolve));
}

/**
 * Defers to the next tick.
 *
 * @export
 * @param {function} [callback] Callback function.
 * @returns {Promise}
 * @example
 * defer(resize);
 * defer(() => resize());
 * await defer();
 */
export function defer(callback) {
    const promise = new Promise(resolve => delayedCall(0, resolve));

    if (callback) {
        promise.then(callback);
    }

    return promise;
}

/**
 * Immediately sets properties of the specified object.
 *
 * See the gsap.set() documentation for parameter options.
 * https://greensock.com/docs/v3/GSAP/gsap.set()
 *
 * @export
 * @param {object|object[]} object Target object (or array of objects).
 * @param {object} props Tween properties.
 * @returns {Tween}
 * @example
 * set(element, { opacity: 0 });
 */
export const set = gsap.set;

/**
 * Returns a setter for the specified object.
 *
 * See the gsap.quickSetter() documentation for parameter options.
 * https://greensock.com/docs/v3/GSAP/gsap.quickSetter()
 *
 * @export
 * @param {object|object[]} object Target object (or array of objects).
 * @param {string} prop Target property.
 * @param {string} [unit] CSS unit.
 * @returns {function}
 * @example
 * setter = quickSetter(element, 'x', 'px');
 * setter(20);
 */
export const quickSetter = gsap.quickSetter;

/**
 * Returns a getter or the specified property as a number.
 *
 * See the gsap.getProperty() documentation for parameter options.
 * https://greensock.com/docs/v3/GSAP/gsap.getProperty()
 *
 * @export
 * @param {object} object Target object.
 * @param {string} [prop] Target property.
 * @param {string} [unit] CSS unit.
 * @returns {any}
 * @example
 * getter = getProperty(element);
 * console.log(getter('x')); // 20
 * console.log(getProperty(element, 'x')); // 20
 * console.log(getProperty(element, 'x', 'px')); // 20px
 */
export const getProperty = gsap.getProperty;

/**
 * Tween that animates to the specified destination properties.
 *
 * See the gsap.to() documentation for parameter options.
 * https://greensock.com/docs/v3/GSAP/gsap.to()
 *
 * See the Easing Functions Cheat Sheet for examples by name.
 * https://easings.net/
 *
 * @export
 * @param {object|object[]} object Target object (or array of objects).
 * @param {object} props Tween properties.
 * @param {number} time Duration in milliseconds.
 * @param {string|function} ease Ease string or function.
 * @param {number} [delay=0] Time to wait in milliseconds.
 * @param {function} [complete] Callback function when the animation has completed.
 * @param {function} [update] Callback function every time the animation updates.
 * @returns {Promise}
 * @example
 * tween(data, { value: 0.3 }, 1000, 'linear');
 */
export function tween(object, props, time, ease, delay = 0, complete, update) {
    if (typeof delay !== 'number') {
        update = complete;
        complete = delay;
        delay = 0;
    }

    const promise = new Promise(resolve => {
        props.ease = typeof ease === 'function' ? ease : getEase(ease, props);

        delete props.spring;
        delete props.damping;
        delete props.amount;

        props.duration = time * 0.001;
        props.delay = delay * 0.001;
        props.onComplete = resolve;
        props.onUpdate = update;

        gsap.to(object, props);
    });

    if (complete) {
        promise.then(complete);
    }

    return promise;
}

/**
 * Immediately clears all delayedCalls and tweens of the specified object.
 *
 * See the gsap.killTweensOf() documentation for parameter options.
 * https://greensock.com/docs/v3/GSAP/gsap.killTweensOf()
 *
 * @export
 * @param {object|object[]} object Target object (or array of objects).
 * @param {object|string} [props] Tween properties.
 * @returns {void}
 * @example
 * delayedCall(500, animateIn);
 * clearTween(animateIn);
 * clearTween(timeout);
 * timeout = delayedCall(500, () => animateIn());
 * tween(data, { value: 0.3 }, 1000, 'linear');
 * clearTween(data);
 */
export const clearTween = gsap.killTweensOf;

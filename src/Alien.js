/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

export { EventManager } from './util/EventManager';
export { Interface } from './util/Interface';
export { Canvas } from './util/Canvas';
export { Render } from './util/Render';
export { DynamicObject } from './util/DynamicObject';
export { Utils } from './util/Utils';
export { Device } from './util/Device';
export { Mouse } from './util/Mouse';
export { TweenManager } from './tween/TweenManager';
export { Interpolation } from './tween/Interpolation';
export { MathTween } from './tween/MathTween';
export { SpringTween } from './tween/SpringTween';
export { AssetLoader } from './util/AssetLoader';
export { XHR } from './util/XHR';
export { Stage } from './view/Stage';

// Polyfills
if (typeof Promise !== 'undefined' && typeof Promise.create === 'undefined') Promise.create = () => {
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
if (typeof window.getURL === 'undefined') window.getURL = (url, target = '_blank') => window.open(url, target);

if (typeof window.Delayed === 'undefined') window.Delayed = (callback, time = 0, params) => window.setTimeout(() => {
    callback && callback(params);
}, time);

if (typeof window.Global === 'undefined') window.Global = {};
if (typeof window.Config === 'undefined') window.Config = {};

// Illegal reassignment for instances
Function((() => {
    let instances = '';
    ['Render', 'Utils', 'Device', 'Mouse', 'TweenManager', 'Interpolation', 'XHR', 'Stage'].forEach(i => {
        instances += `try {${i} = new ${i}();} catch(e) {}`;
    });
    return instances;
})())();

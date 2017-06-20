/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

// Core
export { EventManager } from './util/EventManager';
export { Interface } from './util/Interface';
export { Canvas } from './canvas/Canvas';
export { CanvasGraphics } from './canvas/CanvasGraphics';
export { CanvasImage } from './canvas/CanvasImage';
export { Color } from './util/Color';
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
export { FontLoader } from './util/FontLoader';
export { Images } from './util/Images';
export { SVG } from './util/SVG';
export { XHR } from './util/XHR';
export { WebAudio } from './util/WebAudio';
export { Stage } from './view/Stage';

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

// Illegal reassignment for instances
Function((() => {
    let instances = '';
    ['Render', 'Utils', 'Device', 'Mouse', 'TweenManager', 'Interpolation', 'Images', 'SVG', 'XHR', 'WebAudio', 'Stage'].forEach(i => {
        instances += `try {${i} = new ${i}();} catch(e) {}`;
    });
    return instances;
})())();

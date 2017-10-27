/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

export { EventManager } from './util/EventManager';
export { Interface } from './util/Interface';
export { Canvas } from './canvas/Canvas';
export { CanvasGraphics } from './canvas/CanvasGraphics';
export { CanvasFont } from './canvas/CanvasFont';
export { Render } from './util/Render';
export { Utils3D } from './three/Utils3D';
export { ScreenProjection } from './three/ScreenProjection';
export { ObjectPool } from './util/ObjectPool';
export { DynamicObject } from './util/DynamicObject';
export { Vector2 } from './util/Vector2';
export { Vector3 } from './util/Vector3';
export { Utils } from './util/Utils';
export { Device } from './util/Device';
export { Mouse } from './util/Mouse';
export { Accelerometer } from './mobile/Accelerometer';
export { TweenManager } from './tween/TweenManager';
export { Interpolation } from './tween/Interpolation';
export { MathTween } from './tween/MathTween';
export { SpringTween } from './tween/SpringTween';
export { AssetLoader } from './util/AssetLoader';
export { FontLoader } from './util/FontLoader';
export { Images } from './util/Images';
export { SVG } from './svg/SVG';
export { SVGSymbol } from './svg/SVGSymbol';
export { XHR } from './util/XHR';
export { Storage } from './util/Storage';
export { WebAudio } from './util/WebAudio';
export { Stage } from './view/Stage';

import './polyfills.js';

window.getURL = (url, target = '_blank') => window.open(url, target);
window.Delayed = (callback, time = 0, params) => window.setTimeout(() => {
    if (callback) callback(params);
}, time);

if (!window.Global) window.Global = {};
if (!window.Config) window.Config = {};

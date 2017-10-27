/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

import bundleutils from 'rollup-plugin-bundleutils';

const pad = bundleutils.pad;
const timestamp = bundleutils.timestamp;
const singletons = (values = []) => bundleutils.singletons(['Stage', 'CanvasFont', 'Render', 'Device', 'Mouse', 'Accelerometer', 'Utils', 'TweenManager', 'Interpolation', 'Images', 'SVGSymbol', 'XHR', 'Storage', 'WebAudio', 'Utils3D'].concat(values));
const unexport = bundleutils.unexport;
const babel = bundleutils.babel;
const uglify = bundleutils.uglify;

export { pad, timestamp, singletons, unexport, babel, uglify };

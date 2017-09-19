/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

import bundleutils from 'rollup-plugin-bundleutils';

const pad = bundleutils.pad;
const timestamp = bundleutils.timestamp;
const singletons = () => bundleutils.singletons(['Render', 'CanvasFont', 'Utils', 'Device', 'Mouse', 'Accelerometer', 'Storage', 'Images', 'SVGSymbol', 'TweenManager', 'Interpolation', 'WebAudio', 'XHR', 'Stage']);
const unexport = bundleutils.unexport;
const babel = bundleutils.babel;
const uglify = bundleutils.uglify;

export { pad, timestamp, singletons, unexport, babel, uglify };

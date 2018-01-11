/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

import bundleutils from 'rollup-plugin-bundleutils';

const pad = bundleutils.pad;
const timestamp = bundleutils.timestamp;
const singletons = (values = []) => bundleutils.singletons([
    'Render',
    'Stage',
    'CanvasFont',
    'Device',
    'Mouse',
    'Accelerometer',
    'Utils',
    'Assets',
    'Storage',
    'WebAudio',
    'TweenManager',
    'Interpolation',
    'Utils3D'
].concat(values));
const unexport = bundleutils.unexport;
const babel = bundleutils.babel;
const uglify = bundleutils.uglify;

export { pad, timestamp, singletons, unexport, babel, uglify };

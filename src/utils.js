/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

import bundleutils from 'rollup-plugin-bundleutils';

const pad = bundleutils.pad;
const timestamp = bundleutils.timestamp;
const singletons = (values = []) => bundleutils.singletons([
    'Utils',
    'Render',
    'Timer',
    'Device',
    'Accelerometer',
    'Mouse',
    'Assets',
    'Storage',
    'WebAudio',
    'TweenManager',
    'Interpolation',
    'CanvasFont',
    'Utils3D',
    'Stage'
].concat(values));
const unexport = bundleutils.unexport;
const babel = bundleutils.babel;
const uglify = bundleutils.uglify;

export { pad, timestamp, singletons, unexport, babel, uglify };

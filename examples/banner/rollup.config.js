import { timestamp, singletons, babel, uglify } from './alien.js/src/utils.js';

import glslify from 'rollup-plugin-glslify';
import eslint from 'rollup-plugin-eslint';

import path from 'path';
import replace from 'replace';

let pkg = require('./alien.js/package.json'),
    project = path.basename(__dirname);

replace({
    regex: `"assets/.*\.js.*"`,
    replacement: `"assets/${project}.js?v=${Date.now()}"`,
    paths: ['dist/index.html'],
    recursive: false,
    silent: true
});

export default {
    input: 'src/Main.js',
    output: {
        file: `dist/assets/${project}.js`,
        format: 'es'
    },
    plugins: [
        singletons(),
        glslify({ basedir: 'src/shaders' }),
        eslint(),
        babel(),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]}.${project} ${timestamp()}\n//  /_|///_'/ /`
            }
        })
    ]
};

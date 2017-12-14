import { timestamp, singletons, babel, uglify } from './alien.js/src/utils.js';

import glslify from 'rollup-plugin-glslify';
import eslint from 'rollup-plugin-eslint';

import path from 'path';
import replace from 'replace';

let pkg = require('./alien.js/package.json'),
    project = path.basename(__dirname);

replace({
    regex: `Project: '.*'`,
    replacement: `Project: '${project}'`,
    paths: ['dist/index.html'],
    recursive: false,
    silent: true
});

replace({
    regex: `Build: '.*'`,
    replacement: `Build: '${Date.now()}'`,
    paths: ['dist/index.html'],
    recursive: false,
    silent: true
});

export default {
    input: 'src/Main.js',
    output: {
        file: `dist/assets/js/${project}.js`,
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

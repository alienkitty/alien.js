import singletons from './alien.js/src/singletons.js';
import { timestamp, babel } from './alien.js/src/utils.js';

import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

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
        eslint(),
        babel(),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]}.${project} ${timestamp()}\n//  /_|///_'/ /`
            }
        })
    ]
};

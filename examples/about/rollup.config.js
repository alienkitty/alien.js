import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js-harmony';

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

function timestamp() {
    let now = new Date(),
        hours = now.getHours(),
        minutes = now.getMinutes(),
        ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${now.toISOString(now.getTimezoneOffset()).slice(0, 10)} ${hours}:${minutes}${ampm}`;
}

export default {
    entry: 'src/Main.js',
    dest: `dist/assets/js/${project}.js`,
    format: 'es',
    plugins: [
        eslint(),
        babel(),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]}.${project} ${timestamp()}\n//  /_|///_'/ /`
            }
        }, minify)
    ]
};

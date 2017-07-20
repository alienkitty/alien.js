import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

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

function timestamp() {

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    let now = new Date(),
        hours = now.getHours(),
        minutes = now.getMinutes(),
        ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${hours}:${pad(minutes)}${ampm}`;
}

export default {
    entry: 'src/Main.js',
    dest: `dist/assets/${project}.js`,
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

import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

let pkg = require('./package.json');

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

function unexport() {
    return {
        transformBundle: code => {
            return {
                code: code.replace(/\n{2,}export.*$/g, ''),
                map: { mappings: '' }
            };
        }
    };
}

export default {
    entry: 'src/Alien.js',
    plugins: [
        unexport(),
        process.env.babel ? babel() : {},
        process.env.uglify ? uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            }
        }, minify) : {}
    ],
    targets: [{
        format: 'umd',
        moduleName: 'Alien',
        dest: process.env.babel ? process.env.uglify ? 'build/es5-alien.module.min.js' : 'build/es5-alien.module.js' : process.env.uglify ? 'build/alien.module.min.js' : 'build/alien.module.js'
    }, {
        format: 'es',
        dest: process.env.babel ? process.env.uglify ? 'build/es5-alien.min.js' : 'build/es5-alien.js' : process.env.uglify ? 'build/alien.min.js' : 'build/alien.js'
    }]
};

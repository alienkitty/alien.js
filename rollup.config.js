import path from 'path';
import { timestamp, singletons, unexport, babel, uglify } from './src/utils.js';

let pkg = require('./package.json');

function getBuildOutput(format, { babel, uglify, nosingleton } = {}) {
    const formatSuffix = format === 'umd' ? 'module' : '';
    const ext = 'js';
    let output = ['alien', formatSuffix].filter(Boolean).join('.');
    if (nosingleton) {
        output = 'nosingleton-' + output;
    }
    if (babel) {
        output = 'es5-' + output;
    }
    if (uglify) {
        output = output + '.min';
    }
    return path.join('build', output + '.js');
}

export default {
    input: 'src/Alien.js',
    output: [
        {
            name: 'Alien',
            file: getBuildOutput('umd', process.env),
            format: 'umd'
        },
        {
            file: getBuildOutput('es', process.env),
            format: 'es'
        }
    ],
    plugins: [
        process.env.nosingleton ? {} : singletons(),
        unexport(),
        process.env.babel ? babel() : {},
        process.env.uglify
            ? uglify({
                output: {
                    preamble: `//   _  /._  _  r${
                        pkg.version.split('.')[1]
                    } ${timestamp()}\n//  /_|///_'/ /`
                }
            })
            : {}
    ]
};

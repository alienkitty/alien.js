import { timestamp, singletons, unexport, babel, uglify } from './src/utils.js';

let pkg = require('./package.json');

export default {
    input: 'src/Alien.js',
    output: [{
        name: 'Alien',
        file: process.env.babel ? process.env.uglify ? 'build/es5-alien.module.min.js' : 'build/es5-alien.module.js' : process.env.uglify ? 'build/alien.module.min.js' : 'build/alien.module.js',
        format: 'umd'
    }, {
        file: process.env.babel ? process.env.uglify ? 'build/es5-alien.min.js' : 'build/es5-alien.js' : process.env.uglify ? 'build/alien.min.js' : 'build/alien.js',
        format: 'es'
    }],
    plugins: [
        singletons(),
        unexport(),
        process.env.babel ? babel() : {},
        process.env.uglify ? uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            }
        }) : {}
    ]
};

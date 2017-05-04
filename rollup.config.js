import babel from 'rollup-plugin-babel';

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
        process.env.babel ? babel() : {}
    ],
    targets: [{
        format: 'umd',
        moduleName: 'Alien',
        dest: process.env.babel ? 'build/es5-alien.module.js' : 'build/alien.module.js'
    }, {
        format: 'es',
        dest: process.env.babel ? 'build/es5-alien.js' : 'build/alien.js'
    }]
};

import { singletons, babel } from './alien.js/src/utils.js';

import glslify from 'rollup-plugin-glslify';
import eslint from 'rollup-plugin-eslint';

export default {
    input: 'src/Main.js',
    output: {
        file: 'build/project.js',
        format: 'umd',
        name: 'Project'
    },
    plugins: [
        singletons(),
        glslify({ basedir: 'src/shaders' }),
        eslint(),
        babel()
    ]
};

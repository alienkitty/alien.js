import { singletons, babel } from './alien.js/src/utils.js';

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
        eslint(),
        babel()
    ]
};

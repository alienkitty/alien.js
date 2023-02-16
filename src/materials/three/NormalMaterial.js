import { RawShaderMaterial } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/NormalShader.js';

export class NormalMaterial extends RawShaderMaterial {
    constructor() {
        super({
            vertexShader,
            fragmentShader
        });
    }
}

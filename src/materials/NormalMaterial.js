import { RawShaderMaterial } from 'three';

import vertexShader from '../shaders/NormalMaterial.vert.js';
import fragmentShader from '../shaders/NormalMaterial.frag.js';

export class NormalMaterial extends RawShaderMaterial {
    constructor() {
        super({
            vertexShader,
            fragmentShader
        });
    }
}

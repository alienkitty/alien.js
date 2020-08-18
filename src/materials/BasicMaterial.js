import { RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/BasicMaterial.vert.js';
import fragmentShader from '../shaders/BasicMaterial.frag.js';

export class BasicMaterial extends RawShaderMaterial {
    constructor(texture) {
        super({
            uniforms: {
                tMap: new Uniform(texture),
                uAlpha: new Uniform(1)
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}

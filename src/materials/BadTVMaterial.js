import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/BadTVPass.vert.js';
import fragmentShader from '../shaders/BadTVPass.frag.js';

export class BadTVMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                uDistortion: new Uniform(3),
                uDistortion2: new Uniform(5),
                uSpeed: new Uniform(0.2),
                uRollSpeed: new Uniform(0.1),
                uTime: new Uniform(0)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/BloomCompositePass.vert.js';
import fragmentShader from '../shaders/BloomCompositePass.frag.js';

export class BloomCompositeMaterial extends RawShaderMaterial {
    constructor(nMips) {
        super({
            glslVersion: GLSL3,
            defines: {
                NUM_MIPS: nMips
            },
            uniforms: {
                tBlur1: new Uniform(null),
                tBlur2: new Uniform(null),
                tBlur3: new Uniform(null),
                tBlur4: new Uniform(null),
                tBlur5: new Uniform(null),
                uBloomFactors: new Uniform(null)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

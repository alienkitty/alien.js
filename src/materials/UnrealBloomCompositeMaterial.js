import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/UnrealBloomCompositePass.vert.js';
import fragmentShader from '../shaders/UnrealBloomCompositePass.frag.js';

export class UnrealBloomCompositeMaterial extends RawShaderMaterial {
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
                uBloomStrength: new Uniform(1),
                uBloomRadius: new Uniform(0),
                uBloomFactors: new Uniform(null),
                uBloomTintColors: new Uniform(null)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

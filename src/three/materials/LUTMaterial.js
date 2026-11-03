import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/LUTShader.js';

/**
 * A color grading via lookup tables pass material.
 */
export class LUTMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                tLut: { value: null },
                uLutSize: { value: 0 },
                uIntensity: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}

import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/ChromaticAberrationShader.js';

/**
 * A chromatic aberration pass material with RGB offset parameters.
 */
export class ChromaticAberrationMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uRedOffset: { value: -4 },
                uGreenOffset: { value: 1.5 },
                uBlueOffset: { value: 0 },
                uIntensity: { value: 1.5 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}

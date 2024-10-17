import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/TiltShiftShader.js';

/**
 * A separable Gaussian blur pass material for a simple fake tilt-shift effect.
 */
export class TiltShiftMaterial extends RawShaderMaterial {
    constructor(direction = new Vector2(0.5, 0.5)) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uFocus: { value: 0.5 },
                uBlurAmount: { value: 1 },
                uDirection: { value: direction },
                uResolution: { value: new Vector2() }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}

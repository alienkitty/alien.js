import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/DatamoshShader.js';

/**
 * A data moshing pass material with damping parameter.
 */
export class DatamoshMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tOld: { value: null },
                tNew: { value: null },
                tVelocity: { value: null },
                uDamping: { value: 0.96 },
                uResolution: { value: new Vector2() },
                uTime: { value: 0 },
                uFrame: { value: 0 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}

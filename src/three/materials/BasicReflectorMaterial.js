import { GLSL3, Matrix4, NoBlending, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/BasicReflectorShader.js';

/**
 * A basic reflection material.
 */
export class BasicReflectorMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tReflect: { value: null },
                uMatrix: { value: new Matrix4() }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending
        });
    }
}

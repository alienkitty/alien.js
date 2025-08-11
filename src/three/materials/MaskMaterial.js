import { GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/MaskShader.js';

/**
 * An alpha mask pass material that uses the green channel of the mask texture.
 */
export class MaskMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                tMask: { value: null }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}

import { GLSL3, RawShaderMaterial } from 'three';

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

import { GLSL3, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/MaskShader.js';

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

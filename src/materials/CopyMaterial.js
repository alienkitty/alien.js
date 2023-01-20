import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/CopyPass.vert.js';
import fragmentShader from '../shaders/CopyPass.frag.js';

export class CopyMaterial extends RawShaderMaterial {
    constructor(map) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: map }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/SceneCompositePass.vert.js';
import fragmentShader from '../shaders/SceneCompositePass.frag.js';

export class SceneCompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tScene: { value: null },
                tBloom: { value: null }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

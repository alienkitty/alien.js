import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/SceneCompositePass.vert.js';
import fragmentShader from '../shaders/SceneCompositePass.frag.js';

export class SceneCompositeMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tScene: new Uniform(null),
                tBloom: new Uniform(null)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

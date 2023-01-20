import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/BokehBlurPass2.vert.js';
import fragmentShader from '../shaders/BokehBlurPass2.frag.js';

export class BokehBlurMaterial2 extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uScale: { value: 1 },
                uResolution: { value: new Vector2() }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

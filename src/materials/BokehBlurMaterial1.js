import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/BokehBlurPass1.vert.js';
import fragmentShader from '../shaders/BokehBlurPass1.frag.js';

export class BokehBlurMaterial1 extends RawShaderMaterial {
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

import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/ReflectorBlurPass.vert.js';
import fragmentShader from '../shaders/ReflectorBlurPass.frag.js';

export class ReflectorBlurMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uDirection: { value: new Vector2(1, 0) },
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

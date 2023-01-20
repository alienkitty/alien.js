import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/BlurPass.vert.js';
import fragmentShader from '../shaders/BlurPass.frag.js';

export class BlurMaterial extends RawShaderMaterial {
    constructor(direction = new Vector2(0.5, 0.5)) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uBluriness: { value: 1 },
                uDirection: { value: direction },
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

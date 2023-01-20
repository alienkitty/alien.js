import { GLSL3, NoBlending, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from '../shaders/TiltShiftPass.vert.js';
import fragmentShader from '../shaders/TiltShiftPass.frag.js';

export class TiltShiftMaterial extends RawShaderMaterial {
    constructor(direction = new Vector2(0.5, 0.5)) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uFocus: { value: 0.5 },
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

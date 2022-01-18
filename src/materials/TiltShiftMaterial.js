import { GLSL3, NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/TiltShiftPass.vert.js';
import fragmentShader from '../shaders/TiltShiftPass.frag.js';

export class TiltShiftMaterial extends RawShaderMaterial {
    constructor(direction = new Vector2(0.5, 0.5)) {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                uBluriness: new Uniform(1),
                uDirection: new Uniform(direction),
                uResolution: new Uniform(new Vector2())
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

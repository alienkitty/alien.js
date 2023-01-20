import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import vertexShader from '../shaders/ChromaticAberrationPass.vert.js';
import fragmentShader from '../shaders/ChromaticAberrationPass.frag.js';

export class ChromaticAberrationMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
                uRedOffset: { value: -4 },
                uGreenOffset: { value: 1.5 },
                uBlueOffset: { value: 0 },
                uIntensity: { value: 1.5 }
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

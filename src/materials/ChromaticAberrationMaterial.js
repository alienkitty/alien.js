import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/ChromaticAberrationPass.vert.js';
import fragmentShader from '../shaders/ChromaticAberrationPass.frag.js';

export class ChromaticAberrationMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                uRedOffset: new Uniform(-0.004),
                uGreenOffset: new Uniform(0.0015),
                uBlueOffset: new Uniform(0),
                uIntensity: new Uniform(1.5)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

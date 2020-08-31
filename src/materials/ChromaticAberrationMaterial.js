import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/ChromaticAberrationPass.vert.js';
import fragmentShader from '../shaders/ChromaticAberrationPass.frag.js';

export class ChromaticAberrationMaterial extends RawShaderMaterial {
    constructor() {
        super({
            uniforms: {
                tMap: new Uniform(null),
                uIntensity: new Uniform(1)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';

import vertexShader from '../shaders/FluidView.vert.js';
import fragmentShader from '../shaders/FluidView.frag.js';

export class FluidViewMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                uResolution: WorldController.resolution
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

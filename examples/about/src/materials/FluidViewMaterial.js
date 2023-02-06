import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';

import { vertexShader, fragmentShader } from '../shaders/FluidViewShader.js';

export class FluidViewMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: { value: null },
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

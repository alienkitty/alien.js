import { GLSL3, NoBlending, RawShaderMaterial } from 'three';

import { Global } from '../config/Global.js';
import { WorldController } from '../controllers/world/WorldController.js';

import { vertexShader, fragmentShader } from '../shaders/FluidPassShader.js';

export class FluidPassMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            defines: {
                NUM_POINTERS: Global.NUM_POINTERS,
                MAX_ITERATIONS: '5.0'
            },
            uniforms: {
                tMap: { value: null },
                uMouse: { value: [] },
                uLast: { value: [] },
                uVelocity: { value: [] },
                uStrength: { value: [] },
                uResolution: WorldController.resolution,
                uFrame: WorldController.frame
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false
        });
    }
}

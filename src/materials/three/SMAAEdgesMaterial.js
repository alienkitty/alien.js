import { GLSL3, NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/SMAAEdgesShader.js';

export class SMAAEdgesMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            defines: {
                SMAA_THRESHOLD: '0.1'
            },
            uniforms: {
                tMap: new Uniform(null),
                uTexelSize: new Uniform(new Vector2())
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}

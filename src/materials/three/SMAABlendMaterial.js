import { GLSL3, NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/SMAABlendShader.js';

export class SMAABlendMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                tWeightMap: new Uniform(null),
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

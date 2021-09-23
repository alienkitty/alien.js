import { GLSL3, Matrix4, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/ReflectorDudvMaterial.vert.js';
import fragmentShader from '../shaders/ReflectorDudvMaterial.frag.js';

export class ReflectorDudvMaterial extends RawShaderMaterial {
    constructor(map) {
        map.updateMatrix();

        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(map),
                tReflect: new Uniform(null),
                tReflectBlur: new Uniform(null),
                uMapTransform: new Uniform(map.matrix),
                uMatrix: new Uniform(new Matrix4())
            },
            vertexShader,
            fragmentShader
        });
    }
}

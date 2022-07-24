import { GLSL3, Matrix4, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/ReflectorDudvMaterial.vert.js';
import fragmentShader from '../shaders/ReflectorDudvMaterial.frag.js';

export class ReflectorDudvMaterial extends RawShaderMaterial {
    constructor({
        map = null,
        reflectivity = 0,
        dithering = false
    } = {}) {
        map.updateMatrix();

        super({
            glslVersion: GLSL3,
            defines: {
                DITHERING: dithering
            },
            uniforms: {
                tMap: new Uniform(map),
                tReflect: new Uniform(null),
                tReflectBlur: new Uniform(null),
                uMapTransform: new Uniform(map.matrix),
                uMatrix: new Uniform(new Matrix4()),
                uReflectivity: new Uniform(reflectivity)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending
        });
    }
}

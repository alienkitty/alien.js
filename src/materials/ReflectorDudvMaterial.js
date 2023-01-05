import { GLSL3, Matrix3, Matrix4, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/ReflectorDudvMaterial.vert.js';
import fragmentShader from '../shaders/ReflectorDudvMaterial.frag.js';

export class ReflectorDudvMaterial extends RawShaderMaterial {
    constructor({
        map = null,
        reflectivity = 0,
        dithering = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
                DITHERING: dithering
            },
            uniforms: {
                tMap: new Uniform(null),
                tReflect: new Uniform(null),
                tReflectBlur: new Uniform(null),
                uMapTransform: new Uniform(new Matrix3()),
                uMatrix: new Uniform(new Matrix4()),
                uReflectivity: new Uniform(reflectivity)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending
        };

        if (map) {
            map.updateMatrix();

            parameters.uniforms = Object.assign(parameters.uniforms, {
                tMap: new Uniform(map),
                uMapTransform: new Uniform(map.matrix)
            });
        }

        super(parameters);
    }
}

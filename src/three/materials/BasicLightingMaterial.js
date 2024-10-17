import { GLSL3, Matrix3, RawShaderMaterial, Vector3 } from 'three';

import { vertexShader, fragmentShader } from '../../shaders/BasicLightingShader.js';

/**
 * A basic texture map material with position-based lighting,
 * intensity and alpha parameters plus instancing support.
 */
export class BasicLightingMaterial extends RawShaderMaterial {
    constructor({
        map = null,
        lightPosition = new Vector3(1, 1, 1),
        lightIntensity = 0.25,
        instancing = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                tMap: { value: null },
                uMapTransform: { value: new Matrix3() },
                uLightPosition: { value: lightPosition },
                uLightIntensity: { value: lightIntensity },
                uAlpha: { value: 1 }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        };

        if (map) {
            map.updateMatrix();

            parameters.uniforms = Object.assign(parameters.uniforms, {
                tMap: { value: map },
                uMapTransform: { value: map.matrix }
            });
        }

        if (instancing) {
            parameters.defines = Object.assign(parameters.defines, {
                USE_INSTANCING: ''
            });
        }

        super(parameters);
    }
}

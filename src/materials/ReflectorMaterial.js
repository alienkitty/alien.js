import { Color, GLSL3, Matrix3, Matrix4, NoBlending, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/ReflectorMaterial.vert.js';
import fragmentShader from '../shaders/ReflectorMaterial.frag.js';

export class ReflectorMaterial extends RawShaderMaterial {
    constructor({
        color = new Color(0x101010),
        map = null,
        normalMap = null,
        normalScale = new Vector2(1, 1),
        reflectivity = 0,
        mirror = 0,
        mixStrength = 10,
        fog = null,
        dithering = false
    } = {}) {
        const parameters = {
            glslVersion: GLSL3,
            defines: {
            },
            uniforms: {
                tReflect: new Uniform(null),
                uMapTransform: new Uniform(new Matrix3()),
                uMatrix: new Uniform(new Matrix4()),
                uColor: new Uniform(color instanceof Color ? color : new Color(color)),
                uReflectivity: new Uniform(reflectivity),
                uMirror: new Uniform(mirror),
                uMixStrength: new Uniform(mixStrength)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending
        };

        if (map) {
            map.updateMatrix();

            parameters.defines = Object.assign(parameters.defines, {
                USE_MAP: ''
            });

            parameters.uniforms = Object.assign(parameters.uniforms, {
                tMap: new Uniform(map),
                uMapTransform: new Uniform(map.matrix)
            });
        }

        if (normalMap) {
            parameters.defines = Object.assign(parameters.defines, {
                USE_NORMALMAP: ''
            });

            parameters.uniforms = Object.assign(parameters.uniforms, {
                tNormalMap: new Uniform(normalMap),
                uNormalScale: new Uniform(normalScale)
            });

            if (!map) {
                normalMap.updateMatrix();

                parameters.uniforms = Object.assign(parameters.uniforms, {
                    uMapTransform: new Uniform(normalMap.matrix)
                });
            }
        }

        if (fog) {
            parameters.defines = Object.assign(parameters.defines, {
                USE_FOG: ''
            });

            parameters.uniforms = Object.assign(parameters.uniforms, {
                uFogColor: new Uniform(fog.color),
                uFogNear: new Uniform(fog.near),
                uFogFar: new Uniform(fog.far)
            });
        }

        if (dithering) {
            parameters.defines = Object.assign(parameters.defines, {
                DITHERING: ''
            });
        }

        super(parameters);
    }
}

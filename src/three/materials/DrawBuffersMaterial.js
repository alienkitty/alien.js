import { GLSL3, Matrix4, RawShaderMaterial } from 'three';

// eslint-disable-next-line sort-imports
import { vertexShader, fragmentShader } from '../../shaders/DrawBuffersShader.js';

/**
 * A draw buffers pass material with instancing support.
 */
export class DrawBuffersMaterial extends RawShaderMaterial {
    constructor({
        instancing = false
    } = {}) {
        super({
            glslVersion: GLSL3,
            defines: {
                USE_INSTANCING: instancing
            },
            uniforms: {
                uPrevModelViewMatrix: { value: new Matrix4() },
                uPrevProjectionMatrix: { value: new Matrix4() },
                uInterpolateGeometry: { value: 1 },
                uSmearIntensity: { value: 1 }
            },
            vertexShader,
            fragmentShader
        });
    }
}

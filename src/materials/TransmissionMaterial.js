import { Color, RawShaderMaterial, Uniform, Vector2 } from 'three';

import vertexShader from '../shaders/TransmissionMaterial.vert.js';
import fragmentShader from '../shaders/TransmissionMaterial.frag.js';

export class TransmissionMaterial extends RawShaderMaterial {
    constructor({
        fresnelColor,
        fresnelPower = 1.5
    } = {}) {
        super({
            uniforms: {
                tFront: new Uniform(null),
                tBack: new Uniform(null),
                uFresnelColor: new Uniform(fresnelColor instanceof Color ? fresnelColor : new Color(fresnelColor)),
                uFresnelPower: new Uniform(fresnelPower),
                uResolution: new Uniform(new Vector2())
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
    }
}

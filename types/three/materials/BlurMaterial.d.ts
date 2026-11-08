import { RawShaderMaterial, Vector2 } from 'three';

/**
 * A separable Gaussian blur pass material.
 */
export class BlurMaterial extends RawShaderMaterial {
    constructor(direction: Vector2);
}

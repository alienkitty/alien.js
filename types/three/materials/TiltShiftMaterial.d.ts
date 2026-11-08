import { RawShaderMaterial, Vector2 } from 'three';

/**
 * A separable Gaussian blur pass material for a simple fake tilt-shift effect.
 */
export class TiltShiftMaterial extends RawShaderMaterial {
    constructor(direction: Vector2);
}

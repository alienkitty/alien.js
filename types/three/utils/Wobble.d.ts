import { Vector3 } from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

/**
 * A class for applying Perlin noise to a position in 3D space,
 * with frequency, amplitude, scale, and linear interpolation parameters.
 *
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/Wobble.js | Source}
 */
export class Wobble {
    position: Vector3;

    origin: Vector3;
    target: Vector3;
    perlin: ImprovedNoise;
    frequency: Vector3;
    amplitude: Vector3;
    scale: number;
    lerpSpeed: number;

    constructor(position: Vector3);

    update(time: number): void;
}

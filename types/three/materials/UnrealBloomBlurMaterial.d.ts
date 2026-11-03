import { RawShaderMaterial } from 'three';

/**
 * A separable Gaussian blur pass material based on the bloom from Unreal Engine.
 */
export class UnrealBloomBlurMaterial extends RawShaderMaterial {
    constructor(kernelRadius: number, coefficients: number[]);
}

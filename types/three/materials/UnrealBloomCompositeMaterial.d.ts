import { RawShaderMaterial } from 'three';

/**
 * A bloom composite pass material based on the bloom from Unreal Engine.
 */
export class UnrealBloomCompositeMaterial extends RawShaderMaterial {
    constructor(nMips: number);
}

import { RawShaderMaterial } from 'three';

export interface BloomCompositeMaterialOptions {
    dithering: boolean;
}

/**
 * A bloom composite pass material based on the bloom from Unreal Engine.
 */
export class BloomCompositeMaterial extends RawShaderMaterial {
    constructor(options?: Partial<BloomCompositeMaterialOptions>);
}

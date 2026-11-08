import { RawShaderMaterial, TextureLoader, Vector2 } from 'three';

export interface PoissonDiscBlurMaterialOptions {
    blueNoisePath: string;
    blueNoiseResolution: Vector2;
}

/**
 * A Poisson-disc blur pass material.
 */
export class PoissonDiscBlurMaterial extends RawShaderMaterial {
    constructor(loader?: TextureLoader, options?: Partial<PoissonDiscBlurMaterialOptions>);
}

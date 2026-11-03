import { RawShaderMaterial, TextureLoader, Vector2 } from 'three';

export interface MotionBlurCompositeMaterialOptions {
    samples: number;
    blueNoisePath: string;
    blueNoiseResolution: Vector2;
}

/**
 * A per-object motion blur pass material with blue noise jitter.
 */
export class MotionBlurCompositeMaterial extends RawShaderMaterial {
    constructor(loader?: TextureLoader, options?: Partial<MotionBlurCompositeMaterialOptions>);
}

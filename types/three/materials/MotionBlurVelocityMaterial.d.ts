import { RawShaderMaterial } from 'three';

export interface MotionBlurVelocityMaterialOptions {
    cameraNear: number | null;
    cameraFar: number | null;
    instancing: boolean;
}

/**
 * A velocity pass material with instancing support.
 */
export class MotionBlurVelocityMaterial extends RawShaderMaterial {
    constructor(options?: Partial<MotionBlurVelocityMaterialOptions>);
}

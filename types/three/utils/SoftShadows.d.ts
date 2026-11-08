export interface SoftShadowsOptions {
    size: number;
    frustum: number;
    near: number;
    samples: number;
    rings: number;
}

/**
 * A three.js shader patch for PCSS (Percent Closer Soft-Shadows).
 *
 * @see {@link https://threejs.org/examples/#webgl_shadowmap_pcss | three.js - Percent Closer Soft-Shadows Example}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/SoftShadows.js | Source}
 */
export class SoftShadows {
    static init(options?: Partial<SoftShadowsOptions>): void;
}

import { Mesh, OrthographicCamera, RawShaderMaterial, WebGLRenderTarget } from 'three';

import type { BufferGeometry, Texture, WebGLRenderer } from 'three';
import type { DoubleRenderTarget } from '@alienkitty/space.js/three';

export interface FluidSplat {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

export interface FluidOptions {
    simRes: number;
    dyeRes: number;
    iterations: number;
    densityDissipation: number;
    velocityDissipation: number;
    pressureDissipation: number;
    curlStrength: number;
    radius: number;
}

/**
 * A class for fluid distortion.
 *
 * @see {@link https://github.com/PavelDoGreat/WebGL-Fluid-Simulation | PavelDoGreat - WebGL Fluid Simulation}
 * @see {@link https://oframe.github.io/ogl/examples/?src=post-fluid-distortion.html | OGL - Post Fluid Distortion Example}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/Fluid.js | Source}
 */
export class Fluid {
    renderer: WebGLRenderer;
    simRes: number;
    dyeRes: number;
    iterations: number;
    densityDissipation: number;
    velocityDissipation: number;
    pressureDissipation: number;
    curlStrength: number;
    radius: number;

    splats: FluidSplat[];

    density: DoubleRenderTarget;
    velocity: DoubleRenderTarget;
    pressure: DoubleRenderTarget;
    divergence: WebGLRenderTarget;
    curl: WebGLRenderTarget;

    uniform: { value: Texture };

    clearMaterial: RawShaderMaterial;
    splatMaterial: RawShaderMaterial;
    advectionMaterial: RawShaderMaterial;
    divergenceMaterial: RawShaderMaterial;
    curlMaterial: RawShaderMaterial;
    vorticityMaterial: RawShaderMaterial;
    pressureMaterial: RawShaderMaterial;
    gradientSubtractMaterial: RawShaderMaterial;

    screenCamera: OrthographicCamera;
    screenTriangle: BufferGeometry;
    screen: Mesh;

    constructor(renderer: WebGLRenderer, options?: Partial<FluidOptions>);

    update(): void;

    destroy(): null;
}

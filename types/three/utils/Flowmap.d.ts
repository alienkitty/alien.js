import { Mesh, OrthographicCamera, RawShaderMaterial, Vector2 } from 'three';

import type { BufferGeometry, Texture, WebGLRenderer } from 'three';
import type { DoubleRenderTarget } from '@alienkitty/space.js/three';

export interface FlowmapOptions {
    size: number;
    falloff: number;
    alpha: number;
    dissipation: number;
}

/**
 * A class for a mouse flowmap.
 *
 * @see {@link https://oframe.github.io/ogl/examples/?src=mouse-flowmap.html | OGL - Mouse Flowmap Example}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/Flowmap.js | Source}
 */
export class Flowmap {
    renderer: WebGLRenderer;

    mouse: Vector2;
    velocity: Vector2;

    mask: DoubleRenderTarget;

    uniform: { value: Texture };

    material: RawShaderMaterial;

    screenCamera: OrthographicCamera;
    screenTriangle: BufferGeometry;
    screen: Mesh;

    constructor(renderer: WebGLRenderer, options?: Partial<FlowmapOptions>);

    update(): void;

    destroy(): null;
}

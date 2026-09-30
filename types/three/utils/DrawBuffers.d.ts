import { Matrix4, WebGLRenderTarget } from 'three';

import type { ColorRepresentation, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export interface DrawBuffersOptions {
    interpolateGeometry: number;
    smearIntensity: number;
    cameraBlur: boolean;
    cameraNear: number | null;
    cameraFar: number | null;
}

/**
 * A class for rendering world positions, depth, and velocities in
 * screen UV space to draw buffers with MRT (Multiple Render Targets).
 *
 * @see {@link https://threejs.org/examples/#webgl_multiple_rendertargets | three.js - Multiple RenderTargets Example}
 * @see {@link https://oframe.github.io/ogl/examples/?src=mrt.html | OGL - Multiple RenderTargets Example}
 * @see {@link https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass | gkjohnson - Per-Object Motion Blur Render Pass}
 * @see {@link https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement | gkjohnson - Shader Replacement}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/DrawBuffers.js | Source}
 */
export class DrawBuffers {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: PerspectiveCamera;
    channel: number;

    interpolateGeometry: number;
    smearIntensity: number;
    cameraBlur: boolean;
    cameraNear: number | null;
    cameraFar: number | null;

    prevProjectionMatrix: Matrix4;
    prevMatrixWorldInverse: Matrix4;

    initialized: boolean;
    enabled: boolean;
    saveState: boolean;

    clearColor: ColorRepresentation;
    currentClearColor: ColorRepresentation;

    renderTarget: WebGLRenderTarget;

    constructor(
        renderer: WebGLRenderer,
        scene: Scene,
        camera: PerspectiveCamera,
        channel: number,
        options?: Partial<DrawBuffersOptions>
    );

    setCamera(camera: PerspectiveCamera): void;

    setSize(width: number, height: number): void;

    update(renderTarget?: WebGLRenderTarget): void;

    setDrawBuffersMaterial: (object: Object3D) => void;

    restoreOriginalMaterial: (object: Object3D) => void;

    destroy(): null;
}

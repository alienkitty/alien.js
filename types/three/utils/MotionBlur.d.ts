import { Matrix4, WebGLRenderTarget } from 'three';

import type { ColorRepresentation, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export interface MotionBlurOptions {
    interpolateGeometry: number;
    smearIntensity: number;
    cameraBlur: boolean;
    cameraNear: number | null;
    cameraFar: number | null;
}

/**
 * A class for per-object motion blur.
 *
 * @see {@link https://github.com/gkjohnson/threejs-sandbox/tree/master/motionBlurPass | gkjohnson - Per-Object Motion Blur Render Pass}
 * @see {@link https://github.com/gkjohnson/threejs-sandbox/tree/master/shader-replacement | gkjohnson - Shader Replacement}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/MotionBlur.js | Source}
 */
export class MotionBlur {
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
        options?: Partial<MotionBlurOptions>
    );

    setCamera(camera: PerspectiveCamera): void;

    setSize(width: number, height: number): void;

    update(renderTarget?: WebGLRenderTarget): void;

    setVelocityMaterial: (object: Object3D) => void;

    restoreOriginalMaterial: (object: Object3D) => void;

    destroy(): null;
}

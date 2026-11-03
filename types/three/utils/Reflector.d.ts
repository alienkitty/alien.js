import {
    Group,
    Matrix4,
    Mesh,
    OrthographicCamera,
    PerspectiveCamera,
    Plane,
    Vector3,
    Vector4,
    WebGLRenderTarget
} from 'three';

import type { BufferGeometry, Scene, Texture, WebGLRenderer } from 'three';
import type { DoubleRenderTarget } from '@alienkitty/space.js/three';

import { ReflectorBlurMaterial } from '../materials/ReflectorBlurMaterial.js';

export interface ReflectorOptions {
    width: number;
    height: number;
    clipBias: number;
    blurIterations: number;
}

/**
 * A class for reflections.
 *
 * @see {@link https://threejs.org/examples/#webgl_mirror | three.js - Mirror Example}
 * @see {@link https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Reflector.js | three.js - Reflector Source}
 * @see {@link https://github.com/spite/codevember-2016 | spite - Codevember 2016 Experiments}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/Reflector.js | Source}
 */
export class Reflector extends Group {
    clipBias: number;
    blurIterations: number;

    reflectorPlane: Plane;
    normal: Vector3;
    reflectorWorldPosition: Vector3;
    cameraWorldPosition: Vector3;
    rotationMatrix: Matrix4;
    lookAtPosition: Vector3;
    clipPlane: Vector4;

    view: Vector3;
    target: Vector3;
    q: Vector4;

    textureMatrix: Matrix4;
    virtualCamera: PerspectiveCamera;

    textureMatrixUniform: { value: Matrix4 };

    renderTarget: WebGLRenderTarget;

    blur?: DoubleRenderTarget;

    blurMaterial?: ReflectorBlurMaterial;

    screenCamera?: OrthographicCamera;
    screenTriangle?: BufferGeometry;
    screen?: Mesh;

    renderTargetUniform: { value: Texture };

    constructor(options?: Partial<ReflectorOptions>);

    setSize(width: number, height: number): void;

    update(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera): void;

    destroy(): null;
}

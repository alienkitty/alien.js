import type { BufferGeometry, InstancedMesh, Mesh, Object3D, Quaternion, Vector3 } from 'three';

import type { OimoPhysicsBufferBody } from './OimoPhysicsBuffer';

export interface OimoPhysicsControllerShape {
    position: Vector3;
    quaternion: Quaternion;
    scale: Vector3;
    geometry: BufferGeometry;
}

export interface OimoPhysicsControllerBodyProps {
    name: string;
    density: number;
    friction: number;
    restitution: number;
    collisionMask: number;
    collisionGroup: number;
    gravityScale: number;
    linearVelocity: Vector3;
    angularVelocity: Vector3;
    linearDamping: number;
    angularDamping: number;
    autoSleep: boolean;
    kinematic: boolean;
    shapes: OimoPhysicsControllerShape[];
}

export type OimoPhysicsControllerObject = Mesh & Object3D;
export type OimoPhysicsControllerValue = OimoPhysicsBufferBody & OimoPhysicsBufferBody[];

/**
 * A controller class for using the {@link OimoPhysicsBuffer | OimoPhysicsBuffer}.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/libs/OimoPhysics/index.js | three.js - OimoPhysics Entry Point Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/physics/OimoPhysics.js | three.js - OimoPhysics Source}
 * @see {@link https://github.com/lo-th/phy | lo-th - PHY}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/oimophysics/OimoPhysicsController.js | Source}
 */
export class OimoPhysicsController {
    shapes: OimoPhysicsBufferBody[];
    objects: OimoPhysicsControllerObject[];
    map: WeakMap<OimoPhysicsControllerObject, OimoPhysicsControllerValue>;

    constructor();

    getObject(
        position: Vector3,
        quaternion: Quaternion,
        scale: Vector3,
        geometry: BufferGeometry,
        props: OimoPhysicsControllerBodyProps
    ): OimoPhysicsBufferBody;

    getObjectBody(object: OimoPhysicsControllerObject, index?: number): OimoPhysicsBufferBody;

    add(object: OimoPhysicsControllerObject, props: OimoPhysicsControllerBodyProps): OimoPhysicsBufferBody;

    get(object: OimoPhysicsControllerObject): OimoPhysicsBufferBody;

    handleObject(object: Object3D, props: OimoPhysicsControllerBodyProps): OimoPhysicsBufferBody;

    handleMesh(
        object: Mesh,
        geometry: BufferGeometry,
        props: OimoPhysicsControllerBodyProps
    ): OimoPhysicsBufferBody;

    handleInstancedMesh(
        object: InstancedMesh,
        geometry: BufferGeometry,
        props?: OimoPhysicsControllerBodyProps
    ): OimoPhysicsBufferBody[];

    step(array: Float32Array): void;
}

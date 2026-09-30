import { oimo } from 'oimophysics';

import type { BufferGeometry, InstancedMesh, Mesh, Quaternion, Vector3 } from 'three';

// Dynamics
export type Contact = oimo.dynamics.Contact;
export type World = oimo.dynamics.World;
export type RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType & {
    DYNAMIC: 0;
    STATIC: 1;
    KINEMATIC: 2;
};
export type RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
export type RigidBody = oimo.dynamics.rigidbody.RigidBody;
export type ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
export type Shape = oimo.dynamics.rigidbody.Shape;
export type SphericalJointConfig = oimo.dynamics.constraint.joint.SphericalJointConfig;
export type SphericalJoint = oimo.dynamics.constraint.joint.SphericalJoint;
export type RevoluteJointConfig = oimo.dynamics.constraint.joint.RevoluteJointConfig;
export type RevoluteJoint = oimo.dynamics.constraint.joint.RevoluteJoint;
export type CylindricalJointConfig = oimo.dynamics.constraint.joint.CylindricalJointConfig;
export type CylindricalJoint = oimo.dynamics.constraint.joint.CylindricalJoint;
export type PrismaticJointConfig = oimo.dynamics.constraint.joint.PrismaticJointConfig;
export type PrismaticJoint = oimo.dynamics.constraint.joint.PrismaticJoint;
export type UniversalJointConfig = oimo.dynamics.constraint.joint.UniversalJointConfig;
export type UniversalJoint = oimo.dynamics.constraint.joint.UniversalJoint;
export type RagdollJointConfig = oimo.dynamics.constraint.joint.RagdollJointConfig;
export type RagdollJoint = oimo.dynamics.constraint.joint.RagdollJoint;
export type GenericJointConfig = oimo.dynamics.constraint.joint.GenericJointConfig;
export type GenericJoint = oimo.dynamics.constraint.joint.GenericJoint;
export type JointConfig = oimo.dynamics.constraint.joint.JointConfig;
export type Joint = oimo.dynamics.constraint.joint.Joint;
export type SpringDamper = oimo.dynamics.constraint.joint.SpringDamper;
export type TranslationalLimitMotor = oimo.dynamics.constraint.joint.TranslationalLimitMotor;
export type RotationalLimitMotor = oimo.dynamics.constraint.joint.RotationalLimitMotor;

// Common
export type Vec3 = oimo.common.Vec3;
export type Quat = oimo.common.Quat;
export type Mat3 = oimo.common.Mat3;
export type Mat4 = oimo.common.Mat4;
export type MathUtil = oimo.common.MathUtil & {
    POSITIVE_INFINITY: 1e65536;
    NEGATIVE_INFINITY: -1e65536;
    PI: 3.14159265358979;
    TWO_PI: 6.28318530717958;
    HALF_PI: 1.570796326794895;
    TO_RADIANS: 0.017453292519943278;
    TO_DEGREES: 57.29577951308238;
};
export type Transform = oimo.common.Transform;
export type Setting = oimo.common.Setting;

// Collision
export type BroadPhaseType = oimo.collision.broadphase.BroadPhaseType & {
    BRUTE_FORCE: 1;
    BVH: 2;
};
export type BoxGeometry = oimo.collision.geometry.BoxGeometry;
export type SphereGeometry = oimo.collision.geometry.SphereGeometry;
export type ConeGeometry = oimo.collision.geometry.ConeGeometry;
export type CylinderGeometry = oimo.collision.geometry.CylinderGeometry;
export type CapsuleGeometry = oimo.collision.geometry.CapsuleGeometry;
export type ConvexHullGeometry = oimo.collision.geometry.ConvexHullGeometry;
export type Geometry = oimo.collision.geometry.Geometry;

// Callback
export type RayCastClosest = oimo.dynamics.callback.RayCastClosest;
export type ContactCallback = oimo.dynamics.callback.ContactCallback;

export interface OimoPhysicsShape {
    position: Vector3;
    quaternion: Quaternion;
    scale: Vector3;
    geometry: BufferGeometry;
}

export interface OimoPhysicsShapeProps {
    density: number;
    friction: number;
    restitution: number;
    collisionMask: number;
    collisionGroup: number;
}

export type OimoPhysicsBodyProps = OimoPhysicsShapeProps & {
    gravityScale: number;
    linearVelocity: Vector3;
    angularVelocity: Vector3;
    linearDamping: number;
    angularDamping: number;
    contactCallback: (body: RigidBody, contact: Contact) => void;
    autoSleep: boolean;
    kinematic: boolean;
    shapes: OimoPhysicsShape[];
}

export type OimoPhysicsObject = Mesh & JointConfig & RigidBodyConfig;
export type OimoPhysicsValue = Joint & RigidBody & RigidBody[];

export interface OimoPhysicsOptions {
    fps: number;
    timestep: number;
    broadphase: BroadPhaseType['BRUTE_FORCE'] | BroadPhaseType['BVH'];
    gravity: Vector3;
    velocityIterations: number;
    positionIterations: number;
}

/**
 * A class for using the OimoPhysics 3D physics engine.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/libs/OimoPhysics/index.js | three.js - OimoPhysics Entry Point Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/physics/OimoPhysics.js | three.js - OimoPhysics Source}
 * @see {@link https://github.com/lo-th/phy | lo-th - PHY}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/oimophysics/OimoPhysics.js | Source}
 */
export class OimoPhysics {
    timestep: number;

    world: World;

    objects: Mesh[];
    map: WeakMap<OimoPhysicsObject, OimoPhysicsValue>;

    constructor(options?: Partial<OimoPhysicsOptions>);

    getShape(
        position: Vector3,
        quaternion: Quaternion,
        scale: Vector3,
        geometry: BufferGeometry,
        props: OimoPhysicsShapeProps
    ): Shape;

    getBody(
        position: Vector3,
        quaternion: Quaternion,
        scale: Vector3,
        geometry: BufferGeometry,
        props: OimoPhysicsObject | OimoPhysicsBodyProps
    ): RigidBody;

    getObjectBody(object: OimoPhysicsObject, index?: number): RigidBody;

    add(object: OimoPhysicsObject, props: OimoPhysicsBodyProps): OimoPhysicsValue;

    get(object: OimoPhysicsObject): OimoPhysicsValue;

    remove(object: OimoPhysicsObject): void;

    handleJoint(object: JointConfig): Joint;

    handleBody(object: RigidBodyConfig): RigidBody;

    handleMesh(
        object: Mesh,
        geometry: BufferGeometry,
        props: OimoPhysicsBodyProps
    ): RigidBody;

    handleInstancedMesh(
        object: InstancedMesh,
        geometry: BufferGeometry,
        props?: OimoPhysicsBodyProps
    ): RigidBody[];

    getGravity(): Vector3;

    setGravity(gravity: Vector3): void;

    getPosition(object: OimoPhysicsObject, index?: number): Vector3;

    setPosition(object: OimoPhysicsObject, position: Vector3, index?: number): void;

    getOrientation(object: OimoPhysicsObject, index?: number): Quaternion;

    setOrientation(object: OimoPhysicsObject, orientation: Quaternion, index?: number): void;

    getGravityScale(object: OimoPhysicsObject, index?: number): number;

    setGravityScale(object: OimoPhysicsObject, gravityScale: number, index?: number): void;

    getLinearVelocity(object: OimoPhysicsObject, index?: number): Vector3;

    setLinearVelocity(object: OimoPhysicsObject, linearVelocity: Vector3, index?: number): void;

    getAngularVelocity(object: OimoPhysicsObject, index?: number): Vector3;

    setAngularVelocity(object: OimoPhysicsObject, angularVelocity: Vector3, index?: number): void;

    getLinearDamping(object: OimoPhysicsObject, index?: number): Vector3;

    setLinearDamping(object: OimoPhysicsObject, linearDamping: Vector3, index?: number): void;

    getAngularDamping(object: OimoPhysicsObject, index?: number): Vector3;

    setAngularDamping(object: OimoPhysicsObject, angularDamping: Vector3, index?: number): void;

    setContactCallback(
        object: OimoPhysicsObject,
        callback: (body: RigidBody, contact: Contact) => void,
        index?: number
    ): void;

    applyImpulse(object: OimoPhysicsObject, impulse: Vector3, positionInWorld: Vector3, index?: number): void;

    wakeUp(object: OimoPhysicsObject, index?: number): void;

    sleep(object: OimoPhysicsObject, index?: number): void;

    step(): void;
}

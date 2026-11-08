import { oimo } from 'oimophysics';

import type { Vector3 } from 'three';

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

export interface OimoPhysicsBufferJoint {
    type: 'joint';
    name: string;
    mode: 'spherical' | 'revolute' | 'cylindrical' | 'prismatic' | 'universal' | 'ragdoll' | 'generic';
    body1: string;
    body2: string;
    position1: [number, number, number];
    position2: [number, number, number];
    worldAnchor: [number, number, number];
    springDamper: [number, number]; // frequency, dampingRatio
}

export interface OimoPhysicsBufferShape {
    type: 'compound' | 'box' | 'sphere' | 'cone' | 'cylinder' | 'capsule' | 'convex';
    position: [number, number, number];
    quaternion: [number, number, number, number];
    size: [number, number, number];
    density: number;
    friction: number;
    restitution: number;
    collisionMask: number;
    collisionGroup: number;
}

export type OimoPhysicsBufferBody = OimoPhysicsBufferShape & {
    name: string;
    gravityScale: number;
    linearVelocity: [number, number, number];
    angularVelocity: [number, number, number];
    linearDamping: [number, number, number];
    angularDamping: [number, number, number];
    autoSleep: boolean;
    kinematic: boolean;
    shapes: OimoPhysicsBufferShape[];
};

export type OimoPhysicsBufferObject = OimoPhysicsBufferJoint & OimoPhysicsBufferShape & OimoPhysicsBufferBody;
export type OimoPhysicsBufferValue = Joint & RigidBody;

export interface OimoPhysicsBufferOptions {
    fps: number;
    timestep: number;
    broadphase: BroadPhaseType['BRUTE_FORCE'] | BroadPhaseType['BVH'];
    gravity: Vector3;
    velocityIterations: number;
    positionIterations: number;
}

/**
 * A class for using the OimoPhysics 3D physics engine with an array buffer.
 *
 * @see {@link https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/libs/OimoPhysics/index.js | three.js - OimoPhysics Entry Point Source}
 * @see {@link https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/physics/OimoPhysics.js | three.js - OimoPhysics Source}
 * @see {@link https://github.com/lo-th/phy | lo-th - PHY}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/oimophysics/OimoPhysicsBuffer.js | Source}
 */
export class OimoPhysicsBuffer {
    timestep: number;

    world: World;

    bodies: RigidBody[];
    map: Map<string, OimoPhysicsBufferValue>;
    array: Float32Array;

    constructor(options?: Partial<OimoPhysicsBufferOptions>);

    getShape(shape: OimoPhysicsBufferShape): Shape;

    add(object: OimoPhysicsBufferObject): OimoPhysicsBufferValue;

    get(name: string): OimoPhysicsBufferValue;

    remove(name: string): void;

    handleJoint(object: OimoPhysicsBufferJoint): Joint;

    handleBody(object: OimoPhysicsBufferBody): RigidBody;

    setGravity(gravity: [number, number, number]): void;

    setPosition(name: string, position: [number, number, number]): void;

    setOrientation(name: string, orientation: [number, number, number, number]): void;

    setGravityScale(name: string, gravityScale: number): void;

    setLinearVelocity(name: string, linearVelocity: [number, number, number]): void;

    setAngularVelocity(name: string, angularVelocity: [number, number, number]): void;

    setLinearDamping(name: string, linearDamping: [number, number, number]): void;

    setAngularDamping(name: string, angularDamping: [number, number, number]): void;

    setContactCallback(name: string, callback: (body: RigidBody, name: string, contact: Contact) => void): void;

    applyImpulse(name: string, impulse: [number, number, number], positionInWorld: [number, number, number]): void;

    wakeUp(name: string): void;

    sleep(name: string): void;

    step(): void;
}

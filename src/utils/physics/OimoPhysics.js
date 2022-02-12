/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on {@link module:three/examples/jsm/physics/OimoPhysics.js} by VBT-YTokan
 * Based on https://github.com/lo-th/phy
 */

import { Matrix4, Object3D } from 'three';

import { oimo } from 'oimophysics';

// Dynamics
export const World = oimo.dynamics.World;
export const RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
export const RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
export const RigidBody = oimo.dynamics.rigidbody.RigidBody;
export const ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
export const Shape = oimo.dynamics.rigidbody.Shape;
export const SphericalJointConfig = oimo.dynamics.constraint.joint.SphericalJointConfig;
export const SphericalJoint = oimo.dynamics.constraint.joint.SphericalJoint;
export const RevoluteJointConfig = oimo.dynamics.constraint.joint.RevoluteJointConfig;
export const RevoluteJoint = oimo.dynamics.constraint.joint.RevoluteJoint;
export const CylindricalJointConfig = oimo.dynamics.constraint.joint.CylindricalJointConfig;
export const CylindricalJoint = oimo.dynamics.constraint.joint.CylindricalJoint;
export const PrismaticJointConfig = oimo.dynamics.constraint.joint.PrismaticJointConfig;
export const PrismaticJoint = oimo.dynamics.constraint.joint.PrismaticJoint;
export const UniversalJointConfig = oimo.dynamics.constraint.joint.UniversalJointConfig;
export const UniversalJoint = oimo.dynamics.constraint.joint.UniversalJoint;
export const RagdollJointConfig = oimo.dynamics.constraint.joint.RagdollJointConfig;
export const RagdollJoint = oimo.dynamics.constraint.joint.RagdollJoint;
export const GenericJointConfig = oimo.dynamics.constraint.joint.GenericJointConfig;
export const GenericJoint = oimo.dynamics.constraint.joint.GenericJoint;
export const JointConfig = oimo.dynamics.constraint.joint.JointConfig;
export const Joint = oimo.dynamics.constraint.joint.Joint;
export const SpringDamper = oimo.dynamics.constraint.joint.SpringDamper;
export const TranslationalLimitMotor = oimo.dynamics.constraint.joint.TranslationalLimitMotor;
export const RotationalLimitMotor = oimo.dynamics.constraint.joint.RotationalLimitMotor;

// Common
export const Vec3 = oimo.common.Vec3;
export const Quat = oimo.common.Quat;
export const Mat3 = oimo.common.Mat3;
export const MathUtil = oimo.common.MathUtil;
export const Transform = oimo.common.Transform;
export const Setting = oimo.common.Setting;

// Collision
export const CapsuleGeometry = oimo.collision.geometry.CapsuleGeometry;
export const ConvexHullGeometry = oimo.collision.geometry.ConvexHullGeometry;
export const BoxGeometry = oimo.collision.geometry.BoxGeometry;
export const SphereGeometry = oimo.collision.geometry.SphereGeometry;
export const CylinderGeometry = oimo.collision.geometry.CylinderGeometry;
export const ConeGeometry = oimo.collision.geometry.ConeGeometry;
export const Geometry = oimo.collision.geometry.Geometry;

// Callback
export const RayCastClosest = oimo.dynamics.callback.RayCastClosest;
export const ContactCallback = oimo.dynamics.callback.ContactCallback;

export class OimoPhysics {
    constructor({
        fps = 60,
        timestep = 1 / fps,
        broadphase = 2,
        gravity = new Vec3(0, -9.81, 0),
        velocityIterations = 10,
        positionIterations = 5
    } = {}) {
        this.timestep = timestep;

        this.world = new World(broadphase, gravity);
        this.world.setNumVelocityIterations(velocityIterations);
        this.world.setNumPositionIterations(positionIterations);

        this.objects = [];
        this.map = new WeakMap();

        this.object = new Object3D();
        this.matrix = new Matrix4();
    }

    getBody(position, quaternion, scale, geometry, {
        density,
        friction,
        restitution,
        contactCallback,
        autoSleep,
        kinematic
    }) {
        const bodyConfig = new RigidBodyConfig();

        if (autoSleep !== undefined) {
            bodyConfig.autoSleep = autoSleep;
        }

        if (kinematic) {
            bodyConfig.type = RigidBodyType.KINEMATIC;
        } else if (density === 0) {
            bodyConfig.type = RigidBodyType.STATIC;
        } else {
            bodyConfig.type = RigidBodyType.DYNAMIC;
        }

        const body = new RigidBody(bodyConfig);

        const shapeConfig = new ShapeConfig();
        const parameters = geometry.parameters;

        if (geometry.type === 'BoxGeometry') {
            const sx = parameters.width !== undefined ? (parameters.width * scale.x) / 2 : 0.5;
            const sy = parameters.height !== undefined ? (parameters.height * scale.y) / 2 : 0.5;
            const sz = parameters.depth !== undefined ? (parameters.depth * scale.z) / 2 : 0.5;

            shapeConfig.geometry = new BoxGeometry(new Vec3(sx, sy, sz));
        } else if (geometry.type === 'SphereGeometry' || geometry.type === 'IcosahedronGeometry') {
            const radius = parameters.radius !== undefined ? parameters.radius * scale.x : 1;

            shapeConfig.geometry = new SphereGeometry(radius);
        }

        if (density !== undefined) {
            shapeConfig.density = density;
        }

        if (friction !== undefined) {
            shapeConfig.friction = friction;
        }

        if (restitution !== undefined) {
            shapeConfig.restitution = restitution;
        }

        if (contactCallback !== undefined) {
            shapeConfig.contactCallback = new ContactCallback();
            shapeConfig.contactCallback.preSolve = contact => contactCallback(body, contact);
        }

        body.addShape(new Shape(shapeConfig));
        body.setPosition(position);
        body.setOrientation(quaternion);

        return body;
    }

    add(object, props) {
        if (object.geometry) {
            if (object.isInstancedMesh) {
                return this.handleInstancedMesh(object, object.geometry, props);
            } else {
                return this.handleMesh(object, object.geometry, props);
            }
        } else if (object instanceof JointConfig) {
            return this.handleJoint(object);
        } else if (object instanceof RigidBodyConfig) {
            return this.handleBody(object);
        }
    }

    get(object) {
        return this.map.get(object);
    }

    remove(object) {
        const body = this.map.get(object);

        if (object instanceof JointConfig) {
            this.world.removeJoint(body);
        } else if (object instanceof RigidBody) {
            this.world.removeRigidBody(body);
        }

        this.map.delete(object);
    }

    handleJoint(object) {
        let Joint;

        if (object instanceof SphericalJointConfig) {
            Joint = SphericalJoint;
        } else if (object instanceof RevoluteJointConfig) {
            Joint = RevoluteJoint;
        } else if (object instanceof CylindricalJointConfig) {
            Joint = CylindricalJoint;
        } else if (object instanceof PrismaticJointConfig) {
            Joint = PrismaticJoint;
        } else if (object instanceof UniversalJointConfig) {
            Joint = UniversalJoint;
        } else if (object instanceof RagdollJointConfig) {
            Joint = RagdollJoint;
        } else if (object instanceof GenericJointConfig) {
            Joint = GenericJoint;
        }

        const joint = new Joint(object);
        this.world.addJoint(joint);

        this.map.set(object, joint);

        return joint;
    }

    handleBody(object) {
        const body = new RigidBody(object);
        this.world.addRigidBody(body);

        this.map.set(object, body);

        return body;
    }

    handleMesh(object, geometry, props) {
        if (object.parent && object.parent.isGroup) {
            object = object.parent;
        }

        if (props === undefined) {
            props = object;
        }

        const body = this.getBody(object.position, object.quaternion, object.scale, geometry, props);
        this.world.addRigidBody(body);

        if (props.density !== 0) {
            this.objects.push(object);
        }

        this.map.set(object, body);

        return body;
    }

    handleInstancedMesh(object, geometry, props = {}) {
        const bodies = [];

        for (let i = 0; i < object.count; i++) {
            object.getMatrixAt(i, this.matrix);
            this.matrix.decompose(this.object.position, this.object.quaternion, this.object.scale);

            const body = this.getBody(this.object.position, this.object.quaternion, this.object.scale, geometry, props);
            this.world.addRigidBody(body);

            bodies.push(body);
        }

        if (props.density !== 0) {
            this.objects.push(object);
        }

        this.map.set(object, bodies);

        return bodies;
    }

    setPosition(object, position, index = 0) {
        let body;

        if (object instanceof RigidBody) {
            body = object;
        } else if (object.isInstancedMesh) {
            body = this.map.get(object)[index];
        } else {
            body = this.map.get(object);
        }

        body.setPosition(position);
    }

    setContactCallback(object, callback, index = 0) {
        let body;

        if (object instanceof RigidBody) {
            body = object;
        } else if (object.isInstancedMesh) {
            body = this.map.get(object)[index];
        } else {
            body = this.map.get(object);
        }

        const contactCallback = new ContactCallback();
        contactCallback.preSolve = contact => callback(body, contact);

        let shape = body.getShapeList();

        while (shape) {
            shape.setContactCallback(contactCallback);
            shape = shape.getNext();
        }
    }

    step() {
        this.world.step(this.timestep);

        for (let i = 0, il = this.objects.length; i < il; i++) {
            const object = this.objects[i];

            if (object.isInstancedMesh) {
                const bodies = this.map.get(object);

                for (let j = 0, jl = bodies.length; j < jl; j++) {
                    const body = bodies[j];

                    this.object.position.copy(body.getPosition());
                    this.object.quaternion.copy(body.getOrientation());
                    this.object.updateMatrix();

                    object.setMatrixAt(j, this.object.matrix);
                }

                object.instanceMatrix.needsUpdate = true;
            } else {
                const body = this.map.get(object);

                object.position.copy(body.getPosition());
                object.quaternion.copy(body.getOrientation());
            }
        }
    }
}

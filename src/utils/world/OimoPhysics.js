/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on {@link module:three/examples/jsm/physics/OimoPhysics.js} by VBT-YTokan
 * Based on https://github.com/lo-th/phy
 */

import { oimo } from 'three/examples/jsm/libs/OimoPhysics/OimoPhysics.js';

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
    }

    getShape(geometry) {
        const parameters = geometry.parameters;

        if (geometry.type === 'BoxGeometry') {
            const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5;
            const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5;
            const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;

            return new BoxGeometry(new Vec3(sx, sy, sz));
        } else if (geometry.type === 'SphereGeometry' || geometry.type === 'IcosahedronGeometry') {
            const radius = parameters.radius !== undefined ? parameters.radius : 1;

            return new SphereGeometry(radius);
        }

        return null;
    }

    add(object, props) {
        const mesh = object;

        if (object.parent && object.parent.isGroup) {
            object = object.parent;
        }

        if (mesh.geometry) {
            const shape = this.getShape(mesh.geometry);

            if (mesh.isInstancedMesh) {
                this.handleInstancedMesh(mesh, shape, props);
            } else {
                this.handleMesh(object, shape, props);
            }
        } else if (object instanceof JointConfig) {
            this.handleJoint(object);
        } else {
            this.handleBody(object);
        }
    }

    get(object) {
        return this.map.get(object);
    }

    remove(object) {
        const body = this.map.get(object);

        if (object instanceof JointConfig) {
            this.world.removeJoint(body);
        } else {
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
    }

    handleBody(object) {
        const body = new RigidBody(object);
        this.world.addRigidBody(body);

        this.map.set(object, body);
    }

    handleMesh(object, shape, {
        density,
        friction,
        restitution,
        autoSleep,
        kinematic
    } = {}) {
        const position = object.position;

        const shapeConfig = new ShapeConfig();
        shapeConfig.geometry = shape;

        if (density !== undefined) {
            shapeConfig.density = density;
        }

        if (friction !== undefined) {
            shapeConfig.friction = friction;
        }

        if (restitution !== undefined) {
            shapeConfig.restitution = restitution;
        }

        const bodyConfig = new RigidBodyConfig();
        bodyConfig.position.copyFrom(position);

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
        body.addShape(new Shape(shapeConfig));
        this.world.addRigidBody(body);

        if (density !== 0) {
            this.objects.push(object);
        }

        this.map.set(object, body);
    }

    handleInstancedMesh(object, shape, {
        density,
        friction,
        restitution,
        autoSleep,
        kinematic
    } = {}) {
        const array = object.instanceMatrix.array;
        const bodies = [];

        for (let i = 0; i < object.count; i++) {
            const index = i * 16;
            const position = new Vec3(array[index + 12], array[index + 13], array[index + 14]);

            const shapeConfig = new ShapeConfig();
            shapeConfig.geometry = shape;

            if (density !== undefined) {
                shapeConfig.density = density;
            }

            if (friction !== undefined) {
                shapeConfig.friction = friction;
            }

            if (restitution !== undefined) {
                shapeConfig.restitution = restitution;
            }

            const bodyConfig = new RigidBodyConfig();
            bodyConfig.position.copyFrom(position);

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
            body.addShape(new Shape(shapeConfig));
            this.world.addRigidBody(body);

            bodies.push(body);
        }

        if (density !== 0) {
            this.objects.push(object);
        }

        this.map.set(object, bodies);
    }

    setPosition(object, position, index = 0) {
        const body = object.isInstancedMesh ? this.map.get(object)[index] : this.map.get(object);

        body.setPosition(position);
    }

    setContactCallback(object, callback, index = 0) {
        const contactCallback = new ContactCallback();
        contactCallback.preSolve = callback;

        const body = object.isInstancedMesh ? this.map.get(object)[index] : this.map.get(object);

        let shape = body.getShapeList();

        while (shape) {
            shape.setContactCallback(contactCallback);
            shape = shape._next;
        }
    }

    step() {
        this.world.step(this.timestep);

        for (let i = 0, il = this.objects.length; i < il; i++) {
            const object = this.objects[i];

            if (object.isInstancedMesh) {
                const array = object.instanceMatrix.array;
                const bodies = this.map.get(object);

                for (let j = 0, jl = bodies.length; j < jl; j++) {
                    const body = bodies[j];

                    this.compose(body.getPosition(), body.getOrientation(), array, j * 16);
                }

                object.instanceMatrix.needsUpdate = true;
            } else {
                const body = this.map.get(object);

                object.position.copy(body.getPosition());
                object.quaternion.copy(body.getOrientation());
            }
        }
    }

    compose(position, quaternion, array, index) {
        const x = quaternion.x;
        const y = quaternion.y;
        const z = quaternion.z;
        const w = quaternion.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        array[index + 0] = 1 - (yy + zz);
        array[index + 1] = xy + wz;
        array[index + 2] = xz - wy;
        array[index + 3] = 0;

        array[index + 4] = xy - wz;
        array[index + 5] = 1 - (xx + zz);
        array[index + 6] = yz + wx;
        array[index + 7] = 0;

        array[index + 8] = xz + wy;
        array[index + 9] = yz - wx;
        array[index + 10] = 1 - (xx + yy);
        array[index + 11] = 0;

        array[index + 12] = position.x;
        array[index + 13] = position.y;
        array[index + 14] = position.z;
        array[index + 15] = 1;
    }
}

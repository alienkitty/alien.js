/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/libs/OimoPhysics/index.js by VBT-YTokan
 * Based on https://github.com/mrdoob/three.js/blob/66c460eca3c025678ff2bc0aa423f4ba10e9571e/examples/jsm/physics/OimoPhysics.js by VBT-YTokan
 * Based on https://github.com/lo-th/phy
 */

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
export const Mat4 = oimo.common.Mat4;
export const MathUtil = oimo.common.MathUtil;
export const Transform = oimo.common.Transform;
export const Setting = oimo.common.Setting;

// Collision
export const BroadPhaseType = oimo.collision.broadphase.BroadPhaseType;
export const BoxGeometry = oimo.collision.geometry.BoxGeometry;
export const SphereGeometry = oimo.collision.geometry.SphereGeometry;
export const ConeGeometry = oimo.collision.geometry.ConeGeometry;
export const CylinderGeometry = oimo.collision.geometry.CylinderGeometry;
export const CapsuleGeometry = oimo.collision.geometry.CapsuleGeometry;
export const ConvexHullGeometry = oimo.collision.geometry.ConvexHullGeometry;
export const Geometry = oimo.collision.geometry.Geometry;

// Callback
export const RayCastClosest = oimo.dynamics.callback.RayCastClosest;
export const ContactCallback = oimo.dynamics.callback.ContactCallback;

// Defaults
Setting.defaultGJKMargin = 0.0001;

/**
 * A class for using the OimoPhysics 3D physics engine with an array buffer.
 */
export class OimoPhysicsBuffer {
    constructor({
        fps = 60,
        timestep = 1 / fps,
        broadphase = BroadPhaseType.BVH,
        gravity = new Vec3(0, -9.81, 0),
        velocityIterations = 8,
        positionIterations = 8
    } = {}) {
        this.timestep = timestep;

        this.world = new World(broadphase, gravity);
        this.world.setNumVelocityIterations(velocityIterations);
        this.world.setNumPositionIterations(positionIterations);

        this.bodies = [];
        this.map = new Map();
        this.array = new Float32Array();

        this.v1 = new Vec3();
        this.v2 = new Vec3();
        this.q = new Quat();
    }

    getShape({
        type,
        position,
        quaternion,
        size,
        density,
        friction,
        restitution,
        collisionMask,
        collisionGroup
    }) {
        const shapeConfig = new ShapeConfig();

        if (density !== undefined) {
            shapeConfig.density = density;
        }

        if (friction !== undefined) {
            shapeConfig.friction = friction;
        }

        if (restitution !== undefined) {
            shapeConfig.restitution = restitution;
        }

        if (collisionMask !== undefined) {
            shapeConfig.collisionMask = collisionMask;
        }

        if (collisionGroup !== undefined) {
            shapeConfig.collisionGroup = collisionGroup;
        }

        if (type === 'box') {
            shapeConfig.geometry = new BoxGeometry(new Vec3(size[0], size[1], size[2]));
        } else if (type === 'sphere') {
            shapeConfig.geometry = new SphereGeometry(size[0]);
        } else if (type === 'cone') {
            shapeConfig.geometry = new ConeGeometry(size[0], size[1]);
        } else if (type === 'cylinder') {
            shapeConfig.geometry = new CylinderGeometry(size[0], size[1]);
        } else if (type === 'capsule') {
            shapeConfig.geometry = new CapsuleGeometry(size[0], size[1]);
        } else if (type === 'convex') {
            const array = [];

            for (let i = 0, l = size.length; i < l; i += 3) {
                array.push(new Vec3(size[i], size[i + 1], size[i + 2]));
            }

            shapeConfig.geometry = new ConvexHullGeometry(array);
        }

        if (position !== undefined) {
            shapeConfig.position.copyFrom(new Vec3(position[0], position[1], position[2]));
        }

        if (quaternion !== undefined) {
            shapeConfig.rotation.fromQuat(new Quat(quaternion[0], quaternion[1], quaternion[2], quaternion[3]));
        }

        return new Shape(shapeConfig);
    }

    add(object) {
        if (object.type === 'joint') {
            return this.handleJoint(object);
        } else {
            return this.handleBody(object);
        }
    }

    get(name) {
        return this.map.get(name);
    }

    remove(name) {
        const object = this.map.get(name);

        if (object instanceof Joint) {
            this.world.removeJoint(object);
        } else if (object instanceof RigidBody) {
            this.world.removeRigidBody(object);
        }

        this.map.delete(name);
    }

    handleJoint({
        name,
        mode,
        body1,
        body2,
        position1,
        position2,
        worldAnchor,
        springDamper
    }) {
        let JointConfig;
        let Joint;

        if (mode === 'spherical') {
            JointConfig = SphericalJointConfig;
            Joint = SphericalJoint;
        } else if (mode === 'revolute') {
            JointConfig = RevoluteJointConfig;
            Joint = RevoluteJoint;
        } else if (mode === 'cylindrical') {
            JointConfig = CylindricalJointConfig;
            Joint = CylindricalJoint;
        } else if (mode === 'prismatic') {
            JointConfig = PrismaticJointConfig;
            Joint = PrismaticJoint;
        } else if (mode === 'universal') {
            JointConfig = UniversalJointConfig;
            Joint = UniversalJoint;
        } else if (mode === 'ragdoll') {
            JointConfig = RagdollJointConfig;
            Joint = RagdollJoint;
        } else if (mode === 'generic') {
            JointConfig = GenericJointConfig;
            Joint = GenericJoint;
        }

        const jointConfig = new JointConfig();
        jointConfig.rigidBody1 = this.map.get(body1);
        jointConfig.rigidBody2 = this.map.get(body2);

        if (worldAnchor) {
            const point = new Vec3(worldAnchor[0], worldAnchor[1], worldAnchor[2]);

            jointConfig.rigidBody1.getLocalPointTo(point, jointConfig.localAnchor1);
            jointConfig.rigidBody2.getLocalPointTo(point, jointConfig.localAnchor2);
        }

        if (position1) {
            jointConfig.localAnchor1.init(position1[0], position1[1], position1[2]);
        }

        if (position2) {
            jointConfig.localAnchor2.init(position2[0], position2[1], position2[2]);
        }

        if (springDamper) {
            jointConfig.springDamper.setSpring(springDamper[0], springDamper[1]); // frequency, dampingRatio
        }

        const joint = new Joint(jointConfig);
        this.world.addJoint(joint);

        this.map.set(name, joint);

        return joint;
    }

    handleBody({
        name,
        type,
        position,
        quaternion,
        size,
        density,
        friction,
        restitution,
        collisionMask,
        collisionGroup,
        gravityScale,
        linearVelocity,
        angularVelocity,
        linearDamping,
        angularDamping,
        autoSleep,
        kinematic,
        shapes
    }) {
        const bodyConfig = new RigidBodyConfig();

        if (autoSleep !== undefined) {
            bodyConfig.autoSleep = autoSleep;
        }

        if (kinematic !== undefined) {
            bodyConfig.type = RigidBodyType.KINEMATIC;
        } else if (density === 0 || type === undefined) {
            bodyConfig.type = RigidBodyType.STATIC;
        } else {
            bodyConfig.type = RigidBodyType.DYNAMIC;
        }

        const body = new RigidBody(bodyConfig);

        if (type !== undefined) {
            if (shapes !== undefined) {
                for (let i = 0; i < shapes.length; i++) {
                    const shape = shapes[i];

                    shape.density = density;
                    shape.friction = friction;
                    shape.restitution = restitution;
                    shape.collisionMask = collisionMask;
                    shape.collisionGroup = collisionGroup;

                    body.addShape(this.getShape(shape));
                }
            } else {
                body.addShape(this.getShape({
                    type,
                    size,
                    density,
                    friction,
                    restitution,
                    collisionMask,
                    collisionGroup
                }));
            }
        }

        if (position !== undefined) {
            body.setPosition(new Vec3(position[0], position[1], position[2]));
        }

        if (quaternion !== undefined) {
            body.setOrientation(new Quat(quaternion[0], quaternion[1], quaternion[2], quaternion[3]));
        }

        if (gravityScale !== undefined) {
            body.setGravityScale(gravityScale);
        }

        if (linearVelocity !== undefined) {
            body.setLinearVelocity(linearVelocity);
        }

        if (angularVelocity !== undefined) {
            body.setAngularVelocity(angularVelocity);
        }

        if (linearDamping !== undefined) {
            body.setLinearDamping(linearDamping);
        }

        if (angularDamping !== undefined) {
            body.setAngularDamping(angularDamping);
        }

        this.world.addRigidBody(body);

        if (density !== 0) {
            this.bodies.push(body);

            // Swap buffers
            const temp = this.array;
            this.array = new Float32Array(this.bodies.length * 8);
            this.array.set(temp);
        }

        this.map.set(name, body);

        return body;
    }

    setGravity(gravity) {
        this.world.setGravity(this.v1.init(gravity[0], gravity[1], gravity[2]));
    }

    setPosition(name, position) {
        const body = this.map.get(name);

        body.setPosition(this.v1.init(position[0], position[1], position[2]));
    }

    setOrientation(name, orientation) {
        const body = this.map.get(name);

        body.setOrientation(this.q.init(orientation[0], orientation[1], orientation[2], orientation[3]));
    }

    setGravityScale(name, gravityScale) {
        const body = this.map.get(name);

        body.setGravityScale(gravityScale);
    }

    setLinearVelocity(name, linearVelocity) {
        const body = this.map.get(name);

        body.setLinearVelocity(this.v1.init(linearVelocity[0], linearVelocity[1], linearVelocity[2]));
    }

    setAngularVelocity(name, angularVelocity) {
        const body = this.map.get(name);

        body.setAngularVelocity(this.v1.init(angularVelocity[0], angularVelocity[1], angularVelocity[2]));
    }

    setLinearDamping(name, linearDamping) {
        const body = this.map.get(name);

        body.setLinearDamping(this.v1.init(linearDamping[0], linearDamping[1], linearDamping[2]));
    }

    setAngularDamping(name, angularDamping) {
        const body = this.map.get(name);

        body.setAngularDamping(this.v1.init(angularDamping[0], angularDamping[1], angularDamping[2]));
    }

    setContactCallback(name, callback) {
        const body = this.map.get(name);

        const contactCallback = new ContactCallback();
        contactCallback.beginContact = contact => callback(body, name, contact);

        let shape = body.getShapeList();

        while (shape) {
            shape.setContactCallback(contactCallback);
            shape = shape.getNext();
        }
    }

    applyImpulse(name, impulse, positionInWorld) {
        const body = this.map.get(name);

        body.applyImpulse(this.v1.init(impulse[0], impulse[1], impulse[2]), this.v2.init(positionInWorld[0], positionInWorld[1], positionInWorld[2]));
    }

    wakeUp(name) {
        const body = this.map.get(name);

        body.wakeUp();
    }

    sleep(name) {
        const body = this.map.get(name);

        body.sleep();
    }

    step() {
        const array = this.array;

        this.world.step(this.timestep);

        let index = 0;

        for (let i = 0, l = this.bodies.length; i < l; i++) {
            const body = this.bodies[i];
            const position = body.getPosition();
            const quaternion = body.getOrientation();

            index = i * 8;

            if (body.isSleeping()) {
                array[index + 7] = 1;
            } else {
                array[index] = position.x;
                array[index + 1] = position.y;
                array[index + 2] = position.z;
                array[index + 3] = quaternion.x;
                array[index + 4] = quaternion.y;
                array[index + 5] = quaternion.z;
                array[index + 6] = quaternion.w;
                array[index + 7] = 0;
            }
        }
    }
}

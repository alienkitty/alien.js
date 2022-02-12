/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on {@link module:three/examples/jsm/physics/OimoPhysics.js} by VBT-YTokan
 * Based on https://github.com/lo-th/phy
 */

import { oimo } from 'oimophysics';

// Dynamics
const World = oimo.dynamics.World;
const RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
const RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
const RigidBody = oimo.dynamics.rigidbody.RigidBody;
const ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
const Shape = oimo.dynamics.rigidbody.Shape;
const SphericalJointConfig = oimo.dynamics.constraint.joint.SphericalJointConfig;
const SphericalJoint = oimo.dynamics.constraint.joint.SphericalJoint;
const RevoluteJointConfig = oimo.dynamics.constraint.joint.RevoluteJointConfig;
const RevoluteJoint = oimo.dynamics.constraint.joint.RevoluteJoint;
const CylindricalJointConfig = oimo.dynamics.constraint.joint.CylindricalJointConfig;
const CylindricalJoint = oimo.dynamics.constraint.joint.CylindricalJoint;
const PrismaticJointConfig = oimo.dynamics.constraint.joint.PrismaticJointConfig;
const PrismaticJoint = oimo.dynamics.constraint.joint.PrismaticJoint;
const UniversalJointConfig = oimo.dynamics.constraint.joint.UniversalJointConfig;
const UniversalJoint = oimo.dynamics.constraint.joint.UniversalJoint;
const RagdollJointConfig = oimo.dynamics.constraint.joint.RagdollJointConfig;
const RagdollJoint = oimo.dynamics.constraint.joint.RagdollJoint;
const GenericJointConfig = oimo.dynamics.constraint.joint.GenericJointConfig;
const GenericJoint = oimo.dynamics.constraint.joint.GenericJoint;
const Joint = oimo.dynamics.constraint.joint.Joint;

// Common
const Vec3 = oimo.common.Vec3;
const Quat = oimo.common.Quat;

// Collision
const BoxGeometry = oimo.collision.geometry.BoxGeometry;
const SphereGeometry = oimo.collision.geometry.SphereGeometry;

// Callback
const ContactCallback = oimo.dynamics.callback.ContactCallback;

export class OimoPhysicsBuffer {
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

        this.bodies = [];
        this.map = new Map();
        this.array = new Float32Array();

        this.position = new Vec3();
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
        autoSleep,
        kinematic
    }) {
        const bodyConfig = new RigidBodyConfig();

        if (autoSleep !== undefined) {
            bodyConfig.autoSleep = autoSleep;
        }

        if (kinematic) {
            bodyConfig.type = RigidBodyType.KINEMATIC;
        } else if (density === 0 || type === undefined) {
            bodyConfig.type = RigidBodyType.STATIC;
        } else {
            bodyConfig.type = RigidBodyType.DYNAMIC;
        }

        const body = new RigidBody(bodyConfig);

        if (type) {
            const shapeConfig = new ShapeConfig();

            if (type === 'box') {
                shapeConfig.geometry = new BoxGeometry(new Vec3(size[0], size[1], size[2]));
            } else if (type === 'sphere') {
                shapeConfig.geometry = new SphereGeometry(size);
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

            body.addShape(new Shape(shapeConfig));
        }

        if (position) {
            body.setPosition(new Vec3(position[0], position[1], position[2]));
        }

        if (quaternion) {
            body.setOrientation(new Quat(quaternion[0], quaternion[1], quaternion[2], quaternion[3]));
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

    setPosition(name, position) {
        const body = this.map.get(name);

        this.position.init(position[0], position[1], position[2]);

        body.setPosition(this.position);
    }

    setContactCallback(name, callback) {
        const body = this.map.get(name);

        const contactCallback = new ContactCallback();
        contactCallback.preSolve = contact => callback(body, name, contact);

        let shape = body.getShapeList();

        while (shape) {
            shape.setContactCallback(contactCallback);
            shape = shape.getNext();
        }
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

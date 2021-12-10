/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on {@link module:three/examples/jsm/physics/OimoPhysics.js} by VBT-YTokan
 * Based on https://github.com/lo-th/phy
 */

import { Matrix4, Object3D } from 'three';

import { guid } from '../Utils.js';

export class OimoPhysicsController {
    constructor(view) {
        this.view = view;

        this.shapes = [];
        this.objects = [];
        this.map = new WeakMap();

        this.object = new Object3D();
        this.matrix = new Matrix4();
    }

    getObject(position, quaternion, geometry, props) {
        const object = Object.assign({}, props);

        if (object.name === undefined) {
            object.name = guid();
        }

        if (position) {
            object.position = position.toArray();
        }

        if (quaternion) {
            object.quaternion = quaternion.toArray();
        }

        if (geometry) {
            const parameters = geometry.parameters;

            if (geometry.type === 'BoxGeometry') {
                const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5;
                const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5;
                const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5;

                object.type = 'box';
                object.size = [sx, sy, sz];
            } else if (geometry.type === 'SphereGeometry' || geometry.type === 'IcosahedronGeometry') {
                object.type = 'sphere';
                object.size = parameters.radius !== undefined ? parameters.radius : 1;
            }
        }

        return object;
    }

    add(object, props) {
        if (object.geometry) {
            if (object.isInstancedMesh) {
                return this.handleInstancedMesh(object, object.geometry, props);
            } else {
                return this.handleMesh(object, object.geometry, props);
            }
        } else {
            return this.handleObject(object, props);
        }
    }

    get(object) {
        return this.map.get(object);
    }

    handleObject(object, props) {
        if (props === undefined) {
            props = object;
        }

        const body = this.getObject(null, null, null, props);
        this.shapes.push(body);

        if (object.isObject3D && props.density !== 0) {
            this.objects.push(object);
        }

        this.map.set(object, body);

        return body;
    }

    handleMesh(object, geometry, props = {}) {
        if (object.parent && object.parent.isGroup) {
            object = object.parent;
        }

        if (object.name && props.name === undefined) {
            props.name = object.name;
        }

        const body = this.getObject(object.position, object.quaternion, geometry, props);
        this.shapes.push(body);

        if (props.density !== 0) {
            this.objects.push(object);
        }

        this.map.set(object, body);

        return body;
    }

    handleInstancedMesh(object, geometry, props = {}) {
        const bodies = [];
        const name = props.name || guid();

        for (let i = 0; i < object.count; i++) {
            object.getMatrixAt(i, this.matrix);
            this.matrix.decompose(this.object.position, this.object.quaternion, this.object.scale);

            props.name = `${name}_${i}`;

            const body = this.getObject(this.object.position, this.object.quaternion, geometry, props);
            this.shapes.push(body);

            bodies.push(body);
        }

        if (props.density !== 0) {
            this.objects.push(object);
        }

        this.map.set(object, bodies);

        return bodies;
    }

    step(array) {
        let index = 0;

        for (let i = 0, il = this.objects.length; i < il; i++) {
            const object = this.objects[i];

            if (object.isInstancedMesh) {
                const bodies = this.map.get(object);

                for (let j = 0, jl = bodies.length; j < jl; j++) {
                    if (array[index + 7] !== 1) {
                        this.object.position.fromArray(array, index);
                        this.object.quaternion.fromArray(array, index + 3);
                        this.object.updateMatrix();

                        object.setMatrixAt(j, this.object.matrix);
                    }

                    index += 8;
                }

                object.instanceMatrix.needsUpdate = true;
            } else {
                if (array[index + 7] !== 1) {
                    object.position.fromArray(array, index);
                    object.quaternion.fromArray(array, index + 3);
                }

                index += 8;
            }
        }
    }
}

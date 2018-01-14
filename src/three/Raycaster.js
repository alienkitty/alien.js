/**
 * Raycaster.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Component } from '../util/Component';
import { Mouse } from '../util/Mouse';
import { Stage } from '../view/Stage';

class Raycaster extends Component {

    constructor(camera) {
        super();
        this.camera = camera;
        const calc = new THREE.Vector2(),
            raycaster = new THREE.Raycaster();
        let debug;

        function ascSort(a, b) {
            return a.distance - b.distance;
        }

        function intersectObject(object, raycaster, intersects, recursive) {
            if (object.visible === false) return;
            let parent = object.parent;
            while (parent) {
                if (parent.visible === false) return;
                parent = parent.parent;
            }
            object.raycast(raycaster, intersects);
            if (recursive === true) object.children.forEach(object => intersectObject(object, raycaster, intersects, true));
        }

        function intersect(objects) {
            if (!Array.isArray(objects)) objects = [objects];
            const intersects = [];
            objects.forEach(object => intersectObject(object, raycaster, intersects, false));
            intersects.sort(ascSort);
            if (debug) updateDebug();
            return intersects;
        }

        function updateDebug() {
            const vertices = debug.geometry.vertices;
            vertices[0].copy(raycaster.ray.origin.clone());
            vertices[1].copy(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(10000)));
            debug.geometry.verticesNeedUpdate = true;
        }

        this.pointsThreshold = value => {
            raycaster.params.Points.threshold = value;
        };

        this.debug = scene => {
            const geom = new THREE.Geometry();
            geom.vertices.push(new THREE.Vector3(-100, 0, 0));
            geom.vertices.push(new THREE.Vector3(100, 0, 0));
            const mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
            debug = new THREE.Line(geom, mat);
            scene.add(debug);
        };

        this.checkHit = (objects, mouse = Mouse) => {
            const rect = this.rect || Stage;
            if (mouse === Mouse && rect === Stage) {
                calc.copy(Mouse.tilt);
            } else {
                calc.x = mouse.x / rect.width * 2 - 1;
                calc.y = -(mouse.y / rect.height) * 2 + 1;
            }
            raycaster.setFromCamera(calc, camera);
            return intersect(objects);
        };

        this.checkFromValues = (objects, origin, direction) => {
            raycaster.set(origin, direction, 0, Number.POSITIVE_INFINITY);
            return intersect(objects);
        };
    }
}

export { Raycaster };

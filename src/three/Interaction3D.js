/**
 * 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events';
import { Render } from '../util/Render';
import { Utils } from '../util/Utils';
import { Mouse } from '../util/Mouse';
import { Interaction } from '../util/Interaction';
import { Stage } from '../view/Stage';
import { Raycaster } from './Raycaster';

class Interaction3D {

    constructor(camera) {
        if (!Interaction3D.initialized) {
            Interaction3D.HOVER = 'interaction3d_hover';
            Interaction3D.CLICK = 'interaction3d_click';

            Interaction3D.initialized = true;
        }
        const self = this;
        this.events = new Events();
        this.ray = new Raycaster(camera);
        this.meshes = [];
        this.meshCallbacks = [];
        this.cursor = 'auto';
        this.enabled = true;
        const event = {};
        let hoverTarget, clickTarget;

        addListeners();

        function addListeners() {
            Mouse.input.events.add(Interaction.START, start);
            Mouse.input.events.add(Interaction.MOVE, move);
            Mouse.input.events.add(Interaction.CLICK, click);
        }

        function start() {
            if (!self.enabled) return;
            const hit = move();
            if (hit) {
                clickTarget = hit.object;
                clickTarget.time = Render.TIME;
            } else {
                clickTarget = null;
            }
        }

        function move() {
            if (!self.enabled) return;
            const hit = self.ray.checkHit(self.meshes)[0];
            if (hit) {
                const mesh = hit.object;
                if (mesh !== hoverTarget) {
                    if (hoverTarget) triggerHover('out', hoverTarget);
                    hoverTarget = mesh;
                    triggerHover('over', hoverTarget);
                    Stage.css('cursor', 'pointer');
                }
                return hit;
            } else {
                if (hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', self.cursor);
                }
                return false;
            }
        }

        function click() {
            if (!self.enabled) return;
            if (!clickTarget) return;
            const hit = self.ray.checkHit(self.meshes)[0];
            if (hit && hit.object === clickTarget) triggerClick(clickTarget);
            clickTarget = null;
        }

        function triggerHover(action, mesh) {
            event.action = action;
            event.mesh = mesh;
            self.events.fire(Interaction3D.HOVER, event);
            const i = self.meshes.indexOf(hoverTarget);
            if (self.meshCallbacks[i].hoverCallback) self.meshCallbacks[i].hoverCallback(event);
        }

        function triggerClick(mesh) {
            event.action = 'click';
            event.mesh = mesh;
            self.events.fire(Interaction3D.CLICK, event);
            const i = self.meshes.indexOf(clickTarget);
            if (self.meshCallbacks[i].clickCallback) self.meshCallbacks[i].clickCallback(event);
        }

        function parseMeshes(meshes) {
            if (!Array.isArray(meshes)) meshes = [meshes];
            const output = [];
            meshes.forEach(checkMesh);

            function checkMesh(mesh) {
                if (mesh.type === 'Mesh' && mesh.mouseEnabled) output.push(mesh);
                if (mesh.children.length) mesh.children.forEach(checkMesh);
            }

            return output;
        }

        this.add = (meshes, hoverCallback, clickCallback, parse) => {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(mesh => {
                this.meshes.push(mesh);
                this.meshCallbacks.push({ hoverCallback, clickCallback });
            });
        };

        this.remove = (meshes, parse) => {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(mesh => {
                if (mesh === hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', this.cursor);
                }
                for (let i = this.meshes.length - 1; i >= 0; i--) {
                    if (this.meshes[i] === mesh) {
                        this.meshes.splice(i, 1);
                        this.meshCallbacks.splice(i, 1);
                    }
                }
            });
        };

        this.destroy = () => {
            return Utils.nullObject(this);
        };
    }

    set camera(c) {
        this.ray.camera = c;
    }
}

export { Interaction3D };

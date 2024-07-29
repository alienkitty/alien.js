import { HalfFloatType, Vector2 } from 'three';

import { Reticle, Stage, getDoubleRenderTarget } from '@alienkitty/space.js/three';

import { Data } from '../../data/Data.js';
import { AudioController } from '../audio/AudioController.js';
import { FluidPassMaterial } from '../../materials/FluidPassMaterial.js';
import { FluidViewMaterial } from '../../materials/FluidViewMaterial.js';

import { numPointers } from '../../config/Config.js';

export class FluidController {
    static init(renderer, screen, screenCamera, trackers) {
        this.renderer = renderer;
        this.screen = screen;
        this.screenCamera = screenCamera;
        this.trackers = trackers;

        this.pointer = {};
        this.lerpSpeed = 0.07;
        this.enabled = false;

        this.initRenderer();
        this.initPointers();

        this.addListeners();
    }

    static initRenderer() {
        // Render targets
        this.fluid = getDoubleRenderTarget(1, 1, {
            type: HalfFloatType,
            depthBuffer: false
        });

        // Fluid materials
        this.passMaterial = new FluidPassMaterial();
        this.viewMaterial = new FluidViewMaterial();
    }

    static initPointers() {
        for (let i = 0; i < numPointers; i++) {
            this.passMaterial.uniforms.uMouse.value[i] = new Vector2(0.5, 0.5);
            this.passMaterial.uniforms.uLast.value[i] = new Vector2(0.5, 0.5);
            this.passMaterial.uniforms.uVelocity.value[i] = new Vector2();
            this.passMaterial.uniforms.uStrength.value[i] = new Vector2();
        }

        this.pointer.main = {};
        this.pointer.main.isMove = false;
        this.pointer.main.isDown = false;
        this.pointer.main.mouse = new Vector2();
        this.pointer.main.last = new Vector2();
        this.pointer.main.delta = new Vector2();
    }

    static addListeners() {
        Stage.events.on('update', this.onUsers);
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
        Data.Socket.on('motion', this.onMotion);
    }

    // Event handlers

    static onUsers = e => {
        const ids = e.map(user => user.id);

        Object.keys(this.pointer).forEach((id, i) => {
            if (id === 'main') {
                return;
            }

            if (ids.includes(id)) {
                this.pointer[id].tracker.setData(Data.getReticleData(id));
            } else {
                this.pointer[id].tracker.animateOut(() => {
                    if (this.pointer[id]) {
                        this.pointer[id].tracker.destroy();

                        delete this.pointer[id];
                    }

                    this.passMaterial.uniforms.uMouse.value[i] = new Vector2(0.5, 0.5);
                    this.passMaterial.uniforms.uLast.value[i] = new Vector2(0.5, 0.5);
                    this.passMaterial.uniforms.uVelocity.value[i] = new Vector2();
                    this.passMaterial.uniforms.uStrength.value[i] = new Vector2();

                    AudioController.remove(id);
                });
            }
        });
    };

    static onPointerDown = e => {
        if (!this.enabled) {
            return;
        }

        this.pointer.main.isDown = true;

        this.onPointerMove(e);
    };

    static onPointerMove = ({ clientX, clientY }) => {
        if (!this.enabled) {
            return;
        }

        const event = {
            x: clientX,
            y: clientY
        };

        this.pointer.main.isMove = true;
        this.pointer.main.mouse.copy(event);

        this.send(event);
    };

    static onPointerUp = e => {
        if (!this.enabled) {
            return;
        }

        this.pointer.main.isDown = false;

        this.onPointerMove(e);
    };

    static onMotion = e => {
        if (!this.pointer[e.id] && Object.keys(this.pointer).length - 1 < numPointers) {
            this.pointer[e.id] = {};
            this.pointer[e.id].isDown = e.isDown;
            this.pointer[e.id].mouse = new Vector2();
            this.pointer[e.id].last = new Vector2();
            this.pointer[e.id].delta = new Vector2();
            this.pointer[e.id].target = new Vector2();
            this.pointer[e.id].target.set(e.x * this.width, e.y * this.height);
            this.pointer[e.id].mouse.copy(this.pointer[e.id].target);
            this.pointer[e.id].last.copy(this.pointer[e.id].mouse);
            this.pointer[e.id].tracker = this.trackers.add(new Reticle());
            this.pointer[e.id].tracker.css({ left: this.pointer[e.id].mouse.x, top: this.pointer[e.id].mouse.y });
            this.pointer[e.id].tracker.setData(Data.getReticleData(e.id));
        }

        this.pointer[e.id].isDown = e.isDown;
        this.pointer[e.id].target.set(e.x * this.width, e.y * this.height);
    };

    // Public methods

    static resize = (width, height, dpr) => {
        this.width = width;
        this.height = height;

        this.fluid.setSize(width * dpr, height * dpr);

        this.pointer.main.mouse.set(width / 2, height / 2);
        this.pointer.main.last.copy(this.pointer.main.mouse);
    };

    static update = () => {
        if (!this.enabled) {
            return;
        }

        Object.keys(this.pointer).forEach((id, i) => {
            if (id !== 'main') {
                this.pointer[id].mouse.lerp(this.pointer[id].target, this.lerpSpeed);

                this.pointer[id].tracker.css({ left: this.pointer[id].mouse.x, top: this.pointer[id].mouse.y });

                if (!this.pointer[id].tracker.animatedIn) {
                    this.pointer[id].tracker.animateIn();

                    AudioController.trigger('bass_drum');
                }
            }

            this.pointer[id].delta.subVectors(this.pointer[id].mouse, this.pointer[id].last);
            this.pointer[id].last.copy(this.pointer[id].mouse);

            const distance = Math.min(10, this.pointer[id].delta.length()) / 10;

            this.passMaterial.uniforms.uLast.value[i].copy(this.passMaterial.uniforms.uMouse.value[i]);
            this.passMaterial.uniforms.uMouse.value[i].set(this.pointer[id].mouse.x / this.width, (this.height - this.pointer[id].mouse.y) / this.height);
            this.passMaterial.uniforms.uVelocity.value[i].copy(this.pointer[id].delta);
            this.passMaterial.uniforms.uStrength.value[i].set((id === 'main' && !this.pointer[id].isMove) || this.pointer[id].isDown ? 50 : 50 * distance, 50 * distance);

            AudioController.update(id, this.pointer[id].mouse.x, this.pointer[id].mouse.y);
        });

        // Fluid pass
        this.passMaterial.uniforms.tMap.value = this.fluid.read.texture;
        this.screen.material = this.passMaterial;
        this.renderer.setRenderTarget(this.fluid.write);
        this.renderer.render(this.screen, this.screenCamera);
        this.fluid.swap();

        // View pass (render to screen)
        this.viewMaterial.uniforms.tMap.value = this.fluid.read.texture;
        this.screen.material = this.viewMaterial;
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.screen, this.screenCamera);
    };

    static send = e => {
        Data.Socket.motion({
            isDown: this.pointer.main.isDown,
            x: e.x / this.width,
            y: e.y / this.height
        });
    };

    static animateIn = () => {
        this.enabled = true;
    };
}

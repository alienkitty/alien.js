import { HalfFloatType, Vector2 } from 'three';
import { LinkedList, Reticle, Stage, getDoubleRenderTarget } from '@alienkitty/space.js/three';

import { Data } from '../../data/Data.js';
import { AudioController } from '../audio/AudioController.js';
import { FluidPassMaterial } from '../../materials/FluidPassMaterial.js';
import { FluidViewMaterial } from '../../materials/FluidViewMaterial.js';
import { DetailsUser } from '../../views/ui/DetailsUser.js';

import { numPointers, store } from '../../config/Config.js';

export class FluidController {
    static init(renderer, screen, screenCamera, trackers, ui) {
        this.renderer = renderer;
        this.screen = screen;
        this.screenCamera = screenCamera;
        this.trackers = trackers;
        this.ui = ui;

        this.list = new LinkedList();
        this.pointer = null;
        this.lerpSpeed = 0.07;
        this.enabled = false;

        this.initRenderer();
        this.initPointers();
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

        const pointer = {};
        pointer.id = 'main';
        pointer.isMove = false;
        pointer.isDown = false;
        pointer.mouse = new Vector2();
        pointer.last = new Vector2();
        pointer.delta = new Vector2();

        if (!store.observer) {
            pointer.info = this.ui.detailsUsers.add(new DetailsUser());
        }

        this.list.push(pointer);

        this.pointer = pointer;
    }

    static addListeners() {
        Stage.events.on('update', this.onUsers);
        Data.Socket.on('motion', this.onMotion);

        if (store.observer) {
            this.ui.info.animateIn();
            return;
        }

        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    // Event handlers

    static onUsers = e => {
        if (!store.id) {
            return;
        }

        const ids = e.map(user => user.id);

        // New
        ids.forEach(id => {
            if (id === store.id) {
                return;
            }

            if (Number(id) !== numPointers && !this.list.find(pointer => pointer.id === id)) {
                const pointer = {};
                pointer.id = id;
                pointer.isMove = false;
                pointer.isDown = false;
                pointer.mouse = new Vector2();
                pointer.last = new Vector2();
                pointer.delta = new Vector2();
                pointer.target = new Vector2();

                pointer.tracker = this.trackers.add(new Reticle());
                pointer.tracker.id = id;

                pointer.info = this.ui.detailsUsers.add(new DetailsUser());

                if (this.ui.isDetailsOpen) {
                    pointer.info.enable();
                    pointer.info.animateIn();
                }

                this.list.push(pointer);
            }
        });

        // Update and prune
        if (this.list.length) {
            let pointer = this.list.start();

            while (pointer) {
                if (pointer.id === 'main') {
                    if (pointer.info) {
                        pointer.info.setData(Data.getUserData(store.id));
                    }

                    pointer = this.list.next();
                    continue;
                }

                if (ids.includes(pointer.id)) {
                    pointer.tracker.setData(Data.getReticleData(pointer.id));
                    pointer.info.setData(Data.getUserData(pointer.id));
                } else {
                    const id = pointer.id;
                    const tracker = pointer.tracker;
                    const info = pointer.info;

                    tracker.animateOut(() => {
                        this.list.remove(pointer);

                        const i = Number(id);

                        this.passMaterial.uniforms.uMouse.value[i].set(0.5, 0.5);
                        this.passMaterial.uniforms.uLast.value[i].set(0.5, 0.5);
                        this.passMaterial.uniforms.uVelocity.value[i].set(0, 0);
                        this.passMaterial.uniforms.uStrength.value[i].set(0, 0);

                        AudioController.remove(id);

                        tracker.destroy();

                        info.animateOut(() => {
                            info.destroy();
                        });
                    });
                }

                pointer = this.list.next();
            }
        }
    };

    static onPointerDown = e => {
        if (!this.enabled) {
            return;
        }

        this.pointer.isDown = true;

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

        this.pointer.isMove = true;
        this.pointer.mouse.copy(event);

        if (this.pointer.info) {
            this.pointer.info.setData({
                isDown: this.pointer.isDown,
                x: event.x / this.width,
                y: event.y / this.height
            });
        }

        this.send(event);
    };

    static onPointerUp = e => {
        if (!this.enabled) {
            return;
        }

        this.pointer.isDown = false;

        this.onPointerMove(e);
    };

    static onMotion = e => {
        if (!this.enabled) {
            return;
        }

        const pointer = this.list.find(pointer => pointer.id === e.id);

        if (pointer) {
            // First input
            if (!pointer.isMove) {
                pointer.isMove = true;
                pointer.isDown = e.isDown;
                pointer.target.set(e.x * this.width, e.y * this.height);
                pointer.mouse.copy(pointer.target);
                pointer.last.copy(pointer.mouse);

                pointer.tracker.css({ left: pointer.mouse.x, top: pointer.mouse.y });
                pointer.tracker.setData(Data.getReticleData(e.id));
                pointer.tracker.animateIn();

                AudioController.trigger('bass_drum');
            }

            // Update
            pointer.isDown = e.isDown;
            pointer.target.set(e.x * this.width, e.y * this.height);

            pointer.info.setData({
                isDown: e.isDown,
                x: e.x,
                y: e.y
            });
        }
    };

    // Public methods

    static resize = (width, height, dpr) => {
        this.width = width;
        this.height = height;

        this.fluid.setSize(width * dpr, height * dpr);

        this.pointer.mouse.set(width / 2, height / 2);
        this.pointer.last.copy(this.pointer.mouse);
    };

    static update = () => {
        if (!this.enabled) {
            return;
        }

        if (this.list.length) {
            let pointer = this.list.start();

            while (pointer) {
                if (pointer.id !== 'main') {
                    pointer.mouse.lerp(pointer.target, this.lerpSpeed);
                    pointer.tracker.css({ left: pointer.mouse.x, top: pointer.mouse.y });
                }

                if (!(store.observer && pointer.id === 'main')) {
                    pointer.delta.subVectors(pointer.mouse, pointer.last);
                    pointer.last.copy(pointer.mouse);

                    const distance = Math.min(10, pointer.delta.length()) / 10;

                    const i = pointer.id === 'main' ? Number(store.id) : Number(pointer.id);

                    this.passMaterial.uniforms.uLast.value[i].copy(this.passMaterial.uniforms.uMouse.value[i]);
                    this.passMaterial.uniforms.uMouse.value[i].set(pointer.mouse.x / this.width, (this.height - pointer.mouse.y) / this.height);
                    this.passMaterial.uniforms.uVelocity.value[i].copy(pointer.delta);
                    this.passMaterial.uniforms.uStrength.value[i].set((pointer.id === 'main' && !pointer.isMove) || pointer.isDown ? 50 : 50 * distance, 50 * distance);

                    AudioController.update(pointer.id, pointer.mouse.x, pointer.mouse.y);
                }

                pointer = this.list.next();
            }
        }

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
            isDown: this.pointer.isDown,
            x: e.x / this.width,
            y: e.y / this.height
        });
    };

    static start = () => {
        this.addListeners();
    };

    static animateIn = () => {
        this.enabled = true;
    };
}

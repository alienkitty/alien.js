/**
 * Scroll interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Component } from './Component';
import { Device } from './Device';
import { Mouse } from './Mouse';
import { Interaction } from './Interaction';
import { TweenManager } from '../tween/TweenManager';
import { Stage } from '../view/Stage';

class Scroll extends Component {

    constructor(object, params) {
        super();
        if (!object || !object.element) {
            params = object;
            object = null;
        }
        if (!params) params = {};
        const self = this;
        this.x = 0;
        this.y = 0;
        this.max = {
            x: 0,
            y: 0
        };
        this.delta = {
            x: 0,
            y: 0
        };
        this.enabled = true;
        const scrollTarget = {
                x: 0,
                y: 0
            },
            scrollInertia = {
                x: 0,
                y: 0
            };
        let axes = ['x', 'y'];

        initParameters();
        addListeners();
        this.startRender(loop);

        function initParameters() {
            self.object = object;
            self.hitObject = params.hitObject || self.object;
            self.max.y = params.height || 0;
            self.max.x = params.width || 0;
            self.scale = params.scale || 1;
            self.drag = params.drag || Device.mobile;
            self.mouseWheel = params.mouseWheel !== false;
            self.limit = params.limit !== false;
            if (Array.isArray(params.axes)) axes = params.axes;
            if (self.object) self.object.css({ overflow: 'auto' });
        }

        function addListeners() {
            if (!Device.mobile) Stage.bind('wheel', scroll);
            if (self.drag) {
                if (self.hitObject) self.hitObject.bind('touchstart', e => e.preventDefault());
                const input = self.hitObject ? new Interaction(self.hitObject) : Mouse.input;
                input.events.add(Interaction.START, down);
                input.events.add(Interaction.DRAG, drag);
                input.events.add(Interaction.END, up);
            }
            Stage.events.add(Events.RESIZE, resize);
            resize();
        }

        function stopInertia() {
            self.isInertia = false;
            TweenManager.clearTween(scrollTarget);
        }

        function scroll(e) {
            if (!self.enabled) return;
            if (e.preventDefault) e.preventDefault();
            if (!self.mouseWheel) return;
            stopInertia();
            axes.forEach(axis => {
                const delta = 'delta' + axis.toUpperCase();
                if (Device.os === 'mac') {
                    if (Device.browser === 'firefox') {
                        if (e.deltaMode === 1) {
                            scrollTarget[axis] += e[delta] * 4;
                            scrollInertia[axis] = e[delta] * 4;
                            self.isInertia = true;
                            return;
                        }
                        scrollTarget[axis] += e[delta];
                        return;
                    }
                    if (Device.browser.includes(['chrome', 'safari'])) {
                        scrollTarget[axis] += e[delta] * 0.33;
                        scrollInertia[axis] = e[delta] * 0.33;
                        self.isInertia = true;
                        return;
                    }
                }
                if (Device.os === 'windows') {
                    if (Device.browser === 'firefox') {
                        if (e.deltaMode === 1) {
                            scrollTarget[axis] += e[delta] * 10;
                            scrollInertia[axis] = e[delta] * 10;
                            self.isInertia = true;
                            return;
                        }
                    }
                }
                scrollTarget[axis] += e[delta];
            });
        }

        function down() {
            if (!self.enabled) return;
            stopInertia();
        }

        function drag() {
            if (!self.enabled) return;
            axes.forEach(axis => scrollTarget[axis] -= Mouse.input.delta[axis]);
        }

        function up() {
            if (!self.enabled) return;
            const m = (() => {
                    if (Device.os === 'android') return 35;
                    return 25;
                })(),
                obj = {};
            axes.forEach(axis => obj[axis] = scrollTarget[axis] - Mouse.input.delta[axis] * m);
            TweenManager.tween(scrollTarget, obj, 2500, 'easeOutQuint');
        }

        function resize() {
            if (!self.enabled) return;
            stopInertia();
            if (!self.object) return;
            const p = {};
            if (Device.mobile) axes.forEach(axis => p[axis] = self.max[axis] ? scrollTarget[axis] / self.max[axis] : 0);
            if (typeof params.height === 'undefined') self.max.y = self.object.element.scrollHeight - self.object.element.clientHeight;
            if (typeof params.width === 'undefined') self.max.x = self.object.element.scrollWidth - self.object.element.clientWidth;
            if (Device.mobile) axes.forEach(axis => self[axis] = scrollTarget[axis] = p[axis] * self.max[axis]);
        }

        function loop() {
            axes.forEach(axis => {
                if (self.isInertia) {
                    scrollInertia[axis] *= 0.9;
                    scrollTarget[axis] += scrollInertia[axis];
                }
                if (self.limit) {
                    scrollTarget[axis] = Math.max(scrollTarget[axis], 0);
                    scrollTarget[axis] = Math.min(scrollTarget[axis], self.max[axis] / self.scale);
                }
                self.delta[axis] = (scrollTarget[axis] * self.scale - self[axis]) * 0.6;
                self[axis] += self.delta[axis];
                if (self.object) {
                    if (axis === 'x') self.object.element.scrollLeft = self.x;
                    if (axis === 'y') self.object.element.scrollTop = self.y;
                }
            });
        }

        this.destroy = () => {
            Stage.unbind('wheel', scroll);
            return super.destroy();
        };
    }
}

export { Scroll };

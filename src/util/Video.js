/**
 * Video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Component } from './Component';
import { Interface } from './Interface';
import { Device } from './Device';

class Video extends Component {

    constructor(params) {
        super();
        let self = this;
        this.CDN = Config.CDN || '';
        this.loaded = {
            start: 0,
            end: 0,
            percent: 0
        };
        let lastTime, buffering, seekTo, forceRender,
            tick = 0,
            event = {};

        createElement();
        if (params.preload !== false) preload();

        function createElement() {
            let src = params.src;
            if (src) src = self.CDN + params.src;
            self.element = document.createElement('video');
            if (src) self.element.src = src;
            self.element.controls = params.controls;
            self.element.id = params.id || '';
            self.element.width = params.width;
            self.element.height = params.height;
            self.element.loop = params.loop;
            self.object = new Interface(self.element);
            self.width = params.width;
            self.height = params.height;
            self.object.size(self.width, self.height);
            if (Device.mobile) {
                self.object.attr('webkit-playsinline', true);
                self.object.attr('playsinline', true);
            }
        }

        function preload() {
            self.element.preload = 'auto';
            self.element.load();
        }

        function step() {
            if (!self.element) return self.stopRender(step);
            self.duration = self.element.duration;
            self.time = self.element.currentTime;
            if (self.element.currentTime === lastTime) {
                tick++;
                if (tick > 30 && !buffering) {
                    buffering = true;
                    self.events.fire(Events.ERROR);
                }
            } else {
                tick = 0;
                if (buffering) {
                    self.events.fire(Events.READY);
                    buffering = false;
                }
            }
            lastTime = self.element.currentTime;
            if (self.element.currentTime >= (self.duration || self.element.duration) - 0.001) {
                if (!self.loop) {
                    if (!forceRender) self.stopRender(step);
                    self.events.fire(Events.COMPLETE);
                }
            }
            event.time = self.element.currentTime;
            event.duration = self.element.duration;
            event.loaded = self.loaded;
            self.events.fire(Events.UPDATE, event);
        }

        function checkReady() {
            if (!self.element) return false;
            if (!seekTo) {
                self.buffered = self.element.readyState === self.element.HAVE_ENOUGH_DATA;
            } else {
                let max = -1,
                    seekable = self.element.seekable;
                if (seekable) {
                    for (let i = 0; i < seekable.length; i++) if (seekable.start(i) < seekTo) max = seekable.end(i) - 0.5;
                    if (max >= seekTo) self.buffered = true;
                } else {
                    self.buffered = true;
                }
            }
            if (self.buffered) {
                self.stopRender(checkReady);
                self.events.fire(Events.READY);
            }
        }

        function handleProgress() {
            if (!self.ready()) return;
            let range = 0,
                bf = self.element.buffered,
                time = self.element.currentTime;
            while (!(bf.start(range) <= time && time <= bf.end(range))) range += 1;
            self.loaded.start = bf.start(range) / self.element.duration;
            self.loaded.end = bf.end(range) / self.element.duration;
            self.loaded.percent = self.loaded.end - self.loaded.start;
            self.events.fire(Events.PROGRESS, self.loaded);
        }

        this.play = () => {
            this.playing = true;
            this.element.play();
            this.startRender(step);
        };

        this.pause = () => {
            this.playing = false;
            this.element.pause();
            this.stopRender(step);
        };

        this.stop = () => {
            this.playing = false;
            this.element.pause();
            this.stopRender(step);
            if (this.ready()) this.element.currentTime = 0;
        };

        this.volume = v => {
            this.element.volume = v;
            if (this.muted) {
                this.muted = false;
                this.object.attr('muted', '');
            }
        };

        this.mute = () => {
            this.volume(0);
            this.muted = true;
            this.object.attr('muted', true);
        };

        this.seek = t => {
            if (this.element.readyState <= 1) {
                this.delayedCall(() => {
                    if (this.seek) this.seek(t);
                }, 32);
                return;
            }
            this.element.currentTime = t;
        };

        this.canPlayTo = t => {
            seekTo = null;
            if (t) seekTo = t;
            if (!this.buffered) this.startRender(checkReady);
            return this.buffered;
        };

        this.ready = () => {
            return this.element.readyState >= 2;
        };

        this.size = (w, h) => {
            this.element.width = this.width = w;
            this.element.height = this.height = h;
            this.object.size(this.width, this.height);
        };

        this.forceRender = () => {
            forceRender = true;
            this.startRender(step);
        };

        this.trackProgress = () => {
            this.element.addEventListener('progress', handleProgress);
        };

        this.destroy = () => {
            this.stop();
            this.element.src = '';
            this.object.destroy();
            return super.destroy();
        };
    }

    set loop(bool) {
        this.element.loop = bool;
    }

    get loop() {
        return this.element.loop;
    }

    set src(src) {
        this.element.src = this.CDN + src;
    }

    get src() {
        return this.element.src;
    }
}

export { Video };

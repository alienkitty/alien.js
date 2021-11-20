/**
 * @author pschroen / https://ufo.ai/
 */

import { Device } from '../../config/Device.js';
import { WebAudioParam } from './WebAudioParam.js';

export class Sound {
    constructor(parent, id, buffer, bypass) {
        this.parent = parent;
        this.context = parent.context;
        this.id = id;
        this.buffer = buffer;
        this.loop = false;
        this.playing = false;
        this.stopping = false;

        this.output = this.context.createGain();
        this.output.connect(parent.input);

        if (!bypass) {
            this.stereo = this.context.createStereoPanner();
            this.stereo.connect(this.output);
        }

        this.gain = new WebAudioParam(this, 'output', 'gain', 0);
        this.stereoPan = new WebAudioParam(this, 'stereo', 'pan', 0);
        this.playbackRate = new WebAudioParam(this, 'source', 'playbackRate', 1);

        this.input = this.stereo || this.output;

        if (!Device.mobile || this.context.state === 'running') {
            this.load();
        }
    }

    load() {
        if (this.buffer instanceof ArrayBuffer) {
            const promise = new Promise((resolve, reject) => {
                this.context.decodeAudioData(this.buffer.slice(), buffer => resolve(buffer), reject);
            }).then(buffer => {
                this.buffer = buffer;
            });

            this.ready = () => promise;
        } else {
            this.ready = () => Promise.resolve();
        }
    }

    play() {
        if (!this.ready) {
            this.load();
        }

        this.context.resume().then(this.ready).then(() => {
            if (!this.output) {
                return;
            }

            this.output.gain.cancelScheduledValues(this.context.currentTime);
            this.output.gain.setValueAtTime(this.gain.value, this.context.currentTime);

            if (this.stereo) {
                this.stereo.pan.cancelScheduledValues(this.context.currentTime);
                this.stereo.pan.setValueAtTime(this.stereoPan.value, this.context.currentTime);
            }

            if (this.element) {
                this.element.loop = this.loop;
                this.element.play();
            } else {
                if (this.stopping && this.loop) {
                    this.stopping = false;
                    return;
                }

                this.source = this.context.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.loop = this.loop;
                this.source.playbackRate.cancelScheduledValues(this.context.currentTime);
                this.source.playbackRate.setValueAtTime(this.playbackRate.value, this.context.currentTime);
                this.source.connect(this.input);
                this.source.start();
            }

            this.playing = true;
        });
    }

    stop() {
        if (this.element) {
            this.element.pause();
        } else if (this.source) {
            this.source.stop();
        }

        this.playing = false;
    }

    destroy() {
        if (this.element) {
            this.element.pause();
            this.element.src = '';
            this.source.disconnect();
        } else if (this.source) {
            this.source.stop();
            this.source.buffer = null;
            this.source.disconnect();
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}

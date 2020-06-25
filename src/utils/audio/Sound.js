/**
 * @author pschroen / https://ufo.ai/
 */

import { Device } from '../../config/Device.js';
import { WebAudioParam } from './WebAudioParam.js';

export class Sound {
    constructor({ context, output }, id, buffer) {
        this.context = context;
        this.id = id;
        this.buffer = buffer;
        this.loop = false;
        this.playing = false;

        this.output = this.context.createGain();
        this.output.connect(output);

        if (this.context.createStereoPanner) {
            this.stereo = this.context.createStereoPanner();
            this.stereo.connect(this.output);
        }

        this.gain = new WebAudioParam(this, 'output', 'gain', 1);
        this.stereoPan = new WebAudioParam(this, 'stereo', 'pan', 0);
        this.playbackRate = new WebAudioParam(this, 'source', 'playbackRate', 1);

        if (Device.os !== 'ios') {
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
        this.playing = true;

        if (!this.ready) {
            this.load();
        }

        this.ready().then(() => {
            this.output.gain.cancelScheduledValues(this.context.currentTime);
            this.output.gain.setValueAtTime(0, this.context.currentTime);
            this.output.gain.setTargetAtTime(this.gain.value, this.context.currentTime, 0.1);

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
                this.source.connect(this.stereo ? this.stereo : this.output);
                this.source.start();
            }
        });
    }

    stop() {
        if (this.element) {
            this.element.pause();
        } else {
            this.source.stop();
        }

        this.playing = false;
    }
}

/**
 * @author pschroen / https://ufo.ai/
 */

import { tween } from '../Tween.js';
import { basename } from '../Utils.js';

import { Assets } from '../../loaders/Assets.js';
import { WebAudioParam } from './WebAudioParam.js';
import { Sound } from './Sound.js';

export class WebAudio {
    static init(assets) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        this.sounds = {};

        this.context = new AudioContext();

        this.output = this.context.createGain();
        this.output.connect(this.context.destination);

        this.gain = new WebAudioParam(this, 'output', 'gain', 1);

        for (const path in assets) {
            this.createSound(basename(path), assets[path]);
        }
    }

    static createSound(id, buffer) {
        const sound = new Sound(this, id, buffer);

        this.sounds[id] = sound;

        return this.sounds[id];
    }

    static createStream(id, path) {
        const sound = new Sound(this, id, null);
        const audio = new Audio();

        audio.crossOrigin = Assets.crossOrigin;
        audio.autoplay = false;
        audio.loop = sound.loop;
        audio.src = Assets.getPath(path);
        sound.source = this.context.createMediaElementSource(audio);
        sound.source.connect(sound.stereo ? sound.stereo : sound.output);
        sound.element = audio;

        this.sounds[id] = sound;

        return this.sounds[id];
    }

    static get(id) {
        return this.sounds[id];
    }

    static trigger(id) {
        if (!this.context) {
            return;
        }

        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        const sound = this.sounds[id];

        if (sound) {
            sound.play();
        }
    }

    static play(id, volume = 1, loop) {
        if (!this.context) {
            return;
        }

        if (typeof volume !== 'number') {
            loop = volume;
            volume = 1;
        }

        const sound = this.sounds[id];

        if (sound) {
            sound.gain.alpha = volume;
            sound.loop = !!loop;

            this.trigger(id);
        }
    }

    static fadeInAndPlay(id, volume, loop, time, ease, delay = 0) {
        if (!this.context) {
            return;
        }

        const sound = this.sounds[id];

        if (sound) {
            sound.gain.alpha = 0;
            sound.loop = !!loop;

            this.trigger(id);

            tween(sound.gain, { value: volume }, time, ease, delay);
        }
    }

    static fadeOutAndStop(id, time, ease, delay = 0) {
        if (!this.context) {
            return;
        }

        const sound = this.sounds[id];

        if (sound && sound.playing) {
            tween(sound.gain, { value: 0 }, time, ease, delay, () => {
                if (!sound.stopping) {
                    return;
                }

                sound.stopping = false;
                sound.stop();
            });

            sound.stopping = true;
        }
    }

    static mute() {
        if (!this.context) {
            return;
        }

        tween(this.gain, { value: 0 }, 300, 'easeOutSine');
    }

    static unmute() {
        if (!this.context) {
            return;
        }

        tween(this.gain, { value: 1 }, 500, 'easeOutSine');
    }

    static remove(id) {
        if (!this.context) {
            return;
        }

        const sound = this.sounds[id];

        if (sound && sound.source) {
            if (sound.element) {
                sound.element.pause();
                sound.element.src = '';
            } else {
                sound.source.stop();
                sound.source.buffer = null;
                sound.buffer = null;
            }

            sound.source.disconnect();
            sound.source = null;
            sound.playing = false;

            delete this.sounds[id];
        }
    }

    static destroy() {
        if (this.context) {
            for (const id in this.sounds) {
                this.remove(id);
            }

            this.context.close();
        }

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}

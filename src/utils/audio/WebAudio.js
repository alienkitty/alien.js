/**
 * @author pschroen / https://ufo.ai/
 */

import { Assets } from '../../loaders/Assets.js';
import { WebAudioParam } from './WebAudioParam.js';
import { Sound } from './Sound.js';

import { tween } from '../../tween/Tween.js';
import { basename } from '../Utils.js';

var AudioContext;

if (typeof window !== 'undefined') {
    AudioContext = window.AudioContext;
}

export class WebAudio {
    static context = AudioContext ? new AudioContext() : null;

    static init(assets = {}) {
        if (!this.context) {
            return;
        }

        this.sounds = {};

        this.output = this.context.createGain();
        this.output.connect(this.context.destination);

        this.gain = new WebAudioParam(this, 'output', 'gain', 1);

        this.input = this.output;

        for (const path in assets) {
            this.add(this, basename(path), assets[path]);
        }
    }

    static add(parent, id, buffer, bypass) {
        if (!this.context) {
            return;
        }

        if (typeof parent === 'string') {
            bypass = buffer;
            buffer = id;
            id = parent;
            parent = this;
        }

        let sound;

        if (typeof buffer === 'string') {
            sound = new Sound(parent, id, null, bypass);

            const audio = new Audio();
            audio.crossOrigin = Assets.crossOrigin;
            audio.autoplay = false;
            audio.loop = sound.loop;
            audio.src = Assets.getPath(buffer);

            sound.source = this.context.createMediaElementSource(audio);
            sound.source.connect(sound.input);
            sound.element = audio;
        } else {
            sound = new Sound(parent, id, buffer, bypass);
        }

        this.sounds[id] = sound;

        return sound;
    }

    static remove(id) {
        if (!this.context) {
            return;
        }

        const sound = this.sounds[id];

        if (sound) {
            sound.destroy();
        }

        delete this.sounds[id];
    }

    static clone(parent, from, to, bypass) {
        if (!this.context) {
            return;
        }

        if (typeof parent === 'string') {
            bypass = to;
            to = from;
            from = parent;
            parent = this;
        }

        const sound = this.sounds[from];

        if (sound) {
            return this.add(parent, to, sound.buffer, bypass);
        }

        return sound;
    }

    static trigger(id) {
        if (!this.context) {
            return;
        }

        const sound = this.sounds[id];

        if (sound) {
            sound.play();
        }

        return sound;
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

        return sound;
    }

    static fadeInAndPlay(id, volume, loop, duration, ease, delay = 0, complete, update) {
        if (!this.context) {
            return;
        }

        if (typeof delay !== 'number') {
            update = complete;
            complete = delay;
            delay = 0;
        }

        const sound = this.sounds[id];

        if (sound) {
            sound.gain.alpha = 0;
            sound.loop = !!loop;

            this.trigger(id);

            sound.ready().then(() => {
                tween(sound.gain, { value: volume }, duration, ease, delay, complete, update);
            });
        }

        return sound;
    }

    static fadeOutAndStop(id, duration, ease, delay = 0, complete, update) {
        if (!this.context) {
            return;
        }

        if (typeof delay !== 'number') {
            update = complete;
            complete = delay;
            delay = 0;
        }

        const sound = this.sounds[id];

        if (sound) {
            sound.ready().then(() => {
                tween(sound.gain, { value: 0 }, duration, ease, delay, () => {
                    if (!sound.stopping) {
                        return;
                    }

                    sound.stopping = false;
                    sound.stop();

                    if (complete) {
                        complete();
                    }
                }, update);
            });

            sound.stopping = true;
        }

        return sound;
    }

    static mute() {
        if (!this.context) {
            return;
        }

        this.gain.fade(0, 300);
    }

    static unmute() {
        if (!this.context) {
            return;
        }

        this.gain.fade(1, 500);
    }

    static resume() {
        if (!this.context) {
            return;
        }

        this.context.resume();
    }

    static destroy() {
        if (!this.context) {
            return;
        }

        for (const id in this.sounds) {
            if (this.sounds[id] && this.sounds[id].destroy) {
                this.sounds[id].destroy();
            }
        }

        this.context.close();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    }
}

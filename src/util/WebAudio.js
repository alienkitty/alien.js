/**
 * Web audio engine.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Device } from './Device';
import { TweenManager } from '../tween/TweenManager';

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

class WebAudio {

    constructor() {
        const sounds = {};
        let context;

        this.init = () => {
            if (window.AudioContext) context = new AudioContext();
            if (!context) return;
            this.globalGain = context.createGain();
            this.globalGain.connect(context.destination);
        };

        this.loadSound = (id, callback) => {
            const promise = Promise.create();
            if (callback) promise.then(callback);
            callback = promise.resolve;
            const sound = this.getSound(id);
            window.fetch(sound.asset).then(response => {
                if (!response.ok) return callback();
                response.arrayBuffer().then(data => {
                    context.decodeAudioData(data, buffer => {
                        sound.buffer = buffer;
                        sound.complete = true;
                        callback();
                    });
                });
            }).catch(() => {
                callback();
            });
            sound.ready = () => promise;
        };

        this.createSound = (id, asset, callback) => {
            const sound = {};
            sound.asset = asset;
            sound.audioGain = context.createGain();
            sound.audioGain.connect(this.globalGain);
            sounds[id] = sound;
            if (Device.os === 'ios') callback();
            else this.loadSound(id, callback);
        };

        this.getSound = id => {
            return sounds[id];
        };

        this.trigger = id => {
            if (!context) return;
            if (context.state === 'suspended') context.resume();
            const sound = this.getSound(id);
            if (!sound.ready) this.loadSound(id);
            sound.ready().then(() => {
                if (sound.complete) {
                    const source = context.createBufferSource();
                    source.buffer = sound.buffer;
                    source.connect(sound.audioGain);
                    source.loop = !!sound.loop;
                    source.start(0);
                }
            });
        };

        this.mute = () => {
            if (!context) return;
            TweenManager.tween(this.globalGain.gain, { value: 0 }, 300, 'easeOutSine');
        };

        this.unmute = () => {
            if (!context) return;
            TweenManager.tween(this.globalGain.gain, { value: 1 }, 500, 'easeOutSine');
        };

        window.WebAudio = this;
    }
}

export { WebAudio };

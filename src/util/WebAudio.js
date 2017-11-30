/**
 * Web audio engine.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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

        this.createSound = (id, audioData, callback) => {
            const sound = {};
            context.decodeAudioData(audioData, buffer => {
                sound.buffer = buffer;
                sound.audioGain = context.createGain();
                sound.audioGain.connect(this.globalGain);
                sound.complete = true;
                if (callback) callback();
            });
            sounds[id] = sound;
        };

        this.getSound = id => {
            return sounds[id];
        };

        this.trigger = id => {
            if (!context) return;
            const sound = this.getSound(id),
                source = context.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(sound.audioGain);
            source.start(0);
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

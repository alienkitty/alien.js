/**
 * WebAudio helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenManager } from '../tween/TweenManager';

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

class WebAudio {

    constructor() {
        let context,
            sounds = [];

        this.init = () => {
            context = new window.AudioContext();
            this.globalGain = context.createGain();
            this.globalGain.connect(context.destination);
        };

        this.createSound = (id, audioData, callback) => {
            let sound = {id};
            context.decodeAudioData(audioData, buffer => {
                sound.buffer = buffer;
                sound.audioGain = context.createGain();
                sound.audioGain.connect(this.globalGain);
                sound.complete = true;
                if (callback) callback();
            });
            sounds.push(sound);
        };

        this.getSound = id => {
            for (let i = 0; i < sounds.length; i++) if (sounds[i].id === id) return sounds[i];
            return null;
        };

        this.trigger = id => {
            if (!context) return;
            let sound = this.getSound(id),
                source = context.createBufferSource();
            source.buffer = sound.buffer;
            source.connect(sound.audioGain);
            source.start(0);
        };

        this.mute = () => {
            if (!context) return;
            TweenManager.tween(this.globalGain.gain, {value:0}, 300, 'easeOutSine');
        };

        this.unmute = () => {
            if (!context) return;
            TweenManager.tween(this.globalGain.gain, {value:1}, 500, 'easeOutSine');
        };
    }
}

export { WebAudio };

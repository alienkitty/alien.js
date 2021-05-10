import { Stage, WebAudio, clamp, tween } from 'alien.js';

import { Config } from '../../config/Config.js';
import { Events } from '../../config/Events.js';
import { Global } from '../../config/Global.js';

export class AudioController {
    static init() {
        if (!WebAudio.context) {
            return;
        }

        this.water = {};
        this.multiplier = 8;
        this.easing = 0.97;
        this.lerpSpeed = 0.07;

        if (!Global.SOUND) {
            WebAudio.gain.value = 0;
        }

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on(Events.VISIBILITY, this.onVisibility);
        Stage.element.addEventListener('pointerdown', this.onPointerDown);
    }

    static getMouseSpeed(id, normalX, normalY) {
        const time = performance.now() - this.water[id].lastEventTime;

        if (time === 0) {
            return this.water[id].mouseSpeed;
        }

        const distance = Math.abs(normalX - this.water[id].lastMouseX) + Math.abs(normalY - this.water[id].lastMouseY);
        const speed = distance / time;

        this.water[id].mouseSpeed += speed * this.multiplier;
        this.water[id].mouseSpeed *= this.easing;

        if (Math.abs(this.water[id].mouseSpeed) < 0.001) {
            this.water[id].mouseSpeed = 0;
        }

        this.water[id].lastEventTime = performance.now();
        this.water[id].lastMouseX = normalX;
        this.water[id].lastMouseY = normalY;

        return this.water[id].mouseSpeed;
    }

    /**
     * Event handlers
     */

    static onVisibility = () => {
        if (!Global.SOUND) {
            return;
        }

        if (document.hidden) {
            WebAudio.mute();
        } else {
            WebAudio.unmute();
        }
    };

    static onPointerDown = () => {
        Stage.element.removeEventListener('pointerdown', this.onPointerDown);

        this.trigger('bass_drum');
    };

    /**
     * Public methods
     */

    static resize = () => {
        if (Stage.width < Config.BREAKPOINT) {
            this.easing = 0.8;
        } else {
            this.easing = 0.97;
        }
    };

    static update = (id, x, y) => {
        if (!WebAudio.context) {
            return;
        }

        const normalX = x / Stage.width;
        const normalY = y / Stage.height;

        if (!this.water[id]) {
            this.water[id] = {};
            this.water[id].mouseSpeed = 0;
            this.water[id].lastEventTime = performance.now();
            this.water[id].lastMouseX = normalX;
            this.water[id].lastMouseY = normalY;
            this.water[id].sound = WebAudio.clone('water_loop', id);

            WebAudio.play(id, 0, true);
        }

        const speed = clamp(this.getMouseSpeed(id, normalX, normalY) * 0.5, 0, 1);
        const pan = clamp(((normalX * 2) - 1) * 0.8, -1, 1);
        const rate = clamp(0.8 + (1 - normalY) * 0.4, 0.8, 1.2);

        this.trigger('mouse_move', id, speed, pan, rate);
    };

    static trigger = (event, ...params) => {
        if (!WebAudio.context) {
            return;
        }

        switch (event) {
            case 'bass_drum':
                WebAudio.play('bass_drum').gain.fade(0, 2000);
                break;
            case 'fluid_start':
                WebAudio.fadeInAndPlay('deep_spacy_loop', 0.2, true, 2000, 'linear');
                break;
            case 'mouse_move': {
                const sound = this.water[params[0]] && this.water[params[0]].sound;

                if (sound && sound.playing) {
                    sound.gain.value += (params[1] - sound.gain.value) * this.lerpSpeed;
                    sound.stereoPan.value += (params[2] - sound.stereoPan.value) * this.lerpSpeed;
                    sound.playbackRate.value += (params[3] - sound.playbackRate.value) * this.lerpSpeed;
                }
                break;
            }
            case 'about_section':
                tween(WebAudio.gain, { value: 0.3 }, 1000, 'easeOutSine');
                break;
            case 'fluid_section':
                tween(WebAudio.gain, { value: 1 }, 1000, 'easeOutSine');
                break;
            case 'sound_off':
                tween(WebAudio.gain, { value: 0 }, 500, 'easeOutSine');
                break;
            case 'sound_on':
                tween(WebAudio.gain, { value: 1 }, 500, 'easeOutSine');
                break;
        }
    };

    static remove = id => {
        if (this.water[id]) {
            this.water[id].sound = null;

            delete this.water[id];
        }

        WebAudio.fadeOutAndStop(id, 500, 'easeOutSine', () => {
            WebAudio.remove(id);
        });
    };

    static mute = () => {
        this.trigger('sound_off');
    };

    static unmute = () => {
        this.trigger('sound_on');
    };
}

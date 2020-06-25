import { Stage, WebAudio, clamp, tween } from 'alien.js';

import { Events } from '../../config/Events.js';
import { Global } from '../../config/Global.js';

export class AudioController {
    static init() {
        this.water = {};

        const sound = localStorage.getItem('sound');
        Global.SOUND = sound ? JSON.parse(sound) : true;

        if (!Global.SOUND) {
            WebAudio.gain.value = 0;
        }

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on(Events.VISIBILITY, this.onVisibility);
        document.addEventListener('click', this.onClick);
    }

    static getMouseSpeed(id, normalX, normalY) {
        const time = WebAudio.context.currentTime - this.water[id].lastEventTime;

        if (time === 0) {
            return this.water[id].mouseSpeed;
        }

        const distance = Math.abs(normalX - this.water[id].lastMouseX) + Math.abs(normalY - this.water[id].lastMouseY);
        const speed = distance / time;

        this.water[id].mouseSpeed += speed * 0.01;
        this.water[id].mouseSpeed *= 0.97;

        if (Math.abs(this.water[id].mouseSpeed) < 0.001) {
            this.water[id].mouseSpeed = 0;
        }

        this.water[id].lastEventTime = WebAudio.context.currentTime;
        this.water[id].lastMouseX = normalX;
        this.water[id].lastMouseY = normalY;

        return this.water[id].mouseSpeed;
    }

    /**
     * Event handlers
     */

    static onVisibility = ({ type }) => {
        if (!Global.SOUND) {
            return;
        }

        if (type === 'blur' || document.hidden) {
            WebAudio.mute();
        } else {
            WebAudio.unmute();
        }
    };

    static onClick = () => {
        document.removeEventListener('click', this.onClick);

        this.trigger('bass_drum');
    };

    /**
     * Public methods
     */

    static update = (id, x, y) => {
        if (!WebAudio.context) {
            return;
        }

        if (!this.water[id]) {
            this.water[id] = {};
            this.water[id].mouseSpeed = 0;
            this.water[id].lastEventTime = 0;
            this.water[id].lastMouseX = 0.5;
            this.water[id].lastMouseY = 0.5;
            this.water[id].sound = WebAudio.createSound(id, WebAudio.get('water_loop').buffer);

            WebAudio.play(id, 0, true);
        }

        const normalX = x / Stage.width;
        const normalY = y / Stage.height;
        const speed = clamp(this.getMouseSpeed(id, normalX, normalY) * 0.5, 0, 1);
        const pan = clamp(((normalX * 2) - 1) * 0.8, -1, 1);
        const rate = clamp(0.8 + (1 - normalY) / 2.5, 0.8, 1.2);

        this.trigger('mouse_move', id, speed, pan, rate);
    };

    static trigger = (event, ...params) => {
        switch (event) {
            case 'bass_drum':
                WebAudio.play('bass_drum');
                WebAudio.fadeOutAndStop('bass_drum', 2000, 'linear');
                break;
            case 'fluid_start':
                WebAudio.fadeInAndPlay('deep_spacy_loop', 0.2, true, 2000, 'linear');
                break;
            case 'mouse_move':
                if (this.water[params[0]] && this.water[params[0]].sound) {
                    const sound = this.water[params[0]].sound;

                    sound.gain.value += (params[1] - sound.gain.value) * 0.07;
                    sound.stereoPan.value += (params[2] - sound.stereoPan.value) * 0.07;
                    sound.playbackRate.value += (params[3] - sound.playbackRate.value) * 0.07;
                }
                break;
            case 'about_section':
                tween(WebAudio.gain, { value: 0.3 }, 1000, 'linear');
                break;
            case 'fluid_section':
                tween(WebAudio.gain, { value: 1 }, 500, 'linear');
                break;
            case 'sound_off':
                tween(WebAudio.gain, { value: 0 }, 300, 'linear');
                break;
            case 'sound_on':
                tween(WebAudio.gain, { value: 1 }, 500, 'linear');
                break;
        }
    };

    static remove = id => {
        if (this.water[id]) {
            this.water[id].sound = null;

            delete this.water[id];
        }

        WebAudio.remove(id);
    };

    static mute = () => {
        this.trigger('sound_off');
    };

    static unmute = () => {
        this.trigger('sound_on');
    };
}

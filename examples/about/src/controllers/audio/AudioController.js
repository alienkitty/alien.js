import { WebAudio, clamp, tween } from '@alienkitty/space.js/three';

import { breakpoint, store } from '../../config/Config.js';

export class AudioController {
    static init(ui) {
        this.ui = ui;

        if (!store.sound) {
            WebAudio.mute(true);
        }

        this.water = {};
        this.multiplier = 8;
        this.easing = 0.97;
        this.lerpSpeed = 0.07;
        this.enabled = WebAudio.context.state === 'running';

        this.addListeners();
    }

    static addListeners() {
        document.addEventListener('visibilitychange', this.onVisibility);
        window.addEventListener('pointerdown', this.onPointerDown);

        if (this.enabled || !store.sound) {
            return;
        }

        this.ui.instructions.animateIn(3000);
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

    // Event handlers

    static onVisibility = () => {
        if (!store.sound) {
            return;
        }

        if (document.hidden) {
            WebAudio.mute();
        } else {
            WebAudio.unmute();
        }
    };

    static onPointerDown = () => {
        this.enabled = true;

        window.removeEventListener('pointerdown', this.onPointerDown);

        WebAudio.resume();

        this.ui.instructions.animateOut();

        this.trigger('bass_drum');
    };

    // Public methods

    static resize = () => {
        if (document.documentElement.clientWidth < breakpoint) {
            this.easing = 0.8;
        } else {
            this.easing = 0.97;
        }
    };

    static update = (id, x, y) => {
        if (!this.enabled) {
            return;
        }

        const normalX = x / document.documentElement.clientWidth;
        const normalY = y / document.documentElement.clientHeight;

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

    static start = () => {
        this.enabled = true;
    };

    static trigger = (event, id, gain, pan, rate) => {
        switch (event) {
            case 'bass_drum':
                WebAudio.play('bass_drum').gain.fade(0, 2000);
                break;
            case 'fluid_start':
                WebAudio.fadeInAndPlay('deep_spacy_loop', 0.2, true, 2000, 'linear');
                break;
            case 'mouse_move': {
                const sound = this.water[id] && this.water[id].sound;

                if (sound && sound.isPlaying) {
                    sound.gain.value += (gain - sound.gain.value) * this.lerpSpeed;
                    sound.stereoPan.value += (pan - sound.stereoPan.value) * this.lerpSpeed;
                    sound.playbackRate.value += (rate - sound.playbackRate.value) * this.lerpSpeed;
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
                tween(WebAudio.gain, { value: this.ui.isDetailsOpen ? 0.3 : 1 }, 500, 'easeOutSine');
                break;
        }
    };

    static remove = id => {
        if (this.water[id]) {
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

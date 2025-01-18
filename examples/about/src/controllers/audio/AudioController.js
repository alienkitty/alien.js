import { WebAudio, clamp, tween } from '@alienkitty/space.js/three';

import { breakpoint, store } from '../../config/Config.js';

export class AudioController {
    static init(ui) {
        this.ui = ui;

        if (!store.sound) {
            WebAudio.mute(true);
        }

        this.map = new Map();
        this.multiplier = 8;
        this.easing = 0.97;
        this.lerpSpeed = 0.07;
        this.enabled = WebAudio.enabled;

        this.addListeners();
    }

    static addListeners() {
        document.addEventListener('visibilitychange', this.onVisibility);
        document.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('beforeunload', this.onBeforeUnload);

        if (this.enabled || !store.sound) {
            return;
        }

        this.ui.instructions.animateIn(3000);
    }

    static getMouseSpeed(id, normalX, normalY) {
        const water = this.map.get(id);
        const time = performance.now() - water.lastEventTime;

        if (time === 0) {
            return water.mouseSpeed;
        }

        const distance = Math.abs(normalX - water.lastMouseX) + Math.abs(normalY - water.lastMouseY);
        const speed = distance / time;

        water.mouseSpeed += speed * this.multiplier;
        water.mouseSpeed *= this.easing;

        if (Math.abs(water.mouseSpeed) < 0.001) {
            water.mouseSpeed = 0;
        }

        water.lastEventTime = performance.now();
        water.lastMouseX = normalX;
        water.lastMouseY = normalY;

        return water.mouseSpeed;
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

        document.removeEventListener('pointerdown', this.onPointerDown);

        WebAudio.resume();

        this.ui.instructions.animateOut();

        this.trigger('bass_drum');
    };

    static onBeforeUnload = () => {
        WebAudio.mute();
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

        if (!this.map.has(id)) {
            const water = {};
            water.mouseSpeed = 0;
            water.lastEventTime = performance.now();
            water.lastMouseX = normalX;
            water.lastMouseY = normalY;
            water.sound = WebAudio.clone('water_loop', id);
            this.map.set(id, water);

            WebAudio.play(id, 0, true);
        }

        const speed = clamp(this.getMouseSpeed(id, normalX, normalY) * 0.5, 0, 1);
        const pan = clamp(((normalX * 2) - 1) * 0.8, -1, 1);
        const rate = clamp(0.8 + (1 - normalY) * 0.4, 0.8, 1.2);

        this.trigger('mouse_move', id, speed, pan, rate);
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
                const water = this.map.get(id);
                const sound = water && water.sound;

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
        this.map.delete(id);

        WebAudio.fadeOutAndStop(id, 500, 'easeOutSine', () => {
            WebAudio.remove(id);
        });
    };

    static start = () => {
        this.enabled = true;

        this.trigger('fluid_start');
    };

    static mute = () => {
        this.trigger('sound_off');
    };

    static unmute = () => {
        this.trigger('sound_on');
    };
}

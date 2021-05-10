import { Events } from '../../config/Events.js';
import { WebAudio } from '../../utils/audio/WebAudio.js';
import { Stage } from '../Stage.js';

export class AudioController {
    static init() {
        if (!WebAudio.context) {
            return;
        }

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on(Events.VISIBILITY, this.onVisibility);
        Stage.element.addEventListener('pointerdown', this.onPointerDown);
    }

    /**
     * Event handlers
     */

    static onVisibility = () => {
        if (document.hidden) {
            WebAudio.mute();
        } else {
            WebAudio.unmute();
        }
    };

    static onPointerDown = () => {
        Stage.element.removeEventListener('pointerdown', this.onPointerDown);

        // this.trigger('bass_drum');
    };

    /**
     * Public methods
     */

    /* static trigger = (event, ...params) => {
        if (!WebAudio.context) {
            return;
        }

        switch (event) {
            case 'bass_drum':
                WebAudio.play('bass_drum');
                break;
            case 'sound_off':
                tween(WebAudio.gain, { value: 0 }, 500, 'easeOutSine');
                break;
            case 'sound_on':
                tween(WebAudio.gain, { value: 1 }, 500, 'easeOutSine');
                break;
        }
    };

    static mute = () => {
        this.trigger('sound_off');
    };

    static unmute = () => {
        this.trigger('sound_on');
    }; */
}

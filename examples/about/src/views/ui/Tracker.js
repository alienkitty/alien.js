import { Interface } from 'alien.js';

import { AudioController } from '../../controllers/audio/AudioController.js';
import { TrackerText } from './TrackerText.js';

export class Tracker extends Interface {
    constructor() {
        super('.tracker');

        this.animatedIn = false;

        this.initHTML();
        this.initText();
    }

    initHTML() {
        this.invisible();
        this.css({
            left: '50%',
            top: '50%',
            width: 12,
            height: 12,
            marginLeft: -12 / 2,
            marginTop: -12 / 2
        });

        this.reticle = new Interface('.reticle');
        this.reticle.css({
            left: '50%',
            top: '50%',
            width: 12,
            height: 12,
            marginLeft: -12 / 2,
            marginTop: -12 / 2,
            border: '2px solid var(--main-color)',
            borderRadius: '50%'
        });
        this.add(this.reticle);
    }

    initText() {
        this.text = new TrackerText();
        this.add(this.text);
    }

    /**
     * Public methods
     */

    setData = data => {
        this.text.setData(data);
    };

    animateIn = () => {
        this.animatedIn = true;

        this.clearTween().visible().css({ scale: 0.25, opacity: 0 }).tween({ scale: 1, opacity: 1 }, 400, 'easeOutCubic');

        AudioController.trigger('bass_drum');
    };

    animateOut = callback => {
        this.tween({ scale: 0, opacity: 0 }, 500, 'easeOutCubic', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });
    };
}

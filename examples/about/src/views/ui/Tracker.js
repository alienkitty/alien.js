import { Interface } from 'alien.js';

import { Config } from '../../config/Config.js';
import { AudioController } from '../../controllers/audio/AudioController.js';
import { TrackerText } from './TrackerText.js';

export class Tracker extends Interface {
    constructor() {
        super('.tracker');

        this.initHTML();
        this.initView();
    }

    initHTML() {
        this.invisible();
        this.css({
            left: '50%',
            top: '50%',
            marginLeft: -12 / 2,
            marginTop: -12 / 2,
            width: 12,
            height: 12,
            transformStyle: 'preserve-3d',
            perspective: 2000
        });

        this.container = new Interface('.container');
        this.container.css({
            width: 12,
            height: 12
        });
        this.add(this.container);

        this.wrapper = new Interface('.wrapper');
        this.wrapper.css({
            width: 12,
            height: 12
        });
        this.container.add(this.wrapper);

        this.center = new Interface('.center');
        this.center.css({
            left: '50%',
            top: '50%',
            marginLeft: -12 / 2,
            marginTop: -12 / 2,
            width: 12,
            height: 12,
            border: `2px solid ${Config.UI_COLOR}`,
            borderRadius: '50%'
        });
        this.wrapper.add(this.center);
    }

    initView() {
        this.text = new TrackerText();
        this.wrapper.add(this.text);
    }

    /**
     * Public methods
     */

    setData = data => {
        this.text.setData(data);
    };

    animateIn = () => {
        this.animatedIn = true;

        this.visible();

        this.text.animateIn();
        this.center.css({ scale: 0 }).tween({ scale: 1 }, 500, 'easeOutCubic');
        this.wrapper.css({ scale: 0.25, opacity: 0 }).tween({ scale: 1, opacity: 1 }, 400, 'easeOutCubic');
        this.container.css({ z: -200, opacity: 1 }).tween({ z: 0 }, 400, 'easeOutCubic');

        AudioController.trigger('bass_drum');
    };

    animateOut = callback => {
        this.text.animateOut();
        this.wrapper.tween({ scale: 0 }, 500, 'easeOutCubic');
        this.container.tween({ opacity: 0 }, 500, 'easeOutCubic', () => {
            this.invisible();

            if (callback) {
                callback();
            }
        });
    };
}

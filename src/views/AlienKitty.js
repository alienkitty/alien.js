import { Interface } from '../utils/Interface.js';

import { headsTails, random } from '../utils/Utils.js';

export class AlienKitty extends Interface {
    constructor() {
        super('.alienkitty');

        this.initHTML();
    }

    initHTML() {
        this.css({
            width: 90,
            height: 86,
            opacity: 0
        });
        this.bg('assets/images/alienkitty.svg');

        this.eyelid1 = new Interface('.eyelid1');
        this.eyelid1.css({
            left: 35,
            top: 25,
            width: 24,
            height: 14,
            transformOrigin: 'top center',
            scaleX: 1.5,
            scaleY: 0.01
        });
        this.eyelid1.bg('assets/images/alienkitty_eyelid.svg');
        this.add(this.eyelid1);

        this.eyelid2 = new Interface('.eyelid2');
        this.eyelid2.css({
            left: 53,
            top: 26,
            width: 24,
            height: 14,
            transformOrigin: 'top left',
            scaleX: 1,
            scaleY: 0.01
        });
        this.eyelid2.bg('assets/images/alienkitty_eyelid.svg');
        this.add(this.eyelid2);
    }

    blink() {
        this.delayedCall(random(0, 10000), headsTails(this.onBlink1, this.onBlink2));
    }

    /**
     * Event handlers
     */

    onBlink1 = () => {
        this.eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
            this.eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
        });
        this.eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
            this.eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                this.blink();
            });
        });
    };

    onBlink2 = () => {
        this.eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
            this.eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
        });
        this.eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
            this.eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                this.blink();
            });
        });
    };

    /**
     * Public methods
     */

    animateIn = () => {
        this.blink();

        this.tween({ opacity: 1 }, 1000, 'easeOutSine');
    };

    animateOut = callback => {
        this.tween({ opacity: 0 }, 500, 'easeInOutQuad', callback);
    };
}

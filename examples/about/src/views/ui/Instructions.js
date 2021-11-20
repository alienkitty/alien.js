import { Device, Interface } from 'alien.js';

export class Instructions extends Interface {
    constructor() {
        super('.instructions');

        this.initHTML();
    }

    initHTML() {
        this.invisible();
        this.css({
            left: '50%',
            bottom: 40,
            width: 300,
            marginLeft: -300 / 2,
            opacity: 0
        });

        this.container = new Interface('.container');
        this.container.css({
            bottom: 0,
            width: '100%'
        });
        this.add(this.container);

        this.text = new Interface('.text');
        this.text.css({
            position: 'relative',
            fontWeight: '700',
            fontSize: 10,
            letterSpacing: '0.08em',
            textAlign: 'center',
            textTransform: 'uppercase',
            opacity: 0.7
        });
        this.text.text(`${Device.mobile ? 'Tap' : 'Click'} for sound`);
        this.container.add(this.text);
    }

    /**
     * Public methods
     */

    toggle = (show, delay = 0) => {
        if (show) {
            this.visible().tween({ opacity: 1 }, 800, 'easeInOutSine', delay);
            this.text.css({ y: 10 }).tween({ y: 0 }, 1200, 'easeOutCubic', delay);
        } else {
            this.tween({ opacity: 0 }, 300, 'easeOutSine', () => {
                this.invisible();
            });
        }
    };
}

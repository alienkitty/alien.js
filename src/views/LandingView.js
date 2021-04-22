import { Interface } from '../utils/Interface.js';
import { AlienKitty } from '../views/AlienKitty.js';

export class LandingView extends Interface {
    constructor() {
        super('.landing');

        this.initHTML();
        this.initView();
    }

    initHTML() {
        this.css({
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            perspective: 2000,
            pointerEvents: 'none'
        });

        this.wrapper = new Interface('.wrapper');
        this.wrapper.css({
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            z: -300
        });
        this.add(this.wrapper);
    }

    initView() {
        this.view = new AlienKitty();
        this.view.css({
            left: '50%',
            top: '50%',
            marginLeft: -90 / 2,
            marginTop: -86 / 2
        });
        this.wrapper.add(this.view);
    }

    /**
     * Public methods
     */

    animateIn = () => {
        this.wrapper.tween({ z: 0 }, 7000, 'easeOutCubic');
        this.view.animateIn();
    };
}

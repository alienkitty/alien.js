import { Interface, Stage } from 'alien.js';

import { Config } from '../../config/Config.js';
import { Events } from '../../config/Events.js';
import { AudioController } from '../../controllers/audio/AudioController.js';
import { NavLink } from './NavLink.js';

export class Footer extends Interface {
    constructor() {
        super('.footer');

        this.initHTML();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.css({
            left: 20,
            right: 20,
            bottom: 20
        });
    }

    initViews() {
        this.about = new NavLink('Multiuser Fluid', 'https://glitch.com/~multiuser-fluid');
        this.about.css({
            x: -10,
            opacity: 0
        });
        this.add(this.about);
    }

    addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        this.about.events.on(Events.CLICK, this.onAboutClick);
    }

    removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        this.about.events.off(Events.CLICK, this.onAboutClick);
    }

    /**
     * Event handlers
     */

    onResize = () => {
        if (Stage.width < Config.BREAKPOINT) {
            this.css({
                left: 10,
                right: 10,
                bottom: 10
            });
        } else {
            this.css({
                left: 20,
                right: 20,
                bottom: 20
            });
        }
    };

    onAboutClick = () => {
        AudioController.mute();
    };

    /**
     * Public methods
     */

    animateIn = () => {
        this.about.tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart');
    };

    animateOut = () => {
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}

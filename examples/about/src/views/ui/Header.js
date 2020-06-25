import { Interface, Stage } from 'alien.js';

import { Config } from '../../config/Config.js';
import { Events } from '../../config/Events.js';
import { AudioController } from '../../controllers/audio/AudioController.js';
import { NavLink } from './NavLink.js';
import { HeaderInfo } from './HeaderInfo.js';

export class Header extends Interface {
    constructor() {
        super('.header');

        this.initHTML();
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    initHTML() {
        this.css({
            left: 20,
            top: 20,
            right: 20
        });
    }

    initViews() {
        this.about = new NavLink('Alien.js', 'https://github.com/pschroen/alien.js');
        this.about.css({
            x: -10,
            opacity: 0
        });
        this.add(this.about);

        this.info = new HeaderInfo();
        this.info.css({
            right: 0,
            x: -10,
            opacity: 0
        });
        this.add(this.info);
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
                top: 10,
                right: 10
            });
        } else {
            this.css({
                left: 20,
                top: 20,
                right: 20
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
        this.info.tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 200);
    };

    animateOut = () => {
    };

    destroy = () => {
        this.removeListeners();

        return super.destroy();
    };
}

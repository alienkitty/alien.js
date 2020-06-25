import { Interface, Stage } from 'alien.js';

import { Events } from '../config/Events.js';
import { Header } from './ui/Header.js';
import { Footer } from './ui/Footer.js';
import { MuteButton } from './ui/MuteButton.js';

export class UI extends Interface {
    constructor() {
        super('.ui');

        this.buttons = [];

        this.initHTML();
        this.initViews();

        this.addListeners();
    }

    initHTML() {
        this.css({
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        });
    }

    initViews() {
        this.header = new Header();
        this.add(this.header);

        this.footer = new Footer();
        this.add(this.footer);

        this.muteButton = new MuteButton();
        this.add(this.muteButton);

        this.buttons.push(this.muteButton);
    }

    addListeners() {
        Stage.events.on(Events.UI_SHOW, this.onShow);
        Stage.events.on(Events.UI_HIDE, this.onHide);
    }

    /**
     * Event handlers
     */

    onShow = () => {
        this.header.animateIn();
        this.footer.animateIn();

        this.buttons.forEach(button => {
            button.showButton();
        });
    };

    onHide = () => {
        this.header.animateOut();
        this.footer.animateOut();

        this.buttons.forEach(button => {
            button.hideButton();
        });
    };

    /**
     * Public methods
     */

    update = () => {
        this.buttons.forEach(button => {
            if (button.needsUpdate) {
                button.update();
            }
        });

        this.header.info.update();
    };
}

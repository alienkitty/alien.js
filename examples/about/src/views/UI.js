import { Events, Interface, Stage } from 'alien.js';

import { Global } from '../config/Global.js';
import { AudioController } from '../controllers/audio/AudioController.js';
import { Details } from './ui/Details.js';
import { Header } from './ui/Header.js';
import { DetailsButton } from './ui/DetailsButton.js';
import { MuteButton } from './ui/MuteButton.js';
import { Instructions } from './ui/Instructions.js';

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
        this.details = new Details();
        this.add(this.details);

        this.header = new Header();
        this.add(this.header);

        this.detailsButton = new DetailsButton();
        this.add(this.detailsButton);

        this.muteButton = new MuteButton();
        this.add(this.muteButton);

        this.instructions = new Instructions();
        this.add(this.instructions);

        this.buttons.push(this.detailsButton);
        this.buttons.push(this.muteButton);
    }

    addListeners() {
        Stage.events.on(Events.UPDATE, this.onUsers);
        Stage.events.on(Events.KEY_UP, this.onKeyUp);
        this.details.events.on(Events.CLICK, this.onDetails);
        this.detailsButton.events.on(Events.CLICK, this.onDetails);
    }

    /**
     * Event handlers
     */

    onUsers = () => {
        this.detailsButton.swapIndex();
    };

    onKeyUp = e => {
        if (e.keyCode === 27) {
            // Esc
            this.onDetails();
        }
    };

    onDetails = () => {
        if (!Global.DETAILS_OPEN) {
            Global.DETAILS_OPEN = true;

            this.detailsButton.open();
            this.details.animateIn();

            if (Global.SOUND) {
                AudioController.trigger('about_section');
            }
        } else {
            Global.DETAILS_OPEN = false;

            this.details.animateOut();
            this.detailsButton.close();

            if (Global.SOUND) {
                AudioController.trigger('fluid_section');
            }
        }
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

    animateIn = () => {
        this.header.animateIn();

        this.buttons.forEach(button => {
            button.animateIn();
        });
    };

    animateOut = () => {
        this.header.animateOut();

        this.buttons.forEach(button => {
            button.animateOut();
        });
    };
}

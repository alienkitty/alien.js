/**
 * @author pschroen / https://ufo.ai/
 *
 * Based on https://gist.github.com/jesperlandberg/dd2cb6c6d7c928601b7f0229db818171
 */

import { Events } from '../../config/Events.js';
import { Component } from '../Component.js';
import { Stage } from '../../controllers/Stage.js';

import { ticker } from '../../tween/Ticker.js';
import { defer } from '../../tween/Tween.js';
import { lerp } from '../Utils.js';

export class Smooth extends Component {
    constructor(content) {
        super();

        this.content = content;

        this.pos = 0;
        this.lerpSpeed = 0.1;

        this.initHTML();
    }

    initHTML() {
        this.content.css({ willChange: 'transform' });

        history.scrollRestoration = 'manual';
    }

    addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        ticker.remove(this.onUpdate);
    }

    /**
     * Event handlers
     */

    onResize = async () => {
        await defer();

        document.body.style.height = `${this.content.element.getBoundingClientRect().height}px`;

        this.pos = window.scrollY;
    };

    onUpdate = () => {
        this.pos = lerp(this.pos, window.scrollY, this.lerpSpeed);
        this.pos = Math.round(this.pos * 100) / 100;

        this.content.css({ y: -this.pos });
    };

    /**
     * Public methods
     */

    enable = () => {
        this.addListeners();

        defer(this.onResize);
    };

    disable = () => {
        this.removeListeners();

        document.body.style.height = '';
    };

    destroy = () => {
        this.disable();

        return super.destroy();
    };
}

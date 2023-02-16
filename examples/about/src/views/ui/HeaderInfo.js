import { Interface } from 'alien.js/three';

import { Styles } from '../../config/Styles.js';

export class HeaderInfo extends Interface {
    constructor() {
        super('.info');

        this.count = 0;
        this.time = 0;
        this.prev = 0;
        this.fps = 0;

        this.initHTML();
    }

    initHTML() {
        this.css({
            cssFloat: 'right',
            padding: 10,
            webkitUserSelect: 'none',
            userSelect: 'none'
        });

        this.number = new Interface('.number');
        this.number.css({
            ...Styles.number
        });
        this.number.text(this.fps);
        this.add(this.number);
    }

    /**
     * Public methods
     */

    update = () => {
        this.time = performance.now();

        if (this.time - 1000 > this.prev) {
            this.prev = this.time;
            this.fps = this.count;
            this.count = 0;
        }

        this.count++;

        this.number.text(this.fps);
    };
}

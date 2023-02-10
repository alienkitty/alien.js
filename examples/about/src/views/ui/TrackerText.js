import { Interface } from 'alien.js';

import { Styles } from '../../config/Styles.js';

export class TrackerText extends Interface {
    constructor() {
        super('.text');

        this.initHTML();
    }

    initHTML() {
        this.css({
            left: 20,
            top: -3
        });

        this.name = new Interface('.name');
        this.name.css({
            position: 'relative',
            ...Styles.number,
            lineHeight: 18,
            whiteSpace: 'nowrap'
        });
        this.add(this.name);

        this.latency = new Interface('.latency');
        this.latency.css({
            position: 'relative',
            ...Styles.small,
            opacity: 0.7
        });
        this.add(this.latency);
    }

    /**
     * Public methods
     */

    setData = data => {
        if (!data) {
            return;
        }

        if (data.remoteAddress) {
            // this.name.text(data.nickname || data.remoteAddress);
            this.name.text(data.nickname || data.id);
        }

        if (data.latency) {
            this.latency.text(`${data.latency}ms`);
        }
    };
}

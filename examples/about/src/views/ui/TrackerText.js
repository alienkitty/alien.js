import { Interface } from 'alien.js';

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

        this.text = new Interface('.text');
        this.text.css({
            position: 'relative',
            letterSpacing: 1
        });
        this.add(this.text);

        this.latency = new Interface('.latency');
        this.latency.css({
            position: 'relative',
            fontSize: 10,
            letterSpacing: 0.5,
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
            // this.text.text(data.nickname || data.remoteAddress);
            this.text.text(data.nickname || data.id);
        }

        if (data.latency) {
            this.latency.text(`${data.latency}ms`);
        }
    };
}

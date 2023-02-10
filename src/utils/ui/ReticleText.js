/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '../Interface.js';

export class ReticleText extends Interface {
    constructor() {
        super('.text');

        this.initHTML();
    }

    initHTML() {
        this.css({
            position: 'absolute',
            left: 20,
            top: -3
        });

        this.primary = new Interface('.primary');
        this.primary.css({
            position: 'relative',
            lineHeight: 18,
            whiteSpace: 'nowrap'
        });
        this.add(this.primary);

        this.secondary = new Interface('.secondary');
        this.secondary.css({
            position: 'relative',
            opacity: 0.7
        });
        this.add(this.secondary);
    }

    /**
     * Public methods
     */

    setData = data => {
        if (!data) {
            return;
        }

        if (data.primary) {
            this.primary.text(data.primary);
        }

        if (data.secondary) {
            this.secondary.text(data.secondary);
        }
    };
}

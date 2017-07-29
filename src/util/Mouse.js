/**
 * Mouse helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Device } from './Device';

let Mouse = new ( // Singleton pattern

class Mouse {

    constructor() {
        this.x = 0;
        this.y = 0;

        let moved = e => {
            this.x = e.x;
            this.y = e.y;
        };

        this.capture = () => {
            if (!this.active) {
                this.active = true;
                this.x = 0;
                this.y = 0;
                if (Device.mobile) {
                    window.addEventListener('touchmove', moved);
                    window.addEventListener('touchstart', moved);
                } else {
                    window.addEventListener('mousemove', moved);
                }
            }
        };

        this.stop = () => {
            this.active = false;
            this.x = 0;
            this.y = 0;
            if (Device.mobile) {
                window.removeEventListener('touchmove', moved);
                window.removeEventListener('touchstart', moved);
            } else {
                window.removeEventListener('mousemove', moved);
            }
        };
    }
}

)(); // Singleton pattern

export { Mouse };

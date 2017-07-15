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
            this.x = 0;
            this.y = 0;
            if (!Device.mobile) {
                window.addEventListener('mousemove', moved);
            } else {
                window.addEventListener('touchmove', moved);
                window.addEventListener('touchstart', moved);
            }
        };

        this.stop = () => {
            this.x = 0;
            this.y = 0;
            if (!Device.mobile) {
                window.removeEventListener('mousemove', moved);
            } else {
                window.removeEventListener('touchmove', moved);
                window.removeEventListener('touchstart', moved);
            }
        };
    }
}

)(); // Singleton pattern

export { Mouse };

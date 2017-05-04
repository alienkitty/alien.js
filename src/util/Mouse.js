/**
 * Mouse helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
            window.addEventListener('mousemove', moved, false);
        };

        this.stop = () => {
            this.x = 0;
            this.y = 0;
            window.removeEventListener('mousemove', moved, false);
        };
    }
}

export { Mouse };

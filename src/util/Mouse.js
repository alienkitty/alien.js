/**
 * Mouse interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interaction } from './Interaction';
import { Stage } from '../view/Stage';

class Mouse {

    constructor() {
        let self = this;
        this.x = 0;
        this.y = 0;

        function update(e) {
            self.x = e.x;
            self.y = e.y;
        }

        this.capture = () => {
            if (!this.active) {
                this.active = true;
                this.input = new Interaction();
                this.input.events.add(Interaction.START, update);
                this.input.events.add(Interaction.MOVE, update);
                this.x = Stage.width / 2;
                this.y = Stage.height / 2;
            }
        };

        this.stop = () => {
            this.active = false;
            this.input.events.remove(Interaction.START, update);
            this.input.events.remove(Interaction.MOVE, update);
            this.input = null;
            this.x = this.y = 0;
        };
    }
}

export { Mouse };

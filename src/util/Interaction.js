/**
 * Interaction helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Render } from './Render';
import { Utils } from './Utils';
import { Stage } from '../view/Stage';
import { Vector2 } from './Vector2';

class Interaction {

    constructor(object = Stage) {

        if (!Interaction.instance) {
            Interaction.CLICK = 'interaction_click';
            Interaction.START = 'interaction_start';
            Interaction.MOVE  = 'interaction_move';
            Interaction.DRAG  = 'interaction_drag';
            Interaction.END   = 'interaction_end';

            const events = {
                    touchstart: [],
                    touchmove: [],
                    touchend: []
                },
                touchStart = e => events.touchstart.forEach(callback => callback(e)),
                touchMove = e => events.touchmove.forEach(callback => callback(e)),
                touchEnd = e => events.touchend.forEach(callback => callback(e));

            Interaction.bind = (event, callback) => events[event].push(callback);
            Interaction.unbind = (event, callback) => events[event].remove(callback);

            Stage.bind('touchstart', touchStart);
            Stage.bind('touchmove', touchMove);
            Stage.bind('touchend', touchEnd);
            Stage.bind('touchcancel', touchEnd);

            Interaction.instance = this;
        }

        const self = this;
        this.events = new Events();
        this.x = 0;
        this.y = 0;
        this.hold = new Vector2();
        this.last = new Vector2();
        this.delta = new Vector2();
        this.move = new Vector2();
        this.velocity = new Vector2();
        let distance, timeDown, timeMove;

        addListeners();

        function addListeners() {
            if (object === Stage) Interaction.bind('touchstart', down);
            else object.bind('touchstart', down);
            Interaction.bind('touchmove', move);
            Interaction.bind('touchend', up);
        }

        function down(e) {
            e.preventDefault();
            self.isTouching = true;
            self.x = e.x;
            self.y = e.y;
            self.hold.x = self.last.x = e.x;
            self.hold.y = self.last.y = e.y;
            self.delta.x = self.move.x = self.velocity.x = 0;
            self.delta.y = self.move.y = self.velocity.y = 0;
            distance = 0;
            self.events.fire(Interaction.START, e);
            timeDown = timeMove = Render.TIME;
        }

        function move(e) {
            if (self.isTouching) {
                self.move.x = e.x - self.hold.x;
                self.move.y = e.y - self.hold.y;
            }
            self.x = e.x;
            self.y = e.y;
            self.delta.x = e.x - self.last.x;
            self.delta.y = e.y - self.last.y;
            self.last.x = e.x;
            self.last.y = e.y;
            distance += self.delta.length();
            const delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
            timeMove = Render.TIME;
            self.velocity.x = Math.abs(self.delta.x) / delta;
            self.velocity.y = Math.abs(self.delta.y) / delta;
            self.events.fire(Interaction.MOVE, e);
            if (self.isTouching) self.events.fire(Interaction.DRAG, e);
        }

        function up(e) {
            if (!self.isTouching) return;
            self.isTouching = false;
            self.move.x = 0;
            self.move.y = 0;
            const delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
            if (delta > 100) {
                self.delta.x = 0;
                self.delta.y = 0;
            }
            self.events.fire(Interaction.END, e);
            if (distance < 20 && Render.TIME - timeDown < 2000) self.events.fire(Interaction.CLICK, e);
        }

        this.destroy = () => {
            Interaction.unbind('touchstart', down);
            Interaction.unbind('touchmove', move);
            Interaction.unbind('touchend', up);
            if (object !== Stage && object.unbind) object.unbind('touchstart', down);
            this.events.destroy();
            return Utils.nullObject(this);
        };
    }
}

export { Interaction };

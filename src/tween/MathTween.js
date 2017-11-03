/**
 * Mathematical.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenManager } from './TweenManager';
import { Interpolation } from './Interpolation';

class MathTween {

    constructor(object, props, time, ease, delay, update, callback) {
        let self = this;
        let startTime, startValues, endValues, paused, elapsed;

        initMathTween();

        function killed() {
            return !self || self.kill || !object;
        }

        function initMathTween() {
            if (killed()) return;
            if (!object.multiTween && object.mathTween) object.mathTween.kill = true;
            TweenManager.addMathTween(self);
            object.mathTween = self;
            ease = Interpolation.convertEase(ease);
            startTime = Date.now();
            startTime += delay;
            endValues = props;
            startValues = {};
            for (let prop in endValues) if (typeof object[prop] === 'number') startValues[prop] = object[prop];
        }

        function clear(stop) {
            if (killed()) return;
            self.kill = true;
            if (!stop) {
                for (let prop in endValues) if (typeof endValues[prop] === 'number') object[prop] = endValues[prop];
                if (object.transform) object.transform();
            }
            TweenManager.removeMathTween(self);
            object.mathTween = null;
        }

        this.update = t => {
            if (killed()) return;
            if (paused || t < startTime) return;
            elapsed = (t - startTime) / time;
            elapsed = elapsed > 1 ? 1 : elapsed;
            let delta = ease(elapsed);
            for (let prop in startValues) {
                if (typeof startValues[prop] === 'number') {
                    let start = startValues[prop],
                        end = endValues[prop];
                    object[prop] = start + (end - start) * delta;
                }
            }
            if (update) update(delta);
            if (elapsed === 1) {
                clear();
                if (callback) callback();
            }
            if (object.transform) object.transform();
        };

        this.pause = () => {
            paused = true;
        };

        this.resume = () => {
            paused = false;
            startTime = Date.now() - elapsed * time;
        };

        this.stop = () => clear(true);
    }
}

export { MathTween };

/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (() => {
    const start = Date.now();
    return callback => Delayed(() => callback(Date.now() - start), 1000 / 60);
})();

class Render {

    constructor() {
        let self = this;
        let render = [],
            last = performance.now(),
            skipLimit = 200;

        requestAnimationFrame(step);

        function step(tsl) {
            let delta = tsl - last;
            delta = Math.min(skipLimit, delta);
            last = tsl;
            self.TIME = tsl;
            self.DELTA = delta;
            for (let i = render.length - 1; i >= 0; i--) {
                let callback = render[i];
                if (!callback) {
                    render.remove(callback);
                    continue;
                }
                if (callback.fps) {
                    if (tsl - callback.last < 1000 / callback.fps) continue;
                    callback(++callback.frame);
                    callback.last = tsl;
                    continue;
                }
                callback(tsl, delta);
            }
            if (!self.paused) requestAnimationFrame(step);
        }

        this.start = (callback, fps) => {
            if (fps) {
                callback.fps = fps;
                callback.last = -Infinity;
                callback.frame = -1;
            }
            if (!~render.indexOf(callback)) render.unshift(callback);
        };

        this.stop = callback => {
            render.remove(callback);
        };

        this.pause = () => {
            this.paused = true;
        };

        this.resume = () => {
            if (!this.paused) return;
            this.paused = false;
            requestAnimationFrame(step);
        };
    }
}

export { Render };

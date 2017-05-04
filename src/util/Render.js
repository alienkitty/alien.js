/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

// Shim layer with setTimeout fallback
if (window.requestAnimationFrame === undefined) {
    window.requestAnimationFrame = (() => {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (callback => {
            Delayed(callback, 1000 / 60);
        });
    })();
}

class Render {

    constructor() {
        this.TIME = Date.now();
        this.TARGET_FPS = 60;
        let last,
            render = [],
            time = Date.now(),
            timeSinceRender = 0,
            rendering = false;

        let focus = e => {
            if (e.type === 'focus') last = Date.now();
        };

        let step = () => {
            let t = Date.now(),
                timeSinceLoad = t - time,
                diff = 0,
                fps = 60;
            if (last) {
                diff = t - last;
                fps = 1000 / diff;
            }
            last = t;
            this.FPS = fps;
            this.TIME = t;
            this.DELTA = diff;
            this.TSL = timeSinceLoad;
            for (let i = render.length - 1; i > -1; i--) {
                let callback = render[i];
                if (!callback) continue;
                if (callback.fps) {
                    timeSinceRender += diff > 200 ? 0 : diff;
                    if (timeSinceRender < 1000 / callback.fps) continue;
                    timeSinceRender -= 1000 / callback.fps;
                }
                callback(t, timeSinceLoad, diff, fps, callback.frameCount++);
            }
            if (render.length) {
                window.requestAnimationFrame(step);
            } else {
                rendering = false;
                window.events.remove(Events.BROWSER_FOCUS, focus);
            }
        };

        this.start = (callback, fps) => {
            if (this.TARGET_FPS < 60) fps = this.TARGET_FPS;
            if (typeof fps === 'number') callback.fps = fps;
            callback.frameCount = 0;
            if (render.indexOf(callback) === -1) render.push(callback);
            if (render.length && !rendering) {
                rendering = true;
                window.requestAnimationFrame(step);
                window.events.add(Events.BROWSER_FOCUS, focus);
            }
        };

        this.stop = callback => {
            let i = render.indexOf(callback);
            if (i > -1) render.splice(i, 1);
        };
    }
}

export { Render };

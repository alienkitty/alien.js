/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events, Stage, Interface, Canvas, CanvasGraphics, Utils, Assets, AssetLoader, TweenManager } from '../alien.js/src/Alien';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

class AlienKittyCanvas extends Interface {

    constructor() {
        super('AlienKittyCanvas');
        const self = this;
        let canvas, alienkittyimg, eyelidimg, alienkitty, eyelid1, eyelid2;

        initHTML();
        initCanvas();
        initImages();

        function initHTML() {
            self.size(90, 86).center().css({ opacity: 0 });
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, 90, 86, true);
        }

        function initImages() {
            alienkittyimg = Assets.createImage('assets/images/alienkitty.svg');
            eyelidimg = Assets.createImage('assets/images/alienkitty_eyelid.svg');
            Promise.all([Assets.loadImage(alienkittyimg), Assets.loadImage(eyelidimg)]).then(finishSetup);
        }

        function finishSetup() {
            alienkitty = new CanvasGraphics(90, 86);
            alienkitty.drawImage(alienkittyimg);
            eyelid1 = new CanvasGraphics(24, 14);
            eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
            eyelid1.drawImage(eyelidimg);
            eyelid2 = new CanvasGraphics(24, 14);
            eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
            eyelid2.drawImage(eyelidimg);
            alienkitty.add(eyelid1);
            alienkitty.add(eyelid2);
            canvas.add(alienkitty);
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function loop() {
            canvas.render();
        }

        this.animateIn = () => {
            blink();
            this.tween({ opacity: 1 }, 500, 'easeOutQuart');
            this.startRender(loop);
        };

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 500, 'easeInOutQuad', () => {
                this.stopRender(loop);
                this.clearTimers();
                if (callback) callback();
            });
        };
    }
}

class Progress extends Interface {

    constructor() {
        super('Progress');
        const self = this;
        const size = 90;
        let canvas, context;

        initHTML();
        initCanvas();
        this.startRender(loop);

        function initHTML() {
            self.size(size).center();
            self.progress = 0;
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, size, size, true);
            context = canvas.context;
            context.lineWidth = 5;
        }

        function loop() {
            if (self.progress >= 1 && !self.complete) complete();
            context.clearRect(0, 0, size, size);
            const progress = self.progress || 0,
                x = size / 2,
                y = size / 2,
                radius = size * 0.4,
                startAngle = Math.radians(-90),
                endAngle = Math.radians(-90) + Math.radians(progress * 360);
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, false);
            context.strokeStyle = Config.UI_COLOR;
            context.stroke();
        }

        function complete() {
            self.complete = true;
            self.events.fire(Events.COMPLETE);
            self.stopRender(loop);
        }

        this.update = e => {
            if (this.complete) return;
            TweenManager.tween(this, { progress: e.percent }, 500, 'easeOutCubic');
        };

        this.animateOut = callback => {
            this.tween({ scale: 0.9, opacity: 0 }, 400, 'easeInCubic', callback);
        };
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        const self = this;
        let loader, progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.size('100%');
        }

        function initLoader() {
            loader = self.initClass(AssetLoader, Config.ASSETS);
            loader.events.add(Events.PROGRESS, loadUpdate);
        }

        function initProgress() {
            progress = self.initClass(Progress);
            progress.events.add(Events.COMPLETE, loadComplete);
        }

        function loadUpdate(e) {
            progress.update(e);
        }

        function loadComplete() {
            self.events.fire(Events.COMPLETE);
        }

        this.animateOut = callback => {
            progress.animateOut(callback);
        };
    }
}

class Main {

    constructor({ container }) {

        container.appendChild(Stage.element);

        let loader, wrapper, alienkitty;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%').enable3D(2000);
            wrapper = Stage.create('.wrapper');
            wrapper.size('100%').transform({ z: -300 }).enable3D();
            alienkitty = wrapper.initClass(AlienKittyCanvas);
        }

        function initLoader() {
            loader = Stage.initClass(Loader);
            loader.events.add(Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            loader.animateOut(() => {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            wrapper.tween({ z: 0 }, 7000, 'easeOutCubic');
            alienkitty.animateIn();
        }
    }
}

export default Main;

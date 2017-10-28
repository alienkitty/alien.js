/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Stage, Interface, Canvas, CanvasGraphics, Utils, AssetLoader, FontLoader, Images, TweenManager } from '../alien.js/src/Alien';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

class AlienKittyCanvas extends Interface {

    constructor() {
        super('AlienKittyCanvas');
        let self = this;
        let canvas, alienkittyimg, eyelidimg, alienkitty, eyelid1, eyelid2;

        initHTML();
        initCanvas();
        initImages();

        function initHTML() {
            self.size(90, 86).center().css({opacity:0});
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, 90, 86, true);
        }

        function initImages() {
            let promise = img => {
                let p = Promise.create();
                img.onload = p.resolve;
                return p;
            };
            alienkittyimg = Images.createImg('assets/images/alienkitty.svg');
            eyelidimg = Images.createImg('assets/images/alienkitty_eyelid.svg');
            Promise.all([promise(alienkittyimg), promise(eyelidimg)]).then(finishSetup);
        }

        function finishSetup() {
            alienkitty = new CanvasGraphics(90, 86);
            alienkitty.drawImage(alienkittyimg);
            eyelid1 = new CanvasGraphics(24, 14);
            eyelid1.transformPoint('50%', 0).transform({x:35, y:25, scaleX:1.5, scaleY:0.01});
            eyelid1.drawImage(eyelidimg);
            eyelid2 = new CanvasGraphics(24, 14);
            eyelid2.transformPoint(0, 0).transform({x:53, y:26, scaleX:1, scaleY:0.01});
            eyelid2.drawImage(eyelidimg);
            canvas.add(alienkitty);
            canvas.add(eyelid1);
            canvas.add(eyelid2);
        }

        function loop() {
            canvas.render();
        }

        function blink() {
            Delayed(Utils.headsTails(blink1, blink2), Utils.doRandom(0, 10000));
        }

        function blink1() {
            TweenManager.tween(eyelid1, {scaleY:1.5}, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, {scaleY:0.01}, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, {scaleX:1.3, scaleY:1.3}, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, {scaleX:1, scaleY:0.01}, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            TweenManager.tween(eyelid1, {scaleY:1.5}, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, {scaleY:0.01}, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, {scaleX:1.3, scaleY:1.3}, 180, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, {scaleX:1, scaleY:0.01}, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        this.animateIn = () => {
            blink();
            this.tween({opacity:1}, 500, 'easeOutQuart');
            this.startRender(loop);
        };

        this.animateOut = callback => {
            this.tween({opacity:0}, 500, 'easeInOutQuad', () => {
                self.stopRender(loop);
                if (callback) callback();
            });
        };
    }
}

class Progress extends Interface {

    constructor() {
        super('Progress');
        let self = this;
        this.progress = 0;
        let canvas, context,
            size = 90;

        initHTML();
        initCanvas();
        this.startRender(loop);

        function initHTML() {
            self.size(size).center();
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, size, size, true);
            context = canvas.context;
            context.lineWidth = 5;
        }

        function loop() {
            if (self.progress >= 1 && !self.complete) complete();
            context.clearRect(0, 0, size, size);
            let progress = self.progress || 0,
                x = size / 2,
                y = size / 2,
                radius = size * 0.4,
                startAngle = Utils.toRadians(-90),
                endAngle = Utils.toRadians(-90) + Utils.toRadians(progress * 360);
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
            TweenManager.tween(this, {progress:e.percent}, 500, 'easeOutCubic');
        };

        this.animateOut = callback => {
            this.tween({scale:0.9, opacity:0}, 400, 'easeInCubic', callback);
        };
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        let self = this;
        let loader, progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.size('100%');
        }

        function initLoader() {
            loader = new AssetLoader(Config.ASSETS);
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
            FontLoader.loadFonts(['Titillium Web', 'Lato', 'icomoon']).then(() => {
                self.loaded = true;
                self.events.fire(Events.COMPLETE);
            });
        }

        this.animateOut = callback => {
            progress.animateOut(callback);
        };
    }
}

class Main {

    constructor() {
        let self = this;
        let loader, wrapper, alienkitty;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%').enable3D(2000);
            wrapper = Stage.create('.wrapper');
            wrapper.size('100%').transform({z:-300}).enable3D();
            alienkitty = wrapper.initClass(AlienKittyCanvas);
        }

        function initLoader() {
            loader = Stage.initClass(Loader);
            loader.events.add(Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            self.loaded = true;
            loader.animateOut(() => {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            wrapper.tween({z:0}, 7000, 'easeOutCubic');
            alienkitty.animateIn();
        }
    }
}

new Main();

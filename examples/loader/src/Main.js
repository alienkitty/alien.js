/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Stage, Interface, Canvas, Utils, AssetLoader, FontLoader, TweenManager } from '../alien.js/src/Alien';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

class AlienKitty extends Interface {

    constructor() {
        super('AlienKitty');
        let self = this;
        let alienkitty, eyelid1, eyelid2,
            size = 90;

        initHTML();
        addListeners();

        function initHTML() {
            self.size(size).center().css({opacity:0});
            alienkitty = self.create('.alienkitty').size(90, 86).center().transform({scale:size / 90});
            eyelid1 = alienkitty.create('.eyelid1').size(24, 14).css({left:35, top:25}).transformPoint('50%', 0).transform({scaleX:1.5, scaleY:0.01});
            eyelid2 = alienkitty.create('.eyelid2').size(24, 14).css({left:53, top:26}).transformPoint(0, 0).transform({scaleX:1, scaleY:0.01});
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            self.loaded = true;
            alienkitty.bg('assets/images/alienkitty.svg');
            eyelid1.bg('assets/images/alienkitty_eyelid.svg');
            eyelid2.bg('assets/images/alienkitty_eyelid.svg');
            blink();
        }

        function blink() {
            Delayed(Utils.headsTails(blink1, blink2), Utils.doRandom(0, 10000));
        }

        function blink1() {
            eyelid1.tween({scaleY:1.5}, 120, 'easeOutCubic', () => {
                eyelid1.tween({scaleY:0.01}, 180, 'easeOutCubic');
            });
            eyelid2.tween({scaleX:1.3, scaleY:1.3}, 120, 'easeOutCubic', () => {
                eyelid2.tween({scaleX:1, scaleY:0.01}, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            eyelid1.tween({scaleY:1.5}, 120, 'easeOutCubic', () => {
                eyelid1.tween({scaleY:0.01}, 180, 'easeOutCubic');
            });
            eyelid2.tween({scaleX:1.3, scaleY:1.3}, 180, 'easeOutCubic', () => {
                eyelid2.tween({scaleX:1, scaleY:0.01}, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        this.animateIn = () => {
            this.tween({opacity:1}, 500, 'easeOutQuart');
        };

        this.animateOut = () => {
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
            self.size(size, size).center();
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, '.progress', size, size, true);
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
            alienkitty = wrapper.initClass(AlienKitty);
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

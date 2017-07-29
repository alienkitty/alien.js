/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Stage, Interface, Device, Mouse, Accelerometer, Utils, FontLoader, TweenManager } from '../alien.js/src/Alien';

Config.UI_COLOR = 'white';
Config.UI_OFFSET = Device.phone ? 20 : 35;
Config.ABOUT_COPY = ['A lightweight web framework abducted from Active Theory’s <a href="https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e" target="_blank">Hydra</a> and ported to an ES6 module bundler.'];
Config.ABOUT_DOWNLOAD_URL = 'https://raw.github.com/pschroen/alien.js/master/build/alien.min.js';
Config.ABOUT_GITHUB_URL = 'https://github.com/pschroen/alien.js';
Config.ABOUT_TWITTER_URL = 'https://twitter.com/pschroen';

Events.OPEN_ABOUT = 'open_about';
Events.CLOSE_ABOUT = 'close_about';

class UIAboutIcons extends Interface {

    constructor() {
        super('UIAboutIcons');
        let self = this;
        let github, twitter,
            size = 48;

        initHTML();
        initGitHub();
        initTwitter();

        function initHTML() {
            self.size('100%', size).transform({z:-200}).enable3D();
            self.fontStyle('icomoon', size, Config.UI_COLOR);
            self.css({
                position: 'relative',
                display: 'block',
                marginTop: 20,
                fontWeight: 'normal',
                lineHeight: size,
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.8)',
                opacity: 0
            });
        }

        function initGitHub() {
            github = self.create('.icon-github');
            github.url = Config.ABOUT_GITHUB_URL;
            github.interact(hover, click);
        }

        function initTwitter() {
            twitter = self.create('.icon-twitter').css({left:size + 20});
            twitter.url = Config.ABOUT_TWITTER_URL;
            twitter.interact(hover, click);
        }

        function hover(e) {
            if (e.action === 'over') e.object.tween({opacity:0.5}, 100, 'easeOutSine');
            else e.object.tween({opacity:1}, 300, 'easeOutSine');
        }

        function click(e) {
            getURL(e.object.url);
        }

        this.animateIn = () => {
            this.tween({z:-50, x:-10, opacity:1}, 2000, 'easeOutCubic');
        };

        this.animateOut = () => {
            this.tween({z:-100, scale:0.9, opacity:0}, 300, 'easeOutCubic');
        };
    }
}

class UIAboutCopy extends Interface {

    constructor() {
        super('UIAboutCopy');
        let self = this;
        let copy = Config.ABOUT_COPY,
            texts = [];

        initHTML();
        initText();

        function initHTML() {
            self.invisible().enable3D();
            self.css({
                position: 'relative',
                display: 'block',
                width: '100%',
                marginTop: 20
            });
        }

        function initText() {
            for (let i = 0; i < copy.length; i++) {
                let text = self.create('.text');
                text.fontStyle('Lato', 27, Config.UI_COLOR);
                text.css({
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    marginBottom: 20,
                    fontWeight: '400',
                    textAlign: 'left',
                    lineHeight: '1.45',
                    textShadow: '0 1px 1px rgba(0, 0, 0, 0.8)'
                });
                text.html(copy[i]);
                texts.push(text);
            }
        }

        this.animateIn = () => {
            this.visible();
            for (let i = 0; i < texts.length; i++) texts[i].css({opacity:0}).transform({z:-150}).tween({z:-50, x:-10, opacity:1}, 2000, 'easeOutCubic', i * 200);
        };

        this.animateOut = () => {
            for (let i = 0; i < texts.length; i++) texts[i].tween({z:-100, opacity:0}, 300, 'easeOutCubic', i * 100);
        };
    }
}

class UIAboutTitle extends Interface {

    constructor() {
        super('UIAboutTitle');
        let self = this;
        let size = 160,
            letters;

        initHTML();

        function initHTML() {
            self.invisible().enable3D();
            self.fontStyle('Titillium Web', size, Config.UI_COLOR);
            self.css({
                position: 'relative',
                display: 'block',
                height: size,
                fontWeight: '700',
                textAlign: 'left',
                letterSpacing: -4,
                lineHeight: size,
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.8)'
            });
            self.text('Alien.js');
            letters = self.split('.');
        }

        this.animateIn = () => {
            this.visible();
            for (let i = 0; i < letters.length; i++) letters[i].transform({z:-100}).css({opacity:0}).tween({z:100 - i * 50, opacity:1}, 4000, 'easeOutBack', i * 200);
        };

        this.animateOut = () => {
            for (let i = 0; i < letters.length; i++) letters[i].tween({z:-50 - i * 50, opacity:0}, 700, 'easeOutCubic', i * 100);
        };
    }
}

class UIAbout extends Interface {

    constructor() {
        super('UIAbout');
        let self = this;
        let wrapper, title, copy, icons,
            tilt = {
                x: 4,
                y: 8,
                ease: 0.05
            };

        initHTML();
        addListeners();
        resizeHandler();
        this.startRender(loop);
        Delayed(() => this.animateIn(), 300);

        function initHTML() {
            self.size('100%').enable3D(2000);
            self.click(click);
            wrapper = self.create('.wrapper');
            wrapper.size(800, 650).center().enable3D();
            wrapper.rotationX = 0;
            wrapper.rotationY = 0;
            title = wrapper.initClass(UIAboutTitle);
            copy = wrapper.initClass(UIAboutCopy);
            icons = wrapper.initClass(UIAboutIcons);
        }

        function click() {
            Stage.events.fire(Events.CLOSE_ABOUT);
        }

        function addListeners() {
            self.events.subscribe(Events.RESIZE, resizeHandler);
        }

        function resizeHandler() {
            let scaleX = Utils.convertRange(Stage.width, 0, 1700, 0, 1.1, true),
                scaleY = Utils.convertRange(Stage.height, 0, 1500, 0, 1.1, true),
                scale = Math.min(scaleX, scaleY);
            if (Device.mobile) scale = Math.min(1, scale * (Stage.width > Stage.height ? 1.5 : 1.8));
            wrapper.scale = scale;
            wrapper.transform();
            if (Device.mobile) {
                if (Stage.width > Stage.height) wrapper.size(1100, 500).center();
                else wrapper.size(700, 700).center();
            }
        }

        function loop() {
            // UI rotation
            if (Device.mobile) {
                wrapper.rotationX += (Utils.convertRange(Accelerometer.y, -10, 10, -tilt.x, tilt.x) - wrapper.rotationX) * tilt.ease;
                wrapper.rotationY += (Utils.convertRange(Accelerometer.x, -5, 5, tilt.y, -tilt.y) - wrapper.rotationY) * tilt.ease;
            } else {
                wrapper.rotationX += (Utils.convertRange(Mouse.y, 0, Stage.height, -tilt.x, tilt.x) - wrapper.rotationX) * tilt.ease;
                wrapper.rotationY += (Utils.convertRange(Mouse.x, 0, Stage.width, tilt.y, -tilt.y) - wrapper.rotationY) * tilt.ease;
            }
            wrapper.transform();
        }

        this.animateIn = () => {
            Delayed(title.animateIn, 200);
            Delayed(copy.animateIn, 600);
            Delayed(icons.animateIn, 1300);
            // Use math tween with UI rotation
            wrapper.z = -300;
            TweenManager.tween(wrapper, {z:0}, 7000, 'easeOutCubic');
            //TweenManager.tween(wrapper, {z:0, damping:0.1}, 0.9, 'spring', 2000);
        };

        this.animateOut = callback => {
            title.animateOut();
            copy.animateOut();
            icons.animateOut();
            Delayed(callback, 1000);
        };
    }
}

class Main {

    constructor() {
        let about;

        initStage();
        addListeners();
        FontLoader.loadFonts(['Titillium Web', 'Lato', 'icomoon']).then(openAbout);

        function initStage() {
            Stage.size('100%');
            Stage.interact(hover, click);

            Mouse.capture();
            Accelerometer.capture();
            Mouse.x = Stage.width / 2;
            Mouse.y = Stage.height / 2;
        }

        function hover() {
        }

        function click() {
            Stage.events.fire(Events.OPEN_ABOUT);
        }

        function addListeners() {
            Stage.events.add(Events.OPEN_ABOUT, openAbout);
            Stage.events.add(Events.CLOSE_ABOUT, closeAbout);
        }

        function openAbout() {
            Stage.hit.mouseEnabled(false);
            about = Stage.initClass(UIAbout);
        }

        function closeAbout() {
            Stage.hit.mouseEnabled(true);
            if (about) about.animateOut(() => {
                if (about) about = about.destroy();
            });
        }
    }
}

new Main();

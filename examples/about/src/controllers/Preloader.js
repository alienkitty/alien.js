import { AssetLoader, Assets, Device, Events, FontLoader, MultiLoader, Stage, WebAudio } from 'alien.js';

import { Config } from '../config/Config.js';
import { Data } from '../data/Data.js';
import { PreloaderView } from '../views/PreloaderView.js';

export class Preloader {
    static init() {
        if (!Device.webgl) {
            return location.href = 'fallback.html';
        }

        Assets.cache = true;

        Data.init();
        Data.Socket.init();

        this.initView();
        this.initLoader();

        this.addListeners();
    }

    static initView() {
        this.view = new PreloaderView();
        Stage.add(this.view);
    }

    static async initLoader() {
        this.view.animateIn();

        this.loader = new MultiLoader();
        this.loader.load(new FontLoader([
            { family: 'D-DIN', style: 'normal', weight: '400' },
            { family: 'Gothic A1', style: 'normal', weight: '500' },
            { family: 'Gothic A1', style: 'normal', weight: '700' },
            { family: 'Roboto Mono', style: 'normal', weight: '500' }
        ]));
        this.loader.load(new AssetLoader(Config.ASSETS));
        this.loader.add(1);

        const { App } = await import('./App.js');
        this.loader.trigger(1);

        this.app = App;

        await this.app.init(this.loader);
    }

    static addListeners() {
        this.loader.events.on(Events.PROGRESS, this.view.onProgress);
        this.view.events.on(Events.COMPLETE, this.onComplete);
        Stage.element.addEventListener('pointerdown', this.onPointerDown);
    }

    static removeListeners() {
        this.loader.events.off(Events.PROGRESS, this.view.onProgress);
        this.view.events.off(Events.COMPLETE, this.onComplete);
        Stage.element.removeEventListener('pointerdown', this.onPointerDown);
    }

    /**
     * Event handlers
     */

    static onComplete = async () => {
        this.removeListeners();

        this.loader = this.loader.destroy();

        await this.view.animateOut();
        this.view = this.view.destroy();

        this.app.start();
    };

    static onPointerDown = () => {
        Stage.element.removeEventListener('pointerdown', this.onPointerDown);

        WebAudio.resume();
    };
}

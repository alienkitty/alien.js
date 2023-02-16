import { AssetLoader, Assets, FontLoader, MultiLoader, Stage } from 'alien.js/three';

import { Config } from '../config/Config.js';
import { Data } from '../data/Data.js';
import { PreloaderView } from '../views/PreloaderView.js';

export class Preloader {
    static init() {
        Assets.cache = true;

        Data.init();
        Data.Socket.init();

        this.initStage();
        this.initView();
        this.initLoader();

        this.addListeners();
    }

    static initStage() {
        Stage.init();
    }

    static initView() {
        this.view = new PreloaderView();
        Stage.add(this.view);
    }

    static async initLoader() {
        this.view.animateIn();

        this.loader = new MultiLoader();
        this.loader.load(new FontLoader());
        this.loader.load(new AssetLoader(Config.ASSETS));
        this.loader.add(2);

        const { App } = await import('./App.js');
        this.loader.trigger(1);

        this.app = App;

        await this.app.init(this.loader.loaders[1]);
        this.loader.trigger(1);
    }

    static addListeners() {
        this.loader.events.on('progress', this.view.onProgress);
        this.view.events.on('complete', this.onComplete);
    }

    static removeListeners() {
        this.loader.events.off('progress', this.view.onProgress);
        this.view.events.off('complete', this.onComplete);
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
}

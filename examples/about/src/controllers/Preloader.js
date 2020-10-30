import { AssetLoader, Assets, Device, FontLoader, MultiLoader, Stage } from 'alien.js';

import { Config } from '../config/Config.js';
import { Events } from '../config/Events.js';
import { Data } from '../data/Data.js';
import { PreloaderView } from '../views/PreloaderView.js';

export class Preloader {
    static async init() {
        if (!Device.webgl) {
            return location.href = 'fallback.html';
        }

        Assets.path = Config.CDN;
        Assets.crossOrigin = 'anonymous';

        Assets.options = {
            mode: 'cors',
            //credentials: 'include'
        };

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
        this.loader.load(new FontLoader(['Roboto Mono', 'Roboto', 'Ropa Sans']));
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
    }

    static removeListeners() {
        this.loader.events.off(Events.PROGRESS, this.view.onProgress);
        this.view.events.off(Events.COMPLETE, this.onComplete);
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

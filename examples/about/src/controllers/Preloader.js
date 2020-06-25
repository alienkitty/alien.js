import { AssetLoader, Assets, Device, FontLoader, MultiLoader, Stage } from 'alien.js';

import { Config } from '../config/Config.js';
import { Events } from '../config/Events.js';
import { PreloaderView } from '../views/PreloaderView.js';

export class Preloader {
    static init() {
        if (!Device.webgl) {
            return location = 'fallback.html';
        }

        Assets.path = Config.CDN;
        Assets.crossOrigin = 'anonymous';

        Assets.options = {
            mode: 'cors',
            //credentials: 'include'
        };

        Assets.cache = true;

        this.initViews();
        this.initLoader();

        this.addListeners();
    }

    static initViews() {
        this.view = new PreloaderView();
        Stage.add(this.view);
    }

    static async initLoader() {
        this.view.animateIn();

        let assets = Config.ASSETS.slice();

        if (Device.mobile) {
            assets = assets.filter(path => !/desktop/.test(path));
        } else {
            assets = assets.filter(path => !/mobile/.test(path));
        }

        this.loader = new MultiLoader();
        this.loader.load(new FontLoader(['Roboto Mono', 'Roboto', 'Ropa Sans']));
        this.loader.load(new AssetLoader(assets));
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

        await this.view.animateOut();
        this.view = this.view.destroy();

        this.app.start();
    };
}

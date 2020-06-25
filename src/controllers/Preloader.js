import { Config } from '../config/Config.js';
import { Device } from '../config/Device.js';
import { Events } from '../config/Events.js';
import { Assets } from '../loaders/Assets.js';
import { MultiLoader } from '../loaders/MultiLoader.js';
import { FontLoader } from '../loaders/FontLoader.js';
import { AssetLoader } from '../loaders/AssetLoader.js';
import { Stage } from './Stage.js';
import { PreloaderView } from '../views/PreloaderView.js';

export class Preloader {
    static init() {
        // if (!Device.webgl) {
        //     return location = 'fallback.html';
        // }

        Assets.path = Config.CDN;
        Assets.crossOrigin = 'anonymous';

        Assets.options = {
            mode: 'cors',
            //credentials: 'include'
        };

        // Assets.cache = true;

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
        this.loader.load(new FontLoader(['Roboto Mono']));
        this.loader.load(new AssetLoader(assets));
        this.loader.add(30);

        const { App } = await import('./App.js');
        this.loader.trigger(30);

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

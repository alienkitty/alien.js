/**
 * Event based asset loader.
 *
 * Currently only images are supported.
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { EventManager } from './EventManager';

class AssetLoader {

    constructor(assets, callback) {
        let self = this;
        this.events = new EventManager();
        this.CDN = Config.CDN || '';
        let total = assets.length,
            loaded = 0,
            percent = 0;

        for (let i = 0; i < assets.length; i++) loadAsset(this.CDN + assets[i]);

        function loadAsset(asset) {
            let image = new Image();
            image.src = asset;
            image.onload = assetLoaded;
        }

        function assetLoaded() {
            loaded++;
            percent = loaded / total;
            self.events.fire(Events.PROGRESS, {percent});
            if (loaded === total) {
                self.complete = true;
                self.events.fire(Events.COMPLETE);
                if (callback) callback();
            }
        }
    }
}

export { AssetLoader };

/**
 * Asset loader with promise method.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { EventManager } from './EventManager';
import { Images } from './Images';
import { XHR } from './XHR';
import { WebAudio } from './WebAudio';

class AssetLoader {

    constructor(assets, callback) {
        if (typeof assets === 'object') {
            assets = Object.keys(assets).map(key => {
                return assets[key];
            });
        }
        let self = this;
        this.events = new EventManager();
        this.CDN = Config.CDN || '';
        let total = assets.length,
            loaded = 0,
            percent = 0;

        for (let i = 0; i < assets.length; i++) loadAsset(this.CDN + assets[i]);

        function loadAsset(asset) {
            let name = asset.split('/');
            name = name[name.length - 1];
            let split = name.split('.'),
                ext = split[split.length - 1].split('?')[0];
            switch (ext) {
            case 'mp3':
                if (!window.AudioContext) return assetLoaded(asset);
                XHR.get(asset, contents => {
                    WebAudio.createSound(split[0], contents, () => assetLoaded(asset));
                }, 'arraybuffer');
                break;
            default:
                Images.createImg(asset, () => assetLoaded(asset));
                break;
            }
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

AssetLoader.loadAssets = (assets, callback) => {
    let promise = Promise.create();
    if (!callback) callback = promise.resolve;
    new AssetLoader(assets, callback);
    return promise;
};

export { AssetLoader };

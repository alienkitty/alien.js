/**
 * Asset loader with promise method.
 *
 * Currently no CORS support.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { EventManager } from './EventManager';
import { Utils } from './Utils';
import { Images } from './Images';
import { XHR } from './XHR';

class AssetLoader {

    constructor(assets, callback) {
        if (Array.isArray(assets)) {
            assets = (() => {
                let keys = assets.map(path => {
                    return Utils.basename(path);
                });
                return keys.reduce((o, k, i) => {
                    o[k] = assets[i];
                    return o;
                }, {});
            })();
        }
        let self = this;
        this.events = new EventManager();
        this.CDN = Config.CDN || '';
        let total = Object.keys(assets).length,
            loaded = 0,
            percent = 0;

        for (let key in assets) loadAsset(key, this.CDN + assets[key]);

        function loadAsset(key, asset) {
            let name = asset.split('/');
            name = name[name.length - 1];
            let split = name.split('.'),
                ext = split[split.length - 1].split('?')[0];
            switch (ext) {
                case 'mp3':
                    /* eslint-disable no-undef */
                    if (typeof WebAudio !== 'undefined') {
                        if (!window.AudioContext) return assetLoaded();
                        XHR.get(asset, contents => {
                            WebAudio.createSound(key, contents, assetLoaded);
                        }, 'arraybuffer');
                    } else {
                        return assetLoaded();
                    }
                    /* eslint-enable no-undef */
                    break;
                case 'js':
                    XHR.get(asset, script => {
                        script = script.replace('use strict', '');
                        eval.call(window, script);
                        assetLoaded(asset);
                    }, 'text');
                    break;
                default:
                    Images.createImg(asset, assetLoaded);
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

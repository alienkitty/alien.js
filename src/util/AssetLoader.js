/**
 * Asset loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Utils } from './Utils';
import { Assets } from './Assets';

class AssetLoader {

    constructor(assets, callback) {
        if (Array.isArray(assets)) {
            assets = (() => {
                const keys = assets.map(path => {
                    return Utils.basename(path);
                });
                return keys.reduce((o, k, i) => {
                    o[k] = assets[i];
                    return o;
                }, {});
            })();
        }
        const self = this;
        this.events = new Events();
        const total = Object.keys(assets).length;
        let loaded = 0;

        for (let key in assets) loadAsset(key, Assets.CDN + assets[key]);

        function loadAsset(key, asset) {
            const ext = Utils.extension(asset);
            if (ext.includes(['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                Assets.createImage(asset, assetLoaded);
                return;
            }
            if (ext.includes(['mp3', 'm4a', 'ogg', 'wav', 'aif'])) {
                if (!window.AudioContext || !window.WebAudio) return assetLoaded();
                window.WebAudio.createSound(key, asset, assetLoaded);
                return;
            }
            window.get(asset).then(data => {
                if (ext === 'js') window.eval(data.replace('use strict', ''));
                assetLoaded();
            }).catch(() => {
                assetLoaded();
            });
        }

        function assetLoaded() {
            self.percent = ++loaded / total;
            self.events.fire(Events.PROGRESS, { percent: self.percent });
            if (loaded === total) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE);
            if (callback) callback();
        }
    }

    static loadAssets(assets, callback) {
        const promise = Promise.create();
        if (!callback) callback = promise.resolve;
        promise.loader = new AssetLoader(assets, callback);
        return promise;
    }
}

export { AssetLoader };

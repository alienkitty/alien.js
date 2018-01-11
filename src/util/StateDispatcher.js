/**
 * State dispatcher.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';

class StateDispatcher {

    constructor(forceHash) {
        const self = this;
        this.events = new Events();
        this.locked = false;
        let storeHash,
            pathRoot = '/';

        createListener();
        storeHash = getHash();

        function createListener() {
            if (forceHash) window.addEventListener('hashchange', () => handleStateChange(getHash()), true);
            else window.addEventListener('popstate', () => handleStateChange(getHash()), true);
        }

        function getHash() {
            if (forceHash) return location.hash.slice(3);
            return pathRoot !== '/' ? location.pathname.split(pathRoot)[1] : location.pathname.slice(1) || '';
        }

        function handleStateChange(hash) {
            if (hash !== storeHash) {
                if (!self.locked) {
                    storeHash = hash;
                    self.events.fire(Events.UPDATE, { value: hash, split: hash.split('/') });
                } else if (storeHash) {
                    if (forceHash) location.hash = '!/' + storeHash;
                    else history.pushState(null, null, pathRoot + storeHash);
                }
            }
        }

        this.getState = () => {
            return getHash();
        };

        this.setState = hash => {
            if (hash !== storeHash) {
                storeHash = hash;
                if (forceHash) location.hash = '!/' + hash;
                else history.pushState(null, null, pathRoot + hash);
            }
        };

        this.replaceState = hash => {
            if (hash !== storeHash) {
                storeHash = hash;
                if (forceHash) history.replaceState(null, null, '#!/' + hash);
                else history.replaceState(null, null, pathRoot + hash);
            }
        };

        this.setTitle = title => {
            document.title = title;
        };

        this.lock = () => {
            this.locked = true;
        };

        this.unlock = () => {
            this.locked = false;
        };

        this.forceHash = () => {
            forceHash = true;
        };

        this.setPathRoot = path => {
            if (path.charAt(0) === '/') pathRoot = path;
            else pathRoot = '/' + path;
        };
    }
}

export { StateDispatcher };

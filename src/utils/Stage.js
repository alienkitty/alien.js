/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from './Interface.js';

import { ticker } from '../tween/Ticker.js';

export var Stage;

if (typeof window !== 'undefined') {
    Stage = new Interface(null, null);

    function addListeners() {
        window.addEventListener('popstate', onPopState);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keypress', onKeyPress);
        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibility);

        ticker.start();
    }

    /**
     * Event handlers
     */

    function onPopState(e) {
        Stage.path = location.pathname;

        Stage.events.emit('state_change', e);
    }

    function onKeyDown(e) {
        Stage.events.emit('key_down', e);
    }

    function onKeyUp(e) {
        Stage.events.emit('key_up', e);
    }

    function onKeyPress(e) {
        Stage.events.emit('key_press', e);
    }

    function onResize(e) {
        Stage.width = document.documentElement.clientWidth;
        Stage.height = document.documentElement.clientHeight;
        Stage.dpr = window.devicePixelRatio;

        Stage.events.emit('resize', e);
    }

    function onVisibility(e) {
        Stage.events.emit('visibility', e);
    }

    /**
     * Public methods
     */

    Stage.init = element => {
        Stage.element = element;

        addListeners();
        onPopState();
        onResize();
    };

    Stage.setPath = path => {
        if (path === location.pathname) {
            return;
        }

        history.pushState(null, null, path);

        onPopState();
    };

    Stage.setTitle = title => {
        document.title = title;
    };
}

/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Device {

    constructor() {
        this.agent = navigator.userAgent.toLowerCase();
        this.pixelRatio = window.devicePixelRatio;
        this.prefix = (() => {
            const styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice.call(styles).join('').match(/-(webkit|moz|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
            return {
                lowercase: pre,
                js: pre[0].toUpperCase() + pre.substr(1)
            };
        })();
        this.transformProperty = (() => {
            let pre;
            switch (this.prefix.lowercase) {
                case 'webkit':
                    pre = '-webkit-transform';
                    break;
                case 'moz':
                    pre = '-moz-transform';
                    break;
                case 'ms':
                    pre = '-ms-transform';
                    break;
                case 'o':
                    pre = '-o-transform';
                    break;
                default:
                    pre = 'transform';
                    break;
            }
            return pre;
        })();
        this.mobile = ('ontouchstart' in window || 'onpointerdown' in window) && this.detect(['ios', 'iphone', 'ipad', 'android', 'blackberry']) ? {} : false;
        this.tablet = window.innerWidth > window.innerHeight ? document.body.clientWidth > 800 : document.body.clientHeight > 800;
        this.phone = !this.tablet;
    }

    detect(array) {
        if (typeof array === 'string') array = [array];
        for (let i = 0; i < array.length; i++) if (~this.agent.indexOf(array[i])) return true;
        return false;
    }

    vendor(style) {
        return this.prefix.js + style;
    }

    vibrate(time) {
        navigator.vibrate && navigator.vibrate(time);
    }
}

export { Device };

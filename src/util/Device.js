/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Device {

    constructor() {
        this.agent = navigator.userAgent.toLowerCase();
        this.prefix = (() => {
            let pre = '',
                dom = '',
                styles = window.getComputedStyle(document.documentElement, '');
            pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
            dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
            var IE = this.detect('trident');
            return {
                unprefixed: IE && !this.detect('msie 9'),
                dom: dom,
                lowercase: pre,
                css: '-' + pre + '-',
                js: (IE ? pre[0] : pre[0].toUpperCase()) + pre.substr(1)
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
                case 'o':
                    pre = '-o-transform';
                    break;
                case 'ms':
                    pre = '-ms-transform';
                    break;
                default:
                    pre = 'transform';
                    break;
            }
            return pre;
        })();
        this.mobile = !!('ontouchstart' in window || 'onpointerdown' in window) && this.detect(['ios', 'iphone', 'ipad', 'android', 'blackberry']) ? {} : false;
        this.tablet = (() => {
            if (window.innerWidth > window.innerHeight) return document.body.clientWidth > 800;
            else return document.body.clientHeight > 800;
        })();
        this.phone = !this.tablet;
        this.type = this.phone ? 'phone' : 'tablet';
    }

    detect(array) {
        if (typeof array === 'string') array = [array];
        for (let i = 0; i < array.length; i++) if (this.agent.indexOf(array[i]) > -1) return true;
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

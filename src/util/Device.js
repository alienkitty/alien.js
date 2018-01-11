/**
 * Browser detection and vendor prefixes.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Device {

    constructor() {
        this.agent = navigator.userAgent.toLowerCase();
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
        this.pixelRatio = window.devicePixelRatio;
        this.os = (() => {
            if (this.detect(['iphone', 'ipad'])) return 'ios';
            if (this.detect(['android'])) return 'android';
            if (this.detect(['blackberry'])) return 'blackberry';
            if (this.detect(['mac os'])) return 'mac';
            if (this.detect(['windows'])) return 'windows';
            if (this.detect(['linux'])) return 'linux';
            return 'unknown';
        })();
        this.browser = (() => {
            if (this.os === 'ios') {
                if (this.detect(['safari'])) return 'safari';
                return 'unknown';
            }
            if (this.os === 'android') {
                if (this.detect(['chrome'])) return 'chrome';
                if (this.detect(['firefox'])) return 'firefox';
                return 'browser';
            }
            if (this.detect(['msie'])) return 'ie';
            if (this.detect(['trident']) && this.detect(['rv:'])) return 'ie';
            if (this.detect(['windows']) && this.detect(['edge'])) return 'ie';
            if (this.detect(['chrome'])) return 'chrome';
            if (this.detect(['safari'])) return 'safari';
            if (this.detect(['firefox'])) return 'firefox';
            return 'unknown';
        })();
        this.mobile = 'ontouchstart' in window && this.detect(['iphone', 'ipad', 'android', 'blackberry']);
        this.tablet = Math.max(screen.width, screen.height) > 800;
        this.phone = !this.tablet;
        this.webgl = (() => {
            try {
                const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'],
                    canvas = document.createElement('canvas');
                let gl;
                for (let i = 0; i < names.length; i++) {
                    gl = canvas.getContext(names[i]);
                    if (gl) break;
                }
                const info = gl.getExtension('WEBGL_debug_renderer_info'),
                    output = {};
                if (info) {
                    const gpu = info.UNMASKED_RENDERER_WEBGL;
                    output.gpu = gl.getParameter(gpu).toLowerCase();
                }
                output.renderer = gl.getParameter(gl.RENDERER).toLowerCase();
                output.version = gl.getParameter(gl.VERSION).toLowerCase();
                output.glsl = gl.getParameter(gl.SHADING_LANGUAGE_VERSION).toLowerCase();
                output.extensions = gl.getSupportedExtensions();
                output.detect = matches => {
                    if (output.gpu && output.gpu.includes(matches)) return true;
                    if (output.version && output.version.includes(matches)) return true;
                    for (let i = 0; i < output.extensions.length; i++) if (output.extensions[i].toLowerCase().includes(matches)) return true;
                    return false;
                };
                return output;
            } catch (e) {
                return false;
            }
        })();
    }

    detect(matches) {
        return this.agent.includes(matches);
    }

    vendor(style) {
        return this.prefix.js + style;
    }

    vibrate(time) {
        if (navigator.vibrate) navigator.vibrate(time);
    }
}

export { Device };

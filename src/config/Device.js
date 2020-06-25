export class Device {
    static agent = navigator.userAgent.toLowerCase();

    static os = (() => {
        if (/ipad|iphone|ipod/.test(this.agent)) return 'ios';
        if (/android/.test(this.agent)) return 'android';
        if (/mac os/.test(this.agent)) return 'mac';
        if (/windows/.test(this.agent)) return 'windows';
        if (/linux/.test(this.agent)) return 'linux';
        return 'unknown';
    })();

    static mobile = /ios|android/.test(this.os);

    static tablet = this.mobile && Math.max(window.innerWidth, window.innerHeight) > 1000;

    static phone = this.mobile && !this.tablet;

    static webgl = (() => {
        if (!window.WebGLRenderingContext) {
            return false;
        }

        const contextOptions = {
            failIfMajorPerformanceCaveat: true
        };

        let canvas = document.createElement('canvas');
        let gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);

        const result = !!(gl && gl instanceof WebGLRenderingContext);

        if (gl) {
            const loseContext = gl.getExtension('WEBGL_lose_context');

            if (loseContext) {
                loseContext.loseContext();
            }
        }

        gl = null;
        canvas = null;

        return result;
    })();
}

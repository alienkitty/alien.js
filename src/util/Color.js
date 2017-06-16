/**
 * Color helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Color {

    constructor(value) {
        let self = this;
        this.r = 1;
        this.g = 1;
        this.b = 1;

        set(value);

        function set(value) {
            if (value instanceof Color) copy(value);
            else if (typeof value === 'number') setHex(value);
            else if (Array.isArray(value)) setRGB(value);
            else setHex(Number('0x' + value.slice(1)));
        }

        function copy(color) {
            self.r = color.r;
            self.g = color.g;
            self.b = color.b;
        }

        function setHex(hex) {
            hex = Math.floor(hex);
            self.r = (hex >> 16 & 255) / 255;
            self.g = (hex >> 8 & 255) / 255;
            self.b = (hex & 255) / 255;
        }

        function setRGB(values) {
            self.r = values[0];
            self.g = values[1];
            self.b = values[2];
        }

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
            return p;
        }

        this.set = value => {
            set(value);
            return this;
        };

        this.setRGB = (r, g, b) => {
            this.r = r;
            this.g = g;
            this.b = b;
            return this;
        };

        this.setHSL = (h, s, l) => {
            if (s === 0) {
                this.r = this.g = this.b = l;
            } else {
                let p = l <= 0.5 ? l * (1 + s) : l + s - l * s,
                    q = 2 * l - p;
                this.r = hue2rgb(q, p, h + 1 / 3);
                this.g = hue2rgb(q, p, h);
                this.b = hue2rgb(q, p, h - 1 / 3);
            }
            return this;
        };

        this.offsetHSL = (h, s, l) => {
            let hsl = this.getHSL();
            hsl.h += h;
            hsl.s += s;
            hsl.l += l;
            this.setHSL(hsl.h, hsl.s, hsl.l);
            return this;
        };

        this.getStyle = () => {
            return 'rgb(' + (this.r * 255 | 0) + ',' + (this.g * 255 | 0) + ',' + (this.b * 255 | 0) + ')';
        };

        this.getHex = () => {
            return this.r * 255 << 16 ^ this.g * 255 << 8 ^ this.b * 255 << 0;
        };

        this.getHexString = () => {
            return '#' + ('000000' + this.getHex().toString(16)).slice(-6);
        };

        this.getHSL = () => {
            this.hsl = this.hsl || {h:0, s:0, l:0};
            let hsl = this.hsl,
                r = this.r,
                g = this.g,
                b = this.b,
                max = Math.max(r, g, b),
                min = Math.min(r, g, b),
                hue,
                saturation,
                lightness = (min + max) / 2;
            if (min === max) {
                hue = 0;
                saturation = 0;
            } else {
                let delta = max - min;
                saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
                switch (max) {
                case r:
                    hue = (g - b) / delta + (g < b ? 6 : 0);
                    break;
                case g:
                    hue = (b - r) / delta + 2;
                    break;
                case b:
                    hue = (r - g) / delta + 4;
                    break;
                }
                hue /= 6;
            }
            hsl.h = hue;
            hsl.s = saturation;
            hsl.l = lightness;
            return hsl;
        };

        this.add = color => {
            this.r += color.r;
            this.g += color.g;
            this.b += color.b;
        };

        this.mix = (color, percent) => {
            this.r *= (1 - percent) + color.r * percent;
            this.g *= (1 - percent) + color.g * percent;
            this.b *= (1 - percent) + color.b * percent;
        };

        this.addScalar = s => {
            this.r += s;
            this.g += s;
            this.b += s;
        };

        this.multiply = color => {
            this.r *= color.r;
            this.g *= color.g;
            this.b *= color.b;
        };

        this.multiplyScalar = s => {
            this.r *= s;
            this.g *= s;
            this.b *= s;
        };

        this.clone = () => {
            return new Color([this.r, this.g, this.b]);
        };

        this.toArray = () => {
            if (!this.array) this.array = [];
            this.array[0] = this.r;
            this.array[1] = this.g;
            this.array[2] = this.b;
            return this.array;
        };
    }
}

export { Color };

/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Interpolation {

    constructor() {
        this.convertEase = ease => {
            return (() => {
                let fn;
                switch (ease) {
                    case 'easeInQuad':
                        fn = this.Quad.In;
                        break;
                    case 'easeInCubic':
                        fn = this.Cubic.In;
                        break;
                    case 'easeInQuart':
                        fn = this.Quart.In;
                        break;
                    case 'easeInQuint':
                        fn = this.Quint.In;
                        break;
                    case 'easeInSine':
                        fn = this.Sine.In;
                        break;
                    case 'easeInExpo':
                        fn = this.Expo.In;
                        break;
                    case 'easeInCirc':
                        fn = this.Circ.In;
                        break;
                    case 'easeInElastic':
                        fn = this.Elastic.In;
                        break;
                    case 'easeInBack':
                        fn = this.Back.In;
                        break;
                    case 'easeInBounce':
                        fn = this.Bounce.In;
                        break;
                    case 'easeOutQuad':
                        fn = this.Quad.Out;
                        break;
                    case 'easeOutCubic':
                        fn = this.Cubic.Out;
                        break;
                    case 'easeOutQuart':
                        fn = this.Quart.Out;
                        break;
                    case 'easeOutQuint':
                        fn = this.Quint.Out;
                        break;
                    case 'easeOutSine':
                        fn = this.Sine.Out;
                        break;
                    case 'easeOutExpo':
                        fn = this.Expo.Out;
                        break;
                    case 'easeOutCirc':
                        fn = this.Circ.Out;
                        break;
                    case 'easeOutElastic':
                        fn = this.Elastic.Out;
                        break;
                    case 'easeOutBack':
                        fn = this.Back.Out;
                        break;
                    case 'easeOutBounce':
                        fn = this.Bounce.Out;
                        break;
                    case 'easeInOutQuad':
                        fn = this.Quad.InOut;
                        break;
                    case 'easeInOutCubic':
                        fn = this.Cubic.InOut;
                        break;
                    case 'easeInOutQuart':
                        fn = this.Quart.InOut;
                        break;
                    case 'easeInOutQuint':
                        fn = this.Quint.InOut;
                        break;
                    case 'easeInOutSine':
                        fn = this.Sine.InOut;
                        break;
                    case 'easeInOutExpo':
                        fn = this.Expo.InOut;
                        break;
                    case 'easeInOutCirc':
                        fn = this.Circ.InOut;
                        break;
                    case 'easeInOutElastic':
                        fn = this.Elastic.InOut;
                        break;
                    case 'easeInOutBack':
                        fn = this.Back.InOut;
                        break;
                    case 'easeInOutBounce':
                        fn = this.Bounce.InOut;
                        break;
                    case 'linear':
                        fn = this.Linear.None;
                        break;
                }
                return fn;
            })() || this.Cubic.Out;
        };

        this.Linear = {
            None(k) {
                return k;
            }
        };

        this.Quad = {
            In(k) {
                return k * k;
            },
            Out(k) {
                return k * (2 - k);
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            }
        };

        this.Cubic = {
            In(k) {
                return k * k * k;
            },
            Out(k) {
                return --k * k * k + 1;
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k;
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        };

        this.Quart = {
            In(k) {
                return k * k * k * k;
            },
            Out(k) {
                return 1 - --k * k * k * k;
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k;
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }
        };

        this.Quint = {
            In(k) {
                return k * k * k * k * k;
            },
            Out(k) {
                return --k * k * k * k * k + 1;
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }
        };

        this.Sine = {
            In(k) {
                return 1 - Math.cos(k * Math.PI / 2);
            },
            Out(k) {
                return Math.sin(k * Math.PI / 2);
            },
            InOut(k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        };

        this.Expo = {
            In(k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            },
            Out(k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            },
            InOut(k) {
                if (k === 0) return 0;
                if (k === 1) return 1;
                if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        };

        this.Circ = {
            In(k) {
                return 1 - Math.sqrt(1 - k * k);
            },
            Out(k) {
                return Math.sqrt(1 - --k * k);
            },
            InOut(k) {
                if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        };

        this.Elastic = {
            In(k, a = 1, p = 0.4) {
                let s;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            },
            Out(k, a = 1, p = 0.4) {
                let s;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
            },
            InOut(k, a = 1, p = 0.4) {
                let s;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
            }
        };

        this.Back = {
            In(k) {
                let s = 1.70158;
                return k * k * ((s + 1) * k - s);
            },
            Out(k) {
                let s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            },
            InOut(k) {
                let s = 1.70158 * 1.525;
                if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        };

        this.Bounce = {
            In(k) {
                return 1 - this.Bounce.Out(1 - k);
            },
            Out(k) {
                if (k < 1 / 2.75) return 7.5625 * k * k;
                if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
                if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            },
            InOut(k) {
                if (k < 0.5) return this.Bounce.In(k * 2) * 0.5;
                return this.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        };
    }
}

export { Interpolation };

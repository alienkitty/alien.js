/**
 * Canvas graphics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils';
import { CanvasObject } from './CanvasObject';

class CanvasGraphics extends CanvasObject {

    constructor(w = 0, h = w) {
        super();
        const self = this;
        this.width = w;
        this.height = h;
        this.props = {};
        let draw = [],
            mask;

        function setProperties(context) {
            for (let key in self.props) context[key] = self.props[key];
        }

        this.draw = override => {
            if (this.isMask() && !override) return false;
            const context = this.canvas.context;
            this.startDraw(this.px, this.py, override);
            setProperties(context);
            if (this.clipWidth && this.clipHeight) {
                context.beginPath();
                context.rect(this.clipX, this.clipY, this.clipWidth, this.clipHeight);
                context.clip();
            }
            for (let i = 0; i < draw.length; i++) {
                const cmd = draw[i];
                if (!cmd) continue;
                const fn = cmd.shift();
                context[fn].apply(context, cmd);
                cmd.unshift(fn);
            }
            this.endDraw();
            if (mask) {
                context.globalCompositeOperation = mask.blendMode;
                mask.render(true);
            }
        };

        this.clear = () => {
            for (let i = 0; i < draw.length; i++) draw[i].length = 0;
            draw.length = 0;
        };

        this.arc = (x = 0, y = 0, endAngle = 0, radius = this.radius || this.width / 2, startAngle = 0, counterclockwise = false) => {
            if (x && !y) {
                endAngle = x;
                x = 0;
                y = 0;
            }
            endAngle -= 90;
            startAngle -= 90;
            draw.push(['beginPath']);
            draw.push(['arc', x, y, radius, Math.radians(startAngle), Math.radians(endAngle), counterclockwise]);
        };

        this.quadraticCurveTo = (cpx, cpy, x, y) => {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        this.bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        this.fillRect = (x, y, w, h) => {
            draw.push(['fillRect', x, y, w, h]);
        };

        this.clearRect = (x, y, w, h) => {
            draw.push(['clearRect', x, y, w, h]);
        };

        this.strokeRect = (x, y, w, h) => {
            draw.push(['strokeRect', x, y, w, h]);
        };

        this.moveTo = (x, y) => {
            draw.push(['moveTo', x, y]);
        };

        this.lineTo = (x, y) => {
            draw.push(['lineTo', x, y]);
        };

        this.stroke = () => {
            draw.push(['stroke']);
        };

        this.fill = () => {
            if (!mask) draw.push(['fill']);
        };

        this.beginPath = () => {
            draw.push(['beginPath']);
        };

        this.closePath = () => {
            draw.push(['closePath']);
        };

        this.fillText = (text, x, y) => {
            draw.push(['fillText', text, x, y]);
        };

        this.strokeText = (text, x, y) => {
            draw.push(['strokeText', text, x, y]);
        };

        this.setLineDash = value => {
            draw.push(['setLineDash', value]);
        };

        this.drawImage = (img, sx = 0, sy = 0, sWidth = img.width, sHeight = img.height, dx = 0, dy = 0, dWidth = img.width, dHeight = img.height) => {
            draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx + -this.px, dy + -this.py, dWidth, dHeight]);
        };

        this.mask = object => {
            if (!object) return mask = null;
            mask = object;
            object.masked = this;
            for (let i = 0; i < draw.length; i++) {
                if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                    draw[i].length = 0;
                    draw.splice(i, 1);
                }
            }
        };

        this.clone = () => {
            const object = new CanvasGraphics(this.width, this.height);
            object.visible = this.visible;
            object.blendMode = this.blendMode;
            object.opacity = this.opacity;
            object.follow(this);
            object.props = Utils.cloneObject(this.props);
            object.setDraw(Utils.cloneArray(draw));
            return object;
        };

        this.setDraw = array => {
            draw = array;
        };
    }

    set strokeStyle(val) {
        this.props.strokeStyle = val;
    }

    get strokeStyle() {
        return this.props.strokeStyle;
    }

    set fillStyle(val) {
        this.props.fillStyle = val;
    }

    get fillStyle() {
        return this.props.fillStyle;
    }

    set lineWidth(val) {
        this.props.lineWidth = val;
    }

    get lineWidth() {
        return this.props.lineWidth;
    }

    set lineCap(val) {
        this.props.lineCap = val;
    }

    get lineCap() {
        return this.props.lineCap;
    }

    set lineDashOffset(val) {
        this.props.lineDashOffset = val;
    }

    get lineDashOffset() {
        return this.props.lineDashOffset;
    }

    set lineJoin(val) {
        this.props.lineJoin = val;
    }

    get lineJoin() {
        return this.props.lineJoin;
    }

    set miterLimit(val) {
        this.props.miterLimit = val;
    }

    get miterLimit() {
        return this.props.miterLimit;
    }

    set font(val) {
        this.props.font = val;
    }

    get font() {
        return this.props.font;
    }

    set textAlign(val) {
        this.props.textAlign = val;
    }

    get textAlign() {
        return this.props.textAlign;
    }

    set textBaseline(val) {
        this.props.textBaseline = val;
    }

    get textBaseline() {
        return this.props.textBaseline;
    }
}

export { CanvasGraphics };

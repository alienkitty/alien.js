/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { EventManager } from './EventManager';
import { Render } from './Render';
import { Device } from './Device';
import { TweenManager } from '../tween/TweenManager';
import { CSSTransition } from '../tween/CSSTransition';

class Interface {

    constructor(name, node) {
        this.events = new EventManager();
        let stage = window.Alien && window.Alien.Stage ? window.Alien.Stage : document.body,
            element = node || document.createElement('div');
        if (name[0] === '.') element.className = name.substr(1);
        else element.id = name;
        element.style.position = 'absolute';
        stage.appendChild(element);
        this.element = element;
        this.name = name;
    }

    initClass(object, ...params) {
        let child = new object(...params);
        if (child.element) this.element.appendChild(child.element);
        child.parent = this;
        return child;
    }

    create(name, node) {
        let child = new Interface(name, node);
        this.element.appendChild(child.element);
        child.parent = this;
        return child;
    }

    destroy() {
        if (this.loop) Render.stop(this.loop);
        this.element.parentNode.removeChild(this.element);
        return null;
    }

    empty() {
        this.element.innerHTML = '';
        return this;
    }

    text(text) {
        if (typeof text !== 'undefined') {
            this.element.textContent = text;
            return this;
        } else {
            return this.element.textContent;
        }
    }

    html(text) {
        if (typeof text !== 'undefined') {
            this.element.innerHTML = text;
            return this;
        } else {
            return this.element.innerHTML;
        }
    }

    hide() {
        this.element.style.display = 'none';
        return this;
    }

    show() {
        this.element.style.display = '';
        return this;
    }

    visible() {
        this.element.style.visibility = 'visible';
        return this;
    }

    invisible() {
        this.element.style.visibility = 'hidden';
        return this;
    }

    setZ(z) {
        this.element.style.zIndex = z;
        return this;
    }

    clearAlpha() {
        this.element.style.opacity = '';
        return this;
    }

    size(w, h) {
        if (typeof w !== 'undefined') {
            if (typeof h === 'undefined') h = w;
            if (typeof w === 'string') {
                if (typeof h !== 'string') h = h + 'px';
                this.element.style.width = w;
                this.element.style.height = h;
            } else {
                this.element.style.width = w + 'px';
                this.element.style.height = h + 'px';
                this.element.style.backgroundSize = w + 'px ' + h + 'px';
            }
        }
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        return this;
    }

    enablePointer(bool) {
        this.element.style.pointerEvents = bool ? 'auto' : 'none';
        return this;
    }

    fontStyle(fontFamily, fontSize, color, fontStyle) {
        this.css({fontFamily, fontSize, color, fontStyle});
        return this;
    }

    bg(src, x, y, repeat) {
        if (src.indexOf('.') === -1) this.element.style.backgroundColor = src;
        else this.element.style.backgroundImage = 'url(' + src + ')';
        if (typeof x !== 'undefined') {
            x = typeof x === 'number' ? x + 'px' : x;
            y = typeof y === 'number' ? y + 'px' : y;
            this.element.style.backgroundPosition = x + ' ' + y;
        }
        if (repeat) {
            this.element.style.backgroundSize = '';
            this.element.style.backgroundRepeat = repeat;
        }
        if (x === 'cover' || x === 'contain') {
            this.element.style.backgroundSize = x;
            this.element.style.backgroundRepeat = 'no-repeat';
            this.element.style.backgroundPosition = typeof y !== 'undefined' ? y + ' ' + repeat : 'center';
        }
        return this;
    }

    center(x, y, noPos) {
        let css = {};
        if (typeof x === 'undefined') {
            css.left = '50%';
            css.top = '50%';
            css.marginLeft = -this.width / 2;
            css.marginTop = -this.height / 2;
        } else {
            if (x) {
                css.left = '50%';
                css.marginLeft = -this.width / 2;
            }
            if (y) {
                css.top = '50%';
                css.marginTop = -this.height / 2;
            }
        }
        if (noPos) {
            delete css.left;
            delete css.top;
        }
        this.css(css);
        return this;
    }

    mask(src) {
        this.element.style[Device.vendor('Mask')] = (src.indexOf('.') > -1 ? 'url(' + src + ')' : src) + ' no-repeat';
        this.element.style[Device.vendor('MaskSize')] = 'contain';
        return this;
    }

    blendMode(mode, bg) {
        this.element.style[bg ? 'background-blend-mode' : 'mix-blend-mode'] = mode;
        return this;
    }

    css(props, value) {
        if (typeof props !== 'object') {
            if (!value) {
                let style = this.element.style[props];
                if (typeof style !== 'number') {
                    if (style.indexOf('px') > -1) style = Number(style.slice(0, -2));
                    if (props === 'opacity') style = !isNaN(Number(this.element.style.opacity)) ? Number(this.element.style.opacity) : 1;
                }
                if (!style) style = 0;
                return style;
            } else {
                this.element.style[props] = value;
                return this;
            }
        }
        for (let key in props) {
            let val = props[key];
            if (!(typeof val === 'string' || typeof val === 'number')) continue;
            if (typeof val !== 'string' && key !== 'opacity' && key !== 'zIndex') val += 'px';
            this.element.style[key] = val;
        }
        return this;
    }

    transform(props) {
        if (!props) props = this;
        else for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        this.element.style[Device.vendor('Transform')] = TweenManager.parseTransform(props);
        return this;
    }

    enable3D(perspective, x, y) {
        this.element.style[Device.vendor('TransformStyle')] = 'preserve-3d';
        if (perspective) this.element.style[Device.vendor('Perspective')] = perspective + 'px';
        if (typeof x !== 'undefined') {
            x = typeof x === 'number' ? x + 'px' : x;
            y = typeof y === 'number' ? y + 'px' : y;
            this.element.style[Device.vendor('PerspectiveOrigin')] = x + ' ' + y;
        }
        return this;
    }

    disable3D() {
        this.element.style[Device.vendor('TransformStyle')] = '';
        this.element.style[Device.vendor('Perspective')] = '';
        return this;
    }

    transformPoint(x, y, z) {
        let origin = '';
        if (typeof x !== 'undefined') origin += typeof x === 'number' ? x + 'px ' : x + ' ';
        if (typeof y !== 'undefined') origin += typeof y === 'number' ? y + 'px ' : y + ' ';
        if (typeof z !== 'undefined') origin += typeof z === 'number' ? z + 'px' : z;
        this.element.style[Device.vendor('TransformOrigin')] = origin;
        return this;
    }

    tween(props, time, ease, delay, callback) {
        if (typeof delay !== 'number') {
            callback = delay;
            delay = 0;
        }
        let promise = null;
        if (typeof Promise !== 'undefined') {
            promise = Promise.create();
            if (callback) promise.then(callback);
            callback = promise.resolve;
        }
        let tween = new CSSTransition(this, props, time, ease, delay, callback);
        return promise || tween;
    }

    clearTransform() {
        if (typeof this.x === 'number') this.x = 0;
        if (typeof this.y === 'number') this.y = 0;
        if (typeof this.z === 'number') this.z = 0;
        if (typeof this.scale === 'number') this.scale = 1;
        if (typeof this.scaleX === 'number') this.scaleX = 1;
        if (typeof this.scaleY === 'number') this.scaleY = 1;
        if (typeof this.rotation === 'number') this.rotation = 0;
        if (typeof this.rotationX === 'number') this.rotationX = 0;
        if (typeof this.rotationY === 'number') this.rotationY = 0;
        if (typeof this.rotationZ === 'number') this.rotationZ = 0;
        if (typeof this.skewX === 'number') this.skewX = 0;
        if (typeof this.skewY === 'number') this.skewY = 0;
        this.element.style[Device.transformProperty] = '';
        return this;
    }

    stopTween() {
        if (this.cssTween) this.cssTween.stop();
        if (this.mathTween) this.mathTween.stop();
        return this;
    }

    attr(attr, value) {
        if (attr && value) {
            if (value === '') this.element.removeAttribute(attr);
            else this.element.setAttribute(attr, value);
        } else if (attr) {
            return this.element.getAttribute(attr);
        }
        return this;
    }

    startRender(callback) {
        this.loop = callback;
        Render.start(callback);
    }

    stopRender(callback) {
        this.loop = null;
        Render.stop(callback);
    }

    click(callback) {
        this.element.addEventListener('click', e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'click';
            if (!e.pageX) {
                e.pageX = e.clientX;
                e.pageY = e.clientY;
            }
            if (callback) callback(e);
        }, false);
        this.element.style.cursor = 'pointer';
        return this;
    }

    hover(callback) {
        this.element.addEventListener('mouseover', e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'over';
            if (callback) callback(e);
        }, false);
        this.element.addEventListener('mouseout', e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'out';
            if (callback) callback(e);
        }, false);
        return this;
    }

    interact(overCallback, clickCallback) {
        this.hit = this.create('.hit').css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 99999
        }).enablePointer(true).hover(overCallback).click(clickCallback);
    }

    split(by = '') {
        let style = {
                position: 'relative',
                display: 'block',
                width: 'auto',
                height: 'auto',
                margin: 0,
                padding: 0,
                cssFloat: 'left'
            },
            array = [],
            split = this.text().split(by);
        this.empty();
        for (let i = 0; i < split.length; i++) {
            if (split[i] === ' ') split[i] = '&nbsp;';
            array.push(this.create('.t', document.createElement('span')).html(split[i]).css(style));
            if (by !== '' && i < split.length - 1) array.push(this.create('.t', document.createElement('span')).html(by).css(style));
        }
        return array;
    }
}

export { Interface };

/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { EventManager } from './EventManager';
import { Render } from './Render';
import { Utils } from './Utils';
import { Device } from './Device';
import { TweenManager } from '../tween/TweenManager';
import { CSSTransition } from '../tween/CSSTransition';

class Interface {

    constructor(name, type = 'div', detached) {
        this.events = new EventManager();
        if (typeof name !== 'string') {
            this.element = name;
        } else {
            this.name = name;
            this.type = type;
            if (this.type === 'svg') {
                let qualifiedName = detached || 'svg';
                detached = true;
                this.element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
                this.element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            } else {
                this.element = document.createElement(this.type);
            }
            if (name[0] !== '.') this.element.id = name;
            else this.element.className = name.substr(1);
        }
        this.element.style.position = 'absolute';
        this.element.object = this;
        if (!detached) (window.Alien && window.Alien.Stage ? window.Alien.Stage : document.body).appendChild(this.element);
    }

    initClass(object, ...params) {
        let child = new object(...params);
        this.add(child);
        return child;
    }

    clone() {
        return new Interface(this.element.cloneNode(true));
    }

    create(name, type) {
        let child = new Interface(name, type);
        this.add(child);
        return child;
    }

    empty() {
        this.element.innerHTML = '';
        return this;
    }

    add(child) {
        if (child.element) {
            this.element.appendChild(child.element);
            child.parent = this;
        } else if (child.nodeName) {
            this.element.appendChild(child);
        }
        return this;
    }

    remove(child) {
        if (child.element) child.destroy();
        else if (child.nodeName) child.parentNode.removeChild(child);
        return this;
    }

    destroy() {
        if (this.loop) Render.stop(this.loop);
        this.events = this.events.destroy();
        this.removed = true;
        let parent = this.parent;
        if (parent && !parent.removed && parent.remove) parent.remove(this.element);
        return Utils.nullObject(this);
    }

    text(text) {
        if (typeof text === 'undefined') return this.element.textContent;
        else this.element.textContent = text;
        return this;
    }

    html(text) {
        if (typeof text === 'undefined') return this.element.innerHTML;
        else this.element.innerHTML = text;
        return this;
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

    mouseEnabled(bool) {
        this.element.style.pointerEvents = bool ? 'auto' : 'none';
        return this;
    }

    fontStyle(fontFamily, fontSize, color, fontStyle) {
        this.css({fontFamily, fontSize, color, fontStyle});
        return this;
    }

    bg(src, x, y, repeat) {
        if (src.indexOf('.') > -1 || src.indexOf('data:') > -1) this.element.style.backgroundImage = 'url(' + src + ')';
        else this.element.style.backgroundColor = src;
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
        if (typeof value === 'undefined') return this.element.getAttribute(attr);
        else if (value === '') this.element.removeAttribute(attr);
        else this.element.setAttribute(attr, value);
        return this;
    }

    svgSymbol(id, width, height) {
        /* eslint-disable no-undef */
        if (typeof SVGSymbol !== 'undefined') {
            let config = SVGSymbol.getConfig(id);
            this.html(`<svg viewBox="0 0 ${config.width} ${config.height}" width="${width}" height="${height}"><use xlink:href="#${config.id}" x="0" y="0"/></svg>`);
        }
        /* eslint-enable no-undef */
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
        let clicked = e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'click';
            if (callback) callback(e);
        };
        this.element.addEventListener('click', clicked);
        this.element.style.cursor = 'pointer';
        return this;
    }

    hover(callback) {
        let hovered = e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = e.type === 'mouseout' ? 'out' : 'over';
            if (callback) callback(e);
        };
        this.element.addEventListener('mouseover', hovered);
        this.element.addEventListener('mouseout', hovered);
        return this;
    }

    press(callback) {
        let pressed = e => {
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = e.type === 'mousedown' ? 'down' : 'up';
            if (callback) callback(e);
        };
        this.element.addEventListener('mousedown', pressed);
        this.element.addEventListener('mouseup', pressed);
        return this;
    }

    bind(event, callback) {
        if (event === 'touchstart' && !Device.mobile) event = 'mousedown';
        else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';
        else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
        this.element.addEventListener(event, callback);
        return this;
    }

    unbind(event, callback) {
        if (event === 'touchstart' && !Device.mobile) event = 'mousedown';
        else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';
        else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
        this.element.removeEventListener(event, callback);
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
        });
        if (Device.mobile) this.hit.touchClick(overCallback, clickCallback);
        else this.hit.hover(overCallback).click(clickCallback);
        return this;
    }

    touchClick(hover, click) {
        let time, move,
            start = {},
            touch = {};
        let touchMove = e => {
            touch = Utils.touchEvent(e);
            move = Utils.findDistance(start, touch) > 5;
        };
        let setTouch = e => {
            let touch = Utils.touchEvent(e);
            e.touchX = touch.x;
            e.touchY = touch.y;
            start.x = e.touchX;
            start.y = e.touchY;
        };
        let touchStart = e => {
            time = Date.now();
            e.action = 'over';
            e.object = this.element.className === 'hit' ? this.parent : this;
            setTouch(e);
            if (hover && !move) hover(e);
        };
        let touchEnd = e => {
            let t = Date.now();
            e.object = this.element.className === 'hit' ? this.parent : this;
            setTouch(e);
            if (time && t - time < 750) {
                if (click && !move) {
                    e.action = 'click';
                    if (click && !move) click(e);
                }
            }
            if (hover) {
                e.action = 'out';
                hover(e);
            }
            move = false;
        };
        this.element.addEventListener('touchmove', touchMove, {passive:true});
        this.element.addEventListener('touchstart', touchStart, {passive:true});
        this.element.addEventListener('touchend', touchEnd, {passive:true});
        return this;
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
            array.push(this.create('.t', 'span').html(split[i]).css(style));
            if (by !== '' && i < split.length - 1) array.push(this.create('.t', 'span').html(by).css(style));
        }
        return array;
    }
}

export { Interface };

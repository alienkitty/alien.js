/**
 * Tween helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Render } from '../util/Render';
import { MathTween } from './MathTween';
import { SpringTween } from './SpringTween';

class TweenManager {

    constructor() {
        this.TRANSFORMS = ['x', 'y', 'z', 'scale', 'scaleX', 'scaleY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'skewX', 'skewY', 'perspective'];
        this.CSS_EASES = {
            easeOutCubic:   'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            easeOutQuad:    'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
            easeOutQuart:   'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
            easeOutQuint:   'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
            easeOutSine:    'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
            easeOutExpo:    'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
            easeOutCirc:    'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
            easeOutBack:    'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
            easeInCubic:    'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
            easeInQuad:     'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
            easeInQuart:    'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
            easeInQuint:    'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
            easeInSine:     'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
            easeInCirc:     'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
            easeInBack:     'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
            easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
            easeInOutQuad:  'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
            easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
            easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
            easeInOutSine:  'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
            easeInOutExpo:  'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
            easeInOutCirc:  'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
            easeInOutBack:  'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
            easeInOut:      'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
            linear:         'linear'
        };
        let tweens = [],
            rendering = false;

        function updateTweens(t) {
            if (tweens.length) {
                for (let i = 0; i < tweens.length; i++) tweens[i].update(t);
            } else {
                rendering = false;
                Render.stop(updateTweens);
            }
        }

        this.addMathTween = tween => {
            tweens.push(tween);
            if (!rendering) {
                rendering = true;
                Render.start(updateTweens);
            }
        };

        this.removeMathTween = tween => {
            tweens.remove(tween);
        };
    }

    tween(object, props, time, ease, delay, callback, update) {
        if (typeof delay !== 'number') {
            update = callback;
            callback = delay;
            delay = 0;
        }
        let promise = null;
        if (typeof Promise !== 'undefined') {
            promise = Promise.create();
            if (callback) promise.then(callback);
            callback = promise.resolve;
        }
        let tween = ease === 'spring' ? new SpringTween(object, props, time, ease, delay, update, callback) : new MathTween(object, props, time, ease, delay, update, callback);
        return promise || tween;
    }

    parseTransform(props) {
        let transforms = '';
        if (typeof props.x !== 'undefined' || typeof props.y !== 'undefined' || typeof props.z !== 'undefined') {
            let x = props.x || 0,
                y = props.y || 0,
                z = props.z || 0,
                translate = '';
            translate += x + 'px, ';
            translate += y + 'px, ';
            translate += z + 'px';
            transforms += 'translate3d(' + translate + ')';
        }
        if (typeof props.scale !== 'undefined') {
            transforms += 'scale(' + props.scale + ')';
        } else {
            if (typeof props.scaleX !== 'undefined') transforms += 'scaleX(' + props.scaleX + ')';
            if (typeof props.scaleY !== 'undefined') transforms += 'scaleY(' + props.scaleY + ')';
        }
        if (typeof props.rotation !== 'undefined') transforms += 'rotate(' + props.rotation + 'deg)';
        if (typeof props.rotationX !== 'undefined') transforms += 'rotateX(' + props.rotationX + 'deg)';
        if (typeof props.rotationY !== 'undefined') transforms += 'rotateY(' + props.rotationY + 'deg)';
        if (typeof props.rotationZ !== 'undefined') transforms += 'rotateZ(' + props.rotationZ + 'deg)';
        if (typeof props.skewX !== 'undefined') transforms += 'skewX(' + props.skewX + 'deg)';
        if (typeof props.skewY !== 'undefined') transforms += 'skewY(' + props.skewY + 'deg)';
        if (typeof props.perspective !== 'undefined') transforms += 'perspective(' + props.perspective + 'px)';
        return transforms;
    }

    isTransform(key) {
        return ~this.TRANSFORMS.indexOf(key);
    }

    getAllTransforms(object) {
        let obj = {};
        for (let i = this.TRANSFORMS.length - 1; i > -1; i--) {
            let key = this.TRANSFORMS[i],
                val = object[key];
            if (val !== 0 && typeof val === 'number') obj[key] = val;
        }
        return obj;
    }

    getEase(name) {
        return this.CSS_EASES[name] || this.CSS_EASES.easeOutCubic;
    }
}

export { TweenManager };

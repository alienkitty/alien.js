/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { transform } from 'babel-core';
import { minify } from 'uglify-es';

function timestamp() {

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    let now = new Date(),
        hours = now.getHours(),
        minutes = now.getMinutes(),
        ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${hours}:${pad(minutes)}${ampm}`;
}

// Add singletons after tree shaking
function singletons(code) {
    return code.replace(/class (Render|CanvasFont|Utils|Device|Mouse|Accelerometer|Storage|Images|SVGSymbol|TweenManager|Interpolation|WebAudio|XHR|Stage)([\s\S]*?\n})/g, 'let $1 = new ( // Singleton pattern\n\nclass $1$2\n\n)(); // Singleton pattern');
}

function unexport() {
    return {
        transformBundle: code => {
            return {
                code: singletons(code).replace(/\n{2,}export.*$/g, ''),
                map: { mappings: '' }
            };
        }
    };
}

function babel() {
    return {
        transformBundle: code => {
            return transform(code, { presets: ['env'] });
        }
    };
}

function uglify(options = {}) {
    return {
        transformBundle: code => {
            options.sourceMap = true;
            return minify(transform(singletons(code), { presets: ['env'] }).code, options);
        }
    };
}

export { timestamp, unexport, babel, uglify };

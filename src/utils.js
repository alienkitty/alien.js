/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* eslint-disable no-cond-assign */

import MagicString from 'magic-string';
import { transform } from 'babel-core';
import { minify } from 'uglify-es';

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function timestamp() {
    let now = new Date(),
        hours = now.getHours(),
        minutes = now.getMinutes(),
        ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${hours}:${pad(minutes)}${ampm}`;
}

// Add singletons after tree shaking
function singletons() {
    return {
        transformBundle(code) {
            const magicString = new MagicString(code);
            let array = ['Render', 'CanvasFont', 'Utils', 'Device', 'Mouse', 'Accelerometer', 'Storage', 'Images', 'SVGSymbol', 'TweenManager', 'Interpolation', 'WebAudio', 'XHR', 'Stage'],
                pattern = new RegExp(`class (${array.join('|')})([\\s\\S]*?\\n})`, 'g'),
                hasReplacements = false,
                match,
                start,
                end,
                replacement;

            while (match = pattern.exec(code)) {
                hasReplacements = true;

                start = match.index;
                end = start + match[0].length;
                replacement = String(`const ${match[1]} = new ( // Singleton pattern\n\nclass ${match[1]}${match[2]}\n\n)(); // Singleton pattern`);

                magicString.overwrite(start, end, replacement);
            }

            if (!hasReplacements) return null;

            return {
                code: magicString.toString(),
                map: magicString.generateMap({ hires: true })
            };
        }
    };
}

// Strip exports after tree shaking
function unexport() {
    return {
        transformBundle(code) {
            const magicString = new MagicString(code);
            let pattern = new RegExp('\\n{2,}export.*$', 'g'),
                hasReplacements = false,
                match,
                start,
                end,
                replacement;

            while (match = pattern.exec(code)) {
                hasReplacements = true;

                start = match.index;
                end = start + match[0].length;
                replacement = String('');

                magicString.overwrite(start, end, replacement);
            }

            if (!hasReplacements) return null;

            return {
                code: magicString.toString(),
                map: magicString.generateMap({ hires: true })
            };
        }
    };
}

// Transpile after tree shaking
function babel() {
    return {
        transformBundle(code) {
            return transform(code, {
                presets: ['env'],
                sourceMaps: true
            });
        }
    };
}

// Minify after tree shaking
function uglify(options = {}) {
    return {
        transformBundle(code) {
            options.sourceMap = true;
            return minify(code, options);
        }
    };
}

export { pad, timestamp, singletons, unexport, babel, uglify };

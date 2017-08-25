/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { transform } from 'babel-core';

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

function unexport() {
    return {
        transformBundle: code => {
            return {
                code: code.replace(/\n{2,}export.*$/g, ''),
                map: { mappings: '' }
            };
        }
    };
}

function babel() {
    return {
        transformBundle: code => {
            let result = transform(code, { presets: ['env'] });
            return {
                code: result.code,
                map: result.map
            };
        }
    };
}

export { timestamp, unexport, babel };

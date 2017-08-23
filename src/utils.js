/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

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

export { timestamp, unexport };

/**
 * SVG symbol helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class SVGSymbol {

    constructor() {
        let symbols = [];

        this.define = (id, width, height, innerHTML) => {
            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('style', 'display: none;');
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svg.innerHTML = `<symbol id="${id}">${innerHTML}</symbol>`;
            document.body.insertBefore(svg, document.body.firstChild);
            symbols.push({ id, width, height });
        };

        this.getConfig = id => {
            for (let i = 0; i < symbols.length; i++) if (symbols[i].id === id) return symbols[i];
            return null;
        };
    }
}

export { SVGSymbol };

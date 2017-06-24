/**
 * SVG helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

let SVG = new ( // Singleton pattern

class SVG {

    constructor() {
        let symbols = [];

        this.defineSymbol = (id, width, height, innerHTML) => {
            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('style', 'display: none;');
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            svg.innerHTML = `<symbol id="${id}">${innerHTML}</symbol>`;
            document.body.insertBefore(svg, document.body.firstChild);
            symbols.push({id, width, height});
        };

        this.getSymbolConfig = id => {
            for (let i = 0; i < symbols.length; i++) if (symbols[i].id === id) return symbols[i];
            return null;
        };
    }
}

)(); // Singleton pattern

export { SVG };

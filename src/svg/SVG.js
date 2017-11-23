/**
 * SVG interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils';
import { Interface } from '../util/Interface';

class SVG {

    constructor(name, type, params) {
        let self = this;
        let svg;

        createSVG();

        function createSVG() {
            switch (type) {
                case 'svg':
                    createView();
                    break;
                case 'radialGradient':
                    createGradient();
                    break;
                case 'linearGradient':
                    createGradient();
                    break;
                default:
                    createElement();
                    break;
            }
        }

        function createView() {
            svg = new Interface(name, 'svg');
            svg.element.setAttribute('preserveAspectRatio', 'xMinYMid meet');
            svg.element.setAttribute('version', '1.1');
            svg.element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            if (params.width) {
                svg.element.setAttribute('viewBox', '0 0 ' + params.width + ' ' + params.height);
                svg.element.style.width = params.width + 'px';
                svg.element.style.height = params.height + 'px';
            }
            self.object = svg;
        }

        function createElement() {
            svg = new Interface(name, 'svg', type);
            if (type === 'circle') setCircle();
            else if (type === 'radialGradient') setGradient();
            self.object = svg;
        }

        function setCircle() {
            ['cx', 'cy', 'r'].forEach(attr => {
                if (params.stroke && attr === 'r') svg.element.setAttributeNS(null, attr, params.width / 2 - params.stroke);
                else svg.element.setAttributeNS(null, attr, params.width / 2);
            });
        }

        function setGradient() {
            ['cx', 'cy', 'r', 'fx', 'fy', 'name'].forEach(attr => {
                svg.element.setAttributeNS(null, attr === 'name' ? 'id' : attr, params[attr]);
            });
            svg.element.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
        }

        function createColorStop(obj) {
            let stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            ['offset', 'style'].forEach(attr => {
                stop.setAttributeNS(null, attr, attr === 'style' ? 'stop-color:' + obj[attr] : obj[attr]);
            });
            return stop;
        }

        function createGradient() {
            createElement();
            params.colors.forEach(param => {
                svg.element.appendChild(createColorStop(param));
            });
        }

        this.addTo = element => {
            if (element.points) element = element.points;
            else if (element.element) element = element.element;
            else if (element.object) element = element.object.element;
            element.appendChild(svg.element);
        };

        this.destroy = () => {
            this.object.destroy();
            svg = null;
            return Utils.nullObject(this);
        };
    }
}

export { SVG };

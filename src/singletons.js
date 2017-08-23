/**
 * Add singletons after tree shaking.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

export default function singletons() {
    return {
        transformBundle: code => {
            return {
                code: code.replace(/class (Render|CanvasFont|Utils|Device|Mouse|Accelerometer|Storage|Images|SVGSymbol|TweenManager|Interpolation|WebAudio|XHR|Stage)([\s\S]*?\n})/g, 'let $1 = new ( // Singleton pattern\n\nclass $1$2\n\n)(); // Singleton pattern'),
                map: { mappings: '' }
            };
        }
    };
}

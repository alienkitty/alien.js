/**
 * Canvas font utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { CanvasGraphics } from './CanvasGraphics';

class CanvasFont {

    constructor() {

        function createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign) {
            const context = canvas.context,
                graphics = new CanvasGraphics(width, height);
            graphics.font = font;
            graphics.fillStyle = fillStyle;
            graphics.textBaseline = textBaseline;
            graphics.totalWidth = 0;
            graphics.totalHeight = height;
            const characters = str.split('');
            let chr,
                index = 0,
                currentPosition = 0;
            context.font = font;
            for (let i = 0; i < characters.length; i++) graphics.totalWidth += context.measureText(characters[i]).width + letterSpacing;
            switch (textAlign) {
                case 'start':
                case 'left':
                    currentPosition = 0;
                    break;
                case 'end':
                case 'right':
                    currentPosition = width - graphics.totalWidth;
                    break;
                case 'center':
                    currentPosition = (width - graphics.totalWidth) / 2;
                    break;
            }
            do {
                chr = characters[index++];
                graphics.fillText(chr, currentPosition, 0);
                currentPosition += context.measureText(chr).width + letterSpacing;
            } while (index < str.length);
            return graphics;
        }

        this.createText = (canvas, width, height, str, font, fillStyle, { textBaseline = 'alphabetic', lineHeight = height, letterSpacing = 0, textAlign = 'start' }) => {
            const context = canvas.context;
            if (height === lineHeight) {
                return createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign);
            } else {
                const text = new CanvasGraphics(width, height),
                    words = str.split(' '),
                    lines = [];
                let line = '';
                text.totalWidth = 0;
                text.totalHeight = 0;
                context.font = font;
                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + ' ',
                        characters = testLine.split('');
                    let testWidth = 0;
                    for (let i = 0; i < characters.length; i++) testWidth += context.measureText(characters[i]).width + letterSpacing;
                    if (testWidth > width && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                lines.forEach((line, i) => {
                    const graphics = createText(canvas, width, lineHeight, line.slice(0, -1), font, fillStyle, textBaseline, letterSpacing, textAlign);
                    graphics.y = i * lineHeight;
                    text.add(graphics);
                    text.totalWidth = Math.max(graphics.totalWidth, text.totalWidth);
                    text.totalHeight += lineHeight;
                });
                return text;
            }
        };
    }
}

export { CanvasFont };

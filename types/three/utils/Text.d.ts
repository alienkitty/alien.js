import { Mesh } from 'three';

import type { ColorRepresentation, ShaderMaterial, Texture } from 'three';

export interface TextFontGlyph {
    id: number;
    index: number;
    char: string;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
    chnl: number;
    x: number;
    y: number;
    page: number;
}

export interface TextFontKerning {
    first: number;
    second: number;
    amount: number;
}

export interface TextFont {
    pages: string[];
    chars: TextFontGlyph[];
    info: {
        face: string;
        size: number;
        bold: number;
        italic: number;
        charset: string[];
        unicode: number;
        stretchH: number;
        smooth: number;
        aa: number;
        padding: number[];
        spacing: number[];
    },
    common: {
        lineHeight: number;
        base: number;
        scaleW: number;
        scaleH: number;
        pages: number;
        packed: number;
        alphaChnl: number;
        redChnl: number;
        greenChnl: number;
        blueChnl: number;
    };
    distanceField: {
        fieldType: 'msdf';
        distanceRange: number;
    },
    kernings: TextFontKerning[];
}

export interface TextLine {
    width: number;
    glyphs: [TextFontGlyph, number][];
}

export interface TextOptions {
    material: ShaderMaterial;
    map: Texture | null;
    color: ColorRepresentation;
    font: TextFont;
    text: string;
    width: number;
    align: 'left' | 'center' | 'right';
    size: number;
    letterSpacing: number;
    lineHeight: number;
    wordSpacing: number;
    wordBreak: boolean;
}

/**
 * A class for a MSDF (Multichannel Signed Distance Fields) text mesh.
 *
 * @see {@link https://oframe.github.io/ogl/examples/?src=msdf-text.html | OGL - MSDF Text Glyphs Example}
 * @see {@link https://github.com/alienkitty/alien.js/blob/main/src/three/utils/Text.js | Source}
 */
export class Text extends Mesh {
    font: TextFont;
    text: string;
    width: number;
    align: 'left' | 'center' | 'right';
    size: number;
    letterSpacing: number;
    lineHeight: number;
    wordSpacing: number;
    wordBreak: boolean;

    newline: RegExp;
    whitespace: RegExp;

    constructor(options?: Partial<TextOptions>);

    parseFont(): void;

    createGeometry(): void;

    updateGeometry(): void;

    populateBuffers(lines: TextLine[]): void;

    getKernPairOffset(id1: number, id2: number): number;

    setWidth(width: number): void;

    setText(text: string): void;

    destroy(): null;
}

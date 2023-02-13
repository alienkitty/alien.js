export class Styles {
    static h1 = {
        width: 'fit-content',
        margin: '0 0 6px -1px',
        fontFamily: 'D-DIN, sans-serif',
        fontWeight: '400',
        fontSize: 24,
        lineHeight: '1.3',
        textTransform: 'uppercase'
    };

    static content = {
        width: 'fit-content',
        margin: '6px 0',
        fontFamily: 'Gothic A1, sans-serif',
        fontWeight: '500',
        fontSize: 13,
        lineHeight: '1.5',
        letterSpacing: 'normal'
    };

    static label = {
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: '500',
        fontSize: 11,
        lineHeight: 15,
        letterSpacing: '0.03em'
    };

    static number = {
        ...this.label,
        letterSpacing: 1
    };

    static secondary = {
        ...this.label,
        fontSize: 10,
        letterSpacing: 0.5
    };
}

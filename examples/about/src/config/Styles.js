export class Styles {
    static h1 = {
        position: 'relative',
        left: -1,
        margin: '0 0 6px',
        fontFamily: '"D-DIN", sans-serif',
        fontWeight: '400',
        fontSize: 24,
        lineHeight: '1.3',
        textTransform: 'uppercase'
    };

    static content = {
        position: 'relative',
        margin: '6px 0'
    };

    static label = {
        fontFamily: '"Roboto Mono", monospace',
        fontSize: 11,
        lineHeight: 15,
        letterSpacing: '0.03em'
    };

    static small = {
        ...this.label,
        fontSize: 10,
        letterSpacing: 0.5
    };

    static number = {
        ...this.label,
        letterSpacing: 1
    };
}

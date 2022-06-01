export class Styles {
    static label = {
        fontFamily: 'Roboto Mono, monospace',
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

    static panel = {
        ...this.label
    };
}

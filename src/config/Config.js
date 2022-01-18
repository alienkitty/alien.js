export class Config {
    static BREAKPOINT = 1000;

    static CDN = '';

    static ASSETS = [
        'assets/images/alienkitty.svg',
        'assets/images/alienkitty_eyelid.svg'
    ];

    static GUI = /[?&]ui/.test(location.search);
    static ORBIT = /[?&]orbit/.test(location.search);
}

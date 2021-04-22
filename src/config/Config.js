export class Config {
    static BG_COLOR = '#000';
    static UI_COLOR = 'rgba(255, 255, 255, 0.94)';

    static BREAKPOINT = 1000;

    static CDN = '';

    static ASSETS = [
        'assets/images/alienkitty.svg',
        'assets/images/alienkitty_eyelid.svg'
    ];

    static GUI = /[?&]ui/.test(location.search);
    static ORBIT = /[?&]orbit/.test(location.search);
}

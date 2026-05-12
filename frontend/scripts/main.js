// const apiBaseUrl = '/api';
const apiBaseUrl = 'http://localhost:5000';

function parseTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    const parsed =
        d ? `${toPlural(d, 'day')}, ${toPlural(h % 24, 'hour')}` :
        h ? `${toPlural(h, 'hour')}, ${toPlural(m % 60, 'min')}` :
        m ? `${toPlural(m, 'min')}, ${toPlural(s % 60, 'sec')}` :
        `${toPlural(toDecimal(ms / 1000), 'sec')}`;

    return parsed;
}

function parseSize(b) {
    const kb = b / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    const parsed = 
        Math.floor(gb) ? `${toDecimal(gb)}GB` :
        Math.floor(mb) ? `${toDecimal(mb)}MB` :
        Math.floor(kb) ? `${toDecimal(kb)}KB` :
        `${b}B`;

    return parsed;
}

function toDecimal(num, decimals = 2) {
    return Math.round(num * 10 ** decimals) / 10 ** decimals;
}

function toPlural(num, text) {
    return `${num} ${text}${num !== 1 ? 's' : ''}`;
}
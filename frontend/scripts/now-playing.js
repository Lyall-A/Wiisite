const trackEl = document.getElementById('track');
const albumEl = document.getElementById('album');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const currentlyPlayingEl = document.getElementById('currently-playing');
const dateEl = document.getElementById('date');
const nowPlayingEl = document.getElementById('now-playing');

(async function updateNowPlaying() {
    const nowPlaying = await fetch('https://api.lyall.lol/v1/now-playing').then(res => res.json());
    // const nowPlaying = {"title":"The Days (NOTION Remix)","album":"The Days (NOTION Remix)","artist":"Chrystal","url":"https://www.last.fm/music/Chrystal/_/The+Days+(NOTION+Remix)","covers":[{"size":"small","url":"https://lastfm.freetls.fastly.net/i/u/34s/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"medium","url":"https://lastfm.freetls.fastly.net/i/u/64s/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"large","url":"https://lastfm.freetls.fastly.net/i/u/174s/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"extralarge","url":"https://lastfm.freetls.fastly.net/i/u/300x300/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"original","url":"https://lastfm.freetls.fastly.net/i/u/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"}],"date":null,"currentlyPlaying":true}
    // const nowPlaying = {"title":"The Days (NOTION Remix)","album":"The Days (NOTION Remix)","artist":"Chrystal","url":"https://www.last.fm/music/Chrystal/_/The+Days+(NOTION+Remix)","covers":[{"size":"small","url":"https://lastfm.freetls.fastly.net/i/u/34s/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"medium","url":"https://lastfm.freetls.fastly.net/i/u/64s/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"large","url":"https://lastfm.freetls.fastly.net/i/u/174s/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"extralarge","url":"https://lastfm.freetls.fastly.net/i/u/300x300/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"},{"size":"original","url":"https://lastfm.freetls.fastly.net/i/u/f5ac8a07b3030b4a62b1945e4dd21d88.jpg"}],"date":1778527314404,"currentlyPlaying":false}

    nowPlayingEl.href = nowPlaying.url;
    nowPlayingEl.style.display = '';
    trackEl.textContent = nowPlaying.title;
    albumEl.textContent = nowPlaying.album;
    artistEl.textContent = nowPlaying.artist;
    coverEl.src = nowPlaying.covers?.find(cover => cover.size === 'original')?.url;
    dateEl.textContent = nowPlaying.date ? parseTimeAgo(Date.now() - nowPlaying.date) : '';
    if (nowPlaying.currentlyPlaying) {
        dateEl.classList.add('currently-playing');
        coverEl.classList.add('rotate');
    } else {
        dateEl.classList.remove('currently-playing');
        coverEl.classList.remove('rotate');
    }

    setTimeout(updateNowPlaying, 5 * 1000);
})();

function parseTimeAgo(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    const parsed =
        d ? `${toPlural(d, 'day')}, ${toPlural(h % 24, 'hour')} ago` :
        h ? `${toPlural(h, 'hour')}, ${toPlural(m % 60, 'min')} ago` :
        m ? `${toPlural(m, 'min')}, ${toPlural(s % 60, 'sec')} ago` :
        `${toPlural(Math.floor(ms / 1000), 'sec')} ago`;

    return parsed;
}
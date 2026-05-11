const uptimeEl = document.getElementById('uptime');
const processesEl = document.getElementById('processes');
const memoryTotalEl = document.getElementById('memory-total');
const memoryUsedEl = document.getElementById('memory-used');
const memoryFreeEl = document.getElementById('memory-free');
const swapTotalEl = document.getElementById('swap-total');
const swapUsedEl = document.getElementById('swap-used');
const swapFreeEl = document.getElementById('swap-free');
const dataSentEl = document.getElementById('data-sent');
const dataReceivedEl = document.getElementById('data-received');
const packetsSentEl = document.getElementById('packets-sent');
const packetsReceivedEl = document.getElementById('packets-received');

(async function updateStatus() {
    try {
        const status = await fetch('/api/status').then(res => res.json());

        uptimeEl.textContent = parseTime(status.current_time - status.boot_time);
        memoryTotalEl.textContent = parseSize(status.memory.usage_total);
        memoryUsedEl.textContent = parseSize(status.memory.usage_used);
        memoryFreeEl.textContent = parseSize(status.memory.usage_free);
        memoryTotalEl.textContent = parseSize(status.memory.usage_total);
        memoryUsedEl.textContent = parseSize(status.memory.usage_used);
        memoryFreeEl.textContent = parseSize(status.memory.usage_free);
        swapTotalEl.textContent = parseSize(status.swap.usage_total);
        swapUsedEl.textContent = parseSize(status.swap.usage_used);
        swapFreeEl.textContent = parseSize(status.swap.usage_free);
        dataSentEl.textContent = parseSize(status.io.network.data_sent);
        dataReceivedEl.textContent = parseSize(status.io.network.data_received);
        packetsSentEl.textContent = status.io.network.packets_sent;
        packetsReceivedEl.textContent = status.io.network.packets_received;
        processesEl.textContent = status.process_count;
    } catch (err) {
        console.log(`Failed to update status: ${err}`);
    }

    setTimeout(updateStatus, 10 * 1000);
})();

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
    const decimals = 2;

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
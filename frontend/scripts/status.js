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

async function updateStatus(status) {
    try {
        if (!status) status = await fetch(`${apiBaseUrl}/status`).then(res => res.json());

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
        console.error(`Failed to update status: ${err}`);
    }
};

(async function update() {
    await updateStatus();
    setTimeout(update, 10 * 1000);
})();
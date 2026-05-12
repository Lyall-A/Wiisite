const fanEl = document.getElementById('fan');
const dcDcEl = document.getElementById('dc-dc');
const discInsertedEl = document.getElementById('disc-inserted');
const discLEDEl = document.getElementById('disc-led');
const sensorBarEl = document.getElementById('sensor-bar');

async function updateIO(io) {
    try {
        if (!io) io = await fetch(`${apiBaseUrl}/io`).then(res => res.json());

        fanEl.textContent = io.fan_enabled ? 'On' : 'Off';
        dcDcEl.textContent = io.dc_dc_enabled ? 'On' : 'Off';
        discInsertedEl.textContent = io.disc_inserted ? 'Yes' : 'No';
        discLEDEl.textContent = io.disc_led_enabled ? 'On' : 'Off';
        sensorBarEl.textContent = io.sensor_bar_enabled ? 'On' : 'Off';
    } catch (err) {
        console.error(`Failed to update IO: ${err}`);
    }
};

(async function update() {
    await updateIO();
    setTimeout(update, 10 * 1000);
})();

function ejectDisc() {
    // sorry
}

async function toggleDiscLED() {
    try {
        await fetch(`${apiBaseUrl}/io/disc_led/toggle`, { method: 'POST' })
            .then(res => res.json())
            .then(updateIO)
    } catch (err) {
        console.error(`Failed to toggle Disc LED: ${err}`);
    }
}

async function toggleSensorBar() {
    try {
        await fetch(`${apiBaseUrl}/io/sensor_bar/toggle`, { method: 'POST' })
            .then(res => res.json())
            .then(updateIO)
    } catch (err) {
        console.error(`Failed to toggle Sensor Bar: ${err}`);
    }
}
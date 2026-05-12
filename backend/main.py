from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # temp
from datetime import datetime
import psutil
import os

def setup_pin(pin, input = False, enabled = False):
    if not os.path.exists(f"/sys/class/gpio/gpio{pin}"):
        with open("/sys/class/gpio/export", "w") as file:
            file.write(str(pin))
    
    with open(f"/sys/class/gpio/gpio{pin}/direction", "w") as file:
        file.write("in" if input else "high" if enabled else "low")

def set_pin(pin, enabled):
    with open(f"/sys/class/gpio/gpio{pin}/value", "w") as file:
        file.write("1" if enabled else "0")

def get_pin(pin):
    with open(f"/sys/class/gpio/gpio{pin}/value", "r") as file:
        return True if file.read().strip() == "1" else False

# TODO: store pins in an array or dict instead of hard coding in all endpoints
def get_pins():
    return {
        "fan_enabled": get_pin(490),
        "dc_dc_enabled": get_pin(491),
        "sensor_bar_enabled": get_pin(496),
        "disc_inserted": get_pin(495),
        "disc_led_enabled": get_pin(493),
        "disc_disabled": get_pin(492)
    }

# Pins start at 488, list of pins can be found at https://wiibrew.org/wiki/Hollywood/GPIOs
# setup_pin(489, enabled=False) # Shutdown
# setup_pin(490, enabled=True) # Fan power
# setup_pin(491, enabled=True) # DC/DC converter power
# setup_pin(492, enabled=False) # Disc disable
# setup_pin(493, enabled=False) # Disc LED
# setup_pin(495, input=True) # Disc detection
# setup_pin(496, enabled=True) # Sensor bar power
# setup_pin(497, enabled=False) # Eject trigger

messages = []

app = FastAPI()

# temp
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
def get_status():
    # cpu_frequency = psutil.cpu_freq()
    memory = psutil.virtual_memory()
    swap = psutil.swap_memory()
    disk_io = psutil.disk_io_counters()
    network_io = psutil.net_io_counters()

    return {
        # "cpu_usage": psutil.cpu_percent(),
        # "cpu": {
        #     "freq_current": cpu_frequency.current,
        #     "freq_min": cpu_frequency.min,
        #     "freq_max": cpu_frequency.max,
        # },
        "cpus": [
            {
                "current": frequency.current,
                "min": frequency.min,
                "max": frequency.max,
            }
            for frequency in psutil.cpu_freq(percpu=True)
        ],
        "memory": {
            "usage_total": memory.total,
            "usage_used": memory.used,
            "usage_free": memory.available
        },
        "swap": {
            "usage_total": swap.total,
            "usage_used": swap.used,
            "usage_free": swap.free
        },
        "disks": [
            {
                "device_path": disk.device,
                "mount_path": disk.mountpoint,
                "usage_total": usage.total,
                "usage_used": usage.used,
                "usage_free": usage.free
            }
            for disk in psutil.disk_partitions()
            for usage in [psutil.disk_usage(disk.device)]
        ],
        "io": {
            "disk": {
                "write_data": disk_io.write_bytes,
                "read_data": disk_io.read_bytes,
                "write_count": disk_io.write_count,
                "read_count": disk_io.read_count,
            },
            "network": {
                "data_sent": network_io.bytes_sent,
                "data_received": network_io.bytes_recv,
                "packets_sent": network_io.packets_sent,
                "packets_received": network_io.packets_recv,
            }
        },
        "current_time": datetime.now().timestamp() * 1000,
        "boot_time": psutil.boot_time() * 1000,
        "process_count": len(psutil.pids())
    }
# print(get_status()

@app.get("/io")
def get_io():
   return get_pins()

@app.post("/io/{device}/{method}")
def post_io_toggle(device, method):
    # TODO: check if method/device is valid
    if method == "enable":
        if device == "disc_led": set_pin(493, True)
        elif device == "sensor_bar": set_pin(496, True)
    if method == "disable":
        if device == "disc_led": set_pin(493, False)
        elif device == "sensor_bar": set_pin(496, False)
    if method == "toggle":
        if device == "disc_led": set_pin(493, not get_pin(493))
        elif device == "sensor_bar": set_pin(496, not get_pin(496))

    return get_pins()

@app.get("/chat")
def get_chat(limit = 25, offset = 0, sort = "desc"):
    descending = sort == "desc"
    sliced_messages = messages[offset:offset + limit]
    sorted_messages = sorted(sliced_messages, key=lambda message: message["date"], reverse=descending)
    return {
        "offset": offset,
        "limit": limit,
        "total": len(messages),
        "descending": descending,
        "messages": sorted_messages
    }

@app.post("/chat")
def post_chat(content, username = "Anonymous"):
    message = {
        "content": content,
        "username": username,
        "date": datetime.now().timestamp() * 1000,
    }

    global messages
    messages.append(message)
    messages = messages[-100:] # truncate old messages
    
    return message
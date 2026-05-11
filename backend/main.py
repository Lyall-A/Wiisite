from fastapi import FastAPI
from datetime import datetime
import psutil

app = FastAPI()

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

# print(get_status())
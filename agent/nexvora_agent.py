#!/usr/bin/env python3
"""
Nexvora Server Agent
Monitors CPU, RAM, and Disk usage and sends it to your Nexvora Dashboard.
"""

import sys
import time
import argparse
import requests

try:
    import psutil
except ImportError:
    print("Error: psutil is not installed.")
    print("Please install it by running: pip install psutil")
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Nexvora Server Agent")
    parser.add_argument('--key', required=True, help='Your Nexvora Client Key')
    parser.add_argument('--endpoint', default='http://127.0.0.1:5000/api/ingest/metrics', help='Nexvora API Endpoint')
    parser.add_argument('--interval', type=int, default=60, help='Interval in seconds between metrics')
    args = parser.parse_args()

    print(f"Starting Nexvora Server Agent...")
    print(f"Endpoint: {args.endpoint}")
    print(f"Interval: {args.interval} seconds")
    print("Press Ctrl+C to stop.\n")

    headers = {
        'Content-Type': 'application/json',
        'X-Nexvora-Key': args.key
    }

    try:
        while True:
            # Collect metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            ram = psutil.virtual_memory()
            ram_percent = ram.percent
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent

            payload = {
                'cpu_percent': cpu_percent,
                'ram_percent': ram_percent,
                'disk_percent': disk_percent
            }

            try:
                response = requests.post(args.endpoint, json=payload, headers=headers, timeout=5)
                if response.status_code == 201:
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Metrics sent successfully! CPU: {cpu_percent}%, RAM: {ram_percent}%, Disk: {disk_percent}%")
                else:
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Failed to send metrics. Status: {response.status_code} - {response.text}")
            except requests.exceptions.RequestException as e:
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Error connecting to Nexvora server: {e}")

            # Sleep for the remaining interval (subtract 1s used by cpu_percent)
            time.sleep(max(0, args.interval - 1))

    except KeyboardInterrupt:
        print("\nStopping Nexvora Server Agent.")

if __name__ == "__main__":
    main()

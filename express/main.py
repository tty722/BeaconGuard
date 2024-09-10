# main.py
import time
import json
from datetime import datetime

def generate_data():
    while True:
        packet_info = {
            "time": datetime.utcnow().isoformat() + "Z",
            "protocol": "UDP",
            "sourceIP": "127.0.0.1",
            "sourcePort": 12345,
            "destinationIP": "127.0.0.1",
            "destinationPort": 54321
        }
        print(json.dumps(packet_info))
        time.sleep(1)

if __name__ == "__main__":
    generate_data()

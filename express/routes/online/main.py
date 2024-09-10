from scapy.all import sniff, IP, TCP, UDP, ICMP, ARP
from datetime import datetime
import json

def is_http(packet):
    return TCP in packet and (packet[TCP].dport == 80 or packet[TCP].sport == 80)

def is_mdns(packet):
    return UDP in packet and (packet[UDP].dport == 5353 or packet[UDP].sport == 5353)

def is_ftp(packet):
    return TCP in packet and (packet[TCP].dport == 21 or packet[TCP].sport == 21)

def has_ip_and_port(packet):
    return IP in packet and (TCP in packet or UDP in packet)

def get_protocol(packet):
    if ICMP in packet:
        return "ICMP"
    elif ARP in packet:
        return "ARP"
    elif is_mdns(packet):
        return "MDNS"
    elif is_http(packet):
        return "HTTP"
    elif is_ftp(packet):
        return "FTP"
    elif UDP in packet:
        return "UDP"
    elif TCP in packet:
        return "TCP"
    else:
        return "OTHER"

def print_packet_info(packet):
    protocol = get_protocol(packet)
    
    if not has_ip_and_port(packet):
        return
    
    source_ip = packet[IP].src
    dest_ip = packet[IP].dst
    
    if TCP in packet:
        source_port = packet[TCP].sport
        dest_port = packet[TCP].dport
    elif UDP in packet:
        source_port = packet[UDP].sport
        dest_port = packet[UDP].dport
    
    time = datetime.utcfromtimestamp(packet.time).isoformat() + "Z"
    
    packet_info = {
        "time": time,
        "protocol": protocol,
        "sourceIP": source_ip,
        "sourcePort": source_port,
        "destinationIP": dest_ip,
        "destinationPort": dest_port
    }
    
    print(json.dumps(packet_info))

if __name__ == "__main__":
    sniff(prn=print_packet_info)

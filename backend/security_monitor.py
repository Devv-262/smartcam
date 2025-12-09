import logging
import subprocess
import re
from datetime import datetime, timedelta
from collections import defaultdict
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SecurityMonitor:
    def __init__(self, socketio=None):
        self.socketio = socketio
        self.attack_log = []
        self.blocked_ips = set()
        self.failed_logins = defaultdict(int)
        self.last_packet_count = 0
        self.packet_timestamps = []
        
    def detect_dos_attack(self, packet_count):
        """Detect DoS attack based on packet rate"""
        current_time = datetime.now()
        self.packet_timestamps.append(current_time)
        
        # Keep only last 60 seconds
        one_minute_ago = current_time - timedelta(seconds=60)
        self.packet_timestamps = [t for t in self.packet_timestamps if t > one_minute_ago]
        
        packets_per_second = len(self.packet_timestamps) / 60
        
        if packets_per_second > Config.DOS_PACKET_THRESHOLD / 60:
            alert = {
                'type': 'critical',
                'category': 'DoS Attack',
                'message': f'High packet rate detected: {int(packets_per_second * 60)} packets/min',
                'time': current_time.strftime('%H:%M:%S'),
                'severity': 'CRITICAL',
                'source': 'Network Monitor'
            }
            self.log_attack(alert)
            return True
        return False
    
    def detect_sql_injection(self, input_string):
        """Detect SQL injection patterns"""
        for pattern in Config.SQL_INJECTION_PATTERNS:
            if pattern.lower() in input_string.lower():
                alert = {
                    'type': 'warning',
                    'category': 'SQL Injection',
                    'message': f'SQL injection pattern detected: {pattern}',
                    'time': datetime.now().strftime('%H:%M:%S'),
                    'severity': 'HIGH',
                    'source': 'Input Validation'
                }
                self.log_attack(alert)
                return True
        return False
    
    def detect_brute_force(self, ip_address):
        """Detect brute force attacks"""
        self.failed_logins[ip_address] += 1
        
        if self.failed_logins[ip_address] >= Config.BRUTE_FORCE_THRESHOLD:
            alert = {
                'type': 'warning',
                'category': 'Brute Force',
                'message': f'Multiple failed login attempts from {ip_address}',
                'time': datetime.now().strftime('%H:%M:%S'),
                'severity': 'HIGH',
                'source': ip_address
            }
            self.log_attack(alert)
            self.block_ip(ip_address)
            return True
        return False
    
    def detect_port_scan(self, ip_address):
        """Detect port scanning activity"""
        alert = {
            'type': 'info',
            'category': 'Port Scan',
            'message': f'Port scanning activity detected from {ip_address}',
            'time': datetime.now().strftime('%H:%M:%S'),
            'severity': 'MEDIUM',
            'source': ip_address
        }
        self.log_attack(alert)
        return True
    
    def detect_arp_spoofing(self):
        """Detect ARP spoofing using arp command"""
        try:
            result = subprocess.run(['arp', '-a'], capture_output=True, text=True)
            # Check for duplicate MAC addresses (simple detection)
            mac_addresses = re.findall(r'([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})', result.stdout)
            
            if len(mac_addresses) != len(set(mac_addresses)):
                alert = {
                    'type': 'critical',
                    'category': 'ARP Spoofing',
                    'message': 'Duplicate MAC addresses detected - Possible ARP poisoning',
                    'time': datetime.now().strftime('%H:%M:%S'),
                    'severity': 'CRITICAL',
                    'source': 'ARP Monitor'
                }
                self.log_attack(alert)
                return True
        except Exception as e:
            logger.error(f"Error checking ARP table: {e}")
        return False
    
    def block_ip(self, ip_address):
        """Block an IP address using UFW"""
        if ip_address not in self.blocked_ips:
            try:
                subprocess.run(['sudo', 'ufw', 'deny', 'from', ip_address], 
                             capture_output=True, check=True)
                self.blocked_ips.add(ip_address)
                logger.info(f"Blocked IP: {ip_address}")
                
                if self.socketio:
                    self.socketio.emit('ip_blocked', {
                        'ip': ip_address,
                        'time': datetime.now().isoformat()
                    })
                return True
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to block IP {ip_address}: {e}")
        return False
    
    def unblock_ip(self, ip_address):
        """Unblock an IP address"""
        if ip_address in self.blocked_ips:
            try:
                subprocess.run(['sudo', 'ufw', 'delete', 'deny', 'from', ip_address], 
                             capture_output=True, check=True)
                self.blocked_ips.remove(ip_address)
                logger.info(f"Unblocked IP: {ip_address}")
                return True
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to unblock IP {ip_address}: {e}")
        return False
    
    def log_attack(self, alert):
        """Log attack and emit to frontend"""
        self.attack_log.append(alert)
        
        # Keep only last 100 attacks
        if len(self.attack_log) > 100:
            self.attack_log = self.attack_log[-100:]
        
        # Emit to frontend
        if self.socketio:
            self.socketio.emit('attack_detected', alert)
        
        logger.warning(f"Attack detected: {alert['category']} - {alert['message']}")
    
    def get_attack_log(self):
        """Return attack log"""
        return self.attack_log
    
    def get_attack_stats(self):
        """Get attack statistics"""
        stats = {
            'dos': 0,
            'sql_injection': 0,
            'brute_force': 0,
            'arp_spoofing': 0,
            'port_scan': 0,
            'mitm': 0
        }
        
        for attack in self.attack_log:
            category = attack['category'].lower().replace(' ', '_')
            if category in stats:
                stats[category] += 1
        
        return stats
    
    def enable_fail2ban(self):
        """Enable Fail2Ban service"""
        try:
            subprocess.run(['sudo', 'systemctl', 'start', 'fail2ban'], check=True)
            logger.info("Fail2Ban enabled")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to enable Fail2Ban: {e}")
            return False
    
    def enable_firewall(self):
        """Enable UFW firewall"""
        try:
            subprocess.run(['sudo', 'ufw', 'enable'], check=True)
            logger.info("UFW firewall enabled")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to enable firewall: {e}")
            return False
    
    def restart_network_services(self):
        """Restart network services"""
        try:
            subprocess.run(['sudo', 'systemctl', 'restart', 'networking'], check=True)
            logger.info("Network services restarted")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to restart network services: {e}")
            return False
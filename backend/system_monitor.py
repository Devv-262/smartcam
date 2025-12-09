import psutil
import logging
from datetime import datetime
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SystemMonitor:
    def __init__(self, socketio=None):
        self.socketio = socketio
        
    def get_cpu_usage(self):
        """Get CPU usage percentage"""
        return psutil.cpu_percent(interval=1)
    
    def get_memory_usage(self):
        """Get memory usage percentage"""
        memory = psutil.virtual_memory()
        return memory.percent
    
    def get_disk_usage(self):
        """Get disk usage percentage"""
        disk = psutil.disk_usage('/')
        return disk.percent
    
    def get_temperature(self):
        """Get CPU temperature (Raspberry Pi specific)"""
        try:
            with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
                temp = float(f.read()) / 1000.0
                return round(temp, 1)
        except:
            # Fallback for non-Pi systems
            return 50.0
    
    def get_network_stats(self):
        """Get network statistics"""
        net_io = psutil.net_io_counters()
        return {
            'bytes_sent': net_io.bytes_sent,
            'bytes_recv': net_io.bytes_recv,
            'packets_sent': net_io.packets_sent,
            'packets_recv': net_io.packets_recv
        }
    
    def get_network_connections(self):
        """Get active network connections"""
        connections = psutil.net_connections(kind='inet')
        return len([conn for conn in connections if conn.status == 'ESTABLISHED'])
    
    def get_all_stats(self):
        """Get all system statistics"""
        stats = {
            'cpu': self.get_cpu_usage(),
            'memory': self.get_memory_usage(),
            'disk': self.get_disk_usage(),
            'temperature': self.get_temperature(),
            'network': self.get_network_stats(),
            'connections': self.get_network_connections(),
            'timestamp': datetime.now().isoformat()
        }
        
        # Check for warnings
        warnings = []
        if stats['cpu'] > Config.CPU_WARNING_THRESHOLD:
            warnings.append(f"High CPU usage: {stats['cpu']}%")
        if stats['memory'] > Config.MEMORY_WARNING_THRESHOLD:
            warnings.append(f"High memory usage: {stats['memory']}%")
        if stats['temperature'] > Config.TEMP_WARNING_THRESHOLD:
            warnings.append(f"High temperature: {stats['temperature']}°C")
        if stats['disk'] > Config.DISK_WARNING_THRESHOLD:
            warnings.append(f"High disk usage: {stats['disk']}%")
        
        stats['warnings'] = warnings
        
        # Emit to frontend
        if self.socketio and warnings:
            self.socketio.emit('system_warning', {
                'warnings': warnings,
                'stats': stats
            })
        
        return stats
    
    def get_process_info(self):
        """Get information about running processes"""
        processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
            try:
                processes.append(proc.info)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        
        # Sort by CPU usage
        processes.sort(key=lambda x: x.get('cpu_percent', 0), reverse=True)
        return processes[:10]  # Return top 10
    
    def check_service_status(self, service_name):
        """Check if a service is running"""
        for proc in psutil.process_iter(['name']):
            if service_name.lower() in proc.info['name'].lower():
                return True
        return False
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'smart-campus-secret-key-2024')
    FLASK_HOST = '0.0.0.0'
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    # MQTT Configuration
    MQTT_BROKER = os.getenv('MQTT_BROKER', 'localhost')
    MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
    MQTT_KEEPALIVE = 60
    MQTT_TOPICS = {
        'building_a': 'campus/building_a/#',
        'building_b': 'campus/building_b/#',
        'parking': 'campus/parking/#',
        'park': 'campus/park/#'
    }
    
    # Email Configuration
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS', '')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@rnsinstitute.edu.in')
    
    # Security Thresholds
    DOS_PACKET_THRESHOLD = 1000  # packets per second
    BRUTE_FORCE_THRESHOLD = 5  # failed attempts
    SQL_INJECTION_PATTERNS = [
        "' OR '1'='1",
        "'; DROP TABLE",
        "UNION SELECT",
        "' OR 1=1--",
        "<script>",
        "javascript:"
    ]
    
    # System Monitoring
    CPU_WARNING_THRESHOLD = 80  # percentage
    MEMORY_WARNING_THRESHOLD = 85  # percentage
    TEMP_WARNING_THRESHOLD = 70  # Celsius
    DISK_WARNING_THRESHOLD = 90  # percentage
    
    # ESP32 Node Configuration
    ESP32_NODES = {
        'buildingA': {
            'ip': '192.168.1.101',
            'name': 'Building A',
            'esp32_id': 'ESP32-Node-01'
        },
        'buildingB': {
            'ip': '192.168.1.102',
            'name': 'Building B',
            'esp32_id': 'ESP32-Node-02'
        },
        'parking': {
            'ip': '192.168.1.103',
            'name': 'Parking Area',
            'esp32_id': 'ESP32-Node-03'
        },
        'park': {
            'ip': '192.168.1.104',
            'name': 'Park Zone',
            'esp32_id': 'ESP32-Node-04'
        }
    }
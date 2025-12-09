from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import logging
import threading
import time
from datetime import datetime

from config import Config
from mqtt_handler import MQTTHandler
from system_monitor import SystemMonitor
from security_monitor import SecurityMonitor
from email_alerts import EmailAlerts

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = Config.SECRET_KEY
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize handlers
mqtt_handler = MQTTHandler(socketio=socketio)
system_monitor = SystemMonitor(socketio=socketio)
security_monitor = SecurityMonitor(socketio=socketio)
email_alerts = EmailAlerts()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Background monitoring thread
def background_monitoring():
    """Background thread for continuous monitoring"""
    while True:
        try:
            # Get system stats
            stats = system_monitor.get_all_stats()
            socketio.emit('system_stats', stats)
            
            # Check for attacks (simulated)
            if stats['connections'] > 100:
                security_monitor.detect_dos_attack(stats['connections'])
            
            # Send warnings if any
            if stats.get('warnings'):
                if email_alerts.enabled:
                    email_alerts.send_system_warning(stats)
            
            time.sleep(5)  # Update every 5 seconds
            
        except Exception as e:
            logger.error(f"Error in background monitoring: {e}")
            time.sleep(5)

# API Routes

@app.route('/')
def index():
    return jsonify({
        'status': 'online',
        'message': 'Smart Campus Backend API',
        'version': '1.0',
        'mqtt_connected': mqtt_handler.is_connected
    })

@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    """Get all sensor data"""
    try:
        return jsonify({
            'success': True,
            'data': mqtt_handler.get_sensor_data()
        })
    except Exception as e:
        logger.error(f"Error getting sensors: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sensors/control', methods=['POST'])
def control_sensor():
    """Control a sensor"""
    try:
        data = request.json
        sector = data.get('sector')
        sensor = data.get('sensor')
        action = data.get('action')
        
        success = mqtt_handler.control_sensor(sector, sensor, action)
        
        return jsonify({
            'success': success,
            'message': f"Sensor {sensor} in {sector} {action}"
        })
    except Exception as e:
        logger.error(f"Error controlling sensor: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/system/stats', methods=['GET'])
def get_system_stats():
    """Get system statistics"""
    try:
        stats = system_monitor.get_all_stats()
        return jsonify({
            'success': True,
            'data': stats
        })
    except Exception as e:
        logger.error(f"Error getting system stats: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/security/attacks', methods=['GET'])
def get_attacks():
    """Get attack log"""
    try:
        attacks = security_monitor.get_attack_log()
        return jsonify({
            'success': True,
            'data': attacks
        })
    except Exception as e:
        logger.error(f"Error getting attacks: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/security/stats', methods=['GET'])
def get_security_stats():
    """Get attack statistics"""
    try:
        stats = security_monitor.get_attack_stats()
        return jsonify({
            'success': True,
            'data': stats
        })
    except Exception as e:
        logger.error(f"Error getting security stats: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/security/block-ip', methods=['POST'])
def block_ip():
    """Block an IP address"""
    try:
        data = request.json
        ip = data.get('ip')
        
        success = security_monitor.block_ip(ip)
        
        return jsonify({
            'success': success,
            'message': f"IP {ip} blocked" if success else f"Failed to block {ip}"
        })
    except Exception as e:
        logger.error(f"Error blocking IP: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/security/unblock-ip', methods=['POST'])
def unblock_ip():
    """Unblock an IP address"""
    try:
        data = request.json
        ip = data.get('ip')
        
        success = security_monitor.unblock_ip(ip)
        
        return jsonify({
            'success': success,
            'message': f"IP {ip} unblocked" if success else f"Failed to unblock {ip}"
        })
    except Exception as e:
        logger.error(f"Error unblocking IP: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/mitigation/toggle', methods=['POST'])
def toggle_mitigation():
    """Toggle mitigation measures"""
    try:
        data = request.json
        measure = data.get('measure')
        enabled = data.get('enabled')
        
        success = False
        message = ""
        
        if measure == 'firewall':
            success = security_monitor.enable_firewall() if enabled else True
            message = f"Firewall {'enabled' if enabled else 'disabled'}"
        elif measure == 'fail2ban':
            success = security_monitor.enable_fail2ban() if enabled else True
            message = f"Fail2Ban {'enabled' if enabled else 'disabled'}"
        elif measure == 'restart_network':
            success = security_monitor.restart_network_services()
            message = "Network services restarted"
        
        return jsonify({
            'success': success,
            'message': message
        })
    except Exception as e:
        logger.error(f"Error toggling mitigation: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/email/send-report', methods=['POST'])
def send_email_report():
    """Send email report"""
    try:
        report_data = {
            **security_monitor.get_attack_stats(),
            'avg_cpu': system_monitor.get_cpu_usage(),
            'avg_memory': system_monitor.get_memory_usage(),
            'max_temp': system_monitor.get_temperature(),
            'blocked_ips': len(security_monitor.blocked_ips)
        }
        
        success = email_alerts.send_daily_report(report_data)
        
        return jsonify({
            'success': success,
            'message': "Email report sent" if success else "Failed to send email"
        })
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/email/toggle', methods=['POST'])
def toggle_email_alerts():
    """Toggle email alerts"""
    try:
        data = request.json
        enabled = data.get('enabled')
        
        success = email_alerts.toggle_alerts(enabled)
        
        return jsonify({
            'success': success,
            'message': f"Email alerts {'enabled' if enabled else 'disabled'}"
        })
    except Exception as e:
        logger.error(f"Error toggling email: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# SocketIO Events

@socketio.on('connect')
def handle_connect():
    logger.info(f"Client connected: {request.sid}")
    emit('connection_status', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('request_sensor_data')
def handle_sensor_request():
    data = mqtt_handler.get_sensor_data()
    emit('sensor_data', data)

@socketio.on('request_system_stats')
def handle_stats_request():
    stats = system_monitor.get_all_stats()
    emit('system_stats', stats)

# Startup
if __name__ == '__main__':
    # Connect MQTT
    mqtt_handler.connect()
    logger.info("MQTT handler started")
    
    # Start background monitoring
    monitor_thread = threading.Thread(target=background_monitoring, daemon=True)
    monitor_thread.start()
    logger.info("Background monitoring started")
    
    # Run Flask app
    logger.info(f"Starting Smart Campus Backend on {Config.FLASK_HOST}:{Config.FLASK_PORT}")
    socketio.run(app, host=Config.FLASK_HOST, port=Config.FLASK_PORT, debug=Config.DEBUG)
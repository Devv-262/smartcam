import paho.mqtt.client as mqtt
import json
import logging
from datetime import datetime
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MQTTHandler:
    def __init__(self, socketio=None):
        self.client = mqtt.Client()
        self.socketio = socketio
        self.sensor_data = {}
        self.is_connected = False
        
        # Set up callbacks
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info("Connected to MQTT Broker successfully")
            self.is_connected = True
            
            # Subscribe to all campus topics
            for sector, topic in Config.MQTT_TOPICS.items():
                client.subscribe(topic)
                logger.info(f"Subscribed to {topic}")
        else:
            logger.error(f"Failed to connect to MQTT Broker. Return code: {rc}")
            self.is_connected = False
    
    def on_disconnect(self, client, userdata, rc):
        logger.warning(f"Disconnected from MQTT Broker with code: {rc}")
        self.is_connected = False
        
    def on_message(self, client, userdata, msg):
        try:
            # Parse topic: campus/sector/sensor_type
            topic_parts = msg.topic.split('/')
            if len(topic_parts) >= 3:
                sector = topic_parts[1]
                sensor_type = topic_parts[2]
                
                # Parse payload
                payload = json.loads(msg.payload.decode())
                
                # Update sensor data
                if sector not in self.sensor_data:
                    self.sensor_data[sector] = {}
                
                self.sensor_data[sector][sensor_type] = {
                    'value': payload.get('value', 0),
                    'unit': payload.get('unit', ''),
                    'active': payload.get('active', True),
                    'timestamp': datetime.now().isoformat()
                }
                
                # Emit to frontend via SocketIO
                if self.socketio:
                    self.socketio.emit('sensor_update', {
                        'sector': sector,
                        'sensor': sensor_type,
                        'data': self.sensor_data[sector][sensor_type]
                    })
                
                logger.info(f"Sensor update: {sector}/{sensor_type} = {payload.get('value')}")
                
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")
    
    def connect(self):
        try:
            self.client.connect(Config.MQTT_BROKER, Config.MQTT_PORT, Config.MQTT_KEEPALIVE)
            self.client.loop_start()
            logger.info(f"MQTT client started, connecting to {Config.MQTT_BROKER}:{Config.MQTT_PORT}")
        except Exception as e:
            logger.error(f"Failed to connect MQTT client: {e}")
    
    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
        logger.info("MQTT client disconnected")
    
    def publish(self, topic, payload):
        """Publish control commands to ESP32 nodes"""
        try:
            self.client.publish(topic, json.dumps(payload))
            logger.info(f"Published to {topic}: {payload}")
            return True
        except Exception as e:
            logger.error(f"Failed to publish message: {e}")
            return False
    
    def get_sensor_data(self):
        """Return all current sensor data"""
        return self.sensor_data
    
    def control_sensor(self, sector, sensor, action):
        """Send control command to ESP32"""
        topic = f"campus/{sector}/{sensor}/control"
        payload = {'action': action, 'timestamp': datetime.now().isoformat()}
        return self.publish(topic, payload)
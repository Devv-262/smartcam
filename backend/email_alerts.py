import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailAlerts:
    def __init__(self):
        self.smtp_server = Config.SMTP_SERVER
        self.smtp_port = Config.SMTP_PORT
        self.email_address = Config.EMAIL_ADDRESS
        self.email_password = Config.EMAIL_PASSWORD
        self.admin_email = Config.ADMIN_EMAIL
        self.enabled = False
        
        # Check if email is configured
        if self.email_address and self.email_password:
            self.enabled = True
            logger.info("Email alerts enabled")
        else:
            logger.warning("Email alerts disabled - No credentials configured")
    
    def send_email(self, subject, body, to_email=None):
        """Send email alert"""
        if not self.enabled:
            logger.warning("Email not sent - Email alerts disabled")
            return False
        
        if to_email is None:
            to_email = self.admin_email
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_address
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body
            msg.attach(MIMEText(body, 'html'))
            
            # Connect to SMTP server
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_address, self.email_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False
    
    def send_attack_alert(self, attack_data):
        """Send attack alert email"""
        subject = f"🚨 SECURITY ALERT - {attack_data['category']}"
        
        body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .alert {{ background-color: #fee; padding: 20px; border-left: 5px solid #f00; }}
                .info {{ background-color: #e8f4f8; padding: 15px; margin: 10px 0; }}
                .critical {{ color: #c00; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="alert">
                <h2 class="critical">Security Alert Detected</h2>
                <div class="info">
                    <p><strong>Type:</strong> {attack_data['category']}</p>
                    <p><strong>Severity:</strong> {attack_data['severity']}</p>
                    <p><strong>Time:</strong> {attack_data['time']}</p>
                    <p><strong>Message:</strong> {attack_data['message']}</p>
                    <p><strong>Source:</strong> {attack_data.get('source', 'Unknown')}</p>
                </div>
                <p>This is an automated alert from the Smart Campus Security System.</p>
                <p><em>RNS Institute of Technology - Raspberry Pi Control Center</em></p>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(subject, body)
    
    def send_system_warning(self, warning_data):
        """Send system health warning"""
        subject = "⚠️ SYSTEM WARNING - Smart Campus"
        
        body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .warning {{ background-color: #fff3cd; padding: 20px; border-left: 5px solid #ffc107; }}
                .stats {{ background-color: #f8f9fa; padding: 15px; margin: 10px 0; }}
            </style>
        </head>
        <body>
            <div class="warning">
                <h2>System Health Warning</h2>
                <p><strong>Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <div class="stats">
                    <p><strong>CPU Usage:</strong> {warning_data.get('cpu', 0)}%</p>
                    <p><strong>Memory Usage:</strong> {warning_data.get('memory', 0)}%</p>
                    <p><strong>Temperature:</strong> {warning_data.get('temperature', 0)}°C</p>
                    <p><strong>Disk Usage:</strong> {warning_data.get('disk', 0)}%</p>
                </div>
                <h3>Warnings:</h3>
                <ul>
                    {''.join([f'<li>{w}</li>' for w in warning_data.get('warnings', [])])}
                </ul>
                <p>Please check the system immediately.</p>
                <p><em>RNS Institute of Technology - Raspberry Pi Control Center</em></p>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(subject, body)
    
    def send_daily_report(self, report_data):
        """Send daily security report"""
        subject = f"📊 Daily Security Report - {datetime.now().strftime('%Y-%m-%d')}"
        
        body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .report {{ background-color: #f8f9fa; padding: 20px; }}
                .summary {{ background-color: #fff; padding: 15px; margin: 10px 0; border: 1px solid #ddd; }}
                table {{ width: 100%; border-collapse: collapse; }}
                th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #007bff; color: white; }}
            </style>
        </head>
        <body>
            <div class="report">
                <h2>Smart Campus Daily Security Report</h2>
                <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d')}</p>
                
                <div class="summary">
                    <h3>Attack Summary</h3>
                    <table>
                        <tr>
                            <th>Attack Type</th>
                            <th>Count</th>
                        </tr>
                        <tr><td>DoS Attacks</td><td>{report_data.get('dos', 0)}</td></tr>
                        <tr><td>SQL Injection</td><td>{report_data.get('sql_injection', 0)}</td></tr>
                        <tr><td>Brute Force</td><td>{report_data.get('brute_force', 0)}</td></tr>
                        <tr><td>ARP Spoofing</td><td>{report_data.get('arp_spoofing', 0)}</td></tr>
                        <tr><td>Port Scans</td><td>{report_data.get('port_scan', 0)}</td></tr>
                    </table>
                </div>
                
                <div class="summary">
                    <h3>System Performance</h3>
                    <p><strong>Average CPU:</strong> {report_data.get('avg_cpu', 0)}%</p>
                    <p><strong>Average Memory:</strong> {report_data.get('avg_memory', 0)}%</p>
                    <p><strong>Max Temperature:</strong> {report_data.get('max_temp', 0)}°C</p>
                    <p><strong>Blocked IPs:</strong> {report_data.get('blocked_ips', 0)}</p>
                </div>
                
                <p><em>RNS Institute of Technology - Smart Campus Simulation Project</em></p>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(subject, body)
    
    def toggle_alerts(self, enabled):
        """Enable/disable email alerts"""
        if self.email_address and self.email_password:
            self.enabled = enabled
            logger.info(f"Email alerts {'enabled' if enabled else 'disabled'}")
            return True
        return False
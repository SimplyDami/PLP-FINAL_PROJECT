import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from flask import current_app

def send_verification_email(user_email, user_name, verification_token):
    """Send email verification link to user"""
    try:
        # Email configuration
        smtp_server = current_app.config['MAIL_SERVER']
        smtp_port = current_app.config['MAIL_PORT']
        smtp_username = current_app.config['MAIL_USERNAME']
        smtp_password = current_app.config['MAIL_PASSWORD']
        from_email = current_app.config['MAIL_DEFAULT_SENDER']
        site_url = current_app.config['SITE_URL']
        
        # Create verification link
        verification_link = f"{site_url}/verify-email/{verification_token}"
        
        # Create message
        message = MimeMultipart()
        message['From'] = from_email
        message['To'] = user_email
        message['Subject'] = 'Verify Your Email - Unilorin eHospital'
        
        # HTML content
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .logo {{ text-align: center; margin-bottom: 20px; color: #1a5276; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #1a5276; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='logo'>
                    <h2>University of Ilorin eHospital</h2>
                </div>
                
                <h3>Verify Your Email Address</h3>
                
                <p>Hello <strong>{user_name}</strong>,</p>
                
                <p>Thank you for registering with University of Ilorin eHospital. To complete your registration, please verify your email address by clicking the button below:</p>
                
                <div style='text-align: center;'>
                    <a href='{verification_link}' class='button'>Verify Email Address</a>
                </div>
                
                <p>Or copy and paste this link in your browser:</p>
                <p style='word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 12px;'>{verification_link}</p>
                
                <p>This verification link will expire in 24 hours.</p>
                
                <p>If you didn't create an account with Unilorin eHospital, please ignore this email.</p>
                
                <div class='footer'>
                    <p>&copy; 2026 University of Ilorin eHospital. All rights reserved.</p>
                    <p>University of Ilorin, Health City</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        message.attach(MimeText(html, 'html'))
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(message)
        
        return True
        
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return False
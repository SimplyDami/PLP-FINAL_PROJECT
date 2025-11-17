from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import secrets

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('student', 'staff', 'doctor'), nullable=False)
    id_number = db.Column(db.String(50), unique=True, nullable=False)
    faculty = db.Column(db.String(255))
    department = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    nin = db.Column(db.String(20))
    gender = db.Column(db.Enum('male', 'female', 'other'))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.Text)
    
    # Email verification
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100))
    token_expires = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    medical_record = db.relationship('MedicalRecord', backref='user', uselist=False)
    appointments = db.relationship('Appointment', backref='user')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_verification_token(self):
        self.verification_token = secrets.token_urlsafe(32)
        self.token_expires = datetime.utcnow() + timedelta(hours=24)
        return self.verification_token
    
    def is_token_valid(self):
        return self.verification_token and self.token_expires > datetime.utcnow()

class Doctor(db.Model):
    __tablename__ = 'doctors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    staff_number = db.Column(db.String(50), unique=True)
    specialization = db.Column(db.String(255))
    license_number = db.Column(db.String(100))
    consultation_fee = db.Column(db.Numeric(10, 2), default=0.0)
    is_available = db.Column(db.Boolean, default=True)
    
    # Relationships
    user = db.relationship('User', backref='doctor_profile')
    appointments = db.relationship('Appointment', backref='doctor')

class MedicalRecord(db.Model):
    __tablename__ = 'medical_records'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    blood_group = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'))
    genotype = db.Column(db.Enum('AA', 'AS', 'AC', 'SS', 'SC'))
    allergies = db.Column(db.Text)
    medical_conditions = db.Column(db.Text)
    emergency_contact_name = db.Column(db.String(255))
    emergency_contact_phone = db.Column(db.String(20))
    emergency_relationship = db.Column(db.String(100))
    next_of_kin = db.Column(db.String(255))
    next_of_kin_phone = db.Column(db.String(20))
    next_of_kin_address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('pending', 'confirmed', 'cancelled', 'completed'), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
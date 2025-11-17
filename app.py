from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Doctor, MedicalRecord, Appointment
from utils.email_sender import send_verification_email
from config import Config
from datetime import datetime
import re

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'error'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Password validation
def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Get form data
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        role = request.form.get('role')
        id_number = request.form.get('id_number')
        faculty = request.form.get('faculty')
        department = request.form.get('department')
        phone = request.form.get('phone')
        nin = request.form.get('nin')
        gender = request.form.get('gender')
        date_of_birth = request.form.get('date_of_birth')
        address = request.form.get('address')
        
        # Validation
        if not all([full_name, email, password, role, id_number]):
            flash('All fields are required', 'error')
            return render_template('signup.html')
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('signup.html')
        
        is_valid, message = validate_password(password)
        if not is_valid:
            flash(message, 'error')
            return render_template('signup.html')
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return render_template('signup.html')
        
        if User.query.filter_by(id_number=id_number).first():
            flash('ID number already registered', 'error')
            return render_template('signup.html')
        
        # Create user
        try:
            user = User(
                full_name=full_name,
                email=email,
                role=role,
                id_number=id_number,
                faculty=faculty,
                department=department,
                phone=phone,
                nin=nin,
                gender=gender,
                date_of_birth=datetime.strptime(date_of_birth, '%Y-%m-%d').date() if date_of_birth else None,
                address=address
            )
            user.set_password(password)
            user.generate_verification_token()
            
            db.session.add(user)
            db.session.commit()
            
            # Send verification email
            if send_verification_email(user.email, user.full_name, user.verification_token):
                flash('Registration successful! Please check your email for verification link.', 'success')
            else:
                flash('Registration successful but verification email failed to send. Please contact support.', 'warning')
            
            return redirect(url_for('login'))
            
        except Exception as e:
            db.session.rollback()
            flash('Registration failed. Please try again.', 'error')
            return render_template('signup.html')
    
    return render_template('signup.html')

@app.route('/verify-email/<token>')
def verify_email(token):
    user = User.query.filter_by(verification_token=token).first()
    
    if user and user.is_token_valid():
        user.is_verified = True
        user.verification_token = None
        user.token_expires = None
        db.session.commit()
        
        flash('Email verified successfully! You can now login.', 'success')
        return redirect(url_for('login'))
    else:
        flash('Invalid or expired verification token.', 'error')
        return redirect(url_for('signup'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        id_number = request.form.get('id_number')
        password = request.form.get('password')
        role = request.form.get('role', 'patient')
        
        user = User.query.filter_by(id_number=id_number).first()
        
        if user and user.check_password(password):
            if not user.is_verified:
                flash('Please verify your email address before logging in.', 'error')
                return render_template('login.html')
            
            login_user(user)
            flash('Login successful!', 'success')
            
            if user.role == 'doctor':
                return redirect(url_for('doctor_dashboard'))
            else:
                return redirect(url_for('dashboard'))
        else:
            flash('Invalid ID number or password', 'error')
    
    return render_template('login.html')

@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.role == 'doctor':
        return redirect(url_for('doctor_dashboard'))
    return render_template('dashboard.html', user=current_user)

@app.route('/doctor-dashboard')
@login_required
def doctor_dashboard():
    if current_user.role != 'doctor':
        flash('Access denied', 'error')
        return redirect(url_for('dashboard'))
    return render_template('doctor-dashboard.html', user=current_user)

@app.route('/medical-form', methods=['GET', 'POST'])
@login_required
def medical_form():
    if request.method == 'POST':
        # Process medical form
        medical_record = MedicalRecord(
            user_id=current_user.id,
            blood_group=request.form.get('blood_group'),
            genotype=request.form.get('genotype'),
            allergies=request.form.get('allergies'),
            medical_conditions=request.form.get('conditions'),
            emergency_contact_name=request.form.get('emergency_name'),
            emergency_contact_phone=request.form.get('emergency_phone'),
            emergency_relationship=request.form.get('emergency_relationship'),
            next_of_kin=request.form.get('next_of_kin'),
            next_of_kin_phone=request.form.get('next_of_kin_phone'),
            next_of_kin_address=request.form.get('next_of_kin_address')
        )
        
        db.session.add(medical_record)
        db.session.commit()
        
        flash('Medical information saved successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('medical-form.html')

@app.route('/appointment', methods=['GET', 'POST'])
@login_required
def appointment():
    if request.method == 'POST':
        # Process appointment booking
        appointment = Appointment(
            user_id=current_user.id,
            doctor_id=request.form.get('doctor_id'),
            appointment_date=datetime.strptime(request.form.get('appointment_date'), '%Y-%m-%d').date(),
            appointment_time=datetime.strptime(request.form.get('appointment_time'), '%H:%M').time(),
            reason=request.form.get('reason')
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        flash('Appointment booked successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    doctors = Doctor.query.filter_by(is_available=True).all()
    return render_template('appointment.html', doctors=doctors)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('index'))

# API Routes
@app.route('/api/doctors')
@login_required
def api_doctors():
    doctors = Doctor.query.filter_by(is_available=True).all()
    doctors_data = []
    for doctor in doctors:
        doctors_data.append({
            'id': doctor.id,
            'name': doctor.user.full_name,
            'specialization': doctor.specialization,
            'consultation_fee': float(doctor.consultation_fee) if doctor.consultation_fee else 0.0
        })
    return jsonify(doctors_data)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
// Appointment JavaScript

document.addEventListener('DOMContentLoaded', function () {
    let selectedDoctor = null;
    let consultationFee = 0;

    // Doctor selection
    const doctorButtons = document.querySelectorAll('.select-doctor');
    const selectedDoctorInput = document.getElementById('selected-doctor');
    const consultationFeeInput = document.getElementById('consultation-fee');
    const proceedPaymentBtn = document.getElementById('proceed-payment');

    doctorButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            doctorButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to selected button
            this.classList.add('active');

            // Get doctor details
            const doctorName = this.closest('.doctor-card').querySelector('h3').textContent;
            selectedDoctor = this.getAttribute('data-doctor');
            consultationFee = this.getAttribute('data-fee');

            // Update form fields
            selectedDoctorInput.value = doctorName;
            consultationFeeInput.value = `₦${parseInt(consultationFee).toLocaleString()}`;

            // Enable proceed button
            proceedPaymentBtn.disabled = false;
        });
    });

    // Appointment form submission
    const appointmentForm = document.getElementById('appointment-booking-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!selectedDoctor) {
                showAlert('Please select a doctor first', 'error');
                return;
            }

            const appointmentDate = document.getElementById('appointment-date').value;
            const appointmentTime = document.getElementById('appointment-time').value;
            const appointmentReason = document.getElementById('appointment-reason').value;
            const symptomsDuration = document.getElementById('symptoms-duration').value;
            const urgency = document.querySelector('input[name="urgency"]:checked').value;

            if (!appointmentDate || !appointmentTime || !appointmentReason) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }

            // Store appointment data
            const appointmentData = {
                doctor: selectedDoctor,
                doctorName: selectedDoctorInput.value,
                date: appointmentDate,
                time: appointmentTime,
                reason: appointmentReason,
                symptomsDuration: symptomsDuration,
                urgency: urgency,
                fee: consultationFee
            };

            sessionStorage.setItem('appointmentData', JSON.stringify(appointmentData));

            // Redirect to payment page
            window.location.href = 'payment.html';
        });
    }

    // Set minimum date to today
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }
});
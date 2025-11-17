// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Navigation between dashboard sections
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links and sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            dashboardSections.forEach(s => s.classList.add('hidden'));

            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });

    // Quick actions navigation
    const quickActionButtons = document.querySelectorAll('.quick-actions button');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function () {
            const section = this.getAttribute('data-section');

            // Update sidebar and show section
            sidebarLinks.forEach(l => l.classList.remove('active'));
            dashboardSections.forEach(s => s.classList.add('hidden'));

            document.querySelector(`[data-section="${section}"]`).classList.add('active');
            document.getElementById(`${section}-section`).classList.remove('hidden');
        });
    });

    // Load user data
    loadUserData();

    // Load appointments
    loadAppointments();

    // Load medical records
    loadMedicalRecords();

    // Load messages
    loadMessages();

    // Book appointment form
    const bookAppointmentForm = document.getElementById('book-appointment-form');
    if (bookAppointmentForm) {
        bookAppointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;
            const department = document.getElementById('appointment-department').value;
            const reason = document.getElementById('appointment-reason').value;

            if (!date || !time || !department || !reason) {
                showAlert('Please fill in all appointment details', 'error');
                return;
            }

            // Store appointment data temporarily
            sessionStorage.setItem('pendingAppointment', JSON.stringify({
                date,
                time,
                department,
                reason
            }));

            // Redirect to payment page
            window.location.href = 'payment.html';
        });
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

function loadUserData() {
    // Simulate loading user data
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = 'John Doe'; // This would come from backend
    }

    // Load profile information
    const profileInfo = document.getElementById('profile-info');
    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="profile-detail">
                <strong>Full Name:</strong> John Doe
            </div>
            <div class="profile-detail">
                <strong>Matric Number:</strong> UIL/2021/12345
            </div>
            <div class="profile-detail">
                <strong>Faculty:</strong> Engineering and Technology
            </div>
            <div class="profile-detail">
                <strong>Department:</strong> Computer Engineering
            </div>
            <div class="profile-detail">
                <strong>Email:</strong> john.doe@student.unilorin.edu.ng
            </div>
            <div class="profile-detail">
                <strong>Phone:</strong> +234 801 234 5678
            </div>
            <div class="profile-detail">
                <strong>Blood Group:</strong> O+
            </div>
            <div class="profile-detail">
                <strong>Genotype:</strong> AA
            </div>
        `;
    }
}

function loadAppointments() {
    // Simulate loading appointments
    const appointmentsList = document.getElementById('appointments-list');
    const upcomingAppointments = document.getElementById('upcoming-appointments');

    if (appointmentsList) {
        appointmentsList.innerHTML = `
            <div class="appointment-item">
                <p><strong>Date:</strong> December 15, 2024</p>
                <p><strong>Time:</strong> 10:00 AM</p>
                <p><strong>Department:</strong> General Medicine</p>
                <p><strong>Doctor:</strong> Dr. Adebayo</p>
                <p><strong>Status:</strong> <span class="status-confirmed">Confirmed</span></p>
                <div class="appointment-actions">
                    <button class="btn btn-outline btn-sm">Reschedule</button>
                    <button class="btn btn-danger btn-sm">Cancel</button>
                </div>
            </div>
        `;
    }

    if (upcomingAppointments) {
        upcomingAppointments.innerHTML = `
            <p><strong>Next Appointment:</strong> December 15, 2024 at 10:00 AM</p>
            <p><strong>With:</strong> Dr. Adebayo (General Medicine)</p>
        `;
    }
}

function loadMedicalRecords() {
    // Simulate loading medical records
    const medicalRecordsList = document.getElementById('medical-records-list');

    if (medicalRecordsList) {
        medicalRecordsList.innerHTML = `
            <div class="record-item">
                <h4>Medical History</h4>
                <p><strong>Last Updated:</strong> November 20, 2024</p>
                <p><strong>Allergies:</strong> None</p>
                <p><strong>Conditions:</strong> None</p>
                <button class="btn btn-outline btn-sm">View Full History</button>
            </div>
            <div class="record-item mt-1">
                <h4>Recent Visits</h4>
                <p><strong>October 15, 2024:</strong> Routine Checkup - All normal</p>
                <p><strong>August 10, 2024:</strong> Vaccination - Completed</p>
            </div>
        `;
    }
}

function loadMessages() {
    // Simulate loading messages
    const messagesList = document.getElementById('messages-list');
    const unreadMessages = document.getElementById('unread-messages');

    if (messagesList) {
        messagesList.innerHTML = `
            <div class="message-item">
                <p><strong>From:</strong> Dr. Adebayo</p>
                <p><strong>Date:</strong> December 1, 2024</p>
                <p><strong>Subject:</strong> Appointment Reminder</p>
                <p>Your appointment is scheduled for December 15, 2024 at 10:00 AM. Please arrive 15 minutes early.</p>
            </div>
            <div class="message-item mt-1">
                <p><strong>From:</strong> eHospital System</p>
                <p><strong>Date:</strong> November 25, 2024</p>
                <p><strong>Subject:</strong> Medical Records Updated</p>
                <p>Your medical records have been updated after your recent visit.</p>
            </div>
        `;
    }

    if (unreadMessages) {
        unreadMessages.innerHTML = '<p>2 unread messages</p>';
    }
}
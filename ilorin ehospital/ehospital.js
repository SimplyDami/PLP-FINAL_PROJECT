// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });

    // Show the selected page
    document.getElementById(pageId).classList.add('active-page');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Dashboard Tab Navigation
function showDashboardTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    // Show the selected tab
    document.getElementById(`${tabId}-tab`).classList.add('active-tab');
}

// Admin Tab Navigation
function showAdminTab(tabId) {
    // Remove active class from all buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    event.target.classList.add('active');

    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    // Show the selected tab
    document.getElementById(`${tabId}-tab`).classList.add('active-tab');
}

// Form Submissions
document.addEventListener('DOMContentLoaded', function () {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Login functionality would be implemented here. Redirecting to dashboard.');
            showPage('dashboard');
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Sign up functionality would be implemented here. Redirecting to medical form.');
            showPage('medical-form');
        });
    }

    // Medical Form
    const medicalForm = document.getElementById('medical-form-form');
    if (medicalForm) {
        medicalForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Medical form submission would be implemented here. Redirecting to dashboard.');
            showPage('dashboard');
        });
    }

    // Appointment Form
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Appointment booking would be implemented here.');

            // Add the new appointment to the list (for demo purposes)
            const appointmentList = document.querySelector('.appointment-list');
            const newAppointment = document.createElement('div');
            newAppointment.className = 'appointment-card';
            newAppointment.innerHTML = `
                <div class="appointment-info">
                    <h4>${document.getElementById('appointment-department').options[document.getElementById('appointment-department').selectedIndex].text} Consultation</h4>
                    <p><i class="far fa-calendar"></i> ${document.getElementById('appointment-date').value}</p>
                    <p><i class="far fa-clock"></i> ${document.getElementById('appointment-time').value}</p>
                    <p><i class="fas fa-stethoscope"></i> Dr. Unknown</p>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-accent">Reschedule</button>
                    <button class="btn btn-danger">Cancel</button>
                </div>
            `;

            appointmentList.prepend(newAppointment);

            // Update appointment count
            const appointmentCount = document.getElementById('appointment-count');
            appointmentCount.textContent = parseInt(appointmentCount.textContent) + 1;

            // Reset form
            appointmentForm.reset();
        });
    }
});

// Demo data for user profile
const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    bloodGroup: 'A+',
    genotype: 'AA'
};

// Update user profile information
function updateUserProfile() {
    document.getElementById('user-greeting').textContent = `Welcome, ${userData.name}`;
    document.getElementById('dashboard-greeting').textContent = `Welcome back, ${userData.name}!`;
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-phone').textContent = userData.phone;
    document.getElementById('profile-blood').textContent = userData.bloodGroup;
    document.getElementById('profile-genotype').textContent = userData.genotype;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    updateUserProfile();

    // Set current date as minimum for appointment date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        dateInput.min = today;
    }
});
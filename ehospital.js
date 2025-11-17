// ============================
// PAGE NAVIGATION
// ============================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });
    document.getElementById(pageId).classList.add('active-page');
    window.scrollTo(0, 0);
}

// ============================
// DASHBOARD TAB NAVIGATION
// ============================
function showDashboardTab(tabId) {
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active-tab');
}

// ============================
// ADMIN TAB NAVIGATION
// ============================
function showAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active-tab');
}

// ============================
// FORM SUBMISSIONS
// ============================
document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------
    // LOGIN FORM
    // ------------------------------
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Login successful!");
                    showPage('dashboard');
                } else {
                    alert(data.message || "Login failed. Please check your credentials.");
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Something went wrong connecting to the server.");
            });
        });
    }

    // ------------------------------
    // SIGNUP FORM
    // ------------------------------
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            fetch("http://localhost:5000/api/auth/register", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Signup successful!");
                    showPage('medical-form');
                } else {
                    alert(data.message || "Signup failed.");
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Could not reach backend server.");
            });
        });
    }

    // ------------------------------
    // MEDICAL FORM (optional backend connection)
    // ------------------------------
    const medicalForm = document.getElementById('medical-form-form');
    if (medicalForm) {
        medicalForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Example: you could collect medical data here
            const bloodGroup = document.getElementById('blood-group')?.value;
            const genotype = document.getElementById('genotype')?.value;

            fetch("http://localhost:5000/api/patients/medical-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bloodGroup, genotype })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Medical form submitted successfully!");
                    showPage('dashboard');
                } else {
                    alert(data.message || "Submission failed.");
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Error connecting to backend.");
            });
        });
    }

    // ------------------------------
    // APPOINTMENT FORM
    // ------------------------------
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const department = document.getElementById('appointment-department').value;
            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;

            fetch("http://localhost:5000/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ department, date, time })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Appointment booked successfully!");
                } else {
                    alert(data.message || "Booking failed.");
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Error connecting to backend.");
            });

            // Still update the UI
            const appointmentList = document.querySelector('.appointment-list');
            const newAppointment = document.createElement('div');
            newAppointment.className = 'appointment-card';
            newAppointment.innerHTML = `
                <div class="appointment-info">
                    <h4>${document.getElementById('appointment-department').options[document.getElementById('appointment-department').selectedIndex].text} Consultation</h4>
                    <p><i class="far fa-calendar"></i> ${date}</p>
                    <p><i class="far fa-clock"></i> ${time}</p>
                    <p><i class="fas fa-stethoscope"></i> Dr. Unknown</p>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-accent">Reschedule</button>
                    <button class="btn btn-danger">Cancel</button>
                </div>
            `;
            appointmentList.prepend(newAppointment);

            const appointmentCount = document.getElementById('appointment-count');
            appointmentCount.textContent = parseInt(appointmentCount.textContent) + 1;

            appointmentForm.reset();
        });
    }
});

// ============================
// DEMO PROFILE DATA
// ============================
const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    bloodGroup: 'A+',
    genotype: 'AA'
};

function updateUserProfile() {
    document.getElementById('user-greeting').textContent = `Welcome, ${userData.name}`;
    document.getElementById('dashboard-greeting').textContent = `Welcome back, ${userData.name}!`;
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-phone').textContent = userData.phone;
    document.getElementById('profile-blood').textContent = userData.bloodGroup;
    document.getElementById('profile-genotype').textContent = userData.genotype;
}

// ============================
// INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', function () {
    updateUserProfile();

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) dateInput.min = today;
});

// Email Verification JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Get email from URL parameters or session storage
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const token = urlParams.get('token');
    const email = urlParams.get('email') || sessionStorage.getItem('pendingVerificationEmail');

    // Display user's email
    if (email && document.getElementById('user-email')) {
        document.getElementById('user-email').textContent = email;
    }

    // Handle different verification scenarios
    if (action === 'verify' && token) {
        verifyEmailToken(token);
    } else if (action === 'success') {
        showVerificationSuccess();
    } else if (action === 'error') {
        showVerificationError();
    }

    // Resend verification email
    const resendBtn = document.getElementById('resend-verification');
    if (resendBtn) {
        resendBtn.addEventListener('click', function () {
            resendVerificationEmail(email);
        });
    }

    // Change email address
    const changeEmailBtn = document.getElementById('change-email');
    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', function () {
            window.location.href = 'signup.html';
        });
    }

    // Request new verification
    const requestNewBtn = document.getElementById('request-new-verification');
    if (requestNewBtn) {
        requestNewBtn.addEventListener('click', function () {
            resendVerificationEmail(email);
        });
    }
});

function verifyEmailToken(token) {
    // Simulate API call to verify email token
    showAlert('Verifying your email...', 'success');

    setTimeout(() => {
        // In a real application, this would make an API call to your backend
        // For demo purposes, we'll simulate successful verification 80% of the time
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
            showVerificationSuccess();

            // Clear pending verification
            sessionStorage.removeItem('pendingVerificationEmail');
            sessionStorage.removeItem('pendingVerificationData');
        } else {
            showVerificationError();
        }
    }, 2000);
}

function showVerificationSuccess() {
    document.getElementById('verification-pending').classList.add('hidden');
    document.getElementById('verification-error').classList.add('hidden');
    document.getElementById('verification-success').classList.remove('hidden');
}

function showVerificationError() {
    document.getElementById('verification-pending').classList.add('hidden');
    document.getElementById('verification-success').classList.add('hidden');
    document.getElementById('verification-error').classList.remove('hidden');
}

function resendVerificationEmail(email) {
    if (!email) {
        showAlert('No email address found. Please sign up again.', 'error');
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 2000);
        return;
    }

    const resendBtn = document.getElementById('resend-verification');
    const originalText = resendBtn.textContent;

    // Disable button and show loading
    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    // Simulate API call to resend verification email
    setTimeout(() => {
        // In a real application, this would call your backend API
        console.log(`Resending verification email to: ${email}`);

        // Simulate email sending
        showAlert('Verification email sent successfully! Please check your inbox.', 'success');

        // Re-enable button after 30 seconds
        setTimeout(() => {
            resendBtn.disabled = false;
            resendBtn.textContent = originalText;
        }, 30000);

        // Update button to show cooldown
        let countdown = 30;
        const countdownInterval = setInterval(() => {
            resendBtn.textContent = `Resend available in ${countdown}s`;
            countdown--;

            if (countdown < 0) {
                clearInterval(countdownInterval);
                resendBtn.disabled = false;
                resendBtn.textContent = 'Resend Verification Email';
            }
        }, 1000);
    }, 1500);
}
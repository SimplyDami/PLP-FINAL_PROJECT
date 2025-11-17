// Confirm Email JavaScript - WORKING VERSION

document.addEventListener('DOMContentLoaded', function () {
    // Get token and email from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    // Display email being confirmed
    if (email && document.getElementById('confirming-email')) {
        document.getElementById('confirming-email').textContent = email;
    }

    if (token && email) {
        processEmailConfirmation(token, email);
    } else {
        showConfirmationError('Invalid confirmation link. Missing required parameters.');
    }
});

function processEmailConfirmation(token, email) {
    // Update status
    const statusElement = document.getElementById('confirmation-status');
    if (statusElement) {
        statusElement.textContent = 'Validating token...';
    }

    setTimeout(() => {
        // For demo purposes, accept any token that starts with 'token_'
        if (token && token.startsWith('token_')) {
            if (statusElement) {
                statusElement.textContent = 'Token validated successfully!';
            }

            setTimeout(() => {
                // Mark email as confirmed
                const confirmedEmails = JSON.parse(localStorage.getItem('confirmedEmails') || '[]');
                if (!confirmedEmails.includes(email)) {
                    confirmedEmails.push(email);
                    localStorage.setItem('confirmedEmails', JSON.stringify(confirmedEmails));
                }

                // Store confirmation timestamp
                localStorage.setItem(`confirmed_${email}`, new Date().toISOString());

                // Clean up any stored confirmation data
                localStorage.removeItem(`confirmation_${token}`);
                localStorage.removeItem(`token_expiry_${token}`);

                if (statusElement) {
                    statusElement.textContent = 'Email confirmed successfully!';
                    statusElement.style.color = '#2ecc71';
                    statusElement.style.fontWeight = 'bold';
                }

                setTimeout(() => {
                    showConfirmationSuccess();
                }, 1000);

                console.log('✅ Email confirmed:', email);
                console.log('✅ Confirmed emails:', confirmedEmails);

            }, 1000);
        } else {
            if (statusElement) {
                statusElement.textContent = 'Invalid token!';
                statusElement.style.color = '#e74c3c';
                statusElement.style.fontWeight = 'bold';
            }
            showConfirmationError('Invalid or expired confirmation token.');
        }
    }, 2000);
}

function showConfirmationSuccess() {
    document.getElementById('processing-confirmation').classList.add('hidden');
    document.getElementById('confirmation-error').classList.add('hidden');
    document.getElementById('confirmation-success').classList.remove('hidden');
}

function showConfirmationError(message) {
    document.getElementById('processing-confirmation').classList.add('hidden');
    document.getElementById('confirmation-success').classList.add('hidden');

    const errorSection = document.getElementById('confirmation-error');
    if (message) {
        document.getElementById('error-message').textContent = message;
    }
    errorSection.classList.remove('hidden');
}
// Payment JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Load appointment details
    loadAppointmentDetails();

    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardDetails = document.getElementById('card-details');
    const bankDetails = document.getElementById('bank-details');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function () {
            // Hide all payment details
            cardDetails.classList.add('hidden');
            bankDetails.classList.add('hidden');

            // Show selected payment method details
            if (this.value === 'card') {
                cardDetails.classList.remove('hidden');
            } else if (this.value === 'bank-transfer') {
                bankDetails.classList.remove('hidden');
                generatePaymentReference();
            }
        });
    });

    // Payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;

            // Validate based on payment method
            if (selectedMethod === 'card') {
                const cardNumber = document.getElementById('card-number').value;
                const expiryDate = document.getElementById('expiry-date').value;
                const cvv = document.getElementById('cvv').value;
                const cardName = document.getElementById('card-name').value;

                if (!cardNumber || !expiryDate || !cvv || !cardName) {
                    showAlert('Please fill in all card details', 'error');
                    return;
                }

                if (!validateCardNumber(cardNumber)) {
                    showAlert('Please enter a valid card number', 'error');
                    return;
                }
            }

            // Simulate payment processing
            processPayment(selectedMethod);
        });
    }
});

function loadAppointmentDetails() {
    const appointmentData = JSON.parse(sessionStorage.getItem('appointmentData'));
    const appointmentDetails = document.getElementById('appointment-details');
    const summaryFee = document.getElementById('summary-fee');
    const summaryTotal = document.getElementById('summary-total');

    if (appointmentData && appointmentDetails) {
        appointmentDetails.innerHTML = `
            <div class="appointment-detail">
                <strong>Doctor:</strong> ${appointmentData.doctorName}
            </div>
            <div class="appointment-detail">
                <strong>Date:</strong> ${formatDate(appointmentData.date)}
            </div>
            <div class="appointment-detail">
                <strong>Time:</strong> ${formatTime(appointmentData.time)}
            </div>
            <div class="appointment-detail">
                <strong>Reason:</strong> ${appointmentData.reason}
            </div>
            <div class="appointment-detail">
                <strong>Consultation Fee:</strong> ₦${parseInt(appointmentData.fee).toLocaleString()}
            </div>
        `;

        // Update payment summary
        const fee = parseInt(appointmentData.fee);
        const total = fee + 100; // Service charge

        summaryFee.textContent = `₦${fee.toLocaleString()}`;
        summaryTotal.textContent = `₦${total.toLocaleString()}`;
    } else {
        showAlert('No appointment data found. Please book an appointment first.', 'error');
        setTimeout(() => {
            window.location.href = 'appointment.html';
        }, 2000);
    }
}

function generatePaymentReference() {
    const reference = 'UNILORIN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    document.getElementById('payment-reference').textContent = reference;
}

function validateCardNumber(cardNumber) {
    // Simple card number validation (Luhn algorithm would be used in production)
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{13,19}$/.test(cleaned);
}

function processPayment(method) {
    const makePaymentBtn = document.getElementById('make-payment');

    // Disable button and show processing
    makePaymentBtn.disabled = true;
    makePaymentBtn.textContent = 'Processing Payment...';

    // Simulate API call to payment gateway
    setTimeout(() => {
        // Simulate successful payment
        showAlert('Payment successful! Your appointment has been confirmed.', 'success');

        // Store payment confirmation
        const appointmentData = JSON.parse(sessionStorage.getItem('appointmentData'));
        const paymentData = {
            ...appointmentData,
            paymentMethod: method,
            paymentStatus: 'completed',
            paymentDate: new Date().toISOString(),
            appointmentId: 'APT-' + Math.random().toString(36).substr(2, 8).toUpperCase()
        };

        sessionStorage.setItem('paymentData', JSON.stringify(paymentData));

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 3000);
    }, 2000);
}